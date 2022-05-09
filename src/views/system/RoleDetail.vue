<template>
    <div class="auth-card-list">
        <el-card v-for="(item, index) in state.menus" :key="index" class="card">
            <template #header>
                <div class="card-header flex-bet-container">
                    <span>{{ item.title }}</span>
                    <el-checkbox
                        :model-value="
                            methods.parseIsColumnCheckOut(
                                state.authority[item.id],
                                item.children
                            )
                        "
                        @change="
                        (result: any) =>
                            methods.changeColumnCheck(
                                item.id,
                                result,
                                item.children
                            )
                        "
                    >全选</el-checkbox>
                </div>
            </template>
            <div v-for="(child, index2) in item.children" :key="index2" class="text item">
                <div class="column-row">
                    <label class="column-row-label">{{ child.title }}</label>
                    <template v-for="(opt, index3) in state.options" :key="index3">
                        <el-checkbox
                            v-if="state.authority[item.id]"
                            :model-value="
                                methods.parseIsCheckOut(
                                    state.authority[item.id][child.id],
                                    index3
                                )
                            "
                            @change="
                                (result: any) =>
                                    methods.changeCheck(
                                        item.id,
                                        child.id,
                                        index3,
                                        result
                                    )
                            "
                        >
                            {{ opt }}
                        </el-checkbox>
                        <el-checkbox
                            v-else
                            :model-value="methods.parseIsCheckOut(0, index3)"
                            @change="
                                (result: any) =>
                                    methods.changeCheck(
                                        item.id,
                                        child.id,
                                        index3,
                                        result
                                    )
                            "
                        >
                            {{ opt }}
                        </el-checkbox>
                    </template>
                </div>
            </div>
        </el-card>
    </div>
    <div class="page-action-footer">
        <el-button v-if="!computeds.isReadonly.value" type="primary">确认</el-button>
        <el-button @click="$back()">
            {{
                computeds.isReadonly.value ? "返回" : "取消"
            }}
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { updateRole, getRole, getAllMenus } from "@/api/role";
import { reactive, onMounted, computed } from "vue";
import { ElNotification } from "element-plus";

import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const state = reactive({
    options: ["新增", "删除", "编辑", "查看"],
    form: [
        {
            title: "模块1",
            childs: [
                {
                    name: "",
                    value: 64,
                },
            ],
        },
    ],
    authority: <any>{},
    menus: <any>[],
});

onMounted(() => {
    methods.init();
});

const methods = {
    async init() {
        let id = <string>route.params.id;
        let { data } = await getRole(id);
        state.authority = data.data.authority;
        let menuRes = await getAllMenus();
        state.menus = menuRes.data.data.appRouter;
    },
    changeCheck(
        pId: string | number,
        cId: string | number,
        num: number,
        value: number
    ) {
        let result = 0;
        if (!state.authority[pId]) {
            state.authority[pId] = {};
        } else if (state.authority[pId][cId]) {
            result = Number(state.authority[pId][cId]);
        }
        let val = Math.pow(2, num);
        if (value) {
            state.authority[pId][cId] = result + val;
        } else {
            state.authority[pId][cId] = result + -val;
        }
        console.log("authority", state.authority);
    },
    /** 对数据进行二进制向右移位操作，判断是否选中 */
    /** @param value -> 数据, num -> 移位数 */
    parseIsCheckOut(value = 0, num: number) {
        if (state.authority.all) {
            return true;
        }
        let a = 1 << num;
        return value & a ? true : false;
    },
    parseIsColumnCheckOut(authObj: any, menuList: []) {
        let result = true;
        if (state.authority.all) {
            return true;
        }
        if (!authObj) {
            return false;
        }
        menuList.forEach((menu: any) => {
            if (authObj[menu.id] != computeds.getRowMax) {
                result = false;
                return;
            }
        });
        return result;
    },
    changeColumnCheck(
        itemId: number | string,
        result: number | boolean,
        menuList: any[]
    ) {
        console.log("result:", result);
        if (!state.authority[itemId]) {
            state.authority[itemId] = {};
        }
        let value = result ? computeds.getRowMax : 0;
        menuList.forEach((menu) => {
            state.authority[itemId][menu.id] = value;
        });
    },
    async saveChange() {
        let form = {
            id: route.params.id,
            authority: state.authority,
        };
        await updateRole(form);
        router.push({ name: "System/RoleList" });

        ElNotification.success?.({
            title: "保存成功",
            duration: 2,
        });
    },
};

const computeds = {
    getRowMax: computed(() => {
        let resultVal = 0;
        state.options.forEach((item: any, index: number) => {
            resultVal += Math.pow(2, index);
        });
        return resultVal;
    }),
    isReadonly: computed(() => {
        let { readonly } = route.query;
        if (readonly) {
            return true;
        }
        return false;
    }),
};
</script>

<style lang="less" scoped>
.auth-card-list {
    display: flex;
    .card {
        flex: 0 0 430px;
        margin: 10px;
        .column-row {
            vertical-align: middle;
            margin: 5px 0;
            .column-row-label {
                margin-right: 16px;
            }
        }
    }
}
</style>
