const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// 验证 JWT Token
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ code: 401, message: '未提供认证令牌' });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 查询用户最新状态
        const result = await query(
            'SELECT id, username, email, real_name, role, status FROM users WHERE id = $1',
            [decoded.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ code: 401, message: '用户不存在' });
        }
        
        const user = result.rows[0];
        if (user.status !== 'active') {
            return res.status(401).json({ code: 401, message: '账号已被禁用' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ code: 401, message: '令牌已过期' });
        }
        return res.status(401).json({ code: 401, message: '令牌无效' });
    }
};

// 检查角色权限
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ code: 401, message: '未登录' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ code: 403, message: '权限不足' });
        }
        
        next();
    };
};

// 生成 JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

module.exports = { authenticate, requireRole, generateToken, JWT_SECRET };
