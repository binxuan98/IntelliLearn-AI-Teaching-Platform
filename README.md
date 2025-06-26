# 启思·智教大模型平台 (IntelliLearn AI Teaching Platform)

一个基于AI技术的现代化教学平台，集成了关键词可视化、AI模拟答辩、课堂热度分析、思政推荐引擎、教学数据汇总和AI智能对话等功能模块，旨在提升教学质量和学习效果。

## 🌟 平台特色

- **🎯 教学理念融合**: 结合墨子"四疑教学法"和BOPPPS教学模式
- **🤖 AI驱动**: 集成DeepSeek大模型，提供智能化教学支持
- **📊 数据可视化**: 多维度数据分析和可视化展示
- **❤️ 思政融合**: 智能推荐思政元素，实现价值引领
- **🎨 现代化UI**: 简洁美观的用户界面，支持深色模式
- **📱 响应式设计**: 适配各种设备屏幕

## 🏗️ 技术架构

### 前端技术栈
- **框架**: Next.js 14 + React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **动画**: Framer Motion
- **图表**: Recharts
- **其他**: React Markdown, React Syntax Highlighter

### 后端技术栈
- **运行时**: Node.js
- **框架**: Express.js
- **AI服务**: DeepSeek API
- **文本处理**: Natural, Jieba
- **安全**: Helmet, CORS
- **日志**: Morgan

## 📋 功能模块

### 1. 关键词可视化 (Keywords Visualization)
- 📝 支持文本输入和TXT文件上传
- 📊 生成词频柱状图、词云图和知识图谱
- 🔗 关键词点击跳转到相关模块
- 📈 提供分析总结和教学建议

### 2. AI模拟答辩 (AI Debate Simulation)
- 👥 多角色评委系统（专家、学生、教师）
- 📊 四维评分体系（表达、内容、互动、创新）
- 🎯 智能生成改进建议和学习推荐
- ⏱️ 实时答辩计时和历史记录

### 3. 课堂热度分析 (Classroom Analysis)
- 📈 实时课堂数据监控
- 🔥 热度时间序列图表
- 🗺️ 关键词热力图
- 📊 参与度和提问质量分析

### 4. 思政推荐引擎 (Ideology Recommendation)
- 💭 智能分析课程内容
- 📚 推荐经典语录、政策方针、先进人物、典型案例
- 🎯 提供融入建议和PPT素材
- ⭐ 相关度评分和使用指导

### 5. 教学数据汇总 (Teaching Data Summary)
- 📊 综合教学数据分析
- 📝 自动生成教学总结
- 💡 提供改进建议和行动计划
- 📄 支持Markdown和PDF导出

### 6. AI智能对话 (AI Chat Interface)
- 💬 流式对话体验
- 🎨 Markdown渲染和代码高亮
- 🔗 智能推荐相关模块和学习资源
- 📱 固定高度聊天窗口，优化用户体验

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd "IntelliLearn AI Teaching Platform"
```

2. **安装依赖**
```bash
# 安装所有依赖（前端+后端）
npm run install:all

# 或者分别安装
cd frontend && npm install
cd ../backend && npm install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑 backend/.env 文件，填入您的 DeepSeek API Key
DEEPSEEK_API_KEY=sk-your-actual-api-key-here
```

4. **启动服务**
```bash
# 一键启动前后端（推荐）
npm run dev

