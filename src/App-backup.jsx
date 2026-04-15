import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'
import {
  LayoutDashboard,
  ListTodo,
  FolderKanban,
  LogOut,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Menu,
  ChevronDown
} from 'lucide-react'

// ✅ FIXED BACKEND URL
const API_BASE = 'http://127.0.0.1:8000'

// Auth Context
const AuthContext = React.createContext(null)
function useAuth() {
  return React.useContext(AuthContext)
}

// Protected Route
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  return children
}

// Layout
function Layout({ children }) {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div>
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <Link to="/" className="font-bold">Task Manager</Link>

        <div className="hidden md:flex gap-4">
          <Link to="/">Dashboard</Link>
          <Link to="/tasks">Tasks</Link>
          <Link to="/projects">Projects</Link>

          <button onClick={logout}>Logout</button>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu />
        </button>
      </nav>

      <main className="p-4">{children}</main>
    </div>
  )
}

// Login Page
function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(username, password)
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="username" onChange={e => setUsername(e.target.value)} />
      <input type="password" onChange={e => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  )
}

// ✅ FIXED DASHBOARD
function DashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/tasks`)
      const tasks = res.data.tasks

      const total = tasks.length
      const inProgress = tasks.filter(t => t.status === "in_progress").length
      const completed = tasks.filter(t => t.status === "done").length

      setStats({
        total_tasks: total,
        in_progress_tasks: inProgress,
        done_tasks: completed,
        overdue_tasks: 0,
        recent_tasks: tasks
      })

    } catch (err) {
      console.log(err)
    }
  }

  if (!stats) return <div>Loading...</div>

  return (
    <div>
      <h1>Dashboard</h1>

      <div style={{ display: 'flex', gap: 20 }}>
        <div>Total: {stats.total_tasks}</div>
        <div>In Progress: {stats.in_progress_tasks}</div>
        <div>Done: {stats.done_tasks}</div>
        <div>Overdue: {stats.overdue_tasks}</div>
      </div>
    </div>
  )
}

// Tasks Page
function TasksPage() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const res = await axios.get(`${API_BASE}/api/tasks`)
    setTasks(res.data.tasks)
  }

  return (
    <div>
      <h1>Tasks</h1>
      {tasks.map(t => (
        <div key={t.id}>{t.title}</div>
      ))}
    </div>
  )
}

// Main App
function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = async (username, password) => {
    const res = await axios.post(`${API_BASE}/api/login`, {
      username,
      password
    })

    if (res.data.username) {
      setUser(res.data)
    }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      <Router>
        <Routes>

          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/tasks" element={
            <ProtectedRoute>
              <Layout>
                <TasksPage />
              </Layout>
            </ProtectedRoute>
          } />

        </Routes>
      </Router>
    </AuthContext.Provider>
  )
}

export default App