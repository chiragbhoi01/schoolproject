import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set) => ({
      sidebarOpen: true,
      darkMode: false,
      notifications: [
        { id: 1, title: 'New Student Enrolled', message: 'Priya Singh joined Sem 4 Section A', time: '2 min ago', read: false, type: 'success' },
        { id: 2, title: 'Attendance Alert', message: 'Rahul Verma attendance below 75%', time: '15 min ago', read: false, type: 'warning' },
        { id: 3, title: 'Activity Due', message: 'Web Dev Assignment deadline tomorrow', time: '1 hr ago', read: false, type: 'info' },
        { id: 4, title: 'Quiz Results', message: 'Data Structures Quiz results published', time: '3 hr ago', read: true, type: 'success' },
        { id: 5, title: 'Seminar Scheduled', message: 'AI & ML Seminar on Friday 3PM', time: '1 day ago', read: true, type: 'info' },
      ],

      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
      toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
      markNotificationRead: (id) =>
        set(s => ({
          notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        })),
      markAllRead: () =>
        set(s => ({
          notifications: s.notifications.map(n => ({ ...n, read: true })),
        })),
    }),
    {
      name: 'scaams-app',
      partialize: s => ({ darkMode: s.darkMode, sidebarOpen: s.sidebarOpen }),
    }
  )
)
