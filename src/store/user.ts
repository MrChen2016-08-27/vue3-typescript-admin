import { getTokenUser } from '@/api/user';
import { fromJS } from 'immutable';
import { reactive, computed } from 'vue';

const state = reactive({
    username: <string | null>'',
    userData: {},
    userMenus: <any>[]
});

export const Getter = {
    getUserName: computed((): string | null => {
        let username =
            state.username || localStorage.getItem('inspec_username')
        if (username) {
            return username
        } else {
            return '未登录'
        }
    }),
    getUserData: computed((): any | null => {
        let userData = state.userData != null ? fromJS(state.userData).toJS() : {};
        return userData;
    }),
    getUserMenus: computed((): any | null => {
        let userMenus = state.userMenus != null ? fromJS(state.userMenus).toJS() : [];
        console.log('userMenus ##', userMenus);
        return userMenus;
    })
}

export const Mutations = {
    setUserName: (username: string) => {
        localStorage.setItem('inspec_username', username)
        state.username = localStorage.getItem('inspec_username')
    },
    setUserData: (userData: any) => {
        state.userData = userData != null ? fromJS(userData).toJS() : {};
    },
    setUserMenus: (menus: any[]) => {
        state.userMenus = menus != null ? fromJS(menus).toJS() : [];
        
    }
}

export const Actions = {
    getUserinitInfo: async () => {
        let { data: userResData } = await getTokenUser();
        console.log('userResData', userResData);
        if (userResData.meta.code == 200) {
            // 保存用户信息
            Mutations.setUserData(userResData.data);
            // 保存用户权限菜单
            Mutations.setUserMenus(userResData.data.menus);
        }
    },
 
}
