import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'

// Configure axios to include credentials for session handling
axios.defaults.withCredentials = true

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

const API_BASE = 'https://task-management-psi-sandy-64.vercel.app'

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
    try {
      await login(username, password)
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            placeholder="username" 
            onChange={e => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <input 
            type="password" 
            placeholder="password"
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          <p>Demo credentials: admin / admin123</p>
        </div>
      </div>
    </div>
  )
}

// Dashboard Page
function DashboardPage() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/dashboard/stats`)
      setStats(res.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  if (!stats) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
        <div className="bg-white p-4 rounded shadow">
          <div>Total: {stats.total_tasks}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div>In Progress: {stats.in_progress_tasks}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div>Done: {stats.done_tasks}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div>Overdue: {stats.overdue_tasks}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Tasks</h2>
          <Link to="/tasks/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            New Task
          </Link>
        </div>
        {stats.recent_tasks?.map(task => (
          <div key={task.id} className="border-b p-3">
            <div className="font-semibold">{task.title}</div>
            <div className="text-sm text-gray-500">{task.project_name}</div>
          </div>
        ))}
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
    try {
      const res = await axios.get(`${API_BASE}/tasks`)
      setTasks(res.data.tasks || [])
    } catch (err) {
      console.error('Error fetching tasks:', err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link to="/tasks/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          New Task
        </Link>
      </div>
      
      <div className="bg-white rounded shadow">
        {tasks.map(t => (
          <div key={t.id} className="border-b p-4">
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm text-gray-500">{t.project_name} • {t.assignee_name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Task Form Page
function TaskFormPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(`${API_BASE}/tasks`, formData)
      navigate(`/tasks/${response.data.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main App
function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in by verifying session with backend
    const checkAuth = async () => {
      try {
        await axios.get(`${API_BASE}/dashboard/stats`)
        // If we can access dashboard stats, we're authenticated
        setLoading(false)
      } catch (err) {
        // Not authenticated, clear user state
        setUser(null)
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (username, password) => {
    const response = await axios.post(`${API_BASE}/login`, {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (response.data.username) {
      setUser({ username: response.data.username, full_name: username })
    } else {
      throw new Error('Login failed')
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`)
    } catch (err) {
      console.error('Logout error:', err)
    }
    setUser(null)
  }

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

          <Route path="/tasks/new" element={
            <ProtectedRoute>
              <Layout>
                <TaskFormPage />
              </Layout>
            </ProtectedRoute>
          } />

        </Routes>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
