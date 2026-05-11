import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { BarChart3, Download, TrendingUp, Users, CalendarCheck, Zap } from 'lucide-react'
import { attendanceTrend, semesterDistribution, activityCompletion, weeklyActivityData } from '../../data/dashboard'
import { attendanceSummary, monthlyTrend } from '../../data/attendance'
import { studentsData } from '../../data/students'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { cn, getAttendanceColor } from '../../utils/helpers'
import toast from 'react-hot-toast'

const COLORS = ['#9a4601', '#c2410c', '#2c694e', '#16a34a', '#6366f1', '#ec4899']

const performanceData = [
  { subject: 'DSA', avg: 72, highest: 95, lowest: 42 },
  { subject: 'Web Tech', avg: 78, highest: 98, lowest: 55 },
  { subject: 'DBMS', avg: 81, highest: 97, lowest: 60 },
  { subject: 'OS', avg: 68, highest: 90, lowest: 38 },
  { subject: 'ML', avg: 74, highest: 96, lowest: 48 },
  { subject: 'Cloud', avg: 76, highest: 93, lowest: 52 },
]

const topStudents = studentsData.filter(s => s.cgpa >= 8.5).sort((a, b) => b.cgpa - a.cgpa).slice(0, 5)

export default function ReportsPage() {
  const handleExport = (type) => {
    toast.success(`${type} report exported!`, { icon: '📊' })
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-900 border border-orange-100 dark:border-gray-800 rounded-xl px-3 py-2 shadow-lg text-xs">
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}{p.name?.includes('ttendance') || p.name?.includes('ercentage') ? '%' : ''}</p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Analytics & Reports</h1>
          <p className="page-subtitle">Comprehensive insights into attendance, performance and activities</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['Attendance', 'Performance', 'Activities'].map(type => (
            <button key={type} onClick={() => handleExport(type)} className="btn-ghost border border-gray-200 text-xs py-2">
              <Download className="w-3.5 h-3.5" /> {type}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Avg Attendance', value: '84.7%', icon: CalendarCheck, color: 'text-green-600 bg-green-50', trend: '+2.1%' },
          { label: 'Total Students', value: '284', icon: Users, color: 'text-primary bg-orange-50', trend: '+12' },
          { label: 'Activities Done', value: '5/8', icon: Zap, color: 'text-purple-600 bg-purple-50', trend: '62.5%' },
          { label: 'Avg CGPA', value: '8.24', icon: TrendingUp, color: 'text-blue-600 bg-blue-50', trend: '+0.3' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card p-4">
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', stat.color.split(' ')[1])}>
                <stat.icon className={cn('w-5 h-5', stat.color.split(' ')[0])} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{stat.value}</p>
                <p className="text-[10px] text-green-600 font-semibold">{stat.trend} this month</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Attendance Trend + Semester Dist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title mb-0">Attendance Over Time</h3>
            <button onClick={() => handleExport('Attendance')} className="text-xs text-primary hover:underline flex items-center gap-1">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceTrend}>
              <defs>
                <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9a4601" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#9a4601" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3e8da" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="attendance" name="Attendance" stroke="#9a4601" strokeWidth={2.5} fill="url(#gradA)" dot={{ fill: '#9a4601', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
          <h3 className="section-title">Student Distribution</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={semesterDistribution} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={3} dataKey="students">
                {semesterDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v} students`]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {semesterDistribution.map((s, i) => (
              <div key={s.semester} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-gray-600 dark:text-gray-400">{s.semester}</span>
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{s.students} students</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <h3 className="section-title">Subject-wise Performance</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3e8da" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="avg" name="Average" fill="#9a4601" radius={[4, 4, 0, 0]} />
              <Bar dataKey="highest" name="Highest" fill="#2c694e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-5">
          <h3 className="section-title">Activity Completion by Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={activityCompletion} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3e8da" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="%" />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v}%`]} />
              <Bar dataKey="completed" name="Completed %" fill="#9a4601" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Subject Attendance Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-orange-50 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Subject-wise Attendance Report</h3>
          <button onClick={() => handleExport('Attendance')} className="btn-ghost text-xs py-2">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Code</th>
                <th>Present</th>
                <th>Total</th>
                <th>Attendance %</th>
                <th>Visual</th>
              </tr>
            </thead>
            <tbody>
              {attendanceSummary.bySubject.map(sub => (
                <tr key={sub.code}>
                  <td className="font-medium text-gray-800 dark:text-gray-200">{sub.subject}</td>
                  <td><span className="font-mono text-xs bg-orange-50 dark:bg-gray-800 px-2 py-1 rounded-lg">{sub.code}</span></td>
                  <td className="text-gray-600 dark:text-gray-400">{sub.present}</td>
                  <td className="text-gray-600 dark:text-gray-400">{sub.total}</td>
                  <td><span className={cn('font-bold', getAttendanceColor(sub.percentage))}>{sub.percentage.toFixed(1)}%</span></td>
                  <td className="w-40"><ProgressBar value={sub.percentage} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Top Performers */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-orange-50 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">Top Performing Students</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Enrollment</th>
                <th>Semester</th>
                <th>CGPA</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {topStudents.map((s, i) => (
                <tr key={s.id}>
                  <td>
                    <span className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                      i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-700' : 'bg-orange-50 text-orange-700'
                    )}>#{i + 1}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold', `bg-${['orange', 'teal', 'blue', 'purple', 'pink'][i]}-500`)}>
                        {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{s.name}</span>
                    </div>
                  </td>
                  <td><span className="font-mono text-xs bg-orange-50 dark:bg-gray-800 px-2 py-1 rounded">{s.enrollment}</span></td>
                  <td className="text-gray-600 dark:text-gray-400 text-sm">Sem {s.semester}</td>
                  <td><span className="font-bold text-primary">{s.cgpa}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <ProgressBar value={s.attendance} className="w-20" />
                      <span className={cn('text-xs font-bold', getAttendanceColor(s.attendance))}>{s.attendance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
