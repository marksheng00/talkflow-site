import { Card, Stack, Text, Button, Flex, Box, Badge, Grid, useToast } from '@sanity/ui'
import { useCallback, useState, useEffect } from 'react'
import { useClient, useFormValue, set } from 'sanity'
import { LANGUAGES } from '../lib/languages'
import { TranslateIcon, EditIcon, CheckmarkCircleIcon, AddIcon, WarningOutlineIcon, RefreshIcon } from '@sanity/icons'
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

        setIsLoading(true);
        try {
            // 1. Fetch the FULL current document content to clone
            // We try to find the document by its ID (handling draft/published)
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

            // 2. Prepare new document
            const newDocId = `drafts.${generateUUID()}`;
            const newDoc = {
                ...currentDoc,
                _id: newDocId,
                _type: 'post',
                language: langId,
                translationId: translationId,
                title: `[Draft] ${currentDoc.title || 'Untitled'} (${langId.toUpperCase()})`,
                slug: { current: `${currentDoc.slug?.current || 'untitled'}-${langId}` } // simple slug suffix
            };

            // Remove system fields
            delete newDoc._createdAt;
            delete newDoc._updatedAt;
            delete newDoc._rev;

            console.log("Creating new translation:", newDoc);

            // 3. Create the document
            await client.create(newDoc);

            toast.push({
                status: 'success',
                title: 'Translation Created',
                description: `Created ${langId.toUpperCase()} version.`
            })

            // 4. Update the list
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

    const navigateToDoc = (id: string) => {
        // Intent link to open the document
        // We strip 'drafts.' prefix for the intent usually, but passing full ID is safer for 'edit' intent
        const finalId = id.replace('drafts.', '');
        window.location.hash = `/intent/edit/id=${finalId};type=post`;
    };

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
                                                <Button
                                                    text="Edit"
                                                    icon={EditIcon}
                                                    fontSize={1}
                                                    mode="ghost"
                                                    tone="primary"
                                                    onClick={() => navigateToDoc(existing._id)}
                                                    padding={3}
                                                    style={{ width: '100%' }}
                                                />
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
                                </Stack>
                            </Card>
                        );
                    })}
                </Grid>
            </Stack>
        </Card>
    )
}
