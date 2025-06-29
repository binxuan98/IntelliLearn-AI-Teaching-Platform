'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  Clock,
  TrendingUp,
  Download,
  FileText,
  Loader2,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Brain,
  Lightbulb,
  Star
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface ModuleUsage {
  module: string
  usage: number
  duration: number
  interactions: number
}

interface StudentInteraction {
  id: string
  student: string
  type: 'question' | 'answer' | 'discussion'
  content: string
  timestamp: string
  quality: number
}

interface TeachingSummary {
  sessionInfo: {
    date: string
    duration: number
    topic: string
    participants: number
  }
  moduleUsage: ModuleUsage[]
  interactions: StudentInteraction[]
  keyMetrics: {
    totalQuestions: number
    avgResponseTime: number
    participationRate: number
    satisfactionScore: number
  }
  insights: {
    strengths: string[]
    improvements: string[]
    recommendations: string[]
  }
  nextSteps: string[]
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export default function SummaryPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState<TeachingSummary | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('today')
  const [exportFormat, setExportFormat] = useState<'markdown' | 'pdf'>('markdown')

  const generateSummary = async () => {
    setIsGenerating(true)
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSummary(generateMockSummary())
    } catch (error) {
      console.error('Failed to generate summary:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockSummary = (): TeachingSummary => {
    return {
      sessionInfo: {
        date: new Date().toLocaleDateString('zh-CN'),
        duration: 90,
        topic: '数据结构与算法基础',
        participants: 45
      },
      moduleUsage: [
        { module: '关键词可视化', usage: 85, duration: 15, interactions: 23 },
        { module: 'AI模拟答辩', usage: 70, duration: 25, interactions: 18 },
        { module: '课堂热度分析', usage: 90, duration: 10, interactions: 12 },
        { module: '思政推荐引擎', usage: 60, duration: 8, interactions: 15 },
        { module: 'AI智能对话', usage: 95, duration: 20, interactions: 35 }
      ],
      interactions: [
        {
          id: '1',
          student: '张同学',
          type: 'question',
          content: '怎么知道IP有没有冲突？',
          timestamp: '14:25',
          quality: 85
        },
        {
          id: '2',
          student: '李同学',
          type: 'question',
          content: '如何测试网络有没有联通？',
          timestamp: '14:32',
          quality: 92
        },
        {
          id: '3',
          student: '王同学',
          type: 'question',
          content: '为什么我的网不通？',
          timestamp: '14:45',
          quality: 78
        },
        {
          id: '4',
          student: '陈同学',
          type: 'question',
          content: '固定IP后发现ip还是自获是什么原因？',
          timestamp: '15:10',
          quality: 80
        }
      ],
      keyMetrics: {
        totalQuestions: 12,
        avgResponseTime: 3.5,
        participationRate: 78,
        satisfactionScore: 4.6
      },
      insights: {
        strengths: [
          '学生对算法原理理解较好，提问质量较高',
          '课堂互动积极，参与度达到78%',
          'AI对话系统使用频率最高，学生接受度良好',
          '思政元素融入自然，学生能主动关联理论知识'
        ],
        improvements: [
          '部分学生对复杂算法理解不够深入',
          '实践环节时间可以适当增加',
          '思政推荐引擎使用率偏低，需要引导'
        ],
        recommendations: [
          '增加更多实际案例演示',
          '设计更多互动环节',
          '加强算法可视化展示',
          '建立课后答疑机制'
        ]
      },
      nextSteps: [
        '准备下节课的排序算法可视化演示',
        '整理本节课的高质量问题作为案例库',
        '设计算法复杂度分析的专项练习',
        '收集学生反馈，优化教学方法'
      ]
    }
  }

  const exportToMarkdown = () => {
    if (!summary) return
    
    const markdown = `# 教学数据汇总报告

## 课程信息
- **日期**: ${summary.sessionInfo.date}
- **时长**: ${summary.sessionInfo.duration}分钟
- **主题**: ${summary.sessionInfo.topic}
- **参与人数**: ${summary.sessionInfo.participants}人

## 关键指标
- **总提问数**: ${summary.keyMetrics.totalQuestions}
- **平均响应时间**: ${summary.keyMetrics.avgResponseTime}秒
- **参与率**: ${summary.keyMetrics.participationRate}%
- **满意度**: ${summary.keyMetrics.satisfactionScore}/5.0

## 模块使用情况
${summary.moduleUsage.map(m => `- **${m.module}**: 使用率${m.usage}%, 时长${m.duration}分钟, 互动${m.interactions}次`).join('\n')}

## 优势亮点
${summary.insights.strengths.map(s => `- ${s}`).join('\n')}

## 改进建议
${summary.insights.improvements.map(i => `- ${i}`).join('\n')}

## 教学建议
${summary.insights.recommendations.map(r => `- ${r}`).join('\n')}

## 下步计划
${summary.nextSteps.map(n => `- ${n}`).join('\n')}

---
*报告生成时间: ${new Date().toLocaleString('zh-CN')}*`
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `教学总结-${summary.sessionInfo.date}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = async () => {
    if (!summary) return
    
    const element = document.getElementById('summary-content')
    if (!element) return
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      pdf.save(`教学总结-${summary.sessionInfo.date}.pdf`)
    } catch (error) {
      console.error('Failed to export PDF:', error)
    }
  }

  const handleExport = () => {
    if (exportFormat === 'markdown') {
      exportToMarkdown()
    } else {
      exportToPDF()
    }
  }

  const InteractionCard = ({ interaction }: { interaction: StudentInteraction }) => {
    const typeConfig = {
      question: { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
      answer: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
      discussion: { icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' }
    }
    
    const config = typeConfig[interaction.type]
    const Icon = config.icon
    
    return (
      <div className={`p-4 rounded-lg border border-slate-200 dark:border-slate-700 ${config.bg}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${config.color}`} />
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {interaction.student}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {interaction.timestamp}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {interaction.quality}
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          {interaction.content}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          教学数据汇总
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          智能分析教学过程，生成数据驱动的教学总结与改进建议
        </p>
      </motion.div>

      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
            数据汇总控制台
          </h2>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="today">今日课程</option>
              <option value="week">本周汇总</option>
              <option value="month">本月汇总</option>
            </select>
            
            <button
              onClick={generateSummary}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  生成汇总
                </>
              )}
            </button>
          </div>
        </div>
        
        {summary && (
          <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">导出格式:</span>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'markdown' | 'pdf')}
                className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm"
              >
                <option value="markdown">Markdown</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              导出报告
            </button>
          </div>
        )}
      </motion.div>

      {/* Summary Content */}
      {summary && (
        <div id="summary-content" className="space-y-6">
          {/* Session Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              课程信息
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {summary.sessionInfo.duration}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">分钟</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {summary.sessionInfo.participants}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">参与人数</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {summary.keyMetrics.participationRate}%
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">参与率</div>
              </div>
              
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {summary.keyMetrics.satisfactionScore}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">满意度</div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                {summary.sessionInfo.topic}
              </h4>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                课程日期: {summary.sessionInfo.date}
              </p>
            </div>
          </motion.div>

          {/* Module Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              模块使用分析
            </h3>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.moduleUsage}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="module" 
                    className="text-xs"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgb(30 41 59)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Bar dataKey="usage" fill="#3B82F6" name="使用率(%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {summary.moduleUsage.map((module, index) => (
                <div key={module.module} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    {module.module}
                  </h4>
                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <div>使用率: {module.usage}%</div>
                    <div>时长: {module.duration}分钟</div>
                    <div>互动: {module.interactions}次</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Student Interactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              学生互动记录
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.interactions.map((interaction, index) => (
                <motion.div
                  key={interaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <InteractionCard interaction={interaction} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Strengths */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                优势亮点
              </h3>
              <div className="space-y-3">
                {summary.insights.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                改进建议
              </h3>
              <div className="space-y-3">
                {summary.insights.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                教学建议
              </h3>
              <div className="space-y-3">
                {summary.insights.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-slate-700 dark:text-slate-300">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              下步行动计划
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summary.nextSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Teaching Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
              💡 教学建议
            </h3>
            <div className="space-y-2 text-blue-700 dark:text-blue-300">
              <p>• <strong>BOPPPS-Summary:</strong> 利用数据汇总进行课程总结和反思</p>
              <p>• <strong>墨子四疑法:</strong> 通过数据发现问题，引导持续改进</p>
              <p>• <strong>数据驱动:</strong> 基于客观数据制定教学改进策略</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}