<template>
    <div className="editor-component">
        <ckeditor
            :editor="editor"
            :modelValue="props.modelValue"
            @update:model-value="changeEditorContent"
            @ready="onDucomentReady"
            :disabled="props.disabled"
            :config="editorConfig"
        ></ckeditor>
    </div>
</template>

<script setup lang="ts">
import { reactive, Ref, ref } from "vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
// import Undo from "@ckeditor/ckeditor5-undo/src/undo";


import "@ckeditor/ckeditor5-build-classic/build/translations/zh-cn";
import $axios from "@/api/axios.config";
import { uploadImage } from "@/api/upload";
// import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
const FILE_SERVER = import.meta.env.VITE_FILE_SERVER;

const ckeditor = CKEditor.component;

let editor = DecoupledEditor;

let editorConfig: any = {
    // plugins: [Heading, Image, ImageResizeEditing, ImageResizeHandles],
    // plugins: [
    //     Heading,
    //     Alignment,
    //     Bold,
    //     Italic,
    //     Paragraph,
    //     // Undo,
    //     Underline,
    //     Fontcolor,
    //     Fontsize,
    //     Fontfamily,
    //     SelectAll,
    //     Image,
    //     ImageResize,
    //     Link,
    //     List,
    //     ImageUpload,
    //     EssentialsPlugin
    // ],
    // The configuration of the editor.
    extraPlugins: [MyCustomUploadAdapterPlugin],
    // toolbar: {
    //     items: ["selectAll", "|", "heading"],
    //     shouldNotGroupWhenFull: true,
    // },

    language: "zh-cn",
    placeholder: "输入编辑器内容", 
};

function onDucomentReady(editor: any) {
    // Insert the toolbar before the editable area.
    editor.ui
        .getEditableElement()
        .parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
        );
}

function MyCustomUploadAdapterPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
        loader: any
    ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter(loader);
    };
}

class MyUploadAdapter {
    loader: any;
    xhr: any;
    constructor(loader: any) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file.then((file: any) => this._sendRequest(file));
    }

    // Aborts the upload process.
    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    async _sendRequest(file: any) {
        let { data: uploadResData } = await uploadImage(file);
        console.log("uploadResData", uploadResData);
        if (uploadResData.data && uploadResData.data.fileName) {
            console.log(
                "uploadResData.data.fileName",
                uploadResData.data.fileName
            );
            let fileUrl: string = `${FILE_SERVER}${uploadResData.data.fileName}`;
            return {
                default: fileUrl,
            };
        } else {
            throw uploadResData.meta ? uploadResData.meta.message : "上传失败";
        }
    }
}

function changeEditorContent(value: string) {
    emit("update:modelValue", value);
}

let props = withDefaults(
    defineProps<{
        modelValue: string;
        disabled: boolean;
    }>(),
    {
        modelValue: "",
        disabled: false,
    }
);

let emit = defineEmits<{
    (event: "update:modelValue", value: string): void;
}>();
</script>

<style lang="less" scoped></style>
