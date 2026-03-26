# 企业培训平台项目经验总结

> 记录项目开发过程中遇到的问题及解决方案，作为后续参考

---

## 📋 项目概述

- **项目名称**: 企业培训平台 (Enterprise Training Platform)
- **技术栈**: Node.js + Express + PostgreSQL + Vue3 + Docker
- **开发时间**: 2026-03-26
- **部署环境**: Windows + Docker Desktop

---

## 🔧 问题与解决方案

### 问题 1: Docker 容器无法启动 - 服务依赖顺序

**现象**: 
```
docker-compose up -d 后容器没有运行
docker ps 显示为空
```

**原因**: 
- 后端服务配置了 `depends_on` 等待 PostgreSQL healthy
- 但 PostgreSQL 初始化 SQL 有语法错误，导致 healthcheck 失败
- 整个服务链无法启动

**解决方案**:
1. 单独启动 PostgreSQL 排查问题
2. 修复 SQL 语法错误后再启动其他服务
3. 或者直接使用 `docker run` 单独启动各个服务进行调试

```bash
# 单独启动 PostgreSQL
docker run -d --name etp-postgres \
  -e POSTGRES_DB=training_platform \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=changeme123 \
  -p 5432:5432 \
  -v ./database/init:/docker-entrypoint-initdb.d \
  postgres:15-alpine
```

---

### 问题 2: PostgreSQL SQL 语法错误 - COMMENT 关键字

**现象**:
```
ERROR: syntax error at or near "COMMENT" at character 251
LINE 7: duration INTEGER DEFAULT 0 COMMENT '课程时长(分钟)',
```

**原因**:
- MySQL 支持 `COMMENT` 字段注释语法
- PostgreSQL 不支持这种语法，需要使用 `COMMENT ON` 语句

**解决方案**:
移除字段级 COMMENT，改用 PostgreSQL 兼容的语法：

```sql
-- 错误 (MySQL 语法)
duration INTEGER DEFAULT 0 COMMENT '课程时长(分钟)',

-- 正确 (PostgreSQL 语法)
duration INTEGER DEFAULT 0,

-- 如需注释，使用 COMMENT ON (可选)
COMMENT ON COLUMN courses.duration IS '课程时长(分钟)';
```

**经验**: 
- 从 SQLite/MySQL 迁移到 PostgreSQL 时，需要检查 SQL 语法差异
- 常见差异：COMMENT、AUTO_INCREMENT vs SERIAL、DATETIME vs TIMESTAMP

---

### 问题 3: bcrypt 密码哈希验证失败

**现象**:
```
登录返回 401，提示"密码错误"
但数据库中密码哈希存在
```

**原因**:
- PostgreSQL 中存储的 bcrypt 哈希被错误转义
- 或者哈希生成时使用的 salt 不一致

**调试方法**:
```javascript
// 在登录逻辑中添加调试
const bcrypt = require('bcryptjs');

// 检查哈希是否匹配
console.log('输入密码:', password);
console.log('数据库存储:', user.password);
console.log('验证结果:', bcrypt.compareSync(password, user.password));

// 生成新的正确哈希
const newHash = bcrypt.hashSync('123456', 10);
console.log('新哈希:', newHash);
```

**临时解决方案**:
```javascript
// 临时支持明文密码（仅调试使用）
const isValidPassword = password === '123456' || 
  bcrypt.compareSync(password, user.password);
```

**最终解决方案**:
1. 重新生成正确的 bcrypt 哈希
2. 更新数据库中的密码字段
3. 移除临时调试代码

---

### 问题 4: Node.js 进程管理冲突

**现象**:
```
多次启动后端服务，导致多个 Node 进程冲突
端口被占用，服务无法正常启动
```

**原因**:
- 使用 `Start-Process` 后台启动后，进程失控
- 再次启动时，旧进程还在运行，端口冲突

**解决方案**:
1. 启动前杀死所有 Node 进程
2. 或者使用 PID 文件管理进程

```powershell
# 查找并停止 Node 进程
Get-Process node -ErrorAction SilentlyComplete | Stop-Process -Force

# 检查端口是否释放
Get-NetTCPConnection -LocalPort 3000
```

**更好的方案**:
创建启动脚本，统一管理：
```batch
@echo off
set DB_HOST=localhost
set DB_PORT=5432
...
node src/server.js
```

---

### 问题 5: 前端服务自动停止

**现象**:
```
前端服务运行一段时间后自动停止
浏览器无法访问 localhost:5173
```

**原因**:
- Vite 开发服务器在某些情况下会崩溃
- 或者进程被系统回收

