# js 字符串转 base64 及解析

## nodejs

```javascript
const str = "123abc";

// 转为 base64
const strToBase64 = new Buffer.from(str, "utf-8").toString("base64");
// MTIzYWJj

// 解析 base64
const base64ToStr = new Buffer.from(strToBase64, "base64").toString();
// 123abc
```

## js

window 对象中

btoa() 方法用于创建一个 base-64 编码的字符串。

该方法使用 "A-Z", "a-z", "0-9", "+", "/" 和 "=" 字符来编码字符串。

atob() 方法用于解码使用 base-64 编码的字符串。

```javascript
const str = "123abc";

// 转为 base64
const strToBase64 = window.btoa(str);
// MTIzYWJj

// 解析 base64
const base64ToStr = window.atob(strToBase64);
// 123abc
```
