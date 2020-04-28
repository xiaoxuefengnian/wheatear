# 404 页面

虽然 vuepress 自带的 404 页面简单明了，但感觉过于单调了

想拥有自己风格的 404 页面

## 理念

Tencent CDC 关于 404 页面的思考 [Hello! 404](https://cdc.tencent.com/2010/09/02/hello-404/) 中指出

**良好的 404 页面应该遵循的理念**

① 提供简明的问题描述，用轻松的话语消除访客的挫败感，使得访客转到某个地方而不是后退。

② 提供合理的解决方案，辅助访客完成访问目标。

③ 提供个性化的友好界面，提升访问体验。

## 思路

### 问题描述

您正在找的麦穗似乎刚刚被人摘下

### 解决方案

在附近找找

-- 提供搜索

去主人家看看

-- 返回首页

看看主人最近的收获

-- 提供最近发布/更新文章

### 访问体验

文案使用动画按序延迟加载

## 页面

新建 docs/.vuepress/theme/layouts/404.vue

写出自己喜欢的 404 页面就好了，这里就不贴代码了

## 常见问题

### GitHub Pages 或 Gitee Pages 部署后 404 页面不生效

GitHub Pages 官方文档 [为 GitHub Pages 站点创建自定义 404 页面](https://help.github.com/cn/github/working-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)

Gitee Pages 官方解答 [常见问题 -- 如何自定义404](https://gitee.com/help/articles/4136#article-header1)

根源在于 build 后的 dist 根目录下没有 404.html

```
.
├── assets
├── img
├── index.html
├── live2d
└── zh
```

而 vuepress 在开发环境下是可以显示我们设置的 404.vue 的
