import { computed, reactive } from 'vue';
import { fromJS } from 'immutable';
import { getTypeConfig } from '@/api/serviceConfig';


interface TypeConfigItem {
    label: string,
    value: any
}

interface TypeConfigInterface {
    [props: string]: TypeConfigItem[]
}

const state = reactive({
    typeConfig: {} as TypeConfigInterface
});


export const getOptionNameByValue = (optionList: TypeConfigItem[] = [], value: any): string => {
    let result = optionList.find((item) => item.value == value);
    return result ? result.label : "";
}


export const getTypeConfigByKey = (keyName: string): TypeConfigItem[] => {
    let typeConfig = state.typeConfig;
    if (typeConfig && typeConfig[keyName]) {
        return fromJS(typeConfig[keyName]).toJS();
    } else {
        return [];
    }
};

export const Actions = {
    // 获取类型配置信息
    getServerTypeConfig: async () => {
        let { data } = await getTypeConfig();
        state.typeConfig = data.data.typeConfig;
    }
}

