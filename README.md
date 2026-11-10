# Flask-Shop

基于 Flask 和 Vue 3 的商城后台管理示例项目。后端提供用户、角色与菜单、商品分类与属性、商品、订单和统计接口；前端使用 Vue CLI、Element Plus、ECharts 和 TinyMCE。

## 项目结构

| 路径 | 用途 |
| --- | --- |
| `manager.py`、`config.py` | Flask 入口与数据库配置 |
| `flask_shop/` | API、数据模型和上传文件 |
| `migrations/` | Flask-Migrate 数据库迁移 |
| `db_sql/` | 可选的演示数据 SQL |
| `vue-shop/` | Vue 3 管理后台 |
| `test/` | HTTP 请求示例 |

## 本地运行

需要 Python 3、MySQL、Node.js 和 npm。以下命令以 PowerShell 为例，在仓库根目录执行。仓库目前没有 `requirements.txt`，Python 依赖根据后端实际导入列出；前端依赖版本由 `vue-shop/package-lock.json` 管理。

### 1. 安装后端依赖

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install Flask Flask-SQLAlchemy Flask-Migrate Flask-Cors Flask-RESTful PyMySQL PyJWT
```

### 2. 准备数据库

在本地 MySQL 中创建名为 `flask_shop` 的数据库，字符集建议使用 `utf8mb4`。然后检查 `config.py` 中的 `MYSQL_USERNAME`、`MYSQL_PASSWORD`、`MYSQL_HOST`、`MYSQL_PORT` 和 `MYSQL_DB`，使其与本地数据库一致。当前配置直接写在文件中，请勿把个人数据库凭据提交到仓库。

仓库已包含 `migrations/`，无需再次运行 `flask db init`。激活虚拟环境后执行：

```powershell
$env:FLASK_APP = "manager.py"
flask db upgrade
python manager.py
```

后端默认监听 `http://127.0.0.1:5000`。迁移只创建表，不会创建登录账号。

`db_sql/` 中的 SQL 是演示数据，并非完整数据库备份。`user_data.sql` 实际写入菜单，不包含用户；`role_menu_data.sql` 引用了角色 ID `1` 和 `3`，其他文件也依赖固定的分类、用户或订单 ID。需要导入时，请先检查目标数据库中的记录与外键关系，避免重复导入或引用不存在的 ID。

### 3. 启动前端

另开一个终端：

```powershell
cd vue-shop
npm ci
npm run serve
```

打开终端显示的前端地址（Vue CLI 默认是 `http://localhost:8080`）。前端 API 地址写在 `vue-shop/src/api/base.js`，默认是 `http://localhost:5000`；更改后端端口时需要同步调整。

### 4. 创建账号

项目没有预置账号，也没有前端注册页面。后端启动并完成建表后，可调用 `POST /user/users/` 创建测试账号。该接口要求 `name`、`pwd`、`real_pwd`、`phone` 和 `email`；`role_id` 可选。如果需要按角色显示菜单，应先准备角色及菜单关联数据，再传入有效的 `role_id`。请求格式可参考 `test/user.http`。

## 已知限制

- 后端登录接口返回的 token 位于 `data.token`，当前前端登录页读取的是 `res.data.token`；登录成功后页面可能因未保存 token 而再次跳转到登录页。需要在前端修正读取路径后再验证完整登录流程。
- `SECRET_KEY` 在应用启动时随机生成，重启后已签发的 token 会失效。
- 项目没有固定的 Python 依赖版本或自动化测试配置；上述安装和迁移步骤需在你的本地环境验证。
