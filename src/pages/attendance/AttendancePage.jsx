import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarCheck, CheckCircle, XCircle, Save, Users,
  TrendingUp, AlertTriangle, BookOpen, ChevronDown, Filter
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { todayAttendance, attendanceSummary, monthlyTrend } from '../../data/attendance'
import { subjectsList } from '../../data/students'
import { Avatar } from '../../components/ui/Avatar'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { cn, getAttendanceColor, getAttendanceBg } from '../../utils/helpers'
import toast from 'react-hot-toast'

const SEMESTERS = [2, 4, 6, 8]

export default function AttendancePage() {
  const [attendance, setAttendance] = useState(todayAttendance)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedSubject, setSelectedSubject] = useState(subjectsList[0].id)
  const [filterSem, setFilterSem] = useState('')
  const [saved, setSaved] = useState(false)

  const filtered = useMemo(() =>
    attendance.filter(s => !filterSem || s.semester === parseInt(filterSem)),
    [attendance, filterSem]
  )

  const presentCount = filtered.filter(s => s.present).length
  const absentCount = filtered.length - presentCount
  const pct = filtered.length ? Math.round((presentCount / filtered.length) * 100) : 0

  const toggleOne = (id) => {
    setAttendance(prev => prev.map(s => s.studentId === id ? { ...s, present: !s.present } : s))
    setSaved(false)
  }

  const markAll = (present) => {
    setAttendance(prev => prev.map(s =>
      (!filterSem || s.semester === parseInt(filterSem)) ? { ...s, present } : s
    ))
    setSaved(false)
    toast(present ? 'All marked Present' : 'All marked Absent', { icon: present ? '✅' : '❌' })
  }

  const handleSave = () => {
    setSaved(true)
    toast.success('Attendance saved successfully!', { duration: 3000 })
  }

  const subject = subjectsList.find(s => s.id === selectedSubject)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Attendance Management</h1>
          <p className="page-subtitle">Mark and track student attendance by subject and date</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className={cn('btn-primary w-fit gap-2', saved && 'bg-green-600 hover:bg-green-700')}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Attendance'}
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Present', value: presentCount, icon: CheckCircle, color: 'text-green-600 bg-green-50', sub: `${pct}% rate` },
          { label: 'Absent', value: absentCount, icon: XCircle, color: 'text-red-600 bg-red-50', sub: `${100 - pct}% rate` },
          { label: 'Total Students', value: filtered.length, icon: Users, color: 'text-blue-600 bg-blue-50', sub: 'In filter' },
          { label: 'Overall Avg', value: `${attendanceSummary.percentage}%`, icon: TrendingUp, color: 'text-primary bg-orange-50', sub: 'Academic year' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-4"
          >
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', card.color.split(' ')[1])}>
                <card.icon className={cn('w-5 h-5', card.color.split(' ')[0])} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{card.value}</p>
                <p className="text-[10px] text-gray-400">{card.sub}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="input-field w-56"
            >
              {subjectsList.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="input-field w-44"
            />
          </div>
          <select
            value={filterSem}
            onChange={e => setFilterSem(e.target.value)}
            className="input-field w-36"
          >
            <option value="">All Semesters</option>
            {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <div className="flex-1" />
          <div className="flex gap-2">
            <button onClick={() => markAll(true)} className="btn-secondary text-xs py-2">
              <CheckCircle className="w-3.5 h-3.5" /> Mark All Present
            </button>
            <button onClick={() => markAll(false)} className="text-xs px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-semibold flex items-center gap-1.5 transition-colors">
              <XCircle className="w-3.5 h-3.5" /> Mark All Absent
            </button>
          </div>
        </div>
      </div>

      {/* Live Progress */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{subject?.name} — {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Real-time attendance progress</p>
          </div>
          <span className={cn('text-2xl font-bold', getAttendanceColor(pct))}>{pct}%</span>
        </div>
        <ProgressBar value={pct} size="lg" />
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{presentCount} Present</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" />{absentCount} Absent</span>
        </div>
      </div>

      {/* Student List */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-orange-50 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Mark Attendance</h3>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {filtered.map((s, i) => (
            <motion.div
              key={s.studentId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className={cn(
                'flex items-center gap-4 px-5 py-3.5 hover:bg-orange-50/30 dark:hover:bg-gray-800/40 transition-colors',
                s.present ? '' : 'bg-red-50/20 dark:bg-red-900/5'
              )}
            >
              <span className="text-xs text-gray-400 w-6 text-right flex-shrink-0">{i + 1}</span>
              <Avatar name={s.studentName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{s.studentName}</p>
                <p className="text-xs text-gray-500">{s.enrollment} · Sem {s.semester} {s.section}</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => toggleOne(s.studentId)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                  s.present
                    ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-100'
                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                )}
              >
                {s.present ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span className="hidden sm:inline">{s.present ? 'Present' : 'Absent'}</span>
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subject Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <h3 className="section-title">Subject-wise Attendance</h3>
          <div className="space-y-4">
            {attendanceSummary.bySubject.map(sub => (
              <div key={sub.code}>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{sub.subject}</span>
                    <span className="text-gray-400 ml-2">({sub.present}/{sub.total})</span>
                  </div>
                  <span className={cn('font-bold', getAttendanceColor(sub.percentage))}>{sub.percentage.toFixed(1)}%</span>
                </div>
                <ProgressBar value={sub.percentage} size="md" />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="section-title">Monthly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3e8da" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #fed7aa', fontSize: 12 }} />
              <Bar dataKey="percentage" name="Attendance" fill="#9a4601" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
