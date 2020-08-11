# js 获取 mac 地址

## getmac

[bevry/getmac](https://github.com/bevry/getmac)

安装及引入

```javascript
npm

Install: npm install --save getmac
Import: import pkg from ('getmac')
Require: const pkg = require('getmac').default
```

使用

```javascript
const mac = pkg();
```

查本机 mac

windows

```bash
getmac
```

macos

```bash
ifconfig en0 ether
```
