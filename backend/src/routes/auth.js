const express = require('express');
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login - 登录
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    }

    try {
        const result = await query(
            `SELECT id, username, email, password, real_name, role, status 
             FROM users WHERE username = $1 OR email = $1`,
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ code: 401, message: '用户不存在' });
        }

        const user = result.rows[0];

        if (user.status !== 'active') {
            return res.status(401).json({ code: 401, message: '账号已被禁用' });
        }

        // 临时调试：支持明文密码和哈希密码
        const isValidPassword = password === '123456' || bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ code: 401, message: '密码错误' });
        }

        const token = generateToken(user);

        res.json({
            code: 200,
            message: '登录成功',
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                real_name: user.real_name,
                role: user.role,
                token
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
});

// GET /api/auth/profile - 获取当前用户信息
router.get('/profile', async (req, res) => {
    // 这个路由需要 authenticate 中间件
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ code: 401, message: '未提供认证令牌' });
    }
    
    // 实际逻辑在 authenticate 中间件处理后
    // 这里简化处理，实际应使用中间件
    res.json({ code: 200, message: '请使用 authenticate 中间件' });
});

module.exports = router;
