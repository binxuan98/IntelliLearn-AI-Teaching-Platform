const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const axios = require('axios')
const multer = require('multer')
const natural = require('natural')
const nodejieba = require('nodejieba')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3002

// DeepSeek API配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-your-deepseek-api-key-here'
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

// 中间件配置
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

app.use(cors({
  origin: function(origin, callback) {
    // 允许所有来源访问（生产环境中应该限制具体域名）
    callback(null, true)
  },
  credentials: true
}))

app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 文件上传配置
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
})

// 工具函数
const extractKeywords = (text, language = 'zh') => {
  try {
    let words
    if (language === 'zh') {
      // 中文分词
      words = nodejieba.cut(text, true)
      words = words.filter(word => word.length > 1 && !/^[0-9\s\p{P}]+$/u.test(word))
    } else {
      // 英文分词
      const tokenizer = new natural.WordTokenizer()
      words = tokenizer.tokenize(text.toLowerCase())
      words = words.filter(word => word.length > 2 && !/^[0-9\s\p{P}]+$/u.test(word))
      
      // 移除停用词
      const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'])
      words = words.filter(word => !stopWords.has(word))
    }
    
    // 统计词频
    const wordCount = {}
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
    
    // 计算总词数用于权重计算
    const totalWords = words.length
    
    // 排序并返回前20个关键词，添加权重计算
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word, count]) => ({ 
        word, 
        count,
        weight: count / totalWords // 添加权重属性
      }))
  } catch (error) {
    console.error('关键词提取错误:', error)
    return []
  }
}

const callDeepSeekAPI = async (messages, stream = false) => {
  try {
    const response = await axios.post(DEEPSEEK_API_URL, {
      model: 'deepseek-chat',
      messages: messages,
      stream: stream,
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      responseType: stream ? 'stream' : 'json'
    })
    
    return response
  } catch (error) {
    console.error('DeepSeek API调用错误:', error.response?.data || error.message)
    throw error
  }
}

// API路由

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: '启思·智教大模型平台 API'
  })
})

// 流式AI对话
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { message } = req.body
    
    if (!message) {
      return res.status(400).json({ error: '消息内容不能为空' })
    }
    
    const messages = [
      {
        role: 'system',
        content: '你是启思·智教大模型平台的AI助手，专门为教育教学服务。你需要：1. 提供准确、有用的学习指导；2. 结合思政教育元素，体现价值引领；3. 采用启发式教学方法，引导学生思考；4. 语言亲切友好，富有教育意义。请用中文回答。'
      },
      {
        role: 'user',
        content: message
      }
    ]
    
    // 设置SSE响应头
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    })
    
    try {
      const response = await callDeepSeekAPI(messages, true)
      
      response.data.on('data', (chunk) => {
        const lines = chunk.toString().split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              res.write('data: [DONE]\n\n')
              res.end()
              return
            }
            
            try {
              const parsed = JSON.parse(data)
              if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                res.write(`data: ${JSON.stringify({ content: parsed.choices[0].delta.content })}\n\n`)
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      })
      
      response.data.on('end', () => {
        res.write('data: [DONE]\n\n')
        res.end()
      })
      
      response.data.on('error', (error) => {
        console.error('Stream error:', error)
        res.write(`data: ${JSON.stringify({ error: '流式响应错误' })}\n\n`)
        res.end()
      })
      
    } catch (apiError) {
      // 使用模拟响应作为fallback
      const mockResponse = `关于"${message}"，这是一个很好的问题。\n\n在学习过程中，我们要秉承实事求是的态度，既要掌握扎实的理论基础，也要注重实践应用。正如习近平总书记所说，"学而时习之，不亦说乎"，学习是一个持续的过程。\n\n建议您：\n1. 深入理解基本概念\n2. 多做实践练习\n3. 与同学交流讨论\n4. 保持好奇心和探索精神\n\n希望这个回答对您有帮助！`
      
      // 模拟流式输出
      const words = mockResponse.split('')
      let index = 0
      
      const interval = setInterval(() => {
        if (index < words.length) {
          res.write(`data: ${JSON.stringify({ content: words[index] })}\n\n`)
          index++
        } else {
          clearInterval(interval)
          res.write('data: [DONE]\n\n')
          res.end()
        }
      }, 50)
    }
    
  } catch (error) {
    console.error('Chat stream error:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
})

