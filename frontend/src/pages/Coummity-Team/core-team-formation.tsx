import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Eye, Pencil, Trash2, X, Users, CheckCircle, XCircle, Upload, Image as ImageIcon, ChevronDown } from "lucide-react";
import BackButton from "../../components/BackButton";
import { DISTRICTS, DISTRICT_BLOCKS } from "../../utils/districtData";

type CoreTeamRecord = {
  id: number;
  school_name: string;
  district?: string;
  block?: string;
  core_team_name: string;
  core_team_formation: string; // "Yes" or "No"
  how_many_members: number;
  proof: string | File | null;
  remarks: string;
  entered_by?: string;
  entered_time?: string;
};

type FormData = {
  school_name: string;
  district: string;
  block: string;
  core_team_name: string;
  core_team_formation: string;
  how_many_members: string;
  proof: File | null;
  remarks: string;
};

const EMPTY_FORM: FormData = {
  school_name: "",
  district: "",
  block: "",
  core_team_name: "",
  core_team_formation: "Yes",
  how_many_members: "",
  proof: null,
  remarks: "",
};

export default function CoreTeamFormation() {
  const [search, setSearch] = useState("");
  const [enteredByFilter, setEnteredByFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<CoreTeamRecord | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
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

  const [data, setData] = useState<CoreTeamRecord[]>(() => {
    const saved = localStorage.getItem('core_teams');
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
        school_name: "Govt Hr Sec School, Madurai",
        district: "Madurai",
        block: "Madurai West",
        core_team_name: "Madurai Alumni Core Team",
        core_team_formation: "Yes",
        how_many_members: 9,
        proof: "https://via.placeholder.com/150",
        remarks: "Fully formed and bank account details updated.",
      },
      {
        id: 2,
        school_name: "St. Mary's School, Trichy",
        district: "Tiruchirappalli",
        block: "Lalgudi",
        core_team_name: "St. Mary Alumni association",
        core_team_formation: "Yes",
        how_many_members: 7,
        proof: null,
        remarks: "Committee registered with school management.",
      },
      {
        id: 3,
        school_name: "GHSS, Salem",
        district: "Salem",
        block: "Omalur",
        core_team_name: "Salem Core Committee",
        core_team_formation: "No",
        how_many_members: 5,
        proof: null,
        remarks: "Treasurer selection pending.",
      },
    ];
    localStorage.setItem('core_teams', JSON.stringify(defaultData));
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('core_teams', JSON.stringify(data));
  }, [data]);

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!formData.school_name.trim()) e.school_name = "School name is required";
    if (!formData.district.trim()) e.district = "District is required";
    if (!formData.block.trim()) e.block = "Block is required";
    if (!formData.core_team_name.trim()) e.core_team_name = "Core team name is required";
    if (!formData.how_many_members) e.how_many_members = "Headcount is required";
    else if (Number(formData.how_many_members) <= 0) e.how_many_members = "Must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (item: CoreTeamRecord) => {
    setFormData({
      school_name: item.school_name,
      district: item.district || "",
      block: item.block || "",
      core_team_name: item.core_team_name,
      core_team_formation: item.core_team_formation,
      how_many_members: String(item.how_many_members),
      proof: null,
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
              district: formData.district,
              block: formData.block,
              core_team_name: formData.core_team_name,
              core_team_formation: formData.core_team_formation,
              how_many_members: Number(formData.how_many_members),
              proof: formData.proof ?? item.proof,
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
          district: formData.district,
          block: formData.block,
          core_team_name: formData.core_team_name,
          core_team_formation: formData.core_team_formation,
          how_many_members: Number(formData.how_many_members),
          proof: formData.proof,
          remarks: formData.remarks,
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
    (item.school_name.toLowerCase().includes(search.toLowerCase()) ||
     item.core_team_name.toLowerCase().includes(search.toLowerCase())) &&
    (enteredByFilter ? (item.entered_by?.toLowerCase().includes(enteredByFilter.toLowerCase())) : true) &&
    (districtFilter ? item.district === districtFilter : true) &&
    (blockFilter ? item.block === blockFilter : true)
  );

  const totalMembers = filteredData.reduce((sum, d) => sum + d.how_many_members, 0);
  const formedCount = filteredData.filter((d) => d.core_team_formation === "Yes").length;

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
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Core Team Formation</span>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-violet-200 animate-fade-in"
        >
          <Plus size={16} />
          Add Core Team
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Alumni Core Team Formation</h1>
          <p className="text-slate-500 mt-1 text-sm">Form and structure school-level alumni core committees and representatives.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: "Total Registered Committees",
              value: filteredData.length,
              icon: <Users size={20} className="text-blue-600" />,
              bg: "bg-blue-50",
              accent: "text-blue-600",
            },
            {
              label: "Formed Status",
              value: `${formedCount} / ${filteredData.length}`,
              icon: <CheckCircle size={20} className="text-emerald-600" />,
              bg: "bg-emerald-50",
              accent: "text-emerald-600",
            },
            {
              label: "Total Core Members Count",
              value: totalMembers,
              icon: <Users size={20} className="text-violet-600" />,
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

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-5">
          {/* Search */}
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex-1 flex items-center gap-3 shadow-sm">
            <Search size={18} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by school or team name..."
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

          {/* District Filter */}
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm min-w-[200px]">
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setBlockFilter(""); // Reset block filter when district changes
              }}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none cursor-pointer"
            >
              <option value="">All Districts</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {districtFilter && (
              <button onClick={() => { setDistrictFilter(""); setBlockFilter(""); }} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Block Filter */}
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm min-w-[200px]">
            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              disabled={!districtFilter}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none cursor-pointer disabled:opacity-50"
            >
              <option value="">
                {districtFilter ? "All Blocks" : "Select District First"}
              </option>
              {districtFilter &&
                (DISTRICT_BLOCKS[districtFilter] || []).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
            </select>
            {blockFilter && (
              <button onClick={() => setBlockFilter("")} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Entered By Filter */}
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm min-w-[200px]">
            <select
              value={enteredByFilter}
              onChange={(e) => setEnteredByFilter(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none cursor-pointer"
            >
              <option value="">All entered by</option>
              {Array.from(new Set(data.map(item => item.entered_by).filter(Boolean))).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            {enteredByFilter && (
              <button onClick={() => setEnteredByFilter("")} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
          </div>
        </div>{/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  {["Sl No", "School Name", "District", "Block", "Core Team Name", "Core Team Formation", "How Many Members", "Proof (images)", "Remarks", "Actions", "Entered By"].map((h) => (
                    <th key={h} className="px-5 py-4 text-left font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-5 py-16 text-center text-slate-400 text-sm">
                      No core teams found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="px-5 py-4 text-slate-400 font-medium">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-5 py-4 font-semibold text-slate-800">{item.school_name}</td>
                      <td className="px-5 py-4">{item.district}</td>
                      <td className="px-5 py-4">{item.block}</td>
                      <td className="px-5 py-4 text-slate-700 font-medium">{item.core_team_name}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          item.core_team_formation === "Yes"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-600"
                        }`}>
                          {item.core_team_formation === "Yes" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {item.core_team_formation}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-700">{item.how_many_members}</td>
                      <td className="px-5 py-4 text-slate-500">
                        {item.proof ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                            <ImageIcon size={14} /> Available
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">No Proof</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500 max-w-[220px] truncate">{item.remarks || <span className="text-slate-300">—</span>}</td>
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
                <h2 className="text-white font-bold text-lg">{editId ? "Edit" : "Add"} Core Team</h2>
                <p className="text-slate-400 text-xs mt-0.5">Fill in core team details</p>
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
                <Field label="District *" error={errors.district}>
                  <select value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value, block: "" })} className={inputCls(!!errors.district)}>
                    <option value="">Select District</option>
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Block *" error={errors.block}>
                  <select
  value={formData.block}
  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
  className={inputCls(!!errors.block)}
  disabled={!formData.district}>

                    <option value="">Select Block</option>
                    {formData.district &&
                      (DISTRICT_BLOCKS[formData.district as keyof typeof DISTRICT_BLOCKS] || []).map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                  </select>
                </Field>

                <Field label="Core Team Name *" error={errors.core_team_name}>
                  <input
                    type="text"
                    placeholder="e.g. Madurai Alumni Association"
                    value={formData.core_team_name}
                    onChange={(e) => setFormData({ ...formData, core_team_name: e.target.value })}
                    className={inputCls(!!errors.core_team_name)}
                  />
                </Field>

                <Field label="Core Team Formation">
                  <select
                    value={formData.core_team_formation}
                    onChange={(e) => setFormData({ ...formData, core_team_formation: e.target.value })}
                    className={inputCls(false)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </Field>

                <Field label="How Many Members *" error={errors.how_many_members}>
                  <input
                    type="number"
                    placeholder="e.g. 7"
                    value={formData.how_many_members}
                    onChange={(e) => setFormData({ ...formData, how_many_members: e.target.value })}
                    className={inputCls(!!errors.how_many_members)}
                  />
                </Field>

                <Field label="Proof Image">
                  <label className="flex items-center gap-3 border border-dashed border-slate-300 rounded-xl p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Upload size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-500 truncate">
                      {formData.proof ? (formData.proof as File).name : "Upload proof image..."}
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
                      placeholder="Add any specific core team committee remarks..."
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
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 active:scale-95 transition-all shadow-sm shadow-violet-200"
              >
                {editId ? "Update" : "Save"} Core Team
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
              <h2 className="text-white font-bold">Core Team Details</h2>
              <button onClick={() => setViewItem(null)} className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center">
                <X size={15} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                ["School Name", viewItem.school_name],
                ["Core Team Name", viewItem.core_team_name],
                ["Core Team Formation", viewItem.core_team_formation],
                ["How Many Members", `${viewItem.how_many_members} members`],
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
            <h3 className="font-bold text-slate-800 text-lg">Delete Core Team?</h3>
            <p className="text-slate-500 text-sm mt-2 mb-6">This record will be permanently deleted.</p>
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
  return `w-full border ${hasError ? "border-red-400 bg-red-50" : "border-slate-200"} rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all placeholder:text-slate-300`;
}