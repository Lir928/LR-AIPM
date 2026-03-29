import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import TaskList from './components/TaskList.jsx'
import TaskDetail from './components/TaskDetail.jsx'
import TaskCreate from './components/TaskCreate.jsx'
import TaskStats from './components/TaskStats.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<TaskList />} />
          <Route path="task/:id" element={<TaskDetail />} />
          <Route path="create" element={<TaskCreate />} />
          <Route path="stats" element={<TaskStats />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
)