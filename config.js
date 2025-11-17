// Supabase 配置 - 从环境变量获取配置
let SUPABASE_URL = "";
let SUPABASE_ANON_KEY = "";

// 创建 Supabase 客户端
let supabase;

// 环境变量配置
const SUPABASE_CONFIG = {
    // 开发环境默认值（当环境变量不存在时使用）
    devUrl: "https://your-project-ref.supabase.co",
    devKey: "your-anon-key-here",
    
    // 生产环境配置标识
    productionUrl: "https://qbdadltuqpdfbacbvvdu.supabase.co",
    productionKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiZGFkbHR1cXBkZmJhY2J2dmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTM2MDAsImV4cCI6MjA3NzA4OTYwMH0.OXXWyhvxPxHoAuscCQcUYpjMLwjvtNQo-WboVvGSAf8"
};

// 从环境变量获取配置
function loadSupabaseConfig() {
    // 在生产环境中，Netlify会通过环境变量提供这些值
    // 在开发环境中，我们可以使用 .env 文件或默认值
    
    // 尝试从环境变量获取（Netlify部署时）
    SUPABASE_URL = window.ENV_SUPABASE_URL || SUPABASE_CONFIG.productionUrl;
    SUPABASE_ANON_KEY = window.ENV_SUPABASE_ANON_KEY || SUPABASE_CONFIG.productionKey;
    
    // 检查是否是生产环境配置
    const isProductionConfig = 
        SUPABASE_URL === SUPABASE_CONFIG.productionUrl && 
        SUPABASE_ANON_KEY === SUPABASE_CONFIG.productionKey;
    
    console.log('Supabase配置加载:');
    console.log('URL:', SUPABASE_URL.substring(0, 30) + '...');
    console.log('Key长度:', SUPABASE_ANON_KEY.length);
    console.log('环境:', isProductionConfig ? '生产环境' : '开发环境');
    
    return isProductionConfig;
}

// 初始化 Supabase 连接
function initSupabase() {
    try {
        console.log('开始初始化Supabase连接...');
        
        // 加载配置
        const isProduction = loadSupabaseConfig();
        
        // 检查是否已配置有效的 Supabase 凭据
        if (SUPABASE_URL.includes('your-project-ref') || SUPABASE_ANON_KEY.includes('your-anon-key')) {
            console.warn('⚠️ Supabase 配置未更新，请设置环境变量');
            return false;
        }
        
        // 检查Supabase对象是否存在
        if (typeof window.supabase === 'undefined') {
            console.error('❌ Supabase库未加载');
            return false;
        }
        
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        });
        
        // 测试连接
        console.log('正在测试Supabase连接...');
        
        console.log('✅ Supabase 连接已初始化');
        return true;
    } catch (error) {
        console.error('❌ Supabase 连接失败:', error);
        return false;
    }
}

// 配置说明：
// 1. 在生产环境中，通过环境变量设置 SUPABASE_URL 和 SUPABASE_ANON_KEY
// 2. 在Netlify中，在 "Site settings" -> "Environment variables" 中设置
// 3. 在开发环境中，可以创建 .env 文件（此文件不要提交到Git）