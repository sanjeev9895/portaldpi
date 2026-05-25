import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Save,
} from 'lucide-react'

import {
  useState,
} from 'react'
import BackButton from '../components/BackButton'

export default function NotificationSettings() {

  const [isEditing, setIsEditing] =
    useState(false)

  const [settings, setSettings] =
    useState({

      emailNotifications: true,

      pushNotifications: true,

      smsNotifications: false,

      systemAlerts: true,
    })

  const toggleSetting = (
    key: keyof typeof settings
  ) => {

    setSettings({

      ...settings,

      [key]:
        !settings[key],
    })
  }

  const handleSave = () => {

    setIsEditing(false)

    alert(
      'Notification Settings Saved'
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

            Notification Settings

          </h1>

          <p className="text-slate-500 mt-2">

            Manage alerts and notification preferences

          </p>

        </div>

      </div>

      {/* Main Card */}

      <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 p-8">

        <div className="space-y-6">

          {/* Email */}

          <SettingCard
            icon={
              <Mail size={22} />
            }
            title="Email Notifications"
            description="Receive updates through email"
            enabled={
              settings.emailNotifications
            }
            onToggle={() =>
              toggleSetting(
                'emailNotifications'
              )
            }
            isEditing={
              isEditing
            }
          />

          {/* Push */}

          <SettingCard
            icon={
              <Bell size={22} />
            }
            title="Push Notifications"
            description="Receive browser notifications"
            enabled={
              settings.pushNotifications
            }
            onToggle={() =>
              toggleSetting(
                'pushNotifications'
              )
            }
            isEditing={
              isEditing
            }
          />

          {/* SMS */}

          <SettingCard
            icon={
              <Smartphone size={22} />
            }
            title="SMS Notifications"
            description="Receive SMS alerts"
            enabled={
              settings.smsNotifications
            }
            onToggle={() =>
              toggleSetting(
                'smsNotifications'
              )
            }
            isEditing={
              isEditing
            }
          />

          {/* Alerts */}

          <SettingCard
            icon={
              <MessageSquare
                size={22}
              />
            }
            title="System Alerts"
            description="Important dashboard alerts"
            enabled={
              settings.systemAlerts
            }
            onToggle={() =>
              toggleSetting(
                'systemAlerts'
              )
            }
            isEditing={
              isEditing
            }
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

                 Edit Settings

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

/* Setting Card */

type CardProps = {

  icon: React.ReactNode

  title: string

  description: string

  enabled: boolean

  onToggle: () => void

  isEditing: boolean
}

function SettingCard({

  icon,

  title,

  description,

  enabled,

  onToggle,

  isEditing,

}: CardProps) {

  return (

    <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl p-5">

      <div className="flex items-center gap-4">

        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">

          {icon}

        </div>

        <div>

          <h3 className="font-bold text-slate-800">

            {title}

          </h3>

          <p className="text-slate-500 text-sm mt-1">

            {description}

          </p>

        </div>

      </div>

      {/* Toggle */}

      <button

        disabled={!isEditing}

        onClick={onToggle}

        className={`w-14 h-8 rounded-full transition relative ${
          enabled
            ? 'bg-blue-600'
            : 'bg-slate-300'
        } ${
          !isEditing
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
      >

        <div
          className={`w-6 h-6 bg-white rounded-full absolute top-1 transition ${
            enabled
              ? 'right-1'
              : 'left-1'
          }`}
        />

      </button>

    </div>
  )
}