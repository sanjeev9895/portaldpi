import { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  CalendarDays,
  Plus,
  Search,
  Trash2,
  Pencil,
  X,
  Eye,
  Download,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';

interface Report {
  id: number;
  title: string;
  category: string;
  employee: string;
  date: string;
  status: string;
  remark: string;
  enteredBy: string;
  enteredTime: string;
}

const PREDEFINED_KPIS = [
  { id: 1, title: 'Alumni Core Team Formation', category: 'Core Team', desc: 'Identify and form local alumni core committees at school levels' },
  { id: 2, title: 'Monthly Executive Committee Meeting', category: 'Core Team', desc: 'Convene monthly meeting of the alumni committee for tracking' },
  { id: 3, title: 'Alumni Coordinator Meetup', category: 'Core Team', desc: 'Coordinate with local block representatives for outreach programs' },
  { id: 4, title: 'Core Engagement Activities Planning', category: 'Core Team', desc: 'Plan activities for local chapters to keep alumni active' },
  { id: 5, title: 'WhatsApp Group Creation for Alumni', category: 'WhatsApp', desc: 'Launch block/school specific WhatsApp groups to connect members' },
  { id: 6, title: 'Weekly WhatsApp Group Engagement', category: 'WhatsApp', desc: 'Post weekly engaging updates and verify alumni participation' },
  { id: 7, title: 'WhatsApp Database Verification', category: 'WhatsApp', desc: 'Confirm phone numbers and contact details of enrolled members' },
  { id: 8, title: 'Alumni Database Portal Enrolment', category: 'WhatsApp', desc: 'Register alumni on the central digital database registry' },
  { id: 9, title: 'School Community Centenary Prep', category: 'School Community', desc: 'Prepare centenary events and coordinate programs in local regions' },
  { id: 10, title: 'Ambassador School Identification', category: 'School Community', desc: 'Audit and identify potential alumni ambassador schools' },
  { id: 11, title: 'School Community Engagement Meetings', category: 'School Community', desc: 'Conduct community relationship drives with local schools' },
  { id: 12, title: 'Organization Committee Setups', category: 'School Community', desc: 'Establish planning committees for upcoming celebration events' },
  { id: 13, title: 'Alumni Mentorship Career Session', category: 'Mentorship', desc: 'Facilitate career guidance sessions led by prominent alumni' },
  { id: 14, title: 'Mentorship Feedback Collections', category: 'Mentorship', desc: 'Gather student feedback on mentorship sessions conducted' },
  { id: 15, title: 'Student Guidance Program Launch', category: 'Mentorship', desc: 'Kick off mentorship drives in local schools' },
  { id: 16, title: 'Local Resources & Mobilization Drives', category: 'Resource', desc: 'Raise local support, materials, and resources' },
  { id: 17, title: 'School Infrastructure Upgrade Drive', category: 'Resource', desc: 'Raise alumni contributions for school refurbishments' },
  { id: 18, title: 'Centenary Celebration Local Outreach', category: 'Outreach', desc: 'Distribute print/media details locally' },
  { id: 19, title: 'Alumni Membership Mobilization Campaign', category: 'Outreach', desc: 'Engage new alumni signups and registration drives' },
  { id: 20, title: 'Digital Literacy & Skill Sessions', category: 'Outreach', desc: 'Run computer/skill training workshops' }
];

/* ── Input style ─────────────────────────────────── */
const inputCls =
  'w-full border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-400';

export default function KPIS() {
  /* ── State ───────────────────────────────────────── */
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('reports');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        /* empty */
      }
    }
    return [
      { id: 1, title: 'Alumni Core Team Formation', category: 'Core Team', employee: 'Karthikeyan', date: '2026-05-14', status: 'Submitted', remark: 'Formed the Madurai Alumni Committee with 12 core members', enteredBy: 'Karthikeyan', enteredTime: '5/14/2026, 10:30:15 AM' },
      { id: 2, title: 'WhatsApp Group Creation for Alumni', category: 'WhatsApp', employee: 'Arun Kumar', date: '2026-05-13', status: 'Pending', remark: 'Started creation of block-level alumni chat groups', enteredBy: 'Arun Kumar', enteredTime: '5/13/2026, 4:12:44 PM' },
      { id: 3, title: 'Alumni Mentorship Career Session', category: 'Mentorship', employee: 'Vignesh', date: '2026-05-12', status: 'Completed', remark: 'Organized career counseling webinar with 75 final year students', enteredBy: 'Vignesh', enteredTime: '5/12/2026, 11:00:23 AM' },
    ];
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Reports');
  const [enteredByFilter, setEnteredByFilter] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [kpiSearch, setKpiSearch] = useState('');

  /* modal */
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  /* delete */
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* view */
  const [viewReport, setViewReport] = useState<Report | null>(null);

  /* form */
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [employee, setEmployee] = useState('');
  const [date, setDate] = useState('');
  const [remark, setRemark] = useState('');
  const [status, setStatus] = useState('Submitted');

  /* form errors */
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Persist ─────────────────────────────────────── */
  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch {
        /* empty */
      }
    }
  }, []);

  /* ── Helpers ─────────────────────────────────────── */
  const isEmployee = (currentUser?.role ?? '').toLowerCase() === 'employee';
  const isManagerOrAdmin = ['manager', 'admin'].includes((currentUser?.role ?? '').toLowerCase());

  const openAddModalWithKPI = (kpiTitle: string, kpiCategory: string) => {
    setIsEdit(false);
    setEditId(null);
    setTitle(kpiTitle);
    setCategory(kpiCategory);
    // Auto-fill logged in user's name
    setEmployee(currentUser?.name || 'Unknown Employee');
    setDate(new Date().toISOString().split('T')[0]);
    setRemark('');
    setStatus('Submitted');
    setErrors({});
    setOpen(true);
  };

  const openEditModal = (report: Report) => {
    setIsEdit(true);
    setEditId(report.id);
    setTitle(report.title);
    setCategory(report.category);
    setEmployee(report.employee);
    setDate(report.date);
    setRemark(report.remark || '');
    setStatus(report.status || 'Submitted');
    setErrors({});
    setOpen(true);
  };

  /* ── Validate ────────────────────────────────────── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Report title is required';
    if (!category.trim()) e.category = 'Category is required';
    if (!employee.trim()) e.employee = 'Employee name is required';
    if (!date.trim()) e.date = 'Date is required';
    if (!remark.trim()) e.remark = 'Remark details are required';
    return e;
  };

  /* ── Save ────────────────────────────────────────── */
  const handleSaveReport = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (isEdit && editId !== null) {
      setReports(prev =>
        prev.map(r => r.id === editId ? { ...r, title, category, employee, date, remark, status } : r)
      );
    } else {
      const newReport: Report = {
        id: Date.now(),
        title,
        category,
        employee,
        date,
        status: status || 'Submitted',
        remark,
        enteredBy: currentUser?.name || 'Unknown',
        enteredTime: new Date().toLocaleString()
      };
      setReports(prev => [newReport, ...prev]);
    }

    setOpen(false);
  };

  /* ── Delete ──────────────────────────────────────── */
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };
  const handleDelete = () => {
    if (deleteId !== null) {
      setReports(prev => prev.filter(r => r.id !== deleteId));
    }
    setDeleteOpen(false);
    setDeleteId(null);
  };

  /* ── Filter ──────────────────────────────────────── */
  const filteredReports = reports.filter(report => {
    // Employees see only their own reports
    if (isEmployee && currentUser?.name &&
      report.employee?.toLowerCase() !== currentUser.name.toLowerCase() &&
      report.enteredBy?.toLowerCase() !== currentUser.name.toLowerCase()) {
      return false;
    }
    const matchesSearch =
      report.title.toLowerCase().includes(search.toLowerCase()) ||
      report.category.toLowerCase().includes(search.toLowerCase()) ||
      report.employee.toLowerCase().includes(search.toLowerCase()) ||
      (report.remark && report.remark.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'All Reports' ? true : report.status === statusFilter;
    const matchesEnteredBy = enteredByFilter ? (report.enteredBy?.toLowerCase() === enteredByFilter.toLowerCase()) : true;
    return matchesSearch && matchesStatus && matchesEnteredBy;
  });

  /* ── Stats (scoped) ─────────────────────────────── */
  const scopedReports = isEmployee && currentUser?.name
    ? reports.filter(r => r.employee?.toLowerCase() === currentUser.name.toLowerCase() || r.enteredBy?.toLowerCase() === currentUser.name.toLowerCase())
    : reports;

  const totalCount = scopedReports.length;
  const submittedCount = scopedReports.filter(r => r.status === 'Submitted').length;
  const pendingCount = scopedReports.filter(r => r.status === 'Pending').length;

  /* Filter predefined KPIs based on user search */
  const filteredPredefinedKpis = PREDEFINED_KPIS.filter(kpi =>
    kpi.title.toLowerCase().includes(kpiSearch.toLowerCase()) ||
    kpi.category.toLowerCase().includes(kpiSearch.toLowerCase()) ||
    kpi.desc.toLowerCase().includes(kpiSearch.toLowerCase())
  );

  // Entered By dropdown options based on reports
  const enteredByOptions = useMemo(() => {
    const map = new Map<string, number>();
    reports.forEach(r => {
      if (r.enteredBy) {
        map.set(r.enteredBy, (map.get(r.enteredBy) ?? 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [reports]);

  return (
    <div className="min-h-screen bg-slate-100 print-area px-6 py-6 font-sans">
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; }`}</style>

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">KPI Reports</h1>
          <p className="text-slate-500 mt-1 text-sm">
            {isEmployee
              ? 'Browse predefined KPIs, add records and track your submissions.'
              : 'Create, edit, delete and monitor employee performance and reports.'}
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-5 py-3 rounded-2xl text-slate-700 font-medium transition shadow-sm"
          >
            <Download size={18} />
            Export PDF
          </button>
        </div>
      </div>

      {/* ── Predefined KPIs Directory ── */}
      {isEmployee && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-8 no-print animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Predefined KPIs Directory</h2>
              <p className="text-slate-500 text-xs mt-0.5">Select a KPI below and click "Add Record" to input your performance metrics.</p>
            </div>
            <div className="relative w-full sm:w-80 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search KPI directory..."
                value={kpiSearch}
                onChange={e => setKpiSearch(e.target.value)}
                className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredPredefinedKpis.map(kpi => (
              <div key={kpi.id} className="bg-slate-50 hover:bg-slate-100/60 border border-slate-200/50 rounded-2xl p-5 flex flex-col justify-between transition group shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      kpi.category === 'Core Team' ? 'bg-purple-100 text-purple-700' :
                      kpi.category === 'WhatsApp' ? 'bg-green-100 text-green-700' :
                      kpi.category === 'School Community' ? 'bg-blue-100 text-blue-700' :
                      kpi.category === 'Mentorship' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {kpi.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors leading-snug">{kpi.title}</h3>
                  <p className="text-slate-400 text-xs mt-1.5 font-medium leading-relaxed">{kpi.desc}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/50 flex items-center justify-end">
                  <button
                    onClick={() => openAddModalWithKPI(kpi.title, kpi.category)}
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                  >
                    <Plus size={14} />
                    Add Record
                  </button>
                </div>
              </div>
            ))}
            {filteredPredefinedKpis.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 text-sm">
                No matching predefined KPIs found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Stats ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Total Submitted KPIs', value: totalCount, color: 'text-slate-800' },
          { label: 'Submitted Status', value: submittedCount, color: 'text-green-600' },
          { label: 'Pending Verification', value: pendingCount, color: 'text-orange-500' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm mb-2">{s.label}</p>
            <p className={`text-4xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ─────────────────────────── */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 mb-8 no-print">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex items-center gap-3 flex-1 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200">
            <Search className="text-slate-400 shrink-0" size={18} />
            <input
              type="text"
              placeholder="Search reports by title, category, employee, or remarks…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-700 text-sm placeholder:text-slate-400"
            />
          </div>

          {/* Entered By filter */}
          <div className="relative min-w-[200px]">
            <select
              value={enteredByFilter}
              onChange={e => setEnteredByFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-9 py-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="">All entered by</option>
              {enteredByOptions.map(({ name, count }) => (
                <option key={name} value={name}>{`${name} (${count})`}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative min-w-[200px]">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-4 pr-9 py-3 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option>All Reports</option>
              <option>Submitted</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Sl No</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Report / KPI</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Remarks</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Entered By</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Entered Time</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report, idx) => {
                const statusColor =
                  report.status === 'Submitted' ? 'bg-green-50 text-green-700 border-green-200'
                  : report.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-200'
                  : 'bg-blue-50 text-blue-600 border-blue-200';

                return (
                  <tr key={report.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 text-slate-400 font-semibold">{String(idx + 1).padStart(2, '0')}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="text-blue-500 shrink-0" size={16} />
                        <span className="font-semibold text-slate-800">{report.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{report.employee}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-1">
                        <CalendarDays size={14} className="text-slate-400" />
                        {report.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={report.remark}>{report.remark}</td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{report.enteredBy || report.employee}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-medium">{report.enteredTime || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColor}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          title="View Details"
                          onClick={() => setViewReport(report)}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
                        >
                          <Eye size={14} />
                        </button>
                        {isManagerOrAdmin && (
                          <>
                            <button
                              title="Edit Record"
                              onClick={() => openEditModal(report)}
                              className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              title="Delete Record"
                              onClick={() => confirmDelete(report.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredReports.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-slate-300" />
              </div>
              <p className="text-lg font-bold text-slate-600">No Reports Found</p>
              <p className="text-sm text-slate-400 mt-1">
                {search || statusFilter !== 'All Reports'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start adding KPI entries from the Directory above'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Modal ─────────────────────────── */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {isEdit ? 'Edit KPI Record' : 'Add KPI Record'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Logged in as: <span className="font-semibold text-slate-600">{currentUser?.name} ({currentUser?.role})</span>
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-7 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  KPI Title
                </label>
                <input
                  type="text"
                  value={title}
                  readOnly
                  className={`${inputCls} cursor-not-allowed opacity-75 bg-slate-100 border-slate-200`}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  readOnly
                  className={`${inputCls} cursor-not-allowed opacity-75 bg-slate-100 border-slate-200`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className={`${inputCls} ${errors.date ? 'border-red-400' : ''}`}
                  />
                  {errors.date && <p className="text-xs text-red-500 mt-1 font-medium">{errors.date}</p>}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className={inputCls}
                  >
                    <option>Submitted</option>
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              {/* Remark */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Remarks / Outcomes <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  placeholder="Detail out the work completed, students impacted, or progress outcomes..."
                  rows={4}
                  className={`${inputCls} resize-none ${errors.remark ? 'border-red-400 focus:ring-red-400' : ''}`}
                />
                {errors.remark && <p className="text-xs text-red-500 mt-1 font-medium">{errors.remark}</p>}
              </div>

              {/* Employee */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Employee Submitting
                </label>
                <input
                  type="text"
                  value={employee}
                  readOnly
                  className={`${inputCls} cursor-not-allowed opacity-75 bg-slate-100 border-slate-200`}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReport}
                className="flex-1 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-bold text-white transition active:scale-95"
              >
                {isEdit ? 'Update Record' : 'Save Record'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Modal ───────────────────────────────── */}
      {viewReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">KPI Record Details</h2>
              <button
                onClick={() => setViewReport(null)}
                className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>
            <div className="p-7 space-y-4">
              {[
                { label: 'KPI Title', value: viewReport.title },
                { label: 'Category', value: viewReport.category },
                { label: 'Employee', value: viewReport.employee },
                { label: 'Activity Date', value: viewReport.date },
                { label: 'Status', value: viewReport.status },
                { label: 'Remarks', value: viewReport.remark },
                { label: 'Entered By', value: viewReport.enteredBy || viewReport.employee },
                { label: 'Entered Time', value: viewReport.enteredTime || '—' },
              ].map(row => (
                <div key={row.label} className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0 gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 w-24">{row.label}</span>
                  <span className="text-sm font-semibold text-slate-800 text-right">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="px-7 py-5 border-t border-slate-100">
              <button
                onClick={() => setViewReport(null)}
                className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-bold text-slate-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────── */}
      {deleteOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center animate-zoom-in">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Delete KPI Record</h2>
            <p className="text-sm text-slate-500 mb-7">
              Are you sure you want to delete this KPI record? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                className="flex-1 h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-sm font-bold text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}