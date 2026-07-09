<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <br>
    <el-card class="box-card">
        <el-row :gutter="20">
            <el-col :span="8">
                <el-input
                v-model="user_data.queryname"
                placeholder="输入要搜索的账号"
                class="input-with-select"
                >
                <template #append>
                    <el-button :icon="Search" @click="searchuser"/>
                    
                </template>
                </el-input>
            </el-col>
            <el-col :span="1">
                <el-button type="primary" :icon="Plus" @click="addDialogVisible=true">添加</el-button>
            </el-col>
        </el-row>
        <br>

        <el-table :data="user_data.tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="180" />
            <el-table-column prop="name" label="账号" width="180" />
            <el-table-column prop="nick_name" label="昵称" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="role_name" label="角色" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
                        Edit
                    </el-button>
                    <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                    >
                        Delete
                    </el-button>
                    <el-button
                    size="small"
                    type="success"
                    @click="handleRest(scope.$index, scope.row)"
                    >
                        Rest
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <br>

        <el-pagination
        v-model:current-page="user_data.pagenum"
        v-model:page-size="user_data.pagesize"
        :page-sizes="page_sizes"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="user_data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        />
    </el-card>
    <!-- 增加用户对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加用户列表" width="500" :before-close="addFormRest">
        <el-form :model="user_form" :rules="user_rules" ref="addFormRef">
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
                <el-input v-model="user_form.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth" prop="pwd">
                <el-input v-model="user_form.pwd" autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认密码" :label-width="formLabelWidth" prop="real_pwd">
                <el-input v-model="user_form.real_pwd" autocomplete="off" />
            </el-form-item>
            <el-form-item label="昵称" :label-width="formLabelWidth" prop="nick_name">
                <el-input v-model="user_form.nick_name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                <el-input v-model="user_form.phone" autocomplete="off" />
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                <el-input v-model="user_form.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth" prop="role_id">
                <el-select v-model="user_form.role_id" placeholder="请选择角色">
                    <el-option :label="r.name" :value="r.id" v-for="r in roles"/>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addFormRest">
                    取消
                </el-button>
                <el-button type="primary" @click="addUser(addFormRef)">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 编辑用户 -->
     <el-dialog v-model="editDialogVisible" title="编辑用户列表" width="500">
        <el-form :model="edit_form" ref="editFormRef">
            <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
                <el-input v-model="edit_form.name" autocomplete="off" disabled/>
            </el-form-item>
            <el-form-item label="昵称" :label-width="formLabelWidth" prop="nick_name">
                <el-input v-model="edit_form.nick_name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                <el-input v-model="edit_form.phone" autocomplete="off" />
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                <el-input v-model="edit_form.email" autocomplete="off" />
            </el-form-item>
            <el-form-item label="角色" :label-width="formLabelWidth" prop="role_id">
                <el-select v-model="edit_form.role_id" placeholder="请选择角色">
                    <el-option :label="r.name" :value="r.id" v-for="r in roles"/>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="editDialogVisible=false">
                    取消
                </el-button>
                <el-button type="primary" @click="editUser()">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 删除用户 -->
     <el-dialog v-model="deleteDialogVisible" title="删除用户" width="500">
        <span>确定删除账号为：{{ remove_user.name }},昵称为：{{ remove_user.nick_name }}的用户？</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="deleteDialogVisible=false">
                    取消
                </el-button>
                <el-button type="primary" @click="deleteUser()">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 重置密码 -->
     <el-dialog v-model="restDialogVisible" title="重置密码" width="500">
        <span>确定重置账号为：{{ rest_user.name }},昵称为：{{ rest_user.nick_name }}的用户密码？</span>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="restDialogVisible=false">
                    取消
                </el-button>
                <el-button type="primary" @click="restUser()">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { ArrowRight,Search,Plus } from '@element-plus/icons-vue'
import api from '@/api/index'
import { onMounted,reactive,ref } from 'vue'



const user_data = reactive({
    tableData:[],
    total:0,
    pagenum:1,
    pagesize:2,
    queryname:''
})

const user_form = reactive({
    name:null,
    pwd:null,
    real_pwd:null,
    nick_name:null,
    phone:null,
    email:null,
    role_id:null
})

let edit_form = reactive({
    name:null,
    nick_name:null,
    phone:null,
    email:null,
    role_id:null
})

const remove_user = reactive({
    id:null,
    name:null,
    nick_name:null
})

const rest_user = reactive({
    id:null,
    name:null,
    nick_name:null
})
//定义验证确认密码的规则
const validatePwd = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入确认密码'))
  } else if (value !== user_form.pwd) {
    callback(new Error("两次密码不匹配！"))
  } else {
    callback()
  }
}

//定义验证手机号的规则
const validatePhone = (rule, value, callback) => {
   if (value === '') {
    callback(new Error('请输入手机号'))
    } else if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error("手机号格式不正确!"))
    } else {
    callback()
    }
   }

//定义验证邮箱的规则
  const validateEmail = (rule, value, callback) => {
   if (value === '') {
    callback(new Error('请输入邮箱'))
    } else if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/i.test(value)) {
    callback(new Error("邮箱格式不正确!"))
    } else {
    callback()
    }
   }

