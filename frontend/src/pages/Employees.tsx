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
} from 'lucide-react'

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
  return name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??'
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
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl animate-in">
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
  phone, setPhone,
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
  phone: string; setPhone: (v: string) => void
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

          {/* Phone */}
          <Field label="Phone Number" required>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit number"
              maxLength={10}
              className={`${inputClass} ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone}</p>
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

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

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
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [joiningDate, setJoiningDate] = useState('')

  /* ===================================== */
  /* FETCH — FIXED */
  /* ===================================== */

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees')
      const data = res.data
      // Handle all common API response shapes:
      // 1. Array directly:        res.data → []
      // 2. Wrapped in .data:      res.data → { data: [] }
      // 3. Wrapped in .employees: res.data → { employees: [] }
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
      setEmployees([]) // prevent .filter crash on API error
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  /* ===================================== */
  /* RESET FORM */
  /* ===================================== */

  const resetForm = () => {
    setEditId(null)
    setName('')
    setRole('')
    setPhone('')
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
    setPhone(item.phone)
    setEmail(item.email)
    setDepartment(item.department)
    setJoiningDate(item.joining_date)
    setShowModal(true)
  }

  /* ===================================== */
  /* DELETE — show confirm modal */
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
    if (!phone.trim()) errs.phone = 'Phone is required'
    else if (!/^[0-9]{10}$/.test(phone)) errs.phone = 'Must be exactly 10 digits'
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

        phone,

        email,

        department,

        joining_date: joiningDate,

      }

      console.log("SENDING:", payload)

      // =====================================
      // UPDATE
      // =====================================

      if (editId) {

        await api.put(

          `/employees/${editId}`,

          payload
        )

      }

      // =====================================
      // ADD
      // =====================================

      else {

        await api.post(

          '/employees',

          payload
        )
      }

      // =====================================
      // REFRESH TABLE
      // =====================================

      await fetchEmployees()

      // =====================================
      // CLOSE MODAL
      // =====================================

      setShowModal(false)

      resetForm()

    }

    catch (err) {

      console.log(err)

      alert("Failed to save employee")
    }

    finally {

      setSaving(false)
    }
  }
  /* ===================================== */
  /* FILTER */
  /* ===================================== */

  const filteredEmployees = useMemo(() => {
    return employees.filter((item: any) => {
      // If manager, filter out managers and admins
      if (currentUser?.role === 'manager') {
        const itemRole = item.role?.toLowerCase() || '';
        const itemEmail = item.email?.toLowerCase() || '';
        if (itemRole === 'admin' || itemRole === 'manager' || itemEmail === 'admin@gmail.com' || itemEmail === 'manager@gmail.com') {
          return false;
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
  /* RENDER */
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
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Employees
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            {totalEmployees} total · {filteredEmployees.length} shown
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-blue-200"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="Total" value={totalEmployees} icon={Users} iconClass="text-blue-600" bgClass="bg-blue-50" />
        <StatCard label="Technical" value={technicalCount} icon={Briefcase} iconClass="text-violet-600" bgClass="bg-violet-50" />
        <StatCard label="Mentoring" value={mentoringCount} icon={UserCheck} iconClass="text-emerald-600" bgClass="bg-emerald-50" />
        <StatCard label="Community" value={communityCount} icon={Building2} iconClass="text-orange-600" bgClass="bg-orange-50" />
      </div>

      {/* ===================================== */}
      {/* SEARCH + FILTER */}
      {/* ===================================== */}

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

      {/* ===================================== */}
      {/* TABLE */}
      {/* ===================================== */}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Employee
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Role
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Contact
              </th>

              <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Email
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
                          <Mail
                            size={14}
                            className="text-slate-400"
                          />
                          <span className="text-sm font-medium text-slate-700">
                            {item.email || "-"}
                          </span>
                        </div>
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

        {/* Table Footer */}
        {filteredEmployees.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-400 font-medium">
              Showing {filteredEmployees.length} of {totalEmployees} employees
            </p>
          </div>
        )}
      </div>

      {/* ===================================== */}
      {/* ADD / EDIT MODAL */}
      {/* ===================================== */}

      {showModal && (
        <EmployeeModal
          editId={editId}
          name={name} setName={setName}
          role={role} setRole={setRole}
          phone={phone} setPhone={setPhone}
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

      {/* ===================================== */}
      {/* DELETE CONFIRM MODAL */}
      {/* ===================================== */}

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