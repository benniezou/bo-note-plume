import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeFanwei: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'fanwei',
  title: '泛微',
  linkPrefix: '/fanwei/',
  sidebar: [
    {
      text: '配置',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'setting',
      items: [
        'intro',
      ],
    },
    {
      text: 'HR相关',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'HR',
      items: [
        'card',
      ],
    },
  ],
})
