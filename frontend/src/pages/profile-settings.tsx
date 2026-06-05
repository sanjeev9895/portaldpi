import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  Camera,
  Save,
  MapPin,
  Briefcase,
  Pencil,
  Database,
} from 'lucide-react'

import {
  useState,
  useEffect,
} from 'react'
import BackButton from '../components/BackButton'
import api from '../services/api'

export default function ProfileSettings() {

  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [employeeId, setEmployeeId] = useState<number | null>(null)
  const [resetting, setResetting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    location: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const uObj = JSON.parse(userStr)
        setCurrentUser(uObj)

        const email = uObj.email || ''

        // Prefill default details from active user session
        let initialName = uObj.name || ''
        let initialPhone = uObj.phone || '9876543210'
        let initialRole = uObj.role || 'employee'
        let initialDept = uObj.department || 'Alumni Connect'
        let initialLoc = uObj.location || 'Madurai'

        // Check if there are registered details in localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
        const matchedReg = registeredUsers.find((u: any) => u.email === email)
        if (matchedReg) {
          initialName = matchedReg.name || initialName
          initialPhone = matchedReg.phone || initialPhone
          initialRole = matchedReg.role || initialRole
        }

        // Prefill profile image from localStorage lookup map
        const savedImages = JSON.parse(localStorage.getItem('profileImages') || '{}')
        if (savedImages[email]) {
          setProfileImage(savedImages[email])
        }

        // Try to fetch additional/registered details from backend SQLite Database
        api.get('/employees')
          .then((res) => {
            const employeesList = res.data || []
            const matchedEmp = employeesList.find((e: any) => e.email === email)
            if (matchedEmp) {
              setEmployeeId(matchedEmp.id)
              setFormData({
                name: matchedEmp.name || initialName,
                email: matchedEmp.email || email,
                phone: matchedEmp.contact || initialPhone,
                role: matchedEmp.role || initialRole,
                department: matchedEmp.department || initialDept,
                location: matchedEmp.joining_date || initialLoc,
                password: '',
                confirmPassword: '',
              })
            } else {
              setFormData({
                name: initialName,
                email: email,
                phone: initialPhone,
                role: initialRole,
                department: initialDept,
                location: initialLoc,
                password: '',
                confirmPassword: '',
              })
            }
          })
          .catch((err) => {
            console.error('Failed to fetch employee details:', err)
            setFormData({
              name: initialName,
              email: email,
              phone: initialPhone,
              role: initialRole,
              department: initialDept,
              location: initialLoc,
              password: '',
              confirmPassword: '',
            })
          })
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfileImage(base64String)

        const savedImages = JSON.parse(localStorage.getItem('profileImages') || '{}')
        if (currentUser?.email) {
          savedImages[currentUser.email] = base64String
          localStorage.setItem('profileImages', JSON.stringify(savedImages))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const {
      name,
      value,
    } = e.target

    /* Phone Validation */

    if (
      name === 'phone'
    ) {

      const onlyNumbers =
        value.replace(
          /\D/g,
          ''
        )

      if (
        onlyNumbers.length > 10
      ) return

      setFormData({

        ...formData,

        [name]:
          onlyNumbers,
      })

      return
    }

    setFormData({

      ...formData,

      [name]:
        value,
    })
  }

  const handleSave = () => {
    if (formData.phone && formData.phone.length < 10) {
      alert('Phone number must contain 10 digits')
      return
    }

    if (formData.email && !formData.email.includes('@gmail.com')) {
      alert('Email must contain @gmail.com')
      return
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    // 1. Update active user session in localStorage
    const updatedUser = {
      ...currentUser,
      name: formData.name,
      phone: formData.phone,
      department: formData.department,
      location: formData.location,
    }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setCurrentUser(updatedUser)

    // 2. Update registeredUsers list in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
    const userIndex = registeredUsers.findIndex((u: any) => u.email === formData.email)
    if (userIndex !== -1) {
      registeredUsers[userIndex].name = formData.name
      registeredUsers[userIndex].phone = formData.phone
      if (formData.password) {
        registeredUsers[userIndex].password = formData.password
      }
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
    }

    // 3. Update profile image in lookup map
    if (profileImage && currentUser?.email) {
      const savedImages = JSON.parse(localStorage.getItem('profileImages') || '{}')
      savedImages[currentUser.email] = profileImage
      localStorage.setItem('profileImages', JSON.stringify(savedImages))
    }

    // 4. Update SQLite database employee record if one is linked
    if (employeeId) {
      const payload = {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
        department: formData.department,
        role: formData.role ? (formData.role.charAt(0).toUpperCase() + formData.role.slice(1)) : 'Employee',
        joining_date: formData.location,
      }
      api.put(`/employees/${employeeId}`, payload)
        .then((res) => {
          console.log('Employee updated in SQLite database successfully:', res.data)
        })
        .catch((err) => {
          console.error('Failed to update employee in SQLite database:', err)
        })
    }

    setIsEditing(false)
    alert('Profile Updated Successfully')
  }

  const handleResetDatabase = async () => {
    const confirmReset = window.confirm(
      "Are you absolutely sure you want to reset and re-seed the Supabase database? This will delete all current entries and cannot be undone."
    );
    if (!confirmReset) return;

    setResetting(true);
    try {
      const res = await api.post('/db/reset');
      if (res.data && res.data.status === 'success') {
        alert("Supabase database reset and seeded successfully!");
      } else {
        alert("Database reset completed with unexpected response.");
      }
    } catch (err: any) {
      console.error("Failed to reset database:", err);
      const errMsg = err.message || "Unknown error";
      alert(`Failed to reset database: ${errMsg}`);
    } finally {
      setResetting(false);
    }
  };

  return (

    <div className="min-h-screen bg-slate-100 p-6">
<div className="mb-6">

  <BackButton />

</div>
      {/* Header */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold text-slate-800">

            Profile Settings

          </h1>

          <p className="text-slate-500 mt-2">

            Manage your profile information

          </p>

        </div>

        {/* Edit Button */}

        {

          !isEditing && (

            <button

              onClick={() =>
                setIsEditing(true)
              }

              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-6 h-12 rounded-2xl font-semibold shadow-lg"
            >

              <Pencil size={18} />

              Edit Profile

            </button>
          )
        }

      </div>

      {/* Main Card */}

      <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-slate-200">

        {/* Banner */}

        <div className="h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">

          {/* Profile Image */}

          <div className="absolute -bottom-16 left-8">

            <div className="relative">

              {

                profileImage ? (

                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                  />

                ) : (

                  <img
                    src="/vizhuthugal.png"
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover bg-white"
                  />
                )
              }

              {/* Upload */}

              {

                isEditing && (

                  <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-full cursor-pointer shadow-lg">

                    <Camera size={18} />

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={
                        handleImageUpload
                      }
                    />

                  </label>
                )
              }

            </div>

          </div>

        </div>

        {/* Content */}

        <div className="pt-24 p-8">

          {/* Name */}

          <div className="mb-10">

            <h2 className="text-2xl font-bold text-slate-800">

              {currentUser ? currentUser.name : 'User Profile'}

            </h2>

            <p className="text-slate-500 mt-1">

              Role: {currentUser ? currentUser.role?.toUpperCase() : ''}

            </p>

          </div>

          {/* ===================================== */}
          {/* DYNAMIC PRIVILEGES & ACCESS LEVELS */}
          {/* ===================================== */}
          {currentUser?.role === 'admin' && (
            <div className="mb-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-3xl p-8 border border-indigo-100/80 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-indigo-600 text-white p-3 rounded-2xl shadow-md shadow-indigo-100">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">State Admin Privileges</h3>
                  <p className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Status: ACTIVE (State level clearance)</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                You have state administrator clearance. You have full edit/delete privileges across all state metrics, reports, and attendance registers.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 hover:shadow-md transition">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="text-xs text-slate-600 font-semibold">Manage Employee Accounts</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 hover:shadow-md transition">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="text-xs text-slate-600 font-semibold">Full CRUD Database Privileges</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 hover:shadow-md transition">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="text-xs text-slate-600 font-semibold">Export System Reports & Analytics</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 hover:shadow-md transition">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span className="text-xs text-slate-600 font-semibold">State Level Audit Control</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200/60">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Administrative Settings (Simulated)</h4>
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition group-hover:scale-105" />
                    <span className="text-sm text-slate-600 font-semibold">Allow New Registration</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition group-hover:scale-105" />
                    <span className="text-sm text-slate-600 font-semibold">Maintenance Alerts</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition group-hover:scale-105" />
                    <span className="text-sm text-slate-600 font-semibold">Read-Only Mode for State Users</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentUser?.role === 'manager' && (
            <div className="mb-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-emerald-50 rounded-3xl p-8 border border-blue-100/80 shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-md shadow-blue-100">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Manager Privileges</h3>
                  <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">Status: ACTIVE (Manager level clearance)</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                You are logged in with Manager access. You have full edit/delete privileges on school level metrics, core team formations, and engagements.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 hover:shadow-md transition">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs text-slate-600 font-semibold">Full KPI Data Management</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 hover:shadow-md transition">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs text-slate-600 font-semibold">View Employees Registry</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 hover:shadow-md transition">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="text-xs text-slate-600 font-semibold">Manage Attendance Registers</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 opacity-60">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                  <span className="text-xs text-slate-500 font-semibold">System Configuration (Restricted)</span>
                </div>
              </div>
            </div>
          )}

          {currentUser?.role === 'employee' && (
            <div className="mb-12 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl p-8 border border-amber-100/80 shadow-md animate-fade-in">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-600 text-white p-3 rounded-2xl shadow-md shadow-amber-100">
                  <Shield size={24} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Employee Privilege Level</h3>
                  <p className="text-amber-700 text-xs font-bold uppercase tracking-wider">Status: VIEW ONLY (Read-Only)</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                You are logged in with standard Employee privileges. To preserve data integrity across the state, you cannot create, edit, or delete metrics.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 hover:shadow-md transition">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-xs text-slate-600 font-semibold">View Dashboard & Statistics</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 hover:shadow-md transition">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-xs text-slate-600 font-semibold">Browse All KPIs & Reports</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 opacity-60">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-xs text-slate-400 font-semibold line-through">Edit / Delete KPI Records</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 opacity-60">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-xs text-slate-400 font-semibold line-through">Add New KPI entries</span>
                </div>
              </div>
            </div>
          )}

          {/* Personal Info */}

          <div className="mb-12">

            <h3 className="text-xl font-bold text-slate-800 mb-6">

              Information

            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}

              <InputField
                icon={
                  <User size={18} />
                }
                label="Full Name"
                name="name"
                value={formData.name}
                placeholder="Enter full name"
                onChange={
                  handleChange
                }
                disabled={
                  !isEditing
                }
              />

              {/* Email */}

              <InputField
                icon={
                  <Mail size={18} />
                }
                label="Email Address"
                name="email"
                value={formData.email}
                placeholder="example@gmail.com"
                suffix="@gmail.com"
                disabled={
                  true
                }
              />

              {/* Phone */}

              <InputField
                icon={
                  <Phone size={18} />
                }
                label="Phone Number"
                name="phone"
                value={formData.phone}
                placeholder="Enter 10 digit number"
                maxLength={10}
                onChange={
                  handleChange
                }
                disabled={
                  !isEditing
                }
              />

              {/* Role */}

              <InputField
                icon={
                  <Shield size={18} />
                }
                label="Role"
                name="role"
                value={formData.role}
                placeholder="Enter role"
                disabled={
                  true
                }
              />

              {/* Department */}

              <InputField
                icon={
                  <Briefcase
                    size={18}
                  />
                }
                label="Department"
                name="department"
                value={
                  formData.department
                }
                placeholder="Enter department"
                onChange={
                  handleChange
                }
                disabled={
                  !isEditing
                }
              />

              {/* Location */}

              <InputField
                icon={
                  <MapPin size={18} />
                }
                label="Location"
                name="location"
                value={
                  formData.location
                }
                placeholder="Enter location"
                onChange={
                  handleChange
                }
                disabled={
                  !isEditing
                }
              />

            </div>

          </div>

          {/* Security */}

          {

            isEditing && (

              <div className="mb-12">

                <h3 className="text-xl font-bold text-slate-800 mb-6">

                  Security Settings

                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Password */}

                  <div>

                    <label className="text-sm font-semibold text-slate-600 mb-2 block">

                      New Password

                    </label>

                    <div className="flex items-center bg-slate-100 rounded-2xl px-4 h-14 border border-slate-200 focus-within:border-blue-500 transition-all">

                      <Lock
                        size={18}
                        className="text-slate-500"
                      />

                      <input
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        name="password"
                        value={
                          formData.password
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Enter new password"
                        className="bg-transparent flex-1 ml-3 outline-none text-slate-800"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        className="text-slate-500 hover:text-slate-700"
                      >

                        {
                          showPassword
                            ? '🙈'
                            : '👁️'
                        }

                      </button>

                    </div>

                  </div>

                  {/* Confirm Password */}

                  <div>

                    <label className="text-sm font-semibold text-slate-600 mb-2 block">

                      Confirm Password

                    </label>

                    <div className="flex items-center bg-slate-100 rounded-2xl px-4 h-14 border border-slate-200 focus-within:border-blue-500 transition-all">

                      <Lock
                        size={18}
                        className="text-slate-500"
                      />

                      <input
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        name="confirmPassword"
                        value={
                          formData.confirmPassword
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Confirm password"
                        className="bg-transparent flex-1 ml-3 outline-none text-slate-800"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="text-slate-500 hover:text-slate-700"
                      >

                        {
                          showConfirmPassword
                            ? '🙈'
                            : '👁️'
                        }

                      </button>

                    </div>

                  </div>

                </div>

              </div>
            )
          }

          {/* Save Button */}

          {

            isEditing && (

              <div className="flex justify-end">

                <button

                  onClick={
                    handleSave
                  }

                  className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-8 h-14 rounded-2xl font-semibold shadow-lg hover:scale-105"
                >

                  <Save size={20} />

                  Save Changes

                </button>

              </div>
            )
          }

          {/* Database Reset Section (Admin Only) */}
          {currentUser?.role === 'admin' && (
            <div className="mt-12 pt-8 border-t border-slate-200 text-left">
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Database size={20} className="text-red-500" />
                Database Administration (Supabase)
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Perform administrative database tasks. The button below will completely clear (remove) all existing records from all Supabase tables and re-insert (seed) the initial default mock data.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="text-left">
                  <h4 className="text-sm font-bold text-red-800">Danger Zone: Reset & Seed Database</h4>
                  <p className="text-xs text-red-600 mt-1">
                    This will delete all current records in Supabase and restore the database to its default state. This action cannot be undone.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetDatabase}
                  disabled={resetting}
                  className="bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-auto"
                >
                  {resetting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Resetting...
                    </>
                  ) : (
                    'Reset & Seed Database'
                  )}
                </button>
              </div>
            </div>
          )}


        </div>

      </div>

    </div>
  )
}

/* Input Component */

type InputProps = {

  icon: React.ReactNode

  label: string

  name: string

  value: string

  placeholder?: string

  suffix?: string

  maxLength?: number

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void

  disabled?: boolean

  type?: string
}

function InputField({

  icon,

  label,

  name,

  value,

  placeholder,

  suffix,

  maxLength,

  onChange,

  disabled,

  type = 'text',

}: InputProps) {

  return (

    <div>

      <label className="text-sm font-semibold text-slate-600 mb-2 block">

        {label}

      </label>

      <div className="flex items-center bg-slate-100 rounded-2xl px-4 h-14 border border-slate-200 focus-within:border-blue-500 transition-all">

        <div className="text-slate-500">

          {icon}

        </div>

        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={onChange}
          disabled={disabled}
          className={`bg-transparent flex-1 ml-3 outline-none ${
            disabled
              ? 'text-slate-500'
              : 'text-slate-800'
          }`}
        />

        {

          suffix && (

            <span className="text-slate-500 text-sm font-medium">

              {suffix}

            </span>
          )
        }

      </div>

      {

        name === 'phone' &&
        value.length > 0 &&
        value.length < 10 && (

          <p className="text-red-500 text-xs mt-2">

            Phone number must contain 10 digits

          </p>
        )
      }

    </div>
  )
}