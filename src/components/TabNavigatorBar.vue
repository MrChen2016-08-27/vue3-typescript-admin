<template>
    <div class="tab-navigator-component">
        <template v-for="(historyRecordItem, index) in getHistoryRoutes" :key="historyRecordItem.path">
            <div ref="tabItemRefs" :class="['tab-navigator-item', index == selectIndex && 'tab-navigator-item-active']"
                @click.left="goTabRouter(historyRecordItem, index)" @click.right.prevent="(e) => handRightClick(e, index)">
                <div class="tab-navigator-item-content">
                    {{ historyRecordItem.title }}
                </div>
                <div class="close-container" v-show="getHistoryRoutes.length > 1">
                    <el-icon @click.stop="removeRouterCard(historyRecordItem, index)">
                        <CloseBold />
                    </el-icon>
                </div>
            </div>
        </template>
        <Teleport to="body">
            <div v-show="dropVisible" :style="{
                top: `${dropModalState.y}px`,
                left: `${dropModalState.x}px`
            }" class="tab-drop-menu">
                <div @click="removeRouterCard(selectItem, rightClickIndex)">关闭本页</div>
                <div @click="removeTabRouters('right')">关闭右侧</div>
                <div @click="removeTabRouters('other')">关闭其他</div>
            </div>
        </Teleport>
    </div>
<!-- <div v-if="dropVisible" class="tab-drop-menu" :style="{ 'left': absolData.left + 'px', 'top': absolData.top + 'px' }">
        <div @click="removeRouterCard(selectItem, rightClickIndex)">关闭本页</div>
        <div @click="removeTabRouters('right')">关闭右侧</div>
        <div @click="removeTabRouters('other')">关闭其他</div>
        
    </div> --></template>


<script setup lang="ts" >
import { Getter, Actions, Mutations, HistoryRouterItem } from '@/store/app';
import { fromJS } from 'immutable';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const getHistoryRoutes = Getter.getHistoryRoutes;
const selectIndex = ref(0);
const rightClickIndex = ref(0);
const dropVisible = ref(false);
let selectItem = ref<HistoryRouterItem | null>(null);
const dropModalState = reactive({
    x: 0,
    y: 0
});


const tabItemRefs = ref([]);

function goTabRouter(tabItem: HistoryRouterItem, tabItemIndex: number) {
    let historyItem = getHistoryRoutes.value[tabItemIndex];
    dropVisible.value = false;
    selectIndex.value = tabItemIndex;
    router.push({ path: historyItem.path, params: historyItem.params, query: historyItem.query });
};

onMounted(() => {
    document.addEventListener('click', function (e) {
        dropVisible.value = false;
    })
})

// 删除单个记录和菜单
function removeRouterCard(tabItem: HistoryRouterItem | null, tabItemIndex: number) {
    // 移除菜单页
    Mutations.removeHistoryRouterItem(tabItemIndex);
    if (getHistoryRoutes.value && getHistoryRoutes.value.length > 0) {
        selectIndex.value = getHistoryRoutes.value.length;
        // 跳到最后一个菜单页 
        let endHistoryRoute = getHistoryRoutes.value[getHistoryRoutes.value.length - 1];
        console.log('endHistoryRoute', endHistoryRoute);
        router.replace({
            path: endHistoryRoute.path,
            query: endHistoryRoute.query,
            params: endHistoryRoute.params
        });
    }
}

// 选择方式删除多个
function removeTabRouters(removeType: 'other' | 'right') {
    let result = getHistoryRoutes.value[rightClickIndex.value];
    if (removeType == 'other') {
        Mutations.setHistoryRouters([result!]);

    }
    if (removeType == 'right' && rightClickIndex.value < getHistoryRoutes.value.length) {
        let newList = fromJS(getHistoryRoutes.value).toJS() as HistoryRouterItem[];
        newList.splice(rightClickIndex.value + 1, newList.length - rightClickIndex.value);
        Mutations.setHistoryRouters(newList);
    }
    dropVisible.value = false;
    router.replace({
        path: result.path,
        params: result.params,
        query: result.query
    });
}

watch(() => route.path, (newPath, oldPath) => {
    getHistoryRoutes.value.find((item, index) => {
        if (item.path == newPath) {
            selectIndex.value = index;
            selectItem.value = fromJS(item).toJS() as unknown as HistoryRouterItem;
        }
    })
})

// 鼠标右击事件
function handRightClick(e: MouseEvent, index: any) {
    console.log('e', e);
    dropModalState.x = e.pageX;
    dropModalState.y = e.pageY;
    rightClickIndex.value = index;
    dropVisible.value = true;

}



</script>

<style lang="less" scoped >
@primary-active-color: #409eff;

// .tab-navigator-component::-webkit-scrollbar {
//     display: none; //去除占用宽度
//     opacity: 0; //隐藏滚动条
// }

.tab-navigator-component {
    position: relative;
    width: 100%;
    height: 100%;
    align-items: center;
    border: 1px solid #cccccc;
    border-radius: 0px 0px 20px 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: default;
    box-shadow: 0px 5px 14px 0px rgba(0, 0, 0, 0.05);
    background-color: rgba(255, 255, 255, 0.8);
    max-width: 100%;
    // overflow-y: hidden;

    .tab-navigator-item {
        padding: 8px 20px;
        font-size: 14px;
        flex: 1;
        max-width: 100px;
        position: relative;
        transition: all 0.3s ease;
        opacity: 1;
        color: #A0AEC0;
        display: flex;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;

        &:hover {
            cursor: pointer;
            color: #409eff;
        }

        .tab-navigator-item-content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;


        }
    }

    .tab-navigator-item-active {
        color: #2D3748;
        overflow: auto;
        text-overflow: clip;
        white-space: normal;
        border-radius: 5px;
        width: 100px;
        flex: 0 0 100px;
    }
}

.tab-drop-menu {
    position: absolute;
    z-index: 9999;
    background-color: #ffffff;
    box-shadow: 0 0 1px 1px rgba(220, 220, 220, 0.7);
    color: #333333;
    font-size: 12px;
    cursor: pointer;
    bottom: -100%px;
    left: 50%;
    width: 120px;

    >div {
        padding: 10px 14px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;

        &:hover {
            color: @primary-active-color;
        }

    }
}

.tab-navigator-item {
    .close-container {
        position: absolute;
        right: 3px;
        top: 11px;
        z-index: 3;
        font-size: 12px;
        display: none;

    }

    &:hover {
        .close-container {

            display: block;

        }
    }

}

.tab-navigator-item-active {
    .close-container {
        position: absolute;
        right: 3px;
        top: 11px;
        z-index: 3;
        font-size: 12px;
        display: block;

        &:hover {
            color: #333333;
        }
    }
}
</style>