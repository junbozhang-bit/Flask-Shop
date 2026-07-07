from flask import Blueprint
from flask_restful import Api
#创建蓝图
menu_bp = Blueprint('menu',__name__,url_prefix='/menu')
#创建api
menu_api = Api(menu_bp)
from . import views