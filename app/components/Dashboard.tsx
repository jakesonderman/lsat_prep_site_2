'use client'
import { Calendar, CheckSquare, AlertTriangle, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">LSAT Prep Notebook</h1>
        <p className="text-gray-600 mt-2">Track your journey to LSAT success</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/calendar" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow notebook-paper">
            <div className="flex items-center mb-4">
              <Calendar className="w-8 h-8 text-blue-500 mr-3" />
              <h2 className="text-xl font-semibold">Study Calendar</h2>
            </div>
            <p className="text-gray-600">Plan and track your study sessions, set goals, and stay organized.</p>
          </div>
        </Link>

        <Link href="/wrong-answers" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow notebook-paper">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-xl font-semibold">Wrong Answer Journal</h2>
            </div>
            <p className="text-gray-600">Document incorrect questions to identify patterns and improve.</p>
          </div>
        </Link>

        <Link href="/goals" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow notebook-paper">
            <div className="flex items-center mb-4">
              <CheckSquare className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-xl font-semibold">Goal Tracking</h2>
            </div>
            <p className="text-gray-600">Set and check off your LSAT preparation milestones.</p>
          </div>
        </Link>

        <Link href="/progress" className="group">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow notebook-paper">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-8 h-8 text-purple-500 mr-3" />
              <h2 className="text-xl font-semibold">Score Progress</h2>
            </div>
            <p className="text-gray-600">Visualize your improvement with practice test scores.</p>
          </div>
        </Link>
      </div>
    </div>
  )
} 