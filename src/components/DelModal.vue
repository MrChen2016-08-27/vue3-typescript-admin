<template>

    <el-dialog
        title="删除提醒"
        :model-value="modelValue"
        @update:modelValue="(val) => changeModalShow(val)"
        width="40%"
    >
        <span>该操作将删除&nbsp;{{ delName }}&nbsp;</span>
        <p>您是否要删除?</p>
        <template #footer>
            <span class="dialog-footer">
            <el-button :loading="delLoading" @click="changeModalShow(false)">取 消</el-button>
            <el-button type="danger" :loading="delLoading" @click="deleteItem">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            delLoading: false,
            dialogVisible: false,
        }
    },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        delName: [Number, String],
        deleteMethod: {
            type: Function
        },
        delId: {
            type: [Number, String],
            require: true
        },
    },
    emits: ['deleteSuccess', 'update:modelValue'],
    methods: {
        async deleteItem() {
            this.delLoading = true
            console.log('delId', this.delId);
            await this.deleteMethod(this.delId)
            this.delLoading = false
            this.$emit("update:modelValue", false)
            this.$emit("deleteSuccess")
        },
        changeModalShow(value) {
            this.$emit("update:modelValue", value)
        }
    }
}
</script>