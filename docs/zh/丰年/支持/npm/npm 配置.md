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

## unsafe-perm

官方含义

- Default: false if running as root, true otherwise
- Type: Boolean

Set to true to suppress the UID/GID switching when running package scripts. If set explicitly to false, then installing as a non-root user will fail.

摘自网络回答 [链接](https://segmentfault.com/q/1010000019365121)

> 就是说 npm 出于安全考虑不支持以 root 用户运行，即使你用 root 用户身份运行了，npm 会自动转成一个叫 nobody 的用户来运行，而这个用户几乎没有任何权限。这样的话如果你脚本里有一些需要权限的操作，比如写文件（尤其是写 /root/.node-gyp），就会崩掉了。
>
> 为了避免这种情况，要么按照 npm 的规矩来，专门建一个用于运行 npm 的高权限用户；要么加 --unsafe-perm 参数，这样就不会切换到 nobody 上，运行时是哪个用户就是哪个用户，即使是 root。

默认 false 会在某些依赖包安装时提示权限不足。
