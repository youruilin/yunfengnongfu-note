import { defineConfig } from 'vitepress'
import { getSidebarData } from '../../jp/sidebarJp.mjs'
import { getNavData } from '../../jp/navbarJp.mjs'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Vue3.5 Project",
  description: "A VitePress Site",
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh'
    },
    jp: {
      label: 'Japanese',
      lang: 'jp', // 可选，将作为 `lang` 属性添加到 `html` 标签中
      link: '/jp/' // 默认 /jp/ -- 显示在导航栏翻译菜单上，可以是外部的

      // 其余 locale 特定属性...
    }
  },
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

    i18nRouting : true, // ✅ 开启国际化路由
    outline: {
      label: 'おはよう'
    },

    // lastUpdated: true, // ✅ 开启“最近更新时间”
    lastUpdated: {
      text: '最后更新于',
      // formatOptions: {
      //   dateStyle: 'full',
      //   timeStyle: 'medium'
      // }
    },
    nav: getNavData({ enableDirActiveMatch: true }), // 顶部的导航栏
    sidebar: getSidebarData(), // 侧边栏
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present You Ruilin'
    }
  }
})
