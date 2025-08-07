import { defineConfig } from 'vitepress'
import { getSidebarData } from '../sidebar.mts'
import { getNavData } from '../navbar.mjs'


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

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    i18nRouting : true, // ✅ 开启国际化路由
    outline: {
      level: [1, 2],
      label: '页面导航'
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
