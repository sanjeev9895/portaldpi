import { useState, useEffect, useMemo } from "react";
import {
  Search, Plus, Eye, Pencil, Trash2, X, Users, School,
  CheckCircle, XCircle, Upload,ChevronDown, FileText, Video, Image as ImageIcon
} from "lucide-react";
import { DISTRICTS, DISTRICT_BLOCKS } from "../../utils/districtData";
import BackButton from "../../components/BackButton";

type ProofFile = {
  name: string;
  type: string;
  content: string; // base64 string
};

type SchoolCommunityRecord = {
  id: number;
  district: string;
  block: string;
  school_name: string;
  school_type: string;
  school_category: string;
  hm_supportive: string;
  smc_alumni_count: number;
  ambassador_alumni_count: number;
  approach_taken: string;
  period_started: string;
  period_ended: string;
  mobilized_count: number;
  mobilized_status: string; // Yes if count > 500, else No
  alumni_group_platforms: string[]; // WhatsApp, Facebook, Telegram, Vizhuthugal App, Others
  other_platform?: string;
  platform_link: string;
  risk_challenge: string;
  mitigation_taken: string;
  take_back: string;
  proof_files: ProofFile[];
  media_content: string;
  celebrated_status: string;
  entered_by?: string;
  entered_time?: string;
};

type FormData = {
  district: string;
  block: string;
  school_name: string;
  school_type: string;
  school_category: string;
  hm_supportive: string;
  smc_alumni_count: string;
  ambassador_alumni_count: string;
  approach_taken: string;
  period_started: string;
  period_ended: string;
  mobilized_count: string;
  alumni_group_platforms: string[];
  other_platform: string;
  platform_link: string;
  risk_challenge: string;
  mitigation_taken: string;
  take_back: string;
  proof_files: ProofFile[];
  media_content: string;
  celebrated_status: string;
};

const EMPTY_FORM: FormData = {
  district: "",
  block: "",
  school_name: "",
  school_type: "Primary School",
  school_category: "Career Guidance",
  hm_supportive: "No",
  smc_alumni_count: "",
  ambassador_alumni_count: "",
  approach_taken: "SHG Members - SMC",
  period_started: "",
  period_ended: "",
  mobilized_count: "",
  alumni_group_platforms: [],
  other_platform: "",
  platform_link: "",
  risk_challenge: "",
  mitigation_taken: "",
  take_back: "",
  proof_files: [],
  media_content: "",
  celebrated_status: "No",
};

