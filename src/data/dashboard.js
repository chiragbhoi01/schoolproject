export const dashboardStats = {
  totalStudents: 284,
  attendancePercent: 84.7,
  totalActivities: 8,
  activeTeachers: 18,
  totalCourses: 24,
  pendingAssignments: 6,
}

export const attendanceTrend = [
  { month: 'Aug', attendance: 82 },
  { month: 'Sep', attendance: 87 },
  { month: 'Oct', attendance: 79 },
  { month: 'Nov', attendance: 85 },
  { month: 'Dec', attendance: 89 },
  { month: 'Jan', attendance: 84 },
  { month: 'Feb', attendance: 87 },
  { month: 'Mar', attendance: 91 },
]

export const semesterDistribution = [
  { semester: 'Sem 2', students: 68, fill: '#9a4601' },
  { semester: 'Sem 4', students: 72, fill: '#c2410c' },
  { semester: 'Sem 6', students: 65, fill: '#2c694e' },
  { semester: 'Sem 8', students: 49, fill: '#16a34a' },
]

export const activityCompletion = [
  { type: 'Assignment', completed: 85, pending: 15 },
  { type: 'Quiz', completed: 92, pending: 8 },
  { type: 'Seminar', completed: 70, pending: 30 },
  { type: 'Workshop', completed: 60, pending: 40 },
  { type: 'Practical', completed: 88, pending: 12 },
  { type: 'Sports', completed: 45, pending: 55 },
]

export const weeklyActivityData = [
  { day: 'Mon', submissions: 12, present: 245, absent: 39 },
  { day: 'Tue', submissions: 8, present: 258, absent: 26 },
  { day: 'Wed', submissions: 19, present: 241, absent: 43 },
  { day: 'Thu', submissions: 14, present: 265, absent: 19 },
  { day: 'Fri', submissions: 22, present: 237, absent: 47 },
]

export const recentActivities = [
  { id: 1, type: 'submission', text: 'Priya Singh submitted Web Dev Assignment', time: '5 min ago', icon: 'upload' },
  { id: 2, type: 'attendance', text: 'Attendance marked for CS601 — Sec A', time: '12 min ago', icon: 'check' },
  { id: 3, type: 'enrollment', text: 'New student Aditya Bose enrolled in Sem 4', time: '1 hr ago', icon: 'user-plus' },
  { id: 4, type: 'activity', text: 'Quiz: Data Structures results published', time: '2 hr ago', icon: 'award' },
  { id: 5, type: 'alert', text: 'Karan Shah attendance below 65%', time: '3 hr ago', icon: 'alert-triangle' },
  { id: 6, type: 'activity', text: 'Cloud Workshop registration closed', time: '1 day ago', icon: 'calendar' },
]

export const upcomingEvents = [
  { id: 1, title: 'AI Seminar', date: 'Apr 20', type: 'Seminar', color: 'bg-blue-100 text-blue-700' },
  { id: 2, title: 'Web Dev Assignment Due', date: 'Apr 15', type: 'Assignment', color: 'bg-orange-100 text-orange-700' },
  { id: 3, title: 'Cloud Workshop', date: 'Apr 25', type: 'Workshop', color: 'bg-green-100 text-green-700' },
  { id: 4, title: 'OS Presentation', date: 'Apr 18', type: 'Presentation', color: 'bg-purple-100 text-purple-700' },
  { id: 5, title: 'Cricket Tournament', date: 'May 1', type: 'Sports', color: 'bg-teal-100 text-teal-700' },
]
