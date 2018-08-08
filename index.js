/*
 * @Author: guotq
 * @Date: 2018-08-03 16:07:12
 * @Last Modified by: guotq
 * @Last Modified time: 2018-08-08 10:32:52
 * @Description: 甘特图数据
 */

(function (win, $) {
    "use strict";

    var getDateTime = function (dateTime) {

        if (typeof dateTime === 'number') {
            return "/Date(" + dateTime + ")/";
        } else if (typeof dateTime === 'string') {
            return "/Date(" + new Date(dateTime).getTime() + ")/";
        }
    };

    var renderGant = function (data) {
        $(".gantt").gantt({
            source: data,
            navigate: "scroll",
            scale: "weeks",
            minScale: "days",
            maxScale: "months",
            waitText: '加载中...',
            months: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
        });
    };

    var getGant = function () {
        var result = [];

        $.ajax({
            url: './data.json',
            type: 'post',
            success: function (res) {
                var list = res.list;

                for (var i = 0, len = list.length; i < len; i++) {
                    var item = list[i],
                        overdueDay = item.overdueDay,
                        endTime = item.endTime,
                        overduePer = '',
                        startTime = item.startTime;

                    // 如果接口返回的 startTime 或者 endTime 不是毫秒数的话，而是日期 '2018-3-1' 类似这样的，需要自己转换
                    startTime = typeof startTime !== 'number' ? new Date(startTime).getTime() : startTime;
                    endTime = typeof endTime !== 'number' ? new Date(endTime).getTime() : endTime;

                    // 如果超期时间，endTime要延长
                    if (overdueDay) {
                        endTime = getOverduemillisecond(endTime, overdueDay);
                        overduePer = ((endTime - item.endTime) / item.endTime * 100).toFixed(2);
                        overduePer = overduePer * 100 + '%';
                    }

                    result.push({
                        name: item.name,
                        values: [{
                            from: getDateTime(item.startTime),
                            to: getDateTime(endTime),
                            label: item.finishPer,
                            customClass: 'default',
                            overduePer: overduePer,
                            finishPer: item.finishPer
                        }]
                    });
                }

                console.log(result);
                // 渲染Gant
                renderGant(result);
            }
        });
    };

    var getOverduemillisecond = function (endTime, overdueDay) {
        return endTime + (overdueDay * 24 * 60 * 60 * 1000);
    };

    // 获取 Gant 数据
    getGant();
}(this, jQuery));