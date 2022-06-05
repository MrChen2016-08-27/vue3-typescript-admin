import axios from './axios.config.js';

export const getOrgList = () => {
    return axios({
        url: 'org/list',
        method: 'get',
        params: {
            _: Date.now()
        }
    });
};

export const addOrg = (data: any) => {
    return axios({
        url: 'org/add',
        data,
        method: 'post'
    });
}

export const updateOrg = (data: any) => {
    return axios({
        url: 'org/update',
        data,
        method: 'post'
    });
}



export default {
    getOrgList,
    addOrg,
    updateOrg,

};
