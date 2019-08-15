# 离线安装 npm 包

目的 在离线环境下引入所需的 npm 包

## npm-bundle

以打包 moment 为例

在联网机器上安装 npm-bundle 工具

```bash
npm install -g npm-bundle
```

打包 moment

```bash
npm-bundle moment
```

会在当前路径下生成一个 .tgz 的包文件，这里是 moment-2.24.0.tgz

复制到目标服务器/电脑的相应目录安装

```bash
npm install ./moment-2.24.0.tgz
```

需要注意的是在 package-lock.json 中该包的源是本地路径

