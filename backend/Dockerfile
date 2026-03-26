FROM node:18-alpine

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci --only=production

# 复制代码
COPY src/ ./src/
COPY scripts/ ./scripts/

# 创建上传目录
RUN mkdir -p /app/uploads/courses /app/uploads/images

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "src/server.js"]