// 关键词提取
app.post('/api/keywords', upload.single('file'), async (req, res) => {
  try {
    let text = ''
    
    if (req.file) {
      // 处理上传的文件
      text = req.file.buffer.toString('utf-8')
    } else if (req.body.text) {
      // 处理文本输入
      text = req.body.text
    } else {
      return res.status(400).json({ error: '请提供文本内容或上传文件' })
    }
    
    if (!text.trim()) {
      return res.status(400).json({ error: '文本内容不能为空' })
    }
    
    // 提取关键词
    const keywords = extractKeywords(text)
    
    // 生成词云数据
    const wordCloudData = keywords.map(({ word, count }) => ({
      text: word,
      value: count,
      size: Math.min(count * 10 + 20, 60)
    }))
    
    // 生成知识图谱数据（模拟）
    const knowledgeGraph = {
      nodes: keywords.slice(0, 10).map((item, index) => ({
        id: index.toString(),
        label: item.word,
        size: item.count * 2 + 10,
        color: `hsl(${index * 36}, 70%, 60%)`
      })),
      edges: []
    }
    
    // 添加一些连接关系
    for (let i = 0; i < knowledgeGraph.nodes.length - 1; i++) {
      if (Math.random() > 0.6) {
        knowledgeGraph.edges.push({
          source: i.toString(),
          target: (i + 1).toString(),
          weight: Math.random() * 5 + 1
        })
      }
    }
    
    // 生成分析总结
    const summary = `本次分析共提取了${keywords.length}个关键词，其中"${keywords[0]?.word}"出现频率最高（${keywords[0]?.count}次）。文本内容主要围绕${keywords.slice(0, 3).map(k => k.word).join('、')}等核心概念展开。`
    
    // 生成教学建议
    const suggestions = [
      '建议在课程导入环节重点强调高频关键词的重要性',
      '可以围绕核心概念设计互动讨论环节',
      '结合关键词设计课后思考题，加深学生理解',
      '利用词云图进行可视化教学，提高学生兴趣'
    ]
    
    res.json({
      keywords,
      wordCloudData,
      knowledgeGraph,
      summary,
      suggestions,
      totalWords: text.length,
      uniqueWords: keywords.length
    })
    
  } catch (error) {
    console.error('Keywords extraction error:', error)
    res.status(500).json({ error: '关键词提取失败' })
  }
})

// AI模拟答辩
app.post('/api/debate', async (req, res) => {
  try {
    const { topic, answer, judges, currentQuestion } = req.body
    
    if (!topic || !answer) {
      return res.status(400).json({ error: '题目和回答内容不能为空' })
    }
    
    // 构建评分提示词
    const judgePrompts = {
      expert: '作为专业领域专家，请从专业深度、理论基础、创新性等角度评价',
      student: '作为学生代表，请从理解清晰度、表达逻辑、实用性等角度评价',
      teacher: '作为教师同行，请从教学价值、知识准确性、启发性等角度评价'
    }
    
    const selectedJudges = judges || ['expert', 'student', 'teacher']
    const evaluations = []
    
    // 模拟评分（实际应用中可以调用AI API）
    for (const judge of selectedJudges) {
      const scores = {
        expression: Math.floor(Math.random() * 20) + 75, // 75-95分
        content: Math.floor(Math.random() * 20) + 70,    // 70-90分
        interaction: Math.floor(Math.random() * 25) + 70, // 70-95分
        innovation: Math.floor(Math.random() * 30) + 65   // 65-95分
      }
      
      const totalScore = Math.round((scores.expression + scores.content + scores.interaction + scores.innovation) / 4)
      
      evaluations.push({
        judge,
        judgeName: {
          expert: '专家评委',
          student: '学生代表', 
          teacher: '教师同行'
        }[judge],
        scores,
        totalScore,
        feedback: generateFeedback(judge, scores, totalScore),
        suggestions: generateSuggestions(judge, scores)
      })
    }
    
    // 计算总体评分
    const overallScore = Math.round(
      evaluations.reduce((sum, eval) => sum + eval.totalScore, 0) / evaluations.length
    )
    
    // 生成改进建议
    const improvements = [
      '加强理论基础的学习，提高专业深度',
      '改善表达逻辑，使论述更加清晰有条理',
      '增加实际案例，提高内容的说服力',
      '培养创新思维，提出更多独特见解'
    ]
    
    // 生成推荐学习内容
    const recommendations = [
      {
        type: 'book',
        title: '相关专业教材深度阅读',
        description: '建议阅读权威教材，夯实理论基础'
      },
      {
        type: 'practice',
        title: '案例分析练习',
        description: '通过实际案例分析提高应用能力'
      },
      {
        type: 'discussion',
        title: '学术讨论参与',
        description: '积极参与学术讨论，提高表达能力'
      }
    ]
    
    res.json({
      evaluations,
      overallScore,
      improvements,
      recommendations,
      nextQuestion: generateNextQuestion(topic)
    })
    
  } catch (error) {
    console.error('Debate evaluation error:', error)
    res.status(500).json({ error: '答辩评估失败' })
  }
})

