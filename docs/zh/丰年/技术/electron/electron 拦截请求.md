# electron 拦截请求

目的

1、用 electron 封装一个客户端，只能请求固定的 URL，且只有特定的设备可以使用

2、因为开始用的 nginx 服务器设置了鉴权，且封装后的客户端无法弹出输入用户和密码的框，所以需要绕过鉴权

## 请求拦截器

electron 提供了 [WebRequest](https://www.electronjs.org/docs/api/web-request) 类，在一个请求生命周期的不同阶段，截取和修改其内容。

在请求头中附加一些信息，方法如下

```javascript
const { session } = require("electron");

const filter = {
  // targetURL 目标 URL
  urls: [`${targetURL}/*`]
};

session.defaultSession.webRequest.onBeforeSendHeaders(
  filter,
  (details, callback) => {
    // 在请求头中附带转码后的用户和密码
    // 格式为 'Basic' + 空格 + 'name:password'的 base64 编码
    // 示例为 用户 abc 密码 123456
    details.requestHeaders["Authorization"] = "Basic YWJjOjEyMzQ1Ng==";
    callback({ requestHeaders: details.requestHeaders });
  }
);
```

## 获取 mac

我们使用 mac 来标识不同的设备

借助运行在设备上的客户端，我们可以直接获取到 mac，具体见 [getmac](/zh/丰年/技术/nodejs/js%20获取%20mac%20地址.html#getmac)

将获取到的 mac 附带到请求头里带回
