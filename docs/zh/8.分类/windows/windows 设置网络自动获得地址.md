# windows 设置网络自动获得地址

目的 设置网络自动获得地址，解决每次重启后都要手动设置网络 ip 的问题（如果存在这种情况的话）

## bat 文件

新生成一个 .bat 文件，代码如下

```bash
@echo off
netsh interface ip set address name="以太网" dhcp
```

name="以太网" 设置对应的网络名称

将 .bat 文件放到开机启动目录下

C:\Users\user\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup

这里的 user 为用户名

## 设置自动获取 dns

```bash
netsh interface ip set dns name="以太网" dhcp
```
