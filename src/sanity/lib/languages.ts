export const LANGUAGES = [
    { id: 'en', title: 'English', isDefault: true },
    { id: 'zh', title: 'Simplified Chinese' },
    { id: 'zh-Hant', title: 'Traditional Chinese' },
    { id: 'es', title: 'Spanish' },
    { id: 'ko', title: 'Korean' },
    { id: 'ja', title: 'Japanese' },
]

export const BASE_LANGUAGE = LANGUAGES.find(l => l.isDefault)!
