# windows 指令 tree

## 指令说明

```bash
# tree 查看帮助
D:\Git>tree /?
以图形显示驱动器或路径的文件夹结构。

TREE [drive:][path] [/F] [/A]

   /F   显示每个文件夹中文件的名称。
   /A   使用 ASCII 字符，而不使用扩展字符。
```

## 指令示例

```shell
F:\tree 测试目录>tree
卷 data 的文件夹 PATH 列表
卷序列号为 00000047 9657:6DAF
F:.
├─tree 测试子目录1
└─tree 测试子目录2

F:\tree 测试目录>tree /f
卷 data 的文件夹 PATH 列表
卷序列号为 00000027 9657:6DAF
F:.
├─tree 测试子目录1
│      tree 测试子目录1 文件1.txt
│      tree 测试子目录1 文件2.txt
│
└─tree 测试子目录2
        tree 测试子目录2 文件1.txt
```
