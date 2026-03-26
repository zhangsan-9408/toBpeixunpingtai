const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { authenticate, requireRole } = require('../middleware/auth');
const { query } = require('../config/database');

const router = express.Router();

// 配置文件上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = process.env.UPLOAD_DIR || './uploads';
        let subDir = 'others';
        
        // 根据文件类型选择目录
        if (file.mimetype.startsWith('video/')) {
            subDir = 'courses/videos';
        } else if (file.mimetype.startsWith('image/')) {
            subDir = 'images';
        } else if (file.mimetype === 'application/pdf') {
            subDir = 'courses/documents';
        }
        
        cb(null, path.join(uploadDir, subDir));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// 文件过滤
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'video/mp4', 'video/webm', 'video/ogg',
        'application/pdf',
        'image/jpeg', 'image/png', 'image/gif',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('不支持的文件类型'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: (process.env.MAX_FILE_SIZE || 500) * 1024 * 1024 // 默认500MB
    }
});

// POST /api/upload/course-material - 上传课程资料
router.post('/course-material', 
    authenticate, 
    requireRole('admin', 'teacher'),
    upload.single('file'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ code: 400, message: '没有上传文件' });
            }

            const { course_id, title, type } = req.body;
            
            if (!course_id || !title) {
                return res.status(400).json({ code: 400, message: '课程ID和标题不能为空' });
            }

            // 确定文件类型
            let materialType = type;
            if (!materialType) {
                if (req.file.mimetype.startsWith('video/')) materialType = 'video';
                else if (req.file.mimetype === 'application/pdf') materialType = 'pdf';
                else if (req.file.mimetype.includes('word')) materialType = 'doc';
                else if (req.file.mimetype.includes('powerpoint')) materialType = 'ppt';
                else if (req.file.mimetype.startsWith('image/')) materialType = 'image';
                else materialType = 'other';
            }

            // 保存到数据库
            const result = await query(
                `INSERT INTO course_materials (course_id, title, type, file_path, file_size)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [course_id, title, materialType, req.file.filename, req.file.size]
            );

            res.status(201).json({
                code: 201,
                message: '上传成功',
                data: result.rows[0]
            });
        } catch (error) {
            console.error('上传错误:', error);
            res.status(500).json({ code: 500, message: '上传失败' });
        }
    }
);

// POST /api/upload/image - 上传图片（课程封面等）
router.post('/image',
    authenticate,
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ code: 400, message: '没有上传图片' });
            }

            res.json({
                code: 200,
                message: '上传成功',
                data: {
                    filename: req.file.filename,
                    url: `/uploads/images/${req.file.filename}`
                }
            });
        } catch (error) {
            console.error('上传错误:', error);
            res.status(500).json({ code: 500, message: '上传失败' });
        }
    }
);

// 错误处理中间件
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ code: 400, message: '文件大小超过限制' });
        }
    }
    res.status(500).json({ code: 500, message: error.message || '上传失败' });
});

module.exports = router;
