// Supabase 配置 - 请在部署前更新为您的实际项目配置
let SUPABASE_URL = "https://qbdadltuqpdfbacbvvdu.supabase.co";
let SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiZGFkbHR1cXBkZmJhY2J2dmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTM2MDAsImV4cCI6MjA3NzA4OTYwMH0.OXXWyhvxPxHoAuscCQcUYpjMLwjvtNQo-WboVvGSAf8";

// 创建 Supabase 客户端
let supabase;

// 初始化 Supabase 连接
function initSupabase() {
    try {
        console.log('开始初始化Supabase连接...');
        console.log('URL:', SUPABASE_URL);
        console.log('Key长度:', SUPABASE_ANON_KEY.length);
        
        // 检查是否已配置有效的 Supabase 凭据
        if (SUPABASE_URL.includes('your-project-ref') || SUPABASE_ANON_KEY.includes('your-anon-key')) {
            console.warn('⚠️ Supabase 配置未更新，请检查 config.js 文件');
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
// 1. 访问 https://supabase.com 创建项目
// 2. 在项目设置中获取 URL 和 anon key
// 3. 替换上面的示例值