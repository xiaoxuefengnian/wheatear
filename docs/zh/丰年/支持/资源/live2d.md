# live2d

这种明明是 2D 平面设计风格，却有 3D 行为交互的效果就是 live2d。

参考 [二次元 live2d 看板娘效果中的 web 前端技术](https://www.zhangxinxu.com/wordpress/2018/05/live2d-web-webgl-js/)

## SDK

从 [CubismSDK 下载地址](https://www.live2d.com/zh-CHS/download/cubism-sdk/#sdk5) 下载 Cubism SDK for Web

使用 tree 指令查看 CubismSdkForWeb-4-beta.2 的目录

```
.
├── CHANGELOG.md
├── Core
│   ├── CHANGELOG.md
│   ├── LICENSE.md
│   ├── README.md
│   ├── RedistributableFiles.txt
│   ├── live2dcubismcore.d.ts
│   ├── live2dcubismcore.js
│   ├── live2dcubismcore.js.map
│   └── live2dcubismcore.min.js
├── Framework
│   ├── cubismdefaultparameterid.ts
│   ├── cubismframeworkconfig.ts
│   ├── cubismmodelsettingjson.ts
│   ├── effect
│   ├── icubismallcator.ts
│   ├── icubismmodelsetting.ts
│   ├── id
│   ├── live2dcubismframework.ts
│   ├── math
│   ├── model
│   ├── motion
│   ├── physics
│   ├── rendering
│   ├── tsconfig.json
│   ├── type
│   └── utils
├── NOTICE.md
├── README.md
├── Sample
│   └── TypeScript
├── cubism-info.yml
├── framework.webpack.config.js
├── package-lock.json
├── package.json
└── sample.webpack.config.js
```

查看 package.json 的脚本

```json
"scripts": {
    "build-framework": "npx webpack --config framework.webpack.config.js",
    "watch-framework": "npx webpack --watch --config framework.webpack.config.js",
    "build-sample": "npx webpack --config sample.webpack.config.js",
    "watch-sample": "npx webpack --watch --config sample.webpack.config.js",
    "build-all": "npm-run-all build-framework build-sample",
    "watch-all": "npm-run-all watch-framework watch-sample",
    "serve": "serve"
  },
```

执行以下命令

```bash
npm install
npm run build-samp
npm run serve
```

打开 http://localhost:5000/Sample/TypeScript/Demo/

便可看到示例效果，点击右上角设置按钮可以切换示例

## viewer

下载 [Viewer for Unity](https://www.live2d.com/zh-CHS/download/)

可以导入模型文件查看、编辑等

比如导入 CubismSdkForWeb-4-beta.2/Sample/TypeScript/Demo/Resources/Rice/Rice.model3.json

mac 上打开会默认全屏（command + F 切换全屏）

## 使用

Demo 目录结构

```
.
├── Resources
│   ├── Haru
│   ├── Hiyori
│   ├── Mark
│   ├── Natori
│   ├── Rice
│   ├── back_class_normal.png
│   └── icon_gear.png
├── dist
│   └── index.js
├── index.html
├── src
│   ├── lappdefine.ts
│   ├── lappdelegate.ts
│   ├── lapplive2dmanager.ts
│   ├── lappmodel.ts
│   ├── lapppal.ts
│   ├── lappsprite.ts
│   ├── lapptexturemanager.ts
│   ├── lappview.ts
│   ├── main.ts
│   └── touchmanager.ts
└── tsconfig.json
```

将 Demo 目录单独拿出来

修改下 Demo/index.html 中 live2dcubismcore.min.js 的地址就可以直接使用

因此可以参考这个结构，修改相关代码就可以方便地引入到自己的项目中

在 Demo/dist/index.js 中

```javascript
// 背景图
LAppDefine.BackImageName = "back_class_normal.png";

// 模型目录
LAppDefine.ModelDir = ["Haru", "Hiyori", "Mark", "Natori", "Rice"];
```

## 参考

一些链接，需注意 cubism 的版本

[二次元 live2d 看板娘效果中的 web 前端技术](https://www.zhangxinxu.com/wordpress/2018/05/live2d-web-webgl-js/)

[给博客添加能动的看板娘(Live2D)-关于模型的二三事](https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-01)

[给博客添加能动的看板娘(Live2D)-将其添加到网页上吧](https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-02)

[给博客添加能动的看板娘(Live2D)-模型格式 v3 转 v2](https://imjad.cn/archives/lab/add-dynamic-poster-girl-with-live2d-to-your-blog-03)

[EYHN/hexo-helper-live2d](https://github.com/EYHN/hexo-helper-live2d)
