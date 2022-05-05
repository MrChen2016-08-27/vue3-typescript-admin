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

        <el-upload
            :data="exParams"
            style="display: inline-block;"
            :loading="loading"
            :action="getUploadFileUrl"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
            :show-file-list="false"
            v-if="!disabled"
            :headers="getTokenHeader()"
        >
            <el-button ref="uploadBtn" icon="el-icon-upload">{{ getName }}</el-button>
        </el-upload>
        <div v-if="type == 'image'" class="upload-img-list">
            <div v-for="fileUrl in modelValue" :key="fileUrl" class="up-img-box">
                <img :src="`${FILE_SERVER}${fileUrl}`" />
                <div class="img-mask">
                    <i
                        @click="viewImg(fileUrl)"
                        class="el-icon-view mask-action-btn"
                        type="el-icon-view"
                    ></i>
                    <i
                        @click="removeFile(fileUrl)"
                        class="el-icon-delete mask-action-btn"
                        type="el-icon-delete"
                    ></i>
                </div>
            </div>
        </div>
        <div v-if="type == 'file'" class="upload-file-list">
            <ul>
                <li v-for="fileUrl in modelValue" :key="fileUrl">
                    <a target="_blank" :href="`${FILE_SERVER}${fileUrl}`">{{ fileUrl }}</a>
                </li>
            </ul>
        </div>

        <el-dialog v-model="modal1" title="查看图片">
            <img class="zoom-img" :src="`${FILE_SERVER}${selectImg}`" />
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, withDefaults, defineEmits, computed } from 'vue';
import { Map, List } from 'immutable';
import { ElMessage } from 'element-plus';
import { uploadImgAction, uploadFileAction, uploadBigFileAction } from "@/api/upload";

const FILE_SERVER = import.meta.env.VITE_FILE_SERVER;

const getUploadFileUrl = computed(() => {
    if (props.type == 'image') {
        return uploadImgAction;
    }
    if (props.type == 'file') {
        if (!props.bigFileMark) {
            return uploadFileAction;
        } else {
            return uploadBigFileAction;
        }
    }
});
// 上传过程
let loading = ref(false);

let upSuccess1 = true;

interface exParamsInterface {
    uploadReqTime: Date | null,
    bigFileMark: string | null
}
// 额外的参数
let exParams: exParamsInterface = {
    uploadReqTime: null,
    bigFileMark: null
};
// 大文件定时器
let timer: NodeJS.Timer | null;

const beforeUpload = (res: Response, file: any, fileList: []) => {
    // 上传即将进行
    loading.value = true;
    upSuccess1 = false;
    if (props.bigFileMark) {
        exParams.bigFileMark = props.bigFileMark;
        startGetTimerCachePath();
    }
}

const startGetTimerCachePath = async () => {
    // 每隔10秒请求一次大型文件的缓存路径
    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(async () => {
        let { data } = await getCacheFilePath(exParams);
        if (upSuccess1 == true && timer) {
            clearInterval(timer);
            return;
        }
        if (data && data.data && data.data.fileName) {
            handlerSuccess(data.data.fileName);
            upSuccess1 = true;
            clearInterval(timer!);
        }
    }, 1000 * 10);
};

const handlerSuccess = async (filePath: string) => {
    if (props.modelValue && props.modelValue instanceof Array) {

        if (props.maxTotal == 1) {
            emit('update:modelValue', [ filePath ]);
        } else if (props.maxTotal > props.modelValue.length) {
            let fList: string[] = List(props.modelValue).toJS() as string[];
            fList.push(filePath);
            emit('update:modelValue', fList);
        } else {
            ElMessage.error("已达到上传上限数量，请删除后再上传");
        }
    }
}

// 删除文件
const removeFile = async (fileUrl: string) => {
    if (!props.disabled) {
        let fList: string[] = getFileList.value;
        fList = fList.filter(url => url != fileUrl);
        emit('update:modelValue', fList);
    }
};

// 查看图片

// 返回一个新的文件数组，如果是字符串会转换为数组
const getFileList = computed((): string[] => {
    if (props.modelValue instanceof String) {
        return JSON.parse(props.modelValue as string);
    }
    if (props.modelValue instanceof Array) {
        return List(props.modelValue).toJS() as string[];
    }
    return [];
})

interface PropsInterface {
    bigFileMark: string,
    maxTotal: number,
    modelValue: string[] | string,
    type: 'image' | 'file',
    disabled: boolean,
    setName: string
}


const props = withDefaults(defineProps<PropsInterface>(), {
    bigFileMark: '',
    maxTotal: 1,
    modelValue: () => {
        return [];
    },
    type: 'file',
    disabled: false,
    setName: ''
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
            > img {
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
        > ul {
            > li {
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
