# 启思·智教大模型平台 - 公网部署指南

## 概述

本指南将帮助您将启思·智教大模型平台部署到公网环境，使其可以通过公网IP或域名访问。

## 部署步骤

### 1. 服务器配置

确保您的服务器满足以下要求：
- Node.js 18+ 
- npm 或 yarn
- 足够的内存和存储空间
- 开放的网络端口（3001用于前端，3002用于后端）

### 2. 防火墙配置

确保以下端口在防火墙中开放：
```bash
# 前端端口
sudo ufw allow 3001

# 后端端口  
sudo ufw allow 3002

# 或者如果使用其他防火墙工具，请相应配置
```

### 3. 环境变量配置

#### 前端配置
1. 复制环境变量示例文件：
```bash
cd frontend
cp .env.example .env.local
```

2. 编辑 `.env.local` 文件，设置后端API地址：
```bash
# 将 your-public-ip 替换为您的实际公网IP
BACKEND_URL=http://your-public-ip:3002/api

# 或者使用域名
# BACKEND_URL=https://your-domain.com/api
```

#### 后端配置
后端服务已配置为绑定到所有网络接口 (`0.0.0.0`)，无需额外配置。

### 4. 启动服务

#### 启动后端服务
```bash
cd backend
npm install
npm start
```

#### 启动前端服务
```bash
cd frontend
npm install
npm run build
npm start
```

### 5. 访问应用

- 前端访问地址：`http://your-public-ip:3001`
- 后端API地址：`http://your-public-ip:3002`
- 关键词分析页面：`http://your-public-ip:3001/keywords`

## 生产环境建议

### 1. 使用进程管理器

推荐使用 PM2 来管理 Node.js 进程：

```bash
# 安装 PM2
npm install -g pm2

# 启动后端
cd backend
pm2 start server.js --name "intellilearn-backend"

# 启动前端
cd frontend
pm2 start npm --name "intellilearn-frontend" -- start

# 查看状态
pm2 status

# 设置开机自启
pm2 startup
pm2 save
```

### 2. 使用反向代理

推荐使用 Nginx 作为反向代理：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 前端
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 后端API
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. HTTPS 配置

使用 Let's Encrypt 获取免费SSL证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com
```

## 故障排除

### 1. 端口被占用
```bash
# 查看端口占用
lsof -i :3001
lsof -i :3002

# 杀死占用进程
kill -9 <PID>
```

### 2. 防火墙问题
```bash
# 检查防火墙状态
sudo ufw status

# 临时关闭防火墙测试
sudo ufw disable
```

### 3. 网络连接问题
```bash
# 测试端口连通性
telnet your-public-ip 3001
telnet your-public-ip 3002
```

## 安全建议

1. **API密钥安全**：确保 DeepSeek API 密钥安全存储，不要提交到版本控制系统
2. **访问控制**：考虑添加身份验证和授权机制
3. **HTTPS**：生产环境务必使用HTTPS
4. **定期更新**：保持依赖包和系统的最新状态
5. **监控日志**：设置日志监控和告警机制

## 支持

如果在部署过程中遇到问题，请检查：
1. 服务器日志
2. 浏览器开发者工具
3. 网络连接状态
4. 防火墙配置

---

**注意**：请将 `your-public-ip` 和 `your-domain.com` 替换为您的实际公网IP地址或域名。