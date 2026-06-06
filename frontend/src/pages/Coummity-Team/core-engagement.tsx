import { useState, useEffect, useMemo } from "react";
import { 
  Search, Plus, Eye, Pencil, Trash2, X, Users, CheckCircle, 
  Upload, Image as ImageIcon, ChevronDown, DollarSign, FileText, Video 
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
    if (str.includes(',')) {
      return str.split(',').map((name: string) => ({
        name: name.trim(),
        type: 'file',
        content: name.trim()
      }));
    }
    return [{
      name: str.trim(),
      type: 'file',
      content: str.trim()
    }];
  }
};

const mapToFrontend = (item: any): CoreEngagementRecord => ({
  id: item.id,
  district: item.district || "",
  block: item.block || "",
  school_name: item.school_name || "",
  school_type: item.school_type || "Primary School",
  school_category: item.school_category || "Career Guidance",
  engagement_type: item.engagement_type || "SMC Meeting",
  other_engagement_type: item.other_engagement_type || "",
  alumni_count: item.alumni_count || 0,
  amount_collected: item.amount_collected || 0,
  proof_files: safeParseJSON(item.proof_files, []),
  important_attendees: item.important_attendees || "",
  remarks: item.remarks || "",
  entered_by: item.entered_by || "Unknown",
  entered_time: item.entered_time || "",
});

type ProofFile = {
  name: string;
  type: string;
  content: string; // base64 string
};

type CoreEngagementRecord = {
  id: number;
  district: string;
  block: string;
  school_name: string;
  school_type: string; // "Primary School", "Middle School", "High School", "High Sec School"
  school_category: string; // "Career Guidance", "Centinary School", "Vetri Palligal School"
  engagement_type: string; // SMC Meeting, Alumni Meet, Guest Lecture, Donation Drive, Others
  other_engagement_type?: string;
  alumni_count: number;
  amount_collected: number;
  proof_files: ProofFile[];
  important_attendees: string;
  remarks: string;
  entered_by?: string;
  entered_time?: string;
};

type FormData = {
  district: string;
  block: string;
  school_name: string;
  school_type: string;
  school_category: string;
  engagement_type: string;
  other_engagement_type: string;
  alumni_count: string;
  amount_collected: string;
  proof_files: ProofFile[];
  important_attendees: string;
  remarks: string;
};

const EMPTY_FORM: FormData = {
  district: "",
  block: "",
  school_name: "",
  school_type: "Primary School",
  school_category: "Career Guidance",
  engagement_type: "SMC Meeting",
  other_engagement_type: "",
  alumni_count: "",
  amount_collected: "",
  proof_files: [],
  important_attendees: "",
  remarks: "",
};

const ENGAGEMENT_TYPES = [
  "SMC Meeting",
  "Alumni Meet",
  "Career Guidance Session",
  "Donation Drive",
  "Infrastructure Support",
  "Academic Mentoring",
  "Others"
];

