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
