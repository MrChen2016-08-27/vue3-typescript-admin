<template>
 <!-- :rules="computeds.getFormRules" -->
    <el-form
        ref="formRef"
        :rules="computeds.getFormRules.value"
        label-width="80px"
        :model="state.form"
    >
        <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="用户名" prop="username">
                    <el-input
                        :readonly="computeds.isReadonly.value"
                        v-model="state.form.username"
                    ></el-input>
                </el-form-item>
            </el-col>
            <el-col v-if="!props.id" :span="6" prop="password">
                <el-form-item label="密码">
                    <el-input
                        show-password
                        :readonly="computeds.isReadonly.value"
                        v-model="state.form.password"
                    ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="姓名">
                    <el-input
                        :readonly="computeds.isReadonly.value"
                        v-model="state.form.name"
                    ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="联系电话">
                    <el-input
                        :readonly="computeds.isReadonly.value"
                        v-model="state.form.tel"
                    ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="角色">
                    <el-checkbox-group :disabled="computeds.isReadonly.value" v-model="roleService.roleIds">
                        <el-checkbox
                            v-for="role in roleService.roleList"
                            :key="role.id"
                            :label="role.id"
                            >{{ role.name }}</el-checkbox
                        >
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="头像">
                    <UploadFile
                        type="image"
                        :disabled="computeds.isReadonly.value"
                        v-model="state.imgList"
                    ></UploadFile>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <div class="page-action-footer">
        <el-button v-if="!computeds.isReadonly.value" @click="methods.submitForm()" type="primary"
            >确认</el-button
        >
        <el-button @click="$back()">{{
            computeds.isReadonly.value ? "返回" : "取消"
        }}</el-button>
    </div>
</template>

<script setup lang="ts">
import roleApi from "@/api/role";
import userApi from "@/api/user";
// import { ElForm as ElementElForm } from "element-plus";

import {
    reactive,
    defineComponent,
    onMounted,
    ref,
    defineProps,
    computed,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { Map, List } from "immutable";
import UploadFile from "@/components/UploadFile.vue";


const router = useRouter();
const route = useRoute();
const state = reactive({
    form: {
        username: "",
        name: "",
        password: "",
        tel: null,
    },
    imgList: <any>[],
});

// 角色业务
let roleService = reactive({
    roleList: <any>[],
    roleIds: <any>[]
});
const roleMethods = {
    async getRoleList() {
        let { data } = await roleApi.getRoleList({
            pageNumber: 1,
            pageSize: 10,
        });
        roleService.roleList = data.data.list;
    },
    setRoleIdsByRoleList(roleList: []) {
        roleService.roleIds = roleList.map((item: any) => item.id);
    }
};

onMounted(() => {
    roleMethods.getRoleList();
    if (props.id) {
        methods.getDetail(props.id);
    }
});
// const formRef = ref<InstanceType<typeof ElementElForm>>();
const formRef = ref<any>();

const methods = {
    async getDetail(id: string | number) {
        let { data } = await userApi.getUser(id);
        if (data.data) {
            state.form = data.data;
            let avatar: string = data.data.avatar;
            if (avatar) {
                state.imgList = [avatar];
            }
        }
        if (data.data.roles) {
            roleMethods.setRoleIdsByRoleList(data.data.roles);
        }
    },
    async submitForm() {
        let form = Map(state.form).toJS();
        form.roleIds = List(roleService.roleIds).toJS();
        if (state.imgList.length > 0) {
            form.avatar = state.imgList[0];
        }
        let valid = await formRef.value?.validate();
        if (!valid) {
            return;
        }
        if (props.id) {
            await userApi.updateUser(form);
        } else {
            await userApi.addUser(form);
        }
        router.push({ name: "System/UserList" });
    },
};

const props = defineProps({
    id: [Number, String],
});

const computeds = {
    isReadonly: computed(() => {
        let { readonly } = route.query;
        if (props.id && readonly) {
            return true;
        }

        return false;
    }),
    getFormRules: computed((): object => {
        let result: any = {
            username: [
                {
                    required: true,
                    message: "请输入用户名",
                    trigger: "blur",
                },
                {
                    min: 2,
                    max: 12,
                    message: "用户名长度必须在2~12位以内",
                    trigger: "blur",
                },
            ],
        };
        if (!props.id) {
            result.password = [
                {
                    required: true,
                    message: "请输入密码",
                    trigger: "blur",
                },
                {
                    min: 6,
                    max: 18,
                    message: "密码长度必须在6~18位以内",
                },
            ];
        }
        return result;
    }),
};
</script>

<style lang="less" scoped></style>