export default function CoreEngagement() {
  const [search, setSearch] = useState("");
  const [enteredByFilter, setEnteredByFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [engagementTypeFilter, setEngagementTypeFilter] = useState("");

  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [schoolTypeFilter, setSchoolTypeFilter] = useState("");
  const [schoolCategoryFilter, setSchoolCategoryFilter] = useState("");
  const [minAlumniFilter, setMinAlumniFilter] = useState("");
  const [minAmountFilter, setMinAmountFilter] = useState("");
  const [proofFilter, setProofFilter] = useState(""); // "" | "Yes" | "No"
  const [importantAttendeesFilter, setImportantAttendeesFilter] = useState("");
  const [remarksFilter, setRemarksFilter] = useState("");
  const [enteredTimeFilter, setEnteredTimeFilter] = useState("");

  const [data, setData] = useState<CoreEngagementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get('/core-engagements');
      const items = res.data;
      if (Array.isArray(items)) {
        setData(items.map(mapToFrontend));
      }
    } catch (err) {
      console.error("FAILED TO FETCH CORE ENGAGEMENTS:", err);
      // Fallback to localStorage if offline
      const saved = localStorage.getItem('core_engagements');
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

  useEffect(() => {
    localStorage.setItem('core_engagements', JSON.stringify(data));
  }, [data]);

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [editId, setEditId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<CoreEngagementRecord | null>(null);

  const enteredByOptions = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(item => {
      if (item.entered_by) {
        map.set(item.entered_by, (map.get(item.entered_by) ?? 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [data]);

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!formData.district) e.district = "District is required";
    if (!formData.block) e.block = "Block is required";
    if (!formData.school_name.trim()) e.school_name = "School name is required";
    if (!formData.school_type) e.school_type = "School type is required";
    if (!formData.school_category) e.school_category = "School category is required";
    if (!formData.engagement_type) e.engagement_type = "Engagement type is required";
    if (formData.engagement_type === "Others" && !formData.other_engagement_type.trim()) {
      e.other_engagement_type = "Please specify other engagement type";
    }
    if (formData.alumni_count === "") {
      e.alumni_count = "Number of alumni is required";
    } else if (isNaN(Number(formData.alumni_count)) || Number(formData.alumni_count) < 0) {
      e.alumni_count = "Must be a valid positive number";
    }
    if (formData.amount_collected === "") {
      e.amount_collected = "Amount collected is required";
    } else if (isNaN(Number(formData.amount_collected)) || Number(formData.amount_collected) < 0) {
      e.amount_collected = "Must be a valid positive number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleMultipleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFilesPromise = Array.from(files).map((file) => {
        return new Promise<ProofFile>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              type: file.type,
              content: reader.result as string,
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newFilesPromise).then((uploadedFiles) => {
        setFormData((prev) => ({
          ...prev,
          proof_files: [...prev.proof_files, ...uploadedFiles],
        }));
      });
    }
  };

  const removeProofFile = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      proof_files: prev.proof_files.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (item: CoreEngagementRecord) => {
    setFormData({
      district: item.district || "",
      block: item.block || "",
      school_name: item.school_name || "",
      school_type: item.school_type || "Primary School",
      school_category: item.school_category || "Career Guidance",
      engagement_type: item.engagement_type || "SMC Meeting",
      other_engagement_type: item.other_engagement_type || "",
      alumni_count: String(item.alumni_count),
      amount_collected: String(item.amount_collected),
      proof_files: item.proof_files || [],
      important_attendees: item.important_attendees || "",
      remarks: item.remarks || "",
    });
    setErrors({});
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const payload = {
        district: formData.district,
        block: formData.block,
        school_name: formData.school_name,
        school_type: formData.school_type,
        school_category: formData.school_category,
        engagement_type: formData.engagement_type,
        other_engagement_type: formData.engagement_type === "Others" ? formData.other_engagement_type : "",
        alumni_count: Number(formData.alumni_count),
        amount_collected: Number(formData.amount_collected),
        proof_files: JSON.stringify(formData.proof_files || []),
        important_attendees: formData.important_attendees,
        remarks: formData.remarks,
      };

      if (editId !== null) {
        // Find existing record to preserve entered_by / entered_time if any
        const item = data.find((d) => d.id === editId);
        const fullPayload = {
          ...payload,
          entered_by: item?.entered_by || currentUser?.name || 'Unknown',
          entered_time: item?.entered_time || new Date().toLocaleString(),
        };
        await api.put(`/core-engagements/${editId}`, fullPayload);
      } else {
        const fullPayload = {
          ...payload,
          entered_by: currentUser?.name || 'Unknown',
          entered_time: new Date().toLocaleString(),
        };
        await api.post('/core-engagements', fullPayload);
      }
      setShowModal(false);
      fetchRecords();
    } catch (err) {
      console.error("FAILED TO SAVE CORE ENGAGEMENT:", err);
      alert("Failed to save core engagement record.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/core-engagements/${id}`);
      setDeleteConfirm(null);
      fetchRecords();
    } catch (err) {
      console.error("FAILED TO DELETE CORE ENGAGEMENT:", err);
      alert("Failed to delete core engagement record.");
    }
  };

  const filteredData = data.filter((item) => {
    // 1. Search (general search by school_name, remarks, important_attendees)
    if (search) {
      const q = search.toLowerCase();
      const matchSchool = item.school_name?.toLowerCase().includes(q);
      const matchRemarks = item.remarks?.toLowerCase().includes(q);
      const matchAttendees = item.important_attendees?.toLowerCase().includes(q);
      if (!matchSchool && !matchRemarks && !matchAttendees) return false;
    }

    // 2. District Filter
    if (districtFilter && item.district !== districtFilter) return false;

    // 3. Block Filter
    if (blockFilter && item.block !== blockFilter) return false;

    // 4. Engagement Type Filter
    if (engagementTypeFilter && item.engagement_type !== engagementTypeFilter) return false;

    // 5. Entered By Filter
    if (enteredByFilter && item.entered_by !== enteredByFilter) return false;

    // 6. School Type Filter
    if (schoolTypeFilter && item.school_type !== schoolTypeFilter) return false;

    // 7. School Category Filter
    if (schoolCategoryFilter && item.school_category !== schoolCategoryFilter) return false;

    // 8. Min Alumni Engaged
    if (minAlumniFilter && (item.alumni_count || 0) < Number(minAlumniFilter)) return false;

    // 9. Min Amount Collected
    if (minAmountFilter && (item.amount_collected || 0) < Number(minAmountFilter)) return false;

    // 10. Proof Filter
    if (proofFilter) {
      const hasProofs = item.proof_files && item.proof_files.length > 0;
      if (proofFilter === "Yes" && !hasProofs) return false;
      if (proofFilter === "No" && hasProofs) return false;
    }

    // 11. Important Attendees Filter
    if (importantAttendeesFilter && !item.important_attendees?.toLowerCase().includes(importantAttendeesFilter.toLowerCase())) return false;

    // 12. Remarks Filter
    if (remarksFilter && !item.remarks?.toLowerCase().includes(remarksFilter.toLowerCase())) return false;

    // 13. Entered Time Filter
    if (enteredTimeFilter && !item.entered_time?.toLowerCase().includes(enteredTimeFilter.toLowerCase())) return false;

    return true;
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (districtFilter) count++;
    if (blockFilter) count++;
    if (engagementTypeFilter) count++;
    if (enteredByFilter) count++;
    if (schoolTypeFilter) count++;
    if (schoolCategoryFilter) count++;
    if (minAlumniFilter) count++;
    if (minAmountFilter) count++;
    if (proofFilter) count++;
    if (importantAttendeesFilter) count++;
    if (remarksFilter) count++;
    if (enteredTimeFilter) count++;
    return count;
  }, [
    districtFilter, blockFilter, engagementTypeFilter, enteredByFilter,
    schoolTypeFilter, schoolCategoryFilter, minAlumniFilter, minAmountFilter,
    proofFilter, importantAttendeesFilter, remarksFilter, enteredTimeFilter
  ]);

  const resetAllFilters = () => {
    setSearch("");
    setDistrictFilter("");
    setBlockFilter("");
    setEngagementTypeFilter("");
    setEnteredByFilter("");
    setSchoolTypeFilter("");
    setSchoolCategoryFilter("");
    setMinAlumniFilter("");
    setMinAmountFilter("");
    setProofFilter("");
    setImportantAttendeesFilter("");
    setRemarksFilter("");
    setEnteredTimeFilter("");
  };

  const totalAlumniEngaged = filteredData.reduce((sum, item) => sum + (item.alumni_count || 0), 0);
  const totalAmountCollected = filteredData.reduce((sum, item) => sum + (item.amount_collected || 0), 0);

  const renderFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon size={14} className="text-blue-500" />;
    if (fileType.startsWith("video/")) return <Video size={14} className="text-purple-500" />;
    if (fileType === "application/pdf" || fileType.includes("pdf")) return <FileText size={14} className="text-red-500" />;
    return <FileText size={14} className="text-slate-500" />;
  };

  const openFileInNewWindow = (file: ProofFile) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe src="${file.content}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
    }
  };

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
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-emerald-200"
        >
          <Plus size={16} />
          Add Engagement
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Alumni Core Engagement</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage and track school-level alumni core engagement activities, contributions, and upload verification files.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: "Total Engagements",
              value: filteredData.length,
              icon: <Users size={20} className="text-blue-600" />,
              bg: "bg-blue-50",
              accent: "text-blue-600",
            },
            {
              label: "Total Alumni Engaged",
              value: totalAlumniEngaged.toLocaleString(),
              icon: <CheckCircle size={20} className="text-emerald-600" />,
              bg: "bg-emerald-50",
              accent: "text-emerald-600",
            },
            {
              label: "Total Amount Collected",
              value: `₹ ${totalAmountCollected.toLocaleString()}`,
              icon: <DollarSign size={20} className="text-amber-600" />,
              bg: "bg-amber-50",
              accent: "text-amber-600",
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
              placeholder="Search by school, remarks or important attendees..."
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
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm min-w-[170px] relative">
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
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-3 shadow-sm min-w-[170px] relative">
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

            {/* Type of Engagement */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Engagement Type</label>
              <div className="relative">
                <select
                  value={engagementTypeFilter}
                  onChange={(e) => setEngagementTypeFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All Engagements</option>
                  {ENGAGEMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
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

            {/* Min Alumni Engaged */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Min Alumni Engaged</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 5"
                value={minAlumniFilter}
                onChange={(e) => setMinAlumniFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-300"
              />
            </div>

            {/* Min Amount Collected */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Min Amount Collected</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 1000"
                value={minAmountFilter}
                onChange={(e) => setMinAmountFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-300"
              />
            </div>

            {/* Has Proof Uploaded */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Proof Uploaded</label>
              <div className="relative">
                <select
                  value={proofFilter}
                  onChange={(e) => setProofFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Important Attendees Search */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Important Attendees</label>
              <input
                type="text"
                placeholder="Search attendees..."
                value={importantAttendeesFilter}
                onChange={(e) => setImportantAttendeesFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-300"
              />
            </div>

            {/* Remarks Search */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Remarks Search</label>
              <input
                type="text"
                placeholder="Search remarks..."
                value={remarksFilter}
                onChange={(e) => setRemarksFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-300"
              />
            </div>

            {/* Entered Time Search */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Entered Time / Date</label>
              <input
                type="text"
                placeholder="e.g. 2026-06-01"
                value={enteredTimeFilter}
                onChange={(e) => setEnteredTimeFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-300"
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
                    "S No", "District", "Block", "School Name", "School Type", 
                    "School Category", "Type of Engagement", "Alumni Engaged", 
                    "Amount Collected (₹)", "Proof", "Important Attendies", "Remarks", 
                    "Entered By", "Action"
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
                    <td colSpan={14} className="px-5 py-16 text-center text-slate-400 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        Loading records from server...
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-5 py-16 text-center text-slate-400 text-sm">
                      No core engagement records found.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-4 text-slate-400 font-medium">{String(index + 1).padStart(2, "0")}</td>
                      <td className="px-4 py-4 font-medium text-slate-700 whitespace-nowrap">{item.district}</td>
                      <td className="px-4 py-4 font-medium text-slate-700 whitespace-nowrap">{item.block}</td>
                      <td className="px-4 py-4 font-semibold text-slate-900 min-w-[180px]">{item.school_name}</td>
                      <td className="px-4 py-4 text-slate-600 whitespace-nowrap">{item.school_type}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {item.school_category}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-medium">
                        {item.engagement_type === "Others" ? (
                          <span className="text-slate-700 italic">
                            Others: {item.other_engagement_type || "N/A"}
                          </span>
                        ) : (
                          <span className="text-emerald-700">{item.engagement_type}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-800 text-center">{item.alumni_count}</td>
                      <td className="px-4 py-4 font-semibold text-slate-800 text-right">
                        {item.amount_collected > 0 ? `₹ ${item.amount_collected.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-4 py-4">
                        {item.proof_files && item.proof_files.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 max-w-[80px]">
                            {item.proof_files.map((file, idx) => (
                              <button
                                key={idx}
                                onClick={() => openFileInNewWindow(file)}
                                className="w-6 h-6 rounded bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
                                title={file.name}
                              >
                                {renderFileIcon(file.type)}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">No Proof</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate-600 max-w-[150px] truncate" title={item.important_attendees}>
                        {item.important_attendees || <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-4 py-4 text-slate-600 max-w-[150px] truncate" title={item.remarks}>
                        {item.remarks || <span className="text-slate-300">—</span>}
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
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          {currentUser?.role !== 'employee' && (
                            <>
                              <button
                                onClick={() => openEdit(item)}
                                className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors"
                                title="Edit"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(item.id)}
                                className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                                title="Delete"
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
                <h2 className="text-white font-bold text-lg">{editId ? "Edit" : "Add"} Core Engagement</h2>
                <p className="text-slate-400 text-xs mt-0.5">Define school alumni core engagement metrics</p>
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

                <Field label="Type of Engagement *" error={errors.engagement_type}>
                  <select
                    value={formData.engagement_type}
                    onChange={(e) => setFormData({ ...formData, engagement_type: e.target.value })}
                    className={inputCls(!!errors.engagement_type)}
                  >
                    {ENGAGEMENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                {formData.engagement_type === "Others" ? (
                  <Field label="Specify Engagement Type *" error={errors.other_engagement_type}>
                    <input
                      type="text"
                      placeholder="e.g. Science Exhibition Sponsor"
                      value={formData.other_engagement_type}
                      onChange={(e) => setFormData({ ...formData, other_engagement_type: e.target.value })}
                      className={inputCls(!!errors.other_engagement_type)}
                    />
                  </Field>
                ) : (
                  <div />
                )}

                <Field label="Number of Alumni Engaged *" error={errors.alumni_count}>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 15"
                    value={formData.alumni_count}
                    onChange={(e) => setFormData({ ...formData, alumni_count: e.target.value })}
                    className={inputCls(!!errors.alumni_count)}
                  />
                </Field>

                <Field label="Total Amount Collected (₹) *" error={errors.amount_collected}>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5000"
                    value={formData.amount_collected}
                    onChange={(e) => setFormData({ ...formData, amount_collected: e.target.value })}
                    className={inputCls(!!errors.amount_collected)}
                  />
                </Field>

                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Upload Proof (Multiple Photos, Videos, or PDFs)
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-5 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-colors">
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-slate-600">Click to upload files</span>
                    <span className="text-xs text-slate-400 mt-1">Images, Videos or PDFs</span>
                    <input
                      type="file"
                      accept="image/*,video/*,application/pdf"
                      multiple
                      className="hidden"
                      onChange={handleMultipleFilesUpload}
                    />
                  </label>

                  {formData.proof_files.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {formData.proof_files.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between border border-slate-200 rounded-xl p-2.5 bg-slate-50">
                          <div className="flex items-center gap-2 min-w-0">
                            {renderFileIcon(file.type)}
                            <span className="text-xs text-slate-600 truncate font-medium max-w-[180px]">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProofFile(idx)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <Field label="Important Attendies">
                    <textarea
                      placeholder="e.g. Chief Guest Name, HM, SMC members..."
                      value={formData.important_attendees}
                      onChange={(e) => setFormData({ ...formData, important_attendees: e.target.value })}
                      rows={2}
                      className={inputCls(false) + " resize-none"}
                    />
                  </Field>
                </div>

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
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-zoom-in">
            <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Engagement Details</h2>
              <button onClick={() => setViewItem(null)} className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center">
                <X size={15} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              {[
                ["School Name", viewItem.school_name],
                ["District", viewItem.district],
                ["Block", viewItem.block],
                ["School Type", viewItem.school_type],
                ["School Category", viewItem.school_category],
                [
                  "Type of Engagement", 
                  viewItem.engagement_type === "Others" 
                    ? `Others: ${viewItem.other_engagement_type || "N/A"}` 
                    : viewItem.engagement_type
                ],
                ["Alumni Count", viewItem.alumni_count],
                ["Amount Collected", `₹ ${viewItem.amount_collected.toLocaleString()}`],
                ["Important Attendies", viewItem.important_attendees || "—"],
                ["Remarks", viewItem.remarks || "—"],
                ["Entered By", viewItem.entered_by || "Unknown"],
                ["Entered Time", viewItem.entered_time || "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-start gap-4 border-b border-slate-50 pb-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide w-40 flex-shrink-0">{label}</span>
                  <span className="text-sm text-slate-700 font-medium text-right break-words">{value}</span>
                </div>
              ))}

              {viewItem.proof_files && viewItem.proof_files.length > 0 && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Uploaded Proofs ({viewItem.proof_files.length})</span>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {viewItem.proof_files.map((file, idx) => (
                      <div key={idx} className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        {file.type.startsWith("image/") ? (
                          <img src={file.content} alt={file.name} className="w-full h-24 object-cover border-b" />
                        ) : (
                          <div className="w-full h-24 flex items-center justify-center bg-slate-100 border-b">
                            {renderFileIcon(file.type)}
                          </div>
                        )}
                        <button
                          onClick={() => openFileInNewWindow(file)}
                          className="px-3 py-1.5 text-xs text-blue-600 hover:text-blue-700 text-center font-medium bg-white hover:bg-slate-50 transition-colors w-full truncate border-t"
                          title={file.name}
                        >
                          View / Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={() => setViewItem(null)}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
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