//用来校验用户表单数据
const user_rules = reactive({
    name:[
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    pwd:[
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    ],
    real_pwd:[
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        { validator: validatePwd, trigger: 'blur' }
    ],
    nick_name:[
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
    ],
    phone:[
        { validator: validatePhone, trigger: 'blur' }
    ],
    email:[
        { validator: validateEmail, trigger: 'blur' }
    ]
})

const background = ref(false)
const disabled = ref(false)
const addDialogVisible = ref(false)
const formLabelWidth = '80px'
const addFormRef = ref(null)
const editDialogVisible = ref(false)
const editFormRef = ref(null)
let userID = ref(0)
const deleteDialogVisible = ref(false)
const restDialogVisible = ref(false)
let roles = ref([])

let page_sizes = ref([1,2,5,10])

//生命周期函数，页面加载完成后执行
onMounted(()=>{
    get_users_list()
    get_author_list()
})

const get_users_list = ()=>{
    let params = {
        'pnum':user_data.pagenum,
        'psize':user_data.pagesize,
        'name':user_data.queryname
    }
    api.get_user_list({params}).then(res =>{
        //更新用户列表数据
        user_data.tableData = res.data.data.data
        //更新分页数据总数
        user_data.total = res.data.data.total
    })
}

const handleSizeChange = (val) => {
    //修改每页显示多少条数据
    user_data.pagesize = val
    //重新获取用户列表
    get_users_list()
}

const handleCurrentChange = (val) => {
    //修改当前初始页数
    user_data.pagenum = val
    //重新获取用户列表
    get_users_list()
}

const searchuser = ()=>{
    //初始化页码
    user_data.pagenum = 1
    //重新获取用户列表
    get_users_list()
}

const addFormRest = ()=>{
    //定义重置表单方法
    addFormRef.value.resetFields()
    //关闭对话框
    addDialogVisible.value = false
}

const addUser = (formRef)=>{
    formRef.validate((valid)=>{
        if (valid) {
            console.log('验证成功')
            api.add_user(user_form).then(res=>{
                //根据响应结果进行处理
                if(res.data.status == 200){
                    ElMessage({
                        message: res.data.msg,
                        type: 'success'
                    })
                    //重置表单
                    addFormRest() 
                    //重新获取用户列表
                    get_users_list()             
                }else{
                    ElMessage.warning(res.data.msg)                
                }
            })           
        }else{
            console.log('验证失败')
            return false
            }
    })
}

//编辑用户
const handleEdit = (index,row) =>{
    //显示编辑对话框
    editDialogVisible.value = true
    // edit_form = row //把当前行的数据赋值给编辑表单

    //从数据库获取信息
    api.get_user_by_id(row.id).then(res=>{
        // edit_form = res.data.data
        edit_form.name = res.data.data.name
        edit_form.nick_name = res.data.data.nick_name
        edit_form.phone = res.data.data.phone
        edit_form.email = res.data.data.email
        edit_form.role_id = res.data.data.role_id
    })
    userID.value = row.id
}

const editUser = () =>{
    api.edit_user(userID.value,edit_form).then(res=>{
                //根据响应结果进行处理
                if(res.data.status == 200){
                    ElMessage({
                        message: res.data.msg,
                        type: 'success'
                    }) 
                    //关闭窗口
                    editDialogVisible.value = false     
                    //重新获取用户列表
                    get_users_list()             
                }else{
                    ElMessage.warning(res.data.msg)                
                }
            })  
    
}

//删除用户
const handleDelete = (index,row) =>{
    remove_user.id = row.id
    remove_user.name = row.name
    remove_user.nick_name = row.nick_name
    //显示窗口
    deleteDialogVisible.value = true
} 

const deleteUser = () =>{
    api.delete_user(remove_user.id).then(res=>{
                //根据响应结果进行处理
                if(res.data.status == 200){
                    ElMessage({
                        message: res.data.msg,
                        type: 'success'
                    }) 
                    //关闭窗口
                    deleteDialogVisible.value = false     
                    //重新获取用户列表
                    get_users_list()             
                }else{
                    ElMessage.warning(res.data.msg)                
                }
            }) 
}

//重置用户密码
const handleRest = (index,row) =>{
    rest_user.id = row.id
    rest_user.name = row.name   
    rest_user.nick_name = row.nick_name
    //显示窗口
    restDialogVisible.value = true
}

const restUser = () =>{
    api.rest_user(rest_user.id).then(res=>{
                //根据响应结果进行处理
                if(res.data.status == 200){
                    ElMessage({
                        message: res.data.msg,
                        type: 'success'
                    }) 
                    //关闭窗口
                    restDialogVisible.value = false     
                    //重新获取用户列表
                    get_users_list()             
                }else{
                    ElMessage.warning(res.data.msg)                
                }
            }) 
}   

//获取角色列表
const get_author_list = () =>{  
    api.get_roles().then(res=>{
        roles = res.data.data                     
    })
    
}
</script>