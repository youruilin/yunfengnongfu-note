---
cbf: [1,2,3]
---

# 代码块折叠

## 直接砸解决方案

用它就行：[vitepress-plugin-codeblocks-fold](https://github.com/T-miracle/vitepress-plugin-codeblocks-fold)

魔改了hexo的butterfly主题后，对代码框折叠有比较强迫的需求。按照文档配置后，发现需要调整一些折叠细节，直接在 style.css 中替换样式即可。

```css
.vp-doc div.fold[class*=language-]>.fold-btn{
  height: 22px;
  bottom: 22px;
}

svg.fold-btn-icon{
  width: 12px;
  height: 12px;
  animation: float1 infinite 2.2s !important;
}
```

