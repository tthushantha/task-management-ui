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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <LayoutDashboard className="h-8 w-8" />
                <span className="text-xl font-bold">Task Manager</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-700 transition">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link to="/tasks" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-700 transition">
                <ListTodo className="h-5 w-5" />
                <span>Tasks</span>
              </Link>
              <Link to="/projects" className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-700 transition">
                <FolderKanban className="h-5 w-5" />
                <span>Projects</span>
              </Link>
              
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md hover:bg-blue-700"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-blue-700">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-blue-800">
              <LayoutDashboard className="h-5 w-5 inline mr-2" />
              Dashboard
            </Link>
            <Link to="/tasks" className="block px-3 py-2 rounded-md hover:bg-blue-800">
              <ListTodo className="h-5 w-5 inline mr-2" />
              Tasks
            </Link>
            <Link to="/projects" className="block px-3 py-2 rounded-md hover:bg-blue-800">
              <FolderKanban className="h-5 w-5 inline mr-2" />
              Projects
            </Link>
            <button onClick={logout} className="block w-full text-left px-3 py-2 rounded-md hover:bg-blue-800">
              <LogOut className="h-5 w-5 inline mr-2" />
              Logout
            </button>
          </div>
        )}
      </nav>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
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
        <div className="text-center mb-8">
          <LayoutDashboard className="h-16 w-16 text-blue-600 mx-auto" />
          <h1 className="text-2xl font-bold mt-4 text-gray-800">Task Manager</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text"
              placeholder="Enter your username" 
              onChange={e => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="Enter your password"
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Credentials:</p>
          <p className="font-mono mt-1">admin / admin123</p>
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your task overview.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.total_tasks || 0}</p>
            </div>
            <ListTodo className="h-12 w-12 text-blue-600 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.in_progress_tasks || 0}</p>
            </div>
            <Clock className="h-12 w-12 text-yellow-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Completed</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.done_tasks || 0}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-500 opacity-50" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Overdue</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.overdue_tasks || 0}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-500 opacity-50" />
          </div>
        </div>
      </div>
      
      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Recent Tasks</h2>
          <Link to="/tasks/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            New Task
          </Link>
        </div>
        
        <div className="p-6">
          {stats?.recent_tasks?.length > 0 ? (
            <div className="space-y-4">
              {stats.recent_tasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{task.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{task.project_name || 'No Project'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'done' ? 'bg-green-100 text-green-800' :
                        task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        task.status === 'review' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status?.replace('_', ' ') || 'todo'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        task.priority === 'high' ? 'bg-yellow-100 text-yellow-800' :
                        task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.priority || 'medium'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ListTodo className="h-16 w-16 text-gray-300 mx-auto" />
              <p className="text-gray-500 mt-4">No tasks yet. Create your first task!</p>
              <Link to="/tasks/new" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Create Task
              </Link>
            </div>
          )}
        </div>
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <Link to="/tasks/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          New Task
        </Link>
      </div>
      
      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow-md">
        {tasks.length > 0 ? (
          <div className="divide-y">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{task.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {task.project_name || 'No Project'} • {task.assignee_name || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.status === 'done' ? 'bg-green-100 text-green-800' :
                      task.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'review' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status?.replace('_', ' ') || 'todo'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      task.priority === 'high' ? 'bg-yellow-100 text-yellow-800' :
                      task.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.priority || 'medium'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <ListTodo className="h-16 w-16 text-gray-300 mx-auto" />
            <p className="text-gray-500 mt-4">No tasks found.</p>
            <Link to="/tasks/new" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Create Task
            </Link>
          </div>
        )}
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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition duration-200"
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
