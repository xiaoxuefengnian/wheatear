# 部署

以本项目 [wheatear](https://github.com/xiaoxuefengnian/wheatear) 为例

## GitHub Pages

1、在 `docs/.vuepress/config.js` 中设置正确的 `base`。

如果你打算发布到 `https://<USERNAME>.github.io/`，则可以省略这一步，因为 `base` 默认即是 `"/"`。

如果你打算发布到 `https://<USERNAME>.github.io/<REPO>/`

（也就是说你的仓库在 `https://github.com/<USERNAME>/<REPO>`），则将 `base` 设置为 `"/<REPO>/"`。

2、在你的项目中，创建一个如下的 `deploy.sh` 文件

```bash
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
git push -f git@github.com:xiaoxuefengnian/xiaoxuefengnian.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```

3、发布到 `https://<USERNAME>.github.io/`

在 GitHub 上新建一个名为 xiaoxuefengnian.github.io 的仓库，注意必须是 用户名.github.io

以该格式名称创建的仓库会默认开启 GitHub Pages

添加 SSH key 到 GitHub

4、部署到 GitHub

在 deploy.sh 所在目录

```bash
# 执行
bash deploy.sh
```

或者在 package.json 中加入

```json
"scripts": {
  "deploy": "bash deploy.sh"
 }
```

```bash
# 执行
npm run deploy
```

::: warning
如果在 docs/.vuepress/config.js 中采用了默认主题并且配置了 dest ，且配置为了 '.vuepress/dist'，则需要修改为 'docs/.vuepress/dist'，否则新生成的 dist 的路径是 wheatear/.vuepress/dist/
:::
