'''
1.加密的数据
userid
2.加密的算法
pip install pyjwt
3.加密的密匙
SECRET_KEY 
'''

import jwt
from flask import current_app,request
import time
from functools import wraps
#生成token
def generate_token(data):
    #data是要加密的一个数据，类型是字典
    #数据的加密
    #设置数据data过期时间
    data.update({'exp':time.time()+current_app.config['JWT_EXPIRATION_DELTA']})#过期
    token = jwt.encode(data,current_app.config['SECRET_KEY'],algorithm='HS256')
    return token

#解密token
def verify_token(token):
    #数据的解密
    try:
        data = jwt.decode(token,current_app.config['SECRET_KEY'],algorithms='HS256')
    except Exception as e:
        return None 
    return data

def login_required(view_func):
    @wraps(view_func)
    def verify_token_info(*args,**kwargs):
        #获取用户传递的token
        token = request.headers.get('token')
        #解析token
        if verify_token(token):
            return view_func(*args,**kwargs)
        else:
            return {'status':400,'msg':'token错误'}
    return verify_token_info