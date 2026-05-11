import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Users, Search, Plus, Pencil, Trash2, Filter, X, Mail, Phone, GraduationCap, TrendingUp, Eye } from 'lucide-react'
import { studentsData } from '../../data/students'
import { Avatar } from '../../components/ui/Avatar'
import { Badge, StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { EmptyState } from '../../components/ui/EmptyState'
import { StatCard } from '../../components/ui/StatCard'
import { cn, getAttendanceColor, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

const SEMESTERS = [2, 4, 6, 8]
const SECTIONS = ['A', 'B', 'C']

export default function StudentsPage() {
  const [students, setStudents] = useState(studentsData)
  const [search, setSearch] = useState('')
  const [filterSem, setFilterSem] = useState('')
  const [filterSection, setFilterSection] = useState('')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editStudent, setEditStudent] = useState(null)
  const [deleteStudent, setDeleteStudent] = useState(null)
  const [viewStudent, setViewStudent] = useState(null)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const filtered = useMemo(() =>
    students.filter(s => {
      const q = search.toLowerCase()
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.enrollment.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
      const matchSem = !filterSem || s.semester === parseInt(filterSem)
      const matchSec = !filterSection || s.section === filterSection
      return matchQ && matchSem && matchSec
    }),
    [students, search, filterSem, filterSection]
  )

  const stats = [
    { label: 'Total', value: students.length, color: 'primary' },
    { label: 'Active', value: students.filter(s => s.status === 'active').length, color: 'green' },
    { label: 'Warning', value: students.filter(s => s.status === 'warning').length, color: 'orange' },
    { label: 'Critical', value: students.filter(s => s.status === 'critical').length, color: 'red' },
  ]

  const handleAdd = (data) => {
    const newStudent = {
      ...data,
      id: `s${Date.now()}`,
      semester: parseInt(data.semester),
      attendance: parseInt(data.attendance) || 85,
      cgpa: parseFloat(data.cgpa) || 7.5,
      status: parseInt(data.attendance) >= 75 ? 'active' : parseInt(data.attendance) >= 65 ? 'warning' : 'critical',
    }
    setStudents(prev => [newStudent, ...prev])
    setAddModalOpen(false)
    reset()
    toast.success('Student added successfully!')
  }

  const handleEdit = (data) => {
    setStudents(prev => prev.map(s => s.id === editStudent.id ? {
      ...s, ...data,
      semester: parseInt(data.semester),
      attendance: parseInt(data.attendance),
      cgpa: parseFloat(data.cgpa),
      status: parseInt(data.attendance) >= 75 ? 'active' : parseInt(data.attendance) >= 65 ? 'warning' : 'critical',
    } : s))
    setEditStudent(null)
    toast.success('Student updated!')
  }

  const handleDelete = () => {
    setStudents(prev => prev.filter(s => s.id !== deleteStudent.id))
    setDeleteStudent(null)
    toast.success('Student removed.')
  }

  const openEdit = (student) => {
    setEditStudent(student)
    Object.entries(student).forEach(([k, v]) => setValue(k, v))
  }

  const StudentForm = ({ onSubmit: submitFn, defaultValues }) => (
    <form onSubmit={handleSubmit(submitFn)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
          <input className="input-field" placeholder="e.g. Arjun Mehta" defaultValue={defaultValues?.name} {...register('name', { required: true })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Enrollment No. *</label>
          <input className="input-field" placeholder="EN2021001" defaultValue={defaultValues?.enrollment} {...register('enrollment', { required: true })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
          <input className="input-field" type="email" placeholder="student@college.edu" defaultValue={defaultValues?.email} {...register('email', { required: true })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Semester *</label>
          <select className="input-field" defaultValue={defaultValues?.semester} {...register('semester', { required: true })}>
            <option value="">Select</option>
            {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Section *</label>
          <select className="input-field" defaultValue={defaultValues?.section} {...register('section', { required: true })}>
            <option value="">Select</option>
            {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
          <input className="input-field" placeholder="9876543210" defaultValue={defaultValues?.phone} {...register('phone')} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">CGPA</label>
          <input className="input-field" type="number" step="0.1" min="0" max="10" placeholder="8.5" defaultValue={defaultValues?.cgpa} {...register('cgpa')} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Attendance %</label>
          <input className="input-field" type="number" min="0" max="100" placeholder="85" defaultValue={defaultValues?.attendance} {...register('attendance')} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
          <select className="input-field" defaultValue={defaultValues?.gender} {...register('gender')}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1 justify-center">Save Student</button>
        <button type="button" onClick={() => { setAddModalOpen(false); setEditStudent(null); reset() }} className="btn-ghost flex-1 justify-center border border-gray-200">Cancel</button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Student Management</h1>
          <p className="page-subtitle">Manage all enrolled students and their profiles</p>
        </div>
        <button onClick={() => { reset(); setAddModalOpen(true) }} className="btn-primary w-fit">
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className={cn('card p-4 text-center', s.color === 'red' && 'border-red-100')}>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, enrollment, email..."
            className="input-field pl-9"
          />
        </div>
        <select value={filterSem} onChange={e => setFilterSem(e.target.value)} className="input-field w-full sm:w-40">
          <option value="">All Semesters</option>
          {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
        <select value={filterSection} onChange={e => setFilterSection(e.target.value)} className="input-field w-full sm:w-36">
          <option value="">All Sections</option>
          {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
        </select>
        {(search || filterSem || filterSection) && (
          <button onClick={() => { setSearch(''); setFilterSem(''); setFilterSection('') }} className="btn-ghost text-red-500 hover:bg-red-50">
            <X className="w-4 h-4" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No students found" description="Try adjusting your search or filters" />
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Enrollment</th>
                  <th className="hidden md:table-cell">Sem / Section</th>
                  <th className="hidden lg:table-cell">Attendance</th>
                  <th className="hidden lg:table-cell">CGPA</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((student, i) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={student.name} size="sm" />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{student.name}</p>
                            <p className="text-xs text-gray-500 hidden sm:block">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="font-mono text-xs bg-orange-50 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-700 dark:text-gray-300">
                          {student.enrollment}
                        </span>
                      </td>
                      <td className="hidden md:table-cell">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Sem {student.semester} — {student.section}</span>
                      </td>
                      <td className="hidden lg:table-cell">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <ProgressBar value={student.attendance} className="flex-1" />
                          <span className={cn('text-xs font-bold w-10', getAttendanceColor(student.attendance))}>
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                      <td className="hidden lg:table-cell">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{student.cgpa}</span>
                      </td>
                      <td><StatusBadge status={student.status} /></td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewStudent(student)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => openEdit(student)} className="p-1.5 rounded-lg hover:bg-orange-50 text-gray-400 hover:text-primary transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteStudent(student)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-orange-50 dark:border-gray-800 text-xs text-gray-500">
            Showing {filtered.length} of {students.length} students
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={addModalOpen} onClose={() => { setAddModalOpen(false); reset() }} title="Add New Student">
        <StudentForm onSubmit={handleAdd} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editStudent} onClose={() => { setEditStudent(null); reset() }} title="Edit Student">
        {editStudent && <StudentForm onSubmit={handleEdit} defaultValues={editStudent} />}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteStudent} onClose={() => setDeleteStudent(null)} title="Delete Student" size="sm">
        {deleteStudent && (
          <div className="text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Delete {deleteStudent.name}?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The student's records will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors">Delete</button>
              <button onClick={() => setDeleteStudent(null)} className="flex-1 btn-ghost border border-gray-200 justify-center">Cancel</button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Drawer */}
      <AnimatePresence>
        {viewStudent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setViewStudent(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Student Profile</h3>
                  <button onClick={() => setViewStudent(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center mb-6">
                  <Avatar name={viewStudent.name} size="xl" className="mx-auto mb-3" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{viewStudent.name}</h2>
                  <p className="text-sm text-gray-500">{viewStudent.enrollment}</p>
                  <div className="mt-2">
                    <StatusBadge status={viewStudent.status} />
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: Mail, label: 'Email', value: viewStudent.email },
                    { icon: Phone, label: 'Phone', value: viewStudent.phone },
                    { icon: GraduationCap, label: 'Semester', value: `Semester ${viewStudent.semester} — Section ${viewStudent.section}` },
                    { icon: TrendingUp, label: 'CGPA', value: viewStudent.cgpa },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/40 dark:bg-gray-800/40">
                      <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value}</p>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 rounded-xl bg-orange-50 dark:bg-gray-800/60">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Attendance</p>
                      <span className={cn('text-sm font-bold', getAttendanceColor(viewStudent.attendance))}>{viewStudent.attendance}%</span>
                    </div>
                    <ProgressBar value={viewStudent.attendance} size="lg" />
                    <p className="text-xs text-gray-500 mt-2">
                      {viewStudent.attendance >= 75 ? '✓ Eligible for exams' : '⚠ Below 75% threshold'}
                    </p>
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
