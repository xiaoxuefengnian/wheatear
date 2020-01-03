# GitHub

git 全局用户名、邮箱配置

```bash
git config --global --list
git config --global user.name "github’s Name"
git config --global user.email "github@xx.com"
```

项目根目录下单独配置用户名、邮箱

```bash
git config --list
git config user.name "github’s Name"
git config user.email "github@xx.com"
```

## contributions 贡献图

偶然发现主页上贡献图并没有显示最近的提交，查了一下 [提交统计规则](https://help.github.com/en/github/setting-up-and-managing-your-github-profile/why-are-my-contributions-not-showing-up-on-my-profile)

发现是因为项目配置的邮箱和 github 上的邮箱不一致

## linguist 仓库语言

github 会自动根据仓库中的文件分析出仓库语言，不过有时不准，需要自定义

可以使用 [list-languages](https://developer.github.com/v3/repos/#list-languages) 接口查询分析结果

```http
GET /repos/:owner/:repo/languages
```

以本项目 [wheatear](https://github.com/xiaoxuefengnian/wheatear) 为例，就是

```http
https://api.github.com/repos/xiaoxuefengnian/wheatear/languages
```

如果需要自定义，就在仓库根目录下添加 .gitattributes 文件（就本项目而言，仍需写入其他设置，请继续阅读 linguist 部分）

```
*.js linguist-language=JavaScript
*.css linguist-language=JavaScript
*.html linguist-language=JavaScript
*.vue linguist-language=JavaScript
*.md linguist-language=JavaScript
```

含义是将指定类型的文件标记为特定类型（这里是 JavaScript）

不过，并不会在 github 上立即反映出来，原因详见 [How Linguist works](https://github.com/github/linguist#how-linguist-works)

### linguist

因此，先在本地使用 [linguist](https://github.com/github/linguist#Usage) 统计一下（主要是接口查询后发现只统计到了 shell，想分析下原因）

```bash
# Mac 需要先安装
brew install cmake pkg-config icu4c
# 根据安装完的提示 配置环境变量

# 安装
gem install github-linguist
# 安装结束
```

获取统计结果

```bash
cd /path-to-repository/
github-linguist
```

结果是

```
100.00% Shell
```

显示详细

```bash
github-linguist --breakdown
```

结果是只统计到了 deploy.sh

查看具体文件（比如 docs/README.md ）参数

```bash
git check-attr --all docs/README.md
```

结果是确实已经生效的

```bash
docs/README.md: linguist-language: JavaScript
```

继续查阅文档 [Overrides](https://github.com/github/linguist#Overrides) 部分

首先测试一下，使 deploy.sh 不纳入统计

在 .gitattributes 中只写入

```
deploy.sh linguist-vendored
```

是成功的

::: tip

When testing with a local installation of Linguist, take note that the added attributes will not take effect until the `.gitattributes` file is committed to your repository.

对于 .gitattributes 的改动是在提交后生效

:::

因为代码都在 docs 目录下，所以继续查阅，发现是在 [documentation.yml](https://github.com/github/linguist/blob/master/lib/linguist/documentation.yml) 中将其排除在了统计范围

在 .gitattributes 中写入

```
docs/* linguist-documentation=false
```

成功获得

```
66.70%  JavaScript
32.76%  Vue
0.55%   CSS
```

根据 github-linguist --breakdown 的分析结果设置 .gitattributes 文件（依据 2019.12.02 的目录结构）

```
# 排除 deploy.sh
deploy.sh linguist-vendored

# 将 docs 目录纳入统计
docs/* linguist-documentation=false
```

同步到 github 上

## 将本地项目发布到 GitHub 上

以本项目 wheatear 为例

在 GitHub 上新建一个名为 wheatear 的仓库

在终端打开项目根目录

```bash
# 初始化仓库
git init

# 添加所有文件
git add .

# 提交到本地仓库
git commit -m '第一次提交'

# 添加远程地址
git remote add origin https://github.com/xiaoxuefengnian/wheatear

# 提交到远程分支
git push -u origin master
```

错误处理

```bash
To https://github.com/xiaoxuefengnian/wheatear
 ! [rejected]        master -> master (non-fast-forward)
error: failed to push some refs to 'https://github.com/xiaoxuefengnian/wheatear'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Integrate the remote changes (e.g.
hint: 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

# 解决方案：
git pull --rebase origin master
git push -u origin master
```

## 自定义域名

目的

给 GitHub Pages 绑定一个域名

比如 本项目相关的 xiaoxuefengnian.github.io 仓库 详见【[部署](/zh/搭建/deploy.html)】

其默认域名就是 xiaoxuefengnian.github.io

之前访问项目也是用的这个域名

今天在 [阿里云](https://wanwang.aliyun.com/domain/com) 注册了一个域名 [zhourui.tech](https://www.zhourui.tech) ，十年才不到 200RMB，偷笑一下

**具体设置**

找到 xiaoxuefengnian.github.io 仓库的 Settings 下的 GitHub Pages

设置 Custom domain 为 www.zhourui.tech

在阿里云控制台中对 zhourui.tech 添加 2 条解析记录

记录类型均为 CNAME

主机记录分别为 @ 和 www

记录值均为 xiaoxuefengnian.github.io

TTL 就选默认的 10 分钟，其实不到 10 分钟就可以访问了

**意外之喜**

在国内访问 zhourui.tech 感觉比访问 xiaoxuefengnian.github.io 快了许多

网站分析上也多了一个新的域名

**意外问题**

现有的部署方案会导致 github 仓库的 Settings 重置，每次执行部署后都需要重新设置 Custom domain

在 deploy.sh 中修改

```bash
# 如果是发布到自定义域名
echo 'www.zhourui.tech' > CNAME
```

这种在根目录下写 CNAME 文件的方法同样可以设置自定义域名
