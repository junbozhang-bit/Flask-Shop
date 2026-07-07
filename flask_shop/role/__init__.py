from flask import Blueprint
from flask_restful import Api
#创建蓝图
role_bp = Blueprint('role',__name__)
#创建Api对象
role_api = Api(role_bp)
from flask_shop.role import view