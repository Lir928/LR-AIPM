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

import React, { useState, useCallback, useImperativeHandle, forwardRef, useReducer, useEffect } from 'react';

import { CheckCircle2, Clock, AlertCircle, User, Calendar, ChevronDown, Plus, Search, Filter, MoreVertical, Edit, Trash2, FileText, MessageCircle, Paperclip, Loader2, X } from 'lucide-react';

import type {
    KeyDesc,
    DataDesc,
    ConfigItem,
    Action,
    EventItem,
    AxureProps,
    AxureHandle
} from '../../common/axure-types';

// 任务类型定义
type Task = {
    id: number;
    title: string;
    description: string;
    priority: '高' | '中' | '低';
    status: '待处理' | '进行中' | '已完成' | '已取消';
    dueDate: string;
    assignee: string;
    createdAt: string;
    updatedAt: string;
};

// 统计数据类型定义
type Statistics = {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
};

// 状态类型定义
type TaskState = {
    tasks: Task[];
    filteredTasks: Task[];
    statistics: Statistics;
    loading: boolean;
    error: string | null;
    currentFilter: string;
    currentPage: number;
    tasksPerPage: number;
    searchQuery: string;
    showCreateModal: boolean;
    showEditModal: boolean;
    currentTask: Task | null;
};

// Action 类型定义
type TaskAction =
    | { type: 'SET_TASKS'; payload: Task[] }
    | { type: 'SET_FILTER'; payload: string }
    | { type: 'SET_SEARCH_QUERY'; payload: string }
    | { type: 'SET_PAGE'; payload: number }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: Task }
    | { type: 'DELETE_TASK'; payload: number }
    | { type: 'SET_SHOW_CREATE_MODAL'; payload: boolean }
    | { type: 'SET_SHOW_EDIT_MODAL'; payload: boolean }
    | { type: 'SET_CURRENT_TASK'; payload: Task | null }
    | { type: 'UPDATE_STATISTICS'; payload: Statistics };

// 初始状态
const initialState: TaskState = {
    tasks: [],
    filteredTasks: [],
    statistics: {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0
    },
    loading: false,
    error: null,
    currentFilter: 'all',
    currentPage: 1,
    tasksPerPage: 10,
    searchQuery: '',
    showCreateModal: false,
    showEditModal: false,
    currentTask: null
};

// Reducer 函数
function taskReducer(state: TaskState, action: TaskAction): TaskState {
    switch (action.type) {
        case 'SET_TASKS': {
            const tasks = action.payload;
            const statistics = calculateStatistics(tasks);
            const filteredTasks = filterTasks(tasks, state.currentFilter, state.searchQuery);
            return {
                ...state,
                tasks,
                filteredTasks,
                statistics
            };
        }
        case 'SET_FILTER': {
            const currentFilter = action.payload;
            const filteredTasks = filterTasks(state.tasks, currentFilter, state.searchQuery);
            return {
                ...state,
                currentFilter,
                filteredTasks,
                currentPage: 1
            };
        }
        case 'SET_SEARCH_QUERY': {
            const searchQuery = action.payload;
            const filteredTasks = filterTasks(state.tasks, state.currentFilter, searchQuery);
            return {
                ...state,
                searchQuery,
                filteredTasks,
                currentPage: 1
            };
        }
        case 'SET_PAGE':
            return {
                ...state,
                currentPage: action.payload
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };
        case 'ADD_TASK': {
            const tasks = [...state.tasks, action.payload];
            const statistics = calculateStatistics(tasks);
            const filteredTasks = filterTasks(tasks, state.currentFilter, state.searchQuery);
            return {
                ...state,
                tasks,
                filteredTasks,
                statistics,
                showCreateModal: false
            };
        }
        case 'UPDATE_TASK': {
            const tasks = state.tasks.map(task => 
                task.id === action.payload.id ? action.payload : task
            );
            const statistics = calculateStatistics(tasks);
            const filteredTasks = filterTasks(tasks, state.currentFilter, state.searchQuery);
            return {
                ...state,
                tasks,
                filteredTasks,
                statistics,
                showEditModal: false,
                currentTask: null
            };
        }
        case 'DELETE_TASK': {
            const tasks = state.tasks.filter(task => task.id !== action.payload);
            const statistics = calculateStatistics(tasks);
            const filteredTasks = filterTasks(tasks, state.currentFilter, state.searchQuery);
            return {
                ...state,
                tasks,
                filteredTasks,
                statistics
            };
        }
        case 'SET_SHOW_CREATE_MODAL':
            return {
                ...state,
                showCreateModal: action.payload
            };
        case 'SET_SHOW_EDIT_MODAL':
            return {
                ...state,
                showEditModal: action.payload
            };
        case 'SET_CURRENT_TASK':
            return {
                ...state,
                currentTask: action.payload
            };
        case 'UPDATE_STATISTICS':
            return {
                ...state,
                statistics: action.payload
            };
        default:
            return state;
    }
}

