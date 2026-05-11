import { studentsData } from './students'

export const generateAttendanceForDate = (date, subjectId) => {
  return studentsData.map(student => ({
    studentId: student.id,
    studentName: student.name,
    enrollment: student.enrollment,
    present: Math.random() > 0.2,
    date,
    subjectId,
  }))
}

export const attendanceSummary = {
  totalDays: 72,
  presentDays: 61,
  percentage: 84.7,
  bySubject: [
    { subject: 'Data Structures', code: 'CS401', present: 62, total: 72, percentage: 86.1 },
    { subject: 'Web Technologies', code: 'CS402', present: 58, total: 68, percentage: 85.3 },
    { subject: 'Database Mgmt', code: 'CS403', present: 65, total: 70, percentage: 92.9 },
    { subject: 'Operating Systems', code: 'CS404', present: 55, total: 72, percentage: 76.4 },
    { subject: 'Machine Learning', code: 'CS601', present: 60, total: 68, percentage: 88.2 },
    { subject: 'Cloud Computing', code: 'CS602', present: 52, total: 65, percentage: 80.0 },
  ],
}

export const weeklyAttendance = [
  { week: 'Week 1', present: 42, absent: 8, total: 50 },
  { week: 'Week 2', present: 45, absent: 5, total: 50 },
  { week: 'Week 3', present: 38, absent: 12, total: 50 },
  { week: 'Week 4', present: 47, absent: 3, total: 50 },
  { week: 'Week 5', present: 44, absent: 6, total: 50 },
  { week: 'Week 6', present: 40, absent: 10, total: 50 },
  { week: 'Week 7', present: 46, absent: 4, total: 50 },
  { week: 'Week 8', present: 43, absent: 7, total: 50 },
]

export const monthlyTrend = [
  { month: 'Aug', percentage: 82.3 },
  { month: 'Sep', percentage: 87.1 },
  { month: 'Oct', percentage: 79.6 },
  { month: 'Nov', percentage: 85.4 },
  { month: 'Dec', percentage: 88.9 },
  { month: 'Jan', percentage: 84.2 },
  { month: 'Feb', percentage: 86.7 },
  { month: 'Mar', percentage: 91.3 },
]

export const todayAttendance = studentsData.map(s => ({
  studentId: s.id,
  studentName: s.name,
  enrollment: s.enrollment,
  semester: s.semester,
  section: s.section,
  present: s.attendance >= 80 ? true : Math.random() > 0.4,
}))
