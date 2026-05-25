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
} from 'lucide-react'

import {
  useState,
} from 'react'
import BackButton from '../components/BackButton'

export default function ProfileSettings() {

  const [isEditing, setIsEditing] =
    useState(false)

  const [profileImage, setProfileImage] =
    useState<string | null>(null)

  const [showPassword, setShowPassword] =
    useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)

  const [formData, setFormData] =
    useState({

      name: '',

      email: '',

      phone: '',

      role: '',

      department: '',

      location: '',

      password: '',

      confirmPassword: '',
    })

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      e.target.files?.[0]

    if (file) {

      const imageUrl =
        URL.createObjectURL(file)

      setProfileImage(imageUrl)
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

    if (
      formData.phone &&
      formData.phone.length < 10
    ) {

      alert(
        'Phone number must contain 10 digits'
      )

      return
    }

    if (
      formData.email &&
      !formData.email.includes(
        '@gmail.com'
      )
    ) {

      alert(
        'Email must contain @gmail.com'
      )

      return
    }

    setIsEditing(false)

    alert(
      'Profile Updated Successfully'
    )
  }

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

              State Admin

            </h2>

            <p className="text-slate-500 mt-1">

              Alumni Connect

            </p>

          </div>

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
                onChange={
                  handleChange
                }
                disabled={
                  !isEditing
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
                onChange={
                  handleChange
                }
                disabled={
                  !isEditing
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