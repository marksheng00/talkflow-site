import { Card, Stack, Text, Button, Flex, Box, Badge, Grid, Label } from '@sanity/ui'
import { useCallback, useState, useEffect } from 'react'
import { useClient, useFormValue, useWorkspace } from 'sanity'
import { LANGUAGES, BASE_LANGUAGE } from '../lib/languages'
import { RefreshIcon, TranslateIcon, EditIcon, CheckmarkCircleIcon, AddIcon } from '@sanity/icons'
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
    const client = useClient({ apiVersion: '2024-01-01' })
    const [translations, setTranslations] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Initialize translationId if missing
    useEffect(() => {
        if (!translationId && onChange) {
            // If this is a new document or missing ID, generate one
            // We use a patch to set it
            // Note: onChange is the form patcher for this field
            import('sanity').then(({ set }) => {
                onChange(set(generateUUID()))
            })
        }
    }, [translationId, onChange])

    const fetchTranslations = useCallback(async () => {
        if (!translationId) return
        setIsLoading(true)
        try {
            // Find all posts with this translationId
            const query = `*[_type == "post" && translationId == $tid && !(_id in path("drafts.**"))]{
        _id,
        language,
        title
      }`
            const result = await client.fetch(query, { tid: translationId })
            setTranslations(result)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }, [client, translationId])

    useEffect(() => {
        fetchTranslations()
    }, [fetchTranslations])

    const handleCreateTranslation = async (langId: string) => {
        if (!translationId) return;
        setIsLoading(true);
        try {
            // Clone current document
            // We get the current full document first
            // Note: We can't easily get the full current draft from here without fetching or using complex form state.
            // For simplicity/robustness, we fetch the current published or draft version.
            const currentDoc = await client.fetch(`*[_id == $id || _id == $draftId][0]`, {
                id: documentId.replace('drafts.', ''),
                draftId: `drafts.${documentId.replace('drafts.', '')}`
            });

            if (!currentDoc) {
                alert('Please save the current document first before translating.');
                return;
            }

            const newDoc = {
                ...currentDoc,
                _id: `drafts.${generateUUID()}`, // New Draft ID
                _type: 'post',
                language: langId,
                translationId: translationId,
                title: `[Draft] ${currentDoc.title} (${langId})`,
                // Potentially we would call the AI translation API here in a real implementation
                // For now we clone content
            };

            // Remove system fields
            delete newDoc._createdAt;
            delete newDoc._updatedAt;
            delete newDoc._rev;

            await client.create(newDoc);

            // Refresh list
            await fetchTranslations();

            // Ideally we could offer to navigate to it, but the list update will show the 'Edit' button
        } catch (err) {
            console.error('Failed to create translation', err);
            alert('Failed to create translation. Check console.');
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToDoc = (id: string) => {
        // Navigate to the document
        // We can use the intent link structure
        window.location.hash = `/intent/edit/id=${id};type=post`;
    };

    return (
        <Card padding={4} radius={2} shadow={1} tone="transparent">
            <Stack space={4}>
                <Flex justify="space-between" align="center">
                    <Box>
                        <Text weight="bold" size={2}>Translation Hub</Text>
                        <Text size={1} muted>Manage multi-language versions of this post</Text>
                    </Box>
                    <Badge tone="primary">{currentLanguage?.toUpperCase() || 'UNKNOWN'}</Badge>
                </Flex>

                {/* Status Grid */}
                <Grid columns={[1, 2, 3]} gap={3}>
                    {LANGUAGES.map(lang => {
                        const existing = translations.find(t => t.language === lang.id);
                        const isCurrent = currentLanguage === lang.id;

                        return (
                            <Card key={lang.id} border padding={3} radius={2} tone={isCurrent ? 'primary' : 'default'}>
                                <Stack space={3}>
                                    <Flex justify="space-between" align="center">
                                        <Text weight="semibold" size={1}>{lang.title}</Text>
                                        {isCurrent && <Badge fontSize={0} tone="primary">Current</Badge>}
                                    </Flex>

                                    {existing ? (
                                        <Flex align="center" gap={2}>
                                            <CheckmarkCircleIcon style={{ color: 'green' }} />
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
                                                    padding={2}
                                                />
                                            ) : (
                                                <Button
                                                    text="Create"
                                                    icon={AddIcon}
                                                    fontSize={1}
                                                    mode="ghost"
                                                    tone="positive"
                                                    disabled={isLoading}
                                                    onClick={() => handleCreateTranslation(lang.id)}
                                                    padding={2}
                                                />
                                            )}
                                        </Box>
                                    )}
                                </Stack>
                            </Card>
                        );
                    })}
                </Grid>

                {/* Debug Info */}
                {/* <Card padding={2} tone="caution">
             <Text size={0}>Translation ID: {translationId}</Text>
        </Card> */}
            </Stack>
        </Card>
    )
}
