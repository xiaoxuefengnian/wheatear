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

在仓库根目录下添加 .gitattributes 文件

```
*.js linguist-language=javascript
*.css linguist-language=javascript
*.html linguist-language=javascript
*.vue linguist-language=javascript
*.md linguist-language=javascript
```

含义是将指定类型的文件标记为特定类型（这里是 javascript）
