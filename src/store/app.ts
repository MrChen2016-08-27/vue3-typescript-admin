import { getTokenUser } from "@/api/user";
import { appRouter } from "@/router";
import { reactive, computed } from "vue";
import { fromJS, List } from "immutable";
import { RouterMenu } from "../router/index";
import { Actions as UserActions, Getter as UserGetter } from "./user";

export interface HistoryRouterItem {
    title: string;
    path: string;
    query: any;
    params: any;
    // 本地记录时间
    time: Date | number;
}

const state = reactive({
    leftMenuList: <RouterMenu[]>[],
    historyRouters: <HistoryRouterItem[]>[],
});

export const Getter = {
    getLeftMenuList: computed((): RouterMenu[] => {
        let list = fromJS(state.leftMenuList).toJS() as RouterMenu[];
        return list;
    }),
    getHistoryRoutes: computed((): HistoryRouterItem[] => {
        return state.historyRouters;
    }),
};

export const Mutations = {
    setLeftMenuList: (list: any[]) => {
        state.leftMenuList = fromJS(list).toJS() as RouterMenu[];
    },
    addHistoryRoutersItem: (hRouterItem: HistoryRouterItem) => {
        let newRecord = fromJS(
            hRouterItem
        ).toJS() as unknown as HistoryRouterItem;
        state.historyRouters.push(newRecord);
    },
    removeHistoryRouterItem: (path: string) => {
        state.historyRouters.find((item, index) => {
            console.log("item.path", item.path);
            console.log("path", path);
            if (item.path == path) {
                state.historyRouters.splice(index, 1);
                return true;
            }
        });
    },
};

export const Actions = {
    filterLeftMenus: async () => {
        const list: RouterMenu[] = fromJS(appRouter).toJS() as RouterMenu[];
        const menus = UserGetter.getUserMenus.value;
        console.log("state.userMenus", menus);
        const leftMenus = filterMenus(list, menus);
        Mutations.setLeftMenuList(leftMenus);
    },
};

/**
 * @param { array } list 本地菜单
 * @param { array } menus 远程菜单
 *
 */
function filterMenus(list: any[], menus: any[]) {
    let leftMenus: any[] = [];
    menus.forEach((item) => {
        if (item.hidden) {
            return;
        }
        let nowObj = list.find((item2) => {
            return (
                item.id == item2.id || (item.fixed == item2.fixed && item.fixed)
            );
        });
        if (!nowObj) {
            throw Error("服务端与本地路由配置不匹配");
        }
        if (item.children) {
            nowObj.children = filterMenus(nowObj.children, item.children);
        }
        leftMenus.push(nowObj);
    });
    return leftMenus;
}