# 或者分别启动
npm run dev:frontend  # 前端: http://localhost:3001
npm run dev:backend   # 后端: http://localhost:3002
```

### 访问地址
- 🌐 **前端应用**: http://localhost:3001
- 🔧 **后端API**: http://localhost:3002
- 📚 **API文档**: http://localhost:3002/docs

## 📁 项目结构

```
IntelliLearn AI Teaching Platform/
├── frontend/                 # 前端应用
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # 全局样式
│   │   ├── layout.tsx       # 根布局
│   │   ├── page.tsx         # 首页
│   │   ├── keywords/        # 关键词可视化
│   │   ├── debate/          # AI模拟答辩
│   │   ├── analysis/        # 课堂热度分析
│   │   ├── ideology/        # 思政推荐引擎
│   │   ├── summary/         # 教学数据汇总
│   │   └── chat/            # AI智能对话
│   ├── components/          # 共享组件
│   │   ├── Navigation.tsx   # 导航组件
│   │   └── ThemeProvider.tsx # 主题提供者
│   ├── package.json         # 前端依赖
│   ├── next.config.js       # Next.js配置
│   ├── tailwind.config.js   # Tailwind配置
│   └── tsconfig.json        # TypeScript配置
├── backend/                 # 后端服务
│   ├── server.js            # 主服务器文件
│   ├── package.json         # 后端依赖
│   ├── .env.example         # 环境变量模板
│   └── .env                 # 环境变量（需要创建）
├── package.json             # 根项目配置
└── README.md               # 项目文档
```

## 🔧 API接口

### 基础接口
- `GET /api/health` - 健康检查
- `GET /docs` - API文档

### 功能接口
- `POST /api/chat/stream` - 流式AI对话
- `POST /api/keywords` - 关键词提取和分析
- `POST /api/debate` - AI模拟答辩评分
- `POST /api/thinking` - 思政元素推荐

### 请求示例

```javascript
// AI对话
fetch('/api/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: '什么是数据结构？' })
})

// 关键词提取
fetch('/api/keywords', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: '要分析的文本内容' })
})
```

## 🎓 教学理念

### 墨子"四疑教学法"
- **逢疑**: 遇到问题时主动思考
- **循疑**: 循序渐进地解决疑问
- **遇疑**: 在学习中发现新问题
- **过疑**: 通过思考超越疑问

### BOPPPS教学模式
- **Bridge-in**: 导入环节
- **Objective**: 学习目标
- **Pre-assessment**: 前测
- **Participatory**: 参与式学习
- **Post-assessment**: 后测
- **Summary**: 总结

## 🛠️ 开发指南

### 添加新功能模块

1. **前端页面**: 在 `frontend/app/` 下创建新目录
2. **导航配置**: 更新 `Navigation.tsx` 中的导航链接
3. **后端接口**: 在 `backend/server.js` 中添加新的API路由
4. **类型定义**: 在相应组件中定义TypeScript接口

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint和Prettier配置
- 组件采用函数式编程
- 使用Tailwind CSS进行样式开发

## 🔒 安全特性

- **Helmet**: HTTP安全头设置
- **CORS**: 跨域请求控制
- **输入验证**: 严格的参数校验
- **文件上传限制**: 大小和类型限制
- **错误处理**: 统一的错误处理机制

## 📊 性能优化

- **代码分割**: Next.js自动代码分割
- **图片优化**: Next.js Image组件
- **缓存策略**: 合理的缓存配置
- **懒加载**: 组件和路由懒加载
- **压缩**: 生产环境资源压缩

## 🚀 部署指南

### 开发环境
```bash
npm run dev
```

### 生产环境
```bash
# 构建前端
cd frontend && npm run build

# 启动后端
cd backend && npm start

# 启动前端
cd frontend && npm start
```

### Docker部署（可选）
```dockerfile
# 可以根据需要创建Dockerfile
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### v1.0.0 (2024-01-XX)
- ✨ 初始版本发布
- 🎯 完成所有核心功能模块
- 🎨 实现现代化UI设计
- 🤖 集成DeepSeek AI服务
- 📚 完善项目文档

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👥 开发团队

- **项目负责人**: [您的姓名]
- **技术架构**: [技术负责人]
- **UI设计**: [设计师]

## 📞 联系我们

- 📧 邮箱: [your-email@example.com]
- 🌐 官网: [https://your-website.com]
- 📱 微信: [your-wechat]

## 🙏 致谢

感谢以下开源项目和技术社区的支持：
- Next.js 团队
- React 社区
- Tailwind CSS
- DeepSeek AI
- 所有贡献者

---

**启思·智教大模型平台** - 让AI赋能教育，让教学更加智慧！ 🚀✨