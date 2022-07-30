import moment from "moment";

export default {
    // 当天
    getNowDay() {
        return {
            startDate: moment().startOf("day"),
            endDate: moment().endOf("day"),
        };
    },
    // 近几天
    getbeforeDay(day: number) {
        return {
            startDate: moment().subtract(day, "day").startOf("day"),
            endDate: moment().endOf("day"),
        };
    },
    // 本周
    getNowWeek() {
        return {
            startDate: moment().subtract(7, "day").startOf("day"),
            endDate: moment().endOf("day"),
        };
    },
    // 本月
    getNowMonth() {
        return {
            startDate: moment().subtract(1, "month").startOf("day"),
            endDate: moment().endOf("day"),
        };
    },
    // 本季度
    getNowQuarterly() {
        return {
            startDate: moment().subtract(3, "month").startOf("day"),
            endDate: moment().endOf("day"),
        };
    },
    // 半年
    getHalfYear() {
        return {
            startDate: moment().subtract(6, "month").startOf("day"),
            endDate: moment().endOf("day"),
        };
    },
    // 获取一年
    getNowYear() {
        return {
            startDate: moment().subtract(12, "month").startOf("day"),
            endDate: moment().endOf("day"),
        };
    },
    formatDate(value: any) {
        if (value) {
            return moment(value).format("YYYY-MM-DD HH:mm:ss");
        } else {
            return "";
        }
    },
    formatDate2(value: any) {
        if (value) {
            return moment(value).format("YYYY-MM-DD");
        } else {
            return "";
        }
    },

    // 字符串转为Date
    getDateByString(value: any) {
        if (value) {
            return moment(value).toDate();
        } else {
            return null;
        }
    },
    getQueryStartDate(value: any) {
        if (value) {
            return moment(value).startOf("day").toDate().getTime();
            //new Date(moment(value).format("YYYY-MM-DD") + " 00:00:00").getTime();
        } else {
            return null;
        }
    },

    getQueryEndDate(value: any) {
        if (value) {
            return moment(value).endOf("day").toDate().getTime();
            //new Date(moment(value).format("YYYY-MM-DD") + " 00:00:00").getTime();
        } else {
            return null;
        }
    },
} as any;
