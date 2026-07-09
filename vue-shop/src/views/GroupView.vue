<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
        <el-row>
            <el-button type="primary" :icon="Plus" @click="addCateDialog">添加分类</el-button>
        </el-row>
        <el-row class="a">
            <el-table
                :data="tableData.data"
                style="width: 100%; margin-bottom: 20px"
                row-key="id"
                border
                
                >
                <el-table-column prop="id" label="ID" sortable />
                <el-table-column prop="name" label="分类名称" sortable />
                <el-table-column prop="level" label="等级" sortable>
                     <template #default="scope">
                        <el-tag v-if="scope.row.level===1">一级</el-tag>
                        <el-tag v-else-if="scope.row.level===2" type="success">二级</el-tag>
                        <el-tag v-else type="warning">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" sortable >
                        <el-button type="success">编辑</el-button>
                        <el-button type="danger">删除</el-button>
                </el-table-column>
            </el-table>
        </el-row>
    </el-card>

    <!-- 增加分类对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加分类列表" width="500" :before-close="addFormRest">
        <el-form :model="addForm" :rules="addRule" ref="addFormRef">
            <el-form-item label="分类名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="addForm.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="父类节点" :label-width="formLabelWidth" prop="pid">
                <el-cascader
                    v-model="value"
                    :options="options.data"
                    :props="props"
                    @change="handleChange"
                    separator=" > "
                    clearable
                />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addDialogVisible= false">
                    取消
                </el-button>
                <el-button type="primary" @click="addCate">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ArrowRight,Plus } from '@element-plus/icons-vue'
import { reactive,onMounted, ref } from 'vue'
import api from '@/api/index.js'

const tableData = reactive({
    data:[]
})

let addDialogVisible = ref(false)

const addForm = reactive({
    name:null,
    pid:0,
    level:1
})

let addRule = reactive({
    name:[
        { required: true, message: '请输入分类名称', trigger: 'blur' }
    ]
})

const value = ref([])

const props = {
  expandTrigger: 'hover',
  label: 'name',
  value: 'id',
  checkStrictly: true
}

const options = reactive({
    data:[]
})

//生命周期
onMounted(()=>{
    get_category()
    get_options()
})

const get_category = () => {
    api.get_category(3).then(res => {
        tableData.data = res.data.data
        console.log(res);
        
    })
}

const addCateDialog = () =>{
    addDialogVisible.value=true
}

const handleChange = (value) => {
    if (value){
        if(value.length===1){
            addForm.pid=value[0]
            addForm.level=2
        }else if(value.length===2){
            addForm.pid=value[1]
            addForm.level=3
        }
    }else{
        addForm.pid=0
        addForm.level=1
    }
    
    
}
const get_options = () => {
    api.get_category(2).then(res => {
        options.data = res.data.data
        console.log(res);
        
    })
}

const addCate = () =>{
    api.add_category(addForm).then(res=>{
        addDialogVisible.value=false
        get_category()
        get_options()
    })
}

</script>

<style scoped>
.box-card {
    margin-top: 20px;
}
.a{
    margin-top: 20px;
}
</style>