import {  getTokenUser } from '@/api/user'
import {  appRouter } from '@/router';
import { reactive, computed } from 'vue';
import { List } from 'immutable'
import { RouterMenu } from '../router/index';
import { Actions as UserActions, Getter as UserGetter } from './user';

const state = reactive({
    leftMenuList: <RouterMenu[]>[],
});

export const Getter = {
    getLeftMenuList: computed((): RouterMenu[] => {
        let list = List(state.leftMenuList).toJS() as RouterMenu[];
        return list;
    })
}

export const Mutations = {
    setLeftMenuList: (list: any[]) => {
        state.leftMenuList = List(list).toJS() as RouterMenu[];
    }
}

export const Actions = {
    filterLeftMenus: async () => {
        const list = List(appRouter).toJS();
        const menus = UserGetter.getUserMenus.value;
        console.log('state.userMenus', menus);
        const leftMenus = filterMenus(list, menus)
        Mutations.setLeftMenuList(leftMenus);

    }
}



/**
 * @param { array } list 本地菜单
 * @param { array } menus 远程菜单
 *
 */
function filterMenus(list: any[], menus: any[]) {
    let leftMenus: any[] = []
    menus.forEach(item => {
        if (item.hidden) {
            return
        }
        let nowObj = list.find(item2 => {
            return item.id == item2.id || (item.fixed == item2.fixed && item.fixed)
        })
        if (!nowObj) {
            throw Error('服务端与本地路由配置不匹配')
        }
        if (item.children) {
            nowObj.children = filterMenus(nowObj.children, item.children)
        }
        leftMenus.push(nowObj)
    })
    return leftMenus
}



