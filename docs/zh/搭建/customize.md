# 主题

以本项目 [wheatear](https://github.com/xiaoxuefengnian/wheatear) 为例

Vuepress 的默认主题是 @vuepress/theme-default

## 继承默认主题

这里期望修改首页，且首页保留导航栏，其他页面保持不变

可以在 docs/README.md 中配置 layout 来实现

这里则采用继承默认主题，再修改首页的方式

打开项目根目录

```bash
# 将默认主题复制到 .vuepress/theme 目录，以供自定义
vuepress eject

# 也可以直接复制到 docs/ 目录下
vuepress eject docs
```

查看 [约定的目录结构](https://v1.vuepress.vuejs.org/zh/theme/writing-a-theme.html#目录结构)

在 docs/.vuepress/ 下添加 theme 目录，结构如下

```bash
theme
├── components
│   └── Home.vue
├── index.js
├── layouts
│   └── Layout.vue
└── util
    └── index.js
```

其中 Home.vue，Layout.vue，util/index.js 复制默认主题内容，并将其中引用组件的路径修改为引用父主题，例如

```javascript
import Navbar from '@theme/components/Navbar.vue'
// 修改为
import Navbar from '@parent-theme/components/Navbar.vue'
```

theme/index.js 内容如下

```javascript
module.exports = {
  extend: '@vuepress/theme-default'
}
```

按自己的需要编辑 Home.vue

::: tip

组件的覆盖，最好直接基于父主题中对应组件的代码来修改；

目前，在本地开发子主题，每次创建或移除组件时，需要手动重启 Dev Server。

:::

::: tip

建议将下载下来的默认主题重命名（如 theme-default ）并使用 .gitignore 忽略，以供后续陆续覆盖相应组件

:::

## 颜色 样式

想修改下主题色

通过搜索默认主题的16进制颜色码 #3eaf7c 在 /wheatear/node_modules/@vuepress/core/lib/client/style/config.styl 中找到如下配置

```stylus
$accentColor = #3eaf7c
```

搜索 client/style/config.styl，在 /wheatear/node_modules/@vuepress/core/lib/node/internal-plugins/palette/index.js 中找到对该文件的引用

```javascript
const configFile = ctx.getLibFilePath('client/style/config.styl')

// 往下看代码发现
const userPalette = path.resolve(sourceDir,'.vuepress/styles/palette.styl')
```

继续往下分析代码发现，确实是这里的 userPalette 引入了用户配置来覆盖默认配置，因此我们可以通过配置 docs/.vuepress/styles/palette.styl 文件来修改主题色，忽然想起官网的 [目录结构](https://v1.vuepress.vuejs.org/zh/guide/directory-structure.html) 有提及。

对照 /wheatear/node_modules/@vuepress/core/lib/client/style/config.styl 的代码

```stylus
// colors
$accentColor = #3eaf7c
$textColor = #2c3e50
$borderColor = #eaecef
$codeBgColor = #282c34
$arrowBgColor = #ccc

// layout
$navbarHeight = 3.6rem
$sidebarWidth = 20rem
$contentWidth = 740px

// responsive breakpoints
$MQNarrow = 959px
$MQMobile = 719px
$MQMobileNarrow = 419px

// code
$lineNumbersWrapperWidth = 3.5rem
$codeLang = js ts html md vue css sass scss less stylus go java c sh yaml py docker dockerfile makefile

@import '~@temp/palette.styl'

```

来重新赋值颜色变量即可

比如我修改主题色和 gitalk 的主色调一致

```stylus
$accentColor = #6190e8
```

## 自定义背景色

### 2020.01.05

在 docs/.vuepress/styles/palette.styl 中增加

```stylus
$borderColor = #d3d3d3;
// 自定义颜色
$huyandanhuang = #f5f5d5; // 245, 245, 213
$huyandanlv = #c7edcc; // 199, 237, 204
// 自定义配置
$bgColor = $huyandanhuang;
```

新增文件 docs/.vuepress/styles/index.styl

```stylus
@require './palette.styl';

html, body {
  background-color: $bgColor;
}

.navbar {
  background-color: $bgColor;

  .links {
    background-color: $bgColor;
  }
}

.sidebar {
  background-color: $bgColor;
}

```

复制默认主题导航组件到 docs/.vuepress/theme/components/Navbar.vue

```stylus
// 删除以下样式
.navbar
  .links
    background-color white
```

将对 Navbar.vue 的引用由 @parent-theme 改为 @theme

重启环境后生效