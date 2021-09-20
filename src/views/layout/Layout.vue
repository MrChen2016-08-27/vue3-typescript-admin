<template>
    <el-container class="layout-container">
        <el-aside class="left-menu-container" width="200px">
            <el-menu
                :default-openeds="computeds.oepnNames.value"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                :default-active="computeds.activeName.value"
                
            >
    
                <el-submenu v-for="item in leftMenuList" :key="item.name" :index="item.name">
                    <template #title
                        ><i class="el-icon-message"></i>{{ item.title }}</template
                    >
                    <el-menu-item v-for="child in item.children" @click="methods.goMenuRouter(child.name)" :key="child.name" :index="child.meta.menuKey">{{ child.title }}</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>

        <el-container class="layout-content-container">
            <el-header style="text-align: right; font-size: 12px">
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="methods.logout()" >注销</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <span>{{ getUserName }}</span>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';

import userApi from "@/api/user";

import { Getter, Actions } from '../../store/app'
import { Getter as UserGetter } from '../../store/user';


const getUserName = UserGetter.getUserName.value;
const leftMenuList = Getter.getLeftMenuList.value;

const route = useRoute();
const router = useRouter();



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
        console.log('route.matched', route.matched);
        console.log('route.meta', route.meta);
        if (info) {
            return info.meta.menuKey as string;
        }
        return '';
    }),
    oepnNames: computed(() => {
    

  
        return route.name!.toString().split("/");
    })
}

const methods = {
    goMenuRouter(routeName: string) {
        router.push({ name: routeName  });
    },
    async logout() {
        const res = await userApi.logout();
        if (res.data.meta.code == 200) {
            // 清除用户名
            localStorage.clear();
            router.push("/login");
        }
    },
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
.layout-container{
    height: 100%;

}
.left-menu-container{
    position: relative;
    min-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #545c64;
}
.layout-content-container{
    position: relative;
    overflow-y: auto;
}
</style>
