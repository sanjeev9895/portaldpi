import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Search,
  Plus,
  Users,
  Briefcase,
  Building2,
  Mail,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
  ChevronDown,
  UserCheck,
  Calendar,
  TrendingUp,
  Printer,
  Award,
  Clock,
} from 'lucide-react'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import api from '../services/api'

/* ===================================== */
/* ROLE CONFIG */
/* ===================================== */

const ROLE_CONFIG: Record<
  string,
  { color: string; bg: string; dot: string }
> = {
  Technical: {
    color: 'text-violet-700',
    bg: 'bg-violet-50',
    dot: 'bg-violet-500',
  },
  Mentoring: {
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    dot: 'bg-emerald-500',
  },
  Community: {
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    dot: 'bg-orange-500',
  },
}

/* ===================================== */
/* HELPERS */
/* ===================================== */

function getInitials(name: string) {
  return (
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??'
  )
}

const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-cyan-500',
]

function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

/* ===================================== */
/* STAT CARD */
/* ===================================== */

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
  bgClass,
}: {
  label: string
  value: number
  icon: any
  iconClass: string
  bgClass: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-700 text-slate-400 uppercase tracking-widest">
          {label}
        </span>
        <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center`}>
          <Icon size={18} className={iconClass} />
        </div>
      </div>
      <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
  )
}

/* ===================================== */
/* FORM FIELD */
/* ===================================== */

function Field({
  label,
  children,
  required,
}: {
  label: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400'

/* ===================================== */
/* DELETE CONFIRM MODAL */
/* ===================================== */

function DeleteModal({
  name,
  onConfirm,
  onCancel,
  loading,
}: {
  name: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Delete Employee</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-7">
            Are you sure you want to delete{' '}
            <span className="font-bold text-slate-700">{name}</span>? This action
            cannot be undone.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-bold text-white transition-all disabled:opacity-60"
            >
              {loading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===================================== */
/* ADD / EDIT MODAL */
/* ===================================== */

function EmployeeModal({
  editId,
  name, setName,
  role, setRole,
  contact, setContact,
  email, setEmail,
  department, setDepartment,
  joiningDate, setJoiningDate,
  onSave,
  onClose,
  saving,
  errors,
}: {
  editId: number | null
  name: string; setName: (v: string) => void
  role: string; setRole: (v: string) => void
  contact: string; setContact: (v: string) => void
  email: string; setEmail: (v: string) => void
  department: string; setDepartment: (v: string) => void
  joiningDate: string; setJoiningDate: (v: string) => void
  onSave: () => void
  onClose: () => void
  saving: boolean
  errors: Record<string, string>
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-800">
              {editId ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {editId ? 'Update the employee details below' : 'Fill in the details to add a new employee'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-all"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[65vh] overflow-y-auto">

          {/* Name */}
          <Field label="Full Name" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Karthikeyan S"
              className={`${inputClass} ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>
            )}
          </Field>

          {/* Contact */}
          <Field label="Contact Number" required>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="10-digit number"
              maxLength={10}
              className={`${inputClass} ${errors.contact ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.contact && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.contact}</p>
            )}
          </Field>

          {/* Email */}
          <Field label="Email Address" required>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className={`${inputClass} ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
            )}
          </Field>

          {/* Department */}
          <Field label="Department" required>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Engineering"
              className={`${inputClass} ${errors.department ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.department && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.department}</p>
            )}
          </Field>

          {/* Role */}
          <Field label="Role" required>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`${inputClass} appearance-none pr-10 ${errors.role ? 'border-red-400 focus:ring-red-400' : ''}`}
              >
                <option value="">Select a role</option>
                <option value="Technical">Technical</option>
                <option value="Mentoring">Mentoring</option>
                <option value="Community">Community</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
            {errors.role && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.role}</p>
            )}
          </Field>

          {/* Joining Date */}
          <Field label="Joining Date" required>
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              className={`${inputClass} ${errors.joiningDate ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.joiningDate && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.joiningDate}</p>
            )}
          </Field>

        </div>

        {/* Modal Footer */}
        <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                {editId ? 'Updating…' : 'Saving…'}
              </>
            ) : (
              editId ? 'Update Employee' : 'Save Employee'
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

/* ===================================== */
/* MAIN COMPONENT */
/* ===================================== */

export default function Employees() {

  const [employees, setEmployees] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('All')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'directory' | 'performance'>('directory')
  const [selectedEmpId, setSelectedEmpId] = useState<number | null>(null)
  const [attendance, setAttendance] = useState<any[]>([])

  const fetchAttendance = async () => {
    try {
      const res = await api.get('/attendance')
      setAttendance(res.data.data || [])
    } catch (err) {
      console.log('FAILED TO FETCH ATTENDANCE:', err)
    }
  }

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  /* Modal states */
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  /* Delete confirm state */
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)

  /* Form fields */
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [joiningDate, setJoiningDate] = useState('')

  /* ===================================== */
  /* FETCH */
  /* ===================================== */

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees')
      const data = res.data
      if (Array.isArray(data)) {
        setEmployees(data)
      } else if (Array.isArray(data?.data)) {
        setEmployees(data.data)
      } else if (Array.isArray(data?.employees)) {
        setEmployees(data.employees)
      } else {
        console.warn('Unexpected API response shape:', data)
        setEmployees([])
      }
    } catch (err) {
      console.log(err)
      setEmployees([])
    }
  }

  useEffect(() => {
    fetchEmployees()
    fetchAttendance()
  }, [])

  /* ===================================== */
  /* RESET FORM */
  /* ===================================== */

  const resetForm = () => {
    setEditId(null)
    setName('')
    setRole('')
    setContact('')
    setEmail('')
    setDepartment('')
    setJoiningDate('')
    setFormErrors({})
  }

  /* ===================================== */
  /* OPEN ADD MODAL */
  /* ===================================== */

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  /* ===================================== */
  /* EDIT */
  /* ===================================== */

  const handleEdit = (item: any) => {
    setFormErrors({})
    setEditId(item.id)
    setName(item.name)
    setRole(item.role)
    setContact(item.contact)
    setEmail(item.email)
    setDepartment(item.department)
    setJoiningDate(item.joining_date)
    setShowModal(true)
  }

  /* ===================================== */
  /* DELETE */
  /* ===================================== */

  const handleDeleteClick = (item: any) => {
    setDeleteTarget({ id: item.id, name: item.name })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await api.delete(`/employees/${deleteTarget.id}`)
      setDeleteTarget(null)
      fetchEmployees()
    } catch (err) {
      console.log(err)
    } finally {
      setDeleting(false)
    }
  }

  /* ===================================== */
  /* VALIDATE */
  /* ===================================== */

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!contact.trim()) errs.contact = 'Contact is required'
    else if (!/^[0-9]{10}$/.test(contact)) errs.contact = 'Must be exactly 10 digits'
    if (!email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email'
    if (!department.trim()) errs.department = 'Department is required'
    if (!role) errs.role = 'Please select a role'
    if (!joiningDate) errs.joiningDate = 'Joining date is required'
    return errs
  }

  /* ===================================== */
  /* SAVE */
  /* ===================================== */

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs)
      return
    }

    setSaving(true)
    try {
      const payload = {
        name,
        role,
        contact,
        email,
        department,
        joining_date: joiningDate,
      }

      if (editId) {
        await api.put(`/employees/${editId}`, payload)
      } else {
        await api.post('/employees', payload)
      }

      await fetchEmployees()
      setShowModal(false)
      resetForm()
    } catch (err: any) {
      console.log(err)
      alert(
        err?.response?.data?.message ||
        JSON.stringify(err?.response?.data) ||
        'Failed to save employee'
      )
    } finally {
      setSaving(false)
    }
  }

  /* ===================================== */
  /* FILTER */
  /* ===================================== */

  const filteredEmployees = useMemo(() => {
    return employees.filter((item: any) => {
      if (currentUser?.role === 'manager') {
        const itemRole = item.role?.toLowerCase() || ''
        const itemEmail = item.email?.toLowerCase() || ''
        if (
          itemRole === 'admin' ||
          itemRole === 'manager' ||
          itemEmail === 'admin@gmail.com' ||
          itemEmail === 'manager@gmail.com'
        ) {
          return false
        }
      }
      const matchesSearch =
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.department?.toLowerCase().includes(search.toLowerCase())
      const matchesRole =
        filterRole === 'All' ? true : item.role === filterRole
      return matchesSearch && matchesRole
    })
  }, [employees, search, filterRole, currentUser])

  /* ===================================== */
  /* STATS */
  /* ===================================== */

  const totalEmployees = employees.length
  const technicalCount = employees.filter((e) => e.role === 'Technical').length
  const mentoringCount = employees.filter((e) => e.role === 'Mentoring').length
  const communityCount = employees.filter((e) => e.role === 'Community').length

  /* ===================================== */
  /* ACCESS DENIED */
  /* ===================================== */

  if (currentUser && currentUser.role === 'employee') {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-[24px] shadow-lg p-10 max-w-md w-full text-center border border-slate-200">
          <h1 className="text-3xl font-black text-slate-800 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">Employees are not permitted to manage other employees.</p>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  /* ===================================== */
  /* ANALYTICS COMPUTATIONS */
  /* ===================================== */

  const selectedEmployee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmpId) || employees[0]
  }, [employees, selectedEmpId])

  const empAttendance = useMemo(() => {
    if (!selectedEmployee) return []
    return attendance.filter(
      (item) => item.employee_name?.toLowerCase() === selectedEmployee.name?.toLowerCase()
    )
  }, [attendance, selectedEmployee])

  const empTotalHours = useMemo(() => {
    return empAttendance.reduce((total, item) => {
      if (!item.check_in || !item.check_out) return total
      const diff =
        (new Date(item.check_out).getTime() - new Date(item.check_in).getTime()) /
        (1000 * 60 * 60)
      return total + (isNaN(diff) ? 0 : diff)
    }, 0)
  }, [empAttendance])

  const empReports = useMemo(() => {
    if (!selectedEmployee) return []
    try {
      const allReports = JSON.parse(localStorage.getItem('reports') || '[]')
      return allReports.filter(
        (item: any) =>
          item.employee?.toLowerCase() === selectedEmployee.name?.toLowerCase()
      )
    } catch {
      return []
    }
  }, [selectedEmployee])

  const chartData = useMemo(() => {
    return empAttendance
      .map((item) => {
        const checkIn = new Date(item.check_in)
        const checkOut = item.check_out ? new Date(item.check_out) : null
        const hrs =
          checkIn && checkOut
            ? (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
            : 0
        return {
          date: checkIn.toLocaleDateString([], { month: 'short', day: 'numeric' }),
          hours: Number(hrs.toFixed(1)),
          work: item.work_done || 'Work logged',
        }
      })
      .reverse()
      .slice(-7)
  }, [empAttendance])

  const reportStatusData = useMemo(() => {
    const statuses = { Submitted: 0, Pending: 0, Completed: 0 }
    empReports.forEach((r: any) => {
      if (r.status in statuses) {
        statuses[r.status as keyof typeof statuses]++
      }
    })
    return [
      { name: 'Submitted', count: statuses.Submitted, fill: '#3b82f6' },
      { name: 'Pending', count: statuses.Pending, fill: '#f97316' },
      { name: 'Completed', count: statuses.Completed, fill: '#10b981' },
    ]
  }, [empReports])

  /* ===================================== */
  /* RENDER */
  /* ===================================== */

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Employees
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            {totalEmployees} total · {filteredEmployees.length} shown
          </p>
        </div>

        {activeTab === 'directory' && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-blue-200"
          >
            <Plus size={16} />
            Add Employee
          </button>
        )}
      </div>

      {/* TABS */}
      <div className="no-print flex border-b border-slate-200 mb-6 gap-6">
        <button
          onClick={() => setActiveTab('directory')}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'directory'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Employee Directory
        </button>
        <button
          onClick={() => {
            setActiveTab('performance')
            if (employees.length > 0 && selectedEmpId === null) {
              setSelectedEmpId(employees[0].id)
            }
          }}
          className={`py-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'performance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Performance Analytics
        </button>
      </div>

      {/* ===================================== */}
      {/* DIRECTORY TAB */}
      {/* ===================================== */}

      {activeTab === 'directory' ? (
        <>
          {/* STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            <StatCard label="Total" value={totalEmployees} icon={Users} iconClass="text-blue-600" bgClass="bg-blue-50" />
            <StatCard label="Technical" value={technicalCount} icon={Briefcase} iconClass="text-violet-600" bgClass="bg-violet-50" />
            <StatCard label="Mentoring" value={mentoringCount} icon={UserCheck} iconClass="text-emerald-600" bgClass="bg-emerald-50" />
            <StatCard label="Community" value={communityCount} icon={Building2} iconClass="text-orange-600" bgClass="bg-orange-50" />
          </div>

          {/* SEARCH + FILTER */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email or department…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="h-11 pl-4 pr-9 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="Technical">Technical</option>
                  <option value="Mentoring">Mentoring</option>
                  <option value="Community">Community</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* ✅ FIX: thead now has a proper <tr> wrapper */}
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {filteredEmployees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <Users size={28} className="text-slate-300" />
                          </div>
                          <div>
                            <p className="text-base font-bold text-slate-600">No employees found</p>
                            <p className="text-sm text-slate-400 mt-0.5">
                              {search || filterRole !== 'All'
                                ? 'Try adjusting your search or filter'
                                : 'Add your first employee to get started'}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEmployees.map((item: any) => {
                      const roleConf = ROLE_CONFIG[item.role] || {
                        color: 'text-slate-600',
                        bg: 'bg-slate-100',
                        dot: 'bg-slate-400',
                      }
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-blue-50/30 transition-colors group"
                        >
                          {/* Employee */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl ${avatarColor(item.id)} flex items-center justify-center flex-shrink-0`}
                              >
                                <span className="text-xs font-black text-white">
                                  {getInitials(item.name)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                <p className="text-xs text-slate-400 font-medium">#{item.id}</p>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${roleConf.bg} ${roleConf.color}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${roleConf.dot}`} />
                              {item.role}
                            </span>
                          </td>

                          {/* Email */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-slate-400" />
                              <span className="text-sm font-medium text-slate-700">
                                {item.email || '-'}
                              </span>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-5 py-4">
                            <span className="text-sm text-slate-600 font-medium">
                              {item.contact || '-'}
                            </span>
                          </td>

                          {/* Department */}
                          <td className="px-5 py-4">
                            <span className="text-sm text-slate-600 font-semibold">
                              {item.department}
                            </span>
                          </td>

                          {/* Joined */}
                          <td className="px-5 py-4">
                            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <Calendar size={11} className="text-slate-400" />
                              {item.joining_date}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(item)}
                                title="Edit employee"
                                className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-all active:scale-95"
                              >
                                <Pencil size={15} className="text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(item)}
                                title="Delete employee"
                                className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition-all active:scale-95"
                              >
                                <Trash2 size={15} className="text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {filteredEmployees.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-400 font-medium">
                  Showing {filteredEmployees.length} of {totalEmployees} employees
                </p>
              </div>
            )}
          </div>
        </>
      ) : (

        /* ===================================== */
        /* PERFORMANCE TAB */
        /* ===================================== */

        <div id="print-performance-report" className="space-y-6 print:p-0">

          <style>{`
            @media print {
              body * { visibility: hidden; }
              #print-performance-report,
              #print-performance-report * { visibility: visible; }
              #print-performance-report {
                position: absolute;
                left: 0; top: 0;
                width: 100%;
                background: white;
                color: black;
                padding: 0px;
              }
              .no-print { display: none !important; }
            }
          `}</style>

          {/* Control bar */}
          <div className="no-print bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-sm font-bold text-slate-500 uppercase whitespace-nowrap">
                Select Employee:
              </span>
              <div className="relative w-full sm:w-64">
                <select
                  value={selectedEmpId || ''}
                  onChange={(e) => setSelectedEmpId(Number(e.target.value))}
                  className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white appearance-none cursor-pointer"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.role})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 w-full sm:w-auto"
            >
              <Printer size={16} />
              Print / Download Report
            </button>
          </div>

          {selectedEmployee ? (
            <>
              {/* Employee Summary Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-2xl ${avatarColor(selectedEmployee.id)} flex items-center justify-center`}
                  >
                    <span className="text-2xl font-black text-white">
                      {getInitials(selectedEmployee.name)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">{selectedEmployee.name}</h2>
                    <p className="text-slate-400 text-sm font-semibold mt-0.5">
                      {selectedEmployee.department} Department · #{selectedEmployee.id}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8 w-full md:w-auto">
                  <div>
                    <span className="text-slate-400 font-medium">Role:</span>
                    <span className="ml-2 font-bold text-slate-700">{selectedEmployee.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Joined:</span>
                    <span className="ml-2 font-bold text-slate-700">{selectedEmployee.joining_date}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 font-medium">Email:</span>
                    <span className="ml-2 font-bold text-blue-600">{selectedEmployee.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 font-medium">Phone:</span>
                    <span className="ml-2 font-bold text-slate-700">{selectedEmployee.contact || '-'}</span>
                  </div>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Days Present</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-black text-slate-800">{empAttendance.length}</p>
                    <div className="w-9 h-9 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                      <UserCheck size={18} />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Hours Worked</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-black text-slate-800">{empTotalHours.toFixed(1)}h</p>
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Clock size={18} />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Average Hours/Day</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-black text-slate-800">
                      {empAttendance.length > 0
                        ? (empTotalHours / empAttendance.length).toFixed(1)
                        : '0'}h
                    </p>
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <TrendingUp size={18} />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Reports Submitted</p>
                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-black text-slate-800">{empReports.length}</p>
                    <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Award size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Hours Worked Area Chart */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-4">Hours Worked (Recent Log)</h3>
                  {chartData.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                          <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                          <Tooltip formatter={(value) => [`${value} hrs`, 'Hours Worked']} />
                          <Area
                            type="monotone"
                            dataKey="hours"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorHours)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold">
                      No attendance logged yet
                    </div>
                  )}
                </div>

                {/* Reports Status Bar Chart */}
                <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-4">Task/Report Status Summary</h3>
                  {empReports.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={reportStatusData}
                          margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                          <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                          <Tooltip formatter={(value) => [value, 'Reports']} />
                          <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-bold">
                      No reports submitted yet
                    </div>
                  )}
                </div>
              </div>

              {/* Attendance Log Table */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-800">Attendance Log History</h3>
                  <span className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                    {empAttendance.length} records
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 text-left bg-slate-50">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check In</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check Out</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Hours</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Work Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {empAttendance.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">
                            No attendance records logged
                          </td>
                        </tr>
                      ) : (
                        empAttendance.map((item) => {
                          const dateObj = new Date(item.check_in)
                          const checkInStr = dateObj.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                          const checkOutStr = item.check_out
                            ? new Date(item.check_out).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '--'
                          const hrs =
                            item.check_in && item.check_out
                              ? (
                                  (new Date(item.check_out).getTime() -
                                    new Date(item.check_in).getTime()) /
                                  (1000 * 60 * 60)
                                ).toFixed(1)
                              : '--'

                          return (
                            <tr key={item.id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                {dateObj.toLocaleDateString([], {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-slate-600">{checkInStr}</td>
                              <td className="px-6 py-4 text-sm font-medium text-slate-600">{checkOutStr}</td>
                              <td className="px-6 py-4 text-sm font-bold text-blue-600">
                                {hrs !== '--' ? `${hrs} hrs` : '--'}
                              </td>
                              <td
                                className="px-6 py-4 text-sm text-slate-500 font-medium max-w-sm truncate"
                                title={item.work_done}
                              >
                                {item.work_done || '--'}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-400 font-bold border-2 border-dashed rounded-3xl bg-white border-slate-100">
              No employees available for analysis
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <EmployeeModal
          editId={editId}
          name={name} setName={setName}
          role={role} setRole={setRole}
          contact={contact} setContact={setContact}
          email={email} setEmail={setEmail}
          department={department} setDepartment={setDepartment}
          joiningDate={joiningDate} setJoiningDate={setJoiningDate}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false)
            resetForm()
          }}
          saving={saving}
          errors={formErrors}
        />
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteTarget && (
        <DeleteModal
          name={deleteTarget.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

    </div>
  )
}