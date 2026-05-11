import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEMO_USERS = {
  'admin@college.com': {
    id: 'u1',
    email: 'admin@college.com',
    password: 'admin123',
    name: 'Dr. Rajesh Kumar',
    role: 'admin',
    avatar: null,
    department: 'Administration',
    title: 'Principal',
  },
  'teacher@college.com': {
    id: 'u2',
    email: 'teacher@college.com',
    password: 'teacher123',
    name: 'Prof. Ananya Sharma',
    role: 'teacher',
    avatar: null,
    department: 'Computer Science',
    title: 'Assistant Professor',
  },
  'student@college.com': {
    id: 'u3',
    email: 'student@college.com',
    password: 'student123',
    name: 'Arjun Mehta',
    role: 'student',
    avatar: null,
    department: 'B.Tech CSE',
    title: 'Student — Sem 6',
  },
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        await new Promise(r => setTimeout(r, 800))
        const user = DEMO_USERS[email]
        if (user && user.password === password) {
          const { password: _, ...safeUser } = user
          set({ user: safeUser, isAuthenticated: true, isLoading: false })
          return { success: true }
        } else {
          set({ isLoading: false, error: 'Invalid email or password' })
          return { success: false, error: 'Invalid email or password' }
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null })
      },

      updateProfile: (data) => {
        set(state => ({ user: { ...state.user, ...data } }))
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'scaams-auth',
      partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
