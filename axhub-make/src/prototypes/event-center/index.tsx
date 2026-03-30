import React, { useState } from 'react';
import './styles.css';

// 模拟事件数据
const events = [
  {
    id: '1',
    title: '系统故障',
    description: '服务器CPU使用率过高，导致系统响应缓慢',
    type: '系统故障',
    priority: '高',
    status: '处理中',
    created_at: '2026-03-28 10:00:00',
    assignee: '张三'
  },
  {
    id: '2',
    title: '用户反馈',
    description: '用户反映无法登录系统',
    type: '用户反馈',
    priority: '中',
    status: '已解决',
    created_at: '2026-03-27 15:30:00',
    assignee: '李四'
  },
  {
    id: '3',
    title: '功能需求',
    description: '用户希望增加批量操作功能',
    type: '功能需求',
    priority: '低',
    status: '待审核',
    created_at: '2026-03-26 09:15:00',
    assignee: '王五'
  }
];

// 统计数据
const stats = {
  total: 100,
  pending: 25,
  processing: 35,
  resolved: 30,
  closed: 10
};

// 事件类型分布
const typeDistribution = [
  { name: '系统故障', value: 30 },
  { name: '用户反馈', value: 40 },
  { name: '功能需求', value: 20 },
  { name: '其他', value: 10 }
];

// 近7天事件趋势
const trendData = [
  { date: '3月22日', count: 12 },
  { date: '3月23日', count: 15 },
  { date: '3月24日', count: 10 },
  { date: '3月25日', count: 18 },
  { date: '3月26日', count: 14 },
  { date: '3月27日', count: 16 },
  { date: '3月28日', count: 15 }
];

// 通知规则
const notificationRules = [
  {
    id: '1',
    name: '高优先级事件通知',
    event_type: '所有类型',
    priority: '高',
    notification_method: '邮件 + 短信',
    recipients: '管理员, 技术总监'
  },
  {
    id: '2',
    name: '系统故障通知',
    event_type: '系统故障',
    priority: '中',
    notification_method: '邮件',
    recipients: '技术团队'
  }
];

