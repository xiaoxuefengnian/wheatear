# mac 使用 nginx

## 安装

使用 [homebrew](https://brew.sh/index_zh-cn.html)

```bash
# 查看在 homebrew 源中是否存在 nginx
brew search nginx

# 查看信息
brew info nginx

# 安装
brew install nginx
```

当前安装的是 1.19.3 版本

## 配置

```bash
# 打开安装目录
open /usr/local/Cellar/nginx

# 打开配置目录
open /usr/local/etc/nginx/
```

默认网站目录 /usr/local/Cellar/nginx/1.19.3/html 其指向 /usr/local/var/www

配置文件位置 /usr/local/etc/nginx/nginx.conf

注意 需要配置网站目录的访问权限

## 指令

```bash
# 启动
nginx

# 停止
nginx -s stop

# 详细指令
-?,-h         : this help
-v            : show version and exit
-V            : show version and configure options then exit
-t            : test configuration and exit
-T            : test configuration, dump it and exit
-q            : suppress non-error messages during configuration testing
-s signal     : send signal to a master process: stop, quit, reopen, reload
-p prefix     : set prefix path (default: /usr/local/Cellar/nginx/1.19.3/)
-c filename   : set configuration file (default: /usr/local/etc/nginx/nginx.conf)
-g directives : set global directives out of configuration file
```

