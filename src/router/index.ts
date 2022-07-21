import {
    createRouter,
    createWebHashHistory,
    RouteLocationNormalized,
    RouteLocationRaw,
    useRouter,
} from "vue-router";
import { Component } from "vue";
import userApi from "@/api/user";
import { Getter, Actions } from "@/store/app";
import { Actions as UserActions } from "@/store/user";

import Layout from "@/views/layout/Layout.vue";
import { format } from "path/posix";
const Login = () => import("../views/login/Login.vue");
const Home = () => import("../views/home/Home.vue");

const RoleList = () => import("../views/system/RoleList.vue");
const RoleDetail = () => import("../views/system/RoleDetail.vue");
const UserList = () => import("../views/system/UserList.vue");
const UserDetail = () => import("../views/system/UserDetail.vue");

const OrgList = () => import("../views/system/OrgList.vue");

// 初始化权限和基础数据
async function initAuthBaseData(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
) {
    await userApi.getAuth();
    await UserActions.getUserinitInfo();
    await Actions.filterLeftMenus();
}

// home/index 如果存在权限菜单则默认跳转到菜单的第一个页面
async function homeboforeEnter(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized
) {
    let menuList = Getter.getLeftMenuList.value;
    if (menuList && menuList.length > 0) {
        if (menuList[0].children && menuList[0].children.length > 0) {
            return <RouteLocationRaw>{
                name: menuList[0].children[0].name,
                replace: true,
            };
        }
    }
}

// 不属于 Layout 子组件，作为根路由展示单独写
const loginRouter = {
    path: "/login",
    name: "Login",
    component: Login,
};

export interface RouterMenu {
    path: string;
    component: Component;
    id?: string | number;
    name: string;
    icon?: string;
    children?: RouterMenuChild[];
    [key: string]: any;
}

interface RouterMenuChild {
    path: string;
    name: string;
    component: Component;
    id?: string | number;
    title: string;
    meta: RouterChildMenuMeta;
    [key: string]: any;
}

interface RouterChildMenuMeta {
    menuKey: string;
    [key: string]: any;
}

// 作为 Layout子组件但是不在左侧菜单里的路由
const otherRouter = [
    {
        path: "/home",
        component: Layout,
        redirect: "/home/index",
        beforeEnter: [initAuthBaseData],
        children: [
            {
                path: "index",
                name: "Home/Index",
                component: Home,
                beforeEnter: [homeboforeEnter],
            },
        ],
    },
    {
        path: "/system",
        component: Layout,
        icon: "clipboard",
        title: "系统管理",
        beforeEnter: [initAuthBaseData],
        children: [
            {
                path: "userDetail/:id?",
                name: "System/UserDetail",
                component: UserDetail,
                title: "用户管理",
                props: true,
                meta: {
                    menuKey: "User",
                },
            },
            {
                path: "authorityManager/:id?",
                name: "System/RoleDetail",
                component: RoleDetail,
                title: "角色权限管理",
                meta: {
                    menuKey: "Role",
                },
            },
        ],
    },
];

// 作为 Layout子组件 展示, 并为左侧菜单显示的路由
export const appRouter = <RouterMenu[]>[
    {
        path: "/system",
        name: "System",
        component: Layout,
        icon: "clipboard",
        title: "系统管理",
        beforeEnter: [initAuthBaseData],
        id: "1",
        children: [
            {
                path: "orgList",
                name: "System/OrgList",
                component: OrgList,
                id: "2",
                title: "组织架构",
                meta: {
                    menuKey: "Org",
                },
            },
            {
                path: "roleList",
                name: "System/RoleList",
                component: RoleList,
                id: "1",
                title: "角色管理",
                meta: {
                    menuKey: "Role",
                },
            },
            {
                path: "userList",
                name: "System/UserList",
                component: UserList,
                title: "用户管理",
                id: "3",
                meta: {
                    menuKey: "User",
                },
            },
        ],
    },
];

export const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            redirect: "/home",
        },
        loginRouter,
        ...(appRouter as any),
        ...otherRouter,
    ],
});
