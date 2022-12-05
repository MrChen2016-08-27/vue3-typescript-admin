<template>
    <el-container class="layout-container">
        <el-menu :collapse="isCollapse" :default-openeds="computeds.oepnNames.value" background-color="#333333"
            text-color="#fff" active-text-color="#ffd04b" :default-active="computeds.activeName.value">

            <el-sub-menu v-for="item in leftMenuList" :key="item.name" :index="item.name">
                <template #title>
                    <el-icon>
                        <Menu />
                    </el-icon>
                    <span>{{ item.title }}</span>
                </template>
                <el-menu-item v-for="child in item.children" @click="methods.goMenuRouter(child.name)" :key="child.name"
                    :index="child.meta.menuKey">{{ child.title }}</el-menu-item>
            </el-sub-menu>
        </el-menu>


        <el-container class="layout-content-container">
            <el-header>
                <div class="layout-right-menu-header">
                    <div style="justify-content: flex-start;">
                        <el-icon @click="methods.changeCollapsae">
                            <ArrowRightBold v-show="isCollapse" />
                            <ArrowLeftBold v-show="!isCollapse" />
                        </el-icon>
                    </div>
                    <div style="justify-content: flex-end;">
                        <el-dropdown>
                            <el-icon :size="20" color="#333333" style="margin-right: 15px">
                                <Setting />
                            </el-icon>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="methods.logout()">注销</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                        <span>{{ getUserName }}</span>
                    </div>
                </div>
            </el-header>
            <el-main>
                <TabNavigatorBar></TabNavigatorBar>
                <router-view v-slot="{ Component, route }">
                    <Transition name="layout-tab" mode="out-in">
                        <div>
                            <KeepAlive>
                                <component :is="Component"></component>
                            </KeepAlive>
                        </div>
                    </Transition>
                </router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router';
import TabNavigatorBar from '@/components/TabNavigatorBar.vue';
import userApi from "@/api/user";

import { Getter, Actions, Mutations, HistoryRouterItem } from '../../store/app'
import { Getter as UserGetter } from '../../store/user';
import { toPairs } from 'lodash-es';
import { TabsPaneContext } from 'element-plus';


const getUserName = UserGetter.getUserName.value;
const leftMenuList = Getter.getLeftMenuList.value;
const getHistoryRoutes = Getter.getHistoryRoutes.value;

const route = useRoute();
const router = useRouter();

const isCollapse = ref(false);

onMounted(() => {
    console.log('loading success..');
});






const computeds = {
    isHome: computed(() => {
        let name = route.name;
        if (name == "Home/Index") {
            return true;
        } else {
            return false;
        }
    }),
    activeName: computed((): string => {
        let info = route.matched.find((item) => {
            return item.meta.menuKey;
        });
        if (info) {
            return info.meta.menuKey as string;
        }
        return '';
    }),
    oepnNames: computed(() => {



        return route.name!.toString().split("/");
    }),
    getHistoryTabRecords: computed(() => {
        let records = router.getRoutes();
        return records;
    }),
}

// onBeforeRouteUpdate((to, form) => {
//     // 添加新路由记录tab
//     let historyTitle: string = to.meta.historyTitle as string || '新标签页';
//     let exist = getHistoryRoutes.find((recordItem) => {
//         return recordItem.path == to.path;
//     })
//     if (!exist) {
//         // 如果不存在
//         Mutations.addHistoryRoutersItem({
//             title: historyTitle,
//             path: to.path,
//             query: to.query,
//             params: to.params,
//             time: Date.now()
//         });
//     }
// });



const methods = {

    goMenuRouter(routeName: string) {
        router.push({ name: routeName });
    },
    async logout() {
        const res = await userApi.logout();
        if (res.data.meta.code == 200) {
            // 清除用户名
            localStorage.clear();
            router.push("/login");
        }
    },
    changeCollapsae() {
        isCollapse.value = !isCollapse.value;
    }
}





</script>

<style>
.el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}
</style>

<style lang="less" scoped>
@color-1: #333333;

.layout-left-bg-color {
    background-color: @color-1;
}

.layout-container {
    height: 100%;

}

.left-menu-container {
    position: relative;
    min-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: @color-1;
}

.layout-content-container {
    position: relative;
    overflow-y: auto;
}

.layout-right-menu-header {
    display: flex;

    align-items: center;
    color: #333333;
    cursor: default;

    >div {
        display: flex;
        align-items: center;
        position: relative;
        flex: 1;
    }
}

.el-header {
    background-color: #ffffff;
    border-bottom: 1px solid #cccccc;
}

.el-menu-item {
    transition: 0.3s all;

    &:hover {
        background-color: #666666;

    }
}
</style>

<style lang="less">
.layout-tab-enter-active {
    transition: all 0.3s ease;
}

.layout-tab-leave-active {
    transition: opacity 0.3s ease;
}

.layout-tab-enter-from,
.layout-tab-leave-to {
    opacity: 0;
}
</style>
