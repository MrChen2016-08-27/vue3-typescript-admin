<template>
    <div class="page-flex-header">
        <div class="left-flex">
            <el-button @click="addAction('formInline')" type="primary">新增</el-button>
            <slot name="left-action" ></slot>
        </div>
        <div class="seach-header-bar">
            <el-input class="input-text" v-model="keyword" @change="changeKeyword"></el-input>
            <el-button @click="search" class="header-right-action-btn" circle type="primary" icon="el-icon-search"></el-button>
            <el-button @click="reset" class="header-right-action-btn" circle icon="el-icon-refresh-left"></el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
     
        };
    },
    props: {
        // 跳转 route push方法的参数对象
        pushObject: {
            type: Object,
            default: null
        },
        // 输入框关键字
        keyword: {
            type: String
        }
    },
    emits: ['add-action', 'search', 'update:keyword'],
    methods: {
        addAction() {
            this.$emit('add-action');
        },
        search() {
            this.$emit('search');
        },
        reset() {
            this.$emit('reset');
        },
        changeKeyword(value) {
            this.$emit('update:keyword', value);
        }
    }
}
</script>

<style lang="less" scoped>

</style>