### iphone 模拟定位

[非越狱修改手机定位](https://www.cnblogs.com/guwudao/p/8996270.html)

需要一台装有 Xcode 的 Mac 和一台非越狱的 iPhone

1、Xcode 中新建一个项目，创建一个 gpx 文件

2、修改 gpx 文件上面的经纬度坐标

3、选择 scheme，Product -- Scheme -- Edit Scheme

4、Default Location 选中你的 gpx file

5、iphone 连上 mac 进行 build（有线、同局域网无线、iPhone 热点）

6、添加信任

设置 -- 通用 -- 设备管理 --> 信任

启用后，位置将一直为模拟位置，保持几分钟后自动复原

手机重启可复原
