# 多语言

::: danger

在当前只将文档目录配置在了 zh/ 目录下的情况下，不建议使用

需在 docs/ 目录下配置一份文档目录，否则如 localhost:8080 将无法匹配到路由

::: 

以加入中文为例

 编辑 docs/.vuepress/config.js 中的 locales

```javascript
locales: {
  // 键名是该语言所属的子路径
  // 作为特例，默认语言可以使用 '/' 作为其路径。
  '/zh/': {
    lang: 'zh-CN',
  }
},
```

::: warning

此时需将代表默认主题首页的 docs/README.md 移动至 docs/zh/ 目录下

:::

官网 [多语言支持](https://v1.vuepress.vuejs.org/zh/guide/i18n.html)

在 locales: undefined 的情况下，如果配置了 @vuepress/last-updated 插件，将 lang 赋值为 zh-CN