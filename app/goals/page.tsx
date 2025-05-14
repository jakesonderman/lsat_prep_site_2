'use client'
import { useState, useEffect } from 'react'
import { Plus, CheckCircle, Circle, Target, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Goal } from '../lib/models'

export default function Goals() {
  const { user, userData, saveUserData, isAuthenticated } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeCategory, setActiveCategory] = useState<'all' | Goal['category']>('all')
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'daily' as Goal['category'],
    dueDate: ''
  })

  const categories = [
    { key: 'all', label: 'All Goals', icon: Target },
    { key: 'daily', label: 'Daily', icon: CheckCircle },
    { key: 'weekly', label: 'Weekly', icon: Calendar },
    { key: 'monthly', label: 'Monthly', icon: Calendar },
    { key: 'test-day', label: 'Test Day', icon: Target }
  ]

  // Load goals from user data when available
  useEffect(() => {
    if (userData?.goals) {
      setGoals(userData.goals)
    }
  }, [userData])

  const addGoal = async () => {
    if (newGoal.title) {
      const newGoalItem: Goal = {
        id: Date.now().toString(),
        ...newGoal,
        completed: false,
        createdDate: new Date().toISOString().split('T')[0]
      }
      
      const updatedGoals = [...goals, newGoalItem]
      setGoals(updatedGoals)
      
      // Save to user data if authenticated
      if (isAuthenticated && userData) {
        await saveUserData({
          goals: updatedGoals
        })
      }
      
      setNewGoal({
        title: '',
        description: '',
        category: 'daily',
        dueDate: ''
      })
      setShowAddForm(false)
    }
  }

  const toggleGoal = async (id: string) => {
    const updatedGoals = goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    )
    
    setGoals(updatedGoals)
    
    // Save to user data if authenticated
    if (isAuthenticated && userData) {
      await saveUserData({
        goals: updatedGoals
      })
    }
  }

  const deleteGoal = async (id: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== id)
    
    setGoals(updatedGoals)
    
    // Save to user data if authenticated
    if (isAuthenticated && userData) {
      await saveUserData({
        goals: updatedGoals
      })
    }
  }

  const filteredGoals = goals.filter(goal => 
    activeCategory === 'all' || goal.category === activeCategory
  )

  const getCompletionStats = () => {
    const total = goals.length
    const completed = goals.filter(g => g.completed).length
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const stats = getCompletionStats()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 notebook-paper">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Goal Tracking</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Goal
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800">Completion Rate</h3>
            <p className="text-2xl font-bold text-green-900">{stats.percentage}%</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800">Completed Goals</h3>
            <p className="text-2xl font-bold text-blue-900">{stats.completed}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800">Total Goals</h3>
            <p className="text-2xl font-bold text-purple-900">{stats.total}</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => {
            const Icon = category.icon
            return (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key as any)}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  activeCategory === category.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </button>
            )
          })}
        </div>

        {/* User Status Message */}
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Note:</strong> You're not logged in. Your goals will be stored locally but won't be available across devices.
              <a href="/auth/login" className="text-blue-600 ml-2 underline">Log in</a> or 
              <a href="/auth/register" className="text-blue-600 ml-2 underline">register</a> to save your data.
            </p>
          </div>
        )}

        {/* Goals List */}
        <div className="space-y-3">
          {filteredGoals.map(goal => (
            <div key={goal.id} className={`border rounded-lg p-4 transition-colors ${
              goal.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => toggleGoal(goal.id)}
                    className="mt-1"
                  >
                    {goal.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400 hover:text-green-500" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className={`text-sm mt-1 ${goal.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                        {goal.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        goal.category === 'daily' ? 'bg-blue-100 text-blue-800' :
                        goal.category === 'weekly' ? 'bg-purple-100 text-purple-800' :
                        goal.category === 'monthly' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {goal.category}
                      </span>
                      {goal.dueDate && (
                        <span className="text-xs text-gray-500">
                          Due: {new Date(goal.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        Created: {new Date(goal.createdDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No goals yet. Start by adding your first goal!</p>
          </div>
        )}

        {/* Add Goal Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Goal</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <textarea
                  placeholder="Goal description (optional)"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg h-20"
                />
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="daily">Daily Goal</option>
                  <option value="weekly">Weekly Goal</option>
                  <option value="monthly">Monthly Goal</option>
                  <option value="test-day">Test Day Goal</option>
                </select>
                <input
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={addGoal}
                    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                  >
                    Add Goal
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 