/**
 * 存放所有的api接口
 */
const base = {
    baseURL:'http://localhost:5000',    //服务器地址
    login:'/user/login/',      //登录地址
    // test:'/user/test/'
    get_menu:'/menu/menus/?type_=tree',  //获取菜单,以树形结构返回
    get_menu_list:'/menu/menus/',  //获取菜单，以列表结构返回
    get_users:'/user/users/' , //获取用户列表
    get_user_by_id:'/user/user/' ,  //根据id获取用户信息
    edit_user:'/user/user/',  //修改用户数据
    delete_user:'/user/user/',   //删除用户
    rest_user:'/user/rest_pwd/',  //重置用户密码
    get_roles:'/roles/',  //获取角色列表
    del_role_menu:'/role/', //删除当前角色对应的权限
    set_menu:'/role/', //分配权限，给角色分配菜单
    get_category:'/categorys/',  //获取分类列表
    add_category:'/categorys/',  //添加分类
    get_attr_by_category:'/attributes/',  //根据分类获取属性
    add_attribute:'/attributes/',   //根据分类增加属性
    add_attr_value:'/attribute/',  //增加属性值
    delete_attr_value:'/attribute/',  //删除属性值
    get_product_list:'/products/',  //获取商品列表
    delete_product_list:'/product/', //删除商品列表
    upload_img:'/upload_img/',  //上传图片
    add_product:'/products/',  //增加商品
    get_orders:'/orders/',   //获取商品
    get_expresses:'/expresses/',  //获取物流信息
    get_cate_group:'/cate_group/',  //获取分类分组
}

export default base