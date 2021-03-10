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

## HTTPS 证书

Key 是私用秘钥，通常是 RSA 算法
Csr 是证书请求文件，用于申请证书
Crt 是 CA 认证后的证书文件，签署人用自己的 key 给你签署凭证

### 生成密钥和证书

```bash
# 打开 nginx 配置文件目录
cd /usr/local/etc/nginx

# 创建服务器私钥
openssl genrsa -out server.key（起的私钥名字） 1024

# 根据私钥生成证书申请，创建签名请求的证书（CSR）
openssl req -new -key server.key（起的私钥名字）-out server.csr（证书名字）

# 根据提示填入 Country，Province 等信息
# 最重要的是有一个 common name，可以写你的名字或者域名
# 如果为了申请 https 域名，这个必须和域名吻合，否则会引发浏览器警报

# 备份服务器密钥文件
cp server.key server.key.org

# 去除文件口令
openssl rsa -in server.key.org -out server.key

# 生成证书文件server.crt
openssl x509 -req -in server.csr -out server.crt -signkey server.key -days 3650
```

### 修改 nginx 配置

修改/usr/local/etc/nginx/nginx.conf 文件

```nginx
ssl_certificate      server.crt; # server.crt 文件位置
ssl_certificate_key  server.key; # server.key 文件位置
```

### 重启 nginx

```bash
nginx -s reload
```

### 修改 hosts 文件

hosts 文件是本地的 IP 和 域名的一个对应解析，在进行网站未上线之前的测试经常需要用到。

```bash
vi /private/etc/hosts
127.0.0.1  test.com  # 需要配置的域名
```

在浏览器输入配置好的域名即可访问
