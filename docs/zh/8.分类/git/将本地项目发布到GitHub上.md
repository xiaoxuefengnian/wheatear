# 将本地项目发布到GitHub上

以本项目 wheatear 为例

在 GitHub上新建一个名为 wheatear 的仓库

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
$ git pull --rebase origin master
$ git push -u origin master
```
