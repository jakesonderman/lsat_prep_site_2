'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserData } from '../lib/models'

interface User {
  id: string
  username: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  saveUserData: (data: Partial<UserData>) => Promise<boolean>
  refreshUserData: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session)
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        // Fetch user data if user exists
        fetchUserData(parsedUser.id)
      } catch (error) {
        console.error('Failed to parse stored user:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const fetchUserData = async (userId: string) => {
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/user-data')
      // const data = await response.json()
      
      // For now, let's check if there's any stored user data
      const storedUserData = localStorage.getItem(`userData_${userId}`)
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData))
      } else {
        // Create empty user data structure
        const emptyUserData: UserData = {
          userId,
          wrongAnswers: [],
          goals: [],
          calendarEvents: [],
          scoreRecords: [],
          lastUpdated: new Date().toISOString()
        }
        setUserData(emptyUserData)
        localStorage.setItem(`userData_${userId}`, JSON.stringify(emptyUserData))
      }
      return true
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      return false
    }
  }

  const saveUserData = async (data: Partial<UserData>): Promise<boolean> => {
    if (!user) return false
    
    try {
      // In a real implementation, this would be an API call
      // const response = await fetch('/api/user-data', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })
      // const result = await response.json()
      
      // For now, we'll update the local storage
      const updatedUserData = {
        ...userData,
        ...data,
        lastUpdated: new Date().toISOString()
      }
      setUserData(updatedUserData as UserData)
      localStorage.setItem(`userData_${user.id}`, JSON.stringify(updatedUserData))
      return true
    } catch (error) {
      console.error('Failed to save user data:', error)
      return false
    }
  }

  const refreshUserData = async (): Promise<boolean> => {
    if (!user) return false
    return fetchUserData(user.id)
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      // This is a placeholder for the actual API call
      // In a real implementation, you would call your API endpoint
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // })
      // const data = await response.json()
      
      // For now, we'll simulate a successful login with dummy data
      const mockUser = {
        id: '123',
        username: email.split('@')[0],
        email: email,
        name: email.split('@')[0]
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      // Fetch user data after successful login
      await fetchUserData(mockUser.id)
      
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      // This is a placeholder for the actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, email, password }),
      // })
      // const data = await response.json()
      
      // For now, we'll simulate a successful registration with dummy data
      const mockUser = {
        id: '123',
        username,
        email,
        name: username
      }
      
      setUser(mockUser)
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      // Create empty user data for new user
      const emptyUserData: UserData = {
        userId: mockUser.id,
        wrongAnswers: [],
        goals: [],
        calendarEvents: [],
        scoreRecords: [],
        lastUpdated: new Date().toISOString()
      }
      setUserData(emptyUserData)
      localStorage.setItem(`userData_${mockUser.id}`, JSON.stringify(emptyUserData))
      
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setUserData(null)
    localStorage.removeItem('user')
    // We don't remove user data from localStorage to allow for data persistence
    // between sessions, but in a real implementation you might want to clear
    // sensitive data or sync with the server before logging out
  }

  const value = {
    user,
    userData,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    saveUserData,
    refreshUserData
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 