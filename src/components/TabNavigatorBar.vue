<template>
    <div class="tab-navigator-component">
        <template v-for="(historyRecordItem, index) in getHistoryRoutes" :key="historyRecordItem.path">
            <div :class="['tab-navigator-item', index == selectIndex && 'tab-navigator-item-active']"
                @click.left="goTabRouter(historyRecordItem, index)" @click.right.prevent="handRightClick(index)">
                <div class="tab-navigator-item-content">
                    {{ historyRecordItem.title }}
                </div>
                <div class="close-container" v-show="((index == selectIndex) && getHistoryRoutes.length > 1)">
                    <el-icon @click.stop="removeRouterCard(historyRecordItem, index)">
                        <CloseBold />
                    </el-icon>
                </div>
                <div v-if="(index == rightClickIndex)" v-show="dropVisible" class="tab-drop-menu">
                    <div @click="removeRouterCard(selectItem, rightClickIndex)">关闭本页</div>
                    <div @click="removeTabRouters('right')">关闭右侧</div>
                    <div @click="removeTabRouters('other')">关闭其他</div>
                </div>
            </div>
        </template>
    </div>
</template>


<script setup lang="ts" >
import { Getter, Actions, Mutations, HistoryRouterItem } from '@/store/app';
import { fromJS } from 'immutable';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();
const getHistoryRoutes = Getter.getHistoryRoutes;
const selectIndex = ref(0);
const rightClickIndex = ref(0);
const dropVisible = ref(false);
let selectItem = ref<HistoryRouterItem | null>(null);

function goTabRouter(tabItem: HistoryRouterItem, tabItemIndex: number) {
    let historyItem = getHistoryRoutes.value[tabItemIndex];
    dropVisible.value = false;
    selectIndex.value = tabItemIndex;
    router.push({ path: historyItem.path, params: historyItem.params, query: historyItem.query });
};

onMounted(() => {
    document.addEventListener('click', function () {
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

function handRightClick(index: number) {
    rightClickIndex.value = index;
    dropVisible.value = true;
}





</script>

<style lang="less" scoped >
@primary-active-color: #409eff;

.tab-navigator-component {
    position: relative;
    display: flex;
    width: 100%;

    border: 1px solid #cccccc;
    cursor: default;
    margin-bottom: 10px;

    .tab-navigator-item {
        padding: 8px 20px;
        font-size: 14px;
        max-width: 140px;
        border-right: 1px solid #cccccc;
        position: relative;
        transition: all 0.3s ease;

        .tab-navigator-item-content {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;

        }
    }

    .tab-navigator-item-active {
        background-color: #ffffff;
        color: @primary-active-color;
    }
}

.tab-drop-menu {
    position: absolute;
    z-index: 999;
    background-color: #ffffff;
    box-shadow: 0 0 1px 1px rgba(220, 220, 220, 0.7);
    color: #333333;
    font-size: 12px;
    cursor: default;
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

.close-container {
    position: absolute;
    right: 3px;
    top: 2px;
    z-index: 3;
    font-size: 12px;

    &:hover {
        color: #333333;
    }
}
</style>