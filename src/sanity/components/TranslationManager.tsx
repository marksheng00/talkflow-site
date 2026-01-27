import { Card, Stack, Text, Button, Flex, Box, Badge, Grid, useToast } from '@sanity/ui'
import { useCallback, useState, useEffect } from 'react'
import { useClient, useFormValue, set } from 'sanity'
import { LANGUAGES, BASE_LANGUAGE } from '../lib/languages'
import { TranslateIcon, EditIcon, CheckmarkCircleIcon, AddIcon, WarningOutlineIcon, RefreshIcon, SyncIcon } from '@sanity/icons'
import { useRouter } from 'sanity/router'

// Simple UUID generator
function generateUUID() {
    return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16));
}

export function TranslationManager(props: any) {
    const { value: translationId, onChange } = props
    const documentId = useFormValue(['_id']) as string
    const currentLanguage = useFormValue(['language']) as string
    const docTitle = useFormValue(['title']) as string

    // Use Sanity client to query siblings
    const client = useClient({ apiVersion: '2021-10-21' })
    const [translations, setTranslations] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    // Initialize translationId if missing
    useEffect(() => {
        if (!translationId && onChange) {
            // Automatically assign a translation ID if missing
            onChange(set(generateUUID()))
        }
    }, [translationId, onChange])

    const fetchTranslations = useCallback(async () => {
        if (!translationId) return
        setIsLoading(true)
        try {
            // Find all posts with this translationId (both drafts and published)
            // We use a query that gets ANY document with this translationId
            const query = `*[_type == "post" && translationId == $tid]{
                _id,
                language,
                title
            }`
            const result = await client.fetch(query, { tid: translationId })

            // Deduplicate: If we have draft and published, prefer draft
            // Simplified logic: Just keep one entry per language, prefer draft ID if exists
            const uniqueTranslations = result.reduce((acc: any[], curr: any) => {
                const existingIndex = acc.findIndex(item => item.language === curr.language);
                if (existingIndex >= 0) {
                    // If current is draft, replace existing
                    if (curr._id.startsWith('drafts.')) {
                        acc[existingIndex] = curr;
                    }
                } else {
                    acc.push(curr);
                }
                return acc;
            }, []);

            setTranslations(uniqueTranslations)
        } catch (err) {
            console.error("Error fetching translations:", err)
        } finally {
            setIsLoading(false)
        }
    }, [client, translationId])

    useEffect(() => {
        fetchTranslations()
    }, [fetchTranslations])

    const handleCreateTranslation = async (langId: string) => {
        if (!translationId) {
            toast.push({
                status: 'error',
                title: 'Missing Translation ID',
                description: 'Please wait for the Translation ID to be generated.'
            })
            return;
        }

        const existingTranslation = translations.find(t => t.language === langId);
        if (existingTranslation) {
            if (!window.confirm(`Are you sure you want to overwrite the existing ${langId.toUpperCase()} translation? This will replace current content with a new AI translation.`)) {
                return;
            }
        }

        setIsLoading(true);
        try {
            // 1. Fetch the FULL current document content to clone
            const draftId = documentId.startsWith('drafts.') ? documentId : `drafts.${documentId}`;
            const publishedId = documentId.replace('drafts.', '');

            const currentDoc = await client.fetch(`*[_id == $draftId || _id == $publishedId][0]`, {
                draftId,
                publishedId
            });

            if (!currentDoc) {
                toast.push({
                    status: 'warning',
                    title: 'Document Not Saved',
                    description: 'Please Ctrl+S (Save) this document first before translating.'
                })
                return;
            }

            // 2. Extract translatable content
            const extractTextNodes = (doc: any) => {
                const nodes: { path: any[], text: string }[] = [];

                // Fields to translate
                if (doc.title) nodes.push({ path: ['title'], text: doc.title });
                if (doc.excerpt) nodes.push({ path: ['excerpt'], text: doc.excerpt });
                if (doc.seo?.metaTitle) nodes.push({ path: ['seo', 'metaTitle'], text: doc.seo.metaTitle });
                if (doc.seo?.metaDescription) nodes.push({ path: ['seo', 'metaDescription'], text: doc.seo.metaDescription });

                // Body (Portable Text)
                if (Array.isArray(doc.body)) {
                    doc.body.forEach((block: any, blockIndex: number) => {
                        if (block._type === 'block' && Array.isArray(block.children)) {
                            block.children.forEach((span: any, spanIndex: number) => {
                                if (span._type === 'span' && typeof span.text === 'string' && span.text.trim()) {
                                    nodes.push({
                                        path: ['body', blockIndex, 'children', spanIndex, 'text'],
                                        text: span.text
                                    });
                                }
                            });
                        }
                    });
                }
                return nodes;
            };

            const nodesToTranslate = extractTextNodes(currentDoc);
            console.log(`[TranslationManager] Extracted ${nodesToTranslate.length} nodes from ${currentDoc._id}`);

            // 3. Call Translation API
            let translatedTexts: string[] = [];

            if (nodesToTranslate.length > 0) {
                toast.push({ status: 'info', title: 'Translating Content...', description: `Sending ${nodesToTranslate.length} blocks to AI.` });

                // Chunking (TMT limit is usually around 2000 chars or reasonable number of items)
                // We'll simplistic chunk by 50 items for safety
                const CHUNK_SIZE = 50;
                for (let i = 0; i < nodesToTranslate.length; i += CHUNK_SIZE) {
                    const chunk = nodesToTranslate.slice(i, i + CHUNK_SIZE);

                    const payload = {
                        texts: chunk.map(n => n.text),
                        target: langId,
                        source: currentLanguage || 'en'
                    };
                    console.log('[TranslationManager] Sending payload:', payload);

                    const response = await fetch('/api/admin/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const data = await response.json();
                    console.log('[TranslationManager] Received response:', data);

                    if (!response.ok) throw new Error(data.error || 'Translation API failed');

                    translatedTexts = translatedTexts.concat(data.translatedTexts);
                }
            }

            // 4. Reconstruct new document
            const newDoc = JSON.parse(JSON.stringify(currentDoc)); // Deep clone

            // Apply translations
            nodesToTranslate.forEach((node, index) => {
                const translatedText = translatedTexts[index];
                if (translatedText) {
                    // Navigate to path and set value
                    let current = newDoc;
                    for (let i = 0; i < node.path.length - 1; i++) {
                        current = current[node.path[i]];
                    }
                    current[node.path[node.path.length - 1]] = translatedText;
                }
            });

            // Set metadata
            // Reuse ID if exists, OR generate new
            let targetId = existingTranslation ? existingTranslation._id : `drafts.${generateUUID()}`;
            // Ensure targetId is a draft ID for safety when editing
            if (!targetId.startsWith('drafts.')) {
                // If the existing one is published, we want to create a draft OF it.
                targetId = `drafts.${targetId}`;
            }

            newDoc._id = targetId;
            newDoc.language = langId;
            newDoc.translationId = translationId;
            // Ensure title has a prefix if valid, but usually it's translated now
            // We append language code to slug to ensure uniqueness
            newDoc.slug = { current: `${currentDoc.slug?.current || 'untitled'}-${langId}` };

            delete newDoc._createdAt;
            delete newDoc._updatedAt;
            delete newDoc._rev;

            console.log("Creating/Updating translation:", newDoc);
            await client.createOrReplace(newDoc);

            toast.push({
                status: 'success',
                title: 'Translation Complete',
                description: `Updated ${langId.toUpperCase()} version.`
            })

            // 5. Update the list
            await fetchTranslations();

        } catch (err) {
            console.error('Failed to create translation', err);
            toast.push({
                status: 'error',
                title: 'Creation Failed',
                description: (err as Error).message
            })
        } finally {
            setIsLoading(false);
        }
    };

    const handleSyncFromMaster = async () => {
        if (!translationId || !currentLanguage) return;

        const masterLang = BASE_LANGUAGE.id;
        if (currentLanguage === masterLang) return; // Cannot sync master from master

        if (!window.confirm(`Are you sure you want to sync this ${currentLanguage.toUpperCase()} document from the ${masterLang.toUpperCase()} Master? Current content will be overwritten.`)) {
            return;
        }

        setIsLoading(true);
        try {
            // 1. Find the Master Document
            // We prioritize draft, then published
            const masterQuery = `*[_type == "post" && translationId == $tid && language == $ml]{_id}`;
            const masterResults = await client.fetch(masterQuery, { tid: translationId, ml: masterLang });

            if (!masterResults || masterResults.length === 0) {
                throw new Error("Master document not found. Please create the English version first.");
            }

            // Pick best master (prefer draft)
            const masterRef = masterResults.find((m: any) => m._id.startsWith('drafts.')) || masterResults[0];

            // Fetch full master content
            const masterId = masterRef._id.replace('drafts.', '');
            const masterDraftId = `drafts.${masterId}`;
            const masterDoc = await client.fetch(`*[_id == $d || _id == $p][0]`, { d: masterDraftId, p: masterId });

            if (!masterDoc) throw new Error("Could not fetch Master content.");

            // 2. Fetch Current Doc (Self)
            const currentDraftId = documentId.startsWith('drafts.') ? documentId : `drafts.${documentId}`;
            const currentPublishedId = documentId.replace('drafts.', '');
            const currentDoc = await client.fetch(`*[_id == $d || _id == $p][0]`, { d: currentDraftId, p: currentPublishedId });

            if (!currentDoc) throw new Error("Please save the current document first.");

            // A common function would be better, but we duplicate extraction/translation logic for safety/speed now
            const extractTextNodes = (doc: any) => {
                const nodes: { path: any[], text: string }[] = [];
                if (doc.title) nodes.push({ path: ['title'], text: doc.title });
                if (doc.excerpt) nodes.push({ path: ['excerpt'], text: doc.excerpt });
                if (doc.seo?.metaTitle) nodes.push({ path: ['seo', 'metaTitle'], text: doc.seo.metaTitle });
                if (doc.seo?.metaDescription) nodes.push({ path: ['seo', 'metaDescription'], text: doc.seo.metaDescription });
                if (Array.isArray(doc.body)) {
                    doc.body.forEach((block: any, blockIndex: number) => {
                        if (block._type === 'block' && Array.isArray(block.children)) {
                            block.children.forEach((span: any, spanIndex: number) => {
                                if (span._type === 'span' && typeof span.text === 'string' && span.text.trim()) {
                                    nodes.push({ path: ['body', blockIndex, 'children', spanIndex, 'text'], text: span.text });
                                }
                            });
                        }
                    });
                }
                return nodes;
            };

            const nodesToTranslate = extractTextNodes(masterDoc);
            console.log(`[SyncFromMaster] Extracted ${nodesToTranslate.length} nodes from Master (${masterDoc._id})`);

            // 3. Translate
            let translatedTexts: string[] = [];
            if (nodesToTranslate.length > 0) {
                toast.push({ status: 'info', title: 'Syncing from Master...', description: `Translating ${nodesToTranslate.length} blocks.` });

                const CHUNK_SIZE = 50;
                for (let i = 0; i < nodesToTranslate.length; i += CHUNK_SIZE) {
                    const chunk = nodesToTranslate.slice(i, i + CHUNK_SIZE);
                    const payload = {
                        texts: chunk.map(n => n.text),
                        target: currentLanguage,
                        source: masterLang
                    };

                    const response = await fetch('/api/admin/translate', {
                        method: 'POST',
                        body: JSON.stringify(payload)
                    });
                    if (!response.ok) throw new Error('Translation API failed');
                    const data = await response.json();
                    translatedTexts = translatedTexts.concat(data.translatedTexts);
                }
            }

            // 4. Overwrite Current Document with Master Structure + Translated Text

            // We clone MASTER structure to ensure images/structures match master
            const newDoc = JSON.parse(JSON.stringify(masterDoc));

            // Restore Current ID and Metadata
            newDoc._id = currentDoc._id.startsWith('drafts.') ? currentDoc._id : `drafts.${currentDoc._id}`;
            newDoc.language = currentLanguage;
            newDoc.translationId = translationId;
            newDoc.slug = currentDoc.slug; // Keep current slug!

            // Apply translated texts to the MASTER structure
            // NOTE: This assumes we want to mirror master's structure perfectly.
            nodesToTranslate.forEach((node, index) => {
                const translatedText = translatedTexts[index];
                if (translatedText) {
                    let current = newDoc;
                    for (let i = 0; i < node.path.length - 1; i++) {
                        current = current[node.path[i]];
                    }
                    current[node.path[node.path.length - 1]] = translatedText;
                }
            });

            delete newDoc._createdAt;
            delete newDoc._updatedAt;
            delete newDoc._rev;

            console.log("Overwriting current doc with synced content:", newDoc);
            await client.createOrReplace(newDoc);

            toast.push({ status: 'success', title: 'Sync Complete', description: 'Updated from Master Content.' });

            // Reload page to show changes? Sanity usually auto-reloads.

        } catch (err: any) {
            console.error(err);
            toast.push({ status: 'error', title: 'Sync Failed', description: err.message });
        } finally {
            setIsLoading(false);
        }
    };

    const router = useRouter()

    const navigateToDoc = useCallback((id: string) => {
        const finalId = id.replace('drafts.', '');
        // Use the router to navigate via intent
        router.navigateIntent('edit', { id: finalId, type: 'post' });
    }, [router]);


    return (
        <Card padding={4} radius={2} shadow={1} tone="transparent" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <Stack space={4}>
                <Flex justify="space-between" align="center">
                    <Box>
                        <Text weight="bold" size={2}>Translation Hub</Text>
                        <Text size={1} muted>Manage multi-language versions</Text>
                    </Box>
                    <Flex gap={2} align="center">
                        <Badge tone="primary">{currentLanguage?.toUpperCase() || 'EN'}</Badge>
                        <Button
                            icon={RefreshIcon}
                            fontSize={1}
                            mode="ghost"
                            onClick={fetchTranslations}
                            padding={2}
                            title="Refresh List"
                        />
                    </Flex>
                </Flex>

                {!translationId && (
                    <Card padding={3} tone="caution" radius={2} border>
                        <Flex align="center" gap={3}>
                            <WarningOutlineIcon />
                            <Box flex={1}>
                                <Text size={1} weight="semibold">Initializing Hub...</Text>
                                <Text size={1} muted>Generating Translation ID for synchronization.</Text>
                            </Box>
                        </Flex>
                    </Card>
                )}

                {/* Status Grid */}
                <Grid columns={[1, 2, 3]} gap={3}>
                    {LANGUAGES.map(lang => {
                        const existing = translations.find(t => t.language === lang.id);
                        const isCurrent = currentLanguage === lang.id;

                        return (
                            <Card key={lang.id} border padding={3} radius={2} tone={isCurrent ? 'primary' : 'default'} style={{ opacity: isCurrent ? 1 : 0.9 }}>
                                <Stack space={3}>
                                    <Flex justify="space-between" align="center">
                                        <Text weight="semibold" size={1}>{lang.title}</Text>
                                        {isCurrent && <Badge fontSize={0} tone="primary">Current</Badge>}
                                    </Flex>

                                    {existing ? (
                                        <Flex align="center" gap={2}>
                                            <CheckmarkCircleIcon style={{ color: '#1dbf73' }} />
                                            <Text size={1} muted>Created</Text>
                                        </Flex>
                                    ) : (
                                        <Flex align="center" gap={2}>
                                            <Box style={{ opacity: 0.3 }}><TranslateIcon /></Box>
                                            <Text size={1} muted>Missing</Text>
                                        </Flex>
                                    )}

                                    {!isCurrent && (
                                        <Box>
                                            {existing ? (
                                                <Flex gap={2}>
                                                    <Button
                                                        text="Edit"
                                                        icon={EditIcon}
                                                        fontSize={1}
                                                        mode="ghost"
                                                        tone="primary"
                                                        onClick={() => navigateToDoc(existing._id)}
                                                        padding={3}
                                                        style={{ flex: 1 }}
                                                    />
                                                    <Button
                                                        icon={SyncIcon}
                                                        fontSize={1}
                                                        mode="ghost"
                                                        tone="caution"
                                                        title="Regenerate Translation"
                                                        onClick={() => handleCreateTranslation(lang.id)}
                                                        padding={3}
                                                        disabled={isLoading}
                                                    />
                                                </Flex>
                                            ) : (
                                                <Button
                                                    text="Create"
                                                    icon={AddIcon}
                                                    fontSize={1}
                                                    mode="ghost"
                                                    tone="positive"
                                                    disabled={isLoading || !translationId}
                                                    onClick={() => handleCreateTranslation(lang.id)}
                                                    padding={3}
                                                    style={{ width: '100%' }}
                                                />
                                            )}
                                        </Box>
                                    )}

                                    {/* Enable Sync button for current language if it is not Master */}
                                    {isCurrent && currentLanguage !== BASE_LANGUAGE.id && (
                                        <Box marginTop={3}>
                                            <Button
                                                text={`Sync from ${BASE_LANGUAGE.title}`}
                                                icon={SyncIcon}
                                                fontSize={1}
                                                mode="ghost"
                                                tone="caution"
                                                onClick={handleSyncFromMaster}
                                                disabled={isLoading}
                                                style={{ width: '100%' }}
                                            />
                                        </Box>
                                    )}
                                </Stack>
                            </Card>
                        );
                    })}
                </Grid>
            </Stack>
        </Card>
    )
}
