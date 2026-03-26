# 企业培训平台架构文档

## 项目概述

企业培训平台是一个面向企业客户的私有化部署培训系统，支持课程学习、考试、内容管理等功能。

## 技术栈

- **后端**: Node.js + Express + PostgreSQL
- **前端**: Vue3 + Vite + Pinia + Vue Router
- **部署**: Docker Compose

## 项目结构

```
enterprise-training-platform/
├── docker-compose.yml          # Docker 编排配置
├── .env.example                # 环境变量模板
├── backend/                    # 后端服务
│   ├── src/
│   │   ├── server.js          # 入口
│   │   ├── config/            # 配置
│   │   ├── middleware/        # 中间件
│   │   └── routes/            # API 路由
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # 前端应用
│   ├── src/
│   │   ├── views/             # 页面
│   │   ├── components/        # 组件
│   │   ├── api/               # API 封装
│   │   ├── stores/            # Pinia Store
│   │   └── router/            # 路由配置
│   ├── Dockerfile
│   └── package.json
├── database/
│   └── init/                  # 初始化 SQL
├── nginx/                     # Nginx 配置
└── uploads/                   # 上传文件目录
```

## 数据库设计

### 核心表

- `users` - 用户表
- `categories` - 课程分类
- `courses` - 课程表
- `course_materials` - 课程资料
- `questions` - 题库
- `progress` - 学习进度
- `exams` - 考试记录

## API 设计

### 认证
- POST /api/auth/login - 登录

### 课程
- GET /api/courses - 课程列表
- GET /api/courses/:id - 课程详情
- POST /api/courses - 创建课程（管理员）

### 上传
- POST /api/upload/course-material - 上传课程资料
-