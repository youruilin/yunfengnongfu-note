// https://vitepress.dev/guide/custom-theme
import { h, watch, onMounted } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import ImgScroller from './components/ImgScroller.vue'

import './style.css'
import './custom.css'

import { useData, useRoute } from 'vitepress'
import codeblocksFold from 'vitepress-plugin-codeblocks-fold' // 导入方法
import 'vitepress-plugin-codeblocks-fold/style/index.css' // 导入样式
import { transformBilingualBlocks } from '../utils/transformBilingualBlocks.js' // 导入方法

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    app.component('ImgScroller', ImgScroller)
  },
  setup() {
    // 获取前言和路由
    const { frontmatter } = useData();
    const route = useRoute();

    // watch(
    //   () => route.path,
    //   () => {
    //     // 路由变化时触发
    //     setTimeout(() => {
    //       transformBilingualBlocks()
    //     }, 0)
    //   },
    //   { immediate: true } // 如果首次加载也需要执行
    // )

    onMounted(() => {
      if (typeof document === 'undefined') return

      watch(
        () => route.path,
        () => {
          // 延迟等待 DOM 渲染后再执行
          setTimeout(() => {
            transformBilingualBlocks()
          }, 0)
        },
        { immediate: true }
      )
    })
    

    // 基础使用
    // codeblocksFold({ route, frontmatter });
    // 可配置参数
    codeblocksFold({ route, frontmatter }, true, 270);
}
} satisfies Theme
