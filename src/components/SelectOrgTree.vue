<template>
    <el-tree :data="orgList" node-key="id" :current-node-key="props.selectId" :highlight-current="true"
        :check-on-click-node="true" :props="treeProps" @node-click="handleNodeClick" />
</template>

<script setup lang="ts">
import { getOrgList } from '@/api/org';
import { onBeforeMount, ref } from 'vue';


// 主要需要的org字段
export interface OrgInterface {
    id?: number | null,
    name?: string,
    type?: number,
    parentId?: number,
    parentName?: string,
    longitude?: string,
    latitude?: string,
    status?: number,
    children?: OrgInterface[],
    [propsName: string]: any
}

// tree 某一项被点击
function handleNodeClick(data: OrgInterface) {
    emit('click-item', data);
}

const { orgList, getOrgDataList } = orgService();

onBeforeMount(async () => {
    await getOrgDataList();
});


function orgService() {
    let orgList: any = ref([]);
    async function getOrgDataList() {
        let { data: orgResData } = await getOrgList();
        orgList.value = orgResData.data.orgList;
    }
    async function resetOrgDataList() {

    }
    return {
        orgList,
        getOrgDataList
    }
}

// tree 组件规则对应字段
const treeProps = {
    children: 'children',
    label: 'name'
}

const emit = defineEmits<
    {
        (e: 'click-item', orgItem: OrgInterface): void
    }>();

const props = withDefaults(defineProps<{
    selectId?: number | string
}>(), {

});

defineExpose({
    getOrgDataList
})

</script>