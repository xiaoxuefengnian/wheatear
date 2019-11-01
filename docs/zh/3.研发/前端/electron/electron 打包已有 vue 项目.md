# electron 打包已有 vue 项目

假设 已有 vue 项目的目录是 targetVue/

1、安装 electron 和 electron-packager

```bash
npm install electron --save-dev
npm install electron-packager -g
```

2、新建文件 targetVue/electronmain.js

这里 electronmain.js 作为 electron 的入口文件，文件名可以修改，只要保证在项目中是一致的即可

```javascript
const electron = require("electron");

// node.js 模块
const url = require("url");
const path = require("path");

const { app, BrowserWindow } = electron;

let mainWindow;

// 监听 应用 ready
app.on("ready", () => {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({});

  // dev || prod
  mainWindow.loadFile(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: null,
      slashes: true
    })
  );
  // 或
  // mainWindow.loadFile(`${__dirname}/index.html`);

  // 打开开发者工具
  // mainWindow.webContents.openDevTools();

  // 当 window 被关闭，这个事件会被触发。
  mainWindow.on("closed", () => {
    app.quit();
  });
});
```

3、修改 targetVue/config/index.js 中 build 的 assetsPublicPath

```javascript
 build:{
   assetsPublicPath: './', // 这里 / 改为 ./
 }
```

4、修改 targetVue/package.json

添加如下脚本

```json
{
  "main": "electronmain.js",
  "scripts": {
    "electron_cp": "cp electronmain.js dist/ && cp package.json dist/",
    "electron_dev": "npm run build && npm run electron_cp && electron dist/electronmain.js",
    "electron_build": "npm run build && npm run electron_cp && electron-packager ./dist/ test --out release --overwrite"
  }
}
```

main：electron 入口文件，缺失的话 build 后的应用会报错

electron_cp：复制执行 electron 必要的文件。实际上 targetVue/electronmain.js 并不是必要的，不过为了方便在没有 dist 目录前设置，就通过复制的方法传入 targetVue/dist/

electron_dev：开发环境

electron_build：打包生产环境

electron-packager：./dist/表示将 dist 目录下所有文件打包 test 表示打包之后的名字 --out 表示输出 release 表示输出路径 --overwrite 表示覆盖

最终打完的包在 targetVue/release/ 目录下

5、这里只是进行了简单的打包，实际过程中还需要继续丰富入口文件的代码，并对项目中的部分功能进行改写。
