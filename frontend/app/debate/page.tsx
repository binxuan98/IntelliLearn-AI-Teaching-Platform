'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  GraduationCap, 
  UserCheck,
  Play,
  Pause,
  RotateCcw,
  Star,
  MessageCircle,
  Clock,
  Award,
  TrendingUp,
  FileText,
  Loader2
} from 'lucide-react'

interface Judge {
  id: string
  name: string
  role: string
  avatar: string
  description: string
  icon: any
}

interface Question {
  id: string
  judgeId: string
  question: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
}

interface Score {
  expression: number
  content: number
  interaction: number
  innovation: number
}

interface DebateResult {
  totalScore: number
  scores: Score
  feedback: string
  suggestions: string[]
  recommendations: string[]
}

const judges: Judge[] = [
  {
    id: 'expert',
    name: '专家评委',
    role: '学术专家',
    avatar: '👨‍🏫',
    description: '资深学者，注重学术严谨性和创新性',
    icon: GraduationCap
  },
  {
    id: 'student',
    name: '学生代表',
    role: '同龄人视角',
    avatar: '👩‍🎓',
    description: '关注表达清晰度和互动效果',
    icon: Users
  },
  {
    id: 'teacher',
    name: '教师同行',
    role: '教学专家',
    avatar: '👨‍💼',
    description: '重视教学方法和实践应用',
    icon: UserCheck
  }
]

export default function DebatePage() {
  const [selectedJudge, setSelectedJudge] = useState<Judge>(judges[0])
  const [isDebating, setIsDebating] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [debateHistory, setDebateHistory] = useState<any[]>([])
  const [result, setResult] = useState<DebateResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const startDebate = async () => {
    setIsDebating(true)
    setIsLoading(true)
    setTimer(0)
    setIsTimerRunning(true)
    
    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          topic: '请开始答辩',
          answer: '开始答辩',
          judges: [selectedJudge.id]
        }),
      })
      
      const data = await response.json()
      // 生成第一个问题
      const firstQuestion = {
        id: '1',
        judgeId: selectedJudge.id,
        question: `请简要介绍您的研究主题，并说明其重要性和创新点。`,
        difficulty: 'medium' as const,
        category: '开场介绍'
      }
      setCurrentQuestion(firstQuestion)
    } catch (error) {
      console.error('Failed to start debate:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return
    
    setIsLoading(true)
    
    const newEntry = {
      question: currentQuestion.question,
      answer: userAnswer,
      judge: selectedJudge.name,
      timestamp: new Date().toLocaleTimeString()
    }
    
    setDebateHistory([...debateHistory, newEntry])
    
    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: currentQuestion.question,
          answer: userAnswer,
          judges: [selectedJudge.id],
          currentQuestion: currentQuestion
        }),
      })
      
      const data = await response.json()
      
      // 转换后端返回的数据格式
      const debateResult: DebateResult = {
        totalScore: data.overallScore,
        scores: {
          expression: data.evaluations[0]?.scores.expression || 80,
          content: data.evaluations[0]?.scores.content || 80,
          interaction: data.evaluations[0]?.scores.interaction || 80,
          innovation: data.evaluations[0]?.scores.innovation || 80
        },
        feedback: data.evaluations[0]?.feedback || '答辩表现良好',
        suggestions: data.improvements || [],
        recommendations: data.recommendations?.map((r: any) => r.title) || []
      }
      
      // 判断是否完成答辩（这里简化为3轮问答后结束）
      if (debateHistory.length >= 2) {
        setResult(debateResult)
        setIsDebating(false)
        setIsTimerRunning(false)
      } else {
        // 生成下一个问题
        const nextQuestions = [
          '请详细阐述您的研究方法和技术路线。',
          '您的研究成果有哪些实际应用价值？',
          '在研究过程中遇到了哪些挑战，是如何解决的？'
        ]
        const nextQuestion = {
          id: (debateHistory.length + 2).toString(),
          judgeId: selectedJudge.id,
          question: nextQuestions[debateHistory.length] || '请总结您的研究贡献。',
          difficulty: 'medium' as const,
          category: '深入讨论'
        }
        setCurrentQuestion(nextQuestion)
      }
    } catch (error) {
      console.error('Failed to submit answer:', error)
    } finally {
      setIsLoading(false)
      setUserAnswer('')
    }
  }

  const resetDebate = () => {
    setIsDebating(false)
    setCurrentQuestion(null)
    setUserAnswer('')
    setDebateHistory([])
    setResult(null)
    setTimer(0)
    setIsTimerRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const ScoreCard = ({ label, score, maxScore = 100 }: { label: string, score: number, maxScore?: number }) => {
    const percentage = (score / maxScore) * 100
    return (
      <div className="bg-white dark:bg-slate-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
          <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{score}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          AI模拟答辩系统
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          多角色AI评委模拟真实答辩场景，提供专业评分和改进建议
        </p>
      </motion.div>

      {/* Judge Selection */}
      {!isDebating && !result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
        >
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
            选择评委角色
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {judges.map((judge) => {
              const Icon = judge.icon
              return (
                <motion.div
                  key={judge.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedJudge(judge)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedJudge.id === judge.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{judge.avatar}</div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      {judge.name}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                      {judge.role}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {judge.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={startDebate}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all flex items-center gap-2 mx-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  准备中...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  开始答辩
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Debate Interface */}
      {isDebating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Status Bar */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">{selectedJudge.avatar}</div>
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedJudge.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {selectedJudge.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono">{formatTime(timer)}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={resetDebate}
                  className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Current Question */}
          {currentQuestion && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl">{selectedJudge.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedJudge.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {currentQuestion.difficulty === 'easy' ? '简单' : 
                       currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs">
                      {currentQuestion.category}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="请输入您的回答..."
                  className="w-full h-32 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                
                <button
                  onClick={submitAnswer}
                  disabled={isLoading || !userAnswer.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      评估中...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      提交回答
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Debate History */}
          {debateHistory.length > 0 && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                答辩记录
              </h3>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {debateHistory.map((entry, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {entry.judge}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {entry.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <strong>问题:</strong> {entry.question}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      <strong>回答:</strong> {entry.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white text-center">
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">答辩完成</h2>
            <p className="text-xl mb-4">总分: {result.totalScore}/100</p>
            <div className="text-lg">
              {result.totalScore >= 90 ? '优秀' :
               result.totalScore >= 80 ? '良好' :
               result.totalScore >= 70 ? '中等' :
               result.totalScore >= 60 ? '及格' : '需要改进'}
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
              详细评分
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <ScoreCard label="表达能力" score={result.scores.expression} />
              <ScoreCard label="内容质量" score={result.scores.content} />
              <ScoreCard label="互动效果" score={result.scores.interaction} />
              <ScoreCard label="创新思维" score={result.scores.innovation} />
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              评委反馈
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              {result.feedback}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  改进建议
                </h4>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  推荐学习
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
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <button
              onClick={resetDebate}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              重新答辩
            </button>
          </div>

          {/* Teaching Tips */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
              💡 教学建议
            </h3>
            <div className="space-y-2 text-green-700 dark:text-green-300">
              <p>• <strong>BOPPPS-Post-assessment:</strong> 答辩结果可作为课程后测评估依据</p>
              <p>• <strong>墨子四疑法:</strong> 利用AI提问培养学生批判性思维</p>
              <p>• <strong>个性化指导:</strong> 根据评分结果制定针对性改进计划</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}