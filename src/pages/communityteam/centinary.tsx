import {
  Pencil,
  Trash2,
  Search,
  School,
  CheckCircle2,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  AlertCircle,
} from 'lucide-react'

import { useEffect, useState } from 'react'
import api from '../../services/api'
import BackButton from '../../components/BackButton'

export default function CommunityTeam() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [teamData, setTeamData] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 10

  useEffect(() => { fetchSchools() }, [])

  const fetchSchools = async () => {
    try {
      setIsLoading(true)
      const response =
        await api.get('/schools')

      console.log(
        'SCHOOL API:',
        response.data
      )

      setTeamData(

        Array.isArray(
          response.data
        )

          ? response.data

          : Array.isArray(
            response.data.data
          )

            ? response.data.data

            : []

      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure want to delete?')
    if (!confirmDelete) return
    try {
      await api.delete(`/schools/${id}`)
      setTeamData(teamData.filter((item) => item.id !== id))
    } catch (error) { console.log(error) }
  }

  const handleEdit = (item: any) => {
    setSelectedItem(item)
    setIsEditOpen(true)
  }

  const handleSave = async () => {
    try {
      await api.put(`/schools/${selectedItem.id}`, selectedItem)
      setTeamData(teamData.map((item) => item.id === selectedItem.id ? selectedItem : item))
      setIsEditOpen(false)
    } catch (error) { console.log(error) }
  }

  const filteredData = teamData.filter((item) => {
    const matchesSearch =

      item.school_name
        ?.toLowerCase()
        .includes(search.toLowerCase())

      ||

      item.udise_code
        ?.toString()
        .includes(search)
    const matchesStatus = statusFilter === 'All' ? true : item.centenary_celebration_status === statusFilter
    const matchesCategory = categoryFilter === 'All' ? true : item.school_category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage)
  const categories = ['All', ...new Set(teamData.map((item) => item.school_category))]
const activeCount = teamData.filter(

(item) =>

item.centenary_celebration_status ?.toLowerCase() ?.trim() === 'completed').length
  
const pendingCount = teamData.filter( (item) => {

const status = item.centenary_celebration_status ?.toLowerCase() ?.trim() 
   return status !== 'completed' } ).length

  const districtCount = new Set(teamData.map((item) => item.district)).size
  const completionRate = teamData.length > 0 ? Math.round((activeCount / teamData.length) * 100) : 0

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

        .ct-root * { box-sizing: border-box; }
        .ct-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f0f2f7;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37,99,235,0.07) 0%, transparent 60%);
          padding: 32px;
          color: #1e293b;
        }

        /* HEADER */
        .ct-header-bar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 36px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .ct-header-left h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.03em;
          margin: 0 0 6px;
        }
        .ct-header-left p {
          color: #64748b;
          font-size: 0.95rem;
          margin: 0;
          font-weight: 400;
        }
        .ct-header-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 10px 16px;
          font-size: 0.85rem;
          color: #475569;
          font-weight: 500;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .ct-header-badge .dot {
          width: 8px; height: 8px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* STATS GRID */
        .ct-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        @media (max-width: 1200px) { .ct-stats { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .ct-stats { grid-template-columns: 1fr; } }

        .ct-stat {
          background: white;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid #e8ecf4;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .ct-stat:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .ct-stat::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          border-radius: 20px 20px 0 0;
        }
        .ct-stat.blue::before { background: linear-gradient(90deg, #2563eb, #60a5fa); }
        .ct-stat.green::before { background: linear-gradient(90deg, #16a34a, #4ade80); }
        .ct-stat.amber::before { background: linear-gradient(90deg, #d97706, #fbbf24); }
        .ct-stat.violet::before { background: linear-gradient(90deg, #7c3aed, #a78bfa); }

        .ct-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .ct-stat-label {
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
        }
        .ct-stat-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .ct-stat-icon.blue { background: #eff6ff; color: #2563eb; }
        .ct-stat-icon.green { background: #f0fdf4; color: #16a34a; }
        .ct-stat-icon.amber { background: #fffbeb; color: #d97706; }
        .ct-stat-icon.violet { background: #f5f3ff; color: #7c3aed; }

        .ct-stat-value {
          font-size: 2.2rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: 8px;
        }
        .ct-stat-sub {
          font-size: 0.8rem;
          color: #94a3b8;
        }
        .ct-stat-bar {
          height: 4px;
          background: #f1f5f9;
          border-radius: 99px;
          margin-top: 12px;
          overflow: hidden;
        }
        .ct-stat-bar-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #2563eb, #60a5fa);
          transition: width 1s ease;
        }

        /* TOOLBAR */
        .ct-toolbar {
          background: white;
          border-radius: 20px;
          border: 1px solid #e8ecf4;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }
        .ct-search {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 0 16px;
          height: 48px;
          flex: 1;
          min-width: 220px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ct-search:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: white;
        }
        .ct-search input {
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.9rem;
          color: #1e293b;
          font-family: 'DM Sans', sans-serif;
          width: 100%;
        }
        .ct-search input::placeholder { color: #94a3b8; }
        .ct-select-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 0 16px;
          height: 48px;
          min-width: 180px;
          transition: border-color 0.2s;
        }
        .ct-select-wrap:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: white;
        }
        .ct-select-wrap select {
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.9rem;
          color: #334155;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          flex: 1;
        }
        .ct-results-count {
          margin-left: auto;
          font-size: 0.82rem;
          color: #94a3b8;
          font-weight: 500;
          white-space: nowrap;
          padding: 0 4px;
        }

        /* TABLE */
        .ct-table-wrap {
          background: white;
          border-radius: 20px;
          border: 1px solid #e8ecf4;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          overflow: hidden;
          margin-bottom: 20px;
        }
        .ct-table {
          width: 100%;
          min-width: 1200px;
          border-collapse: collapse;
        }
        .ct-table thead tr {
         background: linear-gradient(90deg, #2563eb, #1d4ed8);
        }
        .ct-table thead th {
          padding: 14px 16px;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #94a3b8;
          white-space: nowrap;
        }
        .ct-table thead th:first-child { padding-left: 24px; border-radius: 0; }
        .ct-table thead th:last-child { padding-right: 24px; }

        .ct-table tbody tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s;
        }
        .ct-table tbody tr:last-child { border-bottom: none; }
        .ct-table tbody tr:hover { background: #f8fafc; }

        .ct-table tbody td {
          padding: 14px 16px;
          font-size: 0.875rem;
          color: #334155;
          vertical-align: middle;
        }
        .ct-table tbody td:first-child { padding-left: 24px; }
        .ct-table tbody td:last-child { padding-right: 24px; }

        .ct-sno {
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .ct-udise {
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          color: #64748b;
          background: #f1f5f9;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .ct-school-name {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.875rem;
        }

        /* BADGES */
        .ct-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .ct-badge.completed { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .ct-badge.pending { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
        .ct-badge.yes { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .ct-badge.no { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .ct-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

        /* ACTION BUTTONS */
        .ct-actions { display: flex; gap: 8px; }
        .ct-btn-icon {
          width: 34px; height: 34px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .ct-btn-icon.edit { background: #eff6ff; color: #2563eb; }
        .ct-btn-icon.edit:hover { background: #2563eb; color: white; }
        .ct-btn-icon.del { background: #fef2f2; color: #dc2626; }
        .ct-btn-icon.del:hover { background: #dc2626; color: white; }

        /* EMPTY STATE */
        .ct-empty {
          padding: 80px 24px;
          text-align: center;
          color: #94a3b8;
        }
        .ct-empty svg { margin: 0 auto 16px; opacity: 0.4; display: block; }
        .ct-empty h3 { font-size: 1rem; font-weight: 600; color: #475569; margin: 0 0 6px; }
        .ct-empty p { font-size: 0.85rem; margin: 0; }

        /* PAGINATION */
        .ct-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-top: 1px solid #f1f5f9;
          flex-wrap: wrap;
          gap: 12px;
        }
        .ct-pagination-info {
          font-size: 0.82rem;
          color: #94a3b8;
        }
        .ct-pagination-info strong { color: #475569; }
        .ct-pagination-controls { display: flex; align-items: center; gap: 8px; }
        .ct-page-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .ct-page-btn:hover:not(:disabled) { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
        .ct-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .ct-page-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
        .ct-page-indicator {
          font-size: 0.85rem;
          color: #334155;
          font-weight: 600;
          padding: 0 4px;
        }

        /* MODAL */
        .ct-overlay {
          position: fixed; inset: 0;
          background: rgba(15,23,42,0.6);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 50;
          padding: 24px;
          overflow-y: auto;
        }
        .ct-modal {
          background: white;
          border-radius: 24px;
          width: 100%;
          max-width: 760px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.2);
          animation: modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ct-modal-header {
          padding: 24px 28px 20px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .ct-modal-header h2 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .ct-modal-header p {
          font-size: 0.8rem;
          color: #94a3b8;
          margin: 2px 0 0;
        }
        .ct-modal-close {
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b;
          transition: all 0.15s;
        }
        .ct-modal-close:hover { background: #f1f5f9; color: #1e293b; }

        .ct-modal-body { padding: 24px 28px; }
        .ct-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 600px) { .ct-form-grid { grid-template-columns: 1fr; } }
        .ct-form-group { display: flex; flex-direction: column; gap: 6px; }
        .ct-form-group label {
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #64748b;
        }
        .ct-form-group input,
        .ct-form-group select {
          height: 44px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 0 14px;
          font-size: 0.9rem;
          color: #1e293b;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          background: #f8fafc;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .ct-form-group input:focus,
        .ct-form-group select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
          background: white;
        }

        .ct-section-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
          margin: 20px 0 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ct-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #f1f5f9;
        }

        .ct-modal-footer {
          padding: 20px 28px 24px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid #f1f5f9;
        }
        .ct-btn {
          height: 42px;
          padding: 0 20px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
          display: flex; align-items: center; gap: 6px;
        }
        .ct-btn.secondary {
          background: #f1f5f9;
          color: #475569;
          border: 1.5px solid #e2e8f0;
        }
        .ct-btn.secondary:hover { background: #e2e8f0; }
        .ct-btn.primary {
          background: #2563eb;
          color: white;
          box-shadow: 0 2px 8px rgba(37,99,235,0.3);
        }
        .ct-btn.primary:hover {
          background: #1d4ed8;
          box-shadow: 0 4px 12px rgba(37,99,235,0.4);
          transform: translateY(-1px);
        }

        /* LOADING */
        .ct-loading {
          display: flex; align-items: center; justify-content: center;
          min-height: 200px;
          gap: 12px;
          color: #94a3b8;
        }
        .ct-spinner {
          width: 20px; height: 20px;
          border: 2px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* OVERFLOW WRAPPER */
        .ct-table-scroll { overflow-x: auto; }
      `}</style>

      <div className="ct-root">
        {/* BACK */}
        <div style={{ marginBottom: 20 }}>
          <BackButton />
        </div>

        {/* HEADER */}
        <div className="ct-header-bar">
          <div className="ct-header-left">
            <h1>Centenary Celebration Schools </h1>
            <p>Centenary celebration tracking · Tamil Nadu Schools</p>
          </div>
          <div className="ct-header-badge">
            <span className="dot" />
            Live Data
          </div>
        </div>

        {/* STATS */}
        <div className="ct-stats">
          <div className="ct-stat blue">
            <div className="ct-stat-top">
              <span className="ct-stat-label">Total Schools</span>
              <div className="ct-stat-icon blue"><School size={18} /></div>
            </div>
            <div className="ct-stat-value">{teamData.length}</div>
            <div className="ct-stat-sub">Across {districtCount} districts</div>
            <div className="ct-stat-bar">
              <div className="ct-stat-bar-fill" style={{ width: '100%', background: 'linear-gradient(90deg,#2563eb,#60a5fa)' }} />
            </div>
          </div>

          <div className="ct-stat green">
            <div className="ct-stat-top">
              <span className="ct-stat-label">Celebrated </span>
              <div className="ct-stat-icon green"><CheckCircle2 size={18} /></div>
            </div>
            <div className="ct-stat-value">{activeCount}</div>
            <div className="ct-stat-sub">{completionRate}% completion rate</div>
            <div className="ct-stat-bar">
              <div className="ct-stat-bar-fill" style={{ width: `${completionRate}%`, background: 'linear-gradient(90deg,#16a34a,#4ade80)' }} />
            </div>
          </div>

          <div className="ct-stat amber">
            <div className="ct-stat-top">
              <span className="ct-stat-label">Pending</span>
              <div className="ct-stat-icon amber"><AlertCircle size={18} /></div>
            </div>
            <div className="ct-stat-value">{pendingCount}</div>
            <div className="ct-stat-sub">Awaiting celebration</div>
            <div className="ct-stat-bar">
              <div className="ct-stat-bar-fill" style={{ width: `${teamData.length > 0 ? Math.round((pendingCount / teamData.length) * 100) : 0}%`, background: 'linear-gradient(90deg,#d97706,#fbbf24)' }} />
            </div>
          </div>

          <div className="ct-stat violet">
            <div className="ct-stat-top">
              <span className="ct-stat-label">Districts</span>
              <div className="ct-stat-icon violet"><MapPin size={18} /></div>
            </div>
            <div className="ct-stat-value">{districtCount}</div>
            <div className="ct-stat-sub">Regions covered</div>
            <div className="ct-stat-bar">
              <div className="ct-stat-bar-fill" style={{ width: '75%', background: 'linear-gradient(90deg,#7c3aed,#a78bfa)' }} />
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="ct-toolbar">
          <div className="ct-search">
            <Search size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by school name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="ct-select-wrap">

            <div className="ct-select-icon">

              <Filter
                size={16}
              />

            </div>

            <select

              value={statusFilter}

              onChange={(e) => {

                setStatusFilter(
                  e.target.value
                )

                setCurrentPage(1)
              }}

              className="ct-select"

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

          <div className="ct-select-wrap">
            <School size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />
            <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          <div className="ct-results-count">
            {filteredData.length} result{filteredData.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* TABLE */}
        <div className="ct-table-wrap">
          <div className="ct-table-scroll">
            <table className="ct-table">
              <thead>
                <tr>
                  <th>sno</th>
                  <th>District</th>
                  <th>Block</th>
                  <th>UDISE Code</th>
                  <th>School Name</th>
                  <th>School Category</th>
                  <th>Management Category</th>
                  <th>Centenary Celebration Status</th>
                  <th>Celebration Date</th>
                  <th>Preparatory Meeting</th>
                  <th> Organization Committee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={12}>
                      <div className="ct-loading">
                        <div className="ct-spinner" />
                        <span style={{ fontSize: '0.875rem' }}>Loading school data...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan={12}>
                      <div className="ct-empty">
                        <Search size={40} />
                        <h3>No schools found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : currentData.map((item, index) => (
                  <tr key={item.id}>
                    <td><span className="ct-sno">{startIndex + index + 1}</span></td>
                    <td>{item.district}</td>
                    <td>{item.block_name}</td>
                    <td><span className="ct-udise">{item.udise_code}</span></td>
                    <td><span className="ct-school-name">{item.school_name}</span></td>
                    <td>{item.school_category}</td>
                    <td>{item.management_category}</td>
                    <td>
                      <span className={`ct-badge ${item.centenary_celebration_status === 'Completed' ? 'completed' : 'pending'}`}>
                        <span className="ct-badge-dot" />
                        {item.centenary_celebration_status}
                      </span>
                    </td>
                    <td>{item.celebration_date || '—'}</td>
                    <td>
                      <span className={`ct-badge ${item.preparatory_meeting_conducted_status === 'Yes' ? 'yes' : 'no'}`}>
                        {item.preparatory_meeting_conducted_status}
                      </span>
                    </td>
                    <td>
                      <span className={`ct-badge ${item.organization_committee_formed_status === 'Yes' ? 'yes' : 'no'}`}>
                        {item.organization_committee_formed_status}
                      </span>
                    </td>
                    <td>
                      <div className="ct-actions">
                        <button className="ct-btn-icon edit" onClick={() => handleEdit(item)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="ct-btn-icon del" onClick={() => handleDelete(item.id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!isLoading && filteredData.length > 0 && (
            <div className="ct-pagination">
              <div className="ct-pagination-info">
                Showing <strong>{startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredData.length)}</strong> of <strong>{filteredData.length}</strong> schools
              </div>
              <div className="ct-pagination-controls">
                <button className="ct-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>«</button>
                <button className="ct-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                  <ChevronLeft size={16} />
                </button>
                <span className="ct-page-indicator">Page {currentPage} of {totalPages}</span>
                <button className="ct-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                  <ChevronRight size={16} />
                </button>
                <button className="ct-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>»</button>
              </div>
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {isEditOpen && selectedItem && (
          <div className="ct-overlay" onClick={(e) => e.target === e.currentTarget && setIsEditOpen(false)}>
            <div className="ct-modal">
              <div className="ct-modal-header">
                <div>
                  <h2>Edit School Details</h2>
                  <p>{selectedItem.school_name}</p>
                </div>
                <button className="ct-modal-close" onClick={() => setIsEditOpen(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className="ct-modal-body">
                <div className="ct-section-label">Basic Information</div>
                <div className="ct-form-grid">
                  {[
                    { label: 'District', key: 'district', type: 'text' },
                    { label: 'Block Name', key: 'block_name', type: 'text' },
                    { label: 'UDISE Code', key: 'udise_code', type: 'text' },
                    { label: 'School Name', key: 'school_name', type: 'text' },
                    { label: 'School Category', key: 'school_category', type: 'text' },
                    { label: 'Management Category', key: 'management_category', type: 'text' },
                  ].map(({ label, key, type }) => (
                    <div key={key} className="ct-form-group">
                      <label>{label}</label>
                      <input
                        type={type}
                        value={selectedItem[key] || ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                <div className="ct-section-label">Celebration Details</div>
                <div className="ct-form-grid">
                  <div className="ct-form-group">
                    <label>Celebration Status</label>
                    <select
                      value={selectedItem.centenary_celebration_status || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, centenary_celebration_status: e.target.value })}
                    >
                      <option value="Completed">Completed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  <div className="ct-form-group">
                    <label>Celebration Date</label>
                    <input
                      type="date"
                      value={selectedItem.celebration_date || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, celebration_date: e.target.value })}
                    />
                  </div>
                  <div className="ct-form-group">
                    <label>
                      Preparatory Meeting Conducted
                    </label>
                    <select
                      value={
                        selectedItem.preparatory_meeting_conducted_status || ''
                      }
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          preparatory_meeting_conducted_status:
                            e.target.value
                        })
                      }
                    >
                      <option value="Yes">
                        Yes
                      </option>
                      <option value="No">
                        No
                      </option>
                    </select>
                  </div>

                  <div className="ct-form-group">
                    <label>Committee Formed</label>
                    <select
                      value={selectedItem.organization_committee_formed_status || ''}
                      onChange={(e) => setSelectedItem({ ...selectedItem, organization_committee_formed_status: e.target.value })}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="ct-modal-footer">
                <button className="ct-btn secondary" onClick={() => setIsEditOpen(false)}>Cancel</button>
                <button className="ct-btn primary" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}