**解决方案**:
1. 使用批处理脚本启动，保持窗口运行
2. 或者使用 PM2 等进程管理工具

```batch
@echo off
cd frontend
npm run dev
```

---

### 问题 6: PowerShell 执行策略限制

**现象**:
```
无法执行脚本，提示执行策略限制
```

**解决方案**:
```powershell
# 临时绕过执行策略
powershell -ExecutionPolicy Bypass -File script.ps1

# 或者在当前会话中设置
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

### 问题 7: 浏览器自动化测试连接失败

**现象**:
```
浏览器无法访问 localhost:5173
显示"无法访问此网站"
```

**原因**:
- 前端服务已停止
- 或者浏览器缓存问题

**解决方案**:
1. 检查服务端口是否监听
2. 重新启动前端服务
3. 浏览器强制刷新

```powershell
# 检查端口
Get-NetTCPConnection -LocalPort 5173

# 重启前端服务
cd frontend
npm run dev
```

---

## 📚 技术要点总结

### PostgreSQL 与 MySQL/SQLite 差异

| 特性 | MySQL/SQLite | PostgreSQL |
|------|--------------|------------|
| 自增ID | `AUTO_INCREMENT` / `INTEGER PRIMARY KEY` | `SERIAL` |
| 字段注释 | `COMMENT 'xxx'` | 不支持，用 `COMMENT ON` |
| 时间戳 | `DATETIME` / `CURRENT_TIMESTAMP` | `TIMESTAMP` / `CURRENT_TIMESTAMP` |
| 布尔值 | `BOOLEAN` / `INTEGER` | `BOOLEAN` |
| 字符串 | `VARCHAR` / `TEXT` | `VARCHAR` / `TEXT` |

### Docker 部署要点

1. **数据持久化**: 使用 `-v` 挂载卷，避免容器删除数据丢失
2. **环境变量**: 使用 `-e` 传递配置，敏感信息不要硬编码
3. **端口映射**: `-p 主机端口:容器端口`
4. **健康检查**: 配置 `healthcheck` 确保服务就绪

### Node.js 项目部署

1. **依赖安装**: `npm install` 需要在项目目录执行
2. **环境变量**: 使用 `dotenv` 或系统环境变量
3. **进程管理**: 使用 PM2 或 systemd 管理生产环境进程
4. **日志输出**: 配置日志文件，便于排查问题

---

## 🎯 最佳实践

### 1. 开发环境配置

```bash
# 使用 .env 文件管理配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=training_platform
DB_USER=postgres
DB_PASSWORD=changeme123
JWT_SECRET=your-secret-key
```

### 2. 数据库迁移

```bash
# 使用迁移工具管理数据库变更
npx knex migrate:latest
# 或
npx prisma migrate dev
```

### 3. 错误处理

```javascript
// 统一的错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    code: 500, 
    message: process.env.NODE_ENV === 'production' 
      ? '服务器错误' 
      : err.message 
  });
});
```

### 4. 日志记录

```javascript
// 使用 winston 或 pino 记录日志
const logger = require('./config/logger');
logger.info('服务器启动');
logger.error('数据库连接失败', error);
```

---

## 📁 项目文件结构

```
enterprise-training-platform/
├── backend/              # Node.js 后端
│   ├── src/
│   │   ├── server.js    # 入口文件
│   │   ├── routes/      # API 路由
│   │   ├── middleware/  # 中间件
│   │   └── config/      # 配置文件
│   ├── package.json
│   └── Dockerfile
├── frontend/             # Vue3 前端
│   ├── src/
│   │   ├── views/       # 页面组件
│   │   ├── api/         # API 封装
│   │   └── router/      # 路由配置
│   ├── package.json
│   └── Dockerfile
├── database/
│   └── init/            # 数据库初始化脚本
├── docker-compose.yml   # Docker 编排配置
└── docs/                # 文档
```

---

## 🔗 参考链接

- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [Express.js 官方文档](https://expressjs.com/)
- [Vue3 官方文档](https://vuejs.org/)
- [Docker 官方文档](https://docs.docker.com/)

---

## 📝 后续改进建议

1. **密码安全**: 修复 bcrypt 哈希验证，移除明文密码调试代码
2. **文件上传**: 实现课程封面和资料上传功能
3. **日志系统**: 添加完整的日志记录和错误追踪
4. **测试覆盖**: 添加单元测试和集成测试
5. **CI/CD**: 配置 GitHub Actions 自动部署
6. **文档完善**: 添加 API 文档和使用手册

---

*文档创建时间: 2026-03-26*
*作者: 大虾*
