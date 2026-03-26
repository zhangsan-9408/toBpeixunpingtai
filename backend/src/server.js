require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// 请求限流
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 1000, // 每个IP最多1000个请求
    message: { code: 429, message: '请求过于频繁，请稍后再试' }
});
app.use(limiter);

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/upload', require('./routes/upload'));
// TODO: 添加更多路由
// app.use('/api/progress', require('./routes/progress'));
// app.use('/api/exams', require('./routes/exams'));
// app.use('/api/admin', require('./routes/admin'));

// 健康检查
app.get('/health', (req, res) => {
    res.json({ 
        code: 200, 
        message: '服务正常运行', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// 根路由
app.get('/', (req, res) => {
    res.json({
        code: 200,
        message: '企业培训平台 API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            courses: '/api/courses',
            upload: '/api/upload'
        }
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({ code: 404, message: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
});

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`🚀 企业培训平台 API 服务`);
    console.log(`📡 运行地址: http://localhost:${PORT}`);
    console.log(`📚 API 文档: http://localhost:${PORT}/`);
    console.log(`========================================`);
});

module.exports = app;
