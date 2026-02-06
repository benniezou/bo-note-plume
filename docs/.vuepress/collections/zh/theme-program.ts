import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeProgram: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'program',
  title: '编程',
  linkPrefix: '/program/',
  sidebar: [
    {
      text: 'Java',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'Java',
      items: [
        'intro',
      ],
    },
  ],
})