export default function SchoolCommunity() {
  const [search, setSearch] = useState("");
  const [enteredByFilter, setEnteredByFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // New Filters
  const [schoolTypeFilter, setSchoolTypeFilter] = useState("");
  const [schoolCategoryFilter, setSchoolCategoryFilter] = useState("");
  const [hmSupportiveFilter, setHmSupportiveFilter] = useState("");
  const [celebratedStatusFilter, setCelebratedStatusFilter] = useState("");
  const [mobilizedStatusFilter, setMobilizedStatusFilter] = useState("");
  const [approachTakenFilter, setApproachTakenFilter] = useState("");
  const [minSMCAlumniFilter, setMinSMCAlumniFilter] = useState("");
  const [minAmbassadorFilter, setMinAmbassadorFilter] = useState("");
  const [minMobilizedFilter, setMinMobilizedFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [platformLinkFilter, setPlatformLinkFilter] = useState("");
  const [riskChallengeFilter, setRiskChallengeFilter] = useState("");
  const [mitigationTakenFilter, setMitigationTakenFilter] = useState("");
  const [takeBackFilter, setTakeBackFilter] = useState("");
  const [proofFilter, setProofFilter] = useState("");
  const [mediaContentFilter, setMediaContentFilter] = useState("");
  const [enteredTimeFilter, setEnteredTimeFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewItem, setViewItem] = useState<SchoolCommunityRecord | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const [data, setData] = useState<SchoolCommunityRecord[]>(() => {
    const saved = localStorage.getItem("school_communities");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const defaultData: SchoolCommunityRecord[] = [
      {
        id: 1,
        district: "Madurai",
        block: "Madurai East",
        school_name: "Govt Hr Sec School, Madurai",
        school_type: "High Sec School",
        school_category: "Centinary School",
        hm_supportive: "Yes",
        smc_alumni_count: 15,
        ambassador_alumni_count: 5,
        approach_taken: "Key People -HM",
        period_started: "2026-05-01",
        period_ended: "2026-05-15",
        mobilized_count: 650,
        mobilized_status: "Yes",
        alumni_group_platforms: ["WhatsApp", "Telegram"],
        platform_link: "https://chat.whatsapp.com/GHSSAlumni2025",
        risk_challenge: "Coordination with remote alumni",
        mitigation_taken: "Assigned block leaders",
        take_back: "Need regular updates",
        proof_files: [],
        media_content: "Inaugural event photos",
        celebrated_status: "Yes",
        entered_by: "State Admin",
        entered_time: "2026-06-01, 10:00:00 AM",
      },
      {
        id: 2,
        district: "Tiruchirappalli",
        block: "Thiruverumbur",
        school_name: "St. Joseph's Middle School",
        school_type: "Middle School",
        school_category: "Vetri Palligal School",
        hm_supportive: "No",
        smc_alumni_count: 8,
        ambassador_alumni_count: 2,
        approach_taken: "Organized Meet - Hm",
        period_started: "2026-05-10",
        period_ended: "2026-05-20",
        mobilized_count: 420,
        mobilized_status: "No",
        alumni_group_platforms: ["Facebook"],
        platform_link: "https://facebook.com/groups/stjosephalumni",
        risk_challenge: "HM supportive attitude was lacking initially",
        mitigation_taken: "Addressed HM concerns during SMC meet",
        take_back: "Persistence is key",
        proof_files: [],
        media_content: "SMC meeting photos",
        celebrated_status: "No",
        entered_by: "Manager",
        entered_time: "2026-06-02, 11:30:00 AM",
      }
    ];
    localStorage.setItem("school_communities", JSON.stringify(defaultData));
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem("school_communities", JSON.stringify(data));
  }, [data]);

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!formData.district) e.district = "District is required";
    if (!formData.block) e.block = "Block is required";
    if (!formData.school_name.trim()) e.school_name = "School name is required";
    if (!formData.school_type) e.school_type = "School type is required";
    if (!formData.school_category) e.school_category = "School category is required";
    if (!formData.hm_supportive) e.hm_supportive = "HM Supportive status is required";
    if (formData.smc_alumni_count === "") e.smc_alumni_count = "SMC Alumni Count is required";
    if (formData.ambassador_alumni_count === "") e.ambassador_alumni_count = "Ambassador Alumni Count is required";
    if (!formData.approach_taken) e.approach_taken = "Approach taken is required";
    if (!formData.period_started) e.period_started = "Period started is required";
    if (!formData.period_ended) e.period_ended = "Period ended is required";
    if (formData.mobilized_count === "") e.mobilized_count = "Mobilized count is required";
    if (formData.alumni_group_platforms.length === 0) e.alumni_group_platforms = "Select at least one platform" as any;
    if (formData.alumni_group_platforms.includes("Others") && !formData.other_platform.trim()) {
      e.other_platform = "Please specify other platform name";
    }
    if (!formData.celebrated_status) e.celebrated_status = "Celebrated status is required";

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

  const handlePlatformCheckboxChange = (platform: string) => {
    setFormData((prev) => {
      const isChecked = prev.alumni_group_platforms.includes(platform);
      const updatedPlatforms = isChecked
        ? prev.alumni_group_platforms.filter((p) => p !== platform)
        : [...prev.alumni_group_platforms, platform];

      return {
        ...prev,
        alumni_group_platforms: updatedPlatforms,
        other_platform: updatedPlatforms.includes("Others") ? prev.other_platform : "",
      };
    });
  };

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setErrors({});
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (item: SchoolCommunityRecord) => {
    setFormData({
      district: item.district || "",
      block: item.block || "",
      school_name: item.school_name,
      school_type: item.school_type || "Primary School",
      school_category: item.school_category || "Career Guidance",
      hm_supportive: item.hm_supportive || "No",
      smc_alumni_count: String(item.smc_alumni_count),
      ambassador_alumni_count: String(item.ambassador_alumni_count),
      approach_taken: item.approach_taken || "SHG Members - SMC",
      period_started: item.period_started || "",
      period_ended: item.period_ended || "",
      mobilized_count: String(item.mobilized_count),
      alumni_group_platforms: item.alumni_group_platforms || [],
      other_platform: item.other_platform || "",
      platform_link: item.platform_link || "",
      risk_challenge: item.risk_challenge || "",
      mitigation_taken: item.mitigation_taken || "",
      take_back: item.take_back || "",
      proof_files: item.proof_files || [],
      media_content: item.media_content || "",
      celebrated_status: item.celebrated_status || "No",
    });
    setErrors({});
    setEditId(item.id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!validate()) return;
    const calculatedMobilization = Number(formData.mobilized_count) >= 500 ? "Yes" : "No";

    if (editId !== null) {
      setData(
        data.map((item) =>
          item.id === editId
            ? {
                ...item,
                district: formData.district,
                block: formData.block,
                school_name: formData.school_name,
                school_type: formData.school_type,
                school_category: formData.school_category,
                hm_supportive: formData.hm_supportive,
                smc_alumni_count: Number(formData.smc_alumni_count),
                ambassador_alumni_count: Number(formData.ambassador_alumni_count),
                approach_taken: formData.approach_taken,
                period_started: formData.period_started,
                period_ended: formData.period_ended,
                mobilized_count: Number(formData.mobilized_count),
                mobilized_status: calculatedMobilization,
                alumni_group_platforms: formData.alumni_group_platforms,
                other_platform: formData.alumni_group_platforms.includes("Others") ? formData.other_platform : "",
                platform_link: formData.platform_link,
                risk_challenge: formData.risk_challenge,
                mitigation_taken: formData.mitigation_taken,
                take_back: formData.take_back,
                proof_files: formData.proof_files,
                media_content: formData.media_content,
                celebrated_status: formData.celebrated_status,
              }
            : item
        )
      );
    } else {
      setData([
        ...data,
        {
          id: Date.now(),
          district: formData.district,
          block: formData.block,
          school_name: formData.school_name,
          school_type: formData.school_type,
          school_category: formData.school_category,
          hm_supportive: formData.hm_supportive,
          smc_alumni_count: Number(formData.smc_alumni_count),
          ambassador_alumni_count: Number(formData.ambassador_alumni_count),
          approach_taken: formData.approach_taken,
          period_started: formData.period_started,
          period_ended: formData.period_ended,
          mobilized_count: Number(formData.mobilized_count),
          mobilized_status: calculatedMobilization,
          alumni_group_platforms: formData.alumni_group_platforms,
          other_platform: formData.alumni_group_platforms.includes("Others") ? formData.other_platform : "",
          platform_link: formData.platform_link,
          risk_challenge: formData.risk_challenge,
          mitigation_taken: formData.mitigation_taken,
          take_back: formData.take_back,
          proof_files: formData.proof_files,
          media_content: formData.media_content,
          celebrated_status: formData.celebrated_status,
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

  const filteredData = data.filter((item) => {
    // 1. Search (by School Name)
    if (search && !item.school_name.toLowerCase().includes(search.toLowerCase())) return false;

    // 2. District Filter
    if (districtFilter && item.district !== districtFilter) return false;

    // 3. Block Filter
    if (blockFilter && item.block !== blockFilter) return false;

    // 4. Entered By Filter
    if (enteredByFilter && item.entered_by !== enteredByFilter) return false;

    // 5. School Type Filter
    if (schoolTypeFilter && item.school_type !== schoolTypeFilter) return false;

    // 6. School Category Filter
    if (schoolCategoryFilter && item.school_category !== schoolCategoryFilter) return false;

    // 7. HM Supportive Filter
    if (hmSupportiveFilter && item.hm_supportive !== hmSupportiveFilter) return false;

    // 8. Celebrated Status Filter
    if (celebratedStatusFilter && item.celebrated_status !== celebratedStatusFilter) return false;

    // 9. Mobilized Status Filter
    if (mobilizedStatusFilter && item.mobilized_status !== mobilizedStatusFilter) return false;

    // 10. Approach Taken Filter
    if (approachTakenFilter && item.approach_taken !== approachTakenFilter) return false;

    // 11. Min SMC Alumni Count
    if (minSMCAlumniFilter && (item.smc_alumni_count || 0) < Number(minSMCAlumniFilter)) return false;

    // 12. Min Ambassador Alumni Count
    if (minAmbassadorFilter && (item.ambassador_alumni_count || 0) < Number(minAmbassadorFilter)) return false;

    // 13. Min Mobilized Count
    if (minMobilizedFilter && (item.mobilized_count || 0) < Number(minMobilizedFilter)) return false;

    // 14. Period Start Range
    if (startDateFilter && item.period_started && item.period_started < startDateFilter) return false;

    // 15. Period End Range
    if (endDateFilter && item.period_ended && item.period_ended > endDateFilter) return false;

    // 16. Platform Filter
    if (platformFilter && !(item.alumni_group_platforms || []).includes(platformFilter)) return false;

    // 17. Platform Link Filter
    if (platformLinkFilter && !item.platform_link?.toLowerCase().includes(platformLinkFilter.toLowerCase())) return false;

    // 18. Risk & Challenge Filter
    if (riskChallengeFilter && !item.risk_challenge?.toLowerCase().includes(riskChallengeFilter.toLowerCase())) return false;

    // 19. Mitigation Taken Filter
    if (mitigationTakenFilter && !item.mitigation_taken?.toLowerCase().includes(mitigationTakenFilter.toLowerCase())) return false;

    // 20. Take Back Filter
    if (takeBackFilter && !item.take_back?.toLowerCase().includes(takeBackFilter.toLowerCase())) return false;

    // 21. Proof Filter
    if (proofFilter) {
      const hasProofs = item.proof_files && item.proof_files.length > 0;
      if (proofFilter === "Yes" && !hasProofs) return false;
      if (proofFilter === "No" && hasProofs) return false;
    }

    // 22. Media Content Filter
    if (mediaContentFilter && !item.media_content?.toLowerCase().includes(mediaContentFilter.toLowerCase())) return false;

    // 23. Entered Time Filter
    if (enteredTimeFilter && !item.entered_time?.toLowerCase().includes(enteredTimeFilter.toLowerCase())) return false;

    return true;
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (districtFilter) count++;
    if (blockFilter) count++;
    if (enteredByFilter) count++;
    if (schoolTypeFilter) count++;
    if (schoolCategoryFilter) count++;
    if (hmSupportiveFilter) count++;
    if (celebratedStatusFilter) count++;
    if (mobilizedStatusFilter) count++;
    if (approachTakenFilter) count++;
    if (minSMCAlumniFilter) count++;
    if (minAmbassadorFilter) count++;
    if (minMobilizedFilter) count++;
    if (startDateFilter) count++;
    if (endDateFilter) count++;
    if (platformFilter) count++;
    if (platformLinkFilter) count++;
    if (riskChallengeFilter) count++;
    if (mitigationTakenFilter) count++;
    if (takeBackFilter) count++;
    if (proofFilter) count++;
    if (mediaContentFilter) count++;
    if (enteredTimeFilter) count++;
    return count;
  }, [
    districtFilter, blockFilter, enteredByFilter, schoolTypeFilter, schoolCategoryFilter,
    hmSupportiveFilter, celebratedStatusFilter, mobilizedStatusFilter, approachTakenFilter,
    minSMCAlumniFilter, minAmbassadorFilter, minMobilizedFilter, startDateFilter, endDateFilter, platformFilter,
    platformLinkFilter, riskChallengeFilter, mitigationTakenFilter, takeBackFilter, proofFilter, mediaContentFilter, enteredTimeFilter
  ]);

  const resetAllFilters = () => {
    setSearch("");
    setDistrictFilter("");
    setBlockFilter("");
    setEnteredByFilter("");
    setSchoolTypeFilter("");
    setSchoolCategoryFilter("");
    setHmSupportiveFilter("");
    setCelebratedStatusFilter("");
    setMobilizedStatusFilter("");
    setApproachTakenFilter("");
    setMinSMCAlumniFilter("");
    setMinAmbassadorFilter("");
    setMinMobilizedFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setPlatformFilter("");
    setPlatformLinkFilter("");
    setRiskChallengeFilter("");
    setMitigationTakenFilter("");
    setTakeBackFilter("");
    setProofFilter("");
    setMediaContentFilter("");
    setEnteredTimeFilter("");
  };

  const totalMobilizedAlumni = filteredData.reduce((sum, d) => sum + (d.mobilized_count || 0), 0);
  const celebratedCount = filteredData.filter((d) => d.celebrated_status === "Yes").length;

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
      className="min-h-screen bg-[#f0f4f9]"
    >
      {/* ===== TOP HEADER BAR ===== */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <BackButton />
          <div className="h-5 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <School size={16} className="text-white" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">Alumni Community Dashboard</span>
          </div>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-blue-200"
        >
          <Plus size={16} />
          Add School Record
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Alumni Community Registry</h1>
          <p className="text-slate-500 mt-1 text-sm">Monitor school categories, approach methods, mobilization count, group platform settings, and proof of activities.</p>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              label: "Registered Schools",
              value: filteredData.length,
              icon: <School size={20} className="text-blue-600" />,
              bg: "bg-blue-50",
              accent: "text-blue-600",
            },
            {
              label: "Total Mobilized Alumni",
              value: totalMobilizedAlumni.toLocaleString() + "+",
              icon: <Users size={20} className="text-emerald-600" />,
              bg: "bg-emerald-50",
              accent: "text-emerald-600",
            },
            {
              label: "Celebrations Completed",
              value: `${celebratedCount} / ${filteredData.length}`,
              icon: <CheckCircle size={20} className="text-violet-600" />,
              bg: "bg-violet-50",
              accent: "text-violet-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl px-6 py-5 border border-slate-200 flex items-center gap-4 shadow-sm"
            >
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

        {/* Search & Advanced Filters Trigger */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-5">
          {/* Search */}
          <div className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex-1 flex items-center gap-3 shadow-sm">
            <Search size={18} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by school name..."
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

          {/* Toggle Button */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center justify-center gap-2 h-14 px-6 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
              showAdvancedFilters || activeFiltersCount > 0
                ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span>Advanced Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
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
            {/* District */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">District</label>
              <div className="relative">
                <select
                  value={districtFilter}
                  onChange={(e) => {
                    setDistrictFilter(e.target.value);
                    setBlockFilter("");
                  }}
                  className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All Districts</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Block */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Block</label>
              <div className="relative">
                <select
                  value={blockFilter}
                  onChange={(e) => setBlockFilter(e.target.value)}
                  disabled={!districtFilter}
                  className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer disabled:opacity-50"
                >
                  <option value="">{districtFilter ? "All Blocks" : "Select District First"}</option>
                  {districtFilter && (DISTRICT_BLOCKS[districtFilter] || []).map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* School Type */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">School Type</label>
              <div className="relative">
                <select
                  value={schoolTypeFilter}
                  onChange={(e) => setSchoolTypeFilter(e.target.value)}
                  className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
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
                  className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {["Career Guidance", "Centinary School", "Vetri Palligal School"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* HM Supportive */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">HM Supportive</label>
              <div className="relative">
                <select
                  value={hmSupportiveFilter}
                  onChange={(e) => setHmSupportiveFilter(e.target.value)}
                  className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Celebrated Status */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Celebrated</label>
              <div className="relative">
                <select
                  value={celebratedStatusFilter}
                  onChange={(e) => setCelebratedStatusFilter(e.target.value)}
                  className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Mobilized Status */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Mobilized Status</label>
              <div className="relative">
                <select
                  value={mobilizedStatusFilter}
                  onChange={(e) => setMobilizedStatusFilter(e.target.value)}
                  className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Approach Taken */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Approach Taken</label>
              <div className="relative">
                <select
                  value={approachTakenFilter}
                  onChange={(e) => setApproachTakenFilter(e.target.value)}
                  className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All Approaches</option>
                  {[
                    "SHG Members - SMC",
                    "People Rep - SMC",
                    "Key People -HM",
                    "Mass Communication (Notice,Auto-announcement )",
                    "People gathering Sports - Local - College Alumni",
                    "Fans Club",
                    "Organized Meet - Hm",
                    "Celebration - Hm",
                    "Ambassador"
                  ].map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Platform */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Group Platform</label>
              <div className="relative">
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All Platforms</option>
                  {["WhatsApp", "Facebook", "Telegram", "Vizhuthugal App", "Others"].map((p) => (
                    <option key={p} value={p}>{p}</option>
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
                  className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All entered by</option>
                  {Array.from(new Set(data.map(item => item.entered_by).filter(Boolean))).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Min SMC Alumni Count */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Min SMC Alumni</label>
              <input
                type="number"
                placeholder="e.g. 5"
                value={minSMCAlumniFilter}
                onChange={(e) => setMinSMCAlumniFilter(e.target.value)}
                className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>

            {/* Min Ambassador Count */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Min Ambassadors</label>
              <input
                type="number"
                placeholder="e.g. 2"
                value={minAmbassadorFilter}
                onChange={(e) => setMinAmbassadorFilter(e.target.value)}
                className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>

            {/* Min Mobilized Count */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Min Mobilized</label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={minMobilizedFilter}
                onChange={(e) => setMinMobilizedFilter(e.target.value)}
                className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>

            {/* Period Started */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Started On/After</label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer font-medium"
              />
            </div>

            {/* Period Ended */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Ended On/Before</label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer font-medium"
              />
            </div>

            {/* Platform Link */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Platform Link</label>
              <input
                type="text"
                placeholder="Search link..."
                value={platformLinkFilter}
                onChange={(e) => setPlatformLinkFilter(e.target.value)}
                className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>

            {/* Risk & Challenge */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Risk & Challenge</label>
              <input
                type="text"
                placeholder="Search risk..."
                value={riskChallengeFilter}
                onChange={(e) => setRiskChallengeFilter(e.target.value)}
                className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>

            {/* Mitigation Taken */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Mitigation Taken</label>
              <input
                type="text"
                placeholder="Search mitigation..."
                value={mitigationTakenFilter}
                onChange={(e) => setMitigationTakenFilter(e.target.value)}
                className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>

            {/* Take Back */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Take Back</label>
              <input
                type="text"
                placeholder="Search take back..."
                value={takeBackFilter}
                onChange={(e) => setTakeBackFilter(e.target.value)}
                className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>

            {/* Proof Upload Existence */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Proof Existence</label>
              <div className="relative">
                <select
                  value={proofFilter}
                  onChange={(e) => setProofFilter(e.target.value)}
                  className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none appearance-none pr-9 cursor-pointer"
                >
                  <option value="">All</option>
                  <option value="Yes">With Proofs</option>
                  <option value="No">No Proofs</option>
                </select>
                <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Media Content */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Media Title</label>
              <input
                type="text"
                placeholder="Search media title..."
                value={mediaContentFilter}
                onChange={(e) => setMediaContentFilter(e.target.value)}
                className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>

            {/* Entered Time */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Entered Time</label>
              <input
                type="text"
                placeholder="e.g. 2026-06 or AM/PM"
                value={enteredTimeFilter}
                onChange={(e) => setEnteredTimeFilter(e.target.value)}
                className="w-full bg-slate-550 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300 font-medium"
              />
            </div>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  {[
                    "S.No",
                    "District",
                    "Block",
                    "School Name",
                    "School Type",
                    "School Category",
                    "HM Supportive",
                    "SMC Alumni",
                    "Ambassador Alumni",
                    "Approach",
                    "Period Started",
                    "Period Ended",
                    "Mobilized Count",
                    "Mobilized Status",
                    "Platforms",
                    "Celebrated",
                    "Proofs",
                    "Entered By",
                    "Actions"
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left font-semibold text-xs tracking-wider uppercase whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={19} className="px-5 py-16 text-center text-slate-400 text-sm">
                      No schools found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-t border-slate-100 hover:bg-slate-50 transition-colors group"
                    >
                      <td className="px-5 py-4 text-slate-400 font-medium">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-700">{item.district}</td>
                      <td className="px-5 py-4 text-slate-600">{item.block}</td>
                      <td className="px-5 py-4 font-semibold text-slate-800">{item.school_name}</td>
                      <td className="px-5 py-4 text-slate-600">{item.school_type}</td>
                      <td className="px-5 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                          {item.school_category}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.hm_supportive === "Yes" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}>
                          {item.hm_supportive}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-700">{item.smc_alumni_count}</td>
                      <td className="px-5 py-4 font-medium text-slate-700">{item.ambassador_alumni_count}</td>
                      <td className="px-5 py-4 text-slate-600 max-w-[150px] truncate" title={item.approach_taken}>{item.approach_taken}</td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{item.period_started}</td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{item.period_ended}</td>
                      <td className="px-5 py-4 font-bold text-slate-800">{item.mobilized_count}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          item.mobilized_status === "Yes" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                        }`}>
                          {item.mobilized_status === "Yes" ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          {item.mobilized_status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {(item.alumni_group_platforms || []).map((p) => (
                            <span key={p} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                              {p === "Others" && item.other_platform ? item.other_platform : p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.celebrated_status === "Yes" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {item.celebrated_status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {item.proof_files && item.proof_files.length > 0 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs whitespace-nowrap">
                            <ImageIcon size={13} /> {item.proof_files.length} proofs
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">No file</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800 text-xs">{item.entered_by || 'Unknown'}</div>
                        <div className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{item.entered_time || '—'}</div>
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
                          {currentUser?.role !== "employee" && (
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

      {/* ===== ADD / EDIT MODAL ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 px-7 py-5 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-white font-bold text-lg">
                  {editId ? "Edit" : "Add"} School Record
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">Please provide alumni engagement, platform link, and proofs of mobilization</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-7 py-6 overflow-y-auto flex-1">
              <div className="space-y-8">
                {/* SECTION 1: Location & School Details */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-100">
                    1. School & Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      <div className="relative">
                        <select
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value, block: "" })}
                          className={inputCls(!!errors.district) + " appearance-none pr-9 cursor-pointer"}
                        >
                          <option value="">Select District</option>
                          {DISTRICTS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </Field>

                    <Field label="Block *" error={errors.block}>
                      <div className="relative">
                        <select
                          value={formData.block}
                          onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                          className={inputCls(!!errors.block) + " appearance-none pr-9 cursor-pointer"}
                          disabled={!formData.district}
                        >
                          <option value="">{formData.district ? "Select Block" : "Select District First"}</option>
                          {formData.district && (DISTRICT_BLOCKS[formData.district] || []).map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </Field>

                    <Field label="School Type *" error={errors.school_type}>
                      <div className="relative">
                        <select
                          value={formData.school_type}
                          onChange={(e) => setFormData({ ...formData, school_type: e.target.value })}
                          className={inputCls(!!errors.school_type) + " appearance-none pr-9 cursor-pointer"}
                        >
                          {["Primary School", "Middle School", "High School", "High Sec School"].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </Field>

                    <Field label="School Category *" error={errors.school_category}>
                      <div className="relative">
                        <select
                          value={formData.school_category}
                          onChange={(e) => setFormData({ ...formData, school_category: e.target.value })}
                          className={inputCls(!!errors.school_category) + " appearance-none pr-9 cursor-pointer"}
                        >
                          {["Career Guidance", "Centinary School", "Vetri Palligal School"].map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </Field>
                  </div>
                </div>

                {/* SECTION 2: Alumni Count & Support */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-100">
                    2. Alumni Indicators & HM Support
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="HM Supportive *" error={errors.hm_supportive}>
                      <div className="relative">
                        <select
                          value={formData.hm_supportive}
                          onChange={(e) => setFormData({ ...formData, hm_supportive: e.target.value })}
                          className={inputCls(!!errors.hm_supportive) + " appearance-none pr-9 cursor-pointer"}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </Field>

                    <Field label="SMC Alumni Count *" error={errors.smc_alumni_count}>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 10"
                        value={formData.smc_alumni_count}
                        onChange={(e) => setFormData({ ...formData, smc_alumni_count: e.target.value })}
                        className={inputCls(!!errors.smc_alumni_count)}
                      />
                    </Field>

                    <Field label="Ambassador Alumni Count *" error={errors.ambassador_alumni_count}>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 5"
                        value={formData.ambassador_alumni_count}
                        onChange={(e) => setFormData({ ...formData, ambassador_alumni_count: e.target.value })}
                        className={inputCls(!!errors.ambassador_alumni_count)}
                      />
                    </Field>

                    <Field label="Mobilized Count *" error={errors.mobilized_count}>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 600"
                        value={formData.mobilized_count}
                        onChange={(e) => setFormData({ ...formData, mobilized_count: e.target.value })}
                        className={inputCls(!!errors.mobilized_count)}
                      />
                    </Field>
                  </div>
                </div>

                {/* SECTION 3: Timeline & Platform Setup */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-100">
                    3. Timeline, Platform & Approach
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Period Started *" error={errors.period_started}>
                      <input
                        type="date"
                        value={formData.period_started}
                        onChange={(e) => setFormData({ ...formData, period_started: e.target.value })}
                        className={inputCls(!!errors.period_started)}
                      />
                    </Field>

                    <Field label="Period Ended *" error={errors.period_ended}>
                      <input
                        type="date"
                        value={formData.period_ended}
                        onChange={(e) => setFormData({ ...formData, period_ended: e.target.value })}
                        className={inputCls(!!errors.period_ended)}
                      />
                    </Field>

                    <Field label="Approach Taken *" error={errors.approach_taken}>
                      <div className="relative">
                        <select
                          value={formData.approach_taken}
                          onChange={(e) => setFormData({ ...formData, approach_taken: e.target.value })}
                          className={inputCls(!!errors.approach_taken) + " appearance-none pr-9 cursor-pointer"}
                        >
                          {[
                            "SHG Members - SMC",
                            "People Rep - SMC",
                            "Key People -HM",
                            "Mass Communication (Notice,Auto-announcement )",
                            "People gathering Sports - Local - College Alumni",
                            "Fans Club",
                            "Organized Meet - Hm",
                            "Celebration - Hm",
                            "Ambassador"
                          ].map((a) => (
                            <option key={a} value={a}>{a}</option>
                          ))}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </Field>

                    <Field label="Alumni Group Platform (Choose Multiple) *" error={errors.alumni_group_platforms as any}>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 gap-2 mt-1">
                        {["WhatsApp", "Facebook", "Telegram", "Vizhuthugal App", "Others"].map((p) => (
                          <label key={p} className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={formData.alumni_group_platforms.includes(p)}
                              onChange={() => handlePlatformCheckboxChange(p)}
                              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                            />
                            <span className="text-xs text-slate-700 font-medium">{p}</span>
                          </label>
                        ))}
                      </div>
                    </Field>

                    {formData.alumni_group_platforms.includes("Others") && (
                      <Field label="Specify Other Platform Name *" error={errors.other_platform}>
                        <input
                          type="text"
                          placeholder="Please specify other platform name..."
                          value={formData.other_platform}
                          onChange={(e) => setFormData({ ...formData, other_platform: e.target.value })}
                          className={inputCls(!!errors.other_platform)}
                        />
                      </Field>
                    )}

                    <Field label="Platform Link">
                      <input
                        type="url"
                        placeholder="e.g. https://chat.whatsapp.com/..."
                        value={formData.platform_link}
                        onChange={(e) => setFormData({ ...formData, platform_link: e.target.value })}
                        className={inputCls(false)}
                      />
                    </Field>
                  </div>
                </div>

                {/* SECTION 4: Challenges & Proofs */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-1.5 border-b border-slate-100">
                    4. Risks, Mitigation, Take Back & Proofs
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Risk & Challenge">
                      <textarea
                        rows={2}
                        placeholder="Mention any difficulties or challenges..."
                        value={formData.risk_challenge}
                        onChange={(e) => setFormData({ ...formData, risk_challenge: e.target.value })}
                        className={inputCls(false) + " resize-none"}
                      />
                    </Field>

                    <Field label="Mitigation Taken">
                      <textarea
                        rows={2}
                        placeholder="Actions taken to solve the challenges..."
                        value={formData.mitigation_taken}
                        onChange={(e) => setFormData({ ...formData, mitigation_taken: e.target.value })}
                        className={inputCls(false) + " resize-none"}
                      />
                    </Field>

                    <Field label="Take Back">
                      <textarea
                        rows={2}
                        placeholder="Key learnings or take-back from this event..."
                        value={formData.take_back}
                        onChange={(e) => setFormData({ ...formData, take_back: e.target.value })}
                        className={inputCls(false) + " resize-none"}
                      />
                    </Field>

                    <Field label="Celebrated Status *" error={errors.celebrated_status}>
                      <div className="relative">
                        <select
                          value={formData.celebrated_status}
                          onChange={(e) => setFormData({ ...formData, celebrated_status: e.target.value })}
                          className={inputCls(!!errors.celebrated_status) + " appearance-none pr-9 cursor-pointer"}
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </Field>

                    <Field label="Media Content / Title">
                      <input
                        type="text"
                        placeholder="e.g. SMC Meet Photo Album"
                        value={formData.media_content}
                        onChange={(e) => setFormData({ ...formData, media_content: e.target.value })}
                        className={inputCls(false)}
                      />
                    </Field>

                    <div className="col-span-1 md:col-span-2">
                      <Field label="Proof Upload (Upload multiple photos, video, pdf)">
                        <label className="flex items-center justify-center gap-3 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 rounded-2xl p-6 cursor-pointer transition-all">
                          <Upload size={24} className="text-slate-400" />
                          <div className="text-left">
                            <p className="text-sm font-semibold text-slate-700">Choose files to upload</p>
                            <p className="text-xs text-slate-400 mt-0.5">Supports images, videos, and PDF documents</p>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/*,video/*,.pdf"
                            className="hidden"
                            onChange={handleMultipleFilesUpload}
                          />
                        </label>

                        {/* List uploaded files */}
                        {formData.proof_files.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                            {formData.proof_files.map((file, idx) => (
                              <div key={idx} className="relative group bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col items-center justify-between text-center min-h-[110px] overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => removeProofFile(idx)}
                                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors z-10"
                                >
                                  <X size={13} />
                                </button>
                                
                                {file.type.startsWith("image/") ? (
                                  <img
                                    src={file.content}
                                    alt="Upload preview"
                                    className="w-full h-16 object-cover rounded-lg border border-slate-200"
                                  />
                                ) : file.type.startsWith("video/") ? (
                                  <div className="w-full h-16 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center">
                                    <Video size={24} className="text-blue-500" />
                                  </div>
                                ) : (
                                  <div className="w-full h-16 bg-red-50 rounded-lg border border-red-100 flex items-center justify-center">
                                    <FileText size={24} className="text-red-500" />
                                  </div>
                                )}
                                <span className="text-[10px] text-slate-500 truncate w-full mt-1.5 font-medium">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-7 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 flex-shrink-0">
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
                {editId ? "Update" : "Save"} Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== VIEW MODAL ===== */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-slate-900 px-6 py-5 flex items-center justify-between flex-shrink-0">
              <h2 className="text-white font-bold">Community Record details</h2>
              <button onClick={() => setViewItem(null)} className="w-8 h-8 rounded-xl bg-slate-700 hover:bg-slate-600 flex items-center justify-center">
                <X size={15} className="text-white" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {[
                  ["School Name", viewItem.school_name],
                  ["District", viewItem.district],
                  ["Block", viewItem.block],
                  ["School Type", viewItem.school_type],
                  ["School Category", viewItem.school_category],
                  ["HM Supportive", viewItem.hm_supportive],
                  ["SMC Alumni Count", String(viewItem.smc_alumni_count)],
                  ["Ambassador Alumni Count", String(viewItem.ambassador_alumni_count)],
                  ["Approach Taken", viewItem.approach_taken],
                  ["Period Started", viewItem.period_started],
                  ["Period Ended", viewItem.period_ended],
                  ["Mobilized Count", String(viewItem.mobilized_count)],
                  ["Mobilized Status", viewItem.mobilized_status],
                  ["Group Platforms", (viewItem.alumni_group_platforms || []).map(p => p === "Others" && viewItem.other_platform ? viewItem.other_platform : p).join(", ")],
                  ["Platform Link", viewItem.platform_link || "—"],
                  ["Media Title", viewItem.media_content || "—"],
                  ["Celebrated Status", viewItem.celebrated_status],
                  ["Entered By", viewItem.entered_by || "—"],
                  ["Entered Time", viewItem.entered_time || "—"]
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-slate-50 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">{label}</span>
                    <span className="text-sm text-slate-700 font-medium mt-0.5 block">{value}</span>
                  </div>
                ))}

                <div className="col-span-1 sm:col-span-2 border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Risk & Challenge</span>
                  <span className="text-sm text-slate-700 font-medium mt-0.5 block">{viewItem.risk_challenge || "—"}</span>
                </div>

                <div className="col-span-1 sm:col-span-2 border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Mitigation Taken</span>
                  <span className="text-sm text-slate-700 font-medium mt-0.5 block">{viewItem.mitigation_taken || "—"}</span>
                </div>

                <div className="col-span-1 sm:col-span-2 border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Take Back</span>
                  <span className="text-sm text-slate-700 font-medium mt-0.5 block">{viewItem.take_back || "—"}</span>
                </div>

                {viewItem.proof_files && viewItem.proof_files.length > 0 && (
                  <div className="col-span-1 sm:col-span-2 mt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-2">Uploaded Proofs</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {viewItem.proof_files.map((file, idx) => (
                        <div key={idx} className="border border-slate-100 rounded-xl p-2 bg-slate-50 flex flex-col items-center justify-between text-center min-h-[100px]">
                          {file.type.startsWith("image/") ? (
                            <a href={file.content} target="_blank" rel="noopener noreferrer" className="w-full">
                              <img src={file.content} alt="Proof" className="w-full h-16 object-cover rounded-lg border cursor-pointer hover:opacity-80" />
                            </a>
                          ) : file.type.startsWith("video/") ? (
                            <video src={file.content} controls className="w-full h-16 rounded-lg object-cover" />
                          ) : (
                            <a href={file.content} download={file.name} className="w-full h-16 flex items-center justify-center bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors">
                              <FileText size={24} className="text-red-500" />
                            </a>
                          )}
                          <span className="text-[9px] text-slate-500 truncate w-full mt-1.5 font-medium">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 pb-6 flex-shrink-0">
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

      {/* ===== DELETE CONFIRM ===== */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-7 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">Delete Record?</h3>
            <p className="text-slate-500 text-sm mt-2 mb-6">
              This action cannot be undone. The community record will be permanently removed.
            </p>
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

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full border ${
    hasError ? "border-red-400 bg-red-50" : "border-slate-200"
  } rounded-xl px-3.5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-slate-300`;
}