# Git

[Git book](https://git-scm.com/book/zh/v2)

## 常用指令

[Git-命令-快照基础](https://git-scm.com/book/zh/v2/附录-C%3A-Git-命令-快照基础)

```bash
# 查看状态
git status

# 添加所有文件
git add .

# 提交并添加注释
git commit -m "提交注释"

# 推送到远程分支
git push
```

图形化操作工具 gitk

```bash
# 仓库目录下输入 gitk 命令即可打开
gitk
```

## 特殊情形

### 撤回 commit

```bash
# 撤回 commit 操作，代码仍然保留
git reset --soft HEAD^
```

HEAD^ 的意思是上一个版本，也可以写成 HEAD~1

如果你进行了 2 次 commit，想都撤回，可以使用 HEAD~2

**参数**

--mixed

不删除工作空间改动代码，撤销 commit，并且撤销 git add . 操作
这个为默认参数，git reset --mixed HEAD^ 和 git reset HEAD^ 效果是一样的

--soft

不删除工作空间改动代码，撤销 commit，不撤销 git add .

--hard

删除工作空间改动代码，撤销 commit，撤销 git add .

注意完成这个操作后，就恢复到了上一次的 commit 状态

**其他**

如果 commit 注释写错了，只是想改一下注释，只需要：

git commit --amend

此时会进入默认 vim 编辑器，修改注释完毕后保存
