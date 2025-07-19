// docs/.vitepress/config/index.ts
import { defineConfig } from 'vitepress'
import zh from './configCn.mts'
import jp from './configJp.mts'

export default defineConfig({
  title: "My Vue3.5 Project",
  description: "A VitePress Site",
  base:"/vitepress_init/",
  locales: {
    root: {
      label: '简体中文',
      ...zh
    },
    jp: {
      label: '日本語',
      ...jp

    }
  }
})
