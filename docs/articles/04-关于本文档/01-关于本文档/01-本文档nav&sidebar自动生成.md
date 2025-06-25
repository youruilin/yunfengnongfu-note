---
outline: 2
---

# 导航栏和侧栏的自动生成

## vitepress使用

[vitepress官网](https://vitepress.dev/zh/)



## vitepress 版本

`^1.6.3`



## 顶部导航

### 数据结构

```ts
interface NavItem {
  /**
   * 文本
   */
  text: string
  /**
   * 跳转链接
   * 注意事项：如果要配置动态sidebar，则这个link必须以'/'结尾
   */
  link?: string
  /**
   * 高亮匹配路由
   */
  activeMatch?: string
  /**
   * 子导航
   */
  children?: NavItem[]
}
```

### 手动配置

```ts
// PROJECT_ROOT/docs/.vitepress/config.ts
import { UserConfig } from 'vitepress'

module.exports = {
  themeConfig: {
    nav: [
      { text: '作品集', link: '/articles/作品集/', activeMatch: '/作品集/' },
      {
        text: '作品集',
        link: '/articles/作品集/',
        activeMatch: '/作品集/',
        children: [
          // 省略...
        ],
      },
    ],
  },
} as UserConfig
```

### 动态生成

```ts
// navbar.mts
import path from 'path'
import { readdirSync, statSync } from 'fs'

/**
 * 判断是否为markdown文件
 *
 * @param   {string}  fileName  文件名
 *
 * @return  {[boolean]}         有返回值则表示是markdown文件,否则不是
 */
function isMarkdownFile(fileName: string) {
  return fileName.match(/.+\.md$/)
}

interface NavGenerateConfig {
  /**
   * 是否启用路由匹配显示激活状态. 默认:false
   */
  enableDirActiveMatch: boolean
  /**
   * 需要遍历的目录. 默认:articles
   */
  dirName?: string
  /**
   * 最大遍历层级. 默认:1
   */
  maxLevel?: number
}

export function getNavData(navGenerateConfig: NavGenerateConfig) {
  const { enableDirActiveMatch, dirName = 'articles', maxLevel = 1 } = navGenerateConfig
  const dirFullPath = path.resolve(__dirname, `../${dirName}`)
  const result = getNavDataArr(dirFullPath, 1, maxLevel, enableDirActiveMatch)
  // console.log('navData')
  // console.log(result)
  return result
}
interface NavItem {
  text: string
  link?: string
  activeMatch?: string
  children?: NavItem[]
}
/**
 * 获取顶部导航数据
 *
 * @param   {string}     dirFullPath  当前需要遍历的目录绝对路径
 * @param   {number}     level        当前层级
 * @param   {number[]}   maxLevel     允许遍历的最大层级
 * @param   {boolean}    enableActiveMatch 是否启用路由匹配显示激活状态
 *
 * @return  {NavItem[]}               导航数据数组
 */
function getNavDataArr(dirFullPath: string, level: number, maxLevel: number, enableActiveMatch: boolean): NavItem[] {
  // 获取所有文件名和目录名
  const allDirAndFileNameArr = readdirSync(dirFullPath)
  const result: NavItem[] = []
  allDirAndFileNameArr.map((fileOrDirName: string, idx: number) => {
    const fileOrDirFullPath = path.join(dirFullPath, fileOrDirName)
    const stats = statSync(fileOrDirFullPath)
    const link = fileOrDirFullPath.split('docs')[1].replace('.md', '').replace(/\\/g, '/')
    const text = fileOrDirName.match(/^[0-9]{2}-.+/) ? fileOrDirName.substring(3) : fileOrDirName
    if (stats.isDirectory()) {
      // 当前为文件夹
      const dirData: NavItem = {
        text,
        link: `${link}/`,
      }
      if (level !== maxLevel) {
        dirData.children = getNavDataArr(fileOrDirFullPath, level + 1, maxLevel, enableActiveMatch)
      }
      if (enableActiveMatch) {
        dirData.activeMatch = link + '/'
      }
      result.push(dirData)
    } else if (isMarkdownFile(fileOrDirName)) {
      // 当前为文件
      const fileData: NavItem = {
        text,
        link: link,
      }
      if (enableActiveMatch) {
        fileData.activeMatch = link + '/'
      }
      result.push(fileData)
    }
  })
  return result
}
```



## 侧边导航

### 数据结构

```ts
interface SideBarItem {
  /**
   *名称
   */
  text: string
  /**
   * 是否显示展开/收缩按钮
   */
  collapsible?: boolean
  /**
   * 默认是否收缩
   */
  collapsed?: boolean
  /**
   * 文章列表
   */
  items?: SideBarItem[]
  /**
   * 跳转链接
   */
  link?: string
}
```

### 手动配置

```ts
import { UserConfig } from 'vitepress'

module.exports = {
  themeConfig: {
    /**
     * 整体的sidebar是一个对象，这个对象的属性是与顶部导航的link值对应
     * 当点击的顶部导航的link与sidebar的某个属性完全匹配时，那么侧边就会显示对应属性的哪个sidebar
     */
    sidebar: {
      '/articles/01-作品集/': [
        {
          text: '工具类',
          items: [{ text: 'xxx', link: 'xxx' }],
        },
        {
          text: 'css/scss/less',
          items: [],
        },
        {
          text: '移动端',
          items: [],
        },
        {
          text: '算法',
          items: [],
        },
        {
          text: 'node',
          items: [],
        },
      ],
    },
  },
} as UserConfig

```

### 动态生成

```ts
import path from 'path'
import { readdirSync, statSync } from 'fs'

/**
 * 判断是否为markdown文件
 *
 * @param   {string}  fileName  文件名
 *
 * @return  {[boolean]}         有返回值则表示是markdown文件,否则不是
 */
function isMarkdownFile(fileName: string) {
  return fileName.match(/.+\.md$/)
}

interface SidebarGenerateConfig {
  /**
   * 需要遍历的目录. 默认:articles
   */
  dirName?: string
  /**
   * 忽略的文件名. 默认: index.md
   */
  ignoreFileName?: string
  /**
   * 忽略的文件夹名称. 默认: ['demo','asserts']
   */
  ignoreDirNames?: string[]
}
export function getSidebarData(sidebarGenerateConfig: SidebarGenerateConfig = {}) {
  const {
    dirName = 'articles',
    ignoreFileName = 'index.md',
    ignoreDirNames = ['demo', 'asserts'],
  } = sidebarGenerateConfig
  // 获取目录的绝对路径
  const dirFullPath = path.resolve(__dirname, `../${dirName}`)
  const allDirAndFileNameArr = readdirSync(dirFullPath)
  const obj = {}
  allDirAndFileNameArr.map(dirName => {
    let subDirFullName = path.join(dirFullPath, dirName)
    const property = subDirFullName.split('docs')[1].replace(/\\/g, '/') + '/'
    const arr = getSideBarItemTreeData(subDirFullName, 1, 2, ignoreFileName, ignoreDirNames)
    obj[property] = arr
  })
  // console.log('sidebarData')
  // console.log(obj)
  return obj
}

interface SideBarItem {
  text: string
  collapsible?: boolean
  collapsed?: boolean
  items?: SideBarItem[]
  link?: string
}
function getSideBarItemTreeData(
  dirFullPath: string,
  level: number,
  maxLevel: number,
  ignoreFileName: string,
  ignoreDirNames: string[]
): SideBarItem[] {
  // 获取所有文件名和目录名
  const allDirAndFileNameArr = readdirSync(dirFullPath)
  const result: SideBarItem[] = []
  allDirAndFileNameArr.map((fileOrDirName: string, idx: number) => {
    const fileOrDirFullPath = path.join(dirFullPath, fileOrDirName)
    const stats = statSync(fileOrDirFullPath)
    if (stats.isDirectory()) {
      if (!ignoreDirNames.includes(fileOrDirName)) {
        // 当前为文件夹
        const dirData: SideBarItem = {
          text: fileOrDirName,
          collapsed: false,
        }
        if (level !== maxLevel) {
          dirData.items = getSideBarItemTreeData(fileOrDirFullPath, level + 1, maxLevel, ignoreFileName, ignoreDirNames)
        }
        if (dirData.items) {
          dirData.collapsible = true
        }
        result.push(dirData)
      }
    } else if (isMarkdownFile(fileOrDirName) && ignoreFileName !== fileOrDirName) {
      // 当前为文件
      const matchResult = fileOrDirName.match(/(.+)\.md/)
      const text = matchResult ? matchResult[1] : fileOrDirName
      const fileData: SideBarItem = {
        text,
        link: fileOrDirFullPath.split('docs')[1].replace('.md', '').replace(/\\/g, '/'),
      }
      result.push(fileData)
    }
  })
  return result
}
```



## 动态生成需要有对应的目录与文件结构

- 所有的文章都必须在`PROJECT_ROOT/docs/articles`目录，并放入对应的子目录
- `PROJECT_ROOT/docs/articles`的子目录是一级目录(如: `01-作品集`)，这一级目录会被用来生成顶部导航
- `PROJECT_ROOT/docs/articles/一级目录/index.md`, 这是一级目录的首页, 该文件必须存在
- `PROJECT_ROOT/docs/articles/一级目录/二级目录`，二级目录用于生成左侧导航
- `PROJECT_ROOT/docs/articles/一级目录/二级目录/xxx.md`, `xxx.md`表示你的具体文章，文章必须放在二级目录下面
- 无论是自动生成头部导航还是侧边导航，默认都会自动忽略`index.md`以及`demo目录`和`asserts目录`

![](./asserts/article_目录.png)

## More

Check out the documentation for the [full list of runtime APIs](https://vitepress.dev/reference/runtime-api#usedata).
