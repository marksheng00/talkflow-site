import type { StructureBuilder } from 'sanity/structure'
import { LANGUAGES } from './lib/languages'

// Icons
import { EarthGlobeIcon, DocumentTextIcon, UsersIcon, TagIcon } from '@sanity/icons'

export const structure = (S: StructureBuilder) =>
    S.list()
        .title('Content')
        .items([
            // 1. Hub View: English Posts (Masters)
            S.listItem()
                .title('Blog Posts (Master / Hub)')
                .icon(EarthGlobeIcon)
                .child(
                    S.documentList()
                        .title('English Posts')
                        .filter('_type == "post" && language == "en"')
                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),

            S.divider(),

            // 2. All Posts (Categorized by Language)
            S.listItem()
                .title('All Posts by Language')
                .icon(DocumentTextIcon)
                .child(
                    S.list()
                        .title('Languages')
                        .items([
                            ...LANGUAGES.map(lang =>
                                S.listItem()
                                    .title(lang.title)
                                    .child(
                                        S.documentList()
                                            .title(`${lang.title} Posts`)
                                            .filter('_type == "post" && language == $lang')
                                            .params({ lang: lang.id })
                                    )
                            ),
                            S.divider(),
                            S.listItem()
                                .title('All Posts (Everything)')
                                .child(S.documentTypeList('post'))
                        ])
                ),

            S.divider(),

            // 3. Other Types
            S.documentTypeListItem('category').title('Categories').icon(TagIcon),
            S.documentTypeListItem('author').title('Authors').icon(UsersIcon),
        ])
