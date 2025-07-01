'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  Users,
  Brain,
  Target,
  TrendingUp,
  Award,
  AlertTriangle,
  BookOpen,
  Shield,
  Network,
  Settings,
  Zap,
  Star
} from 'lucide-react';

const LearningAnalysisPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkMode);
  }, []);

  // 知识技能基础数据
  const knowledgeSkillsData = [
    { name: '网络基础配置', mastery: 78, students: 16 },
    { name: '复杂网络拓扑设计', mastery: 45, students: 9 },
    { name: '防火墙策略配置', mastery: 38, students: 8 },
    { name: 'VLAN划分技术', mastery: 38, students: 8 },
    { name: '入侵防御规则', mastery: 38, students: 8 }
  ];

  // 认知实践能力数据
  const cognitiveAbilityData = [
    { subject: '网络设备基础操作', score: 75.6, fullMark: 100 },
    { subject: '网络架构规划', score: 68.3, fullMark: 100 },
    { subject: '网络安全漏洞分析', score: 59.2, fullMark: 100 },
    { subject: '应急响应处置', score: 61.5, fullMark: 100 },
    { subject: '故障诊断修复', score: 55.8, fullMark: 100 }
  ];

  // 学习兴趣分布
  const learningInterestData = [
    { name: '网络攻防技术', value: 85, color: '#8884d8' },
    { name: '虚拟化技术', value: 78, color: '#82ca9d' },
    { name: '小组协作项目', value: 82, color: '#ffc658' },
    { name: '仿真实验', value: 75, color: '#ff7300' },
    { name: '理论学习', value: 45, color: '#8dd1e1' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 print:bg-white">
      <div className="max-w-full mx-auto p-4 space-y-4 print:space-y-2 print:p-2">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 print:mb-3"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 print:text-2xl">
            智慧养殖场网络部署项目学情分析
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 print:text-base">
            24级计算机网络技术1班 · 21人 · AI智教大模型数据分析
          </p>
        </motion.div>

        {/* 班级概况 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700 print:shadow-none print:border print:border-gray-300"
        >
          <div className="grid grid-cols-4 gap-4 print:gap-2">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-blue-600 mr-2" />
                <span className="text-2xl font-bold text-gray-800 dark:text-white print:text-xl">21</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">总人数</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Brain className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-2xl font-bold text-gray-800 dark:text-white print:text-xl">75.6</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">平均能力分</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-purple-600 mr-2" />
                <span className="text-2xl font-bold text-gray-800 dark:text-white print:text-xl">78%</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">基础掌握率</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-orange-600 mr-2" />
                <span className="text-2xl font-bold text-gray-800 dark:text-white print:text-xl">+12%</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">月度提升</p>
            </div>
          </div>
        </motion.div>

        {/* 三个正方形区域布局 */}
        <div className="grid grid-cols-3 gap-6 print:gap-4">
          {/* 知识与技能基础 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 print:shadow-none print:border print:border-gray-300 aspect-square flex flex-col"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 text-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
              知识与技能基础
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={knowledgeSkillsData} margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    label={{ value: '掌握率(%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, '掌握率']}
                    labelFormatter={(label) => `技能: ${label}`}
                  />
                  <Bar dataKey="mastery" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                    {knowledgeSkillsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.mastery >= 70 ? '#10B981' : entry.mastery >= 50 ? '#F59E0B' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
                  <span className="font-medium text-green-800 dark:text-green-300">优秀(≥70%)</span>
                  <div className="text-green-600 dark:text-green-400">网络基础配置 78%</div>
                </div>
                <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
                  <span className="font-medium text-red-800 dark:text-red-300">待提升(&lt;50%)</span>
                  <div className="text-red-600 dark:text-red-400">复杂拓扑设计 45%</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 认知与实践能力 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 print:shadow-none print:border print:border-gray-300 aspect-square flex flex-col"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 text-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
              认知与实践能力
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={cognitiveAbilityData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar
                    name="能力得分"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    strokeWidth={3}
                  />
                  <Tooltip formatter={(value) => [`${value}分`, '能力得分']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="grid grid-cols-1 gap-1 text-xs">
                <div className="flex justify-between bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  <span className="text-blue-800 dark:text-blue-300">设备操作</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">75.6分</span>
                </div>
                <div className="flex justify-between bg-green-50 dark:bg-green-900/20 p-2 rounded">
                  <span className="text-green-800 dark:text-green-300">架构规划</span>
                  <span className="font-bold text-green-600 dark:text-green-400">68.3分</span>
                </div>
                <div className="flex justify-between bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                  <span className="text-orange-800 dark:text-orange-300">安全分析</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">59.2分</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 学习特点 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700 print:shadow-none print:border print:border-gray-300 aspect-square flex flex-col"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2 text-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
              学习特点
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={learningInterestData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${value}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {learningInterestData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <div className="space-y-2 text-xs">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded border-l-4 border-purple-500">
                  <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-1">学习偏好</h4>
                  <p className="text-purple-600 dark:text-purple-400">网络攻防85%、虚拟化78%、小组协作82%</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded border-l-4 border-amber-500">
                  <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-1">三待加强</h4>
                  <p className="text-amber-600 dark:text-amber-400">安全预判、自主钻研、攻坚韧性</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 打印样式 */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}</style>
    </div>
  );
};

export default LearningAnalysisPage;