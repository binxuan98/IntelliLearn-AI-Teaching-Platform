'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  RotateCcw,
  Copy,
  CheckCircle,
  Sparkles,
  BookOpen,
  Brain,
  Video,
  ArrowRight,
  MessageSquare,
  BarChart3,
  Heart,
  FileText,
  Lightbulb
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  recommendations?: Recommendation[]
}

interface Recommendation {
  type: 'module' | 'knowledge' | 'video'
  title: string
  description: string
  icon: any
  action: string
  path?: string
}

const moduleRecommendations = [
  {
    type: 'module' as const,
    title: '关键词可视化',
    description: '分析文本内容，生成词云和知识图谱',
    icon: BarChart3,
    action: '立即使用',
    path: '/keywords'
  },
  {
    type: 'module' as const,
    title: 'AI模拟答辩',
    description: '模拟真实答辩场景，提升表达能力',
    icon: MessageSquare,
    action: '开始答辩',
    path: '/debate'
  },
  {
    type: 'module' as const,
    title: '思政推荐引擎',
    description: '智能推荐相关思政元素',
    icon: Heart,
    action: '获取推荐',
    path: '/ideology'
  },
  {
    type: 'module' as const,
    title: '教学数据汇总',
    description: '生成教学总结和改进建议',
    icon: FileText,
    action: '查看汇总',
    path: '/summary'
  }
]

const knowledgeRecommendations = [
  {
    type: 'knowledge' as const,
    title: '数据结构基础',
    description: '深入理解数组、链表、栈、队列等基础数据结构',
    icon: Brain,
    action: '深入学习'
  },
  {
    type: 'knowledge' as const,
    title: '算法设计思想',
    description: '掌握分治、动态规划、贪心等算法设计方法',
    icon: Lightbulb,
    action: '探索更多'
  },
  {
    type: 'knowledge' as const,
    title: '复杂度分析',
    description: '学习时间复杂度和空间复杂度的分析方法',
    icon: BarChart3,
    action: '学习分析'
  }
]

