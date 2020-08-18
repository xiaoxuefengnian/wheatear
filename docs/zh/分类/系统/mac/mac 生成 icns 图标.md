# mac 生成 icns 图标

## png 转 icns

假设源图片名称为 pic.png（ 1024 \* 1024 为佳）

- 创建一个临时目录存放不同大小的图片，须为 .iconset 后缀

```bash
mkdir tmp.iconset
```

- 将源图片转为不同大小的图片，并存入上面的临时目录

```bash
# 全部拷贝到命令行回车执行
sips -z 16 16 pic.png --out tmp.iconset/icon_16x16.png
sips -z 32 32 pic.png --out tmp.iconset/icon_16x16@2x.png
sips -z 32 32 pic.png --out tmp.iconset/icon_32x32.png
sips -z 64 64 pic.png --out tmp.iconset/icon_32x32@2x.png
sips -z 128 128 pic.png --out tmp.iconset/icon_128x128.png
sips -z 256 256 pic.png --out tmp.iconset/icon_128x128@2x.png
sips -z 256 256 pic.png --out tmp.iconset/icon_256x256.png
sips -z 512 512 pic.png --out tmp.iconset/icon_256x256@2x.png
sips -z 512 512 pic.png --out tmp.iconset/icon_512x512.png
sips -z 1024 1024 pic.png --out tmp.iconset/icon_512x512@2x.png
```

- 通过 iconutil 生成 icns 文件

```bash
 iconutil -c icns tmp.iconset -o pic.icns
```

此时目录下的 pic.icns 即为目标图标
