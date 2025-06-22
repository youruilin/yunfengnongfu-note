import { defineConfig } from 'vitepress'
import { getSidebarData } from './sidebar.mts'
import { getNavData } from './navbar.mjs'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Vue3.5 Project",
  description: "A VitePress Site",
  lastUpdated: true, // ✅ 开启“最近更新时间”
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: [
    //   { text: 'Home', link: '/' },
    //   { text: 'Examples', link: '/markdown-examples' }
    // ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    // lastUpdated: {
    //   text: 'Updated at',
    //   formatOptions: {
    //     dateStyle: 'full',
    //     timeStyle: 'medium'
    //   }
    // },
    nav: getNavData({ enableDirActiveMatch: true }), // 顶部的导航栏
    sidebar: getSidebarData(), // 侧边栏

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
