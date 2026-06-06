import {
  Bell,
  Menu,
} from 'lucide-react';

import {
  useNavigate,
} from 'react-router-dom';

import { 
  useState, 
  useEffect,
} from 'react';

export default function Navbar() {

  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string>('/vizhuthugal.png');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        const email = parsedUser.email || '';
        const savedImages = JSON.parse(localStorage.getItem('profileImages') || '{}');
        if (savedImages[email]) {
          setProfileImage(savedImages[email]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (

    <div className="bg-white h-20 px-8 flex items-center justify-between shadow-sm border-b border-slate-200">

      {/* Left Section */}
      <div className="flex items-center gap-5">

        {/* Menu Icon */}
        <button className="lg:hidden bg-slate-100 p-2 rounded-xl hover:bg-slate-200 transition">

          <Menu
            size={22}
            className="text-slate-700"
          />

        </button>

        {/* Title */}
        <div>

          <h1 className="text-3xl font-bold text-slate-800 tracking-wide">
            Vizhuthugal
          </h1>

          <p className="text-sm text-slate-500">
            Employee Management Dashboard
          </p>

        </div>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative bg-slate-100 p-3 rounded-2xl hover:bg-slate-200 transition"
        >

          <Bell
            size={22}
            className="text-slate-700"
          />

          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full"></span>

        </button>

        {/* Profile */}
        <div 
          onClick={() => navigate('/profile-settings')}
          className="flex items-center gap-3 bg-slate-100 px-3 py-2 rounded-2xl cursor-pointer hover:bg-slate-200 transition"
        >

          <img
            src={profileImage}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />

          <div className="hidden sm:block">

            <h2 className="text-sm font-semibold text-slate-800">
               {user?.name || 'State Admin'}
            </h2>

            <p className="text-xs text-slate-500 capitalize">
             {user?.role || 'admin'}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}