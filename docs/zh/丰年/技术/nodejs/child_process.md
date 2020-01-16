# child_process 子进程

## 常见问题

### spawn npm ENOENT

示例 如执行

```javascript
const { spawn } = require("child_process");
const path = require("path");
const child = spawn("npm", ["run", "build"], {
  cwd: path.resolve(__dirname)
});
```

报错 spawn npm ENOENT

[参考](https://stackoverflow.com/questions/17516772/using-nodejss-spawn-causes-unknown-option-and-error-spawn-enoent-err)

需要基于运行的系统环境配置 npm

```javascript
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const child = spawn("npm", ["run", "build"], {
  cwd: path.resolve(__dirname)
});
```
