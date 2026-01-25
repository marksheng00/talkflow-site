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

        return new Promise((resolve) => {
            client.TextTranslate(params, (err, response) => {
                if (err) {
                    console.error("Tencent Cloud Translation Error:", err);
                    const errMsg = typeof err === 'string' ? err : ((err as any).message || "Tencent API Error");
                    resolve(NextResponse.json({ error: errMsg }, { status: 500 }));
                    return;
                }
                resolve(NextResponse.json({ translatedText: response.TargetText }));
            });
        });

    } catch (error: any) {
        console.error("Translation handler error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
