import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock3, Search, Users, Pencil, Trash2, X } from 'lucide-react';

import api from '../services/api'

export default function Attendance() {

  // =====================================
  // STATES
  // =====================================

  const [attendance, setAttendance] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'day' | 'month'>('all')
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().substring(0, 7))
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [employeeName, setEmployeeName] = useState('')
  const [checkInTime, setCheckInTime] = useState('')
  const [checkOutTime, setCheckOutTime] = useState('')
  const [workDone, setWorkDone] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showMyOnly, setShowMyOnly] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const u = JSON.parse(userStr)
        setCurrentUser(u)
        if (u.role === 'employee') {
          setShowMyOnly(true)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // =====================================
  // FETCH ATTENDANCE
  // =====================================

  const fetchAttendance =
    async () => {

      try {

        const res =
          await api.get(
            '/attendance'
          )

        setAttendance(
            res.data.data || []
            )

      } catch (error) {

        console.log(
          'FETCH ERROR:',
          error
        )
      }
    }

  useEffect(() => {

    fetchAttendance()

  }, [])

  // =====================================
  // EDIT
  // =====================================

  const handleEdit =
    (item: any) => {

      setEditId(item.id)

      setEmployeeName(
        item.employee_name || ''
      )

      setCheckInTime(
        item.check_in
          ?.slice(0, 16) || ''
      )

      setCheckOutTime(
        item.check_out
          ?.slice(0, 16) || ''
      )

      setWorkDone(
        item.work_done || ''
      )

      setShowModal(true)
    }

  // =====================================
  // DELETE
  // =====================================

  const handleDelete =
    async (id: number) => {

      const confirmDelete =
        window.confirm(
          'Delete attendance record?'
        )

      if (!confirmDelete)
        return

      try {

        await api.delete(
          `/attendance/${id}`
        )

        fetchAttendance()

      } catch (error) {

        console.log(
          'DELETE ERROR:',
          error
        )
      }
    }
  // =====================================
  // CHECKOUT
  // =====================================

  const handleCheckout = async (id: number) => {
    try {
      const now = new Date().toISOString().slice(0, 16);
      await api.put(`/attendance/${id}`, { check_out: now });
      // Refresh data
      fetchAttendance();
      // Logout and navigate
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
    } catch (error) {
      console.log('CHECKOUT ERROR:', error);
    }
  };
 const handleUpdate =
  async () => {

    try {

      const payload = {

        employee_name:
          employeeName,

        check_in:
          checkInTime,

        check_out:
          checkOutTime,

        work_done:
          workDone,
      }

      // =====================================
      // UPDATE
      // =====================================

      if (editId) {

        await api.put(

          `/attendance/${editId}`,

          payload
        )
      }

      // =====================================
      // ADD
      // =====================================

      else {

        await api.post(

          '/attendance',

          payload
        )
      }

      fetchAttendance()

      setShowModal(false);
      setEditId(null);
      if (checkOutTime) {
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
      }

    }

    catch (error) {

      console.log(
        'SAVE ERROR:',
        error
      )
    }
  }

  // =====================================
  // FILTER
  // =====================================

  const filteredAttendance =
    useMemo(() => {

      return attendance.filter(
        (item: any) => {
          if (showMyOnly && currentUser?.name && item.employee_name?.toLowerCase() !== currentUser.name.toLowerCase()) {
            return false
          }

          const matchesSearch =

            item.employee_name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )

          let matchesDate = true
          if (filterType === 'day') {
            matchesDate = !selectedDate || item.check_in?.split('T')[0] === selectedDate
          } else if (filterType === 'month') {
            matchesDate = !selectedMonth || item.check_in?.substring(0, 7) === selectedMonth
          }

          return (
            matchesSearch &&
            matchesDate
          )
        }
      )

    }, [
      attendance,
      search,
      filterType,
      selectedDate,
      selectedMonth,
      showMyOnly,
      currentUser,
    ])

  // =====================================
  // STATS
  // =====================================

  const totalAttendance =
    filteredAttendance.length

  const todayDate =
    new Date()
      .toISOString()
      .split('T')[0]

  const todayPresent =
    filteredAttendance.filter(
      (item) =>
        item.check_in
          ?.split('T')[0] ===
        todayDate
    ).length

  const totalHours =
    filteredAttendance.reduce(
      (total, item) => {

        if (
          !item.check_in ||
          !item.check_out
        ) return total

        const checkIn =
          new Date(
            item.check_in
          )

        const checkOut =
          new Date(
            item.check_out
          )

        const diff =
          (
            checkOut.getTime() -
            checkIn.getTime()
          ) /
          (1000 * 60 * 60)

        return total + diff

      },
      0
    )

  return (

    <div className="p-6 bg-slate-100 min-h-screen">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">

          Attendance Dashboard

        </h1>

        <p className="text-slate-500 mt-2">

          Employee daily attendance reports

        </p>

      </div>

      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {/* Total */}

        <div className="bg-white rounded-3xl p-5 shadow-sm border">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">

                Total Reports

              </p>

              <h2 className="text-3xl font-bold mt-2">

                {totalAttendance}

              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

              <Users
                size={28}
                className="text-blue-600"
              />

            </div>

          </div>

        </div>

        {/* Today */}

        <div className="bg-white rounded-3xl p-5 shadow-sm border">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">

                Today Present

              </p>

              <h2 className="text-3xl font-bold mt-2">

                {todayPresent}

              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">

              <CalendarDays
                size={28}
                className="text-emerald-600"
              />

            </div>

          </div>

        </div>

        {/* Hours */}

        <div className="bg-white rounded-3xl p-5 shadow-sm border">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-slate-500 text-sm">

                Total Hours

              </p>

              <h2 className="text-3xl font-bold mt-2">

                {totalHours.toFixed(1)}h

              </h2>

            </div>

            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">

              <Clock3
                size={28}
                className="text-orange-600"
              />

            </div>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* SEARCH */}
      {/* ===================================== */}

      <div className="bg-white rounded-3xl p-5 shadow-sm border mb-8">

        <div className="flex flex-col md:flex-row gap-4 items-center">

          <div className="flex-1 w-full relative">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full h-14 rounded-2xl border border-slate-300 pl-12 pr-4 outline-none"
            />

          </div>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full md:w-auto self-stretch md:self-auto gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 md:flex-initial px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilterType('day')}
              className={`flex-1 md:flex-initial px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                filterType === 'day'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Day-wise
            </button>
            <button
              onClick={() => setFilterType('month')}
              className={`flex-1 md:flex-initial px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                filterType === 'month'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Month-wise
            </button>
          </div>

          {filterType === 'day' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-14 px-5 rounded-2xl border border-slate-300 outline-none w-full md:w-auto font-medium text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
            />
          )}

          {filterType === 'month' && (
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="h-14 px-5 rounded-2xl border border-slate-300 outline-none w-full md:w-auto font-medium text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
            />
          )}

          {currentUser?.role === 'employee' && (
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border px-5 py-3 rounded-2xl h-14 w-full md:w-auto whitespace-nowrap">
              <input
                type="checkbox"
                checked={showMyOnly}
                onChange={(e) => setShowMyOnly(e.target.checked)}
                className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
              />
              <span className="text-sm font-semibold text-slate-700 select-none">
                Show My Attendance Only
              </span>
            </label>
          )}

        </div>

      </div>

      {/* ===================================== */}
{/* ADD BUTTON */}
{/* ===================================== */}

