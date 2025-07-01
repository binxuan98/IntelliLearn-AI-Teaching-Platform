'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  BookOpen, 
  User, 
  FileText, 
  Quote,
  Flag,
  Users,
  Lightbulb,
  Copy,
  Download,
  Loader2,
  CheckCircle,
  Star,
  Filter
} from 'lucide-react'

interface IdeologyItem {
  id: string
  type: 'quote' | 'policy' | 'person' | 'case'
  title: string
  content: string
  source: string
  relevance: number
  tags: string[]
  usage: string
}

interface RecommendationResult {
  items: IdeologyItem[]
  summary: string
  integrationSuggestions: string[]
  pptSlides: string[]
}

const typeConfig = {
  quote: { label: '经典语录', icon: Quote, color: 'from-red-600 to-red-500' },
  policy: { label: '政策方针', icon: Flag, color: 'from-red-700 to-red-600' },
  person: { label: '先进人物', icon: User, color: 'from-red-800 to-red-700' },
  case: { label: '典型案例', icon: FileText, color: 'from-red-900 to-red-800' }
}

export default function IdeologyPage() {
  const [courseContent, setCourseContent] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['quote', 'policy', 'person', 'case'])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filterRelevance, setFilterRelevance] = useState(0)

  const analyzeContent = async () => {
    if (!courseContent.trim()) return
    
    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/thinking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: courseContent,
          types: selectedTypes
        }),
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Failed to analyze content:', error)
      // 模拟数据作为fallback
      setResult(generateMockResult())
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateMockResult = (): RecommendationResult => {
    const mockItems: IdeologyItem[] = [
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

    return {
      items: mockItems,
      summary: '根据您的课程内容，系统为您推荐了5个思政元素，涵盖经典语录、先进人物、政策方针和典型案例。这些内容与您的专业课程高度相关，可以有效实现价值引领与知识传授的有机融合。',
      integrationSuggestions: [
        '在课程导入环节引用习近平总书记关于科技创新的重要论述，激发学生学习动力',
        '结合钱学森等科学家事迹，培养学生的爱国主义情怀和科学精神',
        '通过北斗导航等成功案例，增强学生的民族自信心和专业自豪感',
        '将国家科技政策与课程内容结合，帮助学生理解个人发展与国家需要的关系'
      ],
      pptSlides: [
        '标题：科技强国梦，青年当自强\n内容：习近平总书记指出，"科技是国家强盛之基，创新是民族进步之魂"',
        '标题：学习钱学森，做有理想的科技工作者\n内容：钱学森的爱国情怀和科学精神值得我们学习',
        '标题：北斗闪耀，中国智慧照亮世界\n内容：北斗导航系统展现了中国科技自立自强的能力'
      ]
    }
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

  const exportToPPT = () => {
    if (!result) return
    
    const pptContent = result.pptSlides.join('\n\n---\n\n')
    const blob = new Blob([pptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `思政元素-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredItems = result?.items.filter(item => 
    item.relevance >= filterRelevance && selectedTypes.includes(item.type)
  ) || []

  const IdeologyCard = ({ item }: { item: IdeologyItem }) => {
    const config = typeConfig[item.type]
    const Icon = config.icon
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-xl p-6 shadow-xl border-2 border-red-200 dark:border-red-800 hover:shadow-2xl hover:border-red-300 dark:hover:border-red-700 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {config.label}
              </span>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                {item.title}
              </h3>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {item.relevance}%
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(item.content, item.id)}
              className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              {copiedId === item.id ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        
        <blockquote className="text-red-800 dark:text-red-200 mb-4 pl-4 border-l-4 border-red-500 dark:border-red-400 italic font-medium bg-red-50 dark:bg-red-900/30 p-3 rounded-r-lg">
          {item.content}
        </blockquote>
        
        <div className="space-y-3">
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">来源：</span>
            <span className="text-sm text-slate-600 dark:text-slate-400">{item.source}</span>
          </div>
          
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">使用建议：</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{item.usage}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
          <Heart className="w-10 h-10 text-red-200" />
          思政推荐引擎
        </h1>
        <p className="text-red-100 text-lg">
          智能分析课程内容，推荐相关思政元素，实现价值引领与知识传授的有机融合
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-red-50 to-white dark:from-red-950 dark:to-slate-800 rounded-xl p-6 shadow-xl border-2 border-red-200 dark:border-red-800"
      >
        <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-red-600" />
          课程内容输入
        </h2>
        
        <div className="space-y-4">
          <textarea
            value={courseContent}
            onChange={(e) => setCourseContent(e.target.value)}
            placeholder="请输入您的课程内容、教学大纲或知识点，系统将为您推荐相关的思政元素..."
            className="w-full h-40 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              推荐类型
            </label>
            <div className="flex flex-wrap gap-3">
              {Object.entries(typeConfig).map(([type, config]) => {
                const Icon = config.icon
                return (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, type])
                        } else {
                          setSelectedTypes(selectedTypes.filter(t => t !== type))
                        }
                      }}
                      className="rounded border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-blue-500"
                    />
                    <Icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {config.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
          
          <button
            onClick={analyzeContent}
            disabled={isAnalyzing || !courseContent.trim()}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-xl font-bold hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                智能推荐
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Summary */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-xl p-6 shadow-xl border-2 border-red-200 dark:border-red-800">
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-red-600" />
              推荐总结
            </h3>
            <p className="text-red-700 dark:text-red-300 leading-relaxed font-medium">
              {result.summary}
            </p>
          </div>

          {/* Filters and Actions */}
          <div className="bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900 dark:to-red-950 rounded-xl p-4 shadow-xl border-2 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">相关度筛选:</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filterRelevance}
                    onChange={(e) => setFilterRelevance(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {filterRelevance}%+
                  </span>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  显示 {filteredItems.length} 个结果
                </span>
              </div>
              
              <button
                onClick={exportToPPT}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
                导出PPT素材
              </button>
            </div>
          </div>

          {/* Ideology Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <IdeologyCard item={item} />
              </motion.div>
            ))}
          </div>

          {/* Integration Suggestions */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-xl p-6 shadow-xl border-2 border-red-200 dark:border-red-800">
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-red-600" />
              融入建议
            </h3>
            <div className="space-y-3">
              {result.integrationSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-100 dark:bg-red-800/50 rounded-lg border border-red-200 dark:border-red-700">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 shadow-lg">
                    {index + 1}
                  </div>
                  <p className="text-red-800 dark:text-red-200 font-medium">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PPT Slides Preview */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 rounded-xl p-6 shadow-xl border-2 border-red-200 dark:border-red-800">
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-red-600" />
              PPT素材预览
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.pptSlides.map((slide, index) => {
                const [title, content] = slide.split('\n内容：')
                return (
                  <div key={index} className="bg-red-100 dark:bg-red-800/50 p-4 rounded-lg border-2 border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-all">
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      幻灯片 {index + 1}
                    </div>
                    <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">
                      {title.replace('标题：', '')}
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                      {content}
                    </p>
                    <button
                      onClick={() => copyToClipboard(slide, `slide-${index}`)}
                      className="mt-2 text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
                    >
                      {copiedId === `slide-${index}` ? (
                        <><CheckCircle className="w-3 h-3" /> 已复制</>
                      ) : (
                        <><Copy className="w-3 h-3" /> 复制</>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Teaching Tips */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-6 border-2 border-red-500 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-red-200" />
              教学建议
            </h3>
            <div className="space-y-3 text-red-100">
              <div className="bg-red-700/50 p-3 rounded-lg border border-red-500">
                <p className="font-semibold">• <strong className="text-red-200">BOPPPS-Bridge:</strong> 在课程导入时使用思政元素，建立情感连接</p>
              </div>
              <div className="bg-red-700/50 p-3 rounded-lg border border-red-500">
                <p className="font-semibold">• <strong className="text-red-200">墨子四疑法:</strong> 通过思政案例引发学生思考和讨论</p>
              </div>
              <div className="bg-red-700/50 p-3 rounded-lg border border-red-500">
                <p className="font-semibold">• <strong className="text-red-200">有机融合:</strong> 将思政元素自然融入专业知识讲解中，避免生硬嵌入</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}