// 计算统计数据
function calculateStatistics(tasks: Task[]): Statistics {
    return {
        total: tasks.length,
        pending: tasks.filter(task => task.status === '待处理').length,
        inProgress: tasks.filter(task => task.status === '进行中').length,
        completed: tasks.filter(task => task.status === '已完成').length
    };
}

// 过滤任务
function filterTasks(tasks: Task[], filter: string, searchQuery: string): Task[] {
    let filtered = tasks;
    
    // 状态过滤
    if (filter !== 'all') {
        filtered = filtered.filter(task => task.status === filter);
    }
    
    // 搜索过滤
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query) ||
            task.assignee.toLowerCase().includes(query)
        );
    }
    
    return filtered;
}

// 模拟 API 调用
const mockApi = {
    // 获取任务列表
    getTasks: async (): Promise<Task[]> => {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟数据 - 10条
        return [
            {
                id: 1,
                title: '完成用户管理模块开发',
                description: '实现用户注册、登录、权限管理等功能',
                priority: '高',
                status: '进行中',
                dueDate: '2026-04-10',
                assignee: '张三',
                createdAt: '2026-03-25T08:00:00Z',
                updatedAt: '2026-03-28T14:30:00Z'
            },
            {
                id: 2,
                title: '修复登录页面bug',
                description: '修复登录页面在移动端的布局问题',
                priority: '中',
                status: '待处理',
                dueDate: '2026-04-05',
                assignee: '李四',
                createdAt: '2026-03-26T09:15:00Z',
                updatedAt: '2026-03-26T09:15:00Z'
            },
            {
                id: 3,
                title: '编写API文档',
                description: '为所有后端API编写详细的文档',
                priority: '低',
                status: '已完成',
                dueDate: '2026-04-01',
                assignee: '王五',
                createdAt: '2026-03-20T10:45:00Z',
                updatedAt: '2026-03-29T16:20:00Z'
            },
            {
                id: 4,
                title: '测试支付功能',
                description: '测试各种支付场景和边界情况',
                priority: '中',
                status: '待处理',
                dueDate: '2026-04-15',
                assignee: '赵六',
                createdAt: '2026-03-27T11:20:00Z',
                updatedAt: '2026-03-27T11:20:00Z'
            },
            {
                id: 5,
                title: '优化首页加载速度',
                description: '减少首页加载时间，提高用户体验',
                priority: '高',
                status: '进行中',
                dueDate: '2026-04-08',
                assignee: '孙七',
                createdAt: '2026-03-24T13:10:00Z',
                updatedAt: '2026-03-29T10:05:00Z'
            },
            {
                id: 6,
                title: '设计新的用户界面',
                description: '为移动端应用设计新的用户界面',
                priority: '中',
                status: '待处理',
                dueDate: '2026-04-12',
                assignee: '周八',
                createdAt: '2026-03-28T09:30:00Z',
                updatedAt: '2026-03-28T09:30:00Z'
            },
            {
                id: 7,
                title: '实现数据可视化功能',
                description: '为后台管理系统添加数据可视化图表',
                priority: '高',
                status: '进行中',
                dueDate: '2026-04-06',
                assignee: '吴九',
                createdAt: '2026-03-23T14:20:00Z',
                updatedAt: '2026-03-29T11:15:00Z'
            },
            {
                id: 8,
                title: '修复数据同步问题',
                description: '修复移动端与服务器的数据同步问题',
                priority: '高',
                status: '待处理',
                dueDate: '2026-04-03',
                assignee: '郑十',
                createdAt: '2026-03-29T10:00:00Z',
                updatedAt: '2026-03-29T10:00:00Z'
            },
            {
                id: 9,
                title: '编写单元测试',
                description: '为核心功能编写单元测试',
                priority: '低',
                status: '已完成',
                dueDate: '2026-03-31',
                assignee: '王十一',
                createdAt: '2026-03-21T16:45:00Z',
                updatedAt: '2026-03-28T15:30:00Z'
            },
            {
                id: 10,
                title: '部署应用到生产环境',
                description: '将应用部署到生产服务器并进行监控',
                priority: '中',
                status: '待处理',
                dueDate: '2026-04-18',
                assignee: '赵十二',
                createdAt: '2026-03-27T13:15:00Z',
                updatedAt: '2026-03-27T13:15:00Z'
            }
        ];
    },
    
    // 创建任务
    createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟创建任务
        const newTask: Task = {
            ...task,
            id: Math.floor(Math.random() * 10000),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        return newTask;
    },
    
    // 更新任务
    updateTask: async (task: Task): Promise<Task> => {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 模拟更新任务
        const updatedTask: Task = {
            ...task,
            updatedAt: new Date().toISOString()
        };
        
        return updatedTask;
    },
    
    // 删除任务
    deleteTask: async (taskId: number): Promise<boolean> => {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟删除成功
        return true;
    }
};

