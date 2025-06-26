'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock,
  BarChart3,
  Activity,
  Target,
  Award,
  RefreshCw,
  Play,
  Pause,
  Download
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts'

interface HeatData {
  time: string
  engagement: number
  questions: number
  interactions: number
}

interface KeywordHeat {
  keyword: string
  frequency: number
  heat: number
}

interface StudentMetrics {
  totalStudents: number
  activeStudents: number
  participationRate: number
  avgQuestionQuality: number
  interactionCount: number
}

interface AnalysisResult {
  heatData: HeatData[]
  keywordHeat: KeywordHeat[]
  metrics: StudentMetrics
  summary: string
  recommendations: string[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']

export default function AnalysisPage() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<'engagement' | 'questions' | 'interactions'>('engagement')
  const [simulationSpeed, setSimulationSpeed] = useState(1)

  // 模拟实时数据生成
  const generateMockData = (): AnalysisResult => {
    const timePoints = Array.from({ length: 20 }, (_, i) => {
      const minutes = i * 3
      return {
        time: `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, '0')}`,
        engagement: Math.floor(Math.random() * 40) + 60 + Math.sin(i * 0.3) * 20,
        questions: Math.floor(Math.random() * 8) + 2,
        interactions: Math.floor(Math.random() * 15) + 5
      }
    })

    const keywords = [
      '人工智能', '机器学习', '深度学习', '神经网络', '算法',
      '数据挖掘', '自然语言', '计算机视觉', '强化学习', '大数据'
    ].map(keyword => ({
      keyword,
      frequency: Math.floor(Math.random() * 50) + 10,
      heat: Math.random() * 100
    }))

    const totalStudents = 45
    const activeStudents = Math.floor(Math.random() * 15) + 30
    
    return {
      heatData: timePoints,
      keywordHeat: keywords.sort((a, b) => b.heat - a.heat),
      metrics: {
        totalStudents,
        activeStudents,
        participationRate: (activeStudents / totalStudents) * 100,
        avgQuestionQuality: Math.random() * 30 + 70,
        interactionCount: timePoints.reduce((sum, point) => sum + point.interactions, 0)
      },
      summary: '本节课整体参与度较高，学生在人工智能和机器学习相关话题上表现出浓厚兴趣。课程中段互动最为活跃，建议在类似时间点增加更多互动环节。',
      recommendations: [
        '在课程15-30分钟时增加互动问答环节',
        '针对"人工智能"等高热度关键词设计深入讨论',
        '鼓励参与度较低的学生主动提问',
        '利用实时反馈调整教学节奏'
      ]
    }
  }

  const startSimulation = () => {
    setIsSimulating(true)
    setCurrentTime(0)
    
    // 模拟实时数据更新
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = prev + simulationSpeed
        if (newTime >= 60) {
          setIsSimulating(false)
          setResult(generateMockData())
          clearInterval(interval)
          return 60
        }
        return newTime
      })
    }, 100)
  }

  const stopSimulation = () => {
    setIsSimulating(false)
    if (!result) {
      setResult(generateMockData())
    }
  }

  const resetSimulation = () => {
    setIsSimulating(false)
    setCurrentTime(0)
    setResult(null)
  }

  const exportData = () => {
    if (!result) return
    
    const exportData = {
      analysis: result,
      exportTime: new Date().toISOString(),
      courseInfo: {
        duration: '60分钟',
        topic: '人工智能基础'
      }
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `classroom-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const MetricCard = ({ title, value, unit, icon: Icon, color, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">
            {typeof value === 'number' ? value.toFixed(1) : value}{unit}
          </p>
          {trend && (
            <p className={`text-sm mt-1 flex items-center gap-1 ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  const HeatmapCell = ({ keyword, heat }: { keyword: string, heat: number }) => {
    const intensity = Math.floor((heat / 100) * 5)
    const colors = [
      'bg-blue-100 dark:bg-blue-900/20',
      'bg-blue-200 dark:bg-blue-900/40', 
      'bg-blue-400 dark:bg-blue-700',
      'bg-blue-600 dark:bg-blue-600',
      'bg-blue-800 dark:bg-blue-500'
    ]
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-3 rounded-lg ${colors[intensity]} text-center cursor-pointer hover:scale-105 transition-transform`}
        title={`${keyword}: ${heat.toFixed(1)}%`}
      >
        <p className={`text-sm font-medium ${
          intensity >= 2 ? 'text-white' : 'text-slate-700 dark:text-slate-300'
        }`}>
          {keyword}
        </p>
        <p className={`text-xs ${
          intensity >= 2 ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
        }`}>
          {heat.toFixed(1)}%
        </p>
      </motion.div>
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
          课堂热度分析系统
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          实时监测课堂互动热度，分析学生参与度和提问质量
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
            模拟控制台
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">速度:</span>
            <select 
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              className="px-3 py-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={5}>5x</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                课程进度: {currentTime.toFixed(1)}/60 分钟
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentTime / 60) * 100}%` }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {!isSimulating ? (
              <button
                onClick={startSimulation}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Play className="w-4 h-4" />
                开始模拟
              </button>
            ) : (
              <button
                onClick={stopSimulation}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Pause className="w-4 h-4" />
                停止模拟
              </button>
            )}
            
            <button
              onClick={resetSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              重置
            </button>
          </div>
        </div>
      </motion.div>

      {/* Real-time Metrics */}
      {(isSimulating || result) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <MetricCard
            title="总学生数"
            value={result?.metrics.totalStudents || 45}
            unit="人"
            icon={Users}
            color="bg-blue-500"
          />
          <MetricCard
            title="活跃学生"
            value={result?.metrics.activeStudents || Math.floor(currentTime * 0.5) + 25}
            unit="人"
            icon={Activity}
            color="bg-green-500"
            trend={5.2}
          />
          <MetricCard
            title="参与率"
            value={result?.metrics.participationRate || ((Math.floor(currentTime * 0.5) + 25) / 45) * 100}
            unit="%"
            icon={Target}
            color="bg-purple-500"
            trend={2.1}
          />
          <MetricCard
            title="提问质量"
            value={result?.metrics.avgQuestionQuality || 75 + Math.sin(currentTime * 0.1) * 10}
            unit="分"
            icon={Award}
            color="bg-orange-500"
            trend={-1.3}
          />
        </motion.div>
      )}

      {/* Charts */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Time Series Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                课堂热度时间序列
              </h3>
              <div className="flex gap-2">
                {[
                  { key: 'engagement', label: '参与度', color: '#3b82f6' },
                  { key: 'questions', label: '提问数', color: '#8b5cf6' },
                  { key: 'interactions', label: '互动数', color: '#10b981' }
                ].map((metric) => (
                  <button
                    key={metric.key}
                    onClick={() => setSelectedMetric(metric.key as any)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedMetric === metric.key
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {metric.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.heatData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    stroke={selectedMetric === 'engagement' ? '#3b82f6' : selectedMetric === 'questions' ? '#8b5cf6' : '#10b981'}
                    fill={selectedMetric === 'engagement' ? '#3b82f6' : selectedMetric === 'questions' ? '#8b5cf6' : '#10b981'}
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Keyword Heatmap */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                关键词热力图
              </h3>
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                导出数据
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {result.keywordHeat.map((item, index) => (
                <HeatmapCell key={index} keyword={item.keyword} heat={item.heat} />
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Participation Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                参与度分布
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: '高度参与', value: 35, color: '#10b981' },
                        { name: '中度参与', value: 45, color: '#3b82f6' },
                        { name: '低度参与', value: 20, color: '#f59e0b' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: '高度参与', value: 35, color: '#10b981' },
                        { name: '中度参与', value: 45, color: '#3b82f6' },
                        { name: '低度参与', value: 20, color: '#f59e0b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Question Quality */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                提问质量分析
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { category: '概念理解', score: 85 },
                    { category: '应用分析', score: 78 },
                    { category: '批判思维', score: 72 },
                    { category: '创新思考', score: 68 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="category" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Summary and Recommendations */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              分析总结
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              {result.summary}
            </p>
            
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
              改进建议
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Teaching Tips */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300 mb-3">
              💡 教学建议
            </h3>
            <div className="space-y-2 text-orange-700 dark:text-orange-300">
              <p>• <strong>BOPPPS-Participatory:</strong> 利用热度数据优化参与式教学环节</p>
              <p>• <strong>墨子四疑法:</strong> 在互动高峰期引入深度疑问，促进思考</p>
              <p>• <strong>实时调整:</strong> 根据参与度变化及时调整教学策略和节奏</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}