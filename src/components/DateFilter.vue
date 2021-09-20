<template>
    <div class="date-filter">
        <el-radio-group v-model="selectVal">
            <el-radio-button :label="null">全部</el-radio-button>
            <el-radio-button :label="1">今天</el-radio-button>
            <el-radio-button :label="2">近三天</el-radio-button>
            <el-radio-button :label="3">近一周</el-radio-button>
            <el-radio-button :label="4">近一个月</el-radio-button>
            <el-radio-button :label="5">自定义周期</el-radio-button>
        </el-radio-group>
        <div style="display: inline-block;" v-show="selectVal == 5">
            <el-date-picker
                :value="selectDateArray"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeDateRange"
            >
            </el-date-picker>

        </div>
    </div>
</template>

<script>
import dateManager from '@/tool/dateManager';

export default {
    data() {
        return {
            startDate: null,
            endDate: null,
            selectVal: null,
            selectDateArray: []
        }
    },
    emits: ['changeDate'],
    methods: {
        changeDateRange(dateVals) {
            this.selectDateArray = dateVals;
            this.startDate = dateVals[0];
            this.endDate = dateVals[1];
            this.$emit("changeDate", {
                startDate: dateManager.getQueryStartDate(this.startDate),
                endDate:  dateManager.getQueryEndDate(this.endDate)
            });
        },
        changeSelectDate (selectVal) {
            this.selectVal = selectVal;
            if (selectVal == 5) {
                return;
            }
            switch (selectVal) {
                case 1:
                    this.startDate = dateManager.getNowDay().startDate;
                    this.endDate = dateManager.getNowDay().endDate;
                    break;
                case 2:
                    this.startDate = dateManager.getbeforeDay(3).startDate;
                    this.endDate = dateManager.getbeforeDay(3).endDate;
                    break;
                case 3:
                    this.startDate = dateManager.getNowWeek().startDate;
                    this.endDate = dateManager.getNowWeek().endDate;
                    break;
                case 4:
                    this.startDate = dateManager.getNowMonth().startDate;
                    this.endDate = dateManager.getNowMonth().endDate;
                    break;
                default:
                    this.startDate = null;
                    this.endDate = null;
                    break;
            }

            this.$emit("changeDate", {
                startDate: dateManager.getQueryStartDate(this.startDate),
                endDate:  dateManager.getQueryEndDate(this.endDate)
            });
        }
    }
}
</script>