import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeUi: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'ui',
  title: '前端',
  linkPrefix: '/ui/',
  sidebar: [
    {
      text: 'Html',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'Html',
      items: [
        'intro',
      ],
    },
  ],
})
