import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Eye, EyeOff, GraduationCap, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const DEMO_CREDS = [
  { role: 'Admin', email: 'admin@college.com', password: 'admin123', color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { role: 'Teacher', email: 'teacher@college.com', password: 'teacher123', color: 'bg-green-50 border-green-200 text-green-700' },
  { role: 'Student', email: 'student@college.com', password: 'student123', color: 'bg-blue-50 border-blue-200 text-blue-700' },
]

export default function LoginPage() {
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password)
    if (result.success) {
      toast.success('Welcome back! 🎓', { duration: 2000 })
      navigate('/dashboard')
    } else {
      toast.error(result.error || 'Login failed')
    }
  }

  const fillCredentials = (cred) => {
    setValue('email', cred.email)
    setValue('password', cred.password)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-primary via-primary-700 to-secondary p-12 text-white relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/3" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg leading-tight">SCAAMS</p>
              <p className="text-white/60 text-xs">Smart Curriculum ERP</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-display text-4xl font-bold leading-tight mb-4">
              Smart Academic<br />Management,<br />Redefined.
            </h1>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Track attendance, manage curriculum activities, and monitor student performance — all in one powerful platform.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 space-y-3">
          {[
            { stat: '2,800+', label: 'Students Managed' },
            { stat: '98.4%', label: 'Uptime Reliability' },
            { stat: '150+', label: 'Courses Tracked' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <span className="text-lg font-bold">{item.stat.replace('+','').replace('%','')[0]}</span>
              </div>
              <div>
                <p className="text-xl font-bold">{item.stat}</p>
                <p className="text-white/60 text-xs">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-bg p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">SCAAMS</p>
              <p className="text-xs text-gray-500">Smart Curriculum ERP</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          {/* Demo credentials */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 font-medium mb-2.5">Quick login — click to fill credentials:</p>
            <div className="flex gap-2 flex-wrap">
              {DEMO_CREDS.map(c => (
                <button
                  key={c.role}
                  onClick={() => fillCredentials(c)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all hover:scale-105 ${c.color}`}
                >
                  {c.role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@college.edu"
                  className={`input-field pl-10 ${errors.email ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400 ring-2 ring-red-100' : ''}`}
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-primary" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline font-medium">Forgot password?</Link>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full btn-primary justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            © 2024 SCAAMS — Final Year Project Demo
          </p>
        </motion.div>
      </div>
    </div>
  )
}
