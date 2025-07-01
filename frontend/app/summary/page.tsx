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
  Star,
  Award,
  Zap
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
  const [selectedTask, setSelectedTask] = useState('task1')
  const [exportFormat, setExportFormat] = useState<'markdown' | 'pdf'>('markdown')

  const tasks = {
    task1: '任务1：小型网络需求分析与方案规划',
    task2: '任务2：虚拟环境网络搭建与功能测试',
    task3: '任务3：真实设备网络搭建与安全配置',
    task4: '任务4：网络成果汇报与方案优化迭代'
  }

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
    const taskData = {
      task1: {
        topic: '任务1：小型网络需求分析与方案规划',
        participants: 21,
        participationRate: 95,
        satisfactionScore: 4.8,
        strengths: [
          '学生工程思维培养效果显著，能从国家网络安全战略高度分析需求',
          '团队协作精神突出，强化了保障网络安全的责任担当意识',
          '系统性网络架构规划能力提升明显，体现了家国情怀',
          '4学时深度教学效果显著，学生对复杂网络架构理解透彻'
        ],
        totalQuestions: 28,
        avgResponseTime: 4.2,
        improvements: [
          '部分学生对复杂网络拓扑理解需要加强',
          '方案设计的创新性有待提升',
          '团队协作环节可以进一步优化'
        ],
        recommendations: [
          '增加更多国家网络安全战略案例分析',
          '设计更多小组协作讨论环节',
          '加强工程思维训练和网络架构可视化展示',
          '建立方案评审机制，强化责任担当意识'
        ],
        nextSteps: [
          '准备下节课的虚拟环境搭建演示',
          '整理本节课的优秀方案作为案例库',
          '设计网络架构设计的专项练习',
          '收集学生反馈，优化教学方法'
        ],
        moduleUsage: [
          { module: '需求分析AI助手', usage: 85, duration: 25, interactions: 28 },
          { module: '网络拓扑设计', usage: 78, duration: 30, interactions: 22 },
          { module: '成本估算工具', usage: 72, duration: 15, interactions: 18 },
          { module: '技术文档生成', usage: 68, duration: 20, interactions: 15 }
        ],
        interactions: [
          {
          id: '1',
          student: '张同学',
          type: 'question' as const,
          content: '如何确定养殖场的网络覆盖范围？',
          timestamp: '14:23',
          quality: 88
        },
        {
          id: '2',
          student: '李同学',
          type: 'question' as const,
          content: '无线网络和有线网络如何选择？',
          timestamp: '14:45',
          quality: 92
        },
        {
          id: '3',
          student: '王同学',
          type: 'question' as const,
          content: '网络带宽需求如何计算？',
          timestamp: '15:12',
          quality: 85
        }
        ]
      },
      task2: {
        topic: '任务2：虚拟环境网络搭建与功能测试',
        participants: 21,
        participationRate: 92,
        satisfactionScore: 4.7,
        strengths: [
          '学生创新精神突出，自主设计创新拓扑结构能力强',
          '劳动教育效果显著，以严谨态度完成搭建任务，体现劳动价值',
          '工匠精神培养良好，反复调试测试追求零误差',
          '4学时充足时间保障，学生能够深入实践虚拟环境搭建'
        ],
        totalQuestions: 32,
        avgResponseTime: 3.8,
        improvements: [
          '部分学生对网络协议理解不够深入',
          '虚拟环境配置速度有待提升',
          '网络性能优化意识需要加强'
        ],
        recommendations: [
          '增加创新拓扑设计训练，培养创新精神',
          '强化劳动教育，提供更多虚拟环境操作练习',
          '加强工匠精神培养，建立零误差标准',
          '优化小组协作机制，提升团队效率'
        ],
        nextSteps: [
          '准备真实设备操作环节',
          '整理网络测试标准流程',
          '设计网络性能优化专题',
          '完善虚拟环境配置模板'
        ],
        moduleUsage: [
           { module: '设备选型专家系统', usage: 92, duration: 35, interactions: 31 },
           { module: '参数配置向导', usage: 88, duration: 40, interactions: 26 },
           { module: '兼容性检测', usage: 81, duration: 20, interactions: 19 },
           { module: '性能评估工具', usage: 75, duration: 25, interactions: 17 }
         ],
         interactions: [
           {
              id: '1',
              student: '陈同学',
              type: 'question' as const,
              content: '交换机端口数量如何确定？',
              timestamp: '14:18',
              quality: 90
            },
            {
              id: '2',
              student: '刘同学',
              type: 'question' as const,
              content: 'PoE供电功率如何计算？',
              timestamp: '14:52',
              quality: 87
            },
            {
              id: '3',
              student: '赵同学',
              type: 'question' as const,
              content: '路由器处理能力如何评估？',
              timestamp: '15:28',
              quality: 93
            }
         ]
      },
      task3: {
        topic: '任务3：真实设备网络搭建与安全配置',
        participants: 21,
        participationRate: 89,
        satisfactionScore: 4.9,
        strengths: [
          '学生运用前沿科技保障网络安全意识强，技术应用得当',
          '严格执行安全配置规范，筑牢安全防线，安全意识显著提升',
          '工匠精神培养效果显著，精细配置每台设备追求完美',
          '4学时实操训练充分，学生真实设备操作技能显著提升'
        ],
        totalQuestions: 25,
        avgResponseTime: 4.5,
        improvements: [
          '部分学生设备调试速度需要提升',
          '安全策略的灵活性配置有待加强',
          '设备故障处理经验需要积累'
        ],
        recommendations: [
          '增加前沿科技在网络安全中的应用案例',
          '强化安全配置规范训练，提升工匠精神',
          '加强责任担当教育，树立网络安全使命感',
          '建立设备操作标准流程'
        ],
        nextSteps: [
          '准备网络部署成果汇报',
          '整理安全配置最佳实践',
          '设计网络安全专项评估',
          '完善设备操作手册'
        ],
        moduleUsage: [
           { module: '安全策略生成器', usage: 89, duration: 30, interactions: 25 },
           { module: '漏洞扫描工具', usage: 84, duration: 25, interactions: 21 },
           { module: '防火墙配置助手', usage: 79, duration: 35, interactions: 18 },
           { module: '入侵检测系统', usage: 73, duration: 20, interactions: 16 }
         ],
         interactions: [
           {
              id: '1',
              student: '孙同学',
              type: 'question' as const,
              content: '如何设置网络访问控制？',
              timestamp: '14:35',
              quality: 89
            },
            {
              id: '2',
              student: '周同学',
              type: 'question' as const,
              content: '数据传输加密如何实现？',
              timestamp: '15:08',
              quality: 91
            },
            {
              id: '3',
              student: '吴同学',
              type: 'question' as const,
              content: '如何防范物联网设备安全风险？',
              timestamp: '15:42',
              quality: 86
            }
         ]
      },
      task4: {
        topic: '任务4：网络成果汇报与方案优化迭代',
        participants: 21,
        participationRate: 96,
        satisfactionScore: 4.9,
        strengths: [
          '学生工程思维运用出色，能够系统性复盘优化方案',
          '创新精神突出，提出了多项创新性改进建议',
          '家国情怀深厚，能从国家网络安全需求出发完善方案',
          '4学时综合汇报训练，学生表达能力和方案优化能力全面提升'
        ],
        totalQuestions: 35,
        avgResponseTime: 3.2,
        improvements: [
          '部分学生汇报时间控制需要改进',
          '方案展示的可视化效果有待提升',
          '跨组交流互动可以更加充分'
        ],
        recommendations: [
          '加强工程思维训练，提升系统性分析能力',
          '鼓励创新精神，提供更多创新展示平台',
          '强化家国情怀教育，结合国家网络安全战略',
          '优化团队协作机制，建立方案迭代机制'
        ],
        nextSteps: [
          '总结项目完整实施经验',
          '建立优秀方案展示库',
          '设计后续进阶项目',
          '完善教学评价体系'
        ],
        moduleUsage: [
           { module: '性能监控仪表板', usage: 95, duration: 45, interactions: 38 },
           { module: '网络测试工具集', usage: 91, duration: 40, interactions: 33 },
           { module: '优化建议引擎', usage: 87, duration: 30, interactions: 28 },
           { module: '故障诊断专家', usage: 82, duration: 25, interactions: 24 }
         ],
         interactions: [
           {
              id: '1',
              student: '郑同学',
              type: 'question' as const,
              content: '网络延迟过高如何排查？',
              timestamp: '14:25',
              quality: 94
            },
            {
              id: '2',
              student: '冯同学',
              type: 'question' as const,
              content: '带宽利用率如何优化？',
              timestamp: '15:15',
              quality: 88
            },
            {
              id: '3',
              student: '何同学',
              type: 'question' as const,
              content: '如何提升网络可靠性？',
              timestamp: '15:55',
              quality: 92
            }
         ]
      }
    }

    const currentTaskData = taskData[selectedTask as keyof typeof taskData]

    return {
      sessionInfo: {
        date: new Date().toLocaleDateString('zh-CN'),
        duration: 180,
        topic: currentTaskData.topic,
        participants: currentTaskData.participants
      },
      moduleUsage: currentTaskData.moduleUsage,
      interactions: currentTaskData.interactions,
      keyMetrics: {
        totalQuestions: currentTaskData.totalQuestions,
        avgResponseTime: currentTaskData.avgResponseTime,
        participationRate: currentTaskData.participationRate,
        satisfactionScore: currentTaskData.satisfactionScore
      },
      insights: {
        strengths: currentTaskData.strengths,
        improvements: currentTaskData.improvements,
        recommendations: currentTaskData.recommendations
      },
      nextSteps: currentTaskData.nextSteps
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
      <div className={`p-2 rounded border border-slate-200 dark:border-slate-700 ${config.bg} print:shadow-none`}>
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-1">
            <Icon className={`w-3 h-3 ${config.color}`} />
            <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">
              {interaction.student}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {interaction.timestamp}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-2 h-2 text-yellow-500" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {interaction.quality}
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300">
          {interaction.content}
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-full mx-auto space-y-4 print:space-y-2 print:landscape">
      {/* Header - 横版优化 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-4 shadow-lg print:shadow-none print:border print:border-blue-300"
      >
        <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2 print:text-black print:text-xl">
          <BarChart3 className="w-6 h-6 text-blue-200 print:text-blue-600" />
          智慧养殖场网络部署项目教学数据汇总
        </h1>
        <p className="text-blue-100 text-sm print:text-gray-600">
          AI驱动的智能教学分析平台，生成数据驱动的教学总结与改进建议
        </p>
      </motion.div>

      {/* Control Panel - 横版优化 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-slate-800 rounded-lg p-3 shadow-md border border-blue-200 dark:border-blue-800 print:shadow-none print:border print:border-gray-300"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            数据汇总控制台
          </h2>
          
          <div className="flex items-center gap-4">
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 min-w-[300px]"
            >
              <option value="task1">任务1：小型网络需求分析与方案规划</option>
              <option value="task2">任务2：虚拟环境网络搭建与功能测试</option>
              <option value="task3">任务3：真实设备网络搭建与安全配置</option>
              <option value="task4">任务4：网络成果汇报与方案优化迭代</option>
            </select>
            
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
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
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
            
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white transform hover:scale-105 transition-all shadow-md print:shadow-none print:border print:border-blue-300">
                <div className="text-xl font-bold">
                  {summary.sessionInfo.duration}
                </div>
                <div className="text-xs text-blue-100">分钟</div>
              </div>
              
              <div className="text-center p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white transform hover:scale-105 transition-all shadow-md print:shadow-none print:border print:border-green-300">
                <div className="text-xl font-bold">
                  {summary.sessionInfo.participants}
                </div>
                <div className="text-xs text-green-100">参与人数</div>
              </div>
              
              <div className="text-center p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white transform hover:scale-105 transition-all shadow-md print:shadow-none print:border print:border-purple-300">
                <div className="text-xl font-bold">
                  {summary.keyMetrics.participationRate}%
                </div>
                <div className="text-xs text-purple-100">参与率</div>
                <div className="flex items-center justify-center mt-1">
                  <Star className="w-3 h-3 text-yellow-300 mr-1" />
                  <span className="text-xs text-purple-100">优秀</span>
                </div>
              </div>
              
              <div className="text-center p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white transform hover:scale-105 transition-all shadow-md print:shadow-none print:border print:border-orange-300">
                <div className="text-xl font-bold">
                  {summary.keyMetrics.satisfactionScore}
                </div>
                <div className="text-xs text-orange-100">满意度</div>
                <div className="flex items-center justify-center mt-1">
                  <Award className="w-3 h-3 text-yellow-300 mr-1" />
                  <span className="text-xs text-orange-100">卓越</span>
                </div>
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

          {/* Module Usage - 横版优化 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 rounded-lg p-3 shadow-md border border-indigo-200 dark:border-indigo-800 print:shadow-none print:border print:border-gray-300"
          >
            <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-2 flex items-center gap-1">
              <Target className="w-4 h-4 text-indigo-600" />
              AI模块使用分析
            </h3>
            
            <div className="h-60 print:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.moduleUsage} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="module" 
                    className="text-xs"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis className="text-xs" tick={{ fontSize: 10 }} />
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

          {/* Student Interactions - 横版优化 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg p-3 shadow-md border border-green-200 dark:border-green-800 print:shadow-none print:border print:border-gray-300"
          >
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-green-600" />
              网络技术问题互动
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto print:max-h-48">
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-6 shadow-xl border-2 border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                教学优势亮点
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
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-xl p-6 shadow-xl border-2 border-orange-200 dark:border-orange-800">
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                优化改进建议
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
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 rounded-xl p-6 shadow-xl border-2 border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-purple-600" />
                AI智能教学建议
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
            className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6 shadow-xl border-2 border-blue-200 dark:border-blue-800"
          >
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              AI推荐行动计划
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