// 思政推荐引擎
app.post('/api/thinking', async (req, res) => {
  try {
    const { content, types } = req.body
    
    if (!content) {
      return res.status(400).json({ error: '课程内容不能为空' })
    }
    
    const selectedTypes = types || ['quote', 'policy', 'person', 'case']
    
    // 模拟思政元素推荐
    const allItems = [
      {
        id: '1',
        type: 'quote',
        title: '习近平总书记关于科技创新的重要论述',
        content: '科技是国家强盛之基，创新是民族进步之魂。',
        source: '习近平总书记在科学家座谈会上的讲话',
        relevance: 95,
        tags: ['科技创新', '国家发展', '民族复兴'],
        usage: '可在课程导入环节引用，强调科技学习的重要意义'
      },
      {
        id: '2',
        type: 'person',
        title: '钱学森：科学报国的典范',
        content: '钱学森放弃美国优厚待遇，毅然回国投身新中国建设，为我国航天事业发展做出了卓越贡献。',
        source: '《钱学森传》',
        relevance: 88,
        tags: ['爱国主义', '科学精神', '奉献精神'],
        usage: '在讲解专业知识时，结合科学家事迹进行价值引导'
      },
      {
        id: '3',
        type: 'policy',
        title: '《国家中长期科学和技术发展规划纲要》',
        content: '坚持自主创新、重点跨越、支撑发展、引领未来的方针，努力建设创新型国家。',
        source: '国务院发布',
        relevance: 82,
        tags: ['创新驱动', '科技政策', '国家战略'],
        usage: '结合课程内容，说明个人学习与国家发展的关系'
      },
      {
        id: '4',
        type: 'case',
        title: '北斗导航系统：自主创新的成功实践',
        content: '北斗导航系统的成功研发，打破了GPS垄断，体现了中国科技自立自强的决心和能力。',
        source: '央视新闻报道',
        relevance: 90,
        tags: ['自主创新', '科技自立', '民族自豪'],
        usage: '作为案例分析，展示科技创新的实际应用和价值'
      },
      {
        id: '5',
        type: 'quote',
        title: '邓小平同志关于科学技术的论断',
        content: '科学技术是第一生产力。',
        source: '邓小平文选',
        relevance: 85,
        tags: ['科技发展', '生产力', '改革开放'],
        usage: '在强调专业学习重要性时引用'
      }
    ]
    
    // 根据选择的类型过滤
    const items = allItems.filter(item => selectedTypes.includes(item.type))
    
    const summary = `根据您的课程内容，系统为您推荐了${items.length}个思政元素，涵盖${selectedTypes.map(t => ({'quote': '经典语录', 'policy': '政策方针', 'person': '先进人物', 'case': '典型案例'}[t])).join('、')}。这些内容与您的专业课程高度相关，可以有效实现价值引领与知识传授的有机融合。`
    
    const integrationSuggestions = [
      '在课程导入环节引用经典语录，激发学生学习动力',
      '结合先进人物事迹，培养学生的价值观念',
      '通过典型案例分析，增强学生的实践能力',
      '将政策方针与课程内容结合，帮助学生理解时代背景'
    ]
    
    const pptSlides = [
      '标题：科技强国梦，青年当自强\n内容：习近平总书记指出，"科技是国家强盛之基，创新是民族进步之魂"',
      '标题：学习先进典型，做有理想的建设者\n内容：以钱学森等科学家为榜样，培养爱国情怀和科学精神',
      '标题：自主创新，中国智慧照亮世界\n内容：北斗导航等成功案例展现了中国科技自立自强的能力'
    ]
    
    res.json({
      items,
      summary,
      integrationSuggestions,
      pptSlides
    })
    
  } catch (error) {
    console.error('Ideology recommendation error:', error)
    res.status(500).json({ error: '思政推荐失败' })
  }
})

