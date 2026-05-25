import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

import {
  ClipboardCheck,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

type SidebarProps = {

  collapsed: boolean;

  setCollapsed:
    React.Dispatch<
      React.SetStateAction<boolean>
    >;
};

export default function Sidebar({

  collapsed,

  setCollapsed,

}: SidebarProps) {

  const location = useLocation();

  const navigate = useNavigate();

  const [openMenu, setOpenMenu] =
    useState<string | null>(null);

  // Logout

  const handleLogout = () => {

    navigate('/login');
  };

  // Auto Collapse Dropdown

  useEffect(() => {

    if (
      location.pathname !==
      '/communityteam' &&

      location.pathname !==
      '/mentorshipteam' &&

      location.pathname !==
      '/reports'
    ) {

      setOpenMenu(null);
    }

  }, [location.pathname]);

  const menuItems = [

    {
      title: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
    },

    {
      title: 'Employees',
      icon: <Users size={20} />,
      path: '/employees',
    },

    {
      title: 'Attendance',
      icon: <ClipboardCheck size={20} />,
      path: '/attendance',
    },

    {
      title: 'Reports',
      icon: <FileText size={20} />,

      children: [

        {
          title: 'Community Team',
          path: '/communityteam',
        },

        {
          title: 'Mentorship Team',
          path: '/mentorshipteam',
        },

        {
          title: 'Overall Report',
          path: '/reports',
        },
      ],
    },

    {
      title: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings',
    },
  ];

  return (

    <div

      className={`
        h-screen bg-gradient-to-b
        from-blue-900 to-blue-600
        text-white shadow-2xl
        flex flex-col justify-between
        fixed left-0 top-0 z-50
        transition-all duration-500
        
        ${
          collapsed
            ? 'w-24'
            : 'w-72'
        }
      `}
    >

      {/* Top */}

      <div>

        {/* Logo */}

        <div className="p-6 border-b border-blue-500/40">

          <div
            className={`
              flex items-center
              
              ${
                collapsed
                  ? 'justify-center'
                  : 'gap-4'
              }
            `}
          >

            <img
              src="/vizhuthugal.png"
              alt="Vizhuthugal Logo"
              className="w-14 h-14 rounded-2xl object-cover shadow-lg border-2 border-white"
            />

            {

              !collapsed && (

                <div
                  className="
                    transition-all
                    duration-500
                  "
                >

                  <h1 className="text-3xl font-bold tracking-wide">

                    Vizhuthugal

                  </h1>

                  <p className="text-blue-200 text-sm mt-1">

                    Alumni Connect

                  </p>

                </div>
              )
            }

          </div>

        </div>

        {/* Menu */}

        <div className="p-5">

          {

            !collapsed && (

              <p className="text-blue-200 text-xs uppercase mb-4 tracking-[3px] font-semibold">

                Admin Panel

              </p>
            )
          }

          <ul className="space-y-3">

            {

              menuItems.map((item, index) => {

                const active =
                  location.pathname ===
                  item.path;

                /* Dropdown */

                if (item.children) {

                  const isOpen =
                    openMenu ===
                    item.title;

                  const childActive =
                    item.children.some(
                      (child) =>
                        child.path ===
                        location.pathname
                    );

                  return (

                    <li
                      key={index}
                    >

                      {/* Parent */}

                      <div

                        onClick={() =>

                          setOpenMenu(

                            isOpen
                              ? null
                              : item.title
                          )
                        }

                        className={`
                          flex items-center
                          justify-between
                          px-5 py-4 rounded-2xl
                          transition-all duration-300
                          cursor-pointer font-medium text-lg
                          
                          ${
                            childActive
                              ? 'bg-white text-blue-700 shadow-xl'
                              : 'hover:bg-white/15'
                          }

                          ${
                            collapsed
                              ? 'justify-center'
                              : ''
                          }
                        `}
                      >

                        <div
                          className={`
                            flex items-center
                            
                            ${
                              collapsed
                                ? ''
                                : 'gap-4'
                            }
                          `}
                        >

                          {item.icon}

                          {

                            !collapsed && (

                              <span>

                                {item.title}

                              </span>
                            )
                          }

                        </div>

                        {

                          !collapsed && (

                            <div
                              className={`
                                transition-transform duration-300
                                
                                ${
                                  isOpen
                                    ? 'rotate-180'
                                    : ''
                                }
                              `}
                            >

                              <ChevronDown
                                size={18}
                              />

                            </div>
                          )
                        }

                      </div>

                      {/* Dropdown */}

                      {

                        !collapsed && (

                          <div
                            className={`
                              overflow-hidden
                              transition-all duration-500
                              
                              ${
                                isOpen
                                  ? 'max-h-52 opacity-100 mt-3'
                                  : 'max-h-0 opacity-0'
                              }
                            `}
                          >

                            <div className="ml-8 space-y-2">

                              {

                                item.children.map(
                                  (
                                    child,
                                    childIndex
                                  ) => {

                                    const childIsActive =
                                      location.pathname ===
                                      child.path;

                                    return (

                                      <Link
                                        key={childIndex}
                                        to={child.path}

                                        onClick={() =>
                                          setOpenMenu(null)
                                        }
                                      >

                                        <div

                                          className={`
                                            px-4 py-3 rounded-xl
                                            text-sm font-medium
                                            transition-all duration-300
                                            
                                            ${
                                              childIsActive
                                                ? 'bg-white text-blue-700 shadow-lg scale-[1.02]'
                                                : 'hover:bg-white/10 text-blue-100'
                                            }
                                          `}
                                        >

                                          • {child.title}

                                        </div>

                                      </Link>
                                    );
                                  }
                                )
                              }

                            </div>

                          </div>
                        )
                      }

                    </li>
                  );
                }

                /* Normal Menu */

                return (

                  <Link
                    key={index}
                    to={item.path}

                    onClick={() =>
                      setOpenMenu(null)
                    }
                  >

                    <li

                      className={`
                        flex items-center px-5 py-4 rounded-2xl transition-all duration-300 cursor-pointer font-medium text-lg
                        
                        ${
                          active
                            ? 'bg-white text-blue-700 shadow-xl scale-[1.02]'
                            : 'hover:bg-white/15 hover:text-white'
                        }

                        ${
                          collapsed
                            ? 'justify-center'
                            : 'gap-4'
                        }
                      `}
                    >

                      <div>

                        {item.icon}

                      </div>

                      {

                        !collapsed && (

                          <span>

                            {item.title}

                          </span>
                        )
                      }

                    </li>

                  </Link>
                );
              })
            }

          </ul>

        </div>

      </div>

      {/* Bottom Buttons */}

      <div className="p-5 border-t border-blue-500/40 space-y-3">

        {/* Logout */}

        <button

          onClick={handleLogout}

          className={`
            w-full flex items-center
            justify-center
            bg-white text-blue-700
            py-3 rounded-2xl font-semibold
            hover:bg-blue-100
            transition-all duration-300
            shadow-lg
            
            ${
              collapsed
                ? ''
                : 'gap-3'
            }
          `}
        >

          <LogOut size={20} />

          {

            !collapsed && (
              <>Logout</>
            )
          }

        </button>

        {/* Collapse */}

        <button

          onClick={() =>
            setCollapsed(
              !collapsed
            )
          }

          className={`
            w-full flex items-center
            justify-center
            bg-blue-500/20
            border border-blue-300/20
            text-white py-3
            rounded-2xl font-semibold
            hover:bg-blue-400/20
            transition-all duration-500
            
            ${
              collapsed
                ? ''
                : 'gap-3'
            }
          `}
        >

          {

            collapsed
              ? (
                <PanelLeftOpen
                  size={20}
                />
              ) : (
                <PanelLeftClose
                  size={20}
                />
              )
          }

        </button>

      </div>

    </div>
  );
}