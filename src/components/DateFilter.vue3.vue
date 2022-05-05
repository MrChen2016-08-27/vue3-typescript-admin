<template>
    <div class="date-filter">
        <el-radio-group v-model="dateState.selectVal">
            <el-radio-button :label="null">全部</el-radio-button>
            <el-radio-button :label="1">今天</el-radio-button>
            <el-radio-button :label="2">近三天</el-radio-button>
            <el-radio-button :label="3">近一周</el-radio-button>
            <el-radio-button :label="4">近一个月</el-radio-button>
            <el-radio-button :label="5">自定义周期</el-radio-button>
        </el-radio-group>
        <div style="display: inline-block;" v-show="dateState.selectVal == 5">
            <el-date-picker
                :value="dateState.selectDateArray"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeDateRange"
            ></el-date-picker>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, Ref, reactive } from 'vue';
import dateManager from '../tool/dateManager';

interface DateStateInterface {
    startDate: string | number | Date | null,
    endDate: string | number | Date | null,
    selectVal: string | number | Date | null,
    selectDateArray: Array<string | number | Date>,
};

interface changeDateResultInterface {
    startDate: string | number | Date | null,
    endDate: string | number | Date | null,
}

let dateState = reactive(<DateStateInterface>{
    startDate: null,
    endDate: null,
    selectVal: null,
    selectDateArray: []
});

const emit = defineEmits<{
    (e: 'changeDate', dateResult: changeDateResultInterface): void
}>()

const changeDateRange = (dateVals: Array<Date>) => {
    dateState.selectDateArray = dateVals;
    dateState.startDate = dateVals[0];
    dateState.endDate = dateVals[1];
    emit("changeDate", {
        startDate: dateManager.getQueryStartDate(dateState.startDate),
        endDate: dateManager.getQueryEndDate(dateState.endDate)
    });
};

const changeSelectDate = (selectVal: number) => {
    dateState.selectVal = selectVal;
    if (selectVal == 5) {
        return;
    }
    switch (selectVal) {
        case 1:
            dateState.startDate = dateManager.getNowDay().startDate;
            dateState.endDate = dateManager.getNowDay().endDate;
            break;
        case 2:
            dateState.startDate = dateManager.getbeforeDay(3).startDate;
            dateState.endDate = dateManager.getbeforeDay(3).endDate;
            break;
        case 3:
            dateState.startDate = dateManager.getNowWeek().startDate;
            dateState.endDate = dateManager.getNowWeek().endDate;
            break;
        case 4:
            dateState.startDate = dateManager.getNowMonth().startDate;
            dateState.endDate = dateManager.getNowMonth().endDate;
            break;
        default:
            dateState.startDate = null;
            dateState.endDate = null;
            break;
    }

    emit("changeDate", {
        startDate: dateManager.getQueryStartDate(dateState.startDate),
        endDate: dateManager.getQueryEndDate(dateState.endDate)
    });
}

</script>