const EventCenter: React.FC = () => {
  const [activePage, setActivePage] = useState('list');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: '系统故障',
    priority: '中',
    assignee: ''
  });

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setActivePage('detail');
  };

  const handleCreateEvent = () => {
    setActivePage('create');
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟提交
    alert('事件创建成功！');
    setActivePage('list');
    setNewEvent({ title: '', description: '', type: '系统故障', priority: '中', assignee: '' });
  };

  const handleEditEvent = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (window.confirm('确定要删除此事件吗？')) {
      alert('事件已删除！');
      setActivePage('list');
      setSelectedEvent(null);
    }
  };

  const handleCloseEvent = () => {
    if (selectedEvent) {
      alert('事件已关闭！');
      setActivePage('list');
      setSelectedEvent(null);
    }
  };

  return (
    <div className="event-center">
      {/* 左侧导航栏 */}
      <nav className="sidebar">
        <div className="logo">
          <h2>事件中心</h2>
        </div>
        <ul>
          <li className={activePage === 'list' ? 'active' : ''} onClick={() => setActivePage('list')}>
            <span className="icon">📋</span>
            <span>事件列表</span>
          </li>
          <li className={activePage === 'create' ? 'active' : ''} onClick={handleCreateEvent}>
            <span className="icon">➕</span>
            <span>创建事件</span>
          </li>
          <li className={activePage === 'analytics' ? 'active' : ''} onClick={() => setActivePage('analytics')}>
            <span className="icon">📊</span>
            <span>事件分析</span>
          </li>
          <li className={activePage === 'notifications' ? 'active' : ''} onClick={() => setActivePage('notifications')}>
            <span className="icon">🔔</span>
            <span>通知设置</span>
          </li>
        </ul>
      </nav>

      {/* 主内容区域 */}
      <main className="content">
        {/* 事件列表页 */}
        {activePage === 'list' && (
          <div className="event-list">
            <div className="header">
              <h1>事件列表</h1>
              <button className="primary-button" onClick={handleCreateEvent}>创建事件</button>
            </div>

            {/* 筛选栏 */}
            <div className="filter-bar">
              <select className="filter-select">
                <option>所有类型</option>
                <option>系统故障</option>
                <option>用户反馈</option>
                <option>功能需求</option>
              </select>
              <select className="filter-select">
                <option>所有状态</option>
                <option>待审核</option>
                <option>处理中</option>
                <option>已解决</option>
                <option>已关闭</option>
              </select>
              <input type="text" placeholder="搜索事件..." className="search-input" />
              <button className="secondary-button">筛选</button>
            </div>

            {/* 事件表格 */}
            <table className="event-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>标题</th>
                  <th>类型</th>
                  <th>优先级</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>负责人</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id}>
                    <td><input type="checkbox" /></td>
                    <td className="event-title" onClick={() => handleEventClick(event)}>{event.title}</td>
                    <td>{event.type}</td>
                    <td className={`priority-${event.priority}`}>{event.priority}</td>
                    <td className={`status-${event.status}`}>{event.status}</td>
                    <td>{event.created_at}</td>
                    <td>{event.assignee}</td>
                    <td>
                      <button className="action-button view" onClick={() => handleEventClick(event)}>查看</button>
                      <button className="action-button edit">编辑</button>
                      <button className="action-button delete">删除</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 分页 */}
            <div className="pagination">
              <button className="pagination-button">上一页</button>
              <button className="pagination-button active">1</button>
              <button className="pagination-button">2</button>
              <button className="pagination-button">3</button>
              <button className="pagination-button">下一页</button>
            </div>
          </div>
        )}

        {/* 事件详情页 */}
        {activePage === 'detail' && selectedEvent && (
          <div className="event-detail">
            <div className="header">
              <h1>{selectedEvent.title}</h1>
              <div className="action-buttons">
                <button className="secondary-button" onClick={handleEditEvent}>编辑</button>
                <button className="danger-button" onClick={handleDeleteEvent}>删除</button>
                <button className="primary-button" onClick={handleCloseEvent}>关闭事件</button>
              </div>
            </div>

            {/* 基本信息卡片 */}
            <div className="info-card">
              <h2>基本信息</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>类型：</label>
                  <span>{selectedEvent.type}</span>
                </div>
                <div className="info-item">
                  <label>优先级：</label>
                  <span className={`priority-${selectedEvent.priority}`}>{selectedEvent.priority}</span>
                </div>
                <div className="info-item">
                  <label>状态：</label>
                  <span className={`status-${selectedEvent.status}`}>{selectedEvent.status}</span>
                </div>
                <div className="info-item">
                  <label>创建时间：</label>
                  <span>{selectedEvent.created_at}</span>
                </div>
                <div className="info-item">
                  <label>负责人：</label>
                  <span>{selectedEvent.assignee}</span>
                </div>
              </div>
              <div className="description">
                <label>描述：</label>
                <p>{selectedEvent.description}</p>
              </div>
            </div>

            {/* 历史记录 */}
            <div className="history-card">
              <h2>历史记录</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-time">2026-03-28 10:00:00</div>
                    <div className="timeline-action">事件创建</div>
                    <div className="timeline-user">张三</div>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-time">2026-03-28 10:30:00</div>
                    <div className="timeline-action">状态变更为处理中</div>
                    <div className="timeline-user">李四</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 评论区 */}
            <div className="comments-card">
              <h2>评论</h2>
              <div className="comment-input">
                <textarea placeholder="添加评论..."></textarea>
                <button className="primary-button">提交</button>
              </div>
              <div className="comments-list">
                <div className="comment-item">
                  <div className="comment-user">李四</div>
                  <div className="comment-time">2026-03-28 11:00:00</div>
                  <div className="comment-content">已开始处理，预计2小时内解决</div>
                </div>
                <div className="comment-item">
                  <div className="comment-user">张三</div>
                  <div className="comment-time">2026-03-28 11:30:00</div>
                  <div className="comment-content">好的，谢谢</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 事件创建页 */}
        {activePage === 'create' && (
          <div className="event-create">
            <div className="header">
              <h1>创建事件</h1>
              <button className="secondary-button" onClick={() => setActivePage('list')}>取消</button>
            </div>

            <form onSubmit={handleSubmitEvent} className="event-form">
              <div className="form-group">
                <label>标题</label>
                <input 
                  type="text" 
                  value={newEvent.title} 
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>描述</label>
                <textarea 
                  value={newEvent.description} 
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})} 
                  required 
                ></textarea>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>类型</label>
                  <select 
                    value={newEvent.type} 
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})} 
                  >
                    <option>系统故障</option>
                    <option>用户反馈</option>
                    <option>功能需求</option>
                    <option>其他</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>优先级</label>
                  <select 
                    value={newEvent.priority} 
                    onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})} 
                  >
                    <option>低</option>
                    <option>中</option>
                    <option>高</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>负责人</label>
                  <input 
                    type="text" 
                    value={newEvent.assignee} 
                    onChange={(e) => setNewEvent({...newEvent, assignee: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>附件</label>
                <div className="upload-area">
                  <p>拖拽文件到此处或点击上传</p>
                  <input type="file" multiple />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="primary-button">创建事件</button>
                <button type="button" className="secondary-button" onClick={() => setActivePage('list')}>取消</button>
              </div>
            </form>
          </div>
        )}

        {/* 事件分析页 */}
        {activePage === 'analytics' && (
          <div className="event-analytics">
            <div className="header">
              <h1>事件分析</h1>
              <div className="date-range">
                <input type="date" />
                <span>至</span>
                <input type="date" />
                <button className="primary-button">导出</button>
              </div>
            </div>

            {/* 统计卡片 */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">事件总数</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.pending}</div>
                <div className="stat-label">待处理</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.processing}</div>
                <div className="stat-label">处理中</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.resolved}</div>
                <div className="stat-label">已解决</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.closed}</div>
                <div className="stat-label">已关闭</div>
              </div>
            </div>

            {/* 图表区域 */}
            <div className="charts-area">
              <div className="chart-card">
                <h3>事件类型分布</h3>
                <div className="chart-container">
                  {/* 简单饼图模拟 */}
                  <div className="pie-chart">
                    <div className="pie-slice" style={{background: '#1E88E5', width: '30%'}}>30%</div>
                    <div className="pie-slice" style={{background: '#4CAF50', width: '40%'}}>40%</div>
                    <div className="pie-slice" style={{background: '#FFC107', width: '20%'}}>20%</div>
                    <div className="pie-slice" style={{background: '#F44336', width: '10%'}}>10%</div>
                  </div>
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span className="legend-color" style={{background: '#1E88E5'}}></span>
                      <span>系统故障</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{background: '#4CAF50'}}></span>
                      <span>用户反馈</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{background: '#FFC107'}}></span>
                      <span>功能需求</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color" style={{background: '#F44336'}}></span>
                      <span>其他</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <h3>近7天事件趋势</h3>
                <div className="chart-container">
                  {/* 简单折线图模拟 */}
                  <div className="line-chart">
                    {trendData.map((item, index) => (
                      <div key={index} className="line-point">
                        <div className="point" style={{height: `${item.count * 5}px`}}></div>
                        <div className="point-label">{item.count}</div>
                        <div className="point-date">{item.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 通知设置页 */}
        {activePage === 'notifications' && (
          <div className="notification-settings">
            <div className="header">
              <h1>通知设置</h1>
              <button className="primary-button">添加规则</button>
            </div>

            {/* 规则列表 */}
            <div className="rules-list">
              <table className="rules-table">
                <thead>
                  <tr>
                    <th>规则名称</th>
                    <th>事件类型</th>
                    <th>优先级</th>
                    <th>通知方式</th>
                    <th>接收人</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {notificationRules.map(rule => (
                    <tr key={rule.id}>
                      <td>{rule.name}</td>
                      <td>{rule.event_type}</td>
                      <td>{rule.priority}</td>
                      <td>{rule.notification_method}</td>
                      <td>{rule.recipients}</td>
                      <td>
                        <button className="action-button edit">编辑</button>
                        <button className="action-button delete">删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 规则编辑表单 */}
            <div className="rule-form">
              <h2>添加通知规则</h2>
              <form>
                <div className="form-row">
                  <div className="form-group">
                    <label>规则名称</label>
                    <input type="text" placeholder="输入规则名称" />
                  </div>
                  <div className="form-group">
                    <label>事件类型</label>
                    <select>
                      <option>所有类型</option>
                      <option>系统故障</option>
                      <option>用户反馈</option>
                      <option>功能需求</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>优先级</label>
                    <select>
                      <option>所有优先级</option>
                      <option>低</option>
                      <option>中</option>
                      <option>高</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>通知方式</label>
                    <div className="checkbox-group">
                      <label><input type="checkbox" /> 邮件</label>
                      <label><input type="checkbox" /> 短信</label>
                      <label><input type="checkbox" /> 站内信</label>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>接收人</label>
                  <input type="text" placeholder="输入接收人，多个用逗号分隔" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="primary-button">保存规则</button>
                  <button type="button" className="secondary-button">取消</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* 编辑模态框 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>编辑事件</h2>
              <button className="close-button" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>标题</label>
                  <input type="text" defaultValue={selectedEvent?.title} />
                </div>
                <div className="form-group">
                  <label>描述</label>
                  <textarea defaultValue={selectedEvent?.description}></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>类型</label>
                    <select defaultValue={selectedEvent?.type}>
                      <option>系统故障</option>
                      <option>用户反馈</option>
                      <option>功能需求</option>
                      <option>其他</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>优先级</label>
                    <select defaultValue={selectedEvent?.priority}>
                      <option>低</option>
                      <option>中</option>
                      <option>高</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>状态</label>
                    <select defaultValue={selectedEvent?.status}>
                      <option>待审核</option>
                      <option>处理中</option>
                      <option>已解决</option>
                      <option>已关闭</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="secondary-button" onClick={handleCloseModal}>取消</button>
              <button className="primary-button" onClick={handleCloseModal}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCenter;