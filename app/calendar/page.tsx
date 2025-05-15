'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Plus, X, Edit } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { CalendarEvent } from '../lib/models'

export default function Calendar() {
  const { user, userData, saveUserData, isAuthenticated } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    category: 'goal',
    description: ''
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
        category: newEvent.category,
        description: newEvent.description
      }
      
      const updatedEvents = [...events, newCalendarEvent]
      setEvents(updatedEvents)
      
      // Save to user data if authenticated
      if (isAuthenticated && userData) {
        await saveUserData({
          calendarEvents: updatedEvents
        })
      }
      
      resetFormAndClose()
    }
  }

  const updateEvent = async () => {
    if (selectedEvent && newEvent.title && newEvent.date) {
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id ? { 
          ...event, 
          title: newEvent.title,
          date: newEvent.date,
          category: newEvent.category,
          description: newEvent.description
        } : event
      )
      
      setEvents(updatedEvents)
      
      // Save to user data if authenticated
      if (isAuthenticated && userData) {
        await saveUserData({
          calendarEvents: updatedEvents
        })
      }
      
      resetFormAndClose()
    }
  }

  const deleteEvent = async (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id)
    setEvents(updatedEvents)
    
    // Save to user data if authenticated
    if (isAuthenticated && userData) {
      await saveUserData({
        calendarEvents: updatedEvents
      })
    }
    
    resetFormAndClose()
  }

  const resetFormAndClose = () => {
    setNewEvent({ title: '', date: '', category: 'goal', description: '' })
    setSelectedEvent(null)
    setShowAddForm(false)
    setIsEditing(false)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setNewEvent({
      title: event.title,
      date: event.date,
      category: event.category,
      description: event.description || ''
    })
    setShowAddForm(true)
    setIsEditing(true)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-1 sm:p-2"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayEvents = events.filter(event => event.date === dateStr)

      days.push(
        <div key={day} className="p-1 sm:p-2 border border-gray-200 min-h-[60px] sm:min-h-[100px] bg-white">
          <div className="font-semibold text-gray-900 text-sm sm:text-base">{day}</div>
          <div className="mt-1 space-y-1 overflow-y-auto max-h-[40px] sm:max-h-[80px]">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                onClick={() => handleEventClick(event)}
                className={`text-[10px] sm:text-xs p-1 rounded cursor-pointer truncate ${
                  event.category === 'goal' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                } ${('completed' in event && event.completed) ? 'line-through opacity-60' : ''}`}
                title={event.title}
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
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 notebook-paper">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Study Calendar</h1>
          <button
            onClick={() => {
              resetFormAndClose();
              setShowAddForm(true);
            }}
            className="flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 mr-1 sm:mr-2" />
            Add Event
          </button>
        </div>

        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <button onClick={() => navigateMonth('prev')} className="p-1 sm:p-2 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <h2 className="text-base sm:text-xl font-semibold">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => navigateMonth('next')} className="p-1 sm:p-2 hover:bg-gray-100 rounded">
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* User Status Message */}
        {!isAuthenticated && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <p className="text-yellow-800 text-xs sm:text-sm">
              <strong>Note:</strong> You're not logged in. Your calendar events will be stored locally but won't be available across devices.
              <a href="/auth/login" className="text-blue-600 ml-1 sm:ml-2 underline">Log in</a> or 
              <a href="/auth/register" className="text-blue-600 ml-1 sm:ml-2 underline">register</a> to save your data.
            </p>
          </div>
        )}

        <div className="grid grid-cols-7 gap-0 mb-2 sm:mb-4 text-[10px] sm:text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-1 sm:p-3 text-center font-semibold text-gray-700 bg-gray-50 border border-gray-200">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0">
          {renderCalendarDays()}
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold">{isEditing ? 'Edit Event' : 'Add Study Event'}</h3>
                <button onClick={resetFormAndClose} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                />
                <select
                  value={newEvent.category}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                >
                  <option value="goal">Study Goal</option>
                  <option value="assignment">Assignment</option>
                </select>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg h-20 sm:h-24 resize-none text-sm sm:text-base"
                ></textarea>
                <div className="flex space-x-2 sm:space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={updateEvent}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                      >
                        Update Event
                      </button>
                      <button
                        onClick={() => selectedEvent && deleteEvent(selectedEvent.id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm sm:text-base"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={addEvent}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 text-sm sm:text-base"
                      >
                        Add Event
                      </button>
                      <button
                        onClick={resetFormAndClose}
                        className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 