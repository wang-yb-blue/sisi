# 📋 Supabase 部署指南

## ❓ 为什么 Supabase 会拒绝连接？

Supabase 拒绝连接通常有以下原因：

### 1. **配置未更新**
在 `config.js` 文件中，Supabase 的 URL 和 API Key 仍然是示例值：
```javascript
const SUPABASE_URL = "https://your-project-ref.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
```

### 2. **项目未创建**
- 您需要在 Supabase 官网创建实际项目
- 示例配置无法连接到真实数据库

### 3. **Row Level Security (RLS) 策略**
- 数据库表启用了行级安全策略
- 需要配置正确的访问策略

## 🚀 完整部署步骤

### 第一步：创建 Supabase 项目

1. **访问 [Supabase官网](https://supabase.com)**
2. **注册/登录账户**
3. **创建新项目**：
   - 点击 "New Project"
   - 输入项目名称（如：smart-bike-shop）
   - 选择地区（推荐：亚洲地区）
   - 设置数据库密码
   - 点击 "Create new project"

4. **获取项目配置**：
   - 进入项目设置 → API
   - 复制 "Project URL" 和 "anon public" key

### 第二步：更新配置文件

1. **打开 `config.js` 文件**
2. **替换示例配置**：
```javascript
const SUPABASE_URL = "https://your-actual-project-ref.supabase.co";
const SUPABASE_ANON_KEY = "your-actual-anon-key";
```

3. **保存文件**

### 第三步：设置数据库表

1. **进入 Supabase SQL 编辑器**
2. **复制并执行 `supabase_tables.sql` 文件内容**
3. **检查表是否创建成功**

### 第四步：配置 RLS 策略

在 Supabase 控制台中：
1. **表编辑器** → **products 表** → **策略**
2. **创建新策略**：允许所有人查看产品
3. **类似设置 orders 表的策略**

### 第五步：部署到 Netlify

1. **将代码推送到 GitHub**
2. **登录 [Netlify](https://netlify.com)**
3. **新建站点** → **从 Git 导入**
4. **选择仓库** → **设置构建选项**：
   - 构建命令：留空
   - 发布目录：`/`
5. **点击部署**

## 🔧 测试连接

### 检查连接状态
在浏览器控制台中查看：
- 打开网站 → F12 → Console
- 应该看到："✅ Supabase 连接已初始化"

### 常见错误解决

#### 错误 1："Invalid API key"
- 检查 `config.js` 中的 API Key 是否正确
- 确保复制的的是 "anon public" key

#### 错误 2："CORS policy"
- 在 Supabase 设置中检查 CORS 配置
- 添加 Netlify 域名到允许列表

#### 错误 3："RLS policy"
- 检查数据库表的 RLS 策略
- 确保有正确的读取/写入权限

## 📊 项目结构说明

### 数据表设计
- **products 表**：存储智能单车产品信息
- **users 表**：用户信息（预留）
- **orders 表**：订单信息
- **order_items 表**：订单项关联表

### 功能特性
- ✅ **自动降级**：Supabase 不可用时使用本地数据
- ✅ **双重存储**：订单同时保存到本地和数据库
- ✅ **错误处理**：友好的错误提示和恢复机制
- ✅ **响应式设计**：适配各种设备

## 🎯 作业要求检查清单

| 要求 | 状态 | 说明 |
|------|------|------|
| 3个独立页面 | ✅ 完成 | 首页、产品、购物车、订单 |
| 3张数据表 | ✅ 完成 | products, users, orders |
| Supabase 集成 | ✅ 完成 | 完整的数据存储方案 |
| Netlify 部署 | 🔄 待部署 | 需要您完成部署步骤 |
| 静态页面 | ✅ 完成 | 纯 HTML/CSS/JS |

## 💡 提示

1. **先测试本地**：在本地浏览器中测试功能
2. **逐步部署**：先配置 Supabase，再部署到 Netlify
3. **检查控制台**：部署后查看浏览器控制台错误信息
4. **备用方案**：即使 Supabase 配置失败，网站仍可正常使用

## 📞 技术支持

如果遇到问题：
1. 检查浏览器控制台错误信息
2. 确认 Supabase 项目配置正确
3. 查看 Netlify 部署日志
4. 重新阅读本指南的对应章节

---

**完成以上步骤后，您将获得一个完整的智能单车商城网站！** 🎉