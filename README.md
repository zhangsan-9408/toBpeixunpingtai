# 企业培训平台

面向企业客户的私有化部署培训系统。

## 功能特性

- 📚 课程学习 - 支持视频、PDF、文档等多种格式
- 📝 在线考试 - 随机抽题、自动评分
- 📊 学习进度 - 实时跟踪员工学习情况
- 👨‍💼 管理后台 - 课程上传、用户管理
- 🐳 一键部署 - Docker Compose 快速启动

## 系统要求

- Docker 20.10+
- Docker Compose 2.0+
- 内存: 2GB+
- 磁盘: 10GB+

## 快速开始

### 1. 下载安装包

```bash
# 解压到任意目录
cd enterprise-training-platform
```

### 2. 配置环境变量

```bash
# 复制配置模板
cp .env.example .env

# 编辑 .env 文件，修改以下配置：
# - DB_PASSWORD: 数据库密码
# - JWT_SECRET: JWT 密钥（生产环境必须修改）
```

### 3. 一键启动

```bash
docker-compose up -d
```

### 4. 访问系统

- 前台: http://localhost
- 默认账号:
  - 管理员: admin / 123456
  - 学员: student1 / 123456

## 常用命令

```bash
# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 更新（拉取最新镜像后）
docker-compose pull && docker-compose up -d
```

## 目录说明

- `uploads/` - 上传的文件存储目录
- `database/` - 数据库初始化脚本
- `docs/` - 文档

## 技术支持

如有问题，请联系技术支持。
