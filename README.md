# jQuery.extend.gant

在原来的 jQuery.gant.js 上扩展，加入完成进度与超期进度

__数据参数格式：__

```json
{
    "list": [{
        "name": "标题一",
        "startTime": 1514736000000,
        "endTime": 1518192000000,
        "overdueDay": 10,
        "finishPer": "30%"
    }, {
        "name": "标题二",
        "startTime": 1520179200000,
        "endTime": 1528128000000,
        "overdueDay": 0,
        "finishPer": "100%"
    }, {
        "name": "标题三",
        "startTime": 1531152000000,
        "endTime": 1539129600000,
        "overdueDay": 3,
        "finishPer": "95%"
    }]
}
```

__返回参数说明：__

| 参数 | 类型 | 说明 |
| :-----: | :-----: | :------: |
| name | String | 标题名字 |
| startTime | Number | 开始日期的毫秒数 |
| endTime | Number | 结束日期的毫秒数 |
| overdueDay | Number | 超期天数，如果没有超期为 0 天 |
| finishPer | String | 已完成百分之多少 |
