<template>
    <div class="select-header">
        <div>
            <label>角色名称</label>
            <el-input v-model="state.params.name" class="input-text"></el-input>
        </div>
    </div>
    <div>
        <TableHeader
            v-model:keyword="state.keyword"
            @search="methods.searchList()"
            @add-action="methods.viewAddModal()"
            @reset="methods.resetList()"
        ></TableHeader>
        <el-table :data="state.dataList" style="width: 100%">
            <el-table-column prop="name" label="角色名称" min-width="100"></el-table-column>
            <el-table-column prop="action" label="操作" width="220">
                <template #default="scope">
                    <el-button size="mini" @click="methods.viewDetail(scope.row.id, 1)">查看</el-button>
                    <el-button
                        size="mini"
                        type="primary"
                        @click="methods.viewDetail(scope.row.id)"
                    >编辑</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="methods.viewDeleteAction(scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-footer">
            <el-pagination
                background
                @size-change="methods.changePageSize"
                @current-change="methods.changeCurrentPage"
                v-model:currentPage="state.params.pageNumber"
                :page-sizes="state.pageSizes"
                :page-size="state.params.pageSize"
                layout="total, prev, pager, next"
                :total="state.total"
            ></el-pagination>
        </div>
    </div>
    <del-modal
        v-model="state.delShow"
        :delId="state.selectItem.id"
        :delName="state.selectItem.username"
        :deleteMethod="methods.deleteRole"
        @deleteSuccess="methods.resetList()"
    ></del-modal>
    <el-dialog title="提示" v-model="state.dialogVisible" width="35%">
        <el-form
            ref="formRef"
            :model="state.form"
            :rules="computeds.getFormRules.value"
            label-width="80px"
        >
            <el-form-item label="角色名称" prop="name">
                <el-input type="text" v-model="state.form.name"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="state.dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="methods.submitForm()">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { ElForm } from "element-plus";
import listActionModule from "../../composables/listActionModule";
import DelModal from "@/components/DelModal.vue";
import TableHeader from "@/components/TableHeader.vue";
import DateFilter from "@/components/DateFilter.vue";
import roleApi from "@/api/role";
import {
    reactive,
    nextTick,
    defineComponent,
    toRefs,
    computed,
    ref,
} from "vue";

const {
    listData,
    listMethods
} = listActionModule(roleApi.getRoleList);

const formRef = ref<InstanceType<typeof ElForm>>();
const $router = useRouter();

const state = reactive({
    delShow: false,
    dialogVisible: false,
    selectItem: {
        id: null,
        username: null,
    },
    form: {
        name: "",
    },
    ...toRefs(listData)
});

const getFormRules = {
    name: [
        {
            required: true,
            message: "请输入角色名称",
            trigger: "blur",
        },
    ],
}

const computeds = {
    getFormRules: computed(() => {
        return {
            name: [
                {
                    required: true,
                    message: "请输入角色名称",
                    trigger: "blur",
                },
            ],
        };
    }),
};



const methods = {
    ...listMethods,
    deleteRole: roleApi.deleteRole,
    viewDeleteAction(row: any) {
        state.selectItem = reactive(row);
        console.log("row", row);
        nextTick(() => {
            state.delShow = true;
        });
    },
    viewDetail(id: string | number | null, readonly?: number | boolean) {
        let params: any = {};
        let query: any = {};
        if (readonly) {
            query.readonly = readonly;
        }
        if (id) {
            params.id = id;
        }
        $router.push({ name: "System/RoleDetail", params, query });
    },
    viewAddModal() {
        state.dialogVisible = true;
        nextTick(() => {
            console.log("ref", formRef);
            formRef.value?.resetFields();
        });
    },
    async submitForm() {
        formRef.value?.validate(async (valid) => {
            if (valid) {
                let { data } = await roleApi.addRole(state.form);
                if (data.data && data.data.id) {
                    $router.push({
                        name: "System/RoleDetail",
                        params: { id: data.data.id },
                    });
                }
            } else {
                return false;
            }
        });
    },
};
</script>
