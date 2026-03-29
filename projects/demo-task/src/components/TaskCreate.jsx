import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Paperclip } from 'lucide-react'

function TaskCreate() {
  const navigate = useNavigate()

  // 表单状态
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '中',
    dueDate: '',
    assignee: ''
  })

  // 处理表单变化
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // 处理表单提交
  const handleSubmit = (e) => {
    e.preventDefault()
    // 这里可以添加表单提交逻辑
    console.log('表单提交:', formData)
    navigate('/')
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
        <h2 className="text-2xl font-bold">创建任务</h2>
      </div>

      {/* 表单区 */}
      <div className="bg-white p-6 rounded-md shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">任务标题 *</label>
            <input 
              type="text" 
              name="title" 
              className="w-full border border-medium rounded-md px-3 py-2"
              placeholder="请输入任务标题"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">任务描述</label>
            <textarea 
              name="description" 
              className="w-full border border-medium rounded-md px-3 py-2"
              placeholder="请输入任务描述"
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">优先级</label>
              <select 
                name="priority" 
                className="w-full border border-medium rounded-md px-3 py-2"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">截止日期</label>
              <input 
                type="date" 
                name="dueDate" 
                className="w-full border border-medium rounded-md px-3 py-2"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">负责人</label>
              <input 
                type="text" 
                name="assignee" 
                className="w-full border border-medium rounded-md px-3 py-2"
                placeholder="请输入负责人"
                value={formData.assignee}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* 附件上传区 */}
          <div>
            <label className="block text-sm font-medium mb-1">附件</label>
            <div className="border-2 border-dashed border-medium rounded-md p-6 text-center">
              <div className="flex flex-col items-center">
                <Paperclip className="w-8 h-8 text-secondary mb-2" />
                <p className="text-dark mb-2">拖拽文件到此处或点击上传</p>
                <p className="text-sm text-dark mb-4">支持 PDF、Word、Excel、图片等格式</p>
                <button 
                  type="button" 
                  className="flex items-center space-x-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/90"
                >
                  <Plus className="w-4 h-4" />
                  <span>选择文件</span>
                </button>
              </div>
            </div>
          </div>

          {/* 操作区 */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-medium">
            <button 
              type="button" 
              className="px-4 py-2 border border-medium rounded-md text-dark hover:bg-light"
              onClick={() => navigate(-1)}
            >
              取消
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskCreate