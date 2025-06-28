'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  FileText, 
  BarChart3, 
  Cloud, 
  Network,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// 动态导入ForceGraph2D以避免SSR问题
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false })

interface KeywordData {
  word: string
  count: number
  weight: number
}

interface AnalysisResult {
  keywords: KeywordData[]
  totalWords: number
  uniqueWords: number
  summary: string
}

export default function KeywordsPage() {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'chart' | 'cloud' | 'graph'>('chart')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === 'text/plain') {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setText(content)
      }
      reader.readAsText(selectedFile)
    } else {
      setError('请选择TXT文件')
    }
  }

  const analyzeKeywords = async () => {
    if (!text.trim()) {
      setError('请输入文本内容')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('分析失败')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('分析过程中出现错误，请重试')
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const exportResults = () => {
    if (!result) return
    
    const exportData = {
      analysis: result,
      exportTime: new Date().toISOString(),
      originalText: text.substring(0, 200) + '...'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `keywords-analysis-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const WordCloud = ({ keywords }: { keywords: KeywordData[] }) => {
    return (
      <div className="flex flex-wrap gap-2 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
        {keywords.slice(0, 30).map((keyword, index) => {
          const fontSize = Math.max(12, Math.min(32, keyword.weight * 20))
          const colors = [
            'text-blue-500', 'text-purple-500', 'text-green-500', 
            'text-red-500', 'text-yellow-500', 'text-indigo-500'
          ]
          const color = colors[index % colors.length]
          
          return (
            <motion.span
              key={keyword.word}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`${color} font-semibold cursor-pointer hover:scale-110 transition-transform`}
              style={{ fontSize: `${fontSize}px` }}
              title={`出现次数: ${keyword.count}`}
            >
              {keyword.word}
            </motion.span>
          )
        })}
      </div>
    )
  }

  const KnowledgeGraph = ({ keywords }: { keywords: KeywordData[] }) => {
    // 生成图数据
    const graphData: {
      nodes: Array<{
        id: string
        name: string
        val: number
        color: string
        count: number
        weight: number
      }>
      links: Array<{
        source: string
        target: string
        value: number
      }>
    } = {
      nodes: keywords.slice(0, 15).map((keyword, index) => ({
        id: keyword.word,
        name: keyword.word,
        val: keyword.weight * 100 + 5, // 节点大小基于权重
        color: `hsl(${(index * 137.5) % 360}, 70%, 60%)`, // 使用黄金角度分布颜色
        count: keyword.count,
        weight: keyword.weight
      })),
      links: []
    }

    // 生成连接关系（基于权重相似性和词汇关联性）
    const nodes = graphData.nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i]
        const node2 = nodes[j]
        
        // 基于权重差异和随机因子决定是否连接
        const weightDiff = Math.abs(node1.weight - node2.weight)
        const shouldConnect = weightDiff < 0.1 || Math.random() > 0.7
        
        if (shouldConnect && graphData.links.length < 20) {
          graphData.links.push({
            source: node1.id,
            target: node2.id,
            value: Math.max(0.1, 1 - weightDiff * 5) // 连接强度
          })
        }
      }
    }

    const handleNodeClick = useCallback((node: any) => {
      // 可以添加节点点击事件，比如显示详细信息
      console.log('Clicked node:', node)
    }, [])

    return (
      <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
        <div className="h-96 w-full">
          <ForceGraph2D
            graphData={graphData}
            nodeLabel={(node: any) => `${node.name}\n出现次数: ${node.count}\n权重: ${node.weight.toFixed(3)}`}
            nodeColor={(node: any) => node.color}
            nodeVal={(node: any) => node.val}
            linkColor={() => 'rgba(100, 116, 139, 0.3)'}
            linkWidth={(link: any) => link.value * 2}
            onNodeClick={handleNodeClick}
            nodeCanvasObject={(node: any, ctx: any, globalScale: any) => {
              const label = node.name
              const fontSize = 12 / globalScale
              ctx.font = `${fontSize}px Sans-Serif`
              ctx.textAlign = 'center'
              ctx.textBaseline = 'middle'
              ctx.fillStyle = '#1e293b'
              ctx.fillText(label, node.x, node.y)
            }}
            cooldownTicks={100}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            enableZoomInteraction={true}
            enablePanInteraction={true}
            backgroundColor="transparent"
          />
        </div>
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400 text-center">
          💡 拖拽节点可以调整布局，滚轮缩放，点击节点查看详情
        </div>
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
          关键词可视化分析
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          智能提取文本关键词，生成多维度可视化分析报告
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              文本输入
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                上传TXT
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
          
          {file && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              已上传: {file.name}
            </div>
          )}
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="请输入要分析的文本内容，或上传TXT文件..."
            className="w-full h-40 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          
          {error && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          <button
            onClick={analyzeKeywords}
            disabled={isAnalyzing || !text.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <BarChart3 className="w-5 h-5" />
                开始分析
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Results Section */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {result.totalWords}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">总词数</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {result.uniqueWords}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">唯一词汇</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Network className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {result.keywords.length}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">关键词</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Tabs */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700">
              <div className="flex space-x-1 p-1">
                {[
                  { id: 'chart', label: '词频图表', icon: BarChart3 },
                  { id: 'cloud', label: '词云图', icon: Cloud },
                  { id: 'graph', label: '知识图谱', icon: Network },
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
                <div className="ml-auto">
                  <button
                    onClick={exportResults}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    导出
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'chart' && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.keywords.slice(0, 15)}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="word" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        className="text-xs"
                      />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Bar dataKey="count" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {activeTab === 'cloud' && <WordCloud keywords={result.keywords} />}

              {activeTab === 'graph' && <KnowledgeGraph keywords={result.keywords} />}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
              分析总结
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Teaching Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">
              💡 教学建议
            </h3>
            <div className="space-y-2 text-blue-700 dark:text-blue-300">
              <p>• <strong>BOPPPS-Bridge:</strong> 使用高频关键词作为课程导入，激发学生兴趣</p>
              <p>• <strong>墨子四疑法:</strong> 围绕核心关键词设计疑问，引导深度思考</p>
              <p>• <strong>互动设计:</strong> 点击关键词可跳转相关模块，增强学习体验</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}