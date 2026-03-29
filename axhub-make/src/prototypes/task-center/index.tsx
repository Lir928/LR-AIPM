/**
 * @name 任务中心
 * 
 * 参考资料：
 * - /rules/development-guide.md
 * - /rules/axure-api-guide.md
 * - /docs/设计规范.UIGuidelines.md
 * 
 */

import './style.css';

import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react';

import { CheckCircle2, Clock, AlertCircle, User, Calendar, ChevronDown, Plus, Search, Filter, MoreVertical, Edit, Trash2, FileText, MessageCircle, Paperclip } from 'lucide-react';

import type {
    KeyDesc,
    DataDesc,
    ConfigItem,
    Action,
    EventItem,
    AxureProps,
    AxureHandle
} from '../../common/axure-types';

const EVENT_LIST: EventItem[] = [
    { name: 'onTaskClick', desc: '点击任务卡片时触发' },
    { name: 'onCreateTask', desc: '点击创建任务按钮时触发' },
    { name: 'onStatusChange', desc: '更改任务状态时触发' },
    { name: 'onFilterChange', desc: '更改筛选条件时触发' }
];

const ACTION_LIST: Action[] = [
    { name: 'refreshTasks', desc: '刷新任务列表' },
    { name: 'addTask', desc: '添加新任务，参数：{ title: string, description: string, priority: string, dueDate: string, assignee: string }' },
    { name: 'updateTaskStatus', desc: '更新任务状态，参数：{ taskId: number, status: string }' }
];

const VAR_LIST: KeyDesc[] = [
    { name: 'currentFilter', desc: '当前筛选条件' },
    { name: 'currentPage', desc: '当前页码' },
    { name: 'tasksPerPage', desc: '每页任务数量' }
];

const CONFIG_LIST: ConfigItem[] = [
    { type: 'input', attributeId: 'pageTitle', displayName: '页面标题', info: '任务中心页面的标题', initialValue: '任务中心' },
    { type: 'colorPicker', attributeId: 'primaryColor', displayName: '主色调', info: '任务中心的主色调', initialValue: '#10b981' },
    { type: 'colorPicker', attributeId: 'secondaryColor', displayName: '次要色调', info: '任务中心的次要色调', initialValue: '#3b82f6' }
];

const DATA_LIST: DataDesc[] = [
    {
        name: 'tasks',
        desc: '任务列表数据',
        keys: [
            { name: 'id', desc: '任务ID' },
            { name: 'title', desc: '任务标题' },
            { name: 'priority', desc: '优先级' },
            { name: 'status', desc: '状态' },
            { name: 'dueDate', desc: '截止日期' },
            { name: 'assignee', desc: '负责人' }
        ]
    },
    {
        name: 'statistics',
        desc: '任务统计数据',
        keys: [
            { name: 'total', desc: '任务总数' },
            { name: 'pending', desc: '待处理任务数' },
            { name: 'inProgress', desc: '进行中任务数' },
            { name: 'completed', desc: '已完成任务数' }
        ]
    }
];

