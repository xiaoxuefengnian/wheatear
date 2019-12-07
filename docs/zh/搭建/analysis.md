# 网站分析

以本项目 [wheatear](https://github.com/xiaoxuefengnian/wheatear) 为例

## Google Analytics

[注册地址](https://analytics.google.com/analytics/web/provision/?authuser=0#/provision)

添加插件 google-analytics

```bash
yarn add -D @vuepress/plugin-google-analytics@next
# OR npm install -D @vuepress/plugin-google-analytics@next
```

在 docs/.vuepress/configs 中使用

```json
(module.exports = {
  "plugins": [
    [
      "@vuepress/google-analytics",
      {
        "ga": "" // UA-00000000-0 Google Analytics ID
      }
    ]
  ]
})
```

生产环境下可在控制台的网络中查看是否有 analytics.js 请求来判断是否已成功安装

## 百度统计

[注册地址](https://tongji.baidu.com/sc-web/)

在 docs/.vuepress/theme/ 中添加 analysis/ 目录，并在 analysis/ 下添加 BaiduTongji.vue，代码如下

```vue
<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    const _hmt = _hmt || [];
    (function() {
      const hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?这里填入你的id";
      const s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
  }
};
</script>
```

在 docs/.vuepress/theme/layouts/Layout.vue 中引入

在 单页应用设置 中 启用单页应用数据统计

[手动检查代码是否已安装](https://tongji.baidu.com/web/help/article?id=93&type=0)

开发环境/生产环境下可在控制台的网络中查看是否有 hm.js? 请求来判断是否已成功安装
