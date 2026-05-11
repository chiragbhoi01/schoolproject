import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, CalendarCheck, Zap, BookOpen, TrendingUp,
  Award, AlertTriangle, CheckCircle, UserPlus, Upload, Calendar
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useAuthStore } from '../../store/authStore'
import { StatCard, SkeletonCard } from '../../components/ui/StatCard'
import { dashboardStats, attendanceTrend, semesterDistribution, activityCompletion, weeklyActivityData, recentActivities, upcomingEvents } from '../../data/dashboard'
import { cn } from '../../utils/helpers'

const COLORS = ['#9a4601', '#c2410c', '#2c694e', '#16a34a']

const iconMap = {
  upload: Upload,
  check: CheckCircle,
  'user-plus': UserPlus,
  award: Award,
  'alert-triangle': AlertTriangle,
  calendar: Calendar,
}

const activityIconColor = {
  submission: 'bg-blue-50 text-blue-600',
  attendance: 'bg-green-50 text-green-600',
  enrollment: 'bg-purple-50 text-purple-600',
  activity: 'bg-orange-50 text-orange-600',
  alert: 'bg-red-50 text-red-600',
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  const stats = [
    { title: 'Total Students', value: dashboardStats.totalStudents.toLocaleString(), subtitle: '+12 this month', icon: Users, color: 'primary', trend: 4.2 },
    { title: 'Avg Attendance', value: `${dashboardStats.attendancePercent}%`, subtitle: 'Across all courses', icon: CalendarCheck, color: 'green', trend: 2.1 },
    { title: 'Activities', value: dashboardStats.totalActivities, subtitle: '3 active, 3 upcoming', icon: Zap, color: 'orange', trend: 0 },
    { title: 'Active Teachers', value: dashboardStats.activeTeachers, subtitle: 'Across 6 departments', icon: BookOpen, color: 'purple', trend: 1.5 },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-900 border border-orange-100 dark:border-gray-800 rounded-xl px-3 py-2 shadow-lg text-xs">
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}{p.name === 'attendance' ? '%' : ''}</p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="page-title">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
            <span className="text-primary">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="page-subtitle">Here's what's happening with your institution today.</p>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((s, i) => <StatCard key={s.title} {...s} index={i} />)
        }
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Attendance Trend */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="section-title mb-0">Attendance Trend</h3>
              <p className="text-xs text-gray-500">Monthly overview — academic year 2023–24</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />+2.4%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="gradAtt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9a4601" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#9a4601" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3e8da" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="attendance" name="attendance" stroke="#9a4601" strokeWidth={2.5} fill="url(#gradAtt)" dot={{ fill: '#9a4601', r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Semester Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <h3 className="section-title">Semester Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={semesterDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="students">
                {semesterDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} students`]} contentStyle={{ borderRadius: 12, border: '1px solid #fed7aa', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {semesterDistribution.map((s, i) => (
              <div key={s.semester} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-600 dark:text-gray-400">{s.semester}</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{s.students}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Activity + Weekly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activity Completion */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-5"
        >
          <h3 className="section-title">Activity Completion Rate</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activityCompletion} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3e8da" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="%" />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #fed7aa', fontSize: 12 }} formatter={(v) => [`${v}%`]} />
              <Bar dataKey="completed" name="Completed" fill="#9a4601" radius={[0, 4, 4, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#fed7aa" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-5"
        >
          <h3 className="section-title">This Week — Attendance vs Submissions</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3e8da" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #fed7aa', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="present" name="Present" fill="#2c694e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" name="Absent" fill="#fca5a5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="card p-5 lg:col-span-2"
        >
          <h3 className="section-title">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => {
              const Icon = iconMap[activity.icon] || CheckCircle
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', activityIconColor[activity.type])}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{activity.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-5"
        >
          <h3 className="section-title">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/40 dark:bg-gray-800/40 hover:bg-orange-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div className="text-center flex-shrink-0">
                  <p className="text-sm font-bold text-primary leading-none">{event.date.split(' ')[1]}</p>
                  <p className="text-[10px] text-gray-500 leading-none mt-0.5">{event.date.split(' ')[0]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{event.title}</p>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', event.color)}>{event.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
