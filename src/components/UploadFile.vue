<!--
 * @Descripttion: 上传图片组件
 * @version:
 * @Author: 检易网络
-->

<template>
    <div class="upload-img-container">
        <div class="up-btn-left-inline">
            <slot name="left-inline"></slot>
        </div>
        <el-upload :data="exParams" style="display: inline-block;" :loading="loading" :action="getUploadFileUrl"
            :on-success="uploadSuccess" :before-upload="beforeUpload" :show-file-list="false" v-if="!disabled"
            :headers="getHttpHeader">
            <el-button ref="uploadBtn" icon="el-icon-upload">{{ getName }}</el-button>
        </el-upload>
        <div v-if="props.type == 'image'" class="upload-img-list">
            <div v-for="fileUrl in getFileList" :key="fileUrl" class="up-img-box">
                <img :src="`${FILE_SERVER}${fileUrl}`" />
                <div class="img-mask">
                    <i @click="viewImg(fileUrl)" class="mask-action-btn">
                        <el-icon :size="20" color="#ffffff">
                            <View></View>
                        </el-icon>
                    </i>
                    <i @click="removeFile(fileUrl)" class="mask-action-btn">
                        <el-icon :size="20" color="#ffffff">
                            <DeleteFilled></DeleteFilled>
                        </el-icon>
                    </i>
                </div>
            </div>
        </div>
        <div v-if="props.type == 'file'" class="upload-file-list">
            <ul>
                <li v-for="fileUrl in getFileList" :key="fileUrl">
                    <a target="_blank" :href="`${FILE_SERVER}${fileUrl}`">{{ fileUrl }}</a>
                </li>
            </ul>
        </div>

        <el-dialog v-model="selectData.modal1" title="查看图片">
            <img class="zoom-img" :src="`${FILE_SERVER}${selectData.selectImg}`" />
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, withDefaults, defineEmits, computed, reactive } from 'vue';
import { fromJS } from 'immutable';
import { ElMessage, UploadRawFile } from 'element-plus';
import { uploadImgAction, uploadFileAction } from "@/api/upload";
import { AxiosResponse } from 'axios';
import Big from 'big.js';

const FILE_SERVER = import.meta.env.VITE_FILE_SERVER;


const selectData = reactive({
    // 查看图片
    modal1: false,
    // 选择图片路径
    selectImg: ''
});

const getName = computed(() => {
    if (props.setName) {
        return props.setName;
    }
    if (props.type == 'image') {
        return "上传图片";
    }
    if (props.type == 'file') {
        return "上传文件";
    }
    return "";
});



const getUploadFileUrl = computed(() => {
    if (props.type == 'image') {
        return uploadImgAction;
    }
    if (props.type == 'file') {
        return uploadFileAction;
    }
});
// 上传过程
let loading = ref(false);

let upSuccess1 = true;

interface exParamsInterface {
    uploadReqTime: Date | null,
}
// 额外的参数
let exParams: exParamsInterface = {
    uploadReqTime: null,
};

const beforeUpload = (rawFile: UploadRawFile) => {
    let validateSuccess: boolean = true;
    loading.value = true;
    // 上传即将进行
    if (props.type == 'image') {
        // 不能超过单个文件最大大小限制
        if (rawFile.size < props.maxFileSize) {
            let helpSize: string = `${props.maxFileSize}kb`;
            // 如果超过1M 将 kb 转为 M 提示，方便理解
            if (props.maxFileSize > 1024) {
                helpSize = Big(props.maxFileSize).div(1024).toFixed(2);
                helpSize = `${helpSize}M`;
            }
            ElMessage.error(`文件大小不能超过${helpSize}`);
            validateSuccess = false;
        }
    }

    return validateSuccess;


}