const videoRecommendations = [
  {
    type: 'video' as const,
    title: '二叉树遍历算法详解',
    description: '通过动画演示理解前序、中序、后序遍历',
    icon: Video,
    action: '观看视频'
  },
  {
    type: 'video' as const,
    title: '动态规划入门教程',
    description: '从斐波那契数列到背包问题的完整讲解',
    icon: Video,
    action: '开始学习'
  },
  {
    type: 'video' as const,
    title: '排序算法可视化',
    description: '直观展示各种排序算法的执行过程',
    icon: Video,
    action: '立即观看'
  }
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateRecommendations = (content: string): Recommendation[] => {
    const recommendations: Recommendation[] = []
    
    // 随机选择1-2个模块推荐
    const shuffledModules = [...moduleRecommendations].sort(() => Math.random() - 0.5)
    recommendations.push(...shuffledModules.slice(0, Math.floor(Math.random() * 2) + 1))
    
    // 随机选择1个知识推荐
    const shuffledKnowledge = [...knowledgeRecommendations].sort(() => Math.random() - 0.5)
    recommendations.push(shuffledKnowledge[0])
    
    // 随机选择1个视频推荐
    const shuffledVideos = [...videoRecommendations].sort(() => Math.random() - 0.5)
    recommendations.push(shuffledVideos[0])
    
    return recommendations
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      let assistantContent = ''
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              // 生成推荐内容
              const recommendations = generateRecommendations(assistantContent)
              setMessages(prev => prev.map(msg => 
                msg.id === assistantMessage.id 
                  ? { ...msg, recommendations }
                  : msg
              ))
              break
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                assistantContent += parsed.content
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, content: assistantContent }
                    : msg
                ))
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // 使用模拟响应作为fallback
      const mockResponse = generateMockResponse(input)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockResponse,
        timestamp: new Date(),
        recommendations: generateRecommendations(mockResponse)
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockResponse = (userInput: string): string => {
    const responses = [
      `关于"${userInput}"，这是一个很好的问题。\n\n在计算机科学中，这个概念非常重要。让我为您详细解释：\n\n## 核心概念\n\n1. **基础理论**：首先需要理解基本原理\n2. **实际应用**：在实际项目中的应用场景\n3. **最佳实践**：业界推荐的实现方法\n\n## 代码示例\n\n\`\`\`python\ndef example_function():\n    # 这是一个示例函数\n    return "Hello, World!"\n\`\`\`\n\n## 总结\n\n通过学习这个概念，您可以更好地理解相关技术栈。建议您继续深入学习相关知识点。`,
      
      `您提到的"${userInput}"确实是一个值得深入探讨的话题。\n\n## 问题分析\n\n从教学的角度来看，这个问题体现了学生的思考深度。正如墨子所说的"四疑教学法"中的"逢疑"阶段，遇到问题是学习的开始。\n\n## 解决方案\n\n1. **理论基础**：建立扎实的理论基础\n2. **实践验证**：通过实际操作验证理论\n3. **反思总结**：在实践中不断反思和改进\n\n## 相关思考\n\n这让我想起了邓小平同志说过的"实践是检验真理的唯一标准"。在学习过程中，我们也要注重理论与实践的结合。\n\n希望这个回答对您有帮助！`,
      
      `感谢您的提问！"${userInput}"是一个非常有价值的学习主题。\n\n## 学习路径建议\n\n### 第一阶段：基础掌握\n- 理解核心概念\n- 掌握基本语法\n- 完成简单练习\n\n### 第二阶段：深入理解\n- 学习高级特性\n- 分析复杂案例\n- 参与项目实践\n\n### 第三阶段：融会贯通\n- 独立解决问题\n- 优化性能表现\n- 分享学习心得\n\n## 实用技巧\n\n> 💡 **学习建议**：在学习过程中，要保持好奇心和探索精神，这正体现了我们追求真理、服务人民的价值追求。\n\n继续加油，相信您一定能够掌握这个知识点！`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const clearChat = () => {
    setMessages([])
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleRecommendationClick = (recommendation: Recommendation) => {
    if (recommendation.path) {
      router.push(recommendation.path)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => {
    const Icon = recommendation.icon
    const colors = {
      module: 'from-blue-500 to-indigo-500',
      knowledge: 'from-green-500 to-emerald-500',
      video: 'from-purple-500 to-violet-500'
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer"
        onClick={() => handleRecommendationClick(recommendation)}
      >
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${colors[recommendation.type]} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              {recommendation.title}
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {recommendation.description}
            </p>
            <div className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400">
              {recommendation.action}
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          AI智能对话
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          与AI助手对话，获取学习指导和个性化推荐
        </p>
      </motion.div>

      {/* Chat Container */}
      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ height: '70vh' }}>
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  开始对话
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  您可以询问任何学习相关的问题，AI助手将为您提供详细解答和个性化推荐
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => setInput('什么是数据结构？')}
                    className="p-3 text-left bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <div className="font-medium text-slate-800 dark:text-slate-200">什么是数据结构？</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">基础概念学习</div>
                  </button>
                  
                  <button
                    onClick={() => setInput('如何提高编程能力？')}
                    className="p-3 text-left bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <div className="font-medium text-slate-800 dark:text-slate-200">如何提高编程能力？</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">学习方法指导</div>
                  </button>
                  
                  <button
                    onClick={() => setInput('算法复杂度怎么分析？')}
                    className="p-3 text-left bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <div className="font-medium text-slate-800 dark:text-slate-200">算法复杂度怎么分析？</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">技术深入</div>
                  </button>
                  
                  <button
                    onClick={() => setInput('编程学习的思政意义？')}
                    className="p-3 text-left bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <div className="font-medium text-slate-800 dark:text-slate-200">编程学习的思政意义？</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">价值引领</div>
                  </button>
                </div>
              </motion.div>
            )}
            
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-1' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                  }`}>
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown
                          components={{
                            code: ({ node, className, children, ...props }) => {
                              const match = /language-(\w+)/.exec(className || '')
                              const isInline = props.inline
                              return !isInline && match ? (
                                <SyntaxHighlighter
                                  style={oneDark as any}
                                  language={match[1]}
                                  PreTag="div"
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className={className}>
                                  {children}
                                </code>
                              )
                            }
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                      >
                        {copiedId === message.id ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                  
                  {/* Recommendations */}
                  {message.recommendations && message.recommendations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 space-y-3"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        为您推荐
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {message.recommendations.map((rec, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                          >
                            <RecommendationCard recommendation={rec} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-600 dark:text-slate-400">AI正在思考...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的问题..."
                className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            
            <div className="flex gap-2">
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="p-3 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  title="清空对话"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Tips */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <h3 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
          💡 教学建议
        </h3>
        <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
          <p>• <strong>BOPPPS-Participatory:</strong> 利用AI对话增强课堂互动参与</p>
          <p>• <strong>墨子四疑法:</strong> 通过AI问答引导学生深入思考</p>
          <p>• <strong>个性化学习:</strong> 根据AI推荐进行针对性学习</p>
        </div>
      </div>
    </div>
  )
}