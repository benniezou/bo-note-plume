import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeServer: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'server',
  title: '指南',
  linkPrefix: '/server/',
  sidebar: [
    {
      text: '微软服务器',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'WinServer',
      items: [
        'intro',
      ],
    },
  ],
})
