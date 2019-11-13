# electron

先简单快速了解下

[一个小时内构建一个 Electron 应用【中英双语】](https://www.bilibili.com/video/av65972154?from=search&seid=9625749770332205007)

[使用 electron 构建跨平台 Node.js 桌面应用经验分享](https://www.zhangxinxu.com/wordpress/2017/05/electron-node-js-desktop-application-experience/)

**参考**

[使用 electron 代理包装 web 网站](https://hacpai.com/article/1536561975474)

[限定用户只能通过专有机器访问网站](https://hacpai.com/article/1536118267393)

[百度不限速下载器 BND2 技术架构简介](https://hacpai.com/article/1535277215816)

[Electron 应用实战 (架构篇)](https://zhuanlan.zhihu.com/p/24275216)

## 官网

[文档](https://electronjs.org/docs)

[国内镜像](https://electronjs.org/docs/tutorial/installation)

## 多标签页

不侵入现有代码的方案

1、拦截弹窗请求

2、实现一个多标签的壳

**参考**

[electron-navigation](https://github.com/simply-coded/electron-navigation?utm_source=hacpai.com)（版本很老，但基本实现，可以使用，也可以借鉴一下思路）

[electron-tabs](https://github.com/brrd/electron-tabs)（版本很老，当前环境下无法实现，排除）

**实现**

监听 webview 的 new-window 事件

启用 webview 需要设置

```javascript
webPreferences: {
  webviewTag: true;
}
```

## 图标

应用图标在打包时配置

## 发布

**参考**

[Electron packager tutorial](https://www.christianengvall.se/electron-packager-tutorial/)

注意不同的系统对应不同的图标文件 [iconarchive 图标网站](http://www.iconarchive.com)

可以添加并修改如下脚本到 package.json 中

```json
"scripts": {
  "package-mac": "electron-packager . electron-tutorial-app --overwrite --platform=darwin --arch=x64 --icon=assets/icons/mac/icon.icns --prune=true --out=release-builds",
  "package-win": "electron-packager . electron-tutorial-app --overwrite --asar --platform=win32 --arch=ia32 --icon=assets/icons/win/icon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName=\"Electron Tutorial App\"",
  "package-linux": "electron-packager . electron-tutorial-app --overwrite --asar --platform=linux --arch=x64 --icon=assets/icons/png/1024x1024.png --prune=true --out=release-builds"
 }
}
```

. 打包目录为当前目录

electron-tutorial-app 应用名称

platform 平台

icon 应用图标

out 打包后的应用存放目录

## 自动更新

## 常见问题

### 打包慢，无反应

electron-packager 在当前机器的首次打包前，会下载 electron 的预编译文件至当前用户，而 electron-prebuilder 的默认源在国外，在网络不好的情况下，即便有代理，速度也会非常慢。

```bash
# 更换阿里镜像源
npm config set ELECTRON_MIRROR https://npm.taobao.org/mirrors/electron/
```

### 安装时出现权限问题

[npm 安装 electron 死活安不上](https://v2ex.com/t/616680)

windows 下安装 electron-packager 出现权限问题 operation not permitted

删除 C:\Users\\{账户}\ 下的 .npmrc 文件

只设置淘宝源，不设置 electron 的阿里镜像源
