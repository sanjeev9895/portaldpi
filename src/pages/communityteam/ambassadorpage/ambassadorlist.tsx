import {
    Search,
    Users,
    CheckCircle2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Eye,
    Pencil,
    Trash2,
    ArrowLeft,
} from 'lucide-react'

import {
    useEffect,
    useState,
} from 'react'

import {
    useNavigate,
} from 'react-router-dom'

import api from '../../../services/api'

import BackButton from '../../../components/BackButton'

export default function AmbassadorList() {

    const navigate =
        useNavigate()

    const [search, setSearch] =
        useState('')

    const [districtFilter, setDistrictFilter] =
        useState('All')

    const [blockFilter, setBlockFilter] =
        useState('All')

    const [teamData, setTeamData] =
        useState<any[]>([])

    const [currentPage, setCurrentPage] =
        useState(1)

    const [selectedItem, setSelectedItem] =
        useState<any>(null)

    const [isViewOpen, setIsViewOpen] =
        useState(false)

    const [isEditOpen, setIsEditOpen] =
        useState(false)

    const itemsPerPage = 10

    useEffect(() => {

        fetchAmbassadors()

    }, [])

    const fetchAmbassadors = async () => {

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

    const handleView = (item: any) => {

        setSelectedItem(item)

        setIsViewOpen(true)
    }

    const handleEdit = (item: any) => {

        setSelectedItem(item)

        setIsEditOpen(true)
    }

    const handleSave = async () => {

        try {

            await api.put(

                `/ambassador-schools/${selectedItem.id}`,

                selectedItem

            )

            setTeamData(

                teamData.map((item) =>

                    item.id === selectedItem.id

                        ? selectedItem

                        : item

                )

            )

            setIsEditOpen(false)

            setIsViewOpen(false)

        } catch (error) {

            console.log(error)

        }
    }

    const handleDelete = async (id: number) => {

        const confirmDelete =
            window.confirm(
                'Are you sure want to delete?'
            )

        if (!confirmDelete) return

        try {

            await api.delete(
                `/ambassador-schools/${id}`
            )

            setTeamData(

                teamData.filter(
                    (item) => item.id !== id
                )

            )

        } catch (error) {

            console.log(error)

        }
    }

    const districtOptions = [
        'All',
        ...new Set(
            teamData.map(
                (item) => item.district
            )
        )
    ]

    const blockOptions = [
        'All',
        ...new Set(
            teamData
                .filter((item) =>

                    districtFilter === 'All'

                        ? true

                        : item.district === districtFilter
                )
                .map(
                    (item) => item.block
                )
        )
    ]

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

            const matchesDistrict =

                districtFilter === 'All'

                    ? true

                    : item.district === districtFilter

            const matchesBlock =

                blockFilter === 'All'

                    ? true

                    : item.block === blockFilter

            return (
                matchesSearch &&
                matchesDistrict &&
                matchesBlock
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
                    ?.trim() === 'completed'

        ).length

    const pendingCount =
        filteredData.filter(

            (item) =>

                item.status
                    ?.toLowerCase()
                    ?.trim() !== 'completed'

        ).length

    const districtCount =
        new Set(

            filteredData.map(
                (item) =>
                    item.district
            )

        ).size

    return (

        <div className="
            min-h-screen
            bg-slate-100
            p-6
        ">

            <div className="mb-6">

                <BackButton />

            </div>

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

                        Ambassador List

                    </h1>

                    <p className="
                        text-slate-500
                        mt-3
                        text-lg
                    ">

                        Manage ambassador schools
                        and activities

                    </p>

                </div>

            </div>

            <div className="
                grid grid-cols-1
                md:grid-cols-4
                gap-6
                mb-8
            ">

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

                                {filteredData.length}

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

                            <Users size={28} />

                        </div>

                    </div>

                </div>

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

                                {completedCount}

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

                                {pendingCount}

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

                                {districtCount}

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

                {/* DISTRICT FILTER */}

                <select

                    value={districtFilter}

                    onChange={(e) => {

                        setDistrictFilter(
                            e.target.value
                        )

                        setBlockFilter('All')

                        setCurrentPage(1)

                    }}

                    className="
                        h-12
                        px-4
                        rounded-2xl
                        bg-slate-100
                        outline-none
                    "
                >

                    {
                        districtOptions.map(
                            (district: any) => (

                                <option
                                    key={district}
                                    value={district}
                                >

                                    {district}

                                </option>
                            )
                        )
                    }

                </select>

                {/* BLOCK FILTER */}

                <select

                    value={blockFilter}

                    onChange={(e) => {

                        setBlockFilter(
                            e.target.value
                        )

                        setCurrentPage(1)

                    }}

                    className="
                        h-12
                        px-4
                        rounded-2xl
                        bg-slate-100
                        outline-none
                    "
                >

                    {
                        blockOptions.map(
                            (block: any) => (

                                <option
                                    key={block}
                                    value={block}
                                >

                                    {block}

                                </option>
                            )
                        )
                    }

                </select>

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
                            bg-violet-600
                            text-white
                        ">

                            <tr>

                                <th className="text-left p-4">

                                    S.No

                                </th>

                                <th className="text-left p-4">

                                    UDISE

                                </th>

                                <th className="text-left p-4">

                                    School Name

                                </th>

                                <th className="text-left p-4">

                                    District

                                </th>

                                <th className="text-left p-4">

                                    Block

                                </th>

                                <th className="text-left p-4">

                                    Status

                                </th>

                                <th className="text-left p-4">

                                    Action

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                currentData.map(

                                    (item, index) => (

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

                                                <span className={`
                                                    px-3 py-1
                                                    rounded-full
                                                    text-xs
                                                    font-semibold

                                                    ${
                                                        item.status
                                                            ?.toLowerCase()
                                                            === 'completed'

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

                                                    {item.status}

                                                </span>

                                            </td>

                                            <td className="p-4">

                                                <div className="
                                                    flex items-center
                                                    gap-3
                                                ">

                                                    <button

                                                        onClick={() =>
                                                            handleView(item)
                                                        }

                                                        className="
                                                            w-9 h-9
                                                            rounded-xl
                                                            bg-cyan-100
                                                            text-cyan-700
                                                            flex items-center
                                                            justify-center
                                                        "
                                                    >

                                                        <Eye size={16} />

                                                    </button>

                                                    <button

                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }

                                                        className="
                                                            w-9 h-9
                                                            rounded-xl
                                                            bg-amber-100
                                                            text-amber-700
                                                            flex items-center
                                                            justify-center
                                                        "
                                                    >

                                                        <Pencil size={16} />

                                                    </button>

                                                    <button

                                                        onClick={() =>
                                                            handleDelete(item.id)
                                                        }

                                                        className="
                                                            w-9 h-9
                                                            rounded-xl
                                                            bg-red-100
                                                            text-red-700
                                                            flex items-center
                                                            justify-center
                                                        "
                                                    >

                                                        <Trash2 size={16} />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )
                            }

                        </tbody>

                    </table>

                </div>
                {/* VIEW MODAL */}

{
    isViewOpen &&
    selectedItem && (

        <div className="
            fixed inset-0
            bg-black/50
            flex items-center
            justify-center
            z-50
            p-6
        ">

            <div className="
                bg-white
                rounded-[32px]
                p-8
                w-full
                max-w-3xl
                shadow-2xl
                relative
            ">

                <button

                    onClick={() =>
                        setIsViewOpen(false)
                    }

                    className="
                        absolute
                        top-5
                        right-5
                        w-10 h-10
                        rounded-full
                        bg-slate-100
                    "
                >

                    ✕

                </button>

                <h2 className="
                    text-3xl
                    font-bold
                    text-slate-800
                    mb-8
                ">

                    School Details

                </h2>

                <div className="
                    grid grid-cols-1
                    md:grid-cols-2
                    gap-5
                ">

                    <div>

                        <p className="
                            text-sm
                            text-slate-400
                            mb-2
                        ">

                            UDISE CODE

                        </p>

                        <div className="
                            bg-slate-100
                            p-4
                            rounded-2xl
                            font-semibold
                        ">

                            {selectedItem.udise_code}

                        </div>

                    </div>

                    <div>

                        <p className="
                            text-sm
                            text-slate-400
                            mb-2
                        ">

                            DISTRICT

                        </p>

                        <div className="
                            bg-slate-100
                            p-4
                            rounded-2xl
                            font-semibold
                        ">

                            {selectedItem.district}

                        </div>

                    </div>

                    <div className="
                        md:col-span-2
                    ">

                        <p className="
                            text-sm
                            text-slate-400
                            mb-2
                        ">

                            SCHOOL NAME

                        </p>

                        <div className="
                            bg-slate-100
                            p-4
                            rounded-2xl
                            font-semibold
                        ">

                            {selectedItem.school_name}

                        </div>

                    </div>

                    <div>

                        <p className="
                            text-sm
                            text-slate-400
                            mb-2
                        ">

                            BLOCK

                        </p>

                        <div className="
                            bg-slate-100
                            p-4
                            rounded-2xl
                            font-semibold
                        ">

                            {selectedItem.block}

                        </div>

                    </div>

                    <div>

                        <p className="
                            text-sm
                            text-slate-400
                            mb-2
                        ">

                            STATUS

                        </p>

                        <div className="
                            bg-slate-100
                            p-4
                            rounded-2xl
                            font-semibold
                        ">

                            {selectedItem.status}

                        </div>

                    </div>

                </div>

                <div className="
                    flex justify-end
                    mt-8
                ">

                    <button

                        onClick={() => {

                            setIsViewOpen(false)

                            setIsEditOpen(true)

                        }}

                        className="
                            px-5 py-3
                            rounded-2xl
                            bg-violet-600
                            text-white
                            font-semibold
                        "
                    >

                        Edit

                    </button>

                </div>

            </div>

        </div>
    )
}

{/* EDIT MODAL */}

{
    isEditOpen &&
    selectedItem && (

        <div className="
            fixed inset-0
            bg-black/50
            flex items-center
            justify-center
            z-50
            p-6
        ">

            <div className="
                bg-white
                rounded-[32px]
                p-8
                w-full
                max-w-3xl
                shadow-2xl
                relative
            ">

                <button

                    onClick={() =>
                        setIsEditOpen(false)
                    }

                    className="
                        absolute
                        top-5
                        right-5
                        w-10 h-10
                        rounded-full
                        bg-slate-100
                    "
                >

                    ✕

                </button>

                <h2 className="
                    text-3xl
                    font-bold
                    text-slate-800
                    mb-8
                ">

                    Edit School

                </h2>

                <div className="
                    grid grid-cols-1
                    md:grid-cols-2
                    gap-5
                ">

                    <input

                        value={
                            selectedItem.udise_code
                        }

                        onChange={(e) =>
                            setSelectedItem({

                                ...selectedItem,

                                udise_code:
                                    e.target.value

                            })
                        }

                        placeholder="UDISE Code"

                        className="
                            border
                            border-slate-200
                            rounded-2xl
                            p-3
                        "
                    />

                    <input

                        value={
                            selectedItem.district
                        }

                        onChange={(e) =>
                            setSelectedItem({

                                ...selectedItem,

                                district:
                                    e.target.value

                            })
                        }

                        placeholder="District"

                        className="
                            border
                            border-slate-200
                            rounded-2xl
                            p-3
                        "
                    />

                    <input

                        value={
                            selectedItem.school_name
                        }

                        onChange={(e) =>
                            setSelectedItem({

                                ...selectedItem,

                                school_name:
                                    e.target.value

                            })
                        }

                        placeholder="School Name"

                        className="
                            border
                            border-slate-200
                            rounded-2xl
                            p-3
                            md:col-span-2
                        "
                    />

                    <input

                        value={
                            selectedItem.block
                        }

                        onChange={(e) =>
                            setSelectedItem({

                                ...selectedItem,

                                block:
                                    e.target.value

                            })
                        }

                        placeholder="Block"

                        className="
                            border
                            border-slate-200
                            rounded-2xl
                            p-3
                        "
                    />

                    <select

                        value={
                            selectedItem.status
                        }

                        onChange={(e) =>
                            setSelectedItem({

                                ...selectedItem,

                                status:
                                    e.target.value

                            })
                        }

                        className="
                            border
                            border-slate-200
                            rounded-2xl
                            p-3
                        "
                    >

                        <option>

                            Completed

                        </option>

                        <option>

                            Pending

                        </option>

                    </select>

                </div>

                <div className="
                    flex justify-end
                    gap-3
                    mt-8
                ">

                    <button

                        onClick={() =>
                            setIsEditOpen(false)
                        }

                        className="
                            px-5 py-3
                            rounded-2xl
                            bg-slate-200
                            font-semibold
                        "
                    >

                        Cancel

                    </button>

                    <button

                        onClick={handleSave}

                        className="
                            px-5 py-3
                            rounded-2xl
                            bg-violet-600
                            text-white
                            font-semibold
                        "
                    >

                        Save Changes

                    </button>

                </div>

            </div>

        </div>
    )
}

            </div>

            {/* PAGINATION */}

            <div className="
                flex items-center
                justify-between
                p-5
                border-t
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
                        flex items-center
                        gap-2
                        bg-slate-100
                        px-4 py-2
                        rounded-2xl
                    "
                >

                    <ChevronLeft size={18} />

                    Prev

                </button>

                <p className="
                    text-sm
                    text-slate-500
                    font-medium
                ">

                    Page {
                        currentPage
                    } of {
                        totalPages
                    }

                </p>

                <button

                    disabled={
                        currentPage === totalPages
                    }

                    onClick={() =>
                        setCurrentPage(
                            currentPage + 1
                        )
                    }

                    className="
                        flex items-center
                        gap-2
                        bg-violet-600
                        text-white
                        px-4 py-2
                        rounded-2xl
                    "
                >

                    Next

                    <ChevronRight size={18} />

                </button>

            </div>

        </div>
    )
}