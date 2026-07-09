<template>    
    <div class="common-layout container">
        <el-container class="container">
            <el-header class="header">
                <div class="logo">
                    <img src="../assets/logo.png" alt=""></img>
                    <span>电商后台管理系统</span>
                    
                </div>
                <div class="user">
                    <el-button @click="logout">退出</el-button>
                    <!-- <el-button @click="test1">测试</el-button> -->
                </div>                
            </el-header>
            <el-container>
                <el-aside width="200px" class="aside">
                    <el-menu
                        active-text-color="#ffd04b"
                        background-color="#545c64"
                        class="el-menu-vertical-demo"
                        default-active="2"
                        text-color="#fff"
                        unique-opened
                        router
                    >
                        <el-sub-menu :index="index+' '" v-for="(item,index) in menuList.menus">
                            <template #title>
                                <el-icon>
                                    <!-- <location /> -->
                                     <component :is="menuList.icons[item.id]"></component>
                                </el-icon>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="childItem.path" v-for="childItem in item.children">
                                {{childItem.name}}
                            </el-menu-item>                         
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script setup>
    import { useRouter } from 'vue-router';
    import api from '@/api/index'
    import { onMounted,reactive } from 'vue';

    const router = useRouter()

    const menuList = reactive({
        menus:[],
        icons:{
            '1':'User',
            '2':'Tools',
            '3':'Goods',
            '4':'Shop',
            '5':'PieChart'
        }
    })

    onMounted(()=>{
        get_menu()
    })
    const logout = () =>{
        //退出登录，删除token
        sessionStorage.removeItem('token')
        router.push('/login')
    }
    // const test1 = () =>{
    //     api.test().then(res=>{
    //         console.log(res);
            
    //     })
    // }
    const get_menu = () =>{
        api.get_menu().then(res=>{
            menuList.menus=res.data.data                     
        })
    }

</script>
<style scoped> 
    .header{
        background-color: #fff;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
        font-size: 20px;
        color: #999;
        height: 50px;
        width: 100%;
    }
    .logo{
        float: left;
        height: 50px;
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .logo img{
        width: 50px;
        height: 30px;
        margin: 10px;
    }
    .user{
        float: right;
        display: flex;
        justify-content: center;
        height: 50px;
        align-items: center;

    }
    .container{
        height: 100%;
    }
    .aside{
        background-color: #545c64;
    }
</style>