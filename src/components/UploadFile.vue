<!--
 * @Descripttion: 上传图片组件
 * @version:
 * @Author: 检易网络
-->

<template>
    <div class="upload-img-container">
        <div class="up-btn-left-inline">
            <slot name="left-inline" ></slot>
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
                <img :src="`${FILE_SERVER}${fileUrl}`"  />
                <div class="img-mask">
                    <i @click="viewImg(fileUrl)" class="el-icon-view mask-action-btn" type="el-icon-view" ></i>
                    <i @click="removeFile(fileUrl)" class="el-icon-delete mask-action-btn" type="el-icon-delete" ></i>
                </div>
            </div>
        </div>
        <div v-if="type == 'file'" class="upload-file-list">
            <ul>
                <li v-for="fileUrl in modelValue" :key="fileUrl" >
                    <a target="_blank" :href="`${FILE_SERVER}${fileUrl}`" >{{ fileUrl }}</a>
                </li>
            </ul>
        </div>

        <el-dialog
            v-model="modal1"
            title="查看图片"
        >
            <img class="zoom-img" :src="`${FILE_SERVER}${selectImg}`" />
        </el-dialog>
    </div>
</template>

<script>
import _lang from 'lodash/lang';
import { uploadImgAction, uploadFileAction } from "@/api/upload";

export default {
    data() {
        return {
            FILE_SERVER: import.meta.env.VITE_FILE_SERVER,
            loading: false,
            modal1: false,
            selectImg: null,
            upSuccess1: false,
            exParams: {
                uploadReqTime: null,

            },
            timer: null
        };
    },
    methods: {
        async startGetTimerCachePath() {
            // 每隔10秒请求一次大型文件的缓存路径
            clearInterval(this.timer);
            this.timer = setInterval(async () => {
                let { data } = await getCacheFilePath(this.exParams);
                if (this.upSuccess1 == true) {
                    clearInterval(this.timer);
                    return;
                }
                if (data && data.data && data.data.fileName) {
                    this.handlerSuccess(data.data.fileName);
                    this.upSuccess1 = true;
                    clearInterval(this.timer);
                }
            }, 1000 * 10);
        },
        viewImg(fileUrl) {
            this.selectImg = fileUrl;
            this.modal1 = true;
        },
        removeFile(fileUrl) {
            if (!this.disabled) {
                let fList = _lang.cloneDeep(this.modelValue);
                fList = fList.filter(url => url != fileUrl);
                this.$emit('update:modelValue', fList);
            }
        },
        async uploadSuccess(res, file, fileList) {
            let filePath = res.data.fileName;
            this.upSuccess1 = true;
            this.handlerSuccess(filePath);
        },
        handlerSuccess(filePath) {
            let maxCount = this.maxCount;
            if (maxCount == 1) {
                this.$emit('update:modelValue', [ filePath ]);
            } else if (maxCount > this.modelValue.length) {
                let fList = _lang.cloneDeep(this.modelValue);
                fList.push(filePath);
                this.$emit('update:modelValue', fList);
            } else {
                this.$message.error("已达到上传上限数量，请删除后再上传");
            }
        },
        async beforeUpload(res, file, fileList) {
            this.loading = true
            this.upSuccess1 = false;
            if (this.bigFileMark) {
                this.exParams.bigFileMark = this.bigFileMark;
                this.startGetTimerCachePath();
            }
        },
        getTokenHeader () {
            let Authorization = localStorage.getItem('token');
            return { Authorization }
        }
    },
    mounted() {
        this.exParams.uploadReqTime = Date.now()
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    computed: {
        getUploadFileUrl() {
            if (this.type == 'image') {
                return uploadImgAction;
            }
            if (this.type == 'file') {
                if (!this.bigFileMark) {
                    return uploadFileAction;
                } else {
                    return uploadBigFileAction;
                }
            }
        },
        getName() {
            if (this.setName) {
                return this.setName;
            }
            if (this.type == 'image') {
                return "上传图片";
            }
            if (this.type == 'file') {
                return "上传文件";
            }
            return "";
        }
    },
    emits: ['update:modelValue'],
    props: {
        // 最大数量为1时，超过数量则替换图片或文件，最大数量为其他值时提示超过上限
        maxCount: {
            type: Number,
            default: 1
        },
        // 大文件标识，如果上传文件过大则需要添加，每个页面的多个上传大文件组件，那每个必须标识不同
        bigFileMark: {
            type: String,
            default: ''
        },
        modelValue: {
            type: Array,
            default: []
        },
        // 上传文件则为file, 如果是图片则为 image
        type: {
            type: String,
            default: 'file'
        },
        disabled: {
            type: Boolean,
            default: false
        },
        // 设置名字，如果存在则强制覆盖组件上传文字
        setName: {
            type: String,
            default: null
        }
    }
};
</script>

<style lang="less" scoped>
.upload-img-container{
    margin: 5px 0px;
    .up-btn-left-inline{
        display: inline-block;
        vertical-align: middle;

    }
    .upload-img-list{
        padding: 10px 0px;
        .up-img-box{
            position: relative;
            width: 120px;
            height: 120px;
            display: inline-block;
            margin-right: 10px;
            >img{
                width: 100%;
                height: 100%;
                position: relative;
                object-fit: contain;
            }
            .img-mask{
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                text-align: center;
                background: rgba(0, 0, 0, 0.4);
                .mask-action-btn{
                    margin: 0px 10px;
                    vertical-align: middle;
                    display: inline-block;
                    color: #ffffff;
                    font-size: 26px;
                    margin-top: 46px;
                    cursor: pointer;


                }
            }
            &:hover{
                .img-mask{
                    display: block;
                }
            }

        }
    }
    .upload-file-list{
        >ul{
            >li{
                padding: 5px 0px;
            }
        }
    }
}
.zoom-img{
    width: 500px;
    display: block;
    margin: 0px auto;
}
</style>
