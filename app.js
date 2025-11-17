// 智能单车商城应用逻辑

// 产品数据（将从Supabase获取）
let products = [];

// 备用模拟数据（当Supabase不可用时使用）
const fallbackProducts = [
    {
        id: 1,
        name: "智能城市通勤车",
        category: "city",
        price: 2999,
        image: "🚲",
        description: "适合城市通勤的智能单车，轻便舒适",
        features: ["GPS定位", "手机App控制", "续航80公里"]
    },
    {
        id: 2,
        name: "山地越野智能车",
        category: "mountain",
        price: 4599,
        image: "🚵",
        description: "专业级山地越野智能单车，性能强劲",
        features: ["全地形适应", "高性能减震", "防水设计"]
    },
    {
        id: 3,
        name: "电动助力单车",
        category: "electric",
        price: 3899,
        image: "⚡",
        description: "智能电动助力，轻松应对各种路况",
        features: ["电动助力", "智能电池管理", "多种骑行模式"]
    },
    {
        id: 4,
        name: "折叠智能单车",
        category: "city",
        price: 2599,
        image: "🚲",
        description: "便携折叠设计，城市出行首选",
        features: ["一键折叠", "轻量化设计", "便携存放"]
    },
    {
        id: 5,
        name: "儿童智能单车",
        category: "city",
        price: 1899,
        image: "🚲",
        description: "专为儿童设计的智能安全单车",
        features: ["安全限速", "家长监控", "趣味学习功能"]
    },
    {
        id: 6,
        name: "竞赛级公路车",
        category: "mountain",
        price: 6899,
        image: "🚴",
        description: "专业竞赛级公路智能单车",
        features: ["空气动力学", "专业级组件", "竞赛模式"]
    }
];

// 购物车数据
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// 页面初始化
document.addEventListener('DOMContentLoaded', async function() {
    console.log('页面开始初始化...');
    
    // 确保页面完全加载后再执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
});

async function initApp() {
    console.log('开始初始化应用...');
    
    // 等待Supabase库加载完成
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase库未加载，请检查CDN链接');
        products = fallbackProducts;
        // 直接使用备用数据初始化页面
        setTimeout(() => {
            initPages();
            console.log('使用备用数据初始化完成，产品数量:', products.length);
        }, 100);
        return;
    }
    
    // 初始化 Supabase 连接
    const supabaseConnected = initSupabase();
    
    // 根据Supabase连接状态加载数据
    if (supabaseConnected) {
        console.log('尝试从Supabase加载数据...');
        await loadProductsFromSupabase();
    } else {
        console.warn('Supabase连接失败，使用备用数据');
        products = fallbackProducts;
    }
    
    // 确保DOM元素已经存在后再初始化页面
    setTimeout(() => {
        initPages();
        console.log('页面初始化完成，产品数量:', products.length);
    }, 100);
}

function initPages() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initHomePage();
            break;
        case 'products.html':
            initProductsPage();
            break;
        case 'cart.html':
            initCartPage();
            break;
        case 'orders.html':
            initOrdersPage();
            break;
    }
}

// 首页初始化
function initHomePage() {
    displayFeaturedProducts();
}

// 产品页初始化
function initProductsPage() {
    displayAllProducts();
    setupFilters();
}

// 购物车页初始化
function initCartPage() {
    displayCartItems();
    updateCartSummary();
}

// 订单页初始化
function initOrdersPage() {
    displayOrders();
}

// 从Supabase加载产品数据
async function loadProductsFromSupabase() {
    try {
        console.log('正在从Supabase加载产品数据...');
        
        // 测试更简单的查询，先不添加任何条件
        const { data, error } = await supabase
            .from('products')
            .select('*');
            // .eq('is_active', true)
            // .order('created_at', { ascending: false });
        
        if (error) {
            console.error('❌ 从Supabase加载产品失败:', error);
            showNotification('❌ 无法加载产品数据，请检查数据库连接');
            products = fallbackProducts;
            return;
        }
        
        console.log('从Supabase获取的原始数据:', data);
        console.log('数据类型:', typeof data);
        console.log('数据长度:', data ? data.length : 0);
        
        if (data && data.length > 0) {
            // 详细检查每个字段
            data.forEach((item, index) => {
                console.log(`产品 ${index + 1}:`, {
                    id: item.id,
                    name: item.name,
                    category: item.category,
                    price: item.price,
                    description: item.description,
                    features: item.features
                });
            });
            
            // 转换Supabase数据格式
            products = data.map(item => ({
                id: item.id || 0,
                name: item.name || '未命名产品',
                category: item.category || 'city',
                price: parseFloat(item.price) || 0,
                image: item.image_url ? "🖼️" : "🚲",
                description: item.description || '暂无描述',
                features: Array.isArray(item.features) ? item.features : []
            }));
            console.log(`✅ 成功从Supabase加载 ${products.length} 个真实产品`);
            console.log('转换后的产品数据:', products);
            showNotification(`✅ 已加载 ${products.length} 个真实产品`);
        } else {
            console.warn('⚠️ Supabase中没有产品数据，使用备用数据');
            products = fallbackProducts;
            showNotification('⚠️ 数据库为空，使用演示数据');
        }
    } catch (error) {
        console.error('❌ 加载产品数据时出错:', error);
        products = fallbackProducts;
        showNotification('❌ 数据库连接失败，使用演示数据');
    }
}

