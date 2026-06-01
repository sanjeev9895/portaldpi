import {
  Lock,
  Shield,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react'

import {
  useState,
} from 'react'
import BackButton from '../components/BackButton'

export default function SecuritySettings() {

  const [isEditing, setIsEditing] =
    useState(false)

  const [showPassword, setShowPassword] =
    useState(false)

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false)

  const [formData, setFormData] =
    useState({

      currentPassword: '',

      newPassword: '',

      confirmPassword: '',
    })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    })
  }

  const handleSave = () => {

    setIsEditing(false)

    alert(
      'Security Settings Updated'
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

            Security Settings

          </h1>

          <p className="text-slate-500 mt-2">

            Update password and secure your account

          </p>

        </div>

      </div>

      {/* Main Card */}

      <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 p-8">

        {/* Security Icon */}

        <div className="flex items-center gap-4 mb-10">

          <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">

            <Shield size={28} />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-800">

              Account Security

            </h2>

            <p className="text-slate-500 mt-1">

              Keep your account safe

            </p>

          </div>

        </div>

        {/* Form */}

        <div className="grid grid-cols-1 gap-6">

          {/* Current Password */}

          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={
              formData.currentPassword
            }
            onChange={
              handleChange
            }
            visible={showPassword}
            toggle={() =>
              setShowPassword(
                !showPassword
              )
            }
            disabled={!isEditing}
          />

          {/* New Password */}

          <PasswordField
            label="New Password"
            name="newPassword"
            value={
              formData.newPassword
            }
            onChange={
              handleChange
            }
            visible={showPassword}
            toggle={() =>
              setShowPassword(
                !showPassword
              )
            }
            disabled={!isEditing}
          />

          {/* Confirm Password */}

          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={
              formData.confirmPassword
            }
            onChange={
              handleChange
            }
            visible={
              showConfirmPassword
            }
            toggle={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            disabled={!isEditing}
          />

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4 mt-10">

          {

            !isEditing ? (

              <button

                onClick={() =>
                  setIsEditing(true)
                }

                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 transition text-white px-8 h-14 rounded-2xl font-semibold shadow-lg"
              >

                 Edit Security

              </button>

            ) : (

              <button

                onClick={
                  handleSave
                }

                className="flex items-center gap-3 bg-green-600 hover:bg-green-700 transition text-white px-8 h-14 rounded-2xl font-semibold shadow-lg"
              >

                <Save size={20} />

                Save Changes

              </button>
            )
          }

        </div>

      </div>

    </div>
  )
}

/* Password Field */

type PasswordProps = {

  label: string

  name: string

  value: string

  visible: boolean

  toggle: () => void

  disabled: boolean

  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
}

function PasswordField({

  label,

  name,

  value,

  visible,

  toggle,

  disabled,

  onChange,

}: PasswordProps) {

  return (

    <div>

      <label className="text-sm font-semibold text-slate-600 mb-2 block">

        {label}

      </label>

      <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl px-4 h-14">

        <Lock
          size={18}
          className="text-slate-500"
        />

        <input
          type={
            visible
              ? 'text'
              : 'password'
          }
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className={`bg-transparent flex-1 ml-3 outline-none ${
            disabled
              ? 'text-slate-500'
              : 'text-slate-800'
          }`}
        />

        <button
          type="button"
          onClick={toggle}
          className="text-slate-500 hover:text-slate-700"
        >

          {
            visible
              ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )
          }

        </button>

      </div>

    </div>
  )
}