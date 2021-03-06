# 评论

以本项目 [wheatear](https://github.com/xiaoxuefengnian/wheatear) 为例

目的 加入评论功能

## Gitalk

[gitalk 的项目地址](https://github.com/gitalk/gitalk/blob/master/readme-cn.md) 好用 star 一下

### 仓库

::: danger

由于 vuepress 为静态页面类型的网站，clientID/clientSecret 存在泄露风险

建议新开一个空账户放置评论

:::

::: danger

由于 Gitalk 申请的 public_repo 权限过高，详见[问题](https://github.com/gitalk/gitalk/issues/95) [隐患](https://www.v2ex.com/t/535608)

谨慎授权，可以去我的评论仓库的 [issues](https://github.com/xiaoxuefengnian-open/wheatear-talk/issues/3) 下评论

This application will be able to read and write all public repository data. This includes the following:

Code
Issues
Pull requests
Wikis
Settings
Webhooks and services
Deploy key

:::

在 GIthub 上新建一个公共仓库存放评论，如 wheatear-talk，在仓库的 settings 中将 issues 勾选上（默认是勾选的）

### 注册

注册 GitHub OAuth application

登录 GitHub - 用户头像 - settings - Developer settings - OAuth Apps - register a new application

[快速注册](https://github.com/settings/applications/new)

填写示例

```bash
# Application name
wheatear-talk

# Homepage URL
https://xiaoxuefengnian.github.io

# Application Description
wheatear talk

# Authorization callback URL
https://xiaoxuefengnian.github.io
```

注册后将获得一个 Client ID 和 Client Secret

### 组件

npm i --save gitalk

这里以组件的方式引入

在 docs/.vuepress/theme/components/ 目录下新建 Gitalk.vue，代码如下

```vue
<template>
  <div id="gitalk-container"></div>
</template>

<script>
import Gitalk from "gitalk";
import "gitalk/dist/gitalk.css";

export default {
  data() {
    return {
      // gitalk 主要参数
      config: {
        clientID: "注册的 Client ID",
        clientSecret: "注册的 Client Secret",
        repo: "wheatear-talk",
        owner: "xiaoxuefengnian-open",
        admin: ["xiaoxuefengnian-open"],
        id: window.location.pathname
      }
    };
  },
  mounted() {
    const gitalk = new Gitalk(this.config);
    gitalk.render("gitalk-container");
  }
};
</script>
```

::: tip

请先了解 vuepress 的自定义主题部分，或者查看上一篇 主题

:::

### 引入

目的是在每篇文章的最后插入评论

查看 docs/.vuepress/theme/layouts/Layout.vue 发现内容组件为 Page.vue

查看默认组件的 Page.vue，发现存在 slot="bottom" 的插槽

于是在 Layout.vue 中加入或修改如下代码

```vue
// 引入 import Gitalk from '@theme/components/Gitalk.vue' components: { Home,
Page, Sidebar, Navbar, Gitalk }

<Page v-else :sidebar-items="sidebarItems">
  <slot name="page-top"
        slot="top" />
  <slot name="page-bottom"
        slot="bottom">
    <Gitalk></Gitalk>
  </slot>
</Page>
```

返回页面发现已成功添加，不过宽度撑开，需要调整样式

比较 Page.vue 及默认主题的样式文件之一 wrapper.styl 中的样式代码，在 Gitalk.vue 中加入如下 class

```vue
<template>
  <div id="gitalk-container" class="gitalk-container"></div>
</template>

<style lang="stylus" scope>
.gitalk-container
  max-width $contentWidth
  margin 0 auto
  padding 0 2.5rem 2rem 2.5rem
  @media (max-width: $MQNarrow)
    padding 0 2rem 2rem 2rem
  @media (max-width: $MQMobileNarrow)
    padding 0 1.5rem 1.5rem 1.5rem
</style>
```

### 错误解决

初始化时 提示 未找到相关的 Issues 进行评论

请求 https://api.github.com/user

回复 401(Unauthorized)

处理 退出 github 账户的登录，再从评论处登录，会跳转到授权页面，用对这个评论仓库有写权限的用户（如 config.admin 中的一个）登录进行授权。

### 更新

### 2020.04.12

因为 github 的获取评论接口在国内不稳定，所以暂时不显示评论功能
