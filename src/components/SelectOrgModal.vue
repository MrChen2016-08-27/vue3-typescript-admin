<template>
    <el-dialog :model-value="props.modelValue" @update:modelValue="(value: boolean) => changeOpen(value)" title="组织架构" width="30%">
        <div>
            <select-org-tree @click-item="selectOrgItem"></select-org-tree>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="changeOpen(false)">取消</el-button>
                <el-button type="primary" @click="submitOrg()">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts" >
import SelectOrgTree, { OrgInterface } from './SelectOrgTree.vue';
import { fromJS } from 'immutable';

let selectOrg: OrgInterface | null = null;


function selectOrgItem(org: OrgInterface) {
    selectOrg = fromJS(org).toJS();

}

function changeOpen(value: boolean) {
    emit('update:modelValue', value);
}

// 提交选择org
function submitOrg() {
    emit('submitOrg', selectOrg);
    emit('update:modelValue', false);
}

interface Props {
    modelValue: boolean,
}
const props = withDefaults(defineProps<Props>(), {
    modelValue: false
});



const emit = defineEmits<{
    (e: 'submitOrg', orgData: OrgInterface | null): void
    (e: 'update:modelValue', value: boolean): void
}>();
</script>