

/**
 * 如果接口规范有在多处用到， 并且不必须伴随方法和功能模块使用，请定义在此
 * 
**/

/**
*  列表参数标准
*/ 
export interface ListParamsStandard {
    // 当前页码
    pageNumber: number;
    // 当前一页数量
    pageSize: number,
    // 关键字
    keyword: string | null | number,
    // 其余请求参数
    [attr: string]: any
};




