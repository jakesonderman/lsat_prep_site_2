'use client'
import Link from 'next/link'
import { Book, Calendar, CheckSquare, BarChart3, AlertTriangle } from 'lucide-react'

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link href="/" className="flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600">
              <Book className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
            <Link href="/calendar" className="flex items-center px-1 pt-1 text-gray-500 hover:text-blue-600">
              <Calendar className="w-5 h-5 mr-2" />
              Study Calendar
            </Link>
            <Link href="/wrong-answers" className="flex items-center px-1 pt-1 text-gray-500 hover:text-blue-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Wrong Answer Journal
            </Link>
            <Link href="/goals" className="flex items-center px-1 pt-1 text-gray-500 hover:text-blue-600">
              <CheckSquare className="w-5 h-5 mr-2" />
              Goals
            </Link>
            <Link href="/progress" className="flex items-center px-1 pt-1 text-gray-500 hover:text-blue-600">
              <BarChart3 className="w-5 h-5 mr-2" />
              Score Progress
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 