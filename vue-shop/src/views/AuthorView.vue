<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-row>
            <el-button type="primary" :icon="Plus">添加角色</el-button>
        </el-row>
        <el-row>
            <el-table :data="tableData.authorList" stripe style="width: 100%">
                <el-table-column type="expand">
                    <template #default="scope">
                        <el-row v-for="m in scope.row.menus">
                            <el-col :span="2"><el-tag class="margin-10" closable @click="removeMenu(scope.row,m.id)">{{ m.name }}</el-tag></el-col>
                            <el-col :span="1"><el-icon class="margin-15"><CaretRight/></el-icon></el-col>
                            <el-col :span="21"><el-tag class="margin-10" v-for="cm in m.children" :key="cm.id" type="success" closable @click="removeMenu(scope.row,cm.id)">{{ cm.name }}</el-tag></el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID"  />
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="desc" label="详情" />
                <el-table-column label="操作" >
                    <template #default="scope">
                        <el-button type="success">编辑</el-button>
                        <el-button type="primary" @click="showMenuDialog(scope.row)">分配权限</el-button>
                        <el-button type="danger">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
    v-model="menuDialogVisible"
    title="分配权限"
    width="500"
    :before-close="handleClose"
    >
        <el-tree  
        show-checkbox :data="menuList" 
        :props="menuProps" @node-click="handleNodeClick"
        node-key="id" ref="treeRef" default-expand-all="true"
        />
        <template #footer>
        <div class="dialog-footer">
            <el-button @click="menuDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitMenu">
            确定
            </el-button>
        </div>
        </template>
    </el-dialog>

    
</template>

<script setup>
import { ArrowRight,Plus } from '@element-plus/icons-vue'
import api from '@/api/index'
import { reactive,onMounted, ref, nextTick } from 'vue';

const tableData = reactive({
    authorList:[]
})

let menuDialogVisible = ref(false);

let menuList = reactive([]);

const menuProps = {
    children: 'children',
    label: 'name'
};

let keyList = reactive([]);

const treeRef = ref(null);

let rid = ref(null); 

//生命周期函数，页面加载完成后执行
onMounted(()=>{
    get_author_list()
    getMenuList()
})

const get_author_list = () =>{  
    api.get_roles().then(res=>{
        console.log(res);   
        tableData.authorList=res.data.data                     
    })
    
}

//删除角色权限
const removeMenu = (row,mid) => {
  ElMessageBox.confirm(
    '确定要删除该角色权限吗?',
    '警告',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '删除成功!',
      })
      api.del_role_menu(row.id,mid).then(res=>{
        // console.log(res);
        get_author_list()  //刷新页面
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}

//分配权限
const showMenuDialog = (row) => {
    menuDialogVisible.value = true;
    //初始化keyList
     const keyList = []
    //获取一级菜单
    row.menus.forEach(item => {
        if (item.children && item.children.length > 0) {
            // 有子菜单，收集所有子菜单 id（子菜单被选中才需要）
            item.children.forEach(citem => {
                keyList.push(citem.id);
            });
        } else {
            // 没有子菜单，把一级菜单的 id 加入（像订单管理这样的节点）
            keyList.push(item.id);
        }
    });
    // console.log(keyList);
    //给树结构设置默认选中
    nextTick(() => {
        //渲染dom完成后执行
        treeRef.value.setCheckedKeys(keyList)
    })
    rid.value = row.id
    
}

const getMenuList = () =>{
    api.get_menu().then(res=>{
        // console.log(res);
        menuList = res.data.data
    })
}

const submitMenu = () =>{
    // 获取菜单ID
    let mids = [
        treeRef.value.getCheckedKeys(),
        treeRef.value.getHalfCheckedKeys()
    ]
    mids = mids.join(',')
    // console.log(mids);
    //获取角色ID
    // console.log(rid.value);
    //提交数据
    api.set_menu(rid.value,{'mids':mids}).then(res=>{
        console.log(res);
        menuDialogVisible.value = false;
        get_author_list()  //刷新页面
    })
}

</script>

<style scoped>
.box-card {
    margin-top: 20px;
}
.margin-10 {
    margin: 10px;
}
.margin-15 {
    margin: 15px;
}
</style>