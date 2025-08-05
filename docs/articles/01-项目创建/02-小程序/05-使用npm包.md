## Vant Weapp

### 小程序对 npm 的支持与限制

小程序中已经支持使用npm 安装第三方包，从而来提高小程序的开发效率。但是，在小程序中使用npm 包有如下 3 个限制：

① 不支持依赖于 Node.js 内置库 的包

② 不支持依赖于 浏览器内置对象 的包

③ 不支持依赖于 C++ 插件 的包

总结：虽然 npm 上的包有千千万，但是能供小程序使用的包却“为数不多”。

### Vant  Weapp

Vant Weapp是有赞前端团队开源的一套 小程序 UI 组件库 ，助力开发者快速搭建小程序应用。它所使用的是MIT 开源许可协议 ，对商业使用比较友好。

官方文档地址 https://youzan.github.io/vant vant-weapp

![image-20250729113720700](../../../public/image-vantWeapp.png)

### 安装 Vant 组件库

在小程序项目中，安装 Vant 组件库主要分为如下 3 步：

① 通过 npm 安装

② 构建 npm 包

③ 修改 app.json

```
# 初始化项目
npm init -y

# 通过 npm 安装
npm i @vant/weapp -S --production

# 通过 yarn 安装
yarn add @vant/weapp --production
```

然后，修改 app.json：

