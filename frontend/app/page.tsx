'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  MessageSquare, 
  BarChart3, 
  Heart, 
  FileText, 
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  Target
} from 'lucide-react'
import Link from 'next/link'

const modules = [
  {
    id: 'keywords',
    title: '关键词可视化',
    description: '智能提取文本关键词，生成词频分析、词云图和知识图谱',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    href: '/keywords',
    features: ['文本分析', '词云生成', '知识图谱']
  },
  {
    id: 'debate',
    title: 'AI模拟答辩',
    description: '多角色AI评委模拟答辩场景，提供专业评分和改进建议',
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-500',
    href: '/debate',
    features: ['角色扮演', '智能评分', '改进建议']
  },
  {
    id: 'analysis',
    title: '课堂热度分析',
    description: '实时分析课堂互动热度，生成参与度和提问质量报告',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500',
    href: '/analysis',
    features: ['热度分析', '互动统计', '质量评估']
  },
  {
    id: 'ideology',
    title: '思政推荐引擎',
    description: '智能推荐思政元素，自动生成可嵌入的思政内容',
    icon: Heart,
    color: 'from-red-500 to-orange-500',
    href: '/ideology',
    features: ['智能推荐', '思政融入', '内容生成']
  },
  {
    id: 'summary',
    title: '教学数据汇总',
    description: '汇总教学数据，生成教学总结和改进建议报告',
    icon: FileText,
    color: 'from-indigo-500 to-blue-500',
    href: '/summary',
    features: ['数据汇总', '报告生成', '一键导出']
  },
  {
    id: 'chat',
    title: 'AI智能对话',
    description: '与AI助手实时对话，获取教学建议和知识补充',
    icon: Sparkles,
    color: 'from-yellow-500 to-amber-500',
    href: '/chat',
    features: ['实时对话', '智能推荐', '知识补充']
  }
]

const teachingMethods = [
  {
    title: '墨子四疑教学法',
    description: '逢疑、循疑、遇疑、过疑',
    icon: BookOpen,
    items: ['激发疑问', '引导思考', '解决困惑', '深化理解']
  },
  {
    title: 'BOPPPS教学模式',
    description: '六步教学法',
    icon: Target,
    items: ['导入', '目标', '前测', '参与', '后测', '总结']
  },
  {
    title: '智能化教学',
    description: 'AI赋能教育',
    icon: Users,
    items: ['个性化', '智能化', '数据化', '可视化']
  }
]

export default function HomePage() {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null)

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            启思·智教大模型平台
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            基于AI大模型的智能教学平台，融合墨子四疑教学法与BOPPPS教学模式，
            <br />为教育工作者提供全方位的智能化教学支持
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/chat">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-shadow"
              >
                开始体验 <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Modules Grid */}
      <section>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-slate-200"
        >
          功能模块
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => {
            const Icon = module.icon
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onHoverStart={() => setHoveredModule(module.id)}
                onHoverEnd={() => setHoveredModule(null)}
              >
                <Link href={module.href}>
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 card-hover group">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">
                      {module.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {module.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {module.features.map((feature) => (
                        <span 
                          key={feature}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Teaching Methods */}
      <section>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-center mb-12 text-slate-800 dark:text-slate-200"
        >
          教学理念
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teachingMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + 0.1 * index }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center mb-4">
                  <Icon className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      {method.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {method.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {method.items.map((item) => (
                    <li key={item} className="flex items-center text-slate-600 dark:text-slate-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Quick Start */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white text-center"
      >
        <h2 className="text-3xl font-bold mb-4">开始您的智能教学之旅</h2>
        <p className="text-xl mb-6 opacity-90">
          选择任意功能模块，体验AI赋能的现代化教学方式
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/keywords">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors">
              关键词分析
            </button>
          </Link>
          <Link href="/chat">
            <button className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
              AI对话助手
            </button>
          </Link>
        </div>
      </motion.section>
    </div>
  )
}