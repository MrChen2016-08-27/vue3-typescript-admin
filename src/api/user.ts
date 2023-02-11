import axios from "./axios.config";

export const getKey = (params: object) => {
    return axios({
        method: "get",
        url: "user/getKey",
        params,
    });
};

export const login = (data: object) => {
    return axios({
        method: "post",
        url: "user/login",
        data,
    });
};

// 获取用户列表
export const getUserList = (data: object) => {
    return axios({
        method: "get",
        url: "/user/admin/list",
        params: data,
    });
};

// 获取用户
export const getUser = (id: string | number) => {
    return axios({
        method: "get",
        url: "/user/admin/get",
        params: { id },
    });
};

// 获取session当前用户
export const getTokenUser = () => {
    return axios({
        method: "get",
        url: "/user/parse/token",
        params: {
            r: Date.now(),
        },
    });
};

// 添加用户
export const addUser = (data: object) => {
    return axios({
        method: "post",
        url: "/user/admin/add",
        data,
    });
};

// 修改自己信息
export const updateMyUser = (data: object) => {
    return axios({
        method: "post",
        url: "/user/update",
        data,
    });
};

// 后台修改用户
export const updateUser = (data: object) => {
    return axios({
        method: "post",
        url: "/user/admin/update",
        data,
    });
};

// 修改用户
export const deleteUser = (id: string | number) => {
    return axios({
        method: "post",
        url: "/user/admin/delete",
        data: {
            id,
        },
    });
};

// 注销用户
export const logout = () => {
    return axios({
        method: "post",
        url: "/user/logout",
    });
};

// 检查权限
export const getAuth = () => {
    return axios({
        method: "get",
        url: "/auth",
        params: {
            _: Date.now(),
        },
    });
};
// 验证码
export const getSvgCaptcha = () => {
    return axios({
        method: "get",
        url: "/user/captcha",
        params: {
            _: Date.now(),
        },
    });
};

export default {
    getKey,
    login,
    getUserList,
    getUser,
    addUser,
    updateMyUser,
    updateUser,
    deleteUser,
    getAuth,
    logout,
    getTokenUser,
    getSvgCaptcha
};
