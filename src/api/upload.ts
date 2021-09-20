import axios from './axios.config'
const base = 'upload'

// 上传文件地址
export const uploadImgAction = `${axios.defaults.baseURL}${base}/img`
export const uploadFileAction = `${axios.defaults.baseURL}${base}/file`