// 创建订单到Supabase
async function createOrderInSupabase(orderData) {
    if (!supabase) return null;
    
    try {
        // 创建订单
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert([{
                total_amount: orderData.total,
                status: 'pending',
                shipping_address: '待填写',
                payment_method: '未选择'
            }])
            .select();
        
        if (orderError) {
            console.error('创建订单失败:', orderError);
            return null;
        }
        
        // 创建订单项
        const orderItems = orderData.items.map(item => ({
            order_id: order[0].id,
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price
        }));
        
        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);
        
        if (itemsError) {
            console.error('创建订单项失败:', itemsError);
            return null;
        }
        
        console.log('✅ 订单已保存到Supabase');
        return order[0];
    } catch (error) {
        console.error('保存订单时出错:', error);
        return null;
    }
}

// 显示热门产品
function displayFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    const featuredProducts = products.slice(0, 3);
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// 显示所有产品
function displayAllProducts(filteredProducts = products) {
    const container = document.getElementById('products-container');
    if (!container) {
        console.error('❌ 找不到产品容器 #products-container');
        return;
    }
    
    console.log('正在显示产品，数量:', filteredProducts.length);
    console.log('产品数据:', filteredProducts);
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>暂无产品数据</p></div>';
        return;
    }
    
    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    // 添加添加到购物车的事件监听
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            addToCart(productId);
        });
    });
    
    console.log('✅ 产品显示完成');
}

// 创建产品卡片
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">¥${product.price.toLocaleString()}</div>
            <button class="add-to-cart" data-product-id="${product.id}">
                加入购物车
            </button>
        </div>
    `;
}

// 设置筛选器
function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
}

// 筛选产品
function filterProducts() {
    const category = document.getElementById('category-filter').value;
    const priceSort = document.getElementById('price-filter').value;
    
    let filtered = products;
    
    // 按分类筛选
    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }
    
    // 按价格排序
    if (priceSort === 'asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === 'desc') {
        filtered.sort((a, b) => b.price - a.price);
    }
    
    displayAllProducts(filtered);
}

// 添加到购物车
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification(`"${product.name}" 已添加到购物车`);
}

// 显示购物车商品
function displayCartItems() {
    const container = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const summary = document.getElementById('cart-summary');
    
    if (!container) return;
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        summary.style.display = 'none';
        container.innerHTML = '';
        return;
    }
    
    emptyCart.style.display = 'none';
    summary.style.display = 'block';
    
    container.innerHTML = cart.map(item => createCartItem(item)).join('');
    
    // 添加事件监听
    document.querySelectorAll('.quantity-decrease').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(parseInt(this.dataset.productId), -1);
        });
    });
    
    document.querySelectorAll('.quantity-increase').forEach(button => {
        button.addEventListener('click', function() {
            updateQuantity(parseInt(this.dataset.productId), 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            removeFromCart(parseInt(this.dataset.productId));
        });
    });
}

// 创建购物车商品项
function createCartItem(item) {
    return `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-image">${item.image}</div>
                <div>
                    <h3>${item.name}</h3>
                    <p>¥${item.price.toLocaleString()}</p>
                </div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-decrease" data-product-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-increase" data-product-id="${item.id}">+</button>
                <button class="remove-item" data-product-id="${item.id}">删除</button>
            </div>
        </div>
    `;
}

// 更新商品数量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        displayCartItems();
        updateCartSummary();
    }
}

// 从购物车移除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCartItems();
    updateCartSummary();
    showNotification('商品已从购物车移除');
}

// 更新购物车汇总
function updateCartSummary() {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('total-price').textContent = `¥${totalPrice.toLocaleString()}`;
    document.getElementById('final-price').textContent = `¥${totalPrice.toLocaleString()}`;
}

// 结算
async function checkout() {
    if (cart.length === 0) {
        showNotification('购物车为空，无法结算');
        return;
    }
    
    const order = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending'
    };
    
    // 尝试保存到Supabase
    if (supabase) {
        const supabaseOrder = await createOrderInSupabase(order);
        if (supabaseOrder) {
            // 如果成功保存到Supabase，使用Supabase的订单ID
            order.supabase_id = supabaseOrder.id;
            showNotification('✅ 订单已保存到数据库！');
        } else {
            showNotification('⚠️ 订单保存到本地，数据库连接失败');
        }
    }
    
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // 清空购物车
    cart = [];
    saveCart();
    
    setTimeout(() => {
        window.location.href = 'orders.html';
    }, 1500);
}

// 显示订单
function displayOrders() {
    const container = document.getElementById('orders-list');
    const emptyOrders = document.getElementById('empty-orders');
    
    if (!container) return;
    
    if (orders.length === 0) {
        emptyOrders.style.display = 'block';
        container.innerHTML = '';
        return;
    }
    
    emptyOrders.style.display = 'none';
    container.innerHTML = orders.map(order => createOrderCard(order)).reverse().join('');
}

// 创建订单卡片
function createOrderCard(order) {
    return `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <strong>订单号: #${order.id}</strong>
                    <p>日期: ${order.date}</p>
                </div>
                <div class="order-status status-${order.status}">
                    ${order.status === 'pending' ? '待处理' : '已完成'}
                </div>
            </div>
            <div>
                ${order.items.map(item => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>¥${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: right; margin-top: 15px; font-weight: bold;">
                总计: ¥${order.total.toLocaleString()}
            </div>
        </div>
    `;
}

// 保存购物车到本地存储
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 3秒后移除通知
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);