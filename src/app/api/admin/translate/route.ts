import { NextRequest, NextResponse } from 'next/server';
import * as tencentcloud from "tencentcloud-sdk-nodejs-tmt";

// Map Sanity language codes to Tencent TMT codes
const LANG_MAP: Record<string, string> = {
    'en': 'en',
    'zh': 'zh',      // Simplified
    'zh-hant': 'zh-TW', // Traditional
    'zh-tw': 'zh-TW',
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
        const body = await req.json();
        const { texts, text, target, to, source, from } = body;

        // Support both batch (texts/target/source) and single (text/to/from) formats
        const isBatch = Array.isArray(texts);
        const finalTexts = isBatch ? texts : [text];
        const finalTarget = (target || to || '').toLowerCase();
        const finalSource = (source || from || '').toLowerCase();

        if (!finalTexts || !Array.isArray(finalTexts) || finalTexts.length === 0 || (finalTexts.length === 1 && !finalTexts[0])) {
            return NextResponse.json({ error: 'Missing or empty "texts" or "text"' }, { status: 400 });
        }

        if (!finalTarget) {
            return NextResponse.json({ error: 'Missing "target" or "to" language' }, { status: 400 });
        }

        const tencentTarget = LANG_MAP[finalTarget] || finalTarget;
        const tencentSource = finalSource ? (LANG_MAP[finalSource] || finalSource) : 'auto';

        // Tencent limit: 5 requests per second usually. Batch limit depends.
        // We'll trust the input is reasonably sized (title, excerpt, body paragraphs).

        // We need to filter out empty strings to avoid errors, but keep indices aligned
        const nonEmptyItems = finalTexts.map((t, i) => ({ text: t, index: i })).filter(item => item && item.text && item.text.trim().length > 0);

        if (nonEmptyItems.length === 0) {
            return isBatch 
                ? NextResponse.json({ translatedTexts: finalTexts }) 
                : NextResponse.json({ translatedText: text });
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
        const finalTranslations = [...finalTexts];
        nonEmptyItems.forEach((item, idx) => {
            finalTranslations[item.index] = result.TargetTextList![idx];
        });

        if (isBatch) {
            return NextResponse.json({ translatedTexts: finalTranslations });
        } else {
            return NextResponse.json({ translatedText: finalTranslations[0] });
        }

    } catch (error: any) {
        console.error('Translation API Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
