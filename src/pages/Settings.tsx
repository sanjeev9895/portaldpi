import {
  User,
  Bell,
  Shield,
  ChevronRight,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';
import PageHeader from '../components/PageHeader';

export default function Settings() {

  const navigate =
    useNavigate();

  const settings = [

    {
      title: 'Profile Settings',

      icon: <User size={22} />,

      description:
        'Manage your personal profile information',

      path: '/profile-settings',
    },

    {
      title: 'Notification Settings',

      icon: <Bell size={22} />,

      description:
        'Control alerts and notifications',

      path: '/NotificationSettings',
    },

    {
      title: 'Security Settings',

      icon: <Shield size={22} />,

      description:
        'Update password and security preferences',

      path: '/SecuritySettings',
    },
  ];

  return (

    <div>
      
      <PageHeader
        title="Settings"
        subtitle="Manage your dashboard settings"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {settings.map((item, index) => (

          <div
            key={index}

            onClick={() =>
              navigate(item.path)
            }

            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >

            {/* Icon */}

            <div className="bg-blue-100 text-blue-600 w-fit p-4 rounded-2xl mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">

              {item.icon}
              
            </div>

            {/* Title */}

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold text-slate-800">

                {item.title}

              </h2>

              <ChevronRight
                size={20}
                className="text-slate-400 group-hover:text-blue-600 transition"
              />

            </div>

            {/* Description */}

            <p className="text-slate-500 mt-3 leading-6">

              {item.description}

            </p>

          </div>

        ))}

      </div>

    </div>
  );
}