const EVENT_LIST: EventItem[] = [
    { name: 'onTaskClick', desc: '点击任务卡片时触发' },
    { name: 'onCreateTask', desc: '点击创建任务按钮时触发' },
    { name: 'onStatusChange', desc: '更改任务状态时触发' },
    { name: 'onFilterChange', desc: '更改筛选条件时触发' },
    { name: 'onTaskCreated', desc: '任务创建成功时触发' },
    { name: 'onTaskUpdated', desc: '任务更新成功时触发' },
    { name: 'onTaskDeleted', desc: '任务删除成功时触发' }
];

const ACTION_LIST: Action[] = [
    { name: 'refreshTasks', desc: '刷新任务列表' },
    { name: 'addTask', desc: '添加新任务，参数：{ title: string, description: string, priority: string, dueDate: string, assignee: string }' },
    { name: 'updateTask', desc: '更新任务，参数：{ id: number, title: string, description: string, priority: string, status: string, dueDate: string, assignee: string }' },
    { name: 'updateTaskStatus', desc: '更新任务状态，参数：{ taskId: number, status: string }' },
    { name: 'deleteTask', desc: '删除任务，参数：{ taskId: number }' },
    { name: 'openCreateModal', desc: '打开创建任务模态框' },
    { name: 'openEditModal', desc: '打开编辑任务模态框，参数：{ taskId: number }' }
];

