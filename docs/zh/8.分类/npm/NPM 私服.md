# npm 私服

目的 内网使用

## Nexus 3 Repository Manager

这里以 win64 环境为例 [参考](https://www.jianshu.com/p/1674a6bc1c12)

### 添加仓库

1、[官网下载](https://www.sonatype.com/download-nexus-repo-oss?hsCtaTracking=bde424ac-b77c-4799-913d-9d0db86ef1f8%7Cb308aaca-ab41-4544-ba23-c53c1b469e0d)，解压到任意位置

2、管理员运行 cmd ， 切换到 nexus-3.18.1-01/bin 目录

```bash
# 运行
nexus.exe /install 
# 成功后会提示 
Installed service 'nexus‘

# 启动服务
nexus.exe /run
# 启动完成会提示
Started Sonatype Nexus OSS 3.18.1-01
```

3、等待启动完毕后，进入 http://127.0.0.1:8081, 点击右上角 Sign In 登陆

默认账号： admin 

密码：在解压后目录的sonatype-work\nexus3\admin.password

4、重置 admin 的密码，如 admin123

5、设置匿名访问的权限 configure anonymous access

6、点击左上角设置图标切换到 Administration，选择 Repository -- Repositories

7、点击 create repository

npm(group) 表示分组，npm(hosted) 表示本机私有，npm(proxy) 表示远程代理。

若 registry 配置为 group( 包括 hosted 和 proxy )，首先会从 hosted 取，若无则从 proxy 取并缓存，下次则会从缓存取。

8、创建 npm(proxy) 用于将包请求代理到指定地址， Name 填入 npm-proxy，remote storage 填入 https://registry.npm.taobao.org 或 https://registry.npmjs.org

9、创建 npm(hosted) 用于存放自己的私有包，Name 填入 npm-hosted 

10、创建 npm(group)，Name 填入 npm-group，下面 Members 里选择之前添加的 2 个移动到右边，如果左边的列表中没有，点一下右上角的刷新按钮

### 配置 npm 源

```bash
npm config set registry http://localhost:8081/repository/npm-group/

# 引入一个项目中未引入过的包，如 空项目中引入 jquery，查看 fetch 地址是否为私服地址
npm --loglevel info install jquery
```

浏览器中  http://127.0.0.1:8081 中 Browse -- Search -- npm 下可查看已缓存的包

### 常见错误

Unable to authenticate, need: BASIC realm="Sonatype Nexus Repository Manager"

登录 http://127.0.0.1:8081，勾上 Administration -- Secturity -- Anonymous 中的 Allow anonymous users to access the server