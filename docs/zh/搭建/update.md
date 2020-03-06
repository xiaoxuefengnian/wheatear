# 升级

vuepress 升级踩坑记

最初为 vuepress 1.0.3

## 1.3.1

### 错误解决

**Error: EROFS: read-only file system, mkdir '/path'**

修改 docs/.vuepress/config.js

```javascript
// 原为默认配置 /path/to/@vuepress/core/.temp
temp: 'node_modules/@vuepress/core/.temp',
// 亦可修改为 temp: ''
```

依据为 node_modules/@vuepress/core/lib/node/createTemp.js

```javascript
if (!tempPath) {
  tempPath = path.resolve(__dirname, "../../.temp");
} else {
  tempPath = path.resolve(tempPath);
}
```

正确处理好路径即可。一开始看到只读，往权限方面思考，绕了一大段弯路。
