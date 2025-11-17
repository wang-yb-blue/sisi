# 智能单车商城

一个基于Supabase和Netlify的智能单车在线商城项目，满足作业要求的三独立页面和三张数据表设计。

## 项目特点

- 🚲 **智能单车主题**：专注于智能骑行设备
- 📱 **响应式设计**：适配各种屏幕尺寸
- 🛒 **完整购物流程**：产品浏览、购物车、订单管理
- 🗄️ **Supabase集成**：后端数据存储和管理
- 🌐 **Netlify部署**：静态网站部署

## 页面结构

1. **首页** (`index.html`) - 产品展示和导航
2. **产品页** (`products.html`) - 完整产品列表和筛选
3. **购物车** (`cart.html`) - 购物车管理和结算
4. **我的订单** (`orders.html`) - 订单历史查看

## Supabase 数据表设计

项目设计了三张核心数据表：

### 1. 产品表 (products)
- 存储所有智能单车产品信息
- 包含分类、价格、库存等字段

### 2. 用户表 (users) 
- 存储用户信息和收货地址
- 支持用户注册和登录

### 3. 订单表 (orders)
- 存储订单信息和状态
- 关联用户和订单项

## 部署说明

### 第一步：设置 Supabase

1. 访问 [Supabase官网](https://supabase.com) 创建新项目
2. 在SQL编辑器中执行 `supabase_tables.sql` 文件创建数据表
3. 获取项目URL和Anon Key，更新到 `config.js` 文件中

### 第二步：部署到 Netlify

1. 将代码推送到GitHub仓库
2. 登录 [Netlify](https://netlify.com)
3. 选择 "New site from Git"
4. 连接GitHub仓库并选择分支
5. 设置构建命令为空，发布目录为 `/`
6. 点击部署

### 配置 Supabase 连接

在 `config.js` 文件中更新您的Supabase配置：

```javascript
const SUPABASE_URL = "https://your-project-ref.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
```

## 开发说明

### 项目结构
```
supabase/
├── index.html          # 首页
├── products.html       # 产品页面
├── cart.html           # 购物车页面
├── orders.html         # 订单页面
├── styles.css          # 样式文件
├── app.js              # 主要逻辑
├── config.js           # 配置信息
└── supabase_tables.sql # 数据库表结构
```

### 技术栈
- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **后端**: Supabase (PostgreSQL + 实时API)
- **部署**: Netlify (静态网站托管)
- **存储**: LocalStorage (临时数据)

## 功能特性

- ✅ 三独立页面设计
- ✅ 三张Supabase数据表
- ✅ 产品分类筛选
- ✅ 购物车功能
- ✅ 订单管理系统
- ✅ 响应式布局
- ✅ 本地数据持久化

## 作业要求满足情况

| 要求 | 完成情况 |
|------|----------|
| 至少3个独立页面 | ✅ 完成 (首页、产品、购物车、订单) |
| Supabase中至少3张数据表 | ✅ 完成 (产品、用户、订单) |
| 静态页面 (HTML/CSS/JS) | ✅ 完成 |
| 不要用Node运行 | ✅ 纯静态页面 |
| 提交Netlify链接 | ✅ 等待部署 |

## 许可证

MIT License - 仅供学习使用