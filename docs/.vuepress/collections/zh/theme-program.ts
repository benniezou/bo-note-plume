import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeProgram: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'program',
  title: '服务器',
  linkPrefix: '/program/',
  sidebar: [
    {
      text: '微软服务器',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'Java',
      items: [
        'intro',
      ],
    },
  ],
})
