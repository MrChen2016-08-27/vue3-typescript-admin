<template>
    <!-- :rules="computeds.getFormRules" -->
    <el-form ref="formRef" :rules="getFormRules" label-width="80px" :model="userState.form">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-form-item label="用户名" prop="username">
                    <el-input :readonly="isReadonly" v-model="userState.form.username"></el-input>
                </el-form-item>
            </el-col>
            <el-col v-if="!props.id" :span="6" prop="password">
                <el-form-item label="密码">
                    <el-input show-password :readonly="isReadonly" v-model="userState.form.password">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="姓名">
                    <el-input :readonly="isReadonly" v-model="userState.form.name"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item prop="orgId" label="组织架构">
                    <el-input :readonly="true" v-model="userState.form.orgName" @click="orgState.orgVisible = true;" ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="联系电话">
                    <el-input :readonly="isReadonly" v-model="userState.form.tel"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="角色">
                    <el-checkbox-group :disabled="isReadonly" v-model="roleState.roleIds">
                        <el-checkbox v-for="role in roleState.roleList" :key="role.id" :label="role.id">{{ role.name
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="头像">
                    <UploadFile type="image" :disabled="isReadonly" v-model="userState.imgList">
                    </UploadFile>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <div class="page-action-footer">
        <el-button v-if="!isReadonly" @click="submitForm()" type="primary">确认</el-button>
        <el-button @click="$back()">{{
                isReadonly ? "返回" : "取消"
        }}</el-button>
    </div>
    <SelectOrgModalVue v-model="orgState.orgVisible" @submit-org="submitSelectOrg"></SelectOrgModalVue>
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
    computed,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { Map, List } from "immutable";
import { ElForm as ElementUIForm } from "element-plus";
import UploadFile from "@/components/UploadFile.vue3.vue";
import SelectOrgModalVue from "@/components/SelectOrgModal.vue";
import { OrgInterface } from "@/components/SelectOrgTree.vue";



const router = useRouter();
const route = useRoute();

const {orgState, submitSelectOrg} = orgService();

function orgService() {
    const orgState = reactive({
        orgVisible: false
    });

    function submitSelectOrg(org: OrgInterface | null) {
        if (org) {
            userState.form.orgName = org.name!;
            userState.form.orgId = org.id!;
        }
        orgState.orgVisible = false;
    }

    return {
        orgState,
        submitSelectOrg
    }
}


// 角色业务
let roleState = reactive({
    roleList: <any>[],
    roleIds: <any>[]
});

const roleMethods = {
    async getRoleList() {
        let { data } = await roleApi.getRoleList({
            pageNumber: 1,
            pageSize: 10,
        });
        roleState.roleList = data.data.list;
    },
    setRoleIdsByRoleList(roleList: []) {
        roleState.roleIds = roleList.map((item: any) => item.id);
    }
};

function userService() {
    const state = reactive({
        form: {
            username: "",
            name: "",
            password: "",
            tel: <number | null | string>null,
            orgName: <string | null>'',
            orgId: <number | null>null
        },
        imgList: <any>[],
    });
    // 获取详情
    async function getDetail(id: string | number) {
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
    };
    const getFormRules = computed((): object => {
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
            orgId: [
                {
                    required: true,
                    message: "请输入用户名",
                    trigger: "blur",
                }
            ]
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
    });
    // 提交用户信息表单
    async function submitForm() {
        let form = Map(state.form).toJS();
        form.roleIds = List(roleState.roleIds).toJS();
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
    };
    return {
        getDetail,
        getFormRules,
        submitForm,
        userState: state
    }
}

const { getDetail, getFormRules, submitForm, userState } = userService();

onMounted(() => {
    roleMethods.getRoleList();
    if (props.id) {
        getDetail(props.id);
    }
});
// const formRef = ref<InstanceType<typeof ElementElForm>>();
const formRef = ref<InstanceType<typeof ElementUIForm>>()

// 是否只读
const isReadonly = computed(() => {
    let { readonly } = route.query;
    if (props.id && readonly) {
        return true;
    }
    return false;
});








const props = defineProps({
    id: [Number, String],
});


</script>

<style lang="less" scoped>
</style>
