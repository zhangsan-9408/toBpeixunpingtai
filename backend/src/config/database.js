const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'training_platform',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'changeme123',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// 测试连接
pool.on('connect', () => {
    console.log('✅ PostgreSQL 连接成功');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL 连接错误:', err);
});

// 查询辅助函数
const query = async (text, params) => {
    const start = Date.now();
    try {
        const result = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('执行查询:', { text: text.substring(0, 50), duration, rows: result.rowCount });
        return result;
    } catch (error) {
        console.error('查询错误:', error);
        throw error;
    }
};

module.exports = { pool, query };
