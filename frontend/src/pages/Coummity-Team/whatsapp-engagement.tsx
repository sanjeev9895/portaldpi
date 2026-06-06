import { useState, useEffect, useMemo } from "react";
import { 
  Search, Plus, Eye, Pencil, Trash2, X, MessageSquare, 
  Link2, Users, CheckCircle, XCircle, TrendingUp, ChevronDown, Clock, History 
} from "lucide-react";
import BackButton from "../../components/BackButton";
import { DISTRICTS, DISTRICT_BLOCKS } from "../../utils/districtData";
import api from "../../services/api";

const safeParseJSON = (str: any, fallback: any = []) => {
  if (!str) return fallback;
  if (typeof str !== "string") return str || fallback;
  if (str === "null" || str === "None" || str === "undefined") return fallback;
  try {
    const parsed = JSON.parse(str);
    return parsed || fallback;
  } catch (e) {
    return fallback;
  }
};

const mapToFrontend = (item: any): WhatsAppRecord => ({
  id: item.id,
  school_name: item.school_name || "",
  district: item.district || "",
  block: item.block || "",
  school_type: item.school_type || "Primary School",
  school_category: item.school_category || "Career Guidance",
  group_formed: item.group_formed || "Yes",
  group_link: item.group_link || "",
  member_count: item.member_count || 0,
  last_shared_message: item.last_shared_message || "",
  last_shared_message_date: item.last_shared_message_date || "",
  last_msg_responses: item.last_msg_responses || "",
  activity_status: item.activity_status || "Medium",
  changes_count: item.changes_count || 0,
  history: safeParseJSON(item.history_json, []),
  entered_by: item.entered_by || "Unknown",
  entered_time: item.entered_time || "",
});

type LastMessageHistoryItem = {
  message: string;
  date: string;
  edited_time: string;
};

type WhatsAppRecord = {
  id: number;
  school_name: string;
  district: string;
  block: string;
  school_type: string; // "Primary School", "Middle School", "High School", "High Sec School"
  school_category: string; // "Career Guidance", "Centinary School", "Vetri Palligal School"
  group_formed: string; // "Yes" / "No"
  group_link: string;
  member_count: number;
  last_shared_message: string;
  last_shared_message_date: string;
  last_msg_responses: string;
  activity_status: string; // "Low", "Medium", "High"
  changes_count: number; // Number of times message/date was edited
  history: LastMessageHistoryItem[]; // Change logs
  entered_by?: string;
  entered_time?: string;
};

type FormData = {
  school_name: string;
  district: string;
  block: string;
  school_type: string;
  school_category: string;
  group_formed: string;
  group_link: string;
  member_count: string;
  last_shared_message: string;
  last_shared_message_date: string;
  last_msg_responses: string;
  activity_status: string;
};

const EMPTY_FORM: FormData = {
  school_name: "",
  district: "",
  block: "",
  school_type: "Primary School",
  school_category: "Career Guidance",
  group_formed: "Yes",
  group_link: "",
  member_count: "",
  last_shared_message: "",
  last_shared_message_date: "",
  last_msg_responses: "",
  activity_status: "Medium",
};

