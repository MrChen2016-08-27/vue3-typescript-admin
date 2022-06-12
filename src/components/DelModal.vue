<template>

    <el-dialog title="操作提示" :model-value="modelValue" @update:modelValue="(val: boolean) => changeModalVisible(val)"
        width="40%">
        <label>即将删除&nbsp;{{ visibleState.delActionName }}&nbsp;</label>
        <p>您是否要删除?</p>
        <template #footer>
            <span class="dialog-footer">
                <el-button :loading="visibleState.delLoading" @click="changeModalVisible(false)">取 消</el-button>
                <el-button type="danger" :loading="visibleState.delLoading" @click="deleteRow">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, defineProps, withDefaults, defineEmits } from 'vue';

const visibleState = reactive({
    delActionName: '',
    delLoading: false,
});

interface PropsInterface {
    delId: number | null,
    deleteRequestMethod: (id: number | string) => Promise<any>,
    modelValue: boolean
}

const props = withDefaults(defineProps<PropsInterface>(), {});

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>();

const deleteRow = async () => {
    if (props.delId) {
        visibleState.delLoading = true;
        await props.deleteRequestMethod(props.delId!);
        visibleState.delLoading = false;

    }
}

const changeModalVisible = async (value: boolean) => {
    emit('update:modelValue', value);
}

</script>