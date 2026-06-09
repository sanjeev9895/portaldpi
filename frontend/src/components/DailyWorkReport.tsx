import { useEffect, useState } from 'react';
import { X, Plus, Trash2, Save, ClipboardList } from 'lucide-react';
import api from '../services/api';

type Task = {
  category: string;
  task_description: string;
  due_date: string;
  status: string;
};

type Which = 'ongoing' | 'tomorrow';

type Props = {
  open: boolean;
  onClose: () => void;
  currentUser: { name?: string; email?: string; role?: string } | null;
};

const STATUS_OPTIONS = ['Completed', 'In Progress', 'Delayed', 'Dropped', 'Hold'];

const STATUS_STYLES: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700 border-green-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  Delayed: 'bg-orange-50 text-orange-700 border-orange-200',
  Dropped: 'bg-red-50 text-red-700 border-red-200',
  Hold: 'bg-slate-100 text-slate-600 border-slate-200',
};

const emptyTask = (): Task => ({
  category: '',
  task_description: '',
  due_date: '',
  status: 'In Progress',
});

function safeParse(v: unknown): Task[] {
  if (Array.isArray(v)) return v as Task[];
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export default function DailyWorkReport({ open, onClose, currentUser }: Props) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const weekday = today.toLocaleDateString('en-US', { weekday: 'long' });

  const [resourceName, setResourceName] = useState('');
  const [reportDate, setReportDate] = useState(todayStr);
  const [team, setTeam] = useState('');
  const [day, setDay] = useState(weekday);
  const [ongoing, setOngoing] = useState<Task[]>([emptyTask()]);
  const [tomorrow, setTomorrow] = useState<Task[]>([emptyTask()]);
  const [saving, setSaving] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    if (!open) return;
    setResourceName(currentUser?.name || '');
    setReportDate(todayStr);
    setDay(weekday);
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const res = await api.get('/daily-work-reports');
      const all = Array.isArray(res.data) ? res.data : [];
      const mine = currentUser?.email
        ? all.filter(
            (r: any) =>
              (r.entered_by || '').toLowerCase() === (currentUser.email || '').toLowerCase()
          )
        : all;
      setReports([...mine].reverse());
    } catch {
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  const rowsFor = (which: Which) => (which === 'ongoing' ? ongoing : tomorrow);
  const setRowsFor = (which: Which, rows: Task[]) =>
    which === 'ongoing' ? setOngoing(rows) : setTomorrow(rows);

  const updateRow = (which: Which, idx: number, field: keyof Task, value: string) => {
    const rows = rowsFor(which).map((row, i) =>
      i === idx ? { ...row, [field]: value } : row
    );
    setRowsFor(which, rows);
  };

  const addRow = (which: Which) => setRowsFor(which, [...rowsFor(which), emptyTask()]);

  const removeRow = (which: Which, idx: number) => {
    const rows = rowsFor(which).filter((_, i) => i !== idx);
    setRowsFor(which, rows.length ? rows : [emptyTask()]);
  };

  const handleSave = async () => {
    if (!resourceName.trim()) {
      alert('Please enter the resource name.');
      return;
    }
    const cleanOngoing = ongoing.filter(
      (t) => t.task_description.trim() || t.category.trim()
    );
    const cleanTomorrow = tomorrow.filter(
      (t) => t.task_description.trim() || t.category.trim()
    );
    if (cleanOngoing.length === 0 && cleanTomorrow.length === 0) {
      alert('Please add at least one task before saving.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/daily-work-reports', {
        resource_name: resourceName.trim(),
        report_date: reportDate,
        team: team.trim(),
        day,
        ongoing_tasks: cleanOngoing,
        tomorrow_tasks: cleanTomorrow,
        entered_by: currentUser?.email || '',
        entered_time: new Date().toLocaleString(),
      });
      alert('Daily work report saved successfully.');
      setOngoing([emptyTask()]);
      setTomorrow([emptyTask()]);
      setTeam('');
      fetchReports();
    } catch (err: any) {
      alert(err?.response?.data?.detail || 'Failed to save report. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  const renderTable = (which: Which, heading: string) => {
    const rows = rowsFor(which);
    return (
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">
          {heading}
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#dce7c8] text-slate-800">
                <th className="px-2 py-2 text-left font-semibold w-12">S. No</th>
                <th className="px-2 py-2 text-left font-semibold w-40">Category</th>
                <th className="px-2 py-2 text-left font-semibold">Task Description</th>
                <th className="px-2 py-2 text-left font-semibold w-36">Due Date</th>
                <th className="px-2 py-2 text-left font-semibold w-36">Status</th>
                <th className="px-2 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-t border-slate-100">
                  <td className="px-2 py-1.5 text-slate-500 text-center">{idx + 1}</td>
                  <td className="px-2 py-1.5">
                    <input
                      value={row.category}
                      onChange={(e) => updateRow(which, idx, 'category', e.target.value)}
                      placeholder="Category"
                      className="w-full border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      value={row.task_description}
                      onChange={(e) =>
                        updateRow(which, idx, 'task_description', e.target.value)
                      }
                      placeholder="Task description"
                      className="w-full border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <input
                      type="date"
                      value={row.due_date}
                      onChange={(e) => updateRow(which, idx, 'due_date', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <select
                      value={row.status}
                      onChange={(e) => updateRow(which, idx, 'status', e.target.value)}
                      className={`w-full border rounded-lg px-2 py-1.5 outline-none ${
                        STATUS_STYLES[row.status] || 'border-slate-200'
                      }`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(which, idx)}
                      className="text-slate-400 hover:text-red-500 transition"
                      title="Remove row"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => addRow(which)}
          className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 font-semibold hover:text-blue-700"
        >
          <Plus size={16} /> Add Row
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
              <ClipboardList size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Daily Work Status Report</h2>
              <p className="text-xs text-slate-500">Alumni Team Members — Performance &amp; Execution Tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition"
            title="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Header fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Resource Name</label>
              <input
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="Your name"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Team</label>
              <input
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Team"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Day</label>
              <input
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="Day"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Two tables */}
          {renderTable('ongoing', 'i. Ongoing Tasks')}
          {renderTable('tomorrow', 'ii. To Do For Tomorrow')}

          <p className="text-xs text-slate-400 mb-4">
            Status: Completed | In Progress | Delayed | Dropped | Hold
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Report'}
            </button>
          </div>

          {/* Saved reports */}
          <div className="mt-8 border-t border-slate-200 pt-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3">My Submitted Reports</h3>
            {loadingReports ? (
              <p className="text-sm text-slate-400">Loading…</p>
            ) : reports.length === 0 ? (
              <p className="text-sm text-slate-400">No reports submitted yet.</p>
            ) : (
              <div className="space-y-2">
                {reports.map((r) => {
                  const og = safeParse(r.ongoing_tasks);
                  const tm = safeParse(r.tomorrow_tasks);
                  return (
                    <div
                      key={r.id}
                      className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {r.report_date} {r.day ? `(${r.day})` : ''}
                        </p>
                        <p className="text-xs text-slate-500">
                          {r.team ? `${r.team} · ` : ''}
                          {og.length} ongoing · {tm.length} for tomorrow
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">{r.entered_time}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
