import {
  Bell,
  UserPlus,
  FileText,
  CalendarCheck,
  TriangleAlert,
  Clock3,
} from 'lucide-react';
import BackButton from '../components/BackButton'

export default function Notifications() {

  const notifications = [
    {
      id: 1,
      title: 'New Employee Added',
      message: 'Karthikeyan joined as Frontend Developer',
      time: '2 mins ago',
      icon: <UserPlus size={20} />,
      color: 'bg-blue-100 text-blue-600',
    },

    {
      id: 2,
      title: 'Attendance Updated',
      message: 'Attendance marked successfully for today',
      time: '10 mins ago',
      icon: <CalendarCheck size={20} />,
      color: 'bg-green-100 text-green-600',
    },

    {
      id: 3,
      title: 'Report Submitted',
      message: 'Daily work report uploaded by UI Team',
      time: '25 mins ago',
      icon: <FileText size={20} />,
      color: 'bg-purple-100 text-purple-600',
    },

    {
      id: 4,
      title: 'Pending Approval',
      message: '3 employee requests are waiting for approval',
      time: '40 mins ago',
      icon: <TriangleAlert size={20} />,
      color: 'bg-orange-100 text-orange-600',
    },

    {
      id: 5,
      title: 'Employee Updated',
      message: 'Arun Kumar updated profile information',
      time: '1 hour ago',
      icon: <UserPlus size={20} />,
      color: 'bg-cyan-100 text-cyan-600',
    },

    {
      id: 6,
      title: 'Attendance Late',
      message: '2 employees marked as late today',
      time: '2 hours ago',
      icon: <Clock3 size={20} />,
      color: 'bg-red-100 text-red-600',
    },

    {
      id: 7,
      title: 'System Update',
      message: 'Dashboard analytics updated successfully',
      time: '3 hours ago',
      icon: <Bell size={20} />,
      color: 'bg-indigo-100 text-indigo-600',
    },

    {
      id: 8,
      title: 'New Report Created',
      message: 'Backend Team created weekly progress report',
      time: '5 hours ago',
      icon: <FileText size={20} />,
      color: 'bg-pink-100 text-pink-600',
    },

    {
      id: 9,
      title: 'Task Completed',
      message: 'API integration completed successfully',
      time: 'Yesterday',
      icon: <CalendarCheck size={20} />,
      color: 'bg-emerald-100 text-emerald-600',
    },

    {
      id: 10,
      title: 'Security Alert',
      message: 'New login detected from Chennai',
      time: 'Yesterday',
      icon: <TriangleAlert size={20} />,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (

    <div className="space-y-8">
<div className="mb-6">

  <BackButton />

</div>
      {/* Header */}
      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            Notifications
          </h1>

          <p className="text-slate-500 mt-2">
            Stay updated with recent activities
          </p>

        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow-sm transition">

          Mark All as Read

        </button>

      </div>

      {/* Notifications List */}
      <div className="space-y-5">

        {notifications.map((item) => (

          <div
            key={item.id}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300"
          >

            <div className="flex items-start justify-between gap-5">

              {/* Left */}
              <div className="flex gap-5">

                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color}`}
                >

                  {item.icon}

                </div>

                {/* Content */}
                <div>

                  <h2 className="text-xl font-bold text-slate-800">
                    {item.title}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    {item.message}
                  </p>

                </div>

              </div>

              {/* Time */}
              <span className="text-sm text-slate-400 whitespace-nowrap">

                {item.time}

              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}