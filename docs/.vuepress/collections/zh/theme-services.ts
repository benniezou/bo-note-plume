import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeServices: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'services',
  title: '指南',
  linkPrefix: '/services/',
  sidebar: [
    {
      text: '从这里开始',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'quick-start',
      items: [
        'intro',
        'usage',
        'project-structure',
        {
          text: '集合',
          link: 'collection',
          items: ['collection-post', 'collection-doc'],
        },
        'sidebar',
        'write',
        'auto-frontmatter',
        'locales',
        'deployment',
        'optimize-build',
      ],
    },
  ],
})
