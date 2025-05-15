'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Book, Calendar, CheckSquare, BarChart3, AlertTriangle, User, LogIn, LogOut, ChevronDown, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navigation() {
  const { user, isAuthenticated, logout } = useAuth()
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showMobileMenu && !target.closest('#mobile-menu') && !target.closest('#menu-button')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showMobileMenu]);

  const navLinks = [
    { href: '/', icon: <Book className="w-5 h-5 mr-2" />, text: 'Dashboard', active: true },
    { href: '/calendar', icon: <Calendar className="w-5 h-5 mr-2" />, text: 'Study Calendar', active: false },
    { href: '/wrong-answers', icon: <AlertTriangle className="w-5 h-5 mr-2" />, text: 'Wrong Answer Journal', active: false },
    { href: '/goals', icon: <CheckSquare className="w-5 h-5 mr-2" />, text: 'Goals', active: false },
    { href: '/progress', icon: <BarChart3 className="w-5 h-5 mr-2" />, text: 'Score Progress', active: false },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Home link - always visible */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600 font-semibold">
              <Book className="w-5 h-5 mr-2" />
              LSAT Prep
            </Link>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden md:flex md:space-x-4 lg:space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={`flex items-center px-1 pt-1 ${link.active ? 'text-gray-900' : 'text-gray-500'} hover:text-blue-600`}
              >
                {link.icon}
                <span>{link.text}</span>
              </Link>
            ))}
          </div>
          
          {/* Right side items */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="md:hidden mr-2">
              <button 
                id="menu-button"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                {showMobileMenu ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* User dropdown or login button */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                >
                  <User className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">{user?.username}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                
                {showUserDropdown && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50">
                    <div className="py-1 rounded-md bg-white shadow-xs">
                      <Link 
                        href="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setShowUserDropdown(false)
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

      {/* Mobile menu, show/hide based on menu state */}
      {showMobileMenu && (
        <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-200 shadow-lg absolute w-full z-40">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                onClick={() => setShowMobileMenu(false)}
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
} 