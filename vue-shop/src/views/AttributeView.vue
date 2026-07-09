<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>属性列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <div>
            <el-alert title="分类属性只可以选择最后一级!" type="warning" class="alter"/>
            <span class="attr-title">选择分类</span>
            <el-cascader
                :options="options.data"
                :props="props"
                separator=" > "
                clearable
                style="width: 500px;"
                v-model="options.selectID"
                @change="handleSelect"
            />
        </div>
        <div>
            <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                <el-tab-pane label="静态属性" name="static">
                    <el-button type="primary" :disabled="isButtionVisible" @click="addDialogVisible=true">添加属性</el-button>
                    <el-table :data="attrData.static">
                        <el-table-column type="index" ></el-table-column>
                        <el-table-column label="属性名称" prop="name" ></el-table-column>
                        <el-table-column label="属性值" prop="val" ></el-table-column>
                        <el-table-column label="操作" >
                            <el-button type="success">编辑</el-button>
                            <el-button type="danger">删除</el-button>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="动态属性" name="dynamic">
                    <el-button type="primary" :disabled="isButtionVisible" @click="addDialogVisible=true">添加属性</el-button>
                    <el-table :data="attrData.dynamic" row-key="id">
                        <el-table-column type="expand">
                            <template #default="scope">
                                <el-tag class="etag" v-for="(v,i) in scope.row.val" closable @close="closeTag(scope.row.id,scope.row.val,i)">{{ v }}</el-tag>
                                <TagComponent @addTagEvent="getTagValue" :row="scope.row"/>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" ></el-table-column>
                        <el-table-column label="属性名称" prop="name" ></el-table-column>
                        
                        <el-table-column label="操作" >
                            <el-button type="success">编辑</el-button>
                            <el-button type="danger">删除</el-button>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </el-card>

    <!-- 增加静态属性对话框 -->
    <el-dialog v-model="addDialogVisible" :title="addDialog" width="500" :before-close="addFormRest">
        <el-form :model="addForm" :rules="addRule" ref="addFormRef">
            <el-form-item label="属性名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="addForm.name" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="fal">
                    取消
                </el-button>
                <el-button type="primary" @click="addAttr">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { computed, onMounted, reactive, ref } from 'vue';
import api from '@/api/index';
import TagComponent from '@/components/TagComponent.vue';
const options = reactive({
    data:[],
    selectID:null
})

const props = {
  expandTrigger: 'hover',
  label: 'name',
  value: 'id',
  checkStrictly: true
}

const activeName = ref('static')

const attrData = reactive({
    static:[],
    dynamic:[]
})

const flag = reactive({
    static:false,
    dynamic:false
})

const addForm = reactive({
    name:'',
    val:''
})

const addDialogVisible = ref(false)

const addDialog = ref('增加静态属性')

const addRule = reactive({
    name:[
        { required: true, message: '请输入属性名称', trigger: 'blur' }
    ]
})

const addFormRef = ref(null)

let isButtionVisible = computed(()=>{
    if (options.selectID){
        if (options.selectID.length === 3){
            return false
        }
    }
    return true
})
//生命周期函数
onMounted(()=>{
    get_category()
})

const get_category = () =>{
    api.get_category(3).then(res=>{
        options.data = res.data.data
    })
}

const handleClick = (tab,event) => {
    if (tab.props.name == 'static'){
        addDialog.value = '增加静态属性'
    }else if (tab.props.name == 'dynamic'){
        addDialog.value = '增加动态属性'
    }
    if (options.selectID){
        if(options.selectID.length === 3){
            let selectKey = options.selectID[2]
            let _type = tab.props.name
            //根据flag标识判断是否可以获取属性数据
            if (_type == 'static' && !flag.static) return
            if (_type == 'dynamic' && !flag.dynamic) return
            // api.get_attr_by_category(selectKey,_type).then(res=>{
            //     attrData.static = res.data.data
            //     attrData.dynamic = res.data.data
            // })
            get_arrt(selectKey,_type)
            
        }
    }
}

const handleSelect = (value) =>{
    //value 第几级(3)
    if (value){
        if(value.length === 3){
            let selectKey = value[2]
            let _type = activeName.value
            //设置静态属性可以获取
            flag.static = true
            //设置动态属性可以获取
            flag.dynamic = true
            get_arrt(selectKey,_type)
        }else{
            attrData.static = []
            attrData.dynamic = []
        }
    }else{
            attrData.static = []
            attrData.dynamic = []
        }
}

const get_arrt = (s_key,s_type) => {
    if (s_type == 'static'){
        api.get_attr_by_category(s_key,s_type).then(res=>{
            attrData.static = res.data.data
            //设置静态属性不可以获取
            flag.static = false
        })
    }else if (s_type == 'dynamic'){
        api.get_attr_by_category(s_key,s_type).then(res=>{
            //遍历每个动态属性里的值
            res.data.data.forEach(item => {
                //将动态属性转化为数组
                item.val = item.val?item.val.split(','):[]
            });
            console.log(res.data.data);
            attrData.dynamic = res.data.data
            //设置动态属性不可以获取
            flag.dynamic = false
        })
    }
}

const addFormRest = () =>{
    addFormRef.value.resetFields()
    addDialogVisible.value = false
}
const fal = () =>{
    addFormRef.value.resetFields()
    addDialogVisible.value = false
}

const addAttr = () =>{
    let params = {
        "name":addForm.name,
        "_type":activeName.value,
        "cid":options.selectID[2]
    }
    api.add_attribute(params).then(res=>{
        get_arrt(options.selectID[2],activeName.value)
        addFormRest()
    })
}

const getTagValue = (val) =>{
    //属性的类型
    console.log(activeName.value);
    //属性的ID
    console.log(val.row.id);
    //属性的值
    console.log(val.inputValue);
    //将新的属性值加入到原来的数组中
    val.row.val.push(val.inputValue)
    let params = {
        "val":val.row.val.join(','),
        "_type":activeName.value
    }
    api.update_attr_value(val.row.id,params).then(res=>{
        ElMessage({
                    message: res.data.msg,
                    type: 'success'
                    })
    })
}

const closeTag = (id,TagList,i) =>{
    //要删除的属性ID
    console.log(id);
    //要删除的属性值列表
    console.log(TagList);
    //要删除的索引
    console.log(i);
    //已删除后的属性值列表
    TagList.splice(i,1)
    let params = {
        'val':TagList.join(',')
    }
    api.update_attr_value(id,params).then(res=>{
        ElMessage({
                    message: res.data.msg,
                    type: 'success'
                    })
    })
}
</script>

<style scoped>
.box-card{
    margin-top: 20px;
}
.attr-title{
    margin-right: 10px;
}
.alter{
    margin-bottom: 20px;
}
.demo-tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}
.etag{
    margin: 5px;
}

</style>