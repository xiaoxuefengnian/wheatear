# visual studio code

## 常见问题

### Problems loading reference

**Problems loading reference 'https://schemastore.azurewebsites.net/schemas/json/package.json': getaddrinfo ENOTFOUND schemastore.azurewebsites.net schemastore.azurewebsites.net:443**

[#48298](https://github.com/Microsoft/vscode/issues/48298) [stackflow](https://stackoverflow.com/questions/49056000/all-of-my-json-files-have-problems-loading-reference-schema-from-schemastore-az)

在 用户设置 中添加并修改

```json
"http.proxy": "http://username:password@hostname:port/",
"http.proxyAuthorization": null,
"http.proxyStrictSSL": true
```
