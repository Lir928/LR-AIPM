import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'

function TaskStats() {
  const navigate = useNavigate()

  // 筛选状态
  const [filters, setFilters] = useState({
    timeRange: '最近30天',
    team: '全部',
    user: '全部'
  })

  // 处理筛选变化
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // 模拟统计数据
  const stats = {
    total: 100,
    completed: 60,
    inProgress: 25,
    pending: 15,
    cancelled: 0,
    averageCompletionTime: 2.5
  }

  // 饼图数据
  const pieData = [
    { name: '已完成', value: stats.completed, fill: '#10b981' },
    { name: '进行中', value: stats.inProgress, fill: '#3b82f6' },
    { name: '待处理', value: stats.pending, fill: '#f59e0b' },
    { name: '已取消', value: stats.cancelled, fill: '#6b7280' }
  ]

  // 柱状图数据
  const barData = [
    { name: '周一', 已完成: 12, 进行中: 8, 待处理: 5 },
    { name: '周二', 已完成: 15, 进行中: 6, 待处理: 4 },
    { name: '周三', 已完成: 10, 进行中: 10, 待处理: 6 },
    { name: '周四', 已完成: 18, 进行中: 5, 待处理: 3 },
    { name: '周五', 已完成: 20, 进行中: 4, 待处理: 2 },
    { name: '周六', 已完成: 5, 进行中: 2, 待处理: 1 },
    { name: '周日', 已完成: 3, 进行中: 1, 待处理: 0 }
  ]

  // 折线图数据
  const lineData = [
    { name: '1月', 完成率: 45 },
    { name: '2月', 完成率: 52 },
    { name: '3月', 完成率: 60 },
    { name: '4月', 完成率: 65 },
    { name: '5月', 完成率: 70 },
    { name: '6月', 完成率: 75 }
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题和操作区 */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-secondary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回任务列表</span>
        </button>
        <h2 className="text-2xl font-bold">任务统计</h2>
      </div>

      {/* 筛选区 */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">时间范围</label>
            <select 
              className="w-full border border-medium rounded-md px-3 py-2"
              value={filters.timeRange}
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
            >
              <option value="最近7天">最近7天</option>
              <option value="最近30天">最近30天</option>
              <option value="最近90天">最近90天</option>
              <option value="今年">今年</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">团队</label>
            <select 
              className="w-full border border-medium rounded-md px-3 py-2"
              value={filters.team}
              onChange={(e) => handleFilterChange('team', e.target.value)}
            >
              <option value="全部">全部</option>
              <option value="产品部">产品部</option>
              <option value="技术部">技术部</option>
              <option value="设计部">设计部</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">用户</label>
            <select 
              className="w-full border border-medium rounded-md px-3 py-2"
              value={filters.user}
              onChange={(e) => handleFilterChange('user', e.target.value)}
            >
              <option value="全部">全部</option>
              <option value="张三">张三</option>
              <option value="李四">李四</option>
              <option value="王五">王五</option>
              <option value="赵六">赵六</option>
              <option value="孙七">孙七</option>
            </select>
          </div>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-dark">总任务数</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
          <div className="text-sm text-dark">已完成</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="text-2xl font-bold text-secondary">{stats.inProgress}</div>
          <div className="text-sm text-dark">进行中</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
          <div className="text-sm text-dark">待处理</div>
        </div>
      </div>

      {/* 图表区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 任务状态分布 */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-medium mb-4">任务状态分布</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 每日任务完成情况 */}
        <div className="bg-white p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-medium mb-4">每日任务完成情况</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="已完成" fill="#10b981" />
                <Bar dataKey="进行中" fill="#3b82f6" />
                <Bar dataKey="待处理" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 任务完成率趋势 */}
        <div className="bg-white p-4 rounded-md shadow-sm md:col-span-2">
          <h3 className="text-lg font-medium mb-4">任务完成率趋势</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="完成率" stroke="#10b981" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 数据表格 */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="p-4 border-b border-medium">
          <h3 className="text-lg font-medium">详细统计数据</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  团队
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  总任务数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  已完成
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  完成率
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  平均完成时间（天）
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-medium">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  产品部
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  30
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  20
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  66.7%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  2.0
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  技术部
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  50
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  30
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  60.0%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  2.5
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  设计部
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  20
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  10
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  50.0%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  3.0
                </td>
              </tr>
              <tr className="bg-light">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  总计
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  100
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  60
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  60.0%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                  2.5
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TaskStats