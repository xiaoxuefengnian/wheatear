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

## 仓库语言

github 会自动根据仓库中的文件分析出仓库语言，不过有时不准，需要自定义

可以使用 [list-languages](https://developer.github.com/v3/repos/#list-languages) 接口查询分析结果

```http
GET /repos/:owner/:repo/languages
```

以本项目 wheatear 为例，就是

```http
https://api.github.com/repos/xiaoxuefengnian/wheatear/languages
```

如果需要自定义，就在仓库根目录下添加 .gitattributes 文件

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

100.00% Shell

```bash
# 显示详细
github-linguist --breakdown
```

结果是只统计到了 deploy.sh
