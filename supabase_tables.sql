-- 智能单车商城 - Supabase 数据表设计
-- 符合作业要求的3张数据表设计

-- 1. 产品表 (products)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('city', 'mountain', 'electric')),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    image_url VARCHAR(500),
    description TEXT,
    features JSONB,
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 用户表 (users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 订单表 (orders)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    shipping_address TEXT,
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 订单项表 (order_items) - 关联表
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 插入示例数据
INSERT INTO products (name, category, price, image_url, description, features, stock_quantity) VALUES
('智能城市通勤车', 'city', 2999.00, 'https://example.com/bike1.jpg', '适合城市通勤的智能单车，轻便舒适', '["GPS定位", "手机App控制", "续航80公里"]', 50),
('山地越野智能车', 'mountain', 4599.00, 'https://example.com/bike2.jpg', '专业级山地越野智能单车，性能强劲', '["全地形适应", "高性能减震", "防水设计"]', 30),
('电动助力单车', 'electric', 3899.00, 'https://example.com/bike3.jpg', '智能电动助力，轻松应对各种路况', '["电动助力", "智能电池管理", "多种骑行模式"]', 25),
('折叠智能单车', 'city', 2599.00, 'https://example.com/bike4.jpg', '便携折叠设计，城市出行首选', '["一键折叠", "轻量化设计", "便携存放"]', 40),
('儿童智能单车', 'city', 1899.00, 'https://example.com/bike5.jpg', '专为儿童设计的智能安全单车', '["安全限速", "家长监控", "趣味学习功能"]', 35),
('竞赛级公路车', 'mountain', 6899.00, 'https://example.com/bike6.jpg', '专业竞赛级公路智能单车', '["空气动力学", "专业级组件", "竞赛模式"]', 15);

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 启用 Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 创建简单的策略（实际项目中需要更复杂的策略）
CREATE POLICY "允许所有人查看产品" ON products FOR SELECT USING (true);
CREATE POLICY "允许所有人创建订单" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "用户只能查看自己的订单" ON orders FOR SELECT USING (auth.uid() = user_id);