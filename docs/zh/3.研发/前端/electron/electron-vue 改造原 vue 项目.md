# electron-vue 改造原 vue 项目

通过 [electron-vue 的 gitbook](https://simulatedgreg.gitbooks.io/electron-vue/content/cn/) 了解其项目结构

## 1、选择理由

开发环境下可以热更新，这点就够了

## 2、分析

**改造的不利点**

a、项目树结构不一致，如 src 目录下细分 main 和 renderer

b、因为有些依赖包是使用指定版本的关系，需要重新配置 package.json

**改造的有利点**

a、webpack 的配置中 @ 的路径是 src/renderer，不需要再去配置

b、文件树结构及引用关系同 vue 项目下基本一致

## 3、改造步骤

**a、处理依赖包**

删除 package-lock.json

比对 package.json

npm install

**b、处理 main.js**

npm run dev

比对修改 main.js

**c、处理原 src 目录**

和 src/renderer 目录比对增量添加

utils - store - api - router - components

**d、处理静态文件**

注意检查各页面样式

**e、修改 eslint 规则**

**f、修改 dev 的端口**

默认是 9080，改成自己配置的测试原 vue 项目 build 后的文件的端口

## 4、常见错误

### vuex 的 dispatch 无法使用

[参考](https://segmentfault.com/a/1190000018038529?utm_source=tag-newest)

注释掉 store 目录下 index.js 的 createSharedMutations 插件。

或

在主进程中加上了这一句：

```javascript
import "../renderer/store";
```

### 开发环境设置代理

[参考](https://blog.csdn.net/qq_32614411/article/details/80882131)

在 .electron-vue/dev-runner.js 文件中引入 http-proxy-middleware 中间件

```javascript
const httpProxyMiddleware = require("http-proxy-middleware");
```

在 server.listen(9080) 之前添加代码

```javascript
server.use(
  httpProxyMiddleware({
    target: "目标服务器地址",
    changeOrigin: true
  })
);
server.listen(9080);
```

对于原 vue 项目中形如

```javascript
proxyTable: {
      '/**/*': {
        target: 'http://192.168.1.1:8080/', // 目标接口域名
        changeOrigin: true // 是否跨域
      }
    }

```

则写为

```javascript
server.use(
  httpProxyMiddleware("/**/*", {
    target: "http://192.168.1.1:8080/", // 目标接口域名
    changeOrigin: true // 是否跨域
  })
);
```

### animate.css 引入报错

在原 vue 项目中

```javascript
// main.js 中引入
import animated from "animate.css";

// 使用
Vue.use(animated);
```

会报错，类似于

Uncaught SyntaxError: Invalid or unexpected token

解决方案，在 .electron-vue/webpack.renderer.config.js 的 whiteListedModules 中加入 'animate.css'

### element-ui 样式错误

常见如组件不显示，table 高度为 0 等

在 .electron-vue/webpack.renderer.config.js 的 whiteListedModules 中加入 'element-ui'
