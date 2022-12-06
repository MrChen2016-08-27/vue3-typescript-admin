<template>
    <div class="login">
        <div class="login-form-container">
            <el-form :model="state.form" status-icon :rules="computeds.getRules.value" ref="formRef" label-width="100px"
                class="login-form">
                <el-form-item label="用户名" prop="username">
                    <el-input class="login-input" type="username" v-model="state.form.username"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input class="login-input" type="password" v-model="state.form.password"
                        autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="captcha">
                    <div class="captcha-container">
                        <div style="flex: 1;">
                            <el-input class="captcha-input" type="text" v-model="state.form.captcha"
                                placeholder="请输入验证码" autocomplete="off"></el-input>
                        </div>
                        <div @click="getLoginCaptcha()" class="captcha-image" v-html="captcha"></div>
                    </div>
                </el-form-item>








                <el-form-item>
                    <el-button class="login-btn" type="primary" @click="methods.handleSubmit()">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">

import { login, getSvgCaptcha } from "@/api/user";
import { Mutations } from "../../store/user";
import { Getter as AppGetter } from "../../store/app";
import { reactive, ref, computed, onMounted, h } from "vue";
import { ElForm as ElementUIForm, ElNotification } from "element-plus";
import {
    useRouter,
} from "vue-router";

const router = useRouter();
const formRef = ref<InstanceType<typeof ElementUIForm>>();
const layoutMenuList = AppGetter.getLeftMenuList.value;

const state = reactive({
    form: {
        username: "",
        password: "",
        captcha: ""
    },
});

const computeds = {
    getRules: computed(() => {
        return {
            username: [
                { required: true, message: '请输入账号', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' }
            ],
            captcha: [
                { required: true, message: '请输入验证码', trigger: 'blur' }
            ]
        }
    })
}

const methods = {
    handleSubmit: () => {
        formRef.value?.validate((valid) => {
            if (valid) {
                methods.loginUser();
            } else {
                ElNotification.error?.({
                    title: "信息格式有误!",
                });
            }
        });
    },
    loginUser: async () => {
        let { data } = await login(state.form);
        if (data.meta.code === 200) {
            let { user } = data.data;
            Mutations.setUserName(user.username);
            router.push({ name: 'Home/Index' });
        }
    },
};

function captchaService() {
    let captcha = ref<string>('');
    async function getLoginCaptcha() {
        let { data } = await getSvgCaptcha();
        if (data.data && data.data.captcha) {
            captcha.value = data.data.captcha;
        }
    }
    return {
        captcha,
        getLoginCaptcha
    };
}

let { captcha, getLoginCaptcha } = captchaService();

onMounted(() => {
    getLoginCaptcha();
})

</script>

<style lang="less" scoped>
.login {
    height: 100%;
    position: relative;
    background: url("../../assets/back.jpg") no-repeat;
    background-size: 100%;
}

.login-form-container {
    @form-container-width: 440px;
    @form-container-height: 340px;
    width: @form-container-width;
    height: @form-container-height;
    background-color: #ffffff;
    padding-top: 100px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: @form-container-width * 0.5;
    margin-top: -@form-container-height * 0.5;

    .login-form {
        text-align: left;
        margin: 0px auto;
        padding: 0px 40px;

        .login-input {
            width: 200px;
            text-align: left;
        }
    }

    .login-btn {
        width: 200px;
        display: block;
    }

    .captcha-image {
        width: 120px;
        flex: 0 0 100px;
        height: 40px;
        position: relative;
        display: block;
    }

    .captcha-container {
        width: 220px;
        display: flex;
        align-items: center;
    }
}
</style>