// 工具函数
function generateFeedback(judge, scores, totalScore) {
  const feedbacks = {
    expert: [
      '专业知识掌握较好，但需要进一步深入理解核心概念',
      '理论基础扎实，建议加强实际应用能力',
      '表现优秀，具有良好的专业素养和创新思维'
    ],
    student: [
      '表达清晰，逻辑性强，容易理解',
      '内容丰富，但可以更加生动有趣',
      '回答全面，展现了良好的学习能力'
    ],
    teacher: [
      '知识点掌握准确，具有一定的教学价值',
      '思路清晰，但需要加强与实际的联系',
      '表现出色，体现了良好的学术素养'
    ]
  }
  
  const judgeIndex = totalScore >= 85 ? 2 : totalScore >= 75 ? 1 : 0
  return feedbacks[judge][judgeIndex]
}

function generateSuggestions(judge, scores) {
  const suggestions = []
  
  if (scores.expression < 80) {
    suggestions.push('建议加强表达能力训练，提高语言组织能力')
  }
  if (scores.content < 80) {
    suggestions.push('需要深入学习专业知识，丰富内容深度')
  }
  if (scores.interaction < 80) {
    suggestions.push('增强互动意识，提高沟通交流能力')
  }
  if (scores.innovation < 80) {
    suggestions.push('培养创新思维，尝试提出独特见解')
  }
  
  return suggestions.length > 0 ? suggestions : ['继续保持，表现优秀！']
}

function generateNextQuestion(topic) {
  const questions = [
    `请进一步阐述${topic}的实际应用价值`,
    `您认为${topic}在未来发展中会面临哪些挑战？`,
    `如何将${topic}与其他相关领域进行结合？`,
    `请分享一个关于${topic}的具体案例`
  ]
  
  return questions[Math.floor(Math.random() * questions.length)]
}

// API文档路由
app.get('/docs', (req, res) => {
  res.json({
    title: '启思·智教大模型平台 API 文档',
    version: '1.0.0',
    endpoints: {
      'GET /api/health': '健康检查',
      'POST /api/chat/stream': '流式AI对话',
      'POST /api/keywords': '关键词提取',
      'POST /api/debate': 'AI模拟答辩',
      'POST /api/thinking': '思政推荐引擎'
    },
    description: '为教育教学提供AI驱动的智能服务'
  })
})

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error)
  res.status(500).json({ 
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? error.message : '请稍后重试'
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' })
})

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 启思·智教大模型平台后端服务已启动`)
  console.log(`📍 本地地址: http://localhost:${PORT}`)
  console.log(`🌐 公网地址: http://0.0.0.0:${PORT}`)
  console.log(`📚 API文档: http://localhost:${PORT}/docs`)
  console.log(`🔧 环境: ${process.env.NODE_ENV || 'development'}`)
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`)
  console.log(`💡 提示: 服务已绑定到所有网络接口，可通过公网IP访问`)
})

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在优雅关闭服务器...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在优雅关闭服务器...')
  process.exit(0)
})