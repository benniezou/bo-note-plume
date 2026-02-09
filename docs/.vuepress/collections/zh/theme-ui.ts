import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeUi: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'ui',
  title: '前端',
  linkPrefix: '/ui/',
  sidebar: [
    {
      text: 'html',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'html',
      items: [
        'intro',
      ],
    },
    {
      text: 'css',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'css',
      items: [
        'intro',
      ],
    },
    {
      text: 'javascript',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'javascript',
      items: [
        'intro',
      ],
    },
  ],
})
