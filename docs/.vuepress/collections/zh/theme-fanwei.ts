import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeFanwei: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'fanwei',
  title: '泛微',
  linkPrefix: '/fanwei/',
  sidebar: [
    'intro',
  ],
})
