<template>
    <!-- 主体显示内容 -->
    <div class="main">
        <div class="login">
            <div class="logo">
                <img src="../assets/logo.png" alt="">
                <el-form :model="user" class="user_form" :rules="userRules" ref="userFormRef">
                    <el-form-item prop="name">
                        <el-input v-model="user.name" placeholder="用户名" :prefix-icon="User"/>
                    </el-form-item>
                    <el-form-item prop="pwd">
                        <el-input v-model="user.pwd" placeholder="密码" :prefix-icon="Lock" show-password/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(userFormRef)">登录</el-button>
                        <el-button type="success" @click="resetForm(userFormRef)">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import {reactive,ref} from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import api from "@/api/index"  //导入api接口
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'  //导入路由对象
//定义表单数据
const user = reactive({
    name:'baizhan',
    pwd:'123'
})
// 定义表单规则
const userRules = reactive({
    name:[
        {required:true,message:'用户名不能为空',trigger:'blur'},
        {min:3,max:10,message:'长度在3到10个字符',trigger:'blur'}
    ],
    pwd:[
        {required:true,message:'密码不能为空',trigger:'blur'}
    ]
})
//创建路由对象
const router = useRouter()


//定义ref
const userFormRef = ref(null)
//定义重置表单方法
const resetForm = (formRef)=>{
    formRef.resetFields()
}
//定义登录功能
const submitForm = (formRef)=>{
    formRef.validate((valid)=>{
        if (valid) {
            console.log('验证成功')
            api.login(user).then(res=>{
                //根据响应结果进行处理
                if(res.data.status == 200){
                    ElMessage({
                        message: res.data.msg,
                        type: 'success'
                    })
                    //记录登录的token值
                    sessionStorage.setItem('token',res.data.token)
                    //跳转到主页
                    router.push('/')                   
                }else{
                    ElMessage.warning(res.data.msg)
                    // ElMessage({
                    //     message: 'Warning, this is a warning message.',
                    //     type: 'warning',
                    // })                 
                }
            })           
        }else{
            console.log('验证失败')
            return false
            }
    })
}

</script>

<style scoped>
    .main{
        width: 100%;
        height: 100%;
        background-color: peru;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .login{
        width: 425px;
        height: 350px;
        background-color: white;
    }
    .logo{
        width: 200px;
        margin: auto;
        margin-top: -100px;
    }
    img{
        width: 100%;
        height: 100%;

    }
    .user_form{
        padding: 20px;
    }
</style>