node.js 中文网，已经实现了几乎所有主流前端技术栈原文文档的中文翻译，并且为每段中文翻译提供了英文原文，效果非常丝滑。

蠢蠢欲动了很久，今天把这个功能实现出来了..

# 实现方案

## 📁 第一步：在 `theme/index.ts` 中引入脚本

`docs/.vitepress/theme/index.ts` 添加：

```ts
// https://vitepress.dev/guide/custom-theme
import { h, watch } from 'vue' // 这里引入 watch

// 其他逻辑省略 ...

'../utils/transformBilingualBlocks.js' // 导入方法

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
  setup() {
    // 获取前言和路由
    const { frontmatter } = useData();
    const route = useRoute();
	  // 监听路由变化
    watch(
      () => route.path,
      () => {
        // 路由变化时触发
        setTimeout(() => {
          transformBilingualBlocks()
        }, 0)
      },
      { immediate: true } // 如果首次加载也需要执行
    )

    // 基础使用
    // codeblocksFold({ route, frontmatter });
    // 可配置参数
    codeblocksFold({ route, frontmatter }, true, 270);
}
} satisfies Theme

```

## 📜 第二步：创建全局脚本 `transformBilingualBlocks.ts`

放在 `docs/.vitepress/theme/utils/transformBilingualBlocks.ts`：

```ts
export function transformBilingualBlocks() {
  const regex = /【([^|【】]+)\|([^|【】]+)】/g
  const contentBlocks = document.querySelectorAll('p') // 注意选定区域，避免整个页面标签递归替换

  contentBlocks.forEach(block => {
    if (!block.innerHTML.includes('【') || !regex.test(block.innerHTML)) return

    block.innerHTML = block.innerHTML.replace(regex, (_, zh, en) => {
      return `
        <p class="p-zh" onclick="this.nextElementSibling.classList.toggle('hidden')">${zh}</p>
        <p class="p-en hidden">${en}</p>
      `
    })
  })
}
```

## 🎨 第三步：添加样式控制 `.en.hidden`

在 stlye.css 样式文件中，增加相关的样式：

```
/* 正则国际化 */
.p-en.hidden {
  display: none;
}
.p-zh {
  cursor: pointer;
  /* color: #1e88e5; */
}

.p-en{
  border-top: 1px dashed rgb(26, 43, 52);
  opacity: 0.6;
  padding-top: 5px;
}
```

