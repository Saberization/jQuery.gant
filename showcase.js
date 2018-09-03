/*
 * @Author: guotq
 * @Date: 2018-08-03 16:07:12
 * @Last Modified by: guotq
 * @Last Modified time: 2018-09-03 14:17:36
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
                        overdueMilliseconds,
                        endDate = item.endDate,
                        startTimeMilliseconds,
                        endTimeMilliseconds,
                        startDate = item.startDate;

                    // 如果接口返回的 startTime 或者 endTime 不是毫秒数的话，而是日期 '2018-3-1' 类似这样的，需要自己转换
                    startTimeMilliseconds = typeof startDate !== 'number' ? new Date(startDate).getTime() : startDate;
                    endTimeMilliseconds = typeof endDate !== 'number' ? new Date(endDate).getTime() : endDate;

                    // 如果超期时间，endDate要延长
                    if (overdueDay) {
                        overdueMilliseconds = getMilliseconds(overdueDay);
                        endTimeMilliseconds = endTimeMilliseconds + overdueMilliseconds;
                    }

                    result.push({
                        name: item.name,
                        values: [{
                            from: getDateTime(startTimeMilliseconds),
                            to: getDateTime(endTimeMilliseconds),
                            label: item.finishPer,
                            customClass: 'default',
                            overdueDay: overdueDay,
                            elapsedDay: item.elapsedDay
                        }]
                    });
                }

                // 渲染Gant
                renderGant(result);
            }
        });
    };

    /**
     * 把天数转换成对应的毫秒数
     * @param {Number}} day 天数
     * @returns {Number} 对应天数的毫秒数
     */
    var getMilliseconds = function (day) {
        return day * 24 * 60 * 60 * 1000;
    };

    // 获取 Gant 数据
    getGant();
}(this, jQuery));