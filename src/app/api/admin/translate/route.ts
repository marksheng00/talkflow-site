import { NextResponse } from "next/server";
import * as tencentcloud from "tencentcloud-sdk-nodejs-tmt";

const TmtClient = tencentcloud.tmt.v20180321.Client;

// Initialize Client only if keys are present
const clientConfig = {
    credential: {
        secretId: process.env.TENCENT_SECRET_ID || "",
        secretKey: process.env.TENCENT_SECRET_KEY || "",
    },
    region: "ap-guangzhou",
    profile: {
        httpProfile: {
            endpoint: "tmt.tencentcloudapi.com",
        },
    },
};

const client = new TmtClient(clientConfig);

export async function POST(req: Request) {
    try {
        const { text, from, to } = await req.json();

        if (!text || !to) {
            return NextResponse.json({ error: "Missing text or target language" }, { status: 400 });
        }

        if (!process.env.TENCENT_SECRET_ID || !process.env.TENCENT_SECRET_KEY) {
            return NextResponse.json({ error: "Server missing Tencent Cloud credentials" }, { status: 500 });
        }

        // Locale mapping for Tencent Cloud TMT
        // Reference: https://cloud.tencent.com/document/product/551/15619
        const localeMapping: Record<string, string> = {
            'zh': 'zh',      // Simplified Chinese
            'zh-Hant': 'zh-TW', // Traditional Chinese
            'en': 'en',
            'ja': 'ja',
            'ko': 'ko',
            'es': 'es'
        };

        const Target = localeMapping[to] || to;
        // Use 'auto' for English source to let Tencent's engine handle detection, which is often more robust
        const Source = from === 'en' ? 'auto' : (localeMapping[from] || 'auto');

        const params = {
            Source,
            Target,
            ProjectId: 0,
            SourceText: text,
        };

        // Wrap TMT callback in a promise helper
        const translateText = () => {
            return new Promise<{ TargetText?: string }>((resolve, reject) => {
                client.TextTranslate(params, (err, response) => {
                    if (err) {
                        const errMsg = (err as unknown as Error).message || String(err) || "Tencent API Error";
                        reject(new Error(errMsg));
                        return;
                    }
                    resolve(response);
                });
            });
        };

        try {
            const response = await translateText();
            return NextResponse.json({ translatedText: response.TargetText });
        } catch (apiError) {
            console.error("Tencent Cloud Translation Error:", apiError);
            return NextResponse.json({ error: (apiError as Error).message || "Translation failed" }, { status: 500 });
        }

    } catch (error) {
        console.error("Translation handler error:", error);
        return NextResponse.json({ error: (error as Error).message || "Internal server error" }, { status: 500 });
    }
}
