# mac 自带 svn

::: warning
在 xcode 某次更新后（比如 12.0.1 版本），自带 svn 已无法使用。<br />
The subversion command line tools are no longer provided by Xcode。<br />
需自行安装。<br />
brew install subversion
:::

## 1.1 mac 自带 svn

在 Windows 环境中，我们一般使用 TortoiseSVN 来搭建 svn 环境。在 Mac 环境下，由于 Mac 自带了 svn 的服务器端和客户端功能，所以我们可以在不装任何第三方软件的前提下使用 svn 功能，不过还需做一下简单的配置。

## 1.2 创建 svn 仓库

示例：

在/User/apple 目录下新建一个 svn 目录（以后可以在 svn 目录下创建多个仓库目录）

打开终端，创建一个 mycode 仓库，输入指令：svnadmin create /Users/apple/svn/mycode

指令执行成功后，会发现硬盘上多了个/Users/apple/svn/mycode 目录

### 1.2.1 配置用户权限

主要是修改/svn/mycode/conf 目录下的三个文件

1.打开 svnserve.conf，将下列配置项前面的#和空格都去掉

```java
# anon-access = read
# auth-access = write
# password-db = passwd
# authz-db = authz
```

anon-access = read 代表匿名访问的时候是只读的，若改为 anon-access = none 代表禁止匿名访问，需要帐号密码才能访问

2.打开 passwd，在[users]下面添加帐号和密码，比如：

```java
[users]
mj = 123
jj = 456
```

帐号是 mj，密码是 123

3.打开 authz，配置用户组和权限

我们可以将在 passwd 里添加的用户分配到不同的用户组里，以后的话，就可以对不同用户组设置不同的权限，没有必要对每个用户进行单独设置权限。

在[groups]下面添加组名和用户名，多个用户之间用逗号(,)隔开

```java
[groups]
topgroup = mj,jj
```

说明 mj 和 jj 都是属于 topgroup 这个组的，接下来再进行权限配置。

使用[/]代表 svn 服务器中的所有资源库

```java
[/]
@topgroup = rw
```

上面的配置说明 topgroup 这个组中的所有用户对所有资源库都有读写(rw)权限，组名前面要用@

如果是用户名，不用加@，比如 mj 这个用户有读写权限

```java
[/]
mj = rw
```

至于其他精细的权限控制，可以参考 authz 文件中的其他内容

### 1.2.2 启动 svn 服务器

前面配置了这么多，最关键还是看能否正常启动服务器，若启动不来，前面做再多工作也是徒劳。

在终端输入下列指令：svnserve -d -r /Users/apple/svn

或者输入：svnserve -d -r /Users/apple/svn/mycode

没有任何提示就说明启动成功了

### 1.2.3 关闭 svn 服务器

如果你想要关闭 svn 服务器，最有效的办法是打开实用工具里面的“活动监视器”，退出 svnserve 进程

## 1.3 使用 svn

### 1.3.1 从本地导入代码到服务器(第一次初始化导入)

在终端中输入

svn import /Users/apple/Documents/eclipse_workspace/weibo svn://localhost/mycode/weibo --username=mj --password=123 -m "初始化导入"

指令含义：将/Users/apple/Documents/eclipse_workspace/weibo 中的所有内容，上传到服务器 mycode 仓库的 weibo 目录下，后面双引号中的"初始化导入"是注释

### 1.3.2 从服务器端下载代码到客户端本地

在终端中输入 svn checkout svn://localhost/mycode --username=mj --password=123 /Users/apple/Documents/code

指令含义：将服务器中 mycode 仓库的内容下载到/Users/apple/Documents/code 目录中

### 1.3.3 提交更改过的代码到服务器

在步骤 1.3.2 中已经将服务器端的代码都下载到/Users/apple/Documents/code 目录中，现在修改下里面的一些代码，然后提交这些修改到服务器

1> 打开终端，先定位到/Users/apple/Documents/code 目录，输入：cd/Users/apple/Documents/code

2> 输入提交指令：svn commit -m "修改了 main.m 文件"

这个指令会将/Users/apple/Documents/code 下的所有修改都同步到服务器端，假如这次我只修改了 main.文件

可以看到终端的打印信息

```java
Sending weibo/weibo/main.m
Transmitting file data .
Committed revision 2.
```

### 1.3.4 更新服务器端的代码到客户端

在终端中定位到客户端代码目录后，比如上面的/Users/apple/Documents/code 目录，然后再输入指令：svn update

### 1.3.5 svn 的其他用法

在终端输入：svn help

指令后面括号中的内容的一般代表着指令的简称，比如我们可以用 svn ci 代替 svn commit，用 svn co 代替 svn checkout
