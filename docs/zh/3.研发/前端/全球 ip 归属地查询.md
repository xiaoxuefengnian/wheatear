# 全球 ip 归属地查询

例如 用于判断 ip 是否属于海外

方法 获取请求 ip 后，通过（第三方）ip 库判读归属

## 淘宝 ip 地址库

[接口说明](http://ip.taobao.com/instructions.html)

请求接口（GET）：
http://ip.taobao.com/service/getIpInfo.php?ip=[ip地址字串]

响应信息：
（json 格式的）国家 、省（自治区或直辖市）、市（县）、运营商

返回数据格式：

```json
// 例 http://ip.taobao.com/service/getIpInfo.php?ip=140.205.220.96
// 其中code的值的含义为，0：成功，1：失败。{
  "code": 0,
  "data": {
    "ip": "140.205.220.96",
    "country": "中国",
    "area": "",
    "region": "上海",
    "city": "上海",
    "county": "XX",
    "isp": "阿里巴巴",
    "country_id": "CN",
    "area_id": "",
    "region_id": "310000",
    "city_id": "310100",
    "county_id": "xx",
    "isp_id": "100098"
  }
}
```
