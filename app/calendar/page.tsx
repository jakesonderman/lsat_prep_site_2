'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { CalendarEvent } from '../lib/models'

export default function Calendar() {
  const { user, userData, saveUserData, isAuthenticated } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    category: 'goal'
  })

  // Load calendar events from user data when available
  useEffect(() => {
    if (userData?.calendarEvents) {
      setEvents(userData.calendarEvents)
    }
  }, [userData])

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const addEvent = async () => {
    if (newEvent.title && newEvent.date) {
      const newCalendarEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: newEvent.date,
        category: newEvent.category
      }
      
      const updatedEvents = [...events, newCalendarEvent]
      setEvents(updatedEvents)
      
      // Save to user data if authenticated
      if (isAuthenticated && userData) {
        await saveUserData({
          calendarEvents: updatedEvents
        })
      }
      
      setNewEvent({ title: '', date: '', category: 'goal' })
      setShowAddForm(false)
    }
  }

  const toggleEvent = async (id: string) => {
    const updatedEvents = events.map(event => 
      event.id === id ? { 
        ...event, 
        completed: !('completed' in event ? event.completed : false) 
      } : event
    ) as CalendarEvent[]
    
    setEvents(updatedEvents)
    
    // Save to user data if authenticated
    if (isAuthenticated && userData) {
      await saveUserData({
        calendarEvents: updatedEvents
      })
    }
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayEvents = events.filter(event => event.date === dateStr)

      days.push(
        <div key={day} className="p-2 border border-gray-200 min-h-[100px] bg-white">
          <div className="font-semibold text-gray-900">{day}</div>
          <div className="mt-1 space-y-1">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                onClick={() => toggleEvent(event.id)}
                className={`text-xs p-1 rounded cursor-pointer ${
                  event.category === 'goal' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                } ${('completed' in event && event.completed) ? 'line-through opacity-60' : ''}`}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      )
    }

    return days
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 notebook-paper">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Study Calendar</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigateMonth('prev')} className="p-2 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => navigateMonth('next')} className="p-2 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* User Status Message */}
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              <strong>Note:</strong> You're not logged in. Your calendar events will be stored locally but won't be available across devices.
              <a href="/auth/login" className="text-blue-600 ml-2 underline">Log in</a> or 
              <a href="/auth/register" className="text-blue-600 ml-2 underline">register</a> to save your data.
            </p>
          </div>
        )}

        <div className="grid grid-cols-7 gap-0 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-semibold text-gray-700 bg-gray-50 border border-gray-200">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0">
          {renderCalendarDays()}
        </div>

        {/* Add Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add Study Event</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="goal">Study Goal</option>
                  <option value="assignment">Assignment</option>
                </select>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={addEvent}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                  >
                    Add Event
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