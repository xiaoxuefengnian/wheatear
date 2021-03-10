# electron 下载安装慢问题

## 问题描述

mac 下 全局安装 electron

```bash
npm install electron -g --unsafe-perm=true --allow-root
```

过程中需下载一个叫 electron-v11.1.0-darwin-x64.zip 的安装包，速度很慢，甚至下载失败。

## 解决方案

访问 https://npm.taobao.org/mirrors/electron/

下载 electron-v11.1.0-darwin-x64.zip 和 SHASUMS256.txt 文件，注意版本和使用平台

修改 SHASUMS256.txt 文件名为 SHASUMS256.txt-11.1.0（添加版本后缀）

将两个文件拷贝到以下路径

```bash
# Mac OS
# 该路径默认隐藏，可以使用 command + shift + . 快捷键切换隐藏文件夹的显示和隐藏
currentUser/.electron/

# Windows
# 该路径默认隐藏，可以勾选【查看->隐藏的项目】来显示
C:\Users\user\AppData\Local\electron\Cache
```

重新执行 electron 的安装指令即可
