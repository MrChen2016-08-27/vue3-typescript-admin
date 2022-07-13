import axios from './axios.config'
const base = '/service/config'



// 获取类型配置
export const getTypeConfig = async () => {
    return axios({
        url: `${base}/type/get`,
        method: 'get',
        params: {
            r: Date.now()
        }
    })
}