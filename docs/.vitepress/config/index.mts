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
