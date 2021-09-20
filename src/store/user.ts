import { reactive, computed } from 'vue';

const state = reactive({
    username: <string | null>''
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
    })
}

export const Mutations = {
    setUserName: (username: string) => {
        localStorage.setItem('inspec_username', username)
        state.username = localStorage.getItem('inspec_username')
    }
}




