const express = require('express');
const { query } = require('../config/database');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/courses - 课程列表（公开）
router.get('/', async (req, res) => {
    const { page = 1, limit = 10, category_id, keyword } = req.query;
    const offset = (page - 1) * limit;

    try {
        let whereClause = 'WHERE c.status = $1';
        const params = ['published'];
        let paramIndex = 2;

        if (category_id) {
            whereClause += ` AND c.category_id = $${paramIndex}`;
            params.push(category_id);
            paramIndex++;
        }

        if (keyword) {
            whereClause += ` AND (c.title ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`;
            params.push(`%${keyword}%`);
            paramIndex++;
        }

        // 查询课程列表
        const listResult = await query(
            `SELECT c.*, cat.name as category_name,
                    (SELECT COUNT(*) FROM course_materials WHERE course_id = c.id) as material_count,
                    (SELECT COUNT(*) FROM questions WHERE course_id = c.id) as question_count
             FROM courses c
             LEFT JOIN categories cat ON c.category_id = cat.id
             ${whereClause}
             ORDER BY c.created_at DESC
             LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
            [...params, parseInt(limit), parseInt(offset)]
        );

        // 查询总数
        const countResult = await query(
            `SELECT COUNT(*) as total FROM courses c ${whereClause}`,
            params
        );

        res.json({
            code: 200,
            data: {
                list: listResult.rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: parseInt(countResult.rows[0].total),
                    pages: Math.ceil(countResult.rows[0].total / limit)
                }
            }
        });
    } catch (error) {
        console.error('获取课程列表错误:', error);
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
});

// GET /api/courses/:id - 课程详情
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const courseResult = await query(
            `SELECT c.*, cat.name as category_name,
                    u.real_name as creator_name
             FROM courses c
             LEFT JOIN categories cat ON c.category_id = cat.id
             LEFT JOIN users u ON c.created_by = u.id
             WHERE c.id = $1`,
            [id]
        );

        if (courseResult.rows.length === 0) {
            return res.status(404).json({ code: 404, message: '课程不存在' });
        }

        const course = courseResult.rows[0];

        // 获取课程资料
        const materialsResult = await query(
            `SELECT * FROM course_materials 
             WHERE course_id = $1 AND status = 'active'
             ORDER BY sort_order, created_at`,
            [id]
        );

        // 获取题目数量
        const questionsResult = await query(
            'SELECT COUNT(*) as count FROM questions WHERE course_id = $1',
            [id]
        );

        course.materials = materialsResult.rows;
        course.question_count = parseInt(questionsResult.rows[0].count);

        res.json({
            code: 200,
            data: course
        });
    } catch (error) {
        console.error('获取课程详情错误:', error);
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
});

// POST /api/courses - 创建课程（需要管理员/教师权限）
router.post('/', authenticate, requireRole('admin', 'teacher'), async (req, res) => {
    const { title, description, category_id } = req.body;

    if (!title) {
        return res.status(400).json({ code: 400, message: '课程标题不能为空' });
    }

    try {
        const result = await query(
            `INSERT INTO courses (title, description, category_id, created_by, status)
             VALUES ($1, $2, $3, $4, 'draft')
             RETURNING *`,
            [title, description, category_id, req.user.id]
        );

        res.status(201).json({
            code: 201,
            message: '课程创建成功',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('创建课程错误:', error);
        res.status(500).json({ code: 500, message: '服务器错误' });
    }
});

module.exports = router;
