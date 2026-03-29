import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Menu, Bell, User, Home, BarChart, Settings } from 'lucide-react'

function App() {
  return (
    <div className="flex h-screen bg-light">
      {/* 侧边栏 */}
      <aside className="w-60 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary">任务中心</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center p-2 rounded-md bg-primary/10 text-primary">
                <Home className="w-5 h-5 mr-2" />
                <span>任务中心</span>
              </Link>
            </li>
            <li>
              <Link to="/stats" className="flex items-center p-2 rounded-md hover:bg-light">
                <BarChart className="w-5 h-5 mr-2" />
                <span>任务统计</span>
              </Link>
            </li>
            <li>
              <Link to="/settings" className="flex items-center p-2 rounded-md hover:bg-light">
                <Settings className="w-5 h-5 mr-2" />
                <span>系统设置</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Menu className="w-6 h-6 mr-4" />
            <h2 className="text-lg font-semibold">任务中心</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-light">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-light">
              <User className="w-5 h-5" />
              <span className="text-sm">张三</span>
            </button>
          </div>
        </header>

        {/* 内容区域 */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default App