const handlerSuccess = async (filePath: string) => {
    let fList: string[] = [];
    // 如果传入的是数组，则返回数组，如果传入的是字符串格式，则返回字符串类型
    let isReturnArray = props.modelValue instanceof Array;
    let resultList: string | string[] = "";
    if (props.modelValue) {
        if (props.maxTotal == 1) {
            // 最大值为1, 替换原来那个
            fList = [filePath];
            resultList = isReturnArray ? fList : JSON.stringify(fList);
        } else if (props.maxTotal > props.modelValue.length) {
            // 小于最大值限制，新增
            let fList: string[] = [];
            if (isReturnArray) {
                // 传入的为数组则返回数组类型
                fList = fromJS(props.modelValue).toJS() as string[];
                fList.push(filePath);
                resultList = fList;
            } else {
                // 传入的是字符类型，则返回字符类型
                fList = JSON.parse(props.modelValue as string);
                fList.push(filePath);
                resultList = JSON.stringify(fList);
            }
        } else {
            return ElMessage.error("已达到上传上限数量，请删除后再上传");
        }
    } else {
        // 如果为空或者空字符, 返回字符类型
        resultList = JSON.stringify([filePath]);
    }
    emit('update:modelValue', resultList);
}

// 上传请求成功时
async function uploadSuccess(res: AxiosResponse, file: any, fileList: Array<any>) {
    let filePath = res.data.fileName;
    upSuccess1 = true;
    handlerSuccess(filePath);
}

// 查看图片
function viewImg(fileUrl: string) {
    selectData.selectImg = fileUrl;
    selectData.modal1 = true;
}
// 删除文件
const removeFile = async (fileUrl: string) => {
    if (!props.disabled) {
        let fList: string[] | string = getFileList.value;
        fList = fList.filter(url => url != fileUrl);
        // 如果传入的是数组，则返回数组，如果传入的是字符串格式，则返回字符串类型
        let isReturnArray = props.modelValue instanceof Array;
        if (!isReturnArray) {
            fList = JSON.stringify(fList);
        }
        emit('update:modelValue', fList);
    }
};

// 获取携带token的 header
const getHttpHeader = computed(() => {
    let Authorization = localStorage.getItem('token');
    return { Authorization }
});
// 查看图片

// 返回一个新的文件数组，如果是字符串会自动转换为数组
const getFileList = computed((): string[] => {
    if (typeof props.modelValue == 'string' && props.modelValue) {
        return JSON.parse(props.modelValue as string);
    }
    if (props.modelValue instanceof Array) {
        return fromJS(props.modelValue).toJS() as string[];
    }
    return [];
})

interface PropsInterface {

    maxTotal?: number,
    modelValue: string[] | string,
    type: 'image' | 'file',
    disabled?: boolean,
    setName?: string,
    // maxFileSize 单个文件大小限制，单位 kb
    maxFileSize?: number
}


const props = withDefaults(defineProps<PropsInterface>(), {
    maxTotal: 1,
    modelValue: () => {
        return [];
    },
    type: 'file',
    disabled: false,
    setName: '',
    // 默认2M
    maxFileSize: 1024 * 2
});

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | string[]): void,
}>()

</script>

<style lang="less" scoped>
.upload-img-container {
    margin: 5px 0px;

    .up-btn-left-inline {
        display: inline-block;
        vertical-align: middle;
    }

    .upload-img-list {
        padding: 10px 0px;

        .up-img-box {
            position: relative;
            width: 120px;
            height: 120px;
            display: inline-block;
            margin-right: 10px;

            >img {
                width: 100%;
                height: 100%;
                position: relative;
                object-fit: contain;
            }

            .img-mask {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                text-align: center;
                background: rgba(0, 0, 0, 0.4);

                .mask-action-btn {
                    margin: 0px 10px;
                    vertical-align: middle;
                    display: inline-block;
                    color: #ffffff;
                    font-size: 26px;
                    margin-top: 46px;
                    cursor: pointer;
                }
            }

            &:hover {
                .img-mask {
                    display: block;
                }
            }
        }
    }

    .upload-file-list {
        >ul {
            >li {
                padding: 5px 0px;
            }
        }
    }
}

.zoom-img {
    width: 500px;
    display: block;
    margin: 0px auto;
}
</style>
