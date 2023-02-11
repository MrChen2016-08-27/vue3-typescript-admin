import axios from "./axios.config";
const base = "upload";

// 上传文件地址
export const uploadImgAction = `${axios.defaults.baseURL}${base}/img`;
export const uploadFileAction = `${axios.defaults.baseURL}${base}/file`;

// 添加
export const uploadImage = async (file: any) => {
    let formData = new FormData();
    formData.append("file", file);
    return axios({
        url: `${base}/img`,
        method: "post",
        data: formData,
    });
};
