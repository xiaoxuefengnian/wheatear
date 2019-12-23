# 插件

以本项目 [wheatear](https://github.com/xiaoxuefengnian/wheatear) 为例

目的

为目录/文件排序提供一个可用的 node 服务器

因为 vuepress 本身在 dev 下已经使用了 webpack-dev-server 作为开发环境的服务器

所以考虑直接使用该 server 而不是再新建一个

## 开发插件

新建 docs/.vuepress/plugins/ 目录用于存放插件

在目录下新建插件目录 docs/.vuepress/plugins/nav-sort-server

在 nav-sort-server 目录下新建 index.js

```javascript

```

## 引入插件

在 docs/.vuepress/config.js 中添加

```javascript
plugins: [
  [require('./plugins/nav-sort-server')],
],
```
