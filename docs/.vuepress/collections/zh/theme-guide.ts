import type { ThemeCollectionItem } from 'vuepress-theme-plume'
import { defineCollection } from 'vuepress-theme-plume'

export const themeGuide: ThemeCollectionItem = defineCollection({
  type: 'doc',
  dir: 'guide',
  title: '指南',
  linkPrefix: '/guide/',
  sidebar: [
    {
      text: '基础知识',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'quick-start',
      items: [
        'intro',
        'shortcut',
        'safety',
        'netFile',
        {
          text: '文档编辑',
          link: 'word',
          items: ['word-mail'],
        },
        {
          text: '电子表格',
          link: 'excel',
          items: ['excel-functions'],
        },
      ],
    },
    {
      text: '软件知识',
      collapsed: false,
      icon: 'carbon:idea',
      prefix: 'quick-start',
      items: [
        'intro',
        'shortcut',
        'safety',
        'netFile',
        {
          text: '文档编辑',
          link: 'word',
          items: ['word-mail'],
        },
        {
          text: '电子表格',
          link: 'excel',
          items: ['excel-functions'],
        },
      ],
    },
  ],
})