将 app.json 中的 `"style": "v2"` 去除，小程序的[新版基础组件](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#style)强行加上了许多样式，难以覆盖，不关闭将造成部分组件样式混乱。

接下来，构建 npm 包：

打开微信开发者工具，点击 **工具 -> 构建 npm**，并勾选 **使用 npm 模块** 选项，构建完成后，即可引入组件。

![img](../../../public/image-构建npm.png)



::: detials typescript 支持：

如果使用 typescript 开发小程序，还需要做如下操作，以获得顺畅的开发体验。

安装 miniprogram-api-typings

```bash
# 通过 npm 安装
npm i -D miniprogram-api-typings

# 通过 yarn 安装
yarn add -D miniprogram-api-typings
```

在 tsconfig.json 中增加如下配置，以防止 tsc 编译报错。

请将`path/to/node_modules/@vant/weapp`修改为项目的 `node_modules` 中 @vant/weapp 所在的目录。

```json
{
  ...
  "compilerOptions": {
    ...
    "baseUrl": ".",
    "types": ["miniprogram-api-typings"],
    "paths": {
      "@vant/weapp/*": ["path/to/node_modules/@vant/weapp/dist/*"]
    },
    "lib": ["ES6"]
  }
}
```

:::

### 使用 Vant  组件

安装完 Vant 组件库之后，可以在 app.json 的 usingComponents 节点中引入需要的组件，即可在 wxml 中 直接使用组件：

```
// app.json
{
  "usingComponents": {
    "van-button": "@vant/weapp/button/index"
  }
}

<!-- 页面的 .wxml 结构 -->
<van-button type="primary">按钮</van-button>
```

### 定制全局基础样式

Vant Weapp
使用 CSS 变量 来实现定制主题。 关于 CSS 变量的基本用法，请参考 MDN 文档： https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties

```css
.box1 .box2 {
	background-color: #c00000;
}

.box3 {
	color: #c00000;
}
```

vs

```css
html {
 /* 定义 css 变量 */
 --main-color: #c00000;
}

.box1 .box2 {
	background-color: var(--main-color);
}

.box3 {
	color: var(--main-color);
}
```

其中，定义 css 变量是有作用域限制的，全局生效，需要在根节点定义。

### 定制全局主题样式

在 app.wxss 中，写入 CSS 变量：

```css
/* app.wxss */
page {
  /* 定制警告按钮的背景颜色和边框颜色 */
  --button-danger-background-color: #C00000;
  --button-danger-border-color: #D60000;
}
```

## API Promise 化

默认情况下，小程序官方提供的异步 API 都是 基于回调函数 实现的，例如，网络请求的 API 需要按照如下的方式：

```js
wx.request({
  method: '',
  url: '',
  data: { },
  success: () => { }, // 请求成功的回调函数
  fail: () => { }, // 请求失败的回调函数
  complete: () => { } // 请求完成的回调函数
})
```

缺点：容易造成回调地狱 的问题，代码的可读性、维护性差！

::: details 回调函数地狱

“回调地狱”（Callback Hell），也叫“回调函数地狱”，是指在异步编程中，回调函数嵌套过多导致代码结构混乱、难以维护的问题。

------

🔧 为什么会出现回调地狱？

在 JavaScript（特别是早期 Node.js 开发）中，处理异步操作常常依赖回调函数，例如读取文件、访问数据库、发起网络请求等。这些异步操作一层嵌套一层，很快就会变成“地狱式”结构。

------

😖 示例：典型的回调地狱代码

```js
const fs = require('fs');

fs.readFile('a.txt', 'utf8', (err, data1) => {
  if (err) return console.error(err);
  fs.readFile('b.txt', 'utf8', (err, data2) => {
    if (err) return console.error(err);
    fs.readFile('c.txt', 'utf8', (err, data3) => {
      if (err) return console.error(err);
      console.log('合并内容:', data1 + data2 + data3);
    });
  });
});
```

🔻 问题：

- 层层嵌套，难以阅读和维护
- 错误处理分散，每一层都得判断 `err`
- 没有明显的流程结构（像“圣诞树”一样向右缩进）

🎯 场景设定

我们有三个文本文件：`a.txt`, `b.txt`, `c.txt`，我们要**依次读取这三个文件的内容，并把它们拼接输出**。

------

💥 原始的回调地狱代码

```js
const fs = require('fs');

fs.readFile('a.txt', 'utf8', (err, data1) => {
  if (err) return console.error(err);

  fs.readFile('b.txt', 'utf8', (err, data2) => {
    if (err) return console.error(err);

    fs.readFile('c.txt', 'utf8', (err, data3) => {
      if (err) return console.error(err);

      console.log('合并内容:', data1 + data2 + data3);
    });
  });
});
```

------

🧠 逐步拆解解释

第一步：读取 a.txt

```
fs.readFile('a.txt', 'utf8', (err, data1) => {
  if (err) return console.error(err);
  // 下一步读取 b.txt
});
```

这表示：“读取 `a.txt` 成功后，再进行下一步”。

------

第二步：嵌套地读取 b.txt

```
fs.readFile('b.txt', 'utf8', (err, data2) => {
  if (err) return console.error(err);
  // 下一步读取 c.txt
});
```

这个读取操作**必须写在 a.txt 的回调函数里面**，否则你不能保证读取顺序。

------

第三步：嵌套地读取 c.txt

```
fs.readFile('c.txt', 'utf8', (err, data3) => {
  if (err) return console.error(err);
  console.log('合并内容:', data1 + data2 + data3);
});
```

这又是 **嵌套在 b.txt 的回调里面**，完成所有读取后，才打印最终结果。

------

❗问题在哪？

看起来逻辑没错，但代码变成了这样：

```
fs.readFile(..., () => {
  fs.readFile(..., () => {
    fs.readFile(..., () => {
      // 真正的逻辑在这里
    });
  });
});
```

这就是所谓的「回调地狱」：

- 每一步都写在前一步的回调里面
- 向右缩进一层一层一层……像「圣诞树」
- 错误处理也重复写
- 一旦有 5~6 层嵌套，代码几乎不可读

:::

### Api promise 化

API Promise化，指的是通过额外的配置，将官方提供的、基于回调函数的异步 API，升级改造为基于Promise的异步API，从而提高代码的可读性、维护性，避免回调地狱的问题。

```bash
npm install --save miniprogram-api-promise
```

```js
// 在小程序入口文件中(app.js), 只需调用一次 promisifyAll() 方法,
// 即可实现异步 API 的 Promise 化
import { promisifyAll } from 'miniprogram-api-promise'

// 对象是引用类型数据，指向同一个空对象 = 指向同一份内存
const wxp = wx.p = {}

// promisify all wx's api
promisifyAll(wx, wxp)
```

它的作用是：
 👉 **把 wx 对象里的所有异步 API 包装成 Promise 风格，并挂载到 wxp 上，`wxp` 和 `wx.p` 都可以使用 **

### 调用 Promise 优化后的的 api

```html
// 页面的 .wxml 结构
<van-button type="danger" bindtap="getInfo">vant按钮</van-button>

// 在页面的.js 文件中, 定义对应的 tap 事件处理函数
async getInfo() {
  const { data: res } = await wx.p.request({
    method: 'GET',
    url: 'https://www.esccook.cn/api/get',
    data: { name: 'zs', age: 20 }
  })
  console.log(res)
},
```



## 全局数据共享

全局数据共享 （又叫做：状态管理）是为了解决 组件之间数据共享 的问题。开发中常用的全局数据共享方案有：Vuex 、Redux 、MobX 等：

![image-20250804233623835](../../../public/image-全局数据共享.png)

### 小程序中的全局数据共享方案

在小程序中，可使用 mobxmobx-miniprogram 配合 mobxmobx-miniprogramminiprogram-bindings 实现全局数据共享。其中：

- mobxmobx-miniprogram 用来 创建 Store 实例对象
- mobxmobx-miniprogramminiprogram-bindings 用来 把 Store 中的共享数据或方法 ，绑定到组件或页面中使用

![image-20250804233926050](../../../public/image-store.png)

### 安装MobX相关的包

```
npm i --save mobx-miniprogram mobx-miniprogram-bindings
```

注意： MobX 相关的包安装完毕之后，记得删除 miniprogram_npm 目录后，重新构建 npm。

### 创建 Mobx 的 store 实例

```js
// /utils/store.js
import { observable, action } from 'mobx-miniprogram'

export const store = observable({
  // 数据字段
  numA: 1,
  numB: 2,
  // 计算属性
  get sum() {
    return this.numA + this.numB
  },
  // actions 方法,用来修改 store 中的数据
  updateNum1: action(function (step) {
    this.numA += step
  }),
  updateNum2: action(function (step) {
    this.numB += step
  }),
})
```

### 绑定到页面&使用

```js
// 页面的 .js 文件
import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'

Page({
  onLoad: function () { // 生命周期函数--监听页面加载
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['numA', 'numB', 'sum'],
      actions: ['updateNum1']
    })
  },
  onUnload: function () { // 生命周期函数--监听页面卸载
    this.storeBindings.destroyStoreBindings()
  }
})
```

```html
// 页面的 .wxml 结构
<view>{{numA}} + {{numB}} = {{sum}}</view>
<van-button type="primary" bindtap="btnHandler1" data-step="{{1}}">
numA + 1
</van-button>
<van-button type="danger" bindtap="btnHandler1" data-step="{{-1}}">
numA - 1
</van-button>

// 按钮 tap 事件的处理函数
btnHandler1(e) {
    this.updateNum1(e.target.dataset.step)
}
```

### 绑定到组件中&使用

```js
// 组件js文件
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../store/store'

Component({
  behaviors: [storeBindingsBehavior], // 通过 storeBindingsBehavior 来实现自动绑定

  storeBindings: {
    store, // 指定要绑定的 Store
    fields: { // 指定要绑定的字段数据
      numA: () => store.numA, // 绑定字段的第 1 种方式
      numB: (store) => store.numB, // 绑定字段的第 2 种方式
      sum: 'sum' // 绑定字段的第 3 种方式
    },
    actions: { // 指定要绑定的方法
      updateNum2: 'updateNum2'
    }
  },
})
```

```html
// 组件的 .wxml 结构
<view>{{numA}} + {{numB}} = {{sum}}</view>
<van-button type="primary" bindtap="btnHandler2" data-step="{{1}}">
numB + 1
</van-button>
<van-button type="danger" bindtap="btnHandler2" data-step="{{-1}}">
numB - 1
</van-button>

// 组件的方法列表
methods: {
  btnHandler2(e) {
    this.updateNum2(e.target.dataset.step)
  }
}
```

::: details 事件对象 `e` 是什么？

当用户点击按钮时，会触发 `bindtap="btnHandler2"` 绑定的方法 `btnHandler2`，并且小程序会将一个 **事件对象 `e`** 传递给这个方法。

这个事件对象 `e` 中包含了很多信息，比如：

- 触发事件的 DOM 元素（或组件实例）相关信息
- 用户交互的相关数据
- 你通过 `data-*` 自定义属性绑定的数据

------

`e.target.dataset.step` 的含义：

- `e.target`：指的是 **触发事件的那个具体元素节点**，在这里就是你点击的那个 `<van-button>` 按钮。
- `.dataset`：是小程序提供的一个对象，用来获取该元素上所有 `data-*` 自定义属性的值。
- `.step`：指的是 `data-step` 这个自定义属性对应的值。

所以：

```
e.target.dataset.step
```

表示：**获取触发事件的元素上，名为 data-step 的自定义属性的值**。

:::

