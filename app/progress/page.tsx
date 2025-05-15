'use client'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Plus, TrendingUp, BarChart3, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ScoreRecord } from '../lib/models'

export default function Progress() {
  const { user, userData, saveUserData, isAuthenticated } = useAuth()
  const [scores, setScores] = useState<ScoreRecord[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [viewType, setViewType] = useState<'line' | 'bar'>('line')
  const [newScore, setNewScore] = useState({
    date: '',
    score: '',
    reading: '',
    logic: '',
    analytical: '',
    testType: 'practice',
    notes: ''
  })

  // Load scores from user data when available
  useEffect(() => {
    if (userData?.scoreRecords) {
      setScores(userData.scoreRecords)
    }
  }, [userData])

  const addScore = async () => {
    if (newScore.date && newScore.score) {
      const newScoreRecord: ScoreRecord = {
        id: Date.now().toString(),
        date: newScore.date,
        score: parseInt(newScore.score),
        totalPossible: 180, // LSAT has a maximum score of 180
        notes: `Reading: ${newScore.reading}, Logic: ${newScore.logic}, Analytical: ${newScore.analytical}, Type: ${newScore.testType}, Notes: ${newScore.notes}`,
      }
      
      const updatedScores = [...scores, newScoreRecord].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )
      
      setScores(updatedScores)
      
      // Save to user data if authenticated
      if (isAuthenticated && userData) {
        await saveUserData({
          scoreRecords: updatedScores
        })
      }
      
      setNewScore({
        date: '',
        score: '',
        reading: '',
        logic: '',
        analytical: '',
        testType: 'practice',
        notes: ''
      })
      setShowAddForm(false)
    }
  }

  const deleteScore = async (id: string) => {
    const updatedScores = scores.filter(score => score.id !== id)
    setScores(updatedScores)
    
    // Save to user data if authenticated
    if (isAuthenticated && userData) {
      await saveUserData({
        scoreRecords: updatedScores
      })
    }
  }

  const getStats = () => {
    if (scores.length === 0) return { current: 0, highest: 0, improvement: 0, average: 0 }
    
    const sortedScores = [...scores].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const current = sortedScores[sortedScores.length - 1]?.score || 0
    const highest = Math.max(...scores.map(s => s.score))
    const first = sortedScores[0]?.score || 0
    const improvement = current - first
    const average = Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length)

    return { current, highest, improvement, average }
  }

  // Parse section scores from notes field
  const parseScoreDetails = (score: ScoreRecord) => {
    if (!score.notes) return { reading: 0, logic: 0, analytical: 0, testType: 'practice' }
    
    const reading = parseInt(score.notes.match(/Reading: (\d+)/)?.[1] || '0')
    const logic = parseInt(score.notes.match(/Logic: (\d+)/)?.[1] || '0')
    const analytical = parseInt(score.notes.match(/Analytical: (\d+)/)?.[1] || '0')
    const testType = score.notes.match(/Type: (\w+)/)?.[1] || 'practice'
    
    return { reading, logic, analytical, testType }
  }

  const chartData = scores.map(score => {
    const details = parseScoreDetails(score)
    return {
      date: new Date(score.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: score.score,
      reading: details.reading,
      logic: details.logic,
      analytical: details.analytical
    }
  })

  const sectionData = scores.length > 0 ? [
    { section: 'Reading', average: Math.round(scores.reduce((sum, s) => sum + parseScoreDetails(s).reading, 0) / scores.length) },
    { section: 'Logic', average: Math.round(scores.reduce((sum, s) => sum + parseScoreDetails(s).logic, 0) / scores.length) },
    { section: 'Analytical', average: Math.round(scores.reduce((sum, s) => sum + parseScoreDetails(s).analytical, 0) / scores.length) }
  ] : []

  const stats = getStats()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 notebook-paper">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Score Progress</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Score
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800">Current Score</h3>
            <p className="text-2xl font-bold text-blue-900">{stats.current}</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800">Highest Score</h3>
            <p className="text-2xl font-bold text-green-900">{stats.highest}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-800">Improvement</h3>
            <p className={`text-2xl font-bold ${stats.improvement >= 0 ? 'text-green-900' : 'text-red-900'}`}>
              {stats.improvement >= 0 ? '+' : ''}{stats.improvement}
            </p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-orange-800">Average</h3>
            <p className="text-2xl font-bold text-orange-900">{stats.average}</p>
          </div>
        </div>

        {/* User Status Message */}
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Note:</strong> You're not logged in. Your score records will be stored locally but won't be available across devices.
              <a href="/auth/login" className="text-blue-600 ml-2 underline">Log in</a> or 
              <a href="/auth/register" className="text-blue-600 ml-2 underline">register</a> to save your data.
            </p>
          </div>
        )}

        {/* Chart Controls */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Score Trends</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewType('line')}
              className={`flex items-center px-3 py-2 rounded-lg ${
                viewType === 'line' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Line Chart
            </button>
            <button
              onClick={() => setViewType('bar')}
              className={`flex items-center px-3 py-2 rounded-lg ${
                viewType === 'bar' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Bar Chart
            </button>
          </div>
        </div>

        {/* Main Chart */}
        <div className="mb-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            {viewType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[120, 180]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[120, 180]} />
                <Tooltip />
                <Bar dataKey="score" fill="#8b5cf6" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Section Performance */}
        {sectionData.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Section Performance</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="section" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Score History */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Score History</h2>
          <div className="space-y-3">
            {scores.map(score => {
              const details = parseScoreDetails(score)
              return (
                <div key={score.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                  <button 
                    onClick={() => deleteScore(score.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Delete score record"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-purple-600">{score.score}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          details.testType === 'practice' ? 'bg-blue-100 text-blue-800' :
                          details.testType === 'diagnostic' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {details.testType}
                        </span>
                      </div>
                      <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                        <span>Reading: {details.reading}</span>
                        <span>Logic: {details.logic}</span>
                        <span>Analytical: {details.analytical}</span>
                      </div>
                      {score.notes && score.notes.includes('Notes: ') && (
                        <p className="text-sm text-gray-600 mt-2">
                          {score.notes.split('Notes: ')[1]}
                        </p>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 mr-6">
                      {new Date(score.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {scores.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No scores yet. Add your first practice test score to start tracking progress!</p>
          </div>
        )}

        {/* Add Score Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Test Score</h3>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <input
                  type="date"
                  value={newScore.date}
                  onChange={(e) => setNewScore(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Total Score (120-180)"
                  value={newScore.score}
                  onChange={(e) => setNewScore(prev => ({ ...prev, score: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="120"
                  max="180"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Reading"
                    value={newScore.reading}
                    onChange={(e) => setNewScore(prev => ({ ...prev, reading: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Logic"
                    value={newScore.logic}
                    onChange={(e) => setNewScore(prev => ({ ...prev, logic: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Analytical"
                    value={newScore.analytical}
                    onChange={(e) => setNewScore(prev => ({ ...prev, analytical: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <select
                  value={newScore.testType}
                  onChange={(e) => setNewScore(prev => ({ ...prev, testType: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="practice">Practice Test</option>
                  <option value="diagnostic">Diagnostic</option>
                  <option value="official">Official Test</option>
                </select>
                <textarea
                  placeholder="Notes (optional)"
                  value={newScore.notes}
                  onChange={(e) => setNewScore(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg h-20"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={addScore}
                    className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
                  >
                    Add Score
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