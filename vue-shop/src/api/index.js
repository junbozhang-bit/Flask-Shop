import axios from "../utils/requests.js"
import base from "./base.js"

const api = {
    /**
     * 登录功能
     */
    login(params){
        return axios.post(base.baseURL+base.login,params)
    },
    // test(params){
    //     return axios.get(base.baseURL+base.test,params)
    // }
    get_menu(params){
        return axios.get(base.baseURL+base.get_menu,params)
    },
    get_menu_list(params){
        return axios.get(base.baseURL+base.get_menu_list,params)
    },
    get_user_list(params){
        return axios.get(base.baseURL+base.get_users,params)
    },
    add_user(params){
        return axios.post(base.baseURL+base.get_users,params)
    },
    get_user_by_id(id){
        return axios.get(base.baseURL+base.get_user_by_id+id+'/')
    },
    edit_user(id,params){
        return axios.put(base.baseURL+base.edit_user+id+'/',params)
    },
    delete_user(id){
        return axios.delete(base.baseURL+base.delete_user+id+'/')
    },
    rest_user(id){
        return axios.get(base.baseURL+base.rest_user+id+'/')
    },
    get_roles(params){
        return axios.get(base.baseURL+base.get_roles,params)
    },
    del_role_menu(rid,mid){
        return axios.get(base.baseURL+base.del_role_menu+rid+'/'+mid+'/')
    },
    set_menu(rid,params){
        return axios.post(base.baseURL+base.set_menu+rid+'/',params)
    },
    get_category(level){
        return axios.get(base.baseURL+base.get_category+'?level='+level)
    },
    add_category(params){
        return axios.post(base.baseURL+base.add_category,params)
    },
    get_attr_by_category(cid,_type){
        return axios.get(base.baseURL+base.get_attr_by_category+'?cid='+cid+'&_type='+_type)
    },
    add_attribute(params){
        return axios.post(base.baseURL+base.add_attribute,params)
    },
    update_attr_value(id,params){
        return axios.put(base.baseURL+base.add_attr_value+id+'/',params)
    },
    delete_attr_value(id){
        return axios.delete(base.baseURL+base.add_attr_value+id+'/')
    },
    get_product_list(name){
        if (name){
            return axios.get(base.baseURL+base.get_product_list+'?name='+name)
        }else{
        return axios.get(base.baseURL+base.get_product_list)
        }
    },
    delete_product_list(id){
        return axios.delete(base.baseURL+base.delete_product_list+id+'/')
    },
    add_product(params){
        return axios.post(base.baseURL+base.add_product,params)
    },
    get_orders(params){
        return axios.get(base.baseURL+base.get_orders,params)
    },
    get_expresses(id){
        return axios.get(base.baseURL+base.get_expresses+id+'/')
    },
    get_cate_group(){
        return axios.get(base.baseURL+base.get_cate_group)
    }

}

export default api