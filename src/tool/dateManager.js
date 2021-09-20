
import moment from 'moment';

export default {
    // 当天
    getNowDay() {
        return {
            startDate: moment().subtract(1, 'day'),
            endDate: moment()
        }
    },
    // 近几天
    getbeforeDay(day) {
        return {
            startDate: moment().subtract(day, 'day'),
            endDate: moment()
        }
    },
    // 本周
    getNowWeek() {
        return {
            startDate: moment().subtract(7, 'day'),
            endDate: moment()
        }
    },
    // 本月
    getNowMonth() {
        return {
            startDate: moment().subtract(1, 'month'),
            endDate: moment()
        }
    },
    // 本季度
    getNowQuarterly() {
        return {
            startDate: moment().subtract(3, 'month'),
            endDate: moment()
        }
    },
    // 半年
    getHalfYear() {
        return {
            startDate: moment().subtract(6, 'month'),
            endDate: moment()
        };
    },
    // 获取一年
    getNowYear() {
        return {
            startDate: moment().subtract(12, 'month'),
            endDate: moment()
        };
    },
    formatDate(value) {
        if (value) {
            return moment(value).format("YYYY-MM-DD HH:mm:ss");
        } else {
            return ''
        }
    },
    formatDate2(value) {
        if (value) {
            return moment(value).format("YYYY-MM-DD");
        } else {
            return ''
        }
    },

    // 字符串转为Date
    getDateByString(value) {
        if (value) {
            return moment(value).toDate();
        } else {
            return null;
        }
    },
    getQueryStartDate(value) {
        if (value) {
            return moment(value).startOf('day').toDate().getTime();
            //new Date(moment(value).format("YYYY-MM-DD") + " 00:00:00").getTime();
        } else {
            return null;
        }
    },

    getQueryEndDate(value) {
        if (value) {
            return moment(value).endOf('day').toDate().getTime();
            //new Date(moment(value).format("YYYY-MM-DD") + " 00:00:00").getTime();
        } else {
            return null;
        }
    }
}
