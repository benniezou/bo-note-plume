import { defineCollections, type ThemeCollections } from 'vuepress-theme-plume'
import { themeConfig } from './theme-config.js'
import { themeDatabase } from './theme-database.js'
import { themeFanwei } from './theme-fanwei'
import { themeGuide } from './theme-guide.js'
import { themeProgram } from './theme-program'
import { themeServer } from './theme-server.js'
import { themeUi } from './theme-ui'
import { tools } from './tools.js'

export const zhCollections: ThemeCollections = defineCollections([
  // 博客
  { type: 'post', dir: '/blog/', link: '/blog/', title: '博客' },
  // 文档
  themeDatabase,
  themeFanwei,
  themeGuide,
  themeProgram,
  themeConfig,
  themeServer,
  themeUi,
  tools,
])
