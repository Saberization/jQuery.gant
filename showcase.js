/*
 * @Author: guotq
 * @Date: 2018-08-03 16:07:12
 * @Last Modified by: guotq
 * @Last Modified time: 2018-08-16 09:35:44
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
            allYear: false,
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
                        overduePer = '',
                        elapsedPer = '',
                        startTimeMilliseconds,
                        endTimeMilliseconds,
                        elapsedDate = item.elapsedDate,
                        startDate = item.startDate,
                        intervalMilliseconds;

                    // 如果接口返回的 startTime 或者 endTime 不是毫秒数的话，而是日期 '2018-3-1' 类似这样的，需要自己转换
                    startTimeMilliseconds = typeof startDate !== 'number' ? new Date(startDate).getTime() : startDate;
                    endTimeMilliseconds = typeof endDate !== 'number' ? new Date(endDate).getTime() : endDate;

                    // 如果超期时间，endDate要延长
                    if (overdueDay) {
                        overdueMilliseconds = getMilliseconds(overdueDay);
                        endTimeMilliseconds = endTimeMilliseconds + overdueMilliseconds;
                        intervalMilliseconds = endTimeMilliseconds - startTimeMilliseconds;
                        
                        overduePer = getPer(overdueMilliseconds, intervalMilliseconds);
                    }

                    elapsedPer = getPer(getMilliseconds(elapsedDate), intervalMilliseconds);

                    result.push({
                        name: item.name,
                        values: [{
                            from: getDateTime(startTimeMilliseconds),
                            to: getDateTime(endTimeMilliseconds),
                            label: item.finishPer,
                            customClass: 'default',
                            overduePer: overduePer,
                            elapsedPer: elapsedPer
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
    var getMilliseconds = function(day) {
        return day * 24 * 60 * 60 * 1000;
    };

    var getPer = function(milliseconds, intervalMilliseconds) {
        return (milliseconds / intervalMilliseconds).toFixed(2) * 100 + '%';
    };

    // 获取 Gant 数据
    getGant();
}(this, jQuery));