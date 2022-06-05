<template>
    <div>
        <el-row :gutter="32">
            <el-col :span="6">
                <el-button type="primary" @click="viewAddOrgForm()">新增组织架构</el-button>
                <div class="tree-container-list">
                    <SelectOrgTree ref="selectOrgTreeRef" :select-id="selectTreeItemId" @click-item="selectOrgItemEvent"></SelectOrgTree>
                </div>
            </el-col>
            <el-col :span="18">
                <el-form ref="orgFormRef" :model="selectOrgData" :rules="orgFormRule" label-width="120px">
                    <el-card>
                        <template #header>
                            <div class="flex-bet-container">
                                <label>组织架构信息</label>
                                <div v-if="selectOrgData && selectOrgData.id">
                                    <el-button type="primary"
                                        @click="viewAddOrgForm(selectOrgData.id, selectOrgData.name)" link>新增{{ selectOrgData.name || '' }}下级
                                    </el-button>
                                    <el-button type="primary" @click="isFormEdit = true" link>
                                        <div class="app-text-icon-inline">
                                            编辑
                                            <el-icon>
                                                <SetUp />
                                            </el-icon>
                                        </div>
                                    </el-button>
                                </div>
                            </div>
                        </template>
                        <div v-if="(selectOrgData && selectOrgData.id) || isFormEdit">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item prop="name" label="名称">
                                        <span v-if="!isFormEdit">{{ selectOrgData!.name }}</span>
                                        <el-input v-else v-model="selectOrgData!.name" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="sn" label="编号">

                                        <span v-if="!isFormEdit">{{ selectOrgData!.sn }}</span>
                                        <el-input v-else v-model="selectOrgData!.sn" clearable></el-input>

                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="corporate" label="企业">
                                        <span v-if="!isFormEdit">{{ selectOrgData!.corporate }}</span>
                                        <el-input v-else v-model="selectOrgData!.corporate" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="address" label="地址">
                                        <span v-if="!isFormEdit">{{ selectOrgData!.address }}</span>
                                        <el-input v-else v-model="selectOrgData!.address" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="contact" label="联系人">
                                        <span v-if="!isFormEdit">{{ selectOrgData!.contact }}</span>
                                        <el-input v-else v-model="selectOrgData!.contact" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="tel" label="联系方式">
                                        <span v-if="!isFormEdit">{{ selectOrgData!.tel }}</span>
                                        <el-input v-else v-model="selectOrgData!.tel" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="longitude" label="经度">
                                        <span v-if="!isFormEdit">{{ selectOrgData!.longitude }}</span>
                                        <el-input v-else v-model="selectOrgData!.longitude" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item prop="latitude" label="纬度">
                                        <span v-if="!isFormEdit">{{ selectOrgData!.latitude }}</span>
                                        <el-input v-else v-model="selectOrgData!.latitude" clearable></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <div v-if="isFormEdit" class="app-form-btn-container">
                                <el-button @click="cacheSubmit()">取消</el-button>
                                <el-button type="primary" @click="submitForm()">保存</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template> 

<script setup lang="ts">
import { computed, h, reactive, ref } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { fromJS } from "immutable";
import { ElForm as ElementUIForm, ElMessage, ElNotification } from "element-plus";
import orgApi, { addOrg, updateOrg } from "@/api/org";
import SelectOrgTree, { OrgInterface } from "@/components/SelectOrgTree.vue";


// 表单ref
const orgFormRef = ref<InstanceType<typeof ElementUIForm>>();

type OrgFormBaseInterface = Readonly<OrgInterface>;

// 基础表单数据解构，只读，用来还原初始数据
const orgBase: OrgFormBaseInterface = {
    name: '',
    sn: '',
    corporate: '',
    address: '',
    contact: '',
    tel: '',
    longitude: '',
    latitude: '',
    
};

let selectOrgData: OrgInterface = ref(fromJS(orgBase).toJS());
let selectTreeItemId = ref<number|string>('');


// 是否编辑状态
let isFormEdit = ref(false);
// 编辑前的表单记录
let beforeEditForm: OrgInterface | null = null;

// 选择Org树某一项org项事件
function selectOrgItemEvent(orgData: OrgInterface) {
    selectTreeItemId.value = orgData.id!;
    let newOrgData = fromJS(orgData).toJS() as unknown as OrgInterface;
    selectOrgData.value = newOrgData;
    isFormEdit.value = false;
}


// 表单规则
let orgFormRule = computed(() => {
    return {
        name: [
            { required: true, change: 'blur', message: '请输入名称' }
        ]
    };
});

// 显示添加表单
function viewAddOrgForm(parentId?: number | null, parentName?: string) {
    orgFormRef.value?.resetFields(Object.keys(orgBase));
    let newOrgForm: OrgInterface = fromJS(orgBase).toJS();
    if (parentId) {
        newOrgForm.id = null;
        newOrgForm.parentId = parentId!;
        newOrgForm.parentName = parentName!;
    }
    selectOrgData.value = newOrgForm;
    isFormEdit.value = true;
}

// 取消保存表单 
function cacheSubmit() {
    if (selectOrgData.value && selectOrgData.value.id != null) {
        // 如果是编辑状态，则显示恢复编辑前的数据
        selectOrgData.value = fromJS(beforeEditForm).toJS();
    } else {
        // 如果是新增，则恢复初始
        selectOrgData.value = fromJS(orgBase).toJS();
    }
    isFormEdit.value = false;
}


// 选择组织架构树ref
const selectOrgTreeRef = ref<InstanceType<typeof SelectOrgTree> | null>(null);


// 提交表单
async function submitForm() {
    try {
        await orgFormRef.value?.validate();
    } catch (e) {
        ElMessage({
            type: 'error',
            message: '请完善组织架构信息'
        });
        return;
    }
    if (!selectOrgData.value.id) {
        await addOrg(selectOrgData.value);
    } else {
        await updateOrg(selectOrgData.value);
    }
    isFormEdit.value = false;
    selectOrgTreeRef.value?.getOrgDataList();
}



</script>

<style lang="less" scoped>
.tree-container-list{
    margin-top: 20px;
}
</style>
