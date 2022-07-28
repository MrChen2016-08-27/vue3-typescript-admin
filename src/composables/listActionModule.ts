import axios, { AxiosResponse } from "axios";
import { ref, reactive, onMounted, Ref, toRefs } from "vue";
import { ListParamsStandard } from "@/standard";
import { fromJS } from "immutable";
/**
 * @description 过滤掉空参数
 * */
function fileterNullParams(params: ListParamsStandard) {
    for (let key in params) {
        if (
            params[key] === "" ||
            params[key] === null ||
            params[key] === undefined
        ) {
            delete params[key];
        }
    }
}

// 列表操作模块
export default function listActionModule(
    requesstMethods: (
        params: ListParamsStandard
    ) => Promise<AxiosResponse<any>>,
    extraParameter?: object
): ListActionModuleStandard {
    const baseParams: readonly ListParamsStandard = {
        pageNumber: 1,
        pageSize: 10,
        keyword: "",
    };
    const listData = reactive({
        loading: true,
        total: 0,
        keyword: "",
        pageSize: <number[]>[10, 20, 30, 50],
        params: fromJS(baseParams).toJS() as ListParamsStandard,
        dataList: <any[]>[],
    });

    function updateParams() {
        // 更新参数
        if (extraParameter) {
            let newParams = fromJS(extraParameter).toJS();
            let cancheParams = Object.assign(listData.params, newParams);
            listData.params = cancheParams;
        }
        listData.params.keyword = listData.keyword;
    }
    updateParams();
    /**
     * @description 加载列表
     */
    const getList = async (): Promise<void> => {
        listData.loading = true;
        fileterNullParams(listData.params);
        const res: AxiosResponse = await requesstMethods(listData.params);
        let data = res.data;
        listData.dataList = data.data.list;
        listData.total = data.data.count;
        listData.loading = false;
    };

    /**
     * @description 搜索列表
     */
    const searchList = async (): Promise<void> => {
        // 点击搜索，更新参数
        updateParams();
        listData.params.pageNumber = 1;
        await getList();
    };
    /**
     * @description 重置列表, 会重置所有参数属性，如果有不希望被重置的参数属性请使用 filterParams 声明
     * @param {any} filterParams 可以过滤不希望被重置的参数类型，例如 type 则为 { type: true }
     */
    const resetList = async (filterParams?: any): Promise<void> => {
        for (let key in listData.params) {
            if (!filterParams || !filterParams[key]) {
                listData.params[key] = null;
            }
        }
        listData.params.pageNumber = 1;
        listData.params.pageSize = 10;
        listData.keyword = null;
        listData.total = 0;
        await getList();
    };

    /**
     * @description 页码改变时触发
     * @param currentPage 当前页码
     *  */
    const changeCurrentPage = async (currentPage: number): Promise<void> => {
        listData.params.pageNumber = currentPage;
        await getList();
    };

    /**
     * @description 每页显示数量改变时触发
     * @param 显示数量
     * */
    const changePageSize = async (visiblePageSize: number): Promise<void> => {
        listData.params.pageSize = visiblePageSize;
        await resetList();
    };

    onMounted(() => {
        getList();
    });

    const result: ListActionModuleStandard = {
        listData,
        listMethods: {
            searchList,
            resetList,
            changeCurrentPage,
            changePageSize,
        },
    };
    return result;
}

/**
 * @description 返回结果标准
 */
export interface ListActionModuleStandard {
    listData: ListDataStandard;
    listMethods: ListMethodStandard;
}

interface ListDataStandard {
    dataList: any[];
    params: ListParamsStandard;
    keyword: string | null;
    readonly pageSizes: number[];
    total: number;
}
interface ListMethodStandard {
    searchList: () => Promise<void>;
    resetList: (filterParams?: any) => Promise<void>;
    changeCurrentPage: (currentPage: number) => Promise<void>;
    changePageSize: (visiblePageSize: number) => Promise<void>;
}
