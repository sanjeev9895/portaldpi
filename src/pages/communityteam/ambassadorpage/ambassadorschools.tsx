import {
  Search,
  School,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react'

import {
  useEffect,
  useState,
} from 'react'

import api from '../../../services/api'

import BackButton from '../../../components/BackButton'

export default function AmbassadorSchools() {

  const [search, setSearch] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('All')

  const [yearFilter, setYearFilter] =
    useState('2026')

  const [teamData, setTeamData] =
    useState<any[]>([])

  const [currentPage, setCurrentPage] =
    useState(1)

  const itemsPerPage = 10

  const years = Array.from(
    { length: 31 },
    (_, i) =>
      (2020 + i).toString()
  )

  useEffect(() => {

    fetchSchools()

  }, [])

  const fetchSchools = async () => {

    try {

      const response =
        await api.get(
          '/ambassador-schools'
        )

      setTeamData(

        Array.isArray(
          response.data.data
        )

          ? response.data.data

          : []

      )

    } catch (error) {

      console.log(error)

    }
  }

  const filteredData =
    teamData.filter((item) => {

      const matchesSearch =

        item.school_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        item.udise_code
          ?.toString()
          .includes(search)

      const matchesStatus =

        statusFilter === 'All'

          ? true

          : item.status
              ?.toLowerCase()
              === statusFilter
                ?.toLowerCase()

      const matchesYear =

        yearFilter === 'All'

          ? true

          : item.year
              ?.toString()
              === yearFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesYear
      )
    })

  const totalPages =
    Math.ceil(
      filteredData.length /
      itemsPerPage
    )

  const startIndex =
    (currentPage - 1) *
    itemsPerPage

  const currentData =
    filteredData.slice(
      startIndex,
      startIndex + itemsPerPage
    )

  const completedCount =
    filteredData.filter(

      (item) =>

        item.status
          ?.toLowerCase()
          ?.trim() ===
          'completed'

    ).length

  const pendingCount =
    filteredData.filter(

      (item) =>

        item.status
          ?.toLowerCase()
          ?.trim() !==
          'completed'

    ).length

  const districtCount =
    new Set(

      filteredData.map(
        (item) =>
          item.district
      )

    ).size

  const completionRate =

    filteredData.length > 0

      ? Math.round(

          (
            completedCount /
            filteredData.length
          ) * 100

        )

      : 0

  return (

    <div className="
      min-h-screen
      bg-slate-100
      p-6
    ">

      {/* BACK */}

      <div className="mb-6">

        <BackButton />

      </div>

      {/* HEADER */}

      <div className="
        flex items-center
        justify-between
        mb-10
      ">

        <div>

          <h1 className="
            text-5xl
            font-bold
            text-slate-800
          ">

            Ambassador School List

          </h1>

          <p className="
            text-slate-500
            mt-3
            text-lg
          ">

            Track ambassador
            schools and activities

          </p>

        </div>

      </div>

      {/* STATS */}

      <div className="
        grid grid-cols-1
        md:grid-cols-4
        gap-6
        mb-8
      ">

        {/* TOTAL */}

        <div className="
          bg-white
          rounded-3xl
          p-6
          shadow-sm
        ">

          <div className="
            flex items-center
            justify-between
          ">

            <div>

              <p className="
                text-slate-400
                text-sm
              ">

                Total Schools

              </p>

              <h2 className="
                text-4xl
                font-bold
                text-slate-800
                mt-2
              ">

                {
                  filteredData.length
                }

              </h2>

            </div>

            <div className="
              w-14 h-14
              rounded-2xl
              bg-violet-100
              flex items-center
              justify-center
              text-violet-600
            ">

              <School size={28} />

            </div>

          </div>

        </div>

        {/* COMPLETED */}

        <div className="
          bg-white
          rounded-3xl
          p-6
          shadow-sm
        ">

          <div className="
            flex items-center
            justify-between
          ">

            <div>

              <p className="
                text-slate-400
                text-sm
              ">

                Completed

              </p>

              <h2 className="
                text-4xl
                font-bold
                text-green-600
                mt-2
              ">

                {
                  completedCount
                }

              </h2>

            </div>

            <div className="
              w-14 h-14
              rounded-2xl
              bg-green-100
              flex items-center
              justify-center
              text-green-600
            ">

              <CheckCircle2 size={28} />

            </div>

          </div>

        </div>

        {/* PENDING */}

        <div className="
          bg-white
          rounded-3xl
          p-6
          shadow-sm
        ">

          <div className="
            flex items-center
            justify-between
          ">

            <div>

              <p className="
                text-slate-400
                text-sm
              ">

                Pending

              </p>

              <h2 className="
                text-4xl
                font-bold
                text-amber-500
                mt-2
              ">

                {
                  pendingCount
                }

              </h2>

            </div>

            <div className="
              w-14 h-14
              rounded-2xl
              bg-amber-100
              flex items-center
              justify-center
              text-amber-600
            ">

              <AlertCircle size={28} />

            </div>

          </div>

        </div>

        {/* DISTRICT */}

        <div className="
          bg-white
          rounded-3xl
          p-6
          shadow-sm
        ">

          <div className="
            flex items-center
            justify-between
          ">

            <div>

              <p className="
                text-slate-400
                text-sm
              ">

                Districts

              </p>

              <h2 className="
                text-4xl
                font-bold
                text-cyan-600
                mt-2
              ">

                {
                  districtCount
                }

              </h2>

            </div>

            <div className="
              w-14 h-14
              rounded-2xl
              bg-cyan-100
              flex items-center
              justify-center
              text-cyan-600
            ">

              🏫

            </div>

          </div>

        </div>

      </div>

      {/* TOOLBAR */}

      <div className="
        bg-white
        rounded-3xl
        p-5
        shadow-sm
        mb-6
        flex flex-wrap
        gap-4
      ">

        {/* SEARCH */}

        <div className="
          flex items-center
          bg-slate-100
          rounded-2xl
          px-4
          h-12
          flex-1
        ">

          <Search
            size={18}
            className="
              text-slate-400
            "
          />

          <input

            type="text"

            placeholder="
              Search school or UDISE...
            "

            value={search}

            onChange={(e) => {

              setSearch(
                e.target.value
              )

              setCurrentPage(1)

            }}

            className="
              bg-transparent
              outline-none
              px-3
              w-full
            "
          />

        </div>

        {/* STATUS */}

        <div className="
          flex items-center
          bg-slate-100
          rounded-2xl
          px-4
          h-12
        ">

          <Filter
            size={16}
            className="
              text-slate-400
              mr-2
            "
          />

          <select

            value={statusFilter}

            onChange={(e) => {

              setStatusFilter(
                e.target.value
              )

              setCurrentPage(1)

            }}

            className="
              bg-transparent
              outline-none
            "
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

        {/* YEAR */}

        <div className="
          flex items-center
          bg-slate-100
          rounded-2xl
          px-4
          h-12
        ">

          <Filter
            size={16}
            className="
              text-slate-400
              mr-2
            "
          />

          <select

            value={yearFilter}

            onChange={(e) => {

              setYearFilter(
                e.target.value
              )

              setCurrentPage(1)

            }}

            className="
              bg-transparent
              outline-none
            "
          >

            <option value="All">

              All Years

            </option>

            {

              years.map(
                (year) => (

                  <option
                    key={year}
                    value={year}
                  >

                    {year}

                  </option>
                )
              )
            }

          </select>

        </div>

      </div>

      {/* TABLE */}

      <div className="
        bg-white
        rounded-3xl
        shadow-sm
        overflow-hidden
      ">

        <div className="
          overflow-x-auto
        ">

          <table className="
            w-full
          ">

            <thead className="
              bg-cyan-600
              text-white
            ">

              <tr>

                <th className="
                  text-left p-4
                ">

                  S.No

                </th>

                <th className="
                  text-left p-4
                ">

                  UDISE

                </th>

                <th className="
                  text-left p-4
                ">

                  School Name

                </th>

                <th className="
                  text-left p-4
                ">

                  District

                </th>

                <th className="
                  text-left p-4
                ">

                  Block

                </th>

                <th className="
                  text-left p-4
                ">

                  Category

                </th>

                <th className="
                  text-left p-4
                ">

                  Status

                </th>

              </tr>

            </thead>

            <tbody>

              {

                currentData.map(

                  (
                    item,
                    index
                  ) => (

                    <tr

                      key={item.id}

                      className="
                        border-b
                        hover:bg-slate-50
                      "
                    >

                      <td className="p-4">

                        {
                          startIndex +
                          index +
                          1
                        }

                      </td>

                      <td className="p-4">

                        {
                          item.udise_code
                        }

                      </td>

                      <td className="
                        p-4
                        font-semibold
                      ">

                        {
                          item.school_name
                        }

                      </td>

                      <td className="p-4">

                        {
                          item.district
                        }

                      </td>

                      <td className="p-4">

                        {
                          item.block
                        }

                      </td>

                      <td className="p-4">

                        {
                          item.category_group
                        }

                      </td>

                      <td className="p-4">

                        <span className={`
                          px-3 py-1
                          rounded-full
                          text-xs
                          font-semibold

                          ${
                            item.status
                              ?.toLowerCase()
                              ===
                              'completed'

                              ? `
                                bg-green-100
                                text-green-700
                              `

                              : `
                                bg-amber-100
                                text-amber-700
                              `
                          }
                        `}>

                          {
                            item.status
                          }

                        </span>

                      </td>

                    </tr>
                  )
                )
              }

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="
          flex items-center
          justify-between
          p-5
        ">

          <button

            disabled={
              currentPage === 1
            }

            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }

            className="
              bg-slate-100
              p-2
              rounded-xl
              disabled:opacity-40
            "
          >

            <ChevronLeft size={18} />

          </button>

          <p className="
            text-sm
            text-slate-500
          ">

            Page {
              currentPage
            } of {
              totalPages
            }

          </p>

          <button

            disabled={
              currentPage ===
              totalPages
            }

            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }

            className="
              bg-slate-100
              p-2
              rounded-xl
              disabled:opacity-40
            "
          >

            <ChevronRight size={18} />

          </button>

        </div>

      </div>

    </div>
  )
}