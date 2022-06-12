
import axios, { AxiosResponse } from 'axios'
import { ref, reactive, onMounted, Ref, toRefs } from 'vue'
import { ListParamsStandard } from '@/standard';



/** 
 * @description 过滤掉空参数 
 * */ 
function fileterNullParams(params: ListParamsStandard) {
    for (let key in params) {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key];
        }
    }
}

// 列表操作模块
export default function listActionModule(requesstMethods: (params: ListParamsStandard) => Promise<AxiosResponse<any>>, extraParameter?: object): ListActionModuleStandard {
    const loading: Ref<boolean> = ref(true);
    const total: Ref<number> = ref(0);
    const keyword: Ref<string | null | number> = ref('');
    const pageSizes: number[] = [10, 20, 30, 50];
    let baseParams: ListParamsStandard = {
        pageNumber: 1,
        pageSize: 10,
        keyword: ''
    };

    if (extraParameter) {
        baseParams = Object.assign(baseParams, extraParameter);
    }
    let params: ListParamsStandard = reactive(baseParams);
    
    let dataList: Ref<any[]> = ref([]);

    /**
     * @description 加载列表
     */
    const getList = async (): Promise<void> => {
        loading.value = true;
        fileterNullParams(params);
        const res: AxiosResponse = await requesstMethods(params);
        let data = res.data;
        dataList.value = data.data.list;
        total.value = data.data.count;
        loading.value = false;
        console.log('total', total);
    }
    
    /**
     * @description 搜索列表
     */
    const searchList = async (): Promise<void> => {
        params.pageNumber = 1;
        params.keyword = keyword.value;
        await getList();
    }
    /**
     * @description 重置列表, 会重置所有参数属性，如果有不希望被重置的参数属性请使用 filterParams 声明
     * @param {any} filterParams 可以过滤不希望被重置的参数类型，例如 type 则为 { type: true }
     */
    const resetList = async (filterParams?: any): Promise<void> => {
        for (let key in params) {
            if (!filterParams || !filterParams[key]) {
                params[key] = null
            }
        }
        params.pageNumber = 1;
        params.pageSize = 10;
        keyword.value = null;
        total.value = 0;
        await getList();
    }

    /**
     * @description 页码改变时触发
     * @param currentPage 当前页码
     *  */
    const changeCurrentPage = async (currentPage: number): Promise<void> => {
        params.pageNumber = currentPage;
        await getList();
    }

    /**
     * @description 每页显示数量改变时触发
     * @param 显示数量
     * */
    const changePageSize = async (visiblePageSize: number): Promise<void> => {
        params.pageSize = visiblePageSize;
        await resetList();
    }

    onMounted(() => {
        getList();
    });

    
    const result: ListActionModuleStandard = {
        listData: {
            dataList,
            params,
            keyword,
            pageSizes,
            total
        },
        listMethods: {
            searchList,
            resetList,
            changeCurrentPage,
            changePageSize
        }
    };

    return result;

}

/**
 * @description 返回结果标准
 */
export interface ListActionModuleStandard {
    listData: ListDataStandard,
    listMethods: ListMethodStandard
}

interface ListDataStandard {
    dataList: Ref<any[]>,
    params: ListParamsStandard,
    keyword: Ref<string | null>,
    readonly pageSizes: number[],
    total: Ref<number>,
}
interface ListMethodStandard {
    searchList: () => Promise<void>,
    resetList: (filterParams?: any) => Promise<void>,
    changeCurrentPage: (currentPage: number) => Promise<void>,
    changePageSize: (visiblePageSize: number) => Promise<void>,
}