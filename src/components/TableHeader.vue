<template>
    <div class="page-flex-header">
        <div class="left-flex">
            <el-button @click="emit('add-action')" type="primary">新增</el-button>
            <slot name="left-action" ></slot>
        </div>
        <div class="seach-header-bar">
            {{ cacheKeyword }}
            <el-input class="input-text" :modelValue="getInputValue" @input="changeKeyword" @keyup.enter="emit('search', getInputValue)" ></el-input>
            <el-button @click="emit('search', getInputValue)" class="header-right-action-btn" circle type="primary" :icon="Search"></el-button>
            <el-button @click="resetAction()" class="header-right-action-btn" circle :icon="Refresh"></el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Search, Refresh } from '@element-plus/icons-vue';
import { computed, ref, Ref } from 'vue';

let cacheKeyword = '';

/**
 * @ 输入框内容修改
 * @param value 改变内容
 * 
 */
function changeKeyword(value: string) {
    emit('update:keyword', value);
    cacheKeyword = value;
    console.log('cacheKeyword', getInputValue.value);
}


function resetAction() {
    changeKeyword('');
    emit('reset');
}

/**
 * 返回input的内容，如果传递了
 *  */
const getInputValue = computed<string>(() => {
    if (props.keyword && props.keyword != '') {
        return props.keyword;
    }
    return cacheKeyword;
});


const props = withDefaults(defineProps<{
    // 输入框内容
    keyword: string | null
}>(), {
    keyword: ''
});



const emit = defineEmits<{
    (event: 'add-action'): void,
    (event: 'search', keyword: string): void,
    (event: 'reset'): void,
    (event: 'update:keyword', keyword: string): void
}>(); 


</script>

<style lang="less" scoped>

</style>