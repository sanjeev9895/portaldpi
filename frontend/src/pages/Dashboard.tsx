import {
  Users,
  UserCheck,
  FileText,
  Clock3,
  TrendingUp,
  Activity,
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

  /* ===================================== */
  /* STATES */
  /* ===================================== */

  const [employees, setEmployees] =
    useState<any[]>([])

  const [loading, setLoading] =
    useState(false)

  /* ===================================== */
  /* FETCH EMPLOYEES */
  /* ===================================== */

  useEffect(() => {

    fetchEmployees()

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

            Welcome back, State Admin 👋

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