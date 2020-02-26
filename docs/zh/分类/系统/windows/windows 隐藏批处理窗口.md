# windows 隐藏批处理窗口

目的 通过批处理文件执行程序时，希望对用户不可见，或者对于一直运行的程序（如在开机启动时打开 node 服务器）能够隐藏窗口

## 批处理 方案

在 .bat 文件前面加入以下代码，注意不要擅自添加空格

```bash
if "%1"=="h" goto begin
mshta vbscript:CreateObject("WScript.Shell").Run("""%~nx0""h",0)(window.close)&&exit
:begin
```

[run 函数参数说明](<https://docs.microsoft.com/en-us/previous-versions//d5fk67ky(v=vs.85)?redirectedfrom=MSDN>)

正常双击文件使用没问题，但放在开机启动项中自动执行时会因执行环境未加载好而出现错误

## nodejs 方案

通过独立子进程的方式运行 server.js

```javascript
// 添加 运行 server 的子进程

const {
  fork
} = require('child_process');

const childProcess = fork('server.js', {
  cwd: process.cwd(),
  detached: true,
})

console.log('serverProcess pid ', childProcess.pid, '\n');

let timeout
let count = 3;
const countdown = () => {
  console.log(`该界面将在 ${count} s 后自动关闭`);
  count--;
  timeout = setTimeout(() => {
    if (count <= 0) {
      clearTimeout(timeout);
      process.kill(process.pid);
    }
    countdown();
  }, 1000);
}

countdown()
```

可在开机启动项中使用 node 启用