# windows 隐藏批处理窗口

目的 通过批处理文件执行程序时，希望对用户不可见，或者对于一直运行的程序（如在开机启动时打开 node 服务器）能够隐藏窗口

## 代码

在 .bat 文件前面加入以下代码，注意不要擅自添加空格

```bash
if "%1"=="h" goto begin
mshta vbscript:CreateObject("WScript.Shell").Run("""%~nx0""h",0)(window.close)&&exit
:begin
```

[run 函数参数说明](<https://docs.microsoft.com/en-us/previous-versions//d5fk67ky(v=vs.85)?redirectedfrom=MSDN>)
