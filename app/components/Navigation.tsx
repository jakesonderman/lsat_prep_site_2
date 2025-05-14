'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Book, Calendar, CheckSquare, BarChart3, AlertTriangle, User, LogIn, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

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
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                >
                  <User className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">{user?.username}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                
                {showDropdown && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg">
                    <div className="py-1 rounded-md bg-white shadow-xs">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setShowDropdown(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none transition ease-in-out duration-150">
                <LogIn className="w-5 h-5 mr-1" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 