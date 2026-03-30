import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Filter, ChevronDown, ChevronUp } from 'lucide-react'

function TaskList() {
  // 模拟任务数据
  const [tasks, setTasks] = useState([
    { id: 1, title: '完成用户管理模块开发', priority: '高', status: '进行中', dueDate: '2026-04-10', assignee: '张三' },
    { id: 2, title: '修复登录页面bug', priority: '中', status: '待处理', dueDate: '2026-04-05', assignee: '李四' },
    { id: 3, title: '编写API文档', priority: '低', status: '已完成', dueDate: '2026-04-01', assignee: '王五' },
    { id: 4, title: '测试支付功能', priority: '中', status: '待处理', dueDate: '2026-04-15', assignee: '赵六' },
    { id: 5, title: '优化首页加载速度', priority: '高', status: '进行中', dueDate: '2026-04-08', assignee: '孙七' }
  ])

  // 筛选状态
  const [filters, setFilters] = useState({
    status: '全部',
    priority: '全部',
    dueDate: ''
  })

  // 统计数据
  const stats = {
    total: tasks.length,
    pending: tasks.filter(task => task.status === '待处理').length,
    inProgress: tasks.filter(task => task.status === '进行中').length,
    completed: tasks.filter(task => task.status === '已完成').length
  }

  // 处理筛选变化
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // 过滤任务
  const filteredTasks = tasks.filter(task => {
    if (filters.status !== '全部' && task.status !== filters.status) return false
    if (filters.priority !== '全部' && task.priority !== filters.priority) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* 页面标题和操作区 */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">任务中心</h2>
        <Link to="/create">
          <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            <span>创建任务</span>
          </button>
        </Link>
      </div>

      {/* 任务统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-sm text-dark">总任务数</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
          <div className="text-sm text-dark">待处理</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="text-2xl font-bold text-secondary">{stats.inProgress}</div>
          <div className="text-sm text-dark">进行中</div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm">
          <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
          <div className="text-sm text-dark">已完成</div>
        </div>
      </div>

      {/* 筛选区 */}
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            筛选条件
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">状态</label>
            <select 
              className="w-full border border-medium rounded-md px-3 py-2"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="全部">全部</option>
              <option value="待处理">待处理</option>
              <option value="进行中">进行中</option>
              <option value="已完成">已完成</option>
              <option value="已取消">已取消</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">优先级</label>
            <select 
              className="w-full border border-medium rounded-md px-3 py-2"
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="全部">全部</option>
              <option value="高">高</option>
              <option value="中">中</option>
              <option value="低">低</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">截止日期</label>
            <input 
              type="date" 
              className="w-full border border-medium rounded-md px-3 py-2"
              value={filters.dueDate}
              onChange={(e) => handleFilterChange('dueDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  任务标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  优先级
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  截止日期
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  负责人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-medium">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-light/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/task/${task.id}`} className="text-secondary hover:underline">
                      {task.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${task.priority === '高' ? 'bg-red-100 text-red-800' : task.priority === '中' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${task.status === '待处理' ? 'bg-yellow-100 text-yellow-800' : task.status === '进行中' ? 'bg-blue-100 text-blue-800' : task.status === '已完成' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                    {task.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-dark">
                    {task.assignee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to={`/task/${task.id}`} className="text-secondary hover:underline mr-3">
                      查看
                    </Link>
                    <Link to={`/task/${task.id}/edit`} className="text-secondary hover:underline">
                      编辑
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页控件 */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-medium">
          <div className="text-sm text-dark">
            显示 1 到 {filteredTasks.length} 条，共 {tasks.length} 条
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-medium rounded-md text-dark hover:bg-light disabled:opacity-50" disabled>
              上一页
            </button>
            <button className="px-3 py-1 border border-medium rounded-md bg-primary text-white">
              1
            </button>
            <button className="px-3 py-1 border border-medium rounded-md text-dark hover:bg-light disabled:opacity-50" disabled>
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* 右侧边栏：快速操作区 */}
      <div className="hidden lg:block fixed right-6 top-24 w-64 bg-white p-4 rounded-md shadow-sm">
        <h3 className="font-medium mb-4">快速操作</h3>
        <Link to="/create">
          <button className="w-full flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 mb-4">
            <Plus className="w-4 h-4" />
            <span>创建任务</span>
          </button>
        </Link>
        <h4 className="text-sm font-medium mb-2">最近任务</h4>
        <ul className="space-y-2">
          {tasks.slice(0, 3).map(task => (
            <li key={task.id} className="text-sm">
              <Link to={`/task/${task.id}`} className="hover:underline text-secondary">
                {task.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TaskList