{currentUser?.role !== 'employee' && (
<div className="flex justify-end mb-6">

  <button

    onClick={() => {

      setEditId(null)

      setEmployeeName('')

      setCheckInTime('')

      setCheckOutTime('')

      setWorkDone('')

      setShowModal(true)

    }}

    className="h-14 px-6 bg-blue-600 hover:bg-blue-700 rounded-2xl text-white font-semibold"

  >

    Add Attendance

  </button>

</div>
)}

      {/* ===================================== */}
      {/* TABLE */}
      {/* ===================================== */}

      <div className="overflow-x-auto bg-white rounded-3xl shadow-sm border">

        <table className="w-full">

          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="p-5 text-left">
                Employee
              </th>

              <th className="p-5 text-left">
                Check In
              </th>

              <th className="p-5 text-left">
                Check Out
              </th>

              <th className="p-5 text-left">
                Work Done
              </th>

              <th className="p-5 text-left">
                Hours
              </th>

              <th className="p-5 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {
              filteredAttendance.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="text-center py-16"
                  >

                    No Attendance Found

                  </td>

                </tr>

              ) : (

                filteredAttendance.map(
                  (item: any) => {

                    const checkIn =
                      item.check_in
                        ? new Date(item.check_in)
                        : null

                    const checkOut =
                      item.check_out
                        ? new Date(item.check_out)
                        : null

                    const hours =

                      checkIn &&
                      checkOut

                        ? (
                            (
                              checkOut.getTime() -
                              checkIn.getTime()
                            ) /
                            (1000 * 60 * 60)
                          ).toFixed(1)

                        : '0'

                    return (

                      <tr
                        key={item.id}
                        className="border-b hover:bg-slate-50"
                      >

                        <td className="p-5 font-semibold">

                          {item.employee_name}

                        </td>

                        <td className="p-5">

                          {
                            checkIn
                              ?.toLocaleString()
                          }

                        </td>

                        <td className="p-5">

                          {
                            checkOut
                              ?.toLocaleString()
                              || '--'
                          }

                        </td>

                        <td className="p-5">

                          {
                            item.work_done
                              || '--'
                          }

                        </td>

                        <td className="p-5">

                          {hours} hrs

                        </td>

                        <td className="p-5">

                          {currentUser?.role !== 'employee' ? (
                            <div className="flex gap-3">

                              {/* Edit */}

                              <button
                                onClick={() =>
                                  handleEdit(item)
                                }
                                className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"
                              >

                                <Pencil
                                  size={18}
                                  className="text-blue-600"
                                />

                              </button>

                              {/* Delete */}

                              <button
                                onClick={() =>
                                  handleDelete(item.id)
                                }
                                className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"
                              >

                                <Trash2
                                  size={18}
                                  className="text-red-600"
                                />

                              </button>

                            </div>
                          ) : (
                            <div className="flex gap-3">
                              {!item.check_out && (
                                <button
                                  onClick={() => handleCheckout(item.id)}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-white text-sm font-semibold"
                                >
                                  Check Out
                                </button>
                              )}
                            </div>
                          )}

                        </td>

                      </tr>
                    )
                  }
                )
              )
            }

          </tbody>

        </table>

      </div>

      {/* ===================================== */}
      {/* EDIT MODAL */}
      {/* ===================================== */}

      {
        showModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl relative">

              {/* Close */}

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="absolute top-5 right-5"
              >

                <X
                  size={24}
                  className="text-slate-500"
                />

              </button>

              <h2 className="text-2xl font-bold mb-6">

                Edit Attendance

              </h2>

              <div className="grid gap-5">

                {/* Employee */}

                <input
                  type="text"
                  placeholder="Employee Name"
                  value={employeeName}
                  onChange={(e) =>
                    setEmployeeName(
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-slate-300 px-4 outline-none"
                />

                {/* Check In */}

                <input
                  type="datetime-local"
                  value={checkInTime}
                  onChange={(e) =>
                    setCheckInTime(
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-slate-300 px-4 outline-none"
                />

                {/* Check Out */}

                <input
                  type="datetime-local"
                  value={checkOutTime}
                  onChange={(e) =>
                    setCheckOutTime(
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-slate-300 px-4 outline-none"
                />

                {/* Work Done */}

                <textarea
                  rows={5}
                  placeholder="Work Done"
                  value={workDone}
                  onChange={(e) =>
                    setWorkDone(
                      e.target.value
                    )
                  }
                  className="w-full rounded-2xl border border-slate-300 p-4 outline-none"
                />

              </div>

              {/* Update */}

              <button
                onClick={
                  handleUpdate
                }
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl text-white font-semibold mt-8"
              >

                Update Attendance

              </button>

            </div>

          </div>
        )
      }

    </div>
  )
}