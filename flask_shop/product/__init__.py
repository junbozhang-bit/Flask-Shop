from flask import Blueprint
from flask_restful import Api

#创建蓝图
product_bp = Blueprint('product',__name__)
#创建Api对象
product_api = Api(product_bp)

from . import view