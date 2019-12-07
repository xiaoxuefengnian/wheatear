# mac 使用 zsh

macOS 升级到 10.15 catalina 后，提示 The default interactive shell is now zsh.

```bash
# 切换bash
chsh -s /bin/bash

# 切换zsh
chsh -s /bin/zsh
```

## 安装 oh-my-zsh

[oh-my-zsh](https://github.com/robbyrussell/oh-my-zsh)

```bash
# 通过 curl
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

# 通过 wget
sh -c "$(wget -O- https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

## 主题 Agnoster

打开文件 ~/.zshrc

```bash
# 修改 ZSH_THEME
ZSH_THEME="agnoster"
```

Agnoster 主题需要 Powerline 字体库的支持 [参考](https://www.jianshu.com/p/0894cd4643fc)

```bash
# 安装 powerline 字体
git clone https://github.com/powerline/fonts.git --depth=1
cd fonts
./install.sh

# 删除文件夹
cd ..
rm -rf fonts
```

```bash
# 执行以下代码判断
echo "\ue0b0 \u00b1 \ue0a0 \u27a6 \u2718 \u26a1 \u2699"
```

此时部分图标仍是问号，继续执行以下操作

## 修改 终端 字体

终端 -- 偏好设置 -- 描述文件 -- 字体 -- 所有字体 -- Meslo LG L DZ for Powerline

## 修改 vscode 字体

**mac**

vscode -- 设置 -- 搜索 terminal.integrated.fontFamily -- 填入 Meslo LG L DZ for Powerline

**linux** [参考](https://blog.zhaytam.com/2019/04/19/powerline-and-zshs-agnoster-theme-in-vs-code/)

```bash
# Clone the github repository
git clone https://github.com/abertsch/Menlo-for-Powerline.git

# Move the font to the fonts folder
sudo mv "Menlo for Powerline.ttf" /usr/share/fonts/

# Refresh the fonts cache
sudo fc-cache -vf /usr/share/fonts/
```

然后 vscode -- 设置 -- 搜索 terminal.integrated.fontFamily -- 填入 Menlo for Powerline

## npm 等失效

将 ~/.bashrc 或 ~/.bash_profile 中的配置复制到 ~/.zshrc 中，然后执行

```bash
source ~/.zshrc
```
