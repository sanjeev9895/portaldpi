import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Eye, Pencil, Trash2, X, Users, CheckCircle, XCircle, Upload, Image as ImageIcon, ChevronDown } from "lucide-react";
import BackButton from "../../components/BackButton";
import { DISTRICTS, DISTRICT_BLOCKS } from "../../utils/districtData";

type CoreEngagementRecord = {
  id: number;
  core_team_name: string;
  team_formation_done: string; // "Yes" or "No"
  activity: string;
  proof: string | File | null;
  remarks: string;
  district?: string;
  block?: string;
  entered_by?: string;
  entered_time?: string;
};

type FormData = {
  core_team_name: string;
  team_formation_done: string;
  activity: string;
  proof: File | null;
  remarks: string;
  district: string;
  block: string;
};

const EMPTY_FORM: FormData = {
  core_team_name: "",
  team_formation_done: "Yes",
  activity: "",
  proof: null,
  remarks: "",
  district: "",
  block: "",
};

export default function CoreEngagement() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<CoreEngagementRecord[]>(() => {
    const saved = localStorage.getItem('core_engagements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaultData = [
      {
        id: 1,
        core_team_name: "Madurai Alumni Core Team",
        team_formation_done: "Yes",
        activity: "Monthly Committee Meeting & Fundraising Planning",
        proof: "https://via.placeholder.com/150",
        remarks: "Discussed centenary celebration plans and local funding avenues.",
      },
      {
        id: 2,
        core_team_name: "St. Mary Alumni Association",
        team_formation_done: "Yes",
        activity: "Expert Alumni Guest Lecture on Career Guidance",
        proof: null,
        remarks: "Highly interactive session with 100+ students attending.",
      },
      {
        id: 3,
        core_team_name: "Salem Core Committee",
        team_formation_done: "No",
        activity: "Donation Campaign Launch for Smart Classroom",
        proof: null,
        remarks: "Alumni sponsoring desks and digital projectors.",
      },
    ];
    localStorage.setItem('core_engagements', JSON.stringify(defaultData));
    return defaultData;
  });
  const [enteredByFilter, setEnteredByFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const enteredByOptions = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(item => {
      if (item.entered_by) {
        map.set(item.entered_by, (map.get(item.entered_by) ?? 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [data]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useState(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  });



  useEffect(() => {
    localStorage.setItem('core_engagements', JSON.stringify(data));
  }, [data]);

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<CoreEngagementRecord | null>(null);

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!formData.core_team_name.trim()) e.core_team_name = "Core team name is required";
    if (!formData.activity.trim()) e.activity = "Activity detail is required";
  if (!formData.district.trim()) e.district = "District is required";
  if (!formData.block.trim()) e.block = "Block is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (item: CoreEngagementRecord) => {
    setFormData({
    core_team_name: item.core_team_name,
    team_formation_done: item.team_formation_done,
    activity: item.activity,
    proof: null,
    remarks: item.remarks,
    district: item.district || "",
    block: item.block || "",
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
              core_team_name: formData.core_team_name,
              team_formation_done: formData.team_formation_done,
              activity: formData.activity,
              proof: formData.proof ?? item.proof,
              remarks: formData.remarks,
              district: formData.district,
              block: formData.block,
            }
          : item
      ));
    } else {
      setData([
        ...data,
          {
            id: Date.now(),
            core_team_name: formData.core_team_name,
            team_formation_done: formData.team_formation_done,
            activity: formData.activity,
            proof: formData.proof,
            remarks: formData.remarks,
            district: formData.district,
            block: formData.block,
            entered_by: currentUser?.name || 'Unknown',
            entered_time: new Date().toLocaleString(),
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
    (item.core_team_name.toLowerCase().includes(search.toLowerCase()) ||
     item.activity.toLowerCase().includes(search.toLowerCase())) &&
    (enteredByFilter ? (item.entered_by?.toLowerCase().includes(enteredByFilter.toLowerCase())) : true) &&
    (districtFilter ? item.district === districtFilter : true) &&
    (blockFilter ? item.block === blockFilter : true)
  );

  const activeCount = data.filter((d) => d.team_formation_done === "Yes").length;

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="min-h-screen bg-[#f0f4f9]"
    >
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <BackButton />
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Alumni Core Engagement</span>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-200 animate-fade-in"
        >
          <Plus size={16} />
          Add Engagement
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Alumni Core Engagement</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage and track core engagement activities, programs, and alumni verification drives.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {[
            {
              label: "Total Engagements Tracked",
              value: data.length,
              icon: <Users size={20} className="text-blue-600" />,
              bg: "bg-blue-50",
              accent: "text-blue-600",
            },
            {
              label: "Core Teams Formed",
              value: `${activeCount} / ${data.length}`,
              icon: <CheckCircle size={20} className="text-emerald-600" />,
              bg: "bg-emerald-50",
              accent: "text-emerald-600",
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

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-5">
        {/* Search Bar */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm">
          <Search size={18} className="text-slate-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search by core team or activity details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X size={16} />
            </button>
          )}
        </div>

        {/* District Filter */}
        <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm min-w-[200px] relative">
          <select
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setBlockFilter(""); // Reset block filter when district changes
            }}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none cursor-pointer appearance-none pr-8"
          >
            <option value="">All Districts</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            {districtFilter && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDistrictFilter("");
                  setBlockFilter("");
                }}
                className="text-slate-400 hover:text-slate-600 pointer-events-auto cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
            <ChevronDown size={15} className="text-slate-400" />
          </div>
        </div>

        {/* Block Filter */}
        <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm min-w-[200px] relative">
          <select
            value={blockFilter}
            onChange={(e) => setBlockFilter(e.target.value)}
            disabled={!districtFilter}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none cursor-pointer disabled:opacity-50 appearance-none pr-8"
          >
            <option value="">
              {districtFilter ? "All Blocks" : "Select District First"}
            </option>
            {districtFilter &&
              DISTRICT_BLOCKS[districtFilter]?.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            {blockFilter && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setBlockFilter("");
                }}
                className="text-slate-400 hover:text-slate-600 pointer-events-auto cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
            <ChevronDown size={15} className="text-slate-400" />
          </div>
        </div>

        {/* Entered By Filter */}
        <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm min-w-[200px] relative">
          <select
            value={enteredByFilter}
            onChange={(e) => setEnteredByFilter(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none cursor-pointer appearance-none pr-8"
          >
            <option value="">All entered by</option>
            {enteredByOptions.map(({ name, count }) => (
              <option key={name} value={name}>{`${name} (${count})`}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
            {enteredByFilter && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEnteredByFilter("");
                }}
                className="text-slate-400 hover:text-slate-600 pointer-events-auto cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
            <ChevronDown size={15} className="text-slate-400" />
          </div>
        </div>
      </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  {["Sl No", "Core Team Name", "Team Formation Done", "District", "Block", "Activity", "Proof", "Remarks", "Actions", "Entered By"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                    {h}
                  </th>
                ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-5 py-16 text-center text-slate-400 text-sm">
                      No records found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="px-5 py-4 text-slate-400 font-medium">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-5 py-4 font-semibold text-slate-800">{item.core_team_name}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          item.team_formation_done === "Yes"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}>
                          {item.team_formation_done === "Yes" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {item.team_formation_done}
                        </span>
                      </td>
                      <td className="px-5 py-4">{item.district || "—"}</td>
                      <td className="px-5 py-4">{item.block || "—"}</td>
                      <td className="px-5 py-4 text-slate-700 font-medium max-w-[200px] truncate">{item.activity}</td>
                      <td className="px-5 py-4 text-slate-500">
                        {item.proof ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                            <ImageIcon size={14} /> Uploaded
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">No Proof</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate">{item.remarks || <span className="text-slate-300">—</span>}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewItem(item)}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                            title="View"
                          >
                            <Eye size={14} className="text-slate-600" />
                          </button>
                          {currentUser?.role !== 'employee' && (
                            <>
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
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800 text-xs">{item.entered_by || 'Unknown'}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{item.entered_time || '—'}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400">
            Showing {filteredData.length} of {data.length} records
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="bg-slate-900 px-7 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">{editId ? "Edit" : "Add"} Core Engagement</h2>
                <p className="text-slate-400 text-xs mt-0.5">Define core team engagement metrics</p>
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
                <Field label="Core Team Name *" error={errors.core_team_name}>
                  <input
                    type="text"
                    placeholder="e.g. Madurai Alumni Core Team"
                    value={formData.core_team_name}
                    onChange={(e) => setFormData({ ...formData, core_team_name: e.target.value })}
                    className={inputCls(!!errors.core_team_name)}
                  />
                </Field>
                <Field label="District *" error={errors.district}>
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value, block: "" })}
                    className={inputCls(!!errors.district)}
                  >
                    <option value="">Select District</option>
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Block *" error={errors.block}>
                  <select
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className={inputCls(!!errors.block)}
                  >
                    <option value="">Select Block</option>
                    {(DISTRICT_BLOCKS[formData.district] || []).map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Team Formation Done">
                  <select
                    value={formData.team_formation_done}
                    onChange={(e) => setFormData({ ...formData, team_formation_done: e.target.value })}
                    className={inputCls(false)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </Field>

                <div className="col-span-2">
                  <Field label="Activity *" error={errors.activity}>
                    <input
                      type="text"
                      placeholder="e.g. Monthly Committee Meeting & Goal Setting"
                      value={formData.activity}
                      onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                      className={inputCls(!!errors.activity)}
                    />
                  </Field>
                </div>

                <Field label="Activity Proof Image">
                  <label className="flex items-center gap-3 border border-dashed border-slate-300 rounded-xl p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Upload size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-500 truncate">
                      {formData.proof ? (formData.proof as File).name : "Choose file..."}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFormData({ ...formData, proof: e.target.files?.[0] || null })}
                    />
                  </label>
                  {formData.proof && (
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
                      placeholder="Add brief details about the engagement event..."
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
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-sm shadow-emerald-200"
              >
                {editId ? "Update" : "Save"} Engagement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
              <h2 className="text-white font-bold">Engagement Details</h2>
              <button onClick={() => setViewItem(null)} className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center">
                <X size={15} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                ["Core Team Name", viewItem.core_team_name],
                ["Team Formation Done", viewItem.team_formation_done],
                ["Activity", viewItem.activity],
                ["Remarks", viewItem.remarks || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-36 flex-shrink-0">{label}</span>
                  <span className="text-sm text-slate-700 font-medium text-right">{value}</span>
                </div>
              ))}
              {viewItem.proof && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Uploaded Proof Preview</span>
                  {typeof viewItem.proof === "string" ? (
                    <img src={viewItem.proof} alt="Proof" className="w-full h-40 object-cover rounded-xl border" />
                  ) : (
                    <img src={URL.createObjectURL(viewItem.proof as File)} alt="Proof" className="w-full h-40 object-cover rounded-xl border" />
                  )}
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
            <p className="text-slate-500 text-sm mt-2 mb-6">This record will be permanently deleted from the database.</p>
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
  return `w-full border ${hasError ? "border-red-400 bg-red-50" : "border-slate-200"} rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all placeholder:text-slate-300`;
}