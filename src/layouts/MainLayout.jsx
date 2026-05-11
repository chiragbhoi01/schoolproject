import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, CalendarCheck, Zap, BarChart3, Settings,
  Bell, Search, Menu, X, Sun, Moon, LogOut, ChevronDown, GraduationCap,
  BookOpen, Award, User
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAppStore } from '../store/appStore'
import { getInitials, getAvatarColor, cn } from '../utils/helpers'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'teacher', 'student'] },
  { label: 'Students', icon: Users, path: '/students', roles: ['admin', 'teacher'] },
  { label: 'Attendance', icon: CalendarCheck, path: '/attendance', roles: ['admin', 'teacher', 'student'] },
  { label: 'Activities', icon: Zap, path: '/activities', roles: ['admin', 'teacher', 'student'] },
  { label: 'Reports', icon: BarChart3, path: '/reports', roles: ['admin', 'teacher'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['admin', 'teacher', 'student'] },
]

export default function MainLayout({ children }) {
  const { user, logout } = useAuthStore()
  const { sidebarOpen, darkMode, notifications, toggleSidebar, toggleDarkMode, markAllRead } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visibleNav = navItems.filter(item => item.roles.includes(user?.role))

  const pageTitle = navItems.find(n => location.pathname.startsWith(n.path))?.label || 'Dashboard'

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-orange-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          {(sidebarOpen || mobileSidebarOpen) && (
            <div>
              <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">SCAAMS</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">Smart Curriculum ERP</p>
            </div>
          )}
        </div>
      </div>

      {/* Role badge */}
      {(sidebarOpen || mobileSidebarOpen) && (
        <div className="px-4 pt-4">
          <div className="px-3 py-2 rounded-xl bg-orange-50 dark:bg-gray-800 border border-orange-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-primary uppercase tracking-wide">{user?.role}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{user?.department}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {(sidebarOpen || mobileSidebarOpen) && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 pb-2">Main Menu</p>
        )}
        {visibleNav.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-primary dark:hover:text-orange-400'
              )
            }
          >
            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
            {(sidebarOpen || mobileSidebarOpen) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-orange-100 dark:border-gray-800 pt-3">
        <div className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer',
          'hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors duration-150'
        )}>
          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0', getAvatarColor(user?.name))}>
            {getInitials(user?.name)}
          </div>
          {(sidebarOpen || mobileSidebarOpen) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className={cn('flex h-screen overflow-hidden', darkMode ? 'dark' : '')}>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 68 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden md:flex flex-col bg-white dark:bg-gray-950 border-r border-orange-100 dark:border-gray-800 flex-shrink-0 overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25 }}
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-950 z-50 md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-gray-950 border-b border-orange-100 dark:border-gray-800 flex items-center px-4 md:px-6 gap-4 flex-shrink-0">
          {/* Hamburger - Mobile */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Sidebar Toggle - Desktop */}
          <button
            onClick={toggleSidebar}
            className="hidden md:flex p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-gray-400 dark:text-gray-500">SCAAMS</span>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{pageTitle}</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-xs ml-2 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false) }}
                className="p-2 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors relative"
              >
                <Bell className="w-[18px] h-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-orange-100 dark:border-gray-800 z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-orange-100 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Notifications</h3>
                      <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={cn('px-4 py-3 hover:bg-orange-50/50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0', !n.read && 'bg-orange-50/30 dark:bg-orange-900/10')}>
                          <div className="flex items-start gap-3">
                            <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', n.read ? 'bg-gray-200' : 'bg-primary')} />
                            <div>
                              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{n.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => { setShowProfile(!showProfile); setShowNotifications(false) }}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold', getAvatarColor(user?.name))}>
                  {getInitials(user?.name)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-orange-100 dark:border-gray-800 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-orange-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.title}</p>
                    </div>
                    <div className="py-1.5">
                      <button
                        onClick={() => { navigate('/settings'); setShowProfile(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <User className="w-4 h-4" />Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-bg dark:bg-gray-950 p-4 md:p-6">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Click-away for dropdowns */}
      {(showNotifications || showProfile) && (
        <div className="fixed inset-0 z-30" onClick={() => { setShowNotifications(false); setShowProfile(false) }} />
      )}
    </div>
  )
}