export default function WhatsappEngagement() {
  const [search, setSearch] = useState("");
  const [enteredByFilter, setEnteredByFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [groupFormedFilter, setGroupFormedFilter] = useState("");
  const [activityStatusFilter, setActivityStatusFilter] = useState("");

  // Advanced Filters State
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [schoolTypeFilter, setSchoolTypeFilter] = useState("");
  const [schoolCategoryFilter, setSchoolCategoryFilter] = useState("");
  const [groupLinkFilter, setGroupLinkFilter] = useState("");
  const [minMembersFilter, setMinMembersFilter] = useState("");
  const [lastMessageFilter, setLastMessageFilter] = useState("");
  const [lastMessageDateFilter, setLastMessageDateFilter] = useState("");
  const [responsesFilter, setResponsesFilter] = useState("");
  const [minEditsFilter, setMinEditsFilter] = useState("");
  const [enteredTimeFilter, setEnteredTimeFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<WhatsAppRecord | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [data, setData] = useState<WhatsAppRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get('/whatsapp-engagements');
      const items = res.data;
      if (Array.isArray(items)) {
        setData(items.map(mapToFrontend));
      }
    } catch (err) {
      console.error("FAILED TO FETCH WHATSAPP ENGAGEMENTS:", err);
      // Fallback to localStorage if offline
      const saved = localStorage.getItem('whatsapp_groups');
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
    fetchRecords();
  }, []);

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
    if (!formData.school_type.trim()) e.school_type = "School type is required";
    if (!formData.school_category.trim()) e.school_category = "School category is required";
    if (!formData.group_formed.trim()) e.group_formed = "Group formation status is required";
    if (!formData.group_link.trim()) e.group_link = "WhatsApp group link is required";
    else if (!formData.group_link.includes("chat.whatsapp.com/")) e.group_link = "Must be a valid WhatsApp invite link";
    if (formData.member_count === "") {
      e.member_count = "Member count is required";
    } else if (isNaN(Number(formData.member_count)) || Number(formData.member_count) < 0) {
      e.member_count = "Must be a valid positive number";
    }
    if (!formData.last_shared_message.trim()) e.last_shared_message = "Last shared message is required";
    if (!formData.last_shared_message_date) e.last_shared_message_date = "Last shared message date is required";
    if (!formData.last_msg_responses.trim()) e.last_msg_responses = "Responses detail is required";
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
      school_name: item.school_name || "",
      district: item.district || "",
      block: item.block || "",
      school_type: item.school_type || "Primary School",
      school_category: item.school_category || "Career Guidance",
      group_formed: item.group_formed || "Yes",
      group_link: item.group_link || "",
      member_count: String(item.member_count || 0),
      last_shared_message: item.last_shared_message || "",
      last_shared_message_date: item.last_shared_message_date || "",
      last_msg_responses: item.last_msg_responses || "",
      activity_status: item.activity_status || "Medium",
    });
    setErrors({});
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editId !== null) {
        // Find existing item to determine if message changed and get history
        const item = data.find((d) => d.id === editId);
        if (!item) return;

        const hasMessageChanged = 
          item.last_shared_message !== formData.last_shared_message ||
          item.last_shared_message_date !== formData.last_shared_message_date;

        const updatedChangesCount = hasMessageChanged 
          ? (item.changes_count || 0) + 1 
          : (item.changes_count || 0);

        const updatedHistory = [...(item.history || [])];
        if (hasMessageChanged) {
          updatedHistory.push({
            message: item.last_shared_message,
            date: item.last_shared_message_date,
            edited_time: new Date().toLocaleString()
          });
        }

        const payload = {
          school_name: formData.school_name,
          district: formData.district,
          block: formData.block,
          school_type: formData.school_type,
          school_category: formData.school_category,
          group_formed: formData.group_formed,
          group_link: formData.group_link,
          member_count: Number(formData.member_count),
          last_shared_message: formData.last_shared_message,
          last_shared_message_date: formData.last_shared_message_date,
          last_msg_responses: formData.last_msg_responses,
          activity_status: formData.activity_status,
          changes_count: updatedChangesCount,
          history_json: JSON.stringify(updatedHistory),
          entered_by: item.entered_by || currentUser?.name || 'Unknown',
          entered_time: item.entered_time || new Date().toLocaleString(),
        };

        await api.put(`/whatsapp-engagements/${editId}`, payload);
      } else {
        const payload = {
          school_name: formData.school_name,
          district: formData.district,
          block: formData.block,
          school_type: formData.school_type,
          school_category: formData.school_category,
          group_formed: formData.group_formed,
          group_link: formData.group_link,
          member_count: Number(formData.member_count),
          last_shared_message: formData.last_shared_message,
          last_shared_message_date: formData.last_shared_message_date,
          last_msg_responses: formData.last_msg_responses,
          activity_status: formData.activity_status,
          changes_count: 0,
          history_json: JSON.stringify([]),
          entered_by: currentUser?.name || 'Unknown',
          entered_time: new Date().toLocaleString(),
        };

        await api.post('/whatsapp-engagements', payload);
      }
      setShowModal(false);
      fetchRecords();
    } catch (err) {
      console.error("FAILED TO SAVE WHATSAPP ENGAGEMENT:", err);
      alert("Failed to save WhatsApp Group record. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/whatsapp-engagements/${id}`);
      setDeleteConfirm(null);
      fetchRecords();
    } catch (err) {
      console.error("FAILED TO DELETE WHATSAPP ENGAGEMENT:", err);
      alert("Failed to delete WhatsApp Group record.");
    }
  };

  const filteredData = data.filter((item) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !(item.school_name || "").toLowerCase().includes(q) &&
        !(item.last_shared_message || "").toLowerCase().includes(q) &&
        !(item.last_msg_responses || "").toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (districtFilter && item.district !== districtFilter) return false;
    if (blockFilter && item.block !== blockFilter) return false;
    if (groupFormedFilter && item.group_formed !== groupFormedFilter) return false;
    if (enteredByFilter && item.entered_by !== enteredByFilter) return false;
    if (schoolTypeFilter && item.school_type !== schoolTypeFilter) return false;
    if (schoolCategoryFilter && item.school_category !== schoolCategoryFilter) return false;
    if (groupLinkFilter && !(item.group_link || "").toLowerCase().includes(groupLinkFilter.toLowerCase())) return false;
    if (minMembersFilter && (item.member_count || 0) < Number(minMembersFilter)) return false;
    if (lastMessageFilter && !(item.last_shared_message || "").toLowerCase().includes(lastMessageFilter.toLowerCase())) return false;
    if (lastMessageDateFilter && item.last_shared_message_date !== lastMessageDateFilter) return false;
    if (responsesFilter && !(item.last_msg_responses || "").toLowerCase().includes(responsesFilter.toLowerCase())) return false;
    if (activityStatusFilter && item.activity_status !== activityStatusFilter) return false;
    if (minEditsFilter && (item.changes_count || 0) < Number(minEditsFilter)) return false;
    if (enteredTimeFilter && !(item.entered_time || "").toLowerCase().includes(enteredTimeFilter.toLowerCase())) return false;
    return true;
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (districtFilter) count++;
    if (blockFilter) count++;
    if (groupFormedFilter) count++;
    if (enteredByFilter) count++;
    if (schoolTypeFilter) count++;
    if (schoolCategoryFilter) count++;
    if (groupLinkFilter) count++;
    if (minMembersFilter) count++;
    if (lastMessageFilter) count++;
    if (lastMessageDateFilter) count++;
    if (responsesFilter) count++;
    if (activityStatusFilter) count++;
    if (minEditsFilter) count++;
    if (enteredTimeFilter) count++;
    return count;
  }, [
    districtFilter, blockFilter, groupFormedFilter, enteredByFilter,
    schoolTypeFilter, schoolCategoryFilter, groupLinkFilter, minMembersFilter,
    lastMessageFilter, lastMessageDateFilter, responsesFilter, activityStatusFilter,
    minEditsFilter, enteredTimeFilter
  ]);

  const resetAllFilters = () => {
    setSearch("");
    setDistrictFilter("");
    setBlockFilter("");
    setGroupFormedFilter("");
    setEnteredByFilter("");
    setSchoolTypeFilter("");
    setSchoolCategoryFilter("");
    setGroupLinkFilter("");
    setMinMembersFilter("");
    setLastMessageFilter("");
    setLastMessageDateFilter("");
    setResponsesFilter("");
    setActivityStatusFilter("");
    setMinEditsFilter("");
    setEnteredTimeFilter("");
  };

  const totalMembers = filteredData.reduce((sum, d) => sum + (d.member_count || 0), 0);
  const formedGroupsCount = filteredData.filter((d) => d.group_formed === "Yes").length;

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
          <p className="text-slate-500 mt-1 text-sm">Monitor invite links, message updates, group size, responses to messages, and active history in WhatsApp groups.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: "Groups Formed",
              value: `${formedGroupsCount} / ${filteredData.length}`,
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
              label: "Average Group Size",
              value: filteredData.length > 0 ? Math.round(totalMembers / filteredData.length) + " members" : "0",
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

        {/* Search and Filters Section */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-5">
          {/* Search Bar */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm">
            <Search size={18} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by school, last message or responses..."
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
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm min-w-[150px] relative">
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setBlockFilter("");
              }}
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none cursor-pointer appearance-none pr-8 font-medium"
            >
              <option value="">All Districts</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1">
              {districtFilter && (
                <button type="button" onClick={(e) => { e.stopPropagation(); setDistrictFilter(""); setBlockFilter(""); }} className="text-slate-400 hover:text-slate-600 pointer-events-auto"><X size={14} /></button>
              )}
              <ChevronDown size={15} className="text-slate-400" />
            </div>
          </div>

          {/* Block Filter */}
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm min-w-[150px] relative">
            <select
              value={blockFilter}
              onChange={(e) => setBlockFilter(e.target.value)}
              disabled={!districtFilter}
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none cursor-pointer disabled:opacity-50 appearance-none pr-8 font-medium"
            >
              <option value="">{districtFilter ? "All Blocks" : "Select District First"}</option>
              {districtFilter &&
                DISTRICT_BLOCKS[districtFilter]?.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1">
              {blockFilter && (
                <button type="button" onClick={(e) => { e.stopPropagation(); setBlockFilter(""); }} className="text-slate-400 hover:text-slate-600 pointer-events-auto"><X size={14} /></button>
              )}
              <ChevronDown size={15} className="text-slate-400" />
            </div>
          </div>

          {/* Group Formed Filter */}
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm min-w-[160px] relative">
            <select
              value={groupFormedFilter}
              onChange={(e) => setGroupFormedFilter(e.target.value)}
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none cursor-pointer appearance-none pr-8 font-medium"
            >
              <option value="">Group Formed?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1">
              {groupFormedFilter && (
                <button type="button" onClick={(e) => { e.stopPropagation(); setGroupFormedFilter(""); }} className="text-slate-400 hover:text-slate-600 pointer-events-auto"><X size={14} /></button>
              )}
              <ChevronDown size={15} className="text-slate-400" />
            </div>
          </div>

          {/* Toggle Advanced Filters Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center justify-center gap-2 h-14 px-6 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
              showAdvancedFilters || activeFiltersCount > 0
                ? "bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Reset Button */}
          {(search || activeFiltersCount > 0) && (
            <button
              onClick={resetAllFilters}
              className="flex items-center justify-center gap-1.5 h-14 px-6 rounded-2xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-semibold transition-all cursor-pointer"
            >
              <X size={16} />
              Reset All
            </button>
          )}
        </div>

        {/* Collapsible Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 animate-slide-down">
            {/* School Type */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">School Type</label>
              <div className="relative">
                <select
                  value={schoolTypeFilter}
                  onChange={(e) => setSchoolTypeFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All Types</option>
                  {["Primary School", "Middle School", "High School", "High Sec School"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* School Category */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Category</label>
              <div className="relative">
                <select
                  value={schoolCategoryFilter}
                  onChange={(e) => setSchoolCategoryFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {["Career Guidance", "Centinary School", "Vetri Palligal School"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Group Link */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Group Link</label>
              <input
                type="text"
                placeholder="Search link..."
                value={groupLinkFilter}
                onChange={(e) => setGroupLinkFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none"
              />
            </div>

            {/* Min Members */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Min Members</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 50"
                value={minMembersFilter}
                onChange={(e) => setMinMembersFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none"
              />
            </div>

            {/* Last Shared Message */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Last Message Content</label>
              <input
                type="text"
                placeholder="Search message text..."
                value={lastMessageFilter}
                onChange={(e) => setLastMessageFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none"
              />
            </div>

            {/* Last Shared Message Date */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Last Message Date</label>
              <input
                type="date"
                value={lastMessageDateFilter}
                onChange={(e) => setLastMessageDateFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-700 outline-none cursor-pointer"
              />
            </div>

            {/* Responses */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Responses Content</label>
              <input
                type="text"
                placeholder="Search responses..."
                value={responsesFilter}
                onChange={(e) => setResponsesFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none"
              />
            </div>

            {/* Activity Status */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Activity Status</label>
              <div className="relative">
                <select
                  value={activityStatusFilter}
                  onChange={(e) => setActivityStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  {["Low", "Medium", "High"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Min Edits */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Min Edits</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 1"
                value={minEditsFilter}
                onChange={(e) => setMinEditsFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none"
              />
            </div>

            {/* Entered By */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Entered By</label>
              <div className="relative">
                <select
                  value={enteredByFilter}
                  onChange={(e) => setEnteredByFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All Entered By</option>
                  {enteredByOptions.map(({ name, count }) => (
                    <option key={name} value={name}>{`${name} (${count})`}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Entered Time */}
            <div className="flex flex-col col-span-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Entered Time / Date</label>
              <input
                type="text"
                placeholder="Search entered time (e.g. PM, 2026)..."
                value={enteredTimeFilter}
                onChange={(e) => setEnteredTimeFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none"
              />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  {[
                    "Sl No", "District", "Block", "School Name", "School Type", 
                    "School Category", "Group Formed", "WhatsApp Group Link", "Members Count", 
                    "Last Shared Message", "Last Shared Message Date", "Responses of Last Msg", 
                    "Activity Status", "Edits", "Entered By", "Action"
                  ].map((h) => (
                    <th key={h} className="px-4 py-4 text-left font-semibold text-xs tracking-wider uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={16} className="px-5 py-16 text-center text-slate-400 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading records from server...
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={16} className="px-5 py-16 text-center text-slate-400 text-sm">
                      No WhatsApp group records found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-4 text-slate-400 font-medium">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-4 py-4 font-medium text-slate-700 whitespace-nowrap">{item.district}</td>
                      <td className="px-4 py-4 font-medium text-slate-700 whitespace-nowrap">{item.block}</td>
                      <td className="px-4 py-4 font-semibold text-slate-900 min-w-[170px]">{item.school_name}</td>
                      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{item.school_type}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {item.school_category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.group_formed === "Yes" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}>
                          {item.group_formed === "Yes" ? <CheckCircle size={11} /> : <XCircle size={11} />}
                          {item.group_formed}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
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
                      <td className="px-4 py-4">
                        <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-xs font-bold">
                          {item.member_count}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-700 max-w-[180px] truncate" title={item.last_shared_message}>
                        {item.last_shared_message || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-4 text-slate-500 whitespace-nowrap font-medium">{item.last_shared_message_date}</td>
                      <td className="px-4 py-4 text-slate-600 max-w-[180px] truncate" title={item.last_msg_responses}>
                        {item.last_msg_responses || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.activity_status === "High"
                            ? "bg-emerald-50 text-emerald-700"
                            : item.activity_status === "Medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}>
                          {item.activity_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {item.changes_count > 0 ? (
                          <span className="inline-flex items-center gap-0.5 bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md text-xs font-bold border border-purple-200">
                            <Clock size={11} /> {item.changes_count}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 text-xs">{item.entered_by || 'Unknown'}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{item.entered_time || '—'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewItem(item)}
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          {currentUser?.role !== 'employee' && (
                            <>
                              <button
                                onClick={() => openEdit(item)}
                                className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                                title="Edit Message/Details"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(item.id)}
                                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 size={14} />
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
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="bg-slate-900 px-7 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">{editId ? "Edit" : "Register"} WhatsApp Group</h2>
                <p className="text-slate-400 text-xs mt-0.5">Manage community chat metrics & last message updates</p>
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
                    disabled={!formData.district}
                    className={inputCls(!!errors.block)}
                  >
                    <option value="">{formData.district ? "Select Block" : "Select District First"}</option>
                    {(DISTRICT_BLOCKS[formData.district] || []).map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </Field>

                <div className="col-span-2">
                  <Field label="School Name *" error={errors.school_name}>
                    <input
                      type="text"
                      placeholder="e.g. Govt Hr Sec School, Madurai"
                      value={formData.school_name}
                      onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                      className={inputCls(!!errors.school_name)}
                    />
                  </Field>
                </div>

                <Field label="School Type *" error={errors.school_type}>
                  <select
                    value={formData.school_type}
                    onChange={(e) => setFormData({ ...formData, school_type: e.target.value })}
                    className={inputCls(!!errors.school_type)}
                  >
                    {["Primary School", "Middle School", "High School", "High Sec School"].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                <Field label="School Category *" error={errors.school_category}>
                  <select
                    value={formData.school_category}
                    onChange={(e) => setFormData({ ...formData, school_category: e.target.value })}
                    className={inputCls(!!errors.school_category)}
                  >
                    {["Career Guidance", "Centinary School", "Vetri Palligal School"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Group Formed *" error={errors.group_formed}>
                  <select
                    value={formData.group_formed}
                    onChange={(e) => setFormData({ ...formData, group_formed: e.target.value })}
                    className={inputCls(!!errors.group_formed)}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
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

                <Field label="Members Count *" error={errors.member_count}>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 245"
                    value={formData.member_count}
                    onChange={(e) => setFormData({ ...formData, member_count: e.target.value })}
                    className={inputCls(!!errors.member_count)}
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

                <div className="col-span-2 border-t border-slate-100 pt-4 mt-2">
                  <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3">Last Shared Message Settings (Edits tracked)</h3>
                </div>

                <div className="col-span-2">
                  <Field label="Last Shared Message *" error={errors.last_shared_message}>
                    <input
                      type="text"
                      placeholder="What was the last announcement message sent?"
                      value={formData.last_shared_message}
                      onChange={(e) => setFormData({ ...formData, last_shared_message: e.target.value })}
                      className={inputCls(!!errors.last_shared_message)}
                    />
                  </Field>
                </div>

                <Field label="Last Shared Message Date *" error={errors.last_shared_message_date}>
                  <input
                    type="date"
                    value={formData.last_shared_message_date}
                    onChange={(e) => setFormData({ ...formData, last_shared_message_date: e.target.value })}
                    className={inputCls(!!errors.last_shared_message_date)}
                  />
                </Field>

                <div className="col-span-2">
                  <Field label="Responses of Last Message *" error={errors.last_msg_responses}>
                    <textarea
                      placeholder="e.g. 5 alumni offered tutoring help, 12 liked."
                      value={formData.last_msg_responses}
                      onChange={(e) => setFormData({ ...formData, last_msg_responses: e.target.value })}
                      rows={2}
                      className={inputCls(!!errors.last_msg_responses) + " resize-none"}
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
                {editId ? "Update & Save" : "Register Group"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Group Details</h2>
              <button onClick={() => setViewItem(null)} className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center">
                <X size={15} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              {[
                ["School Name", viewItem.school_name],
                ["District", viewItem.district || "—"],
                ["Block", viewItem.block || "—"],
                ["School Type", viewItem.school_type || "—"],
                ["School Category", viewItem.school_category || "—"],
                ["Group Formed", viewItem.group_formed || "—"],
                ["Group Link", viewItem.group_link],
                ["Member Count", `${viewItem.member_count} members`],
                ["Last Shared Message", viewItem.last_shared_message || "—"],
                ["Last Shared Message Date", viewItem.last_shared_message_date || "—"],
                ["Responses of Last Message", viewItem.last_msg_responses || "—"],
                ["Activity Status", viewItem.activity_status],
                ["Total Updates Count", `${viewItem.changes_count || 0} edits`],
                ["Entered By", viewItem.entered_by || "Unknown"],
                ["Entered Time", viewItem.entered_time || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-4 border-b border-slate-50 pb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-40 flex-shrink-0">{label}</span>
                  <span className="text-sm text-slate-700 font-medium text-right break-all">{value}</span>
                </div>
              ))}

              {/* History Log */}
              {viewItem.history && viewItem.history.length > 0 && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 uppercase tracking-wide">
                    <History size={14} />
                    <span>Message Change History Logs ({viewItem.history.length})</span>
                  </div>
                  <div className="space-y-3 mt-2">
                    {viewItem.history.map((h, idx) => (
                      <div key={idx} className="border border-slate-100 rounded-xl p-3 bg-slate-50 relative">
                        <span className="absolute top-2.5 right-3 text-[10px] font-semibold text-slate-400">
                          {h.edited_time}
                        </span>
                        <div className="text-xs font-bold text-slate-500 mb-1">
                          Date: <span className="font-semibold text-slate-700">{h.date}</span>
                        </div>
                        <div className="text-xs text-slate-600 leading-relaxed font-medium">
                          "{h.message}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <a
                href={viewItem.group_link}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors text-center inline-flex items-center justify-center gap-1.5"
              >
                <Link2 size={15} /> Join WhatsApp
              </a>
              <button
                onClick={() => setViewItem(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
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
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-7 text-center animate-zoom-in">
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