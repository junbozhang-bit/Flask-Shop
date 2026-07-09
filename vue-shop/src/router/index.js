import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import WelcomeView from '@/views/WelcomeView.vue'
import UserView from '@/views/UserView.vue'
import MenuView from '@/views/MenuView.vue'
import AuthorView from '@/views/AuthorView.vue'
import GroupView from '@/views/GroupView.vue'
import AttributeView from '@/views/AttributeView.vue'
import ProductView from '@/views/ProductView.vue'
import AddProductView from '@/views/AddProductView.vue'
import OrderView from '@/views/OrderView.vue'
import DataView from '@/views/DataView.vue'
const routes = [
  {
    path:'/login',
    name:'login',
    component:LoginView
  },
  {
    path:'/',
    name:'home',
    component:HomeView,
    redirect:'/welcome',
    children:[
      {
        path:'/welcome',
        name:'welcome',
        // component:() => import('../views/WelcomeView.vue')
        component:WelcomeView
      },
      {
        path:'/user_list',
        name:'user_list',
        component:UserView
      },
      {
        path:'role_list',
        name:'role_list',
        component:MenuView
      },
      {
        path:'/author_list',
        name:'author_list',
        component:AuthorView
      },
      {
        path:'/group_list',
        name:'group_list',
        component:GroupView
      },
      {
        path:'/attribute_list',
        name:'attribute_list',
        component:AttributeView
      },
      {
        path:'/product_list',
        name:'product_list',
        component:ProductView
      },
      {
        path:'/add_product',
        name:'add_product',
        component:AddProductView
      },
      {
        path:'/order_list',
        name:'order_list',
        component:OrderView
      },
      {
        path:'/data_list',
        name:'data_list',
        component:DataView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

//做router跳转的login_required验证装饰器
router.beforeEach((to,from,next)=>{
  if (to.path === '/login'){
    next()
  }else{
    const token = sessionStorage.getItem('token')
    if (!token){
      next('/login')
    }
    next()
  }
})
