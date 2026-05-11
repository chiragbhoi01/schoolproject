# SCAAMS — Smart Curriculum Activity & Attendance Management System

## 🔗 Repository

[github.com/chiragbhoi01/schoolproject](https://github.com/chiragbhoi01/schoolproject.git)

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔐 Demo Credentials

| Role    | Email                   | Password   |
|---------|-------------------------|------------|
| Admin   | admin@college.com       | admin123   |
| Teacher | teacher@college.com     | teacher123 |
| Student | student@college.com     | student123 |

## 🛠 Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router DOM** for routing
- **Recharts** for analytics charts
- **Framer Motion** for animations
- **React Hook Form** for forms
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📁 Project Structure

```
src/
├── components/ui/      # Reusable UI components
├── data/               # Mock data
├── layouts/            # MainLayout with sidebar/topbar
├── pages/              # Feature pages
│   ├── auth/           # Login, ForgotPassword
│   ├── dashboard/      # Dashboard with analytics
│   ├── students/       # Student CRUD management
│   ├── attendance/     # Attendance marking
│   ├── activities/     # Curriculum activities
│   ├── reports/        # Analytics & reports
│   └── settings/       # Profile & preferences
├── routes/             # ProtectedRoute
├── store/              # Zustand stores
└── utils/              # Helper functions
```

## 🌐 Deploy to Vercel

```bash
npm run build
# Deploy dist/ folder to Vercel
# vercel.json handles SPA routing
```
