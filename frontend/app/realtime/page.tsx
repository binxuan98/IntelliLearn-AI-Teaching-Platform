'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Activity,
  MessageCircle,
  TrendingUp,
  Clock,
  Eye,
  BookOpen,
  Zap
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

// 模拟实时数据
const generateMockData = () => {
  const now = new Date()
  const timePoints = []
  for (let i = 9; i >= 0; i--) {
    timePoints.push({
      time: new Date(now.getTime() - i * 60000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      activeUsers: Math.floor(Math.random() * 5) + 17, // 17-21人在线
      questions: Math.floor(Math.random() * 3) + 1,
      engagement: Math.floor(Math.random() * 30) + 70 // 70-100%参与度
    })
  }
  return timePoints
}

const questionsList = [
  "怎么知道IP有没有冲突",
  "如何测试网络有没有联通",
  "为什么我的网不通",
  "固定IP后发现ip还是自获是什么原因？"
]

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

export default function RealtimePage() {
  const [data, setData] = useState(generateMockData())
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [stats, setStats] = useState({
    totalStudents: 21,
    onlineStudents: 19,
    totalQuestions: 47,
    avgEngagement: 85
  })

  // 实时更新数据
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)]
        const now = new Date()
        newData.push({
          time: now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          activeUsers: Math.floor(Math.random() * 5) + 17,
          questions: Math.floor(Math.random() * 3) + 1,
          engagement: Math.floor(Math.random() * 30) + 70
        })
        return newData
      })

      // 更新统计数据
      setStats(prev => ({
        ...prev,
        onlineStudents: Math.floor(Math.random() * 5) + 17,
        totalQuestions: prev.totalQuestions + Math.floor(Math.random() * 2),
        avgEngagement: Math.floor(Math.random() * 20) + 75
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // 滚动显示问题
  useEffect(() => {
    const questionInterval = setInterval(() => {
      setCurrentQuestion(prev => (prev + 1) % questionsList.length)
    }, 4000)

    return () => clearInterval(questionInterval)
  }, [])

  const pieData = [
    { name: '网络问题', value: 35, color: COLORS[0] },
    { name: 'IP配置', value: 28, color: COLORS[1] },
    { name: '连通性测试', value: 22, color: COLORS[2] },
    { name: '其他问题', value: 15, color: COLORS[3] }
  ]

  return (
    <div className="space-y-5 max-h-screen overflow-hidden">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          实时课堂数据监控
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          实时监控学生学习状态和平台使用情况
        </p>
      </div>

      {/* 实时统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow-md border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">在线学生</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {stats.onlineStudents}/{stats.totalStudents}
              </p>
            </div>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>在线率 {Math.round((stats.onlineStudents / stats.totalStudents) * 100)}%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow-md border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">累计提问</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {stats.totalQuestions}
              </p>
            </div>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
              <Activity className="w-3 h-3 mr-1" />
              <span>活跃度高</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow-md border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">平均参与度</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {stats.avgEngagement}%
              </p>
            </div>
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.avgEngagement}%` }}
              ></div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-5 shadow-md border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">课程时长</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
              <BookOpen className="w-3 h-3 mr-1" />
              <span>进行中</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 滚动显示热门问题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-5 text-white shadow-md"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            学生热门提问
          </h3>
          <div className="text-sm opacity-80">实时滚动</div>
        </div>
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-medium"
        >
          {questionsList[currentQuestion]}
        </motion.div>
      </motion.div>

      {/* 数据图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 实时活跃度趋势 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
            实时活跃度趋势
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="#6B7280"
                fontSize={11}
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#6B7280" fontSize={11} tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#F9FAFB',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 1, r: 3 }}
                name="在线人数"
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 1, r: 3 }}
                name="参与度%"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 问题分类统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
            问题分类统计
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name.slice(0, 2)} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#F9FAFB',
                  fontSize: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 实时提问柱状图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
            每分钟提问数量
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                stroke="#6B7280"
                fontSize={11}
                tick={{ fontSize: 11 }}
              />
              <YAxis stroke="#6B7280" fontSize={11} tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#F9FAFB',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="questions" 
                fill="#8B5CF6"
                radius={[2, 2, 0, 0]}
                name="提问数"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}