const VAR_LIST: KeyDesc[] = [
    { name: 'currentFilter', desc: '当前筛选条件' },
    { name: 'currentPage', desc: '当前页码' },
    { name: 'tasksPerPage', desc: '每页任务数量' },
    { name: 'searchQuery', desc: '搜索查询' },
    { name: 'loading', desc: '加载状态' },
    { name: 'error', desc: '错误信息' }
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
            { name: 'description', desc: '任务描述' },
            { name: 'priority', desc: '优先级' },
            { name: 'status', desc: '状态' },
            { name: 'dueDate', desc: '截止日期' },
            { name: 'assignee', desc: '负责人' },
            { name: 'createdAt', desc: '创建时间' },
            { name: 'updatedAt', desc: '更新时间' }
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

    // 使用 useReducer 进行复杂状态管理
    const [state, dispatch] = useReducer(taskReducer, initialState);

    // 表单状态
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: '中' as '高' | '中' | '低',
        status: '待处理' as '待处理' | '进行中' | '已完成' | '已取消',
        dueDate: '',
        assignee: ''
    });

    // 加载任务列表
    const loadTasks = useCallback(async function () {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        
        try {
            const tasks = await mockApi.getTasks();
            dispatch({ type: 'SET_TASKS', payload: tasks });
        } catch (error) {
            console.error('加载任务失败:', error);
            dispatch({ type: 'SET_ERROR', payload: '加载任务失败，请重试' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    // 组件挂载时加载任务
    useEffect(function () {
        loadTasks();
    }, [loadTasks]);

    // 使用 useCallback 优化性能，包含错误处理
    const emitEvent = useCallback(function (eventName: string, payload?: any) {
        try {
            onEventHandler(eventName, payload);
        } catch (error) {
            console.warn('事件触发失败:', error);
        }
    }, [onEventHandler]);

    // 处理任务点击
    const handleTaskClick = useCallback(function (task: Task) {
        emitEvent('onTaskClick', { task });
        dispatch({ type: 'SET_CURRENT_TASK', payload: task });
        dispatch({ type: 'SET_SHOW_EDIT_MODAL', payload: true });
    }, [emitEvent]);

    // 处理创建任务
    const handleCreateTask = useCallback(function () {
        emitEvent('onCreateTask', {});
        // 重置表单
        setFormData({
            title: '',
            description: '',
            priority: '中',
            status: '待处理',
            dueDate: '',
            assignee: ''
        });
        dispatch({ type: 'SET_SHOW_CREATE_MODAL', payload: true });
    }, [emitEvent]);

    // 处理状态变更
    const handleStatusChange = useCallback(async function (taskId: number, status: string) {
        emitEvent('onStatusChange', { taskId, status });
        
        const task = state.tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const updatedTask = { ...task, status: status as Task['status'] };
        
        try {
            const result = await mockApi.updateTask(updatedTask);
            dispatch({ type: 'UPDATE_TASK', payload: result });
            emitEvent('onTaskUpdated', { task: result });
        } catch (error) {
            console.error('更新任务状态失败:', error);
            dispatch({ type: 'SET_ERROR', payload: '更新任务状态失败，请重试' });
        }
    }, [state.tasks, emitEvent]);

    // 处理筛选变更
    const handleFilterChange = useCallback(function (filter: string) {
        dispatch({ type: 'SET_FILTER', payload: filter });
        emitEvent('onFilterChange', { filter });
    }, [emitEvent]);

    // 处理搜索
    const handleSearch = useCallback(function (e: React.ChangeEvent<HTMLInputElement>) {
        dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
    }, []);

    // 处理分页
    const handlePageChange = useCallback(function (page: number) {
        dispatch({ type: 'SET_PAGE', payload: page });
    }, []);

    // 处理表单变更
    const handleFormChange = useCallback(function (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // 处理创建任务提交
    const handleCreateSubmit = useCallback(async function (e: React.FormEvent) {
        e.preventDefault();
        
        if (!formData.title || !formData.assignee || !formData.dueDate) {
            dispatch({ type: 'SET_ERROR', payload: '请填写必填字段' });
            return;
        }
        
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            const newTask = await mockApi.createTask(formData);
            dispatch({ type: 'ADD_TASK', payload: newTask });
            emitEvent('onTaskCreated', { task: newTask });
        } catch (error) {
            console.error('创建任务失败:', error);
            dispatch({ type: 'SET_ERROR', payload: '创建任务失败，请重试' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [formData, emitEvent]);

    // 处理编辑任务提交
    const handleEditSubmit = useCallback(async function (e: React.FormEvent) {
        e.preventDefault();
        
        if (!formData.title || !formData.assignee || !formData.dueDate || !state.currentTask) {
            dispatch({ type: 'SET_ERROR', payload: '请填写必填字段' });
            return;
        }
        
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            const updatedTask = { ...state.currentTask, ...formData };
            const result = await mockApi.updateTask(updatedTask);
            dispatch({ type: 'UPDATE_TASK', payload: result });
            emitEvent('onTaskUpdated', { task: result });
        } catch (error) {
            console.error('更新任务失败:', error);
            dispatch({ type: 'SET_ERROR', payload: '更新任务失败，请重试' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [formData, state.currentTask, emitEvent]);

    // 处理删除任务
    const handleDeleteTask = useCallback(async function (taskId: number) {
        if (!confirm('确定要删除这个任务吗？')) return;
        
        dispatch({ type: 'SET_LOADING', payload: true });
        
        try {
            await mockApi.deleteTask(taskId);
            dispatch({ type: 'DELETE_TASK', payload: taskId });
            emitEvent('onTaskDeleted', { taskId });
        } catch (error) {
            console.error('删除任务失败:', error);
            dispatch({ type: 'SET_ERROR', payload: '删除任务失败，请重试' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [emitEvent]);

    // 处理编辑任务
    const handleEditTask = useCallback(function (task: Task) {
        setFormData({
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate,
            assignee: task.assignee
        });
        dispatch({ type: 'SET_CURRENT_TASK', payload: task });
        dispatch({ type: 'SET_SHOW_EDIT_MODAL', payload: true });
    }, []);

    // 使用 switch 语句处理不同的动作类型
    const fireActionHandler = useCallback(function (name: string, params?: any) {
        switch (name) {
            case 'refreshTasks':
                loadTasks();
                break;
            case 'addTask':
                if (params) {
                    setFormData(params);
                    dispatch({ type: 'SET_SHOW_CREATE_MODAL', payload: true });
                }
                break;
            case 'updateTask':
                if (params && params.id) {
                    const task = state.tasks.find(t => t.id === params.id);
                    if (task) {
                        handleEditTask({ ...task, ...params });
                    }
                }
                break;
            case 'updateTaskStatus':
                if (params && params.taskId && params.status) {
                    handleStatusChange(params.taskId, params.status);
                }
                break;
            case 'deleteTask':
                if (params && params.taskId) {
                    handleDeleteTask(params.taskId);
                }
                break;
            case 'openCreateModal':
                handleCreateTask();
                break;
            case 'openEditModal':
                if (params && params.taskId) {
                    const task = state.tasks.find(t => t.id === params.taskId);
                    if (task) {
                        handleEditTask(task);
                    }
                }
                break;
            default:
                console.warn('未知的动作:', name);
        }
    }, [loadTasks, state.tasks, handleEditTask, handleStatusChange, handleDeleteTask, handleCreateTask]);

    useImperativeHandle(ref, function () {
        return {
            getVar: function (name: string) {
                const vars: Record<string, any> = {
                    currentFilter: state.currentFilter,
                    currentPage: state.currentPage,
                    tasksPerPage: state.tasksPerPage,
                    searchQuery: state.searchQuery,
                    loading: state.loading,
                    error: state.error
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
    }, [state.currentFilter, state.currentPage, state.tasksPerPage, state.searchQuery, state.loading, state.error, fireActionHandler]);

    // 计算分页数据
    const totalPages = Math.ceil(state.filteredTasks.length / state.tasksPerPage);
    const startIndex = (state.currentPage - 1) * state.tasksPerPage;
    const paginatedTasks = state.filteredTasks.slice(startIndex, startIndex + state.tasksPerPage);

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

    // 渲染加载状态
    if (state.loading && state.tasks.length === 0) {
        return (
            <div className="demo-task-center-container" style={{ '--primary-color': primaryColor, '--secondary-color': secondaryColor } as any}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Loader2 size={48} className="animate-spin" />
                    <span style={{ marginLeft: '16px', fontSize: '16px' }}>加载中...</span>
                </div>
            </div>
        );
    }

    // 渲染错误状态
    if (state.error && state.tasks.length === 0) {
        return (
            <div className="demo-task-center-container" style={{ '--primary-color': primaryColor, '--secondary-color': secondaryColor } as any}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                    <AlertCircle size={48} color="#ef4444" />
                    <span style={{ marginLeft: '16px', fontSize: '16px', color: '#ef4444', marginTop: '16px' }}>{state.error}</span>
                    <button 
                        style={{
                            marginTop: '24px',
                            padding: '8px 16px',
                            backgroundColor: primaryColor,
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        onClick={loadTasks}
                    >
                        重试
                    </button>
                </div>
            </div>
        );
    }

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
                        <input 
                            type="text" 
                            placeholder="搜索任务" 
                            value={state.searchQuery}
                            onChange={handleSearch}
                        />
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
                        <div className="demo-task-center-stat-value">{state.statistics.total}</div>
                        <div className="demo-task-center-stat-label">任务总数</div>
                    </div>
                    <div className="demo-task-center-stat-card">
                        <div className="demo-task-center-stat-icon">
                            <Clock size={20} />
                        </div>
                        <div className="demo-task-center-stat-value">{state.statistics.pending}</div>
                        <div className="demo-task-center-stat-label">待处理</div>
                    </div>
                    <div className="demo-task-center-stat-card">
                        <div className="demo-task-center-stat-icon">
                            <AlertCircle size={20} />
                        </div>
                        <div className="demo-task-center-stat-value">{state.statistics.inProgress}</div>
                        <div className="demo-task-center-stat-label">进行中</div>
                    </div>
                    <div className="demo-task-center-stat-card">
                        <div className="demo-task-center-stat-icon">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="demo-task-center-stat-value">{state.statistics.completed}</div>
                        <div className="demo-task-center-stat-label">已完成</div>
                    </div>
                </div>

                {/* 任务筛选区 */}
                <div className="demo-task-center-filter">
                    <div className="demo-task-center-filter-left">
                        <button 
                            className={`demo-task-center-filter-btn ${state.currentFilter === 'all' ? 'active' : ''}`}
                            onClick={function () { handleFilterChange('all'); }}
                        >
                            全部
                        </button>
                        <button 
                            className={`demo-task-center-filter-btn ${state.currentFilter === '待处理' ? 'active' : ''}`}
                            onClick={function () { handleFilterChange('待处理'); }}
                        >
                            待处理
                        </button>
                        <button 
                            className={`demo-task-center-filter-btn ${state.currentFilter === '进行中' ? 'active' : ''}`}
                            onClick={function () { handleFilterChange('进行中'); }}
                        >
                            进行中
                        </button>
                        <button 
                            className={`demo-task-center-filter-btn ${state.currentFilter === '已完成' ? 'active' : ''}`}
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

                {/* 错误提示 */}
                {state.error && (
                    <div style={{ 
                        backgroundColor: '#fee2e2', 
                        color: '#dc2626', 
                        padding: '12px', 
                        borderRadius: '4px', 
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <AlertCircle size={16} style={{ marginRight: '8px' }} />
                            <span>{state.error}</span>
                        </div>
                        <button 
                            onClick={() => dispatch({ type: 'SET_ERROR', payload: null })} 
                            style={{ 
                                background: 'none', 
                                border: 'none', 
                                color: '#dc2626', 
                                cursor: 'pointer'
                            }}
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* 任务列表 */}
                <div className="demo-task-center-task-list" style={{ minHeight: '400px', marginBottom: '20px' }}>
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
                            {paginatedTasks.length > 0 ? (
                                paginatedTasks.map(function (task) {
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
                                                <select 
                                                    style={{
                                                        padding: '4px 8px',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '4px',
                                                        fontSize: '12px'
                                                    }}
                                                    value={task.status}
                                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                                >
                                                    <option value="待处理">待处理</option>
                                                    <option value="进行中">进行中</option>
                                                    <option value="已完成">已完成</option>
                                                    <option value="已取消">已取消</option>
                                                </select>
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
                                                    <button 
                                                        className="demo-task-center-action-btn"
                                                        onClick={() => handleEditTask(task)}
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button 
                                                        className="demo-task-center-action-btn"
                                                        onClick={() => handleDeleteTask(task.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                    <button className="demo-task-center-action-btn">
                                                        <MoreVertical size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                                        没有找到任务
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 分页控件 */}
                <div className="demo-task-center-pagination" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button 
                        className="demo-task-center-page-btn"
                        disabled={state.currentPage === 1}
                        onClick={() => handlePageChange(state.currentPage - 1)}
                    >
                        上一页
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button 
                            key={page}
                            className={`demo-task-center-page-btn ${state.currentPage === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                    <button 
                        className="demo-task-center-page-btn"
                        disabled={state.currentPage === totalPages}
                        onClick={() => handlePageChange(state.currentPage + 1)}
                    >
                        下一页
                    </button>
                    <span className="demo-task-center-page-info" style={{ marginLeft: '16px' }}>共 {state.filteredTasks.length} 条</span>
                </div>
            </div>



            {/* 创建任务模态框 */}
            {state.showCreateModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '24px',
                        width: '500px',
                        maxWidth: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>创建任务</h2>
                            <button 
                                onClick={() => dispatch({ type: 'SET_SHOW_CREATE_MODAL', payload: false })}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleCreateSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>任务标题 *</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px'
                                    }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>任务描述</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px',
                                        height: '100px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>优先级</label>
                                    <select 
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleFormChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <option value="高">高</option>
                                        <option value="中">中</option>
                                        <option value="低">低</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>状态</label>
                                    <select 
                                        name="status"
                                        value={formData.status}
                                        onChange={handleFormChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <option value="待处理">待处理</option>
                                        <option value="进行中">进行中</option>
                                        <option value="已完成">已完成</option>
                                        <option value="已取消">已取消</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>截止日期 *</label>
                                    <input 
                                        type="date" 
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleFormChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '4px'
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>负责人 *</label>
                                    <input 
                                        type="text" 
                                        name="assignee"
                                        value={formData.assignee}
                                        onChange={handleFormChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '4px'
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                <button 
                                    type="button"
                                    onClick={() => dispatch({ type: 'SET_SHOW_CREATE_MODAL', payload: false })}
                                    style={{
                                        padding: '8px 16px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px',
                                        backgroundColor: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    取消
                                </button>
                                <button 
                                    type="submit"
                                    style={{
                                        padding: '8px 16px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        backgroundColor: primaryColor,
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                    disabled={state.loading}
                                >
                                    {state.loading ? (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Loader2 size={16} className="animate-spin" style={{ marginRight: '8px' }} />
                                            创建中...
                                        </div>
                                    ) : (
                                        '创建任务'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 编辑任务模态框 */}
            {state.showEditModal && state.currentTask && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '24px',
                        width: '500px',
                        maxWidth: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>编辑任务</h2>
                            <button 
                                onClick={() => dispatch({ type: 'SET_SHOW_EDIT_MODAL', payload: false })}
                                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>任务标题 *</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px'
                                    }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>任务描述</label>
                                <textarea 
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px',
                                        height: '100px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>优先级</label>
                                    <select 
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleFormChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <option value="高">高</option>
                                        <option value="中">中</option>
                                        <option value="低">低</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>状态</label>
                                    <select 
                                        name="status"
                                        value={formData.status}
                                        onChange={handleFormChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        <option value="待处理">待处理</option>
                                        <option value="进行中">进行中</option>
                                        <option value="已完成">已完成</option>
                                        <option value="已取消">已取消</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>截止日期 *</label>
                                    <input 
                                        type="date" 
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleFormChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '4px'
                                        }}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>负责人 *</label>
                                    <input 
                                        type="text" 
                                        name="assignee"
                                        value={formData.assignee}
                                        onChange={handleFormChange}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '4px'
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                <button 
                                    type="button"
                                    onClick={() => dispatch({ type: 'SET_SHOW_EDIT_MODAL', payload: false })}
                                    style={{
                                        padding: '8px 16px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '4px',
                                        backgroundColor: 'white',
                                        cursor: 'pointer'
                                    }}
                                >
                                    取消
                                </button>
                                <button 
                                    type="submit"
                                    style={{
                                        padding: '8px 16px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        backgroundColor: primaryColor,
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                    disabled={state.loading}
                                >
                                    {state.loading ? (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Loader2 size={16} className="animate-spin" style={{ marginRight: '8px' }} />
                                            保存中...
                                        </div>
                                    ) : (
                                        '保存更改'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
});

// 这是本项目平台集成的必要条件
export default Component;