const Component = forwardRef<AxureHandle, AxureProps>(function TaskCenter(innerProps, ref) {
    // 安全解构 props 并提供默认值，避免访问 undefined 属性
    const dataSource = innerProps && innerProps.data ? innerProps.data : {};
    const configSource = innerProps && innerProps.config ? innerProps.config : {};
    const onEventHandler = typeof innerProps.onEvent === 'function' ? innerProps.onEvent : function () { return undefined; };

    // 使用类型检查避免使用 || 运算符（会误判 0、false 等值）
    const pageTitle = typeof configSource.pageTitle === 'string' && configSource.pageTitle ? configSource.pageTitle : '任务中心';
    const primaryColor = typeof configSource.primaryColor === 'string' && configSource.primaryColor ? configSource.primaryColor : '#10b981';
    const secondaryColor = typeof configSource.secondaryColor === 'string' && configSource.secondaryColor ? configSource.secondaryColor : '#3b82f6';

    // 为演示提供合理的默认数据
    const defaultTasks = [
        { id: 1, title: '完成用户管理模块开发', priority: '高', status: '进行中', dueDate: '2026-04-10', assignee: '张三' },
        { id: 2, title: '修复登录页面bug', priority: '中', status: '待处理', dueDate: '2026-04-05', assignee: '李四' },
        { id: 3, title: '编写API文档', priority: '低', status: '已完成', dueDate: '2026-04-01', assignee: '王五' },
        { id: 4, title: '测试支付功能', priority: '中', status: '待处理', dueDate: '2026-04-15', assignee: '赵六' },
        { id: 5, title: '优化首页加载速度', priority: '高', status: '进行中', dueDate: '2026-04-08', assignee: '孙七' }
    ];
    
    const defaultStatistics = {
        total: 100,
        pending: 15,
        inProgress: 25,
        completed: 60
    };

    const tasks = Array.isArray(dataSource.tasks) ? dataSource.tasks : defaultTasks;
    const statistics = dataSource.statistics && typeof dataSource.statistics === 'object' ? dataSource.statistics : defaultStatistics;

    // 避免使用 ES6 解构，使用数组索引访问 state 和 setter
    const filterState = useState<string>('all');
    const currentFilter = filterState[0];
    const setCurrentFilter = filterState[1];

    const pageState = useState<number>(1);
    const currentPage = pageState[0];
    const setCurrentPage = pageState[1];

    // 使用 useCallback 优化性能，包含错误处理
    const emitEvent = useCallback(function (eventName: string, payload?: any) {
        try {
            onEventHandler(eventName, payload);
        } catch (error) {
            console.warn('事件触发失败:', error);
        }
    }, [onEventHandler]);

    const handleTaskClick = useCallback(function (task: any) {
        emitEvent('onTaskClick', { task });
    }, [emitEvent]);

    const handleCreateTask = useCallback(function () {
        emitEvent('onCreateTask', {});
    }, [emitEvent]);

    const handleStatusChange = useCallback(function (taskId: number, status: string) {
        emitEvent('onStatusChange', { taskId, status });
    }, [emitEvent]);

    const handleFilterChange = useCallback(function (filter: string) {
        setCurrentFilter(filter);
        emitEvent('onFilterChange', { filter });
    }, [emitEvent]);

    // 使用 switch 语句处理不同的动作类型
    const fireActionHandler = useCallback(function (name: string, params?: any) {
        switch (name) {
            case 'refreshTasks':
                // 模拟刷新
                console.log('刷新任务列表...');
                break;
            case 'addTask':
                if (params) {
                    console.log('添加新任务:', params);
                }
                break;
            case 'updateTaskStatus':
                if (params && params.taskId && params.status) {
                    console.log('更新任务状态:', params);
                }
                break;
            default:
                console.warn('未知的动作:', name);
        }
    }, []);

    useImperativeHandle(ref, function () {
        return {
            getVar: function (name: string) {
                const vars: Record<string, any> = {
                    currentFilter,
                    currentPage,
                    tasksPerPage: 10
                };
                return vars[name];
            },
            fireAction: fireActionHandler,
            eventList: EVENT_LIST,
            actionList: ACTION_LIST,
            varList: VAR_LIST,
            configList: CONFIG_LIST,
            dataList: DATA_LIST
        };
    }, [currentFilter, currentPage, fireActionHandler]);

    // 过滤任务
    const filteredTasks = tasks.filter(function (task) {
        if (currentFilter === 'all') return true;
        return task.status === currentFilter;
    });

    // 获取状态标签的样式
    const getStatusStyle = function (status: string) {
        switch (status) {
            case '待处理':
                return { backgroundColor: '#f3f4f6', color: '#6b7280' };
            case '进行中':
                return { backgroundColor: '#dbeafe', color: '#2563eb' };
            case '已完成':
                return { backgroundColor: '#d1fae5', color: '#059669' };
            case '已取消':
                return { backgroundColor: '#fee2e2', color: '#dc2626' };
            default:
                return { backgroundColor: '#f3f4f6', color: '#6b7280' };
        }
    };

    // 获取优先级标签的样式
    const getPriorityStyle = function (priority: string) {
        switch (priority) {
            case '高':
                return { backgroundColor: '#fee2e2', color: '#dc2626' };
            case '中':
                return { backgroundColor: '#fef3c7', color: '#d97706' };
            case '低':
                return { backgroundColor: '#d1fae5', color: '#059669' };
            default:
                return { backgroundColor: '#f3f4f6', color: '#6b7280' };
        }
    };

    // 使用语义化的类名，添加组件前缀避免冲突
    // 避免在 JSX 中直接定义函数，使用预定义的 useCallback 函数
    return (
        <div className="demo-task-center-container" style={{ '--primary-color': primaryColor, '--secondary-color': secondaryColor } as any}>
            {/* 顶部导航栏 */}
            <div className="demo-task-center-header">
                <div className="demo-task-center-header-left">
                    <h1 className="demo-task-center-title">{pageTitle}</h1>
                </div>
                <div className="demo-task-center-header-right">
                    <div className="demo-task-center-search">
                        <Search size={16} />
                        <input type="text" placeholder="搜索任务" />
                    </div>
                    <div className="demo-task-center-user">
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="用户头像" />
                    </div>
                </div>
            </div>

            {/* 左侧边栏 */}
            <div className="demo-task-center-sidebar">
                <div className="demo-task-center-sidebar-item active">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <span>任务中心</span>
                </div>
                <div className="demo-task-center-sidebar-item">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg>
                    <span>任务统计</span>
                </div>
                <div className="demo-task-center-sidebar-item">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    <span>系统设置</span>
                </div>
            </div>

            {/* 主内容区 */}
            <div className="demo-task-center-content">
                {/* 任务统计概览 */}
                <div className="demo-task-center-stats">
                    <div className="demo-task-center-stat-card">
                        <div className="demo-task-center-stat-icon">
                            <FileText size={20} />
                        </div>
                        <div className="demo-task-center-stat-value">{statistics.total}</div>
                        <div className="demo-task-center-stat-label">任务总数</div>
                    </div>
                    <div className="demo-task-center-stat-card">
                        <div className="demo-task-center-stat-icon">
                            <Clock size={20} />
                        </div>
                        <div className="demo-task-center-stat-value">{statistics.pending}</div>
                        <div className="demo-task-center-stat-label">待处理</div>
                    </div>
                    <div className="demo-task-center-stat-card">
                        <div className="demo-task-center-stat-icon">
                            <AlertCircle size={20} />
                        </div>
                        <div className="demo-task-center-stat-value">{statistics.inProgress}</div>
                        <div className="demo-task-center-stat-label">进行中</div>
                    </div>
                    <div className="demo-task-center-stat-card">
                        <div className="demo-task-center-stat-icon">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="demo-task-center-stat-value">{statistics.completed}</div>
                        <div className="demo-task-center-stat-label">已完成</div>
                    </div>
                </div>

                {/* 任务筛选区 */}
                <div className="demo-task-center-filter">
                    <div className="demo-task-center-filter-left">
                        <button 
                            className={`demo-task-center-filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
                            onClick={function () { handleFilterChange('all'); }}
                        >
                            全部
                        </button>
                        <button 
                            className={`demo-task-center-filter-btn ${currentFilter === '待处理' ? 'active' : ''}`}
                            onClick={function () { handleFilterChange('待处理'); }}
                        >
                            待处理
                        </button>
                        <button 
                            className={`demo-task-center-filter-btn ${currentFilter === '进行中' ? 'active' : ''}`}
                            onClick={function () { handleFilterChange('进行中'); }}
                        >
                            进行中
                        </button>
                        <button 
                            className={`demo-task-center-filter-btn ${currentFilter === '已完成' ? 'active' : ''}`}
                            onClick={function () { handleFilterChange('已完成'); }}
                        >
                            已完成
                        </button>
                    </div>
                    <div className="demo-task-center-filter-right">
                        <button className="demo-task-center-filter-btn">
                            <Filter size={16} />
                            筛选
                        </button>
                        <button 
                            className="demo-task-center-create-btn"
                            style={{ backgroundColor: primaryColor }}
                            onClick={handleCreateTask}
                        >
                            <Plus size={16} />
                            创建任务
                        </button>
                    </div>
                </div>

                {/* 任务列表 */}
                <div className="demo-task-center-task-list">
                    <table className="demo-task-center-task-table">
                        <thead>
                            <tr>
                                <th><input type="checkbox" /></th>
                                <th>任务标题</th>
                                <th>优先级</th>
                                <th>状态</th>
                                <th>截止日期</th>
                                <th>负责人</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map(function (task: any) {
                                return (
                                    <tr key={task.id} className="demo-task-center-task-row">
                                        <td><input type="checkbox" /></td>
                                        <td className="demo-task-center-task-title" onClick={function () { handleTaskClick(task); }}>
                                            {task.title}
                                        </td>
                                        <td>
                                            <span className="demo-task-center-priority-tag" style={getPriorityStyle(task.priority)}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="demo-task-center-status-tag" style={getStatusStyle(task.status)}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="demo-task-center-task-date">
                                            <Calendar size={14} />
                                            <span>{task.dueDate}</span>
                                        </td>
                                        <td className="demo-task-center-task-assignee">
                                            <User size={14} />
                                            <span>{task.assignee}</span>
                                        </td>
                                        <td>
                                            <div className="demo-task-center-task-actions">
                                                <button className="demo-task-center-action-btn">
                                                    <Edit size={14} />
                                                </button>
                                                <button className="demo-task-center-action-btn">
                                                    <Trash2 size={14} />
                                                </button>
                                                <button className="demo-task-center-action-btn">
                                                    <MoreVertical size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 分页控件 */}
                <div className="demo-task-center-pagination">
                    <button className="demo-task-center-page-btn">上一页</button>
                    <button className="demo-task-center-page-btn active">1</button>
                    <button className="demo-task-center-page-btn">2</button>
                    <button className="demo-task-center-page-btn">3</button>
                    <button className="demo-task-center-page-btn">下一页</button>
                    <span className="demo-task-center-page-info">共 {filteredTasks.length} 条</span>
                </div>
            </div>

            {/* 右侧边栏 */}
            <div className="demo-task-center-right-sidebar">
                <div className="demo-task-center-right-sidebar-section">
                    <h3>快速操作</h3>
                    <button 
                        className="demo-task-center-quick-action-btn"
                        style={{ backgroundColor: primaryColor }}
                        onClick={handleCreateTask}
                    >
                        <Plus size={16} />
                        创建任务
                    </button>
                </div>
                <div className="demo-task-center-right-sidebar-section">
                    <h3>最近任务</h3>
                    <div className="demo-task-center-recent-task">
                        <div className="demo-task-center-recent-task-title">完成用户管理模块开发</div>
                        <div className="demo-task-center-recent-task-meta">
                            <span className="demo-task-center-recent-task-status" style={getStatusStyle('进行中')}>
                                进行中
                            </span>
                            <span>2026-04-10</span>
                        </div>
                    </div>
                    <div className="demo-task-center-recent-task">
                        <div className="demo-task-center-recent-task-title">修复登录页面bug</div>
                        <div className="demo-task-center-recent-task-meta">
                            <span className="demo-task-center-recent-task-status" style={getStatusStyle('待处理')}>
                                待处理
                            </span>
                            <span>2026-04-05</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

// 这是本项目平台集成的必要条件
export default Component;