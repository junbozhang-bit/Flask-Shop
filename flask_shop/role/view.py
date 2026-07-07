from flask_restful import Resource,reqparse
from flask_shop import models,db
from flask_shop.role import role_api,role_bp
from flask import request

#多数据操作
class Roles(Resource):
    def get(self):
        '''获取角色列表'''
        try:
            #获取角色列表
            Roles = models.Role.query.all()
            role_list = [role.to_dict() for role in Roles]
            return {'status':200,'msg':'获取角色列表成功','data':role_list}
        except Exception as e:
            return {'status':400,'msg':'获取角色列表失败','data':str(e)}
        
    def post(self):
        '''添加角色'''
        try:
            #获取角色名称
            name = request.get_json().get('name')  #application/json
            desc = request.get_json().get('desc')
            role = models.Role(name=name,desc=desc)
            db.session.add(role)
            db.session.commit()
            return {'status':200,'msg':'添加角色成功'}
        except Exception as e:
            return {'status':400,'msg':'添加角色失败'}
        
role_api.add_resource(Roles,'/roles/')

#单一数据操作
class Role(Resource):
    def delete(self,id):
        '''
        删除角色
        '''
        try:
            role = models.Role.query.get(id)
            db.session.delete(role)
            db.session.commit()
            return {'status':200,'msg':'删除角色成功'}
        except Exception as e:
            return {'status':400,'msg':'删除角色失败'}
        
    def put(self,id):
        '''
        更新角色
        '''
        try:
            role = models.Role.query.get(id)
            #创建RequestParser对象,用来接收数据
            parser = reqparse.RequestParser()
            #添加参数
            parser.add_argument('name',type=str,required=True,help='角色名称不能为空')
            parser.add_argument('desc',type=str)
            #解析参数
            args = parser.parse_args()
            if args.get('name'):
                role.name = args.get('name')
                # role.name = args.name
            if args.get('desc'):   
                role.desc = args.get('desc')
                # role.desc = args.desc
            db.session.commit()
            return {'status':200,'msg':'更新角色成功'}
        except Exception as e:  
            return {'status':400,'msg':'更新角色失败'}
         
role_api.add_resource(Role,'/role/<int:id>/')

#删除指定角色的权限
@role_bp.route('/role/<int:rid>/<int:mid>/')
def del_menu(rid:int,mid:int):
    #查找当前角色信息
    role = models.Role.query.get(rid)
    #查找当前菜单信息
    menu = models.Menu.query.get(mid)
    #判断当前角色与菜单是否存在
    if all([role,menu]):
        if menu in role.menus:
            #删除当前角色的当前菜单
            role.menus.remove(menu)
            if menu.level==1:
                #删除当前一级菜单下的所有二级菜单
                for temp in menu.children:
                    if temp in role.menus:
                        role.menus.remove(temp)
        db.session.commit()
        return {'status':200,'msg':'删除角色菜单成功'}
    else:
        return {'status':400,'msg':'当前角色或菜单不存在'}
    
#分配权限
@role_bp.route('/role/<int:rid>/',methods=['POST'])
def set_menu(rid:int):
    try:
        #获取当前角色信息
        role = models.Role.query.get(rid)
        #获取要分配的权限
        mids = request.get_json().get('mids')
        #清空当前角色的所有权限
        role.menus = []
        #遍历要分配的权限
        mids = mids.split(',')
        for m in mids:
            if m:
                #获取权限
                menu = models.Menu.query.get(int(m))
                #给角色分配权限
                role.menus.append(menu)
        db.session.commit()
        return {'status':200,'msg':'分配权限成功'}
    except Exception as e:
        return {'status':400,'msg':'分配权限失败'}