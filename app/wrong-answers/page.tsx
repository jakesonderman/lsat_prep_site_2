'use client'
import { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'

interface WrongAnswer {
  id: string
  date: string
  section: string
  questionType: string
  question: string
  yourAnswer: string
  correctAnswer: string
  explanation: string
  tags: string[]
}

export default function WrongAnswerJournal() {
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSection, setFilterSection] = useState('all')
  const [newAnswer, setNewAnswer] = useState({
    section: '',
    questionType: '',
    question: '',
    yourAnswer: '',
    correctAnswer: '',
    explanation: '',
    tags: ''
  })

  const sections = ['Reading Comprehension', 'Logical Reasoning', 'Analytical Reasoning']

  const addWrongAnswer = () => {
    if (newAnswer.question && newAnswer.correctAnswer) {
      setWrongAnswers(prev => [...prev, {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        section: newAnswer.section,
        questionType: newAnswer.questionType,
        question: newAnswer.question,
        yourAnswer: newAnswer.yourAnswer,
        correctAnswer: newAnswer.correctAnswer,
        explanation: newAnswer.explanation,
        tags: newAnswer.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      }])
      setNewAnswer({
        section: '',
        questionType: '',
        question: '',
        yourAnswer: '',
        correctAnswer: '',
        explanation: '',
        tags: ''
      })
      setShowAddForm(false)
    }
  }

  const filteredAnswers = wrongAnswers.filter(answer => {
    const matchesSearch = answer.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         answer.questionType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterSection === 'all' || answer.section === filterSection
    return matchesSearch && matchesFilter
  })

  const getTypeCount = () => {
    const counts: Record<string, number> = {}
    wrongAnswers.forEach(answer => {
      counts[answer.questionType] = (counts[answer.questionType] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 notebook-paper">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Wrong Answer Journal</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-800">Total Wrong Answers</h3>
            <p className="text-2xl font-bold text-red-900">{wrongAnswers.length}</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-orange-800">Most Common Type</h3>
            <p className="text-lg font-semibold text-orange-900">
              {getTypeCount()[0]?.[0] || 'N/A'}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800">This Week</h3>
            <p className="text-2xl font-bold text-blue-900">
              {wrongAnswers.filter(a => {
                const today = new Date()
                const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                return new Date(a.date) >= weekAgo
              }).length}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search wrong answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Sections</option>
            {sections.map(section => (
              <option key={section} value={section}>{section}</option>
            ))}
          </select>
        </div>

        {/* Wrong Answers List */}
        <div className="space-y-4">
          {filteredAnswers.map(answer => (
            <div key={answer.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                    {answer.section}
                  </span>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                    {answer.questionType}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{answer.date}</span>
              </div>
              
              <div className="space-y-2">
                <div>
                  <strong className="text-sm text-gray-700">Question:</strong>
                  <p className="text-gray-900">{answer.question}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-sm text-red-600">Your Answer:</strong>
                    <p className="text-gray-900">{answer.yourAnswer}</p>
                  </div>
                  <div>
                    <strong className="text-sm text-green-600">Correct Answer:</strong>
                    <p className="text-gray-900">{answer.correctAnswer}</p>
                  </div>
                </div>
                {answer.explanation && (
                  <div>
                    <strong className="text-sm text-gray-700">Explanation:</strong>
                    <p className="text-gray-900">{answer.explanation}</p>
                  </div>
                )}
                {answer.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {answer.tags.map(tag => (
                      <span key={tag} className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Add Wrong Answer</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={newAnswer.section}
                    onChange={(e) => setNewAnswer(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Section</option>
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Question Type (e.g., Assumption, Strengthen)"
                    value={newAnswer.questionType}
                    onChange={(e) => setNewAnswer(prev => ({ ...prev, questionType: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <textarea
                  placeholder="Question text"
                  value={newAnswer.question}
                  onChange={(e) => setNewAnswer(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg h-24"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your answer"
                    value={newAnswer.yourAnswer}
                    onChange={(e) => setNewAnswer(prev => ({ ...prev, yourAnswer: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Correct answer"
                    value={newAnswer.correctAnswer}
                    onChange={(e) => setNewAnswer(prev => ({ ...prev, correctAnswer: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <textarea
                  placeholder="Explanation (optional)"
                  value={newAnswer.explanation}
                  onChange={(e) => setNewAnswer(prev => ({ ...prev, explanation: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg h-20"
                />
                <input
                  type="text"
                  placeholder="Tags (comma-separated)"
                  value={newAnswer.tags}
                  onChange={(e) => setNewAnswer(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={addWrongAnswer}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    Add Entry
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