import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeDatabase: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'database',
  title: '数据库',
  linkPrefix: '/database/',
  sidebar: [
    {
      text: '微软服务器',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'mysql',
      items: [
        'intro',
      ],
    },
  ],
})
