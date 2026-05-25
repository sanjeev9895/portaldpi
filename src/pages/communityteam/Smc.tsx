import {
  Users,
  Search,
  Filter,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

import { useEffect, useState } from 'react'
import api from '../../services/api'
import BackButton from '../../components/BackButton'

export default function SMCPage() {

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [smcData, setSmcData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  useEffect(() => {
    fetchSMC()
  }, [])

  const fetchSMC = async () => {

    try {

      const response =
        await api.get('/smc')

      setSmcData(
        Array.isArray(response.data)
          ? response.data
          : []
      )

    } catch (error) {

      console.log(error)

    }
  }

  const handleDelete = async (id: number) => {

    const confirmDelete =
      window.confirm('Delete this record?')

    if (!confirmDelete) return

    try {

      await api.delete(`/smc/${id}`)

      setSmcData(
        smcData.filter(
          (item) => item.id !== id
        )
      )

    } catch (error) {

      console.log(error)

    }
  }

  const filteredData = smcData.filter((item) => {

    const matchesSearch =

      item.school_name
        ?.toLowerCase()
        .includes(search.toLowerCase())

    const matchesStatus =

      statusFilter === 'All'
        ? true
        : item.meeting_status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages =
    Math.ceil(filteredData.length / itemsPerPage)

  const startIndex =
    (currentPage - 1) * itemsPerPage

  const currentData =
    filteredData.slice(
      startIndex,
      startIndex + itemsPerPage
    )

  const completedCount =
    smcData.filter(
      (item) =>
        item.meeting_status === 'Completed'
    ).length

  const pendingCount =
    smcData.filter(
      (item) =>
        item.meeting_status !== 'Completed'
    ).length

  return (

    <div className="min-h-screen bg-slate-100 p-8">

      {/* BACK */}
      <div className="mb-6">
        <BackButton />
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            SMC Management
          </h1>

          <p className="text-slate-500 mt-2">
            School Management Committee Monitoring
          </p>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="flex justify-between items-center mb-4">

            <div>
              <p className="text-slate-400 text-sm">
                Total Schools
              </p>

              <h2 className="text-4xl font-bold text-slate-800">
                {smcData.length}
              </h2>
            </div>

            <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
              <Users size={24} />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="flex justify-between items-center mb-4">

            <div>
              <p className="text-slate-400 text-sm">
                Completed Meetings
              </p>

              <h2 className="text-4xl font-bold text-green-600">
                {completedCount}
              </h2>
            </div>

            <div className="bg-green-100 text-green-600 p-3 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="flex justify-between items-center mb-4">

            <div>
              <p className="text-slate-400 text-sm">
                Pending Meetings
              </p>

              <h2 className="text-4xl font-bold text-amber-500">
                {pendingCount}
              </h2>
            </div>

            <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl">
              <AlertCircle size={24} />
            </div>

          </div>

        </div>

      </div>

      {/* TOOLBAR */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border mb-6 flex flex-wrap gap-4">

        <div className="flex items-center bg-slate-100 rounded-2xl px-4 h-12 flex-1">

          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search school..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-transparent outline-none px-3 w-full"
          />

        </div>

        <div className="flex items-center bg-slate-100 rounded-2xl px-4 h-12">

          <Filter
            size={18}
            className="text-slate-400 mr-2"
          />

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setCurrentPage(1)
            }}
            className="bg-transparent outline-none"
          >

            <option value="All">
              All Status
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Pending">
              Pending
            </option>

          </select>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="text-left p-4">
                  S.No
                </th>

                <th className="text-left p-4">
                  School Name
                </th>

                <th className="text-left p-4">
                  District
                </th>

                <th className="text-left p-4">
                  Committee Members
                </th>

                <th className="text-left p-4">
                  Meeting Status
                </th>

                <th className="text-left p-4">
                  Meeting Date
                </th>

                <th className="text-left p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {currentData.map((item, index) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-4">
                    {startIndex + index + 1}
                  </td>

                  <td className="p-4 font-semibold">
                    {item.school_name}
                  </td>

                  <td className="p-4">
                    {item.district}
                  </td>

                  <td className="p-4">
                    {item.committee_members}
                  </td>

                  <td className="p-4">

                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.meeting_status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>

                      {item.meeting_status}

                    </span>

                  </td>

                  <td className="p-4">
                    {item.meeting_date}
                  </td>

                  <td className="p-4">

                    <div className="flex gap-2">

                      <button className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-100 text-red-600 p-2 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-5">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
            className="bg-slate-100 p-2 rounded-xl disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>

          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
            className="bg-slate-100 p-2 rounded-xl disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>

        </div>

      </div>

    </div>
  )
}