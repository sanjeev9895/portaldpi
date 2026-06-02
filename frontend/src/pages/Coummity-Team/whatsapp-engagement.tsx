import { useState, useEffect, useMemo } from "react";
import { Search, Plus, Eye, Pencil, Trash2, X, MessageSquare, Link2, User, Users, CheckCircle, TrendingUp } from "lucide-react";
import BackButton from "../../components/BackButton";

type WhatsAppRecord = {
  id: number;
  school_name: string;
  district?: string;
  block?: string;
  group_link: string;
  group_admin: string;
  member_count: number;
  activity_status: string;
  last_msg_date: string;
  remarks: string;
  entered_by?: string;
  entered_time?: string;
};;

type FormData = {
  school_name: string;
  district: string;
  block: string;
  group_link: string;
  group_admin: string;
  member_count: string;
  activity_status: string;
  last_msg_date: string;
  remarks: string;
};

const EMPTY_FORM: FormData = {
  school_name: "",
  district: "",
  block: "",
  group_link: "",
  group_admin: "",
  member_count: "",
  activity_status: "Medium",
  last_msg_date: "",
  remarks: "",
};

export default function WhatsappEngagement() {
  const [search, setSearch] = useState("");
  const [enteredByFilter, setEnteredByFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<WhatsAppRecord | null>(null);
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

  const [data, setData] = useState<WhatsAppRecord[]>(() => {
    const saved = localStorage.getItem('whatsapp_groups');
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
        group_link: "https://chat.whatsapp.com/GHSSAlumniMadurai2025",
        group_admin: "Karthikeyan A. (Staff Coordinator)",
        member_count: 245,
        activity_status: "High",
        last_msg_date: "2026-06-01",
        remarks: "Daily updates, alumni sharing job opportunities and tutoring offers.",
      },
      {
        id: 2,
        school_name: "St. Mary's School, Trichy",
        group_link: "https://chat.whatsapp.com/StMarysAlumniTrichy",
        group_admin: "Sister Stella (Principal)",
        member_count: 480,
        activity_status: "High",
        last_msg_date: "2026-06-01",
        remarks: "Highly active group. Group link pinned on the school website.",
      },
      {
        id: 3,
        school_name: "GHSS, Salem",
        group_link: "https://chat.whatsapp.com/SalemGHSSAlumniNetwork",
        group_admin: "Rajesh S. (Alumni Joint Sec)",
        member_count: 120,
        activity_status: "Medium",
        last_msg_date: "2026-05-30",
        remarks: "Group formed recently. Mobilization drives are ongoing.",
      },
    ];
    localStorage.setItem('whatsapp_groups', JSON.stringify(defaultData));
    return defaultData;
  });

  const enteredByOptions = useMemo(() => {
  const map = new Map<string, number>();
  data.forEach(item => {
    if (item.entered_by) {
      map.set(item.entered_by, (map.get(item.entered_by) ?? 0) + 1);
    }
  });
  return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
}, [data]);

useEffect(() => {
  localStorage.setItem('whatsapp_groups', JSON.stringify(data));
}, [data]);

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!formData.school_name.trim()) e.school_name = "School name is required";
    if (!formData.district.trim()) e.district = "District is required";
    if (!formData.block.trim()) e.block = "Block is required";
    if (!formData.group_link.trim()) e.group_link = "WhatsApp group link is required";
    else if (!formData.group_link.includes("chat.whatsapp.com/")) e.group_link = "Must be a valid WhatsApp invite link";
    if (!formData.group_admin.trim()) e.group_admin = "Group admin/representative is required";
    if (!formData.member_count) e.member_count = "Member count is required";
    if (!formData.last_msg_date) e.last_msg_date = "Last active date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (item: WhatsAppRecord) => {
    setFormData({
      school_name: item.school_name,
      district: item.district || "",
      block: item.block || "",
      group_link: item.group_link,
      group_admin: item.group_admin,
      member_count: String(item.member_count),
      activity_status: item.activity_status,
      last_msg_date: item.last_msg_date,
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
              group_link: formData.group_link,
              group_admin: formData.group_admin,
              member_count: Number(formData.member_count),
              activity_status: formData.activity_status,
              last_msg_date: formData.last_msg_date,
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
          group_link: formData.group_link,
          group_admin: formData.group_admin,
          member_count: Number(formData.member_count),
          activity_status: formData.activity_status,
          last_msg_date: formData.last_msg_date,
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
     item.group_admin.toLowerCase().includes(search.toLowerCase())) &&
    (enteredByFilter ? (item.entered_by?.toLowerCase().includes(enteredByFilter.toLowerCase())) : true)
  );

  const totalMembers = data.reduce((sum, d) => sum + d.member_count, 0);
  const highActivityCount = data.filter((d) => d.activity_status === "High").length;

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
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <MessageSquare size={16} className="text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">WhatsApp Engagement</span>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-green-200"
        >
          <Plus size={16} />
          Register WhatsApp Group
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">WhatsApp Group Engagement</h1>
          <p className="text-slate-500 mt-1 text-sm">Monitor invite links, administrative setup, active participation, and growth rates in WhatsApp groups.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: "Active Groups",
              value: data.length,
              icon: <MessageSquare size={20} className="text-emerald-600" />,
              bg: "bg-emerald-50",
              accent: "text-emerald-600",
            },
            {
              label: "Total Group Members",
              value: totalMembers.toLocaleString() + " alumni",
              icon: <Users size={20} className="text-blue-600" />,
              bg: "bg-blue-50",
              accent: "text-blue-600",
            },
            {
              label: "High Activity Groups",
              value: highActivityCount + " groups",
              icon: <TrendingUp size={20} className="text-green-600" />,
              bg: "bg-green-50",
              accent: "text-green-600",
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
            placeholder="Search by school or admin name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          )}
          {/* Entered By Filter */}
          <div className="w-px h-6 bg-slate-200" />
          <select
            value={enteredByFilter}
            onChange={(e) => setEnteredByFilter(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none"
          >
            <option value="">All entered by</option>
            {enteredByOptions.map(({ name, count }) => (
              <option key={name} value={name}>{`${name} (${count})`}</option>
            ))}
          </select>
          {enteredByFilter && (
            <button onClick={() => setEnteredByFilter("")} className="text-slate-400 hover:text-slate-600">
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
                  {["S.No", "School Name", "District", "Block", "Group Link", "Group Admin", "Member Count", "Last Active Date", "Activity Status", "Entered By", "Actions"].map((h) => (
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
                      No WhatsApp groups registered. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="px-5 py-4 text-slate-400 font-medium">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-5 py-4 font-semibold text-slate-800">{item.school_name}</td>
                      <td className="px-5 py-4">{item.district}</td>
                      <td className="px-5 py-4">{item.block}</td>
                      <td className="px-5 py-4">
                        <a
                          href={item.group_link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700 hover:underline"
                        >
                          <Link2 size={13} />
                          Join Link
                        </a>
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        <span className="flex items-center gap-1.5 text-xs font-medium">
                          <User size={13} className="text-slate-400" />
                          {item.group_admin}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          {item.member_count} members
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{item.last_msg_date}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          item.activity_status === "High"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.activity_status === "Medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}>
                          <CheckCircle size={12} />
                          {item.activity_status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800 text-xs">{item.entered_by || 'Unknown'}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{item.entered_time || '—'}</div>
                      </td>
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
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 px-7 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">{editId ? "Edit" : "Register"} WhatsApp Group</h2>
                <p className="text-slate-400 text-xs mt-0.5">Define community chat parameters</p>
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

                <Field label="WhatsApp Invite Link *" error={errors.group_link}>
                  <input
                    type="text"
                    placeholder="e.g. https://chat.whatsapp.com/..."
                    value={formData.group_link}
                    onChange={(e) => setFormData({ ...formData, group_link: e.target.value })}
                    className={inputCls(!!errors.group_link)}
                  />
                </Field>

                <Field label="Group Admin Representative *" error={errors.group_admin}>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh S. (Staff Coordinator)"
                    value={formData.group_admin}
                    onChange={(e) => setFormData({ ...formData, group_admin: e.target.value })}
                    className={inputCls(!!errors.group_admin)}
                  />
                </Field>

                <Field label="Member Count *" error={errors.member_count}>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 250"
                    value={formData.member_count}
                    onChange={(e) => setFormData({ ...formData, member_count: e.target.value })}
                    className={inputCls(!!errors.member_count)}
                  />
                </Field>

                <Field label="Last Active Message Date *" error={errors.last_msg_date}>
                  <input
                    type="date"
                    value={formData.last_msg_date}
                    onChange={(e) => setFormData({ ...formData, last_msg_date: e.target.value })}
                    className={inputCls(!!errors.last_msg_date)}
                  />
                </Field>

                <Field label="Activity Status">
                  <select
                    value={formData.activity_status}
                    onChange={(e) => setFormData({ ...formData, activity_status: e.target.value })}
                    className={inputCls(false)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </Field>

                <div className="col-span-2">
                  <Field label="Remarks">
                    <textarea
                      placeholder="Add information about group rules, activity updates, etc..."
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
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 active:scale-95 transition-all shadow-sm shadow-green-200"
              >
                {editId ? "Update" : "Register"} Group
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
              <h2 className="text-white font-bold">Group Details</h2>
              <button onClick={() => setViewItem(null)} className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center">
                <X size={15} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                ["School Name", viewItem.school_name],
                ["District", viewItem.district || "—"],
                ["Block", viewItem.block || "—"],
                ["Group Link", viewItem.group_link],
                ["Group Admin", viewItem.group_admin],
                ["Member Count", `${viewItem.member_count} members`],
                ["Last Active Date", viewItem.last_msg_date],
                ["Activity Status", viewItem.activity_status],
                ["Remarks", viewItem.remarks || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-36 flex-shrink-0">{label}</span>
                  <span className="text-sm text-slate-700 font-medium text-right break-all">{value}</span>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <a
                href={viewItem.group_link}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors text-center inline-flex items-center justify-center gap-1.5"
              >
                <Link2 size={15} /> Join WhatsApp
              </a>
              <button
                onClick={() => setViewItem(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
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
            <h3 className="font-bold text-slate-800 text-lg">Remove Group Record?</h3>
            <p className="text-slate-500 text-sm mt-2 mb-6">Alumni group records will be permanently removed.</p>
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
  return `w-full border ${hasError ? "border-red-400 bg-red-50" : "border-slate-200"} rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all placeholder:text-slate-300`;
}