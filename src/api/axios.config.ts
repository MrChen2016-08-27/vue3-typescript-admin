import axios, { AxiosResponse } from "axios";
// import App from '@/main'
import { router } from "@/router";
import { ElNotification } from "element-plus";

const baseUrl = import.meta.env.MODE === "production" ? "/api/" : "/api/";

axios.defaults.baseURL = baseUrl;
// 2分钟
axios.defaults.timeout = 2 * 60 * 1000;
axios.interceptors.request.use(
    (config) => {
        if (localStorage.getItem("token")) {
            // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = localStorage.getItem("token");
        } else {
            config.headers.Authorization = "";
        }

        return config;
    },
    (err) => {
        console.log("promise reject..");
        return Promise.reject(err);
    }
);

axios.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        const { data } = response;
        // 拦截业务异常
        if (data.meta.code != 200) {
            ElNotification.error?.({
                title: data.meta.message,
            });
            // 阻止继续传递
            throw Error(data.meta.message);
        }
        if (data.data && data.data.token) {
            localStorage.setItem("token", `Bearer ${data.data.token}`);
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.data.token}`;
        }
        return response;
    },
    (error) => {
        let errMsg = "请求错误";
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    router.replace("/login");
                    errMsg = "request 401";
                    if (localStorage.getItem("token")) {
                        // 清除 token
                        localStorage.clear();
                        ElNotification.warning?.({
                            title: "用户信息已经过期",
                            message: "请重新登录",
                        });
                    } else {
                        ElNotification.warning?.({
                            title: "请先登录",
                        });
                    }
                    axios.defaults.headers.common["Authorization"] = "";
                    break;
                case 503:
                    errMsg = "request 503";
                    ElNotification.warning?.({
                        title: "服务器超时",
                    });
                    break;
                case 504:
                    errMsg = "request 504";
                    ElNotification.warning?.({
                        title: "服务器超时",
                    });
                    break;
                case 404:
                    errMsg = "request 404";
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(errMsg);
    }
);

export default axios;
