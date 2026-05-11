import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  Zap, Plus, Search, Filter, X, Pencil, Trash2, Users, Calendar,
  BookOpen, Award, Layers, ChevronRight, Clock, Tag
} from 'lucide-react'
import { activitiesData, activityTypes } from '../../data/activities'
import { Badge, StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { cn, formatDate, getDaysUntil, getActivityTypeColor, getPriorityColor } from '../../utils/helpers'
import toast from 'react-hot-toast'

const TYPE_COLORS = {
  Assignment: 'bg-orange-100 text-orange-700 border-orange-200',
  Quiz: 'bg-blue-100 text-blue-700 border-blue-200',
  Seminar: 'bg-purple-100 text-purple-700 border-purple-200',
  Workshop: 'bg-green-100 text-green-700 border-green-200',
  Practical: 'bg-red-100 text-red-700 border-red-200',
  Sports: 'bg-teal-100 text-teal-700 border-teal-200',
}

const STATUS_TABS = ['all', 'active', 'upcoming', 'completed']

export default function ActivitiesPage() {
  const [activities, setActivities] = useState(activitiesData)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editActivity, setEditActivity] = useState(null)
  const [deleteActivity, setDeleteActivity] = useState(null)
  const [viewActivity, setViewActivity] = useState(null)
  const [viewMode, setViewMode] = useState('card')
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const filtered = useMemo(() =>
    activities.filter(a => {
      const q = search.toLowerCase()
      const matchQ = !q || a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q) || a.teacher.toLowerCase().includes(q)
      const matchType = !filterType || a.type === filterType
      const matchTab = activeTab === 'all' || a.status === activeTab
      return matchQ && matchType && matchTab
    }),
    [activities, search, filterType, activeTab]
  )

  const counts = {
    all: activities.length,
    active: activities.filter(a => a.status === 'active').length,
    upcoming: activities.filter(a => a.status === 'upcoming').length,
    completed: activities.filter(a => a.status === 'completed').length,
  }

  const handleAdd = (data) => {
    const newActivity = {
      ...data,
      id: `act${Date.now()}`,
      semester: parseInt(data.semester) || 0,
      maxMarks: parseInt(data.maxMarks) || 0,
      submissions: 0,
      totalStudents: parseInt(data.totalStudents) || 30,
      createdDate: new Date().toISOString().split('T')[0],
      status: 'upcoming',
    }
    setActivities(prev => [newActivity, ...prev])
    setAddModalOpen(false)
    reset()
    toast.success('Activity created!')
  }

  const handleEdit = (data) => {
    setActivities(prev => prev.map(a => a.id === editActivity.id ? {
      ...a, ...data,
      semester: parseInt(data.semester) || 0,
      maxMarks: parseInt(data.maxMarks) || 0,
    } : a))
    setEditActivity(null)
    toast.success('Activity updated!')
  }

  const handleDelete = () => {
    setActivities(prev => prev.filter(a => a.id !== deleteActivity.id))
    setDeleteActivity(null)
    toast.success('Activity deleted.')
  }

  const openEdit = (activity) => {
    setEditActivity(activity)
    Object.entries(activity).forEach(([k, v]) => setValue(k, v))
  }

  const ActivityForm = ({ onSubmit: submitFn, defaults }) => (
    <form onSubmit={handleSubmit(submitFn)} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Activity Title *</label>
        <input className="input-field" placeholder="e.g. Web Dev Assignment" defaultValue={defaults?.title} {...register('title', { required: true })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Type *</label>
          <select className="input-field" defaultValue={defaults?.type} {...register('type', { required: true })}>
            <option value="">Select type</option>
            {activityTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
          <input className="input-field" placeholder="Subject name" defaultValue={defaults?.subject} {...register('subject')} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
          <input type="date" className="input-field" defaultValue={defaults?.dueDate} {...register('dueDate')} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Max Marks</label>
          <input type="number" className="input-field" placeholder="100" defaultValue={defaults?.maxMarks} {...register('maxMarks')} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Semester</label>
          <select className="input-field" defaultValue={defaults?.semester} {...register('semester')}>
            <option value="0">All</option>
            {[2,4,6,8].map(s => <option key={s} value={s}>Sem {s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
          <select className="input-field" defaultValue={defaults?.priority} {...register('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Total Students</label>
          <input type="number" className="input-field" placeholder="30" defaultValue={defaults?.totalStudents} {...register('totalStudents')} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Teacher</label>
          <input className="input-field" placeholder="Prof. Name" defaultValue={defaults?.teacher} {...register('teacher')} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
        <textarea className="input-field resize-none h-20" placeholder="Activity description..." defaultValue={defaults?.description} {...register('description')} />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1 justify-center">Save Activity</button>
        <button type="button" onClick={() => { setAddModalOpen(false); setEditActivity(null); reset() }} className="btn-ghost flex-1 justify-center border border-gray-200">Cancel</button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Curriculum Activities</h1>
          <p className="page-subtitle">Manage assignments, quizzes, workshops and more</p>
        </div>
        <button onClick={() => { reset(); setAddModalOpen(true) }} className="btn-primary w-fit">
          <Plus className="w-4 h-4" /> New Activity
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-orange-50 dark:bg-gray-800 rounded-2xl p-1 w-fit">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize',
              activeTab === tab ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            )}
          >
            {tab} {counts[tab] > 0 && <span className="ml-1 opacity-60">({counts[tab]})</span>}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activities..." className="input-field pl-9 w-64" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="input-field w-40">
          <option value="">All Types</option>
          {activityTypes.map(t => <option key={t}>{t}</option>)}
        </select>
        {(search || filterType) && (
          <button onClick={() => { setSearch(''); setFilterType('') }} className="btn-ghost text-red-500 hover:bg-red-50">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={Zap} title="No activities found" description="Try adjusting your search or create a new activity" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((activity, i) => {
              const completionPct = activity.totalStudents ? Math.round((activity.submissions / activity.totalStudents) * 100) : 0
              const daysLabel = getDaysUntil(activity.dueDate)
              const isOverdue = daysLabel.includes('overdue')

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-5 hover:shadow-card-hover cursor-pointer group"
                  onClick={() => setViewActivity(activity)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <span className={cn('text-xs font-bold px-2.5 py-1 rounded-lg border', TYPE_COLORS[activity.type] || 'bg-gray-50 text-gray-600 border-gray-100')}>
                      {activity.type}
                    </span>
                    <StatusBadge status={activity.status} />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 leading-snug">{activity.title}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{activity.description}</p>

                  {/* Meta */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{activity.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className={cn(isOverdue && 'text-red-500 font-semibold')}>{daysLabel} · {formatDate(activity.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{activity.submissions}/{activity.totalStudents} submissions</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">Completion</span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{completionPct}%</span>
                    </div>
                    <ProgressBar value={completionPct} />
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
                    <span className="text-xs text-gray-400">{activity.teacher}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => { e.stopPropagation(); openEdit(activity) }}
                        className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-primary transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setDeleteActivity(activity) }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={addModalOpen} onClose={() => { setAddModalOpen(false); reset() }} title="Create Activity" size="lg">
        <ActivityForm onSubmit={handleAdd} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editActivity} onClose={() => { setEditActivity(null); reset() }} title="Edit Activity" size="lg">
        {editActivity && <ActivityForm onSubmit={handleEdit} defaults={editActivity} />}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteActivity} onClose={() => setDeleteActivity(null)} title="Delete Activity" size="sm">
        {deleteActivity && (
          <div className="text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Delete "{deleteActivity.title}"?</h3>
            <p className="text-sm text-gray-500 mb-6">This will permanently remove the activity and all associated data.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors">Delete</button>
              <button onClick={() => setDeleteActivity(null)} className="flex-1 btn-ghost border border-gray-200 justify-center">Cancel</button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Activity Detail */}
      <AnimatePresence>
        {viewActivity && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setViewActivity(null)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Activity Detail</h3>
                  <button onClick={() => setViewActivity(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><X className="w-4 h-4" /></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className={cn('text-xs font-bold px-2.5 py-1 rounded-lg border', TYPE_COLORS[viewActivity.type])}>
                      {viewActivity.type}
                    </span>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-3">{viewActivity.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{viewActivity.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Subject', value: viewActivity.subject },
                      { label: 'Teacher', value: viewActivity.teacher },
                      { label: 'Due Date', value: formatDate(viewActivity.dueDate) },
                      { label: 'Max Marks', value: viewActivity.maxMarks || 'N/A' },
                      { label: 'Semester', value: viewActivity.semester ? `Sem ${viewActivity.semester}` : 'All' },
                      { label: 'Priority', value: viewActivity.priority },
                    ].map(item => (
                      <div key={item.label} className="p-3 rounded-xl bg-orange-50/50 dark:bg-gray-800/50">
                        <p className="text-[10px] text-gray-500 mb-0.5">{item.label}</p>
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 capitalize">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-orange-50 dark:bg-gray-800/60">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Submission Progress</span>
                      <span className="font-bold text-primary">
                        {viewActivity.totalStudents ? Math.round((viewActivity.submissions / viewActivity.totalStudents) * 100) : 0}%
                      </span>
                    </div>
                    <ProgressBar value={viewActivity.submissions} max={viewActivity.totalStudents} size="lg" />
                    <p className="text-xs text-gray-500 mt-2">{viewActivity.submissions} of {viewActivity.totalStudents} students submitted</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => { openEdit(viewActivity); setViewActivity(null) }} className="btn-primary flex-1 justify-center text-sm">
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => { setDeleteActivity(viewActivity); setViewActivity(null) }} className="flex-1 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold text-sm hover:bg-red-100 flex items-center justify-center gap-2 transition-colors">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
