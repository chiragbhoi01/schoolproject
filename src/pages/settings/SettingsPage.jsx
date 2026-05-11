import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  User, Bell, Palette, Shield, Save, Camera,
  Moon, Sun, Eye, EyeOff, Check, Lock, Mail
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useAppStore } from '../../store/appStore'
import { Avatar } from '../../components/ui/Avatar'
import { cn } from '../../utils/helpers'
import toast from 'react-hot-toast'

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'theme', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
]

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore()
  const { darkMode, toggleDarkMode } = useAppStore()
  const [activeTab, setActiveTab] = useState('profile')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [notifSettings, setNotifSettings] = useState({
    emailAttendance: true,
    emailActivity: true,
    emailAnnouncement: false,
    pushAttendance: true,
    pushActivity: false,
    pushAlert: true,
    weeklyReport: true,
    monthlyReport: false,
  })

  const { register, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: { name: user?.name, email: user?.email, department: user?.department, title: user?.title, phone: '' }
  })

  const onProfileSave = (data) => {
    updateProfile(data)
    toast.success('Profile updated!')
  }

  const onPasswordSave = () => {
    toast.success('Password changed!')
  }

  const toggleNotif = (key) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }))
    toast('Notification preference saved', { icon: '🔔', duration: 1500 })
  }

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'w-11 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0',
        checked ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
      )}
    >
      <span className={cn(
        'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200',
        checked ? 'left-6' : 'left-1'
      )} />
    </button>
  )

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and system settings</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="sm:w-52 flex-shrink-0">
          <div className="card p-2 space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-800 hover:text-primary'
                )}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-5">Profile Information</h3>

                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-orange-50 dark:border-gray-800">
                  <div className="relative">
                    <Avatar name={user?.name} size="xl" />
                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors">
                      <Camera className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{user?.name}</h4>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-orange-50 text-primary text-xs font-semibold rounded-full capitalize">{user?.role}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onProfileSave)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Full Name</label>
                      <input className="input-field" {...register('name')} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email Address</label>
                      <input type="email" className="input-field" {...register('email')} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Department</label>
                      <input className="input-field" {...register('department')} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Title / Designation</label>
                      <input className="input-field" {...register('title')} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Phone Number</label>
                      <input className="input-field" placeholder="+91 98765 43210" {...register('phone')} />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="btn-primary">
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Theme */}
            {activeTab === 'theme' && (
              <div className="card p-6 space-y-6">
                <h3 className="font-semibold text-gray-900 dark:text-white">Appearance Settings</h3>

                <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50/50 dark:bg-gray-800/50 border border-orange-100 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Dark Mode</p>
                      <p className="text-xs text-gray-500">Switch between light and dark themes</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={cn('w-12 h-6 rounded-full relative transition-colors duration-200', darkMode ? 'bg-primary' : 'bg-gray-200')}
                  >
                    <span className={cn('absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all', darkMode ? 'left-7' : 'left-1')} />
                  </button>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Color Theme</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { name: 'Terracotta', primary: '#9a4601', secondary: '#2c694e', active: true },
                      { name: 'Ocean Blue', primary: '#1d4ed8', secondary: '#0891b2', active: false },
                      { name: 'Royal Purple', primary: '#7c3aed', secondary: '#db2777', active: false },
                    ].map(theme => (
                      <div
                        key={theme.name}
                        onClick={() => toast(theme.active ? 'Already active!' : `${theme.name} theme coming soon!`, { icon: '🎨' })}
                        className={cn('p-3 rounded-xl border-2 cursor-pointer transition-all', theme.active ? 'border-primary' : 'border-gray-100 dark:border-gray-700 hover:border-gray-200')}
                      >
                        <div className="flex gap-1.5 mb-2">
                          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.primary }} />
                          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.secondary }} />
                        </div>
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{theme.name}</p>
                        {theme.active && <p className="text-[10px] text-primary font-semibold mt-0.5 flex items-center gap-1"><Check className="w-3 h-3" />Active</p>}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Sidebar</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Compact sidebar by default', key: 'compactSidebar', checked: false },
                      { label: 'Show category labels', key: 'showLabels', checked: true },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                        <ToggleSwitch checked={item.checked} onChange={() => toast('Preference saved', { duration: 1200 })} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="card p-6 space-y-6">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>

                {[
                  {
                    title: 'Email Notifications', items: [
                      { label: 'Attendance alerts', sub: 'When a student\'s attendance drops below threshold', key: 'emailAttendance' },
                      { label: 'Activity updates', sub: 'New assignments, deadlines and submissions', key: 'emailActivity' },
                      { label: 'Announcements', sub: 'Institutional news and announcements', key: 'emailAnnouncement' },
                    ]
                  },
                  {
                    title: 'Push Notifications', items: [
                      { label: 'Attendance marked', sub: 'When daily attendance is recorded', key: 'pushAttendance' },
                      { label: 'Activity deadlines', sub: 'Remind me before activity due dates', key: 'pushActivity' },
                      { label: 'Critical alerts', sub: 'Important system and student alerts', key: 'pushAlert' },
                    ]
                  },
                  {
                    title: 'Reports', items: [
                      { label: 'Weekly summary', sub: 'Receive weekly performance digest every Monday', key: 'weeklyReport' },
                      { label: 'Monthly report', sub: 'Comprehensive monthly analytics report', key: 'monthlyReport' },
                    ]
                  },
                ].map(section => (
                  <div key={section.title}>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{section.title}</h4>
                    <div className="space-y-2">
                      {section.items.map(item => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-orange-50/30 dark:bg-gray-800/50 border border-orange-50 dark:border-gray-700 hover:bg-orange-50/60 dark:hover:bg-gray-800 transition-colors">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                          </div>
                          <ToggleSwitch checked={notifSettings[item.key]} onChange={() => toggleNotif(item.key)} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="space-y-5">
                <div className="card p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type={showCurrentPw ? 'text' : 'password'} className="input-field pl-10 pr-10" placeholder="••••••••" />
                        <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type={showNewPw ? 'text' : 'password'} className="input-field pl-10 pr-10" placeholder="Minimum 8 characters" />
                        <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="password" className="input-field pl-10" placeholder="Re-enter new password" />
                      </div>
                    </div>
                    <button onClick={onPasswordSave} className="btn-primary">
                      <Save className="w-4 h-4" /> Update Password
                    </button>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Session & Security</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Two-factor authentication', sub: 'Add extra security to your account', enabled: false },
                      { label: 'Active session alerts', sub: 'Get notified of new logins', enabled: true },
                      { label: 'Auto-lock on idle', sub: 'Lock session after 30 minutes of inactivity', enabled: true },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
                        </div>
                        <ToggleSwitch checked={item.enabled} onChange={() => toast('Security preference saved')} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
