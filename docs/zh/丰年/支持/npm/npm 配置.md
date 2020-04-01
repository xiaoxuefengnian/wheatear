# npm 配置

使用 npm config ls 可以查看 npm 的配置信息如下

registry: npm 安装地址

user-agent: 用户环境

prefix: 模块安装位置

node bin location: node 的安装位置

cwd: 当前路径

HOME: 用户主目录

```bash
; cli configs
metrics-registry = "https://registry.npm.taobao.org/"
scope = ""
user-agent = "npm/6.9.0 node/v11.2.0 darwin x64"

; userconfig /Users/zhourui/.npmrc
prefix = "/Users/zhourui/Depository/npm-global"
registry = "https://registry.npm.taobao.org/"

; node bin location = /usr/local/bin/node
; cwd = /Users/zhourui/Desktop/personal/documents/wheatear
; HOME = /Users/zhourui
; "npm config ls -l" to show all defaults.
```

## 修改模块安装位置

```bash
npm config set prefix /Users/zhourui/depository/npm-global
```

修改后在使用中可能出现仍然安装在原路径的情况，这时执行

```bash
npm config get cache

# 清空 npm 缓存
npm cache clean -f

# 验证缓存数据的有效性和完整性，清理垃圾数据
npm cache verify
```
