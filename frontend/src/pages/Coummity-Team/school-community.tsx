import { useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, X, Users, School, CheckCircle, XCircle, Upload, ChevronRight } from "lucide-react";

// BackButton stub for standalone use
function BackButton() {
  return (
    <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
      <ChevronRight size={16} className="rotate-180" />
      Back
    </button>
  );
}

type Record = {
  id: number;
  school_name: string;
  whatsapp_group: string;
  mobilization: string;
  members: number;
  proof: string | File | null;
  platform: string;
  remarks: string;
};

type FormData = {
  school_name: string;
  whatsapp_group: string;
  mobilization: string;
  members: string;
  proof: File | null;
  platform: string;
  remarks: string;
};

const EMPTY_FORM: FormData = {
  school_name: "",
  whatsapp_group: "",
  mobilization: "Yes",
  members: "",
  proof: null,
  platform: "",
  remarks: "",
};

export default function SchoolCommunity() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<Record | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const [data, setData] = useState<Record[]>([
    {
      id: 1,
      school_name: "Govt Hr Sec School",
      whatsapp_group: "GHSS Alumni 2025",
      mobilization: "Yes",
      members: 650,
      proof: "https://via.placeholder.com/150",
      platform: "WhatsApp",
      remarks: "Active community",
    },
    {
      id: 2,
      school_name: "St. Joseph's Hr Sec School",
      whatsapp_group: "SJS Alumni Network",
      mobilization: "Yes",
      members: 820,
      proof: null,
      platform: "Telegram",
      remarks: "Recently formed",
    },
    {
      id: 3,
      school_name: "Anna Matriculation School",
      whatsapp_group: "Anna Matric Old Boys",
      mobilization: "No",
      members: 510,
      proof: null,
      platform: "Facebook",
      remarks: "Pending verification",
    },
  ]);

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!formData.school_name.trim()) e.school_name = "School name is required";
    if (!formData.members) e.members = "Members count is required";
    else if (Number(formData.members) < 500) e.members = "Must be 500 or more";
    if (!formData.platform.trim()) e.platform = "Platform is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (item: Record) => {
    setFormData({
      school_name: item.school_name,
      whatsapp_group: item.whatsapp_group,
      mobilization: item.mobilization,
      members: String(item.members),
      proof: null,
      platform: item.platform,
      remarks: item.remarks,
    });
    setErrors({});
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editId !== null) {
      setData(data.map((item) =>
        item.id === editId
          ? {
              ...item,
              school_name: formData.school_name,
              whatsapp_group: formData.whatsapp_group,
              mobilization: formData.mobilization,
              members: Number(formData.members),
              proof: formData.proof ?? item.proof,
              platform: formData.platform,
              remarks: formData.remarks,
            }
          : item
      ));
    } else {
      setData([
        ...data,
        {
          id: Date.now(),
          school_name: formData.school_name,
          whatsapp_group: formData.whatsapp_group,
          mobilization: formData.mobilization,
          members: Number(formData.members),
          proof: formData.proof,
          platform: formData.platform,
          remarks: formData.remarks,
        },
      ]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
    setDeleteConfirm(null);
  };

  const filteredData = data.filter((item) =>
    item.school_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalMembers = data.reduce((sum, d) => sum + d.members, 0);
  const mobilizedCount = data.filter((d) => d.mobilization === "Yes").length;

  return (
    
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="min-h-screen bg-[#f0f4f9]"
    >
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <School size={16} className="text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">School Community</span>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200"
        >
          <Plus size={16} />
          Add School Community
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Alumni Community Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage and track school alumni communities across platforms.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {[
            {
              label: "Total Schools",
              value: data.length,
              icon: <School size={20} className="text-blue-600" />,
              bg: "bg-blue-50",
              accent: "text-blue-600",
            },
            {
              label: "Total Members",
              value: totalMembers.toLocaleString() + "+",
              icon: <Users size={20} className="text-emerald-600" />,
              bg: "bg-emerald-50",
              accent: "text-emerald-600",
            },
            {
              label: "Mobilized",
              value: `${mobilizedCount} / ${data.length}`,
              icon: <CheckCircle size={20} className="text-violet-600" />,
              bg: "bg-violet-50",
              accent: "text-violet-600",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl px-6 py-5 border border-slate-200 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.accent} mt-0.5`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 mb-5 flex items-center gap-3 shadow-sm">
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by school name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  {["S.No", "School Name", "WhatsApp Group", "Mobilization", "Members", "Proof", "Platform", "Remarks", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-4 text-left font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-5 py-16 text-center text-slate-400 text-sm">
                      No schools found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="px-5 py-4 text-slate-400 font-medium">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-5 py-4 font-semibold text-slate-800">{item.school_name}</td>
                      <td className="px-5 py-4 text-slate-600">{item.whatsapp_group || <span className="text-slate-300">—</span>}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          item.mobilization === "Yes"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}>
                          {item.mobilization === "Yes" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {item.mobilization}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          {item.members.toLocaleString()}+
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {item.proof ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                            <Eye size={13} /> Uploaded
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">No file</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {item.platform ? (
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium">{item.platform}</span>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-5 py-4 text-slate-500 max-w-[160px] truncate">{item.remarks || <span className="text-slate-300">—</span>}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewItem(item)}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            title="View"
                          >
                            <Eye size={14} className="text-slate-600" />
                          </button>
                          <button
                            onClick={() => openEdit(item)}
                            className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400">
            Showing {filteredData.length} of {data.length} schools
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 px-7 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">{editId ? "Edit" : "Add"} School Community</h2>
                <p className="text-slate-400 text-xs mt-0.5">Fill in the details below</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-7 py-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-x-5 gap-y-5">

                <Field label="School Name *" error={errors.school_name}>
                  <input
                    type="text"
                    placeholder="e.g. Govt Hr Sec School"
                    value={formData.school_name}
                    onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                    className={inputCls(!!errors.school_name)}
                  />
                </Field>

                <Field label="WhatsApp Group Name">
                  <input
                    type="text"
                    placeholder="e.g. GHSS Alumni 2025"
                    value={formData.whatsapp_group}
                    onChange={(e) => setFormData({ ...formData, whatsapp_group: e.target.value })}
                    className={inputCls(false)}
                  />
                </Field>

                <Field label="Alumni Mobilization">
                  <select
                    value={formData.mobilization}
                    onChange={(e) => setFormData({ ...formData, mobilization: e.target.value })}
                    className={inputCls(false)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </Field>

                <Field label="Members Count *" error={errors.members}>
                  <input
                    type="number"
                    min="500"
                    placeholder="Min 500"
                    value={formData.members}
                    onChange={(e) => setFormData({ ...formData, members: e.target.value })}
                    className={inputCls(!!errors.members)}
                  />
                </Field>

                <Field label="Celebrated Platform *" error={errors.platform}>
                  <input
                    type="text"
                    placeholder="e.g. WhatsApp, Telegram"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className={inputCls(!!errors.platform)}
                  />
                </Field>

                <Field label="Upload Proof (Image / PDF)">
                  <label className="flex items-center gap-3 border border-dashed border-slate-300 rounded-xl p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Upload size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-500 truncate">
                      {formData.proof ? (formData.proof as File).name : "Choose file..."}
                    </span>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => setFormData({ ...formData, proof: e.target.files?.[0] || null })}
                    />
                  </label>
                  {formData.proof && (formData.proof as File).type?.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(formData.proof as File)}
                      alt="Preview"
                      className="mt-2 h-20 w-20 object-cover rounded-lg border border-slate-200"
                    />
                  )}
                </Field>

                <div className="col-span-2">
                  <Field label="Remarks">
                    <textarea
                      placeholder="Additional notes..."
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      rows={3}
                      className={inputCls(false) + " resize-none"}
                    />
                  </Field>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-7 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-200"
              >
                {editId ? "Update" : "Save"} Community
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
              <h2 className="text-white font-bold">Community Details</h2>
              <button onClick={() => setViewItem(null)} className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center">
                <X size={15} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                ["School Name", viewItem.school_name],
                ["WhatsApp Group", viewItem.whatsapp_group || "—"],
                ["Mobilization", viewItem.mobilization],
                ["Members", `${viewItem.members.toLocaleString()}+`],
                ["Platform", viewItem.platform || "—"],
                ["Remarks", viewItem.remarks || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-32 flex-shrink-0">{label}</span>
                  <span className="text-sm text-slate-700 font-medium text-right">{value}</span>
                </div>
              ))}
              {viewItem.proof && (
                <div className="flex justify-between items-start gap-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-32 flex-shrink-0">Proof</span>
                  <span className="inline-flex items-center gap-1.5 text-emerald-600 text-sm font-medium"><Eye size={13} /> File Uploaded</span>
                </div>
              )}
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setViewItem(null)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-7 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Delete Record?</h3>
            <p className="text-slate-500 text-sm mt-2 mb-6">This action cannot be undone. The community record will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
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

// Helper components
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full border ${hasError ? "border-red-400 bg-red-50" : "border-slate-200"} rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300`;
}