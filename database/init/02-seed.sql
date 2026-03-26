-- ============================================
-- 企业培训平台 - 测试数据
-- ============================================

-- 插入测试用户 (密码: 123456)
-- 使用 bcrypt hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (username, email, password, real_name, department, role) VALUES
    ('admin', 'admin@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '系统管理员', '技术部', 'admin'),
    ('teacher1', 'teacher1@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '张老师', '培训部', 'teacher'),
    ('student1', 'student1@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '李明', '销售部', 'student'),
    ('student2', 'student2@company.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '王芳', '市场部', 'student')
ON CONFLICT DO NOTHING;

-- 插入分类
INSERT INTO categories (name, description, sort_order) VALUES
    ('新员工入职', '新员工入职培训课程', 1),
    ('产品知识', '公司产品相关知识培训', 2),
    ('销售技巧', '销售技能提升课程', 3),
    ('管理能力', '管理层培训课程', 4),
    ('技术技能', '技术岗位专业培训', 5);

-- 插入课程
INSERT INTO courses (title, description, category_id, status, created_by) VALUES
    ('JavaScript 基础入门', '从零开始学习 JavaScript 编程语言', 5, 'published', 2),
    ('Python 数据分析', '使用 Python 进行数据分析和可视化', 5, 'published', 2),
    ('React 前端开发', '现代 React 开发实战教程', 5, 'published', 2),
    ('销售沟通技巧', '提升销售沟通能力的实用技巧', 3, 'published', 2),
    ('团队管理基础', '新晋管理者的必备技能', 4, 'published', 2);

-- 插入测试题目
INSERT INTO questions (course_id, type, content, options, answer, points) VALUES
    (1, 'single', 'JavaScript 中声明变量的关键字不包括以下哪个？', '["var", "let", "const", "variable"]', 'variable', 2),
    (1, 'judge', 'JavaScript 是强类型语言。', '[]', 'false', 1),
    (1, 'single', '以下哪个不是 JavaScript 的基本数据类型？', '["String", "Number", "Boolean", "Object"]', 'Object', 2),
    (2, 'single', 'Python 中用于数据分析的核心库是？', '["NumPy", "Pandas", "Matplotlib", "Scikit-learn"]', 'Pandas', 2),
    (3, 'single', 'React 中用于状态管理的 Hook 是？', '["useEffect", "useState", "useContext", "useReducer"]', 'useState', 2);
