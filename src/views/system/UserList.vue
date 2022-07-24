<template>
    <div class="select-header">
        <div>
            <label>用户名</label>
            <el-input v-model="listData.params.username" class="input-text"></el-input>
        </div>
        <div>
            <label>手机号码</label>
            <el-input v-model="listData.params.tel" class="input-text"></el-input>
        </div>
    </div>
    <div>
        <TableHeader v-model:keyword="listData.keyword" @search="listMethods.searchList()" @add-action="methods.viewDetail()"
            @reset="listMethods.resetList()"></TableHeader>
        <el-table :data="listData.dataList" style="width: 100%">
            <el-table-column prop="username" label="用户名" min-width="100">
            </el-table-column>
            <el-table-column prop="tel" label="手机账号" min-width="100">
            </el-table-column>
            <el-table-column prop="name" label="姓名"> </el-table-column>
            <el-table-column prop="role" label="角色" min-width="100">
                <template #default="scope">
                    <el-tag v-for="role in scope.row.roles" :key="role.id" type="info">{{ role.name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="240">
                <template #default="scope">
                    <el-button @click="methods.viewDetail(scope.row.id, 1)">查看</el-button>
                    <el-button type="primary" @click="methods.viewDetail(scope.row.id)">编辑</el-button>
                    <el-button type="danger" @click="methods.viewDeleteAction(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-footer">
            <el-pagination background @size-change="listMethods.changePageSize" @current-change="listMethods.changeCurrentPage"
                v-model:currentPage="listData.params.pageNumber" :page-sizes="listData.pageSizes"
                :page-size="listData.params.pageSize" layout="total, prev, pager, next" :total="listData.total">
            </el-pagination>
        </div>
    </div>
    <del-modal v-model="state.delShow" :delId="state.selectItem.id" :delName="state.selectItem.username"
        :deleteRequestMethod="methods.deleteUser" @deleteSuccess="listMethods.resetList()"></del-modal>
</template>

<script setup lang="ts">
import listActionModule from "../../composables/listActionModule";
import DelModal from "@/components/DelModal.vue";
import TableHeader from "@/components/TableHeader.vue";
import DateFilter from "@/components/DateFilter.vue";

import userApi from "@/api/user";
import { reactive, nextTick, defineComponent, toRefs } from "vue";
import { useRouter } from "vue-router";

const {
    listData,
    listMethods
} = listActionModule(userApi.getUserList);

const router = useRouter();

const state = reactive({
    delShow: false,
    selectItem: <any>{},

});

const methods = {
    deleteUser: userApi.deleteUser,
    viewDeleteAction(row: any) {
        state.selectItem = reactive(row);
        console.log("row", row);
        nextTick(() => {
            state.delShow = true;
        });
    },
    viewDetail(id?: string | number, readonly?: boolean | number) {
        let params: any = {};
        let query: any = {};
        if (readonly) {
            query.readonly = readonly;
        }
        if (id) {
            params.id = id;
        }
        router.push({ name: "System/UserDetail", params, query });
    },
};
</script>
