import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Paperclip, Send, MoreVertical } from 'lucide-react'

function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // 模拟任务数据
  const [task] = useState({
    id: parseInt(id),
    title: '完成用户管理模块开发',
    description: '开发用户管理模块，包括用户注册、登录、权限管理等功能。需要使用 React 和 Ant Design 实现，确保界面美观、功能完整。',
    priority: '高',
    status: '进行中',
    dueDate: '2026-04-10',
    createdAt: '2026-03-20',
    createdBy: '管理员',
    assignee: '张三',
    attachments: [
      { id: 1, name: '用户管理模块需求文档.pdf', size: '2.5 MB', uploadedBy: '管理员', uploadedAt: '2026-03-20' },
      { id: 2, name: '用户管理模块设计稿.png', size: '1.8 MB', uploadedBy: '设计师', uploadedAt: '2026-03-21' }
    ],
    comments: [
      { id: 1, content: '我已经开始开发用户注册功能，预计明天完成。', author: '张三', createdAt: '2026-03-22' },
      { id: 2, content: '设计稿已经更新，请查看附件。', author: '设计师', createdAt: '2026-03-23' }
    ]
  })

  // 评论状态
  const [newComment, setNewComment] = useState('')
  const [status, setStatus] = useState(task.status)

  // 处理评论提交
  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (newComment.trim()) {
      // 这里可以添加评论提交逻辑
      setNewComment('')
    }
  }

  // 处理状态更新
  const handleStatusChange = (e) => {
    setStatus(e.target.value)
    // 这里可以添加状态更新逻辑
  }

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
        <h2 className="text-2xl font-bold">任务详情</h2>
      </div>

      {/* 任务信息卡片 */}
      <div className="bg-white p-6 rounded-md shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">{task.title}</h3>
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-2 py-1 text-xs rounded-full ${task.priority === '高' ? 'bg-red-100 text-red-800' : task.priority === '中' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {task.priority}
              </span>
              <select 
                className="border border-medium rounded-md px-2 py-1 text-sm"
                value={status}
                onChange={handleStatusChange}
              >
                <option value="待处理">待处理</option>
                <option value="进行中">进行中</option>
                <option value="已完成">已完成</option>
                <option value="已取消">已取消</option>
              </select>
            </div>
            <p className="text-dark mb-4">{task.description}</p>
          </div>
          <div className="flex space-x-2">
            <button className="p-2 rounded-md hover:bg-light">
              <Edit className="w-5 h-5 text-secondary" />
            </button>
            <button className="p-2 rounded-md hover:bg-light">
              <Trash2 className="w-5 h-5 text-red-500" />
            </button>
            <button className="p-2 rounded-md hover:bg-light">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-medium pt-4">
          <div>
            <div className="text-sm text-dark mb-1">截止日期</div>
            <div className="font-medium">{task.dueDate}</div>
          </div>
          <div>
            <div className="text-sm text-dark mb-1">创建时间</div>
            <div className="font-medium">{task.createdAt}</div>
          </div>
          <div>
            <div className="text-sm text-dark mb-1">创建人</div>
            <div className="font-medium">{task.createdBy}</div>
          </div>
          <div>
            <div className="text-sm text-dark mb-1">负责人</div>
            <div className="font-medium">{task.assignee}</div>
          </div>
        </div>
      </div>

      {/* 评论区 */}
      <div className="bg-white p-6 rounded-md shadow-sm">
        <h3 className="text-lg font-medium mb-4">评论</h3>
        <div className="space-y-4 mb-6">
          {task.comments.map(comment => (
            <div key={comment.id} className="border-b border-medium pb-4">
              <div className="flex justify-between mb-2">
                <div className="font-medium">{comment.author}</div>
                <div className="text-sm text-dark">{comment.createdAt}</div>
              </div>
              <div className="text-dark">{comment.content}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleCommentSubmit} className="flex space-x-2">
          <input 
            type="text" 
            className="flex-1 border border-medium rounded-md px-3 py-2"
            placeholder="添加评论..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button 
            type="submit" 
            className="bg-primary text-white p-2 rounded-md hover:bg-primary/90"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* 附件区 */}
      <div className="bg-white p-6 rounded-md shadow-sm">
        <h3 className="text-lg font-medium mb-4">附件</h3>
        <div className="space-y-3">
          {task.attachments.map(attachment => (
            <div key={attachment.id} className="flex items-center justify-between p-3 border border-medium rounded-md">
              <div className="flex items-center space-x-3">
                <Paperclip className="w-5 h-5 text-secondary" />
                <div>
                  <div className="font-medium">{attachment.name}</div>
                  <div className="text-sm text-dark">{attachment.size} · {attachment.uploadedBy} · {attachment.uploadedAt}</div>
                </div>
              </div>
              <button className="text-secondary hover:underline">
                下载
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button className="flex items-center space-x-2 text-secondary hover:underline">
            <Paperclip className="w-4 h-4" />
            <span>上传附件</span>
          </button>
        </div>
      </div>

      {/* 操作区 */}
      <div className="bg-white p-6 rounded-md shadow-sm flex justify-end space-x-4">
        <button className="px-4 py-2 border border-medium rounded-md text-dark hover:bg-light">
          取消
        </button>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          保存更改
        </button>
      </div>
    </div>
  )
}

export default TaskDetail