<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>属性列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-row>
            <el-col :span="8" class="a">
                <el-input v-model="productTable.searchKey" placeholder="请输入要搜索的商品" clearable @clear="getProductList">
                    <template #append>
                        <el-button :icon="Search"  @click="getProductList"/>
                    </template>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addProduct">添加商品</el-button>
            </el-col>
        </el-row>

        <el-row>
            <el-table :data="productTable.data">
                <el-table-column type="index" />
                <el-table-column label="商品名称" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="商品价格" prop="price" width="150"></el-table-column>
                <el-table-column label="商品数量" prop="number" width="150"></el-table-column>
                <el-table-column label="商品状态" prop="state" width="150"></el-table-column>
                <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" size="small">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteProduct(scope.row)">删除</el-button>
                </template>
                </el-table-column>
            </el-table>
        </el-row>
    </el-card>
</template>

<script setup>
import { ArrowRight,Search } from '@element-plus/icons-vue'
import { reactive,onMounted } from 'vue'
import api from '@/api/index'
import { useRouter } from 'vue-router'

const productTable = reactive({
    data:[],
    searchKey:null
})

const router = useRouter()

onMounted(()=>{
    getProductList()
})

const getProductList = () =>{
    api.get_product_list(productTable.searchKey).then(res=>{
        productTable.data = res.data.data
        // console.log(res.data.data);
        
    })
}

const deleteProduct = (row) =>{
    ElMessageBox.confirm(
    '是否要删除'+row.name+'商品?',
    '删除商品',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
        api.delete_product_list(row.id).then(res=>{
            if (res.data.status == 200){
                ElMessage({
                type: 'success',
                message: res.data.msg,
                })
                //删除成功后重新获取列表
                getProductList()
            }
            else{
                ElMessage({
                type: 'info',
                message: res.data.msg,
                })
            }          
        })
      
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}

const addProduct = () =>{
    router.push('/add_product')
}
</script>

<style scoped>
.box-card{
    margin-top: 20px;
}
.a{
    margin-right: 10px;
}
</style>