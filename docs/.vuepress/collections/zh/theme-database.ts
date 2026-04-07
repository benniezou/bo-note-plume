import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeDatabase: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'database',
  title: '数据库',
  linkPrefix: '/database/',
  sidebar: [
    'intro',
    {
      text: 'mysql',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'mysql',
      items: [
        'intro',
      ],
    },
    {
      text: 'SqlServer',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'sqlServer',
      items: [
        'intro',
        'flowServer',
      ],
    },
    {
      text: '鼎捷系统',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'hrmdb',
      items: [
        'intro',
      ],
    },
  ],
})
