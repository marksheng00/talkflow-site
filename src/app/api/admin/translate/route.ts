import { NextRequest, NextResponse } from 'next/server';
import * as tencentcloud from "tencentcloud-sdk-nodejs-tmt";

// Map Sanity language codes to Tencent TMT codes
const LANG_MAP: Record<string, string> = {
    'en': 'en',
    'zh': 'zh',      // Simplified
    'zh-Hant': 'zh-TW', // Traditional
    'es': 'es',
    'ko': 'ko',
    'ja': 'ja',
};

const TmtClient = tencentcloud.tmt.v20180321.Client;

const clientConfig = {
    credential: {
        secretId: process.env.TENCENT_SECRET_ID,
        secretKey: process.env.TENCENT_SECRET_KEY,
    },
    region: "ap-shanghai",
    profile: {
        httpProfile: {
            endpoint: "tmt.tencentcloudapi.com",
        },
    },
};

const client = new TmtClient(clientConfig);

export async function POST(req: NextRequest) {
    try {
        const { texts, target, source } = await req.json();

        if (!texts || !Array.isArray(texts) || texts.length === 0) {
            return NextResponse.json({ error: 'Missing or empty "texts" array' }, { status: 400 });
        }

        if (!target) {
            return NextResponse.json({ error: 'Missing "target" language' }, { status: 400 });
        }

        const tencentTarget = LANG_MAP[target] || target;
        const tencentSource = source ? (LANG_MAP[source] || source) : 'auto';

        // Tencent limit: 5 requests per second usually. Batch limit depends.
        // We'll trust the input is reasonably sized (title, excerpt, body paragraphs).

        // We need to filter out empty strings to avoid errors, but keep indices aligned
        const nonEmptyItems = texts.map((t, i) => ({ text: t, index: i })).filter(item => item.text && item.text.trim().length > 0);

        if (nonEmptyItems.length === 0) {
            return NextResponse.json({ translatedTexts: texts }); // All empty
        }

        const payload = {
            Source: tencentSource,
            Target: tencentTarget,
            ProjectId: 0,
            SourceTextList: nonEmptyItems.map(item => item.text),
        };

        const result = await client.TextTranslateBatch(payload);

        if (!result.TargetTextList || result.TargetTextList.length !== nonEmptyItems.length) {
            throw new Error("Translation API returned mismatched results");
        }

        // Reconstruct the array
        const finalTranslations = [...texts];
        nonEmptyItems.forEach((item, idx) => {
            finalTranslations[item.index] = result.TargetTextList![idx];
        });

        return NextResponse.json({ translatedTexts: finalTranslations });

    } catch (error: any) {
        console.error('Translation API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
