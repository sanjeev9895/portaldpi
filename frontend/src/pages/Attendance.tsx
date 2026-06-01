import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  CalendarDays,
  Clock3,
  Search,
  Users,
  Pencil,
  Trash2,
  X,
} from 'lucide-react'

import api from '../services/api'

export default function Attendance() {

  // =====================================
  // STATES
  // =====================================

  const [attendance, setAttendance] =
    useState<any[]>([])

  const [search, setSearch] =
    useState('')

  const [selectedDate, setSelectedDate] =
    useState('')

  const [showModal, setShowModal] =
    useState(false)

  const [editId, setEditId] =
    useState<number | null>(null)

  const [employeeName, setEmployeeName] =
    useState('')

  const [checkInTime, setCheckInTime] =
    useState('')

  const [checkOutTime, setCheckOutTime] =
    useState('')

  const [workDone, setWorkDone] =
    useState('')

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
  // UPDATE
  // =====================================

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

      setShowModal(false)

      setEditId(null)

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

          const matchesSearch =

            item.employee_name
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )

          const matchesDate =

            selectedDate === ''

              ? true

              : item.check_in
                  ?.split('T')[0] ===
                selectedDate

          return (
            matchesSearch &&
            matchesDate
          )
        }
      )

    }, [
      attendance,
      search,
      selectedDate,
    ])

  // =====================================
  // STATS
  // =====================================

  const totalAttendance =
    attendance.length

  const todayDate =
    new Date()
      .toISOString()
      .split('T')[0]

  const todayPresent =
    attendance.filter(
      (item) =>
        item.check_in
          ?.split('T')[0] ===
        todayDate
    ).length

  const totalHours =
    attendance.reduce(
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

        <div className="flex flex-col md:flex-row gap-4">

          <div className="flex-1 relative">

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

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            className="h-14 px-5 rounded-2xl border border-slate-300 outline-none"
          />

        </div>

      </div>

      {/* ===================================== */}
{/* ADD BUTTON */}
{/* ===================================== */}

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