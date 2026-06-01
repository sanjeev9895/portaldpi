import {
  Users,
  UserCheck,
  FileText,
  Clock3,
  TrendingUp,
  Activity,
  School,
  MessageSquare,
  CheckCircle,
  XCircle,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import axios from 'axios'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts'

export default function Dashboard() {

  const [employees, setEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [kpis, setKpis] = useState({
    schoolCommunities: 3,
    coreTeams: 3,
    whatsappGroups: 3,
    coreEngagements: 3
  })
  const [schoolCommunitiesList, setSchoolCommunitiesList] = useState<any[]>([])

  /* ===================================== */
  /* FETCH EMPLOYEES & KPIS */
  /* ===================================== */

  useEffect(() => {
    fetchEmployees()

    // Load logged-in user
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr))
      } catch (e) {
        console.error(e)
      }
    }

    // Load KPI counts from localStorage
    const schools = JSON.parse(localStorage.getItem('school_communities') || '[]')
    const teams = JSON.parse(localStorage.getItem('core_teams') || '[]')
    const whatsapp = JSON.parse(localStorage.getItem('whatsapp_groups') || '[]')
    const engagements = JSON.parse(localStorage.getItem('core_engagements') || '[]')

    const defaultSchools = [
      {
        id: 1,
        school_name: "Govt Hr Sec School",
        whatsapp_group: "GHSS Alumni 2025",
        mobilization: "Yes",
        members: 650,
        platform: "WhatsApp",
        remarks: "Active community",
      },
      {
        id: 2,
        school_name: "St. Joseph's Hr Sec School",
        whatsapp_group: "SJS Alumni Network",
        mobilization: "Yes",
        members: 820,
        platform: "Telegram",
        remarks: "Recently formed",
      },
      {
        id: 3,
        school_name: "Anna Matriculation School",
        whatsapp_group: "Anna Matric Old Boys",
        mobilization: "No",
        members: 510,
        platform: "Facebook",
        remarks: "Pending verification",
      }
    ]

    setKpis({
      schoolCommunities: schools.length > 0 ? schools.length : 3,
      coreTeams: teams.length > 0 ? teams.length : 3,
      whatsappGroups: whatsapp.length > 0 ? whatsapp.length : 3,
      coreEngagements: engagements.length > 0 ? engagements.length : 3,
    })

    setSchoolCommunitiesList(schools.length > 0 ? schools : defaultSchools)
  }, [])

  const fetchEmployees = async () => {

    try {

      setLoading(true)

      const res =
      
         await axios.get(
           'http://127.0.0.1:8000/employees'
          )        

      console.log(
        'EMPLOYEE API:',
        res.data
      )

      /* ===================================== */
      /* SAFE ARRAY FIX */
      /* ===================================== */

      const employeeData =

        Array.isArray(res.data)

          ? res.data

          : Array.isArray(
              res.data.data
            )

          ? res.data.data

          : []

      setEmployees(
        employeeData
      )

      setLoading(false)

    } catch (err) {

      console.log(
        'EMPLOYEE FETCH ERROR:',
        err
      )

      setEmployees([])

      setLoading(false)

    }
  }

  /* ===================================== */
  /* STATS */
  /* ===================================== */

  const stats = [

    {
      title: 'Total Employees',
      value: employees.length,
      icon: <Users size={28} />,
      bg: 'bg-blue-100',
      text: 'text-blue-600',
    },

    {
      title: 'Present Today',
      value: '98',
      icon: <UserCheck size={28} />,
      bg: 'bg-green-100',
      text: 'text-green-600',
    },

    {
      title: 'Reports Submitted',
      value: '42',
      icon: <FileText size={28} />,
      bg: 'bg-purple-100',
      text: 'text-purple-600',
    },

    {
      title: 'Pending Tasks',
      value: '12',
      icon: <Clock3 size={28} />,
      bg: 'bg-orange-100',
      text: 'text-orange-600',
    },
  ]

  /* ===================================== */
  /* ATTENDANCE CHART */
  /* ===================================== */

  const attendanceData = [

    {
      name: 'Present',
      value: 98,
    },

    {
      name: 'Absent',
      value: 12,
    },
  ]

  /* ===================================== */
  /* REPORT CHART */
  /* ===================================== */

  const reportData = [

    {
      month: 'Jan',
      reports: 12,
    },

    {
      month: 'Feb',
      reports: 18,
    },

    {
      month: 'Mar',
      reports: 25,
    },

    {
      month: 'Apr',
      reports: 20,
    },
  ]

  const COLORS = [
    '#2563eb',
    '#22c55e',
  ]

  return (

    <div className="space-y-8">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">

            Dashboard

          </h1>

          <p className="text-slate-500 mt-1">

            Welcome back, {currentUser ? currentUser.name : 'User'} 👋

          </p>

        </div>

        {/* ===================================== */}
        {/* PERFORMANCE */}
        {/* ===================================== */}

        <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-200">

          <div className="bg-green-100 p-3 rounded-xl">

            <TrendingUp
              className="text-green-600"
              size={24}
            />

          </div>

          <div>

            <h2 className="font-bold text-slate-800">

              +18%

            </h2>

            <p className="text-sm text-slate-500">

              Usage Increased

            </p>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item, index) => (

          <div
            key={index}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm mb-2">

                  {item.title}

                </p>

                <h2 className="text-4xl font-bold text-slate-800">

                  {item.value}

                </h2>

              </div>

              <div
                className={`${item.bg} ${item.text} p-4 rounded-2xl`}
              >

                {item.icon}

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ===================================== */}
      {/* ALUMNI COMMUNITY KPIS */}
      {/* ===================================== */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Alumni Community KPIs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              title: "School Communities",
              value: kpis.schoolCommunities,
              icon: <School size={28} />,
              bg: "bg-blue-100",
              text: "text-blue-600",
            },
            {
              title: "Core Teams Formed",
              value: kpis.coreTeams,
              icon: <Users size={28} />,
              bg: "bg-violet-100",
              text: "text-violet-600",
            },
            {
              title: "WhatsApp Groups",
              value: kpis.whatsappGroups,
              icon: <MessageSquare size={28} />,
              bg: "bg-green-100",
              text: "text-green-600",
            },
            {
              title: "Core Engagements",
              value: kpis.coreEngagements,
              icon: <Activity size={28} />,
              bg: "bg-emerald-100",
              text: "text-emerald-600",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm mb-2">{item.title}</p>
                  <h2 className="text-4xl font-bold text-slate-800">{item.value}</h2>
                </div>
                <div className={`${item.bg} ${item.text} p-4 rounded-2xl`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================== */}
      {/* ANALYTICS */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ===================================== */}
        {/* ATTENDANCE CHART */}
        {/* ===================================== */}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">

                Attendance Overview

              </h2>

              <p className="text-slate-500 mt-1">

                Daily attendance reflection

              </p>

            </div>

            <div className="bg-blue-100 p-3 rounded-xl">

              <Activity
                className="text-blue-600"
                size={22}
              />

            </div>

          </div>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={attendanceData}
                  dataKey="value"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                >

                  {
                    attendanceData.map(
                      (
                        _,
                        index
                      ) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[index]
                          }
                        />
                      )
                    )
                  }

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* ===================================== */}
        {/* REPORTS CHART */}
        {/* ===================================== */}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">

                Reports Analytics

              </h2>

              <p className="text-slate-500 mt-1">

                Monthly reports submitted

              </p>

            </div>

            <div className="bg-purple-100 p-3 rounded-xl">

              <FileText
                className="text-purple-600"
                size={22}
              />

            </div>

          </div>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={reportData}
              >

                <XAxis
                  dataKey="month"
                />

                <Tooltip />

                <Bar
                  dataKey="reports"
                  fill="#2563eb"
                  radius={[
                    10,
                    10,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* SCHOOL LEVEL ALUMNI COMMUNITIES (KP1) */}
      {/* ===================================== */}

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">

              School Level Alumni Communities (KP1)

            </h2>

            <p className="text-slate-500 mt-1 text-sm">

              Formed alumni networks, group sizes, and platform active status

            </p>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-200 text-left">

                <th className="py-4 text-slate-600 font-semibold text-sm">School Name</th>

                <th className="py-4 text-slate-600 font-semibold text-sm">WhatsApp Group</th>

                <th className="py-4 text-slate-600 font-semibold text-sm">Mobilization</th>

                <th className="py-4 text-slate-600 font-semibold text-sm">Members</th>

                <th className="py-4 text-slate-600 font-semibold text-sm">Platform</th>

                <th className="py-4 text-slate-600 font-semibold text-sm">Remarks</th>

              </tr>

            </thead>

            <tbody>

              {schoolCommunitiesList.map((item, index) => (

                <tr

                  key={item.id || index}

                  className="border-b border-slate-100 hover:bg-slate-50 transition-all"

                >

                  <td className="py-5 font-semibold text-slate-800">

                    {item.school_name}

                  </td>

                  <td className="py-5 text-slate-600">

                    {item.whatsapp_group || <span className="text-slate-300">—</span>}

                  </td>

                  <td className="py-5">

                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${

                      item.mobilization === "Yes"

                        ? "bg-emerald-50 text-emerald-700"

                        : "bg-red-50 text-red-600"

                    }`}>

                      {item.mobilization === "Yes" ? <CheckCircle size={12} /> : <XCircle size={12} />}

                      {item.mobilization}

                    </span>

                  </td>

                  <td className="py-5">

                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">

                      {Number(item.members).toLocaleString()}+

                    </span>

                  </td>

                  <td className="py-5 text-slate-600">

                    {item.platform || <span className="text-slate-300">—</span>}

                  </td>

                  <td className="py-5 text-slate-500 max-w-[200px] truncate" title={item.remarks}>

                    {item.remarks || <span className="text-slate-300">—</span>}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ===================================== */}
      {/* EMPLOYEE LIST */}
      {/* ===================================== */}

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">

              Employees

            </h2>

            <p className="text-slate-500 mt-1">

              Recent employee details

            </p>

          </div>

          <button
            onClick={fetchEmployees}
            className="bg-blue-600 text-white px-5 py-3 rounded-2xl text-sm hover:bg-blue-700 transition shadow-lg"
          >

            Refresh

          </button>

        </div>

        {/* ===================================== */}
        {/* LOADING */}
        {/* ===================================== */}

        {
          loading ? (

            <div className="text-center py-10 text-slate-500">

              Loading Employees...

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-200 text-left">

                    <th className="py-4 text-slate-600">
                      Name
                    </th>

                    <th className="py-4 text-slate-600">
                      Email
                    </th>

                    <th className="py-4 text-slate-600">
                      Phone
                    </th>

                    <th className="py-4 text-slate-600">
                      Department
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {
                    Array.isArray(employees) &&

                    employees.length > 0 ? (

                      employees.map((employee) => (

                        <tr
                          key={employee.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                        >

                          <td className="py-5 font-medium text-slate-800">

                            {employee.name}

                          </td>

                          <td className="py-5 text-slate-600">

                            {employee.email}

                          </td>

                          <td className="py-5 text-slate-600">

                            {
                              employee.phone ||
                              '-'
                            }

                          </td>

                          <td className="py-5 text-slate-600">

                            {
                              employee.department ||
                              '-'
                            }

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td
                          colSpan={4}
                          className="text-center py-10 text-slate-400"
                        >

                          No Employees Found

                        </td>

                      </tr>

                    )
                  }

                </tbody>

              </table>

            </div>

          )
        }

      </div>

    </div>
  )
}