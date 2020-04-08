const { nav, sidebar } = require('./nav/zh');

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
  description: '最大的一穗就是你刚刚摘下的',

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
  temp: 'node_modules/@vuepress/core/.temp',

  /**
   * 指定 vuepress build 的输出目录
   * 类型: string
   * 默认值: .vuepress/dist
   */
  dest: 'docs/.vuepress/dist',

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
  // theme: undefined,

  /**
   * 为当前的主题提供一些配置，这些选项依赖于你正在使用的主题
   * 类型: Object
   * 默认值: {}
   */
  themeConfig: {
    // 导航栏
    nav,

    // 侧边栏
    sidebar,

    // 是否启用内置搜索, 默认是 false
    search: true,

    // 内置搜索框显示的搜索结果数量
    searchMaxSuggestions: 10,

    // 最后更新时间
    lastUpdated: '更新时间', // string | boolean

    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'xiaoxuefengnian/wheatear',

    // 以下为可选的编辑链接选项

    // 假如你的文档仓库和项目本身不在一个仓库：
    docsRepo: 'xiaoxuefengnian/wheatear',

    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',

    // 假如文档放在一个特定的分支下：
    docsBranch: 'master',

    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    // repoLabel: '查看源码',

    // 默认是 false, 设置为 true 来启用
    editLinks: false,

    // 默认为 "Edit this page"
    editLinkText: '编辑文档'
  },

  /**
   * markdown 配置
   * 类型: Object
   * 默认值: {}
   */
  markdown: {
    // 是否在每个代码块的左侧显示行号
    // lineNumbers: true
  },


  /**
   * 插件
   * 类型: Object|Array
   * 默认值: undefined
   */
  plugins: [
    ['@vuepress/back-to-top', true],
    ['@vuepress/nprogress'],
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          // 不要忘了安装 moment
          const moment = require('moment')
          moment.locale('zh-CN')
          return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
        }
      }
    ],
    [
      '@vuepress/google-analytics',
      {
        'ga': 'UA-145771476-1' // Google Analytics ID 
      }
    ],
    ['@vuepress/medium-zoom'],

    [require('./plugins/nav-sort-server')],
    [require('./plugins/last-updated-files')],
  ],

  /**
   * 如果你的对象只有那些 “常青树” 浏览器，你可以将其设置成 true
   * 这将会禁止 ESNext 到 ES5 的转译以及对 IE 的 polyfills，同时会带来更快的构建速度和更小的文件体积
   * 类型: boolean|Function
   * 默认值: false  
   */
  evergreen: false,
}