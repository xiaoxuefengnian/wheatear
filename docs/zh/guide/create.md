# 搭建

以本项目 wheatear 为例

基于 vuepress 1.0.3 [文档](https://v1.vuepress.vuejs.org/zh/)

## 准备工作

```bash
# 创建项目目录
mkdir wheatear
cd wheatear

# 将 VuePress 作为一个本地依赖安装
yarn add -D vuepress # 或者：npm install -D vuepress

# 新建一个 docs 文件夹
mkdir docs

# 查看目录结构
tree -L 1
```

此时的目录结构应该是这样的

```bash
.
├── docs
├── node_modules
├── package.json
└── yarn.lock
```

打开 package.json 增加以下脚本

```json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

这时运行起 dev server，就可以开始写作了

```bash
yarn docs:dev # 或者：npm run docs:dev
```

要生成静态的 HTML 文件，运行

```bash
yarn docs:build # 或者：npm run docs:build
```

## 目录结构

在 docs 目录下

新建 .vuepress 目录 用于存放全局的配置、组件、静态资源等

新建 zh 目录 用于 存放文章

```bash
# 进入 docs 目录
cd docs/
mkdir .vuepress
mkdir zh

# 配置 .vuepress 目录
cd .vuepress
mkdir nav
mkdir public
touch config.js

# 查看目录结构
cd ..
tree -a -L 2
```

此时的目录结构应该是这样的

```bash
.
├── .vuepress
│   ├── config.js
│   ├── nav
│   └── public
└── zh
```

这里的目录结构不完全相同于官网推荐的 [目录结构](https://v1.vuepress.vuejs.org/zh/guide/directory-structure.html)

## 基本配置

继续编辑 docs/.vuepress/config.js

```javascript
module.exports = {
  /**
   * 部署站点的基础路径，如果你想让你的网站部署到一个子路径下，你将需要设置它
   * 如 Github pages，如果你想将你的网站部署到 https://foo.github.io/bar/
   * 那么 base 应该被设置成 "/bar/"，它的值应当总是以斜杠开始，并以斜杠结束
   * 类型: string
   * 默认值: / 
   */
  base: '/',

  /**
   * 网站的标题，它将会被用作所有页面标题的前缀，同时，默认主题下，它将显示在导航栏（navbar）上
   * 类型: string
   * 默认值: undefined
   */
  title: '最大的麦穗',

  /**
   * 网站的描述，它将会以 <meta> 标签渲染到当前页面的 HTML 中
   * 类型: string
   * 默认值: undefined
   */
  description: '选择前，我们要慎重。选择时，我们要果断。选择后，我们要淡定。',

  /**
   * 额外的需要被注入到当前页面的 HTML <head> 中的标签
   * 每个标签都可以以 [tagName, { attrName: attrValue }, innerHTML?] 的格式指定
   * 类型: Array
   * 默认值: []
   */
  head: [
    ['link', {
      rel: 'icon',
      href: '/img/favicon.ico'
    }],
  ],

  /**
   * 指定用于 dev server 的主机名
   * 类型: string
   * 默认值: '0.0.0.0'
   */
  host: '0.0.0.0',

  /**
   * 指定用于 dev server 的主机名
   * 类型: number
   * 默认值: 8080
   */
  port: 8080,
  
  /**
   * 指定客户端文件的临时目录
   * 类型: string
   * 默认值: /path/to/@vuepress/core/.temp
   */
  temp: '/path/to/@vuepress/core/.temp',

  /**
   * 指定 vuepress build 的输出目录
   * 类型: string
   * 默认值: .vuepress/dist
   */
  dest: '.vuepress/dist',

  /**
   * 提供多语言支持的语言配置
   * 类型: { [path: string]: Object }
   * 默认值: undefined
   */
  locales: undefined,

  /**
   * 一个函数，用来控制对于哪些文件，是需要生成 <link rel="prefetch"> 资源提示的
   * 类型: Function
   * 默认值: () => true
   */
  shouldPrefetch: () => true,

  /**
   * VuePress 默认使用了 cache-loader 来大大地加快 webpack 的编译速度
   * 此选项可以用于指定 cache 的路径，同时也可以通过设置为 false 来在每次构建之前删除 cache
   * 类型: boolean|string
   * 默认值: true
   */
  cache: false,

  /**
   * 指定额外的需要被监听的文件
   * 你可以监听任何想监听的文件，文件变动将会触发 vuepress 重新构建，并实时更新。
   * 类型: Array
   * 默认值: []
   */
  extraWatchFiles: [
    // '.vuepress/nav/en.js',
    '.vuepress/nav/zh.js',
  ],

  /**
   * 当你使用自定义主题的时候，需要指定它。
   * 当值为 "foo" 时，VuePress 将会尝试去加载位于 node_modules/vuepress-theme-foo/Layout.vue 的主题组件
   * 类型: string
   * 默认值: undefined
   */
  theme: undefined,

  /**
   * 为当前的主题提供一些配置，这些选项依赖于你正在使用的主题
   * 类型: Object
   * 默认值: {}
   */
  themeConfig: {},

  /**
   * 插件
   * 类型: Object|Array
   * 默认值: undefined
   */
  plugins: [],

  /**
   * 如果你的对象只有那些 “常青树” 浏览器，你可以将其设置成 true
   * 这将会禁止 ESNext 到 ES5 的转译以及对 IE 的 polyfills，同时会带来更快的构建速度和更小的文件体积
   * 类型: boolean|Function
   * 默认值: false  
   */
  evergreen: false,
}
```

注意这里已经在 docs/.vuepress/public/img 目录下放入了 favicon.ico 图标

## 配置主题

在 docs/.vuepress/nav 目录下增加 zh.js，代码如下

```js
module.exports = [
  {
    text: '搭建指南',
    link: '/zh/guide/create.md'
  },
]
```

修改 docs/.vuepress/config.js 中的 themeConfig，参考官网 [默认主题配置](https://v1.vuepress.vuejs.org/zh/theme/default-theme-config.html)

```js
themeConfig: {
  // 导航栏
  nav: require('./nav/zh'),

  // 侧边栏
  sidebar: {
    '/zh/guide/': getGuideSidebar('指南'),
  },
  
  // 最后更新时间
  lastUpdated: 'Last Updated', // string | boolean
  
  // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
  repo: 'xiaoxuefengnian/wheatear',
  
  // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
  // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
  // repoLabel: '查看源码',

  // 默认是 false, 设置为 true 来启用
  editLinks: true,
    
  // 默认为 "Edit this page"
  editLinkText: '帮助我们改善此页面！'
}
```

在 docs/zh/guide 目录下新建 create.md，内容即为本文档

## 添加插件

如 back-to-top

```bash
yarn add -D @vuepress/plugin-back-to-top@next
# OR npm install -D @vuepress/plugin-back-to-top@next
```

在 docs/.vuepress/configs 中修改

```js
plugins: [
  ['@vuepress/back-to-top', true],
],
```

官网 [插件](https://v1.vuepress.vuejs.org/zh/plugin/)