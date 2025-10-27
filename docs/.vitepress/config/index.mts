// docs/.vitepress/config/index.ts
import { defineConfig } from 'vitepress'
import zh from './configCn.mts'
import jp from './configJp.mts'

// 引入图片注释插件
import implicitFigures from 'markdown-it-implicit-figures'

export default defineConfig({
  title: "My Vue3.5 Project",
  description: "A VitePress Site",
  base:"/yunfengnongfu-note/",
  lastUpdated: true, // ✅ 开启“最近更新时间”
  locales: {
    root: {
      label: '简体中文',
      ...zh
      
    },
    jp: {
      label: '日本語',
      ...jp

    }
  },
  markdown: {
    config: (md) => {
      md.use(implicitFigures, {
        dataType: false,      // <figure data-type="image">，可关闭
        figcaption: true,     // 启用 figcaption
        tabindex: false,      // <figure tabindex="1">，可关闭
        link: false           // 是否把图片自动包裹在 <a> 里
      })
    },
    lineNumbers: true // 代码块显示行号
  },
  themeConfig: {
    // 搜索功能
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          /**
           * @type {Pick<import('minisearch').Options, 'extractField' | 'tokenize' | 'processTerm'>}
           */
          options: {
            /* ... */
          },
          /**
           * @type {import('minisearch').SearchOptions}
           * @default
           * { fuzzy: 0.2, prefix: true, boost: { title: 4, text: 2, titles: 1 } }
           */
          searchOptions: {
            /* ... */
          }
        },
        // 多语言配置
        locales: {
          zh: {
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
          },
          jp: {
            translations: {
              button: {
                buttonText: 'ドキュメントを検索',
                buttonAriaLabel: 'ドキュメントを検索'
              },
              modal: {
                noResultsText: '関連する結果が見つかりません',
                resetButtonTitle: 'クエリ条件をクリアする',
                footer: {
                  selectText: '選択',
                  navigateText: '切り替え'
                }
              }
            }
          }
        }
      }
    },
  }
})
