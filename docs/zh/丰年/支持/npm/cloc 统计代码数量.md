# cloc 统计代码数量

cloc counts blank lines, comment lines, and physical lines of source code in many programming languages.

cloc 可以统计项目使用几种语言

每种语言多少个文件（files），多少空行（blank），多少注释（comment），多少代码（code）

[仓库地址](https://github.com/AlDanial/cloc)

## 安装

```bash
npm install -g cloc                    # https://www.npmjs.com/package/cloc
sudo apt install cloc                  # Debian, Ubuntu
sudo yum install cloc                  # Red Hat, Fedora
sudo dnf install cloc                  # Fedora 22 or later
sudo pacman -S cloc                    # Arch
sudo emerge -av dev-util/cloc          # Gentoo https://packages.gentoo.org/packages/dev-util/cloc
sudo apk add cloc                      # Alpine Linux
sudo pkg install cloc                  # FreeBSD
sudo port install cloc                 # Mac OS X with MacPorts
brew install cloc                      # Mac OS X with Homebrew
choco install cloc                     # Windows with Chocolatey
scoop install cloc                     # Windows with Scoop
```

## 使用

**a file**

```shell
prompt> cloc hello.c
       1 text file.
       1 unique file.
       0 files ignored.

https://github.com/AlDanial/cloc v 1.65  T=0.04 s (28.3 files/s, 340.0 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
C                                1              0              7              5
-------------------------------------------------------------------------------
```

**a directory**

```
prompt> cloc gcc-5.2.0/gcc/c
      16 text files.
      15 unique files.
       3 files ignored.

https://github.com/AlDanial/cloc v 1.65  T=0.23 s (57.1 files/s, 188914.0 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
C                               10           4680           6621          30812
C/C++ Header                     3             99            286            496
-------------------------------------------------------------------------------
SUM:                            13           4779           6907          31308
-------------------------------------------------------------------------------
```

**an archive**

We'll pull cloc's source zip file from GitHub, then count the contents:

```
prompt> wget https://github.com/AlDanial/cloc/archive/master.zip

prompt> cloc master.zip
https://github.com/AlDanial/cloc v 1.65  T=0.07 s (26.8 files/s, 141370.3 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
Perl                             2            725           1103           8713
-------------------------------------------------------------------------------
SUM:                             2            725           1103           8713
-------------------------------------------------------------------------------
```

**a git repository, using a specific commit**

This example uses code from [PuDB](https://pypi.python.org/pypi/pudb), a fantastic Python debugger.

```
prompt> git clone http://git.tiker.net/trees/pudb.git

prompt> cd pudb

prompt> cloc 6be804e07a5db
      48 text files.
      48 unique files.
      15 files ignored.

github.com/AlDanial/cloc v 1.73  T=0.15 s (223.1 files/s, 46159.0 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
Python                          28           1519            728           4659
YAML                             2              9              2             75
Bourne Shell                     3              6              0             17
make                             1              4              6             10
-------------------------------------------------------------------------------
SUM:                            34           1538            736           4761
-------------------------------------------------------------------------------
```

## 参数

指定不需要统计的目录 --exclude-dir=.cache,test

指定不需要统计的语言 --exclude-lang=CSS

其他使用 cloc --help 查看或查看 [帮助文档](https://github.com/AlDanial/cloc#options)
