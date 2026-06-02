import {
  Users,
  UserCheck,
  FileText,
  Clock3,
  TrendingUp,
  Activity,
  School,
  MessageSquare,
  CheckCircle,
  XCircle,
  Download,
} from 'lucide-react'

import {
  useEffect,
  useState,
  useMemo,
} from 'react'

import axios from 'axios'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from 'recharts'

export default function Dashboard() {

  const [employees, setEmployees] = useState<any[]>([])
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Reports');
  const [enteredByFilter, setEnteredByFilter] = useState('');
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [schoolCommRaw, setSchoolCommRaw] = useState<any[]>([])
  const [coreTeamsRaw, setCoreTeamsRaw] = useState<any[]>([])
  const [whatsappRaw, setWhatsappRaw] = useState<any[]>([])
  const [engagementsRaw, setEngagementsRaw] = useState<any[]>([])
  const [schoolCommunitiesList, setSchoolCommunitiesList] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [workDone, setWorkDone] = useState('')
  const [submittingAttendance, setSubmittingAttendance] = useState(false)

  // Reports state for admin overview filter and downloads
  const [reportsList, setReportsList] = useState<any[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string>('')

  /* ===================================== */
  /* FETCH EMPLOYEES & KPIS */
  /* ===================================== */

  useEffect(() => {
    fetchEmployees()
    fetchAttendance()

    // Load logged-in user
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr))
      } catch (e) {
        console.error(e)
      }
    }

    // Load and merge all KPI reports/submissions
    const generalReports = JSON.parse(localStorage.getItem('reports') || '[]');
    
    const schoolComm = JSON.parse(localStorage.getItem('school_communities') || '[]').map((item: any) => ({
      id: `sc-${item.id}`,
      title: item.school_name || 'School Community Creation',
      category: 'School Community',
      employee: item.entered_by || 'Unknown',
      date: item.last_msg_date || new Date().toISOString().split('T')[0],
      status: item.mobilization === 'Yes' ? 'Completed' : 'Pending',
      remark: item.remarks || '',
      enteredBy: item.entered_by || 'Unknown',
      enteredTime: item.entered_time || '—'
    }));

    const coreTeams = JSON.parse(localStorage.getItem('core_teams') || '[]').map((item: any) => ({
      id: `ct-${item.id}`,
      title: item.core_team_name || 'Core Team Formation',
      category: 'Core Team',
      employee: item.entered_by || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      status: item.core_team_formation === 'Yes' ? 'Completed' : 'Pending',
      remark: `Members: ${item.how_many_members || 0}. ${item.remarks || ''}`,
      enteredBy: item.entered_by || 'Unknown',
      enteredTime: item.entered_time || '—'
    }));

    const whatsapp = JSON.parse(localStorage.getItem('whatsapp_groups') || '[]').map((item: any) => ({
      id: `wa-${item.id}`,
      title: `WhatsApp Group: ${item.school_name}`,
      category: 'WhatsApp',
      employee: item.entered_by || 'Unknown',
      date: item.last_msg_date || new Date().toISOString().split('T')[0],
      status: item.activity_status === 'High' ? 'Completed' : 'Submitted',
      remark: `Admin: ${item.group_admin}. Members: ${item.member_count}. ${item.remarks || ''}`,
      enteredBy: item.entered_by || 'Unknown',
      enteredTime: item.entered_time || '—'
    }));

    const engagements = JSON.parse(localStorage.getItem('core_engagements') || '[]').map((item: any) => ({
      id: `ce-${item.id}`,
      title: item.core_team_name || 'Core Engagement Activity',
      category: 'Core Engagement',
      employee: item.entered_by || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      status: item.team_formation_done === 'Yes' ? 'Completed' : 'Submitted',
      remark: `Activity: ${item.activity}. ${item.remarks || ''}`,
      enteredBy: item.entered_by || 'Unknown',
      enteredTime: item.entered_time || '—'
    }));

    const merged = [
      ...generalReports,
      ...schoolComm,
      ...coreTeams,
      ...whatsapp,
      ...engagements
    ];

    setReportsList(merged);

    // Load KPI counts from localStorage
    const schools = JSON.parse(localStorage.getItem('school_communities') || '[]')
    const teams = JSON.parse(localStorage.getItem('core_teams') || '[]')
    const waGroups = JSON.parse(localStorage.getItem('whatsapp_groups') || '[]')
    const engs = JSON.parse(localStorage.getItem('core_engagements') || '[]')

    setSchoolCommRaw(schools)
    setCoreTeamsRaw(teams)
    setWhatsappRaw(waGroups)
    setEngagementsRaw(engs)

    const defaultSchools = [
      {
        id: 1,
        school_name: "Govt Hr Sec School",
        whatsapp_group: "GHSS Alumni 2025",
        mobilization: "Yes",
        members: 650,
        platform: "WhatsApp",
        remarks: "Active community",
      },
      {
        id: 2,
        school_name: "St. Joseph's Hr Sec School",
        whatsapp_group: "SJS Alumni Network",
        mobilization: "Yes",
        members: 820,
        platform: "Telegram",
        remarks: "Recently formed",
      },
      {
        id: 3,
        school_name: "Anna Matriculation School",
        whatsapp_group: "Anna Matric Old Boys",
        mobilization: "No",
        members: 510,
        platform: "Facebook",
        remarks: "Pending verification",
      }
    ]

    setSchoolCommunitiesList(schools.length > 0 ? schools : defaultSchools)
  }, [])

  const downloadReport = (empName: string) => {
    const isEmployee = currentUser?.role === 'employee';
    const filteredReports = reportsList.filter(report => {
      // Employees see only their own reports
      if (isEmployee && currentUser?.name &&
          report.employee?.toLowerCase() !== currentUser.name.toLowerCase() &&
          report.enteredBy?.toLowerCase() !== currentUser.name.toLowerCase()) {
        return false;
      }
      const matchesSearch =
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.category.toLowerCase().includes(search.toLowerCase()) ||
        report.employee?.toLowerCase().includes(search.toLowerCase()) ||
        (report.remark && report.remark.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === 'All Reports' ? true : report.status === statusFilter;
      const matchesEnteredBy = enteredByFilter ? (report.enteredBy?.toLowerCase() === enteredByFilter.toLowerCase()) : true;
      return matchesSearch && matchesStatus && matchesEnteredBy;
    });

    const empReports = filteredReports.filter(
      r => r.employee?.toLowerCase() === empName.toLowerCase() || 
           r.enteredBy?.toLowerCase() === empName.toLowerCase()
    );
    
    if (empReports.length === 0) {
      alert(`No KPI records logged for "${empName}".`);
      return;
    }
    
    // Construct CSV
    const headers = ['Sl No', 'Report/KPI Title', 'Category', 'Employee', 'Date', 'Remarks', 'Entered By', 'Entered Time', 'Status'];
    const rows = empReports.map((r, i) => [
      i + 1,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.category.replace(/"/g, '""')}"`,
      `"${r.employee.replace(/"/g, '""')}"`,
      r.date,
      `"${(r.remark || '').replace(/"/g, '""')}"`,
      `"${(r.enteredBy || r.employee).replace(/"/g, '""')}"`,
      r.enteredTime || '—',
      r.status
    ]);
    
    const csvContent = '\ufeff' + [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${empName.replace(/\s+/g, '_')}_KPI_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchEmployees = async () => {

    try {

      setLoading(true)

      const res =
      
         await axios.get(
           'http://127.0.0.1:8000/employees'
          )        

      console.log(
        'EMPLOYEE API:',
        res.data
      )

      /* ===================================== */
      /* SAFE ARRAY FIX */
      /* ===================================== */

      const employeeData =

        Array.isArray(res.data)

          ? res.data

          : Array.isArray(
              res.data.data
            )

          ? res.data.data

          : []

      setEmployees(
        employeeData
      )

      setLoading(false)

    } catch (err) {

      console.log(
        'EMPLOYEE FETCH ERROR:',
        err
      )

      setEmployees([])

      setLoading(false)

    }
  }

  const fetchAttendance = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/attendance')
      const attendanceData = res.data.data || []
      setAttendance(attendanceData)
    } catch (err) {
      console.log('ATTENDANCE FETCH ERROR:', err)
    }
  }

  const handleCheckIn = async () => {
    if (!currentUser) return
    setSubmittingAttendance(true)
    try {
      const localISOTime = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      const payload = {
        employee_name: currentUser.name,
        check_in: localISOTime,
        check_out: '',
        work_done: ''
      }
      await axios.post('http://127.0.0.1:8000/attendance', payload)
      alert('Checked In Successfully!')
      fetchAttendance()
    } catch (err) {
      console.error('Check-in error:', err)
      alert('Failed to check in')
    } finally {
      setSubmittingAttendance(false)
    }
  }

  const handleCheckOut = async (myAttendanceToday: any) => {
    if (!currentUser || !myAttendanceToday) return
    if (!workDone.trim()) {
      alert('Please describe your work done today before checking out.')
      return
    }
    setSubmittingAttendance(true)
    try {
      const localISOTime = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      const payload = {
        employee_name: currentUser.name,
        check_in: myAttendanceToday.check_in,
        check_out: localISOTime,
        work_done: workDone
      }
      await axios.put(`http://127.0.0.1:8000/attendance/${myAttendanceToday.id}`, payload)
      alert('Checked Out Successfully!')
      setWorkDone('')
      fetchAttendance()
    } catch (err) {
      console.error('Check-out error:', err)
      alert('Failed to check out')
    } finally {
      setSubmittingAttendance(false)
    }
  }

  /* ===================================== */
  /* STATS */
  /* ===================================== */

  const todayStr = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().split('T')[0];
  const presentTodayCount = attendance.filter(item => item.check_in?.split('T')[0] === todayStr).length;

  const myAttendanceRecords = attendance.filter(
    (item) => item.employee_name?.toLowerCase() === currentUser?.name?.toLowerCase()
  );
  
  // Entered By dropdown options based on reports list
  const enteredByOptions = useMemo(() => {
    const map = new Map<string, number>();
    reportsList.forEach(item => {
      if (item.enteredBy) {
        map.set(item.enteredBy, (map.get(item.enteredBy) ?? 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [reportsList]);

  const myTotalPresent = myAttendanceRecords.length;

  const myTotalHours = myAttendanceRecords.reduce((total, item) => {
    if (!item.check_in || !item.check_out) return total;
    const diff = (new Date(item.check_out).getTime() - new Date(item.check_in).getTime()) / (1000 * 60 * 60);
    return total + (isNaN(diff) ? 0 : diff);
  }, 0);

  const stats = currentUser?.role === 'employee' ? [
    {
      title: 'My Present Days',
      value: myTotalPresent,
      icon: <UserCheck size={28} />,
      bg: 'bg-green-100',
      text: 'text-green-600',
    },
    {
      title: 'My Hours Logged',
      value: `${myTotalHours.toFixed(1)}h`,
      icon: <Clock3 size={28} />,
      bg: 'bg-orange-100',
      text: 'text-orange-600',
    },
    {
      title: 'Total Employees',
      value: employees.length,
      icon: <Users size={28} />,
      bg: 'bg-blue-100',
      text: 'text-blue-600',
    },
    {
      title: 'Present Today',
      value: presentTodayCount,
      icon: <Activity size={28} />,
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
    },
  ] : selectedEmployee ? [
    {
      title: `${selectedEmployee}'s Present Days`,
      value: attendance.filter(item => item.employee_name?.toLowerCase() === selectedEmployee.toLowerCase()).length,
      icon: <UserCheck size={28} />,
      bg: 'bg-green-100',
      text: 'text-green-600',
    },
    {
      title: `${selectedEmployee}'s Hours Logged`,
      value: `${attendance
        .filter(item => item.employee_name?.toLowerCase() === selectedEmployee.toLowerCase())
        .reduce((total, item) => {
          if (!item.check_in || !item.check_out) return total;
          const diff = (new Date(item.check_out).getTime() - new Date(item.check_in).getTime()) / (1000 * 60 * 60);
          return total + (isNaN(diff) ? 0 : diff);
        }, 0).toFixed(1)}h`,
      icon: <Clock3 size={28} />,
      bg: 'bg-orange-100',
      text: 'text-orange-600',
    },
    {
      title: 'Reports Submitted',
      value: reportsList.filter(r => r.employee?.toLowerCase() === selectedEmployee.toLowerCase() || r.enteredBy?.toLowerCase() === selectedEmployee.toLowerCase()).length,
      icon: <FileText size={28} />,
      bg: 'bg-purple-100',
      text: 'text-purple-600',
    },
    {
      title: 'Pending Tasks',
      value: reportsList.filter(r => (r.employee?.toLowerCase() === selectedEmployee.toLowerCase() || r.enteredBy?.toLowerCase() === selectedEmployee.toLowerCase()) && r.status === 'Pending').length,
      icon: <Clock3 size={28} />,
      bg: 'bg-orange-100',
      text: 'text-orange-600',
    },
  ] : [
    {
      title: 'Total Employees',
      value: employees.length,
      icon: <Users size={28} />,
      bg: 'bg-blue-100',
      text: 'text-blue-600',
    },
    {
      title: 'Present Today',
      value: presentTodayCount,
      icon: <UserCheck size={28} />,
      bg: 'bg-green-100',
      text: 'text-green-600',
    },
    {
      title: 'Reports Submitted',
      value: reportsList.length,
      icon: <FileText size={28} />,
      bg: 'bg-purple-100',
      text: 'text-purple-600',
    },
    {
      title: 'Pending Tasks',
      value: reportsList.filter(r => r.status === 'Pending').length,
      icon: <Clock3 size={28} />,
      bg: 'bg-orange-100',
      text: 'text-orange-600',
    },
  ];

  /* ===================================== */
  /* ATTENDANCE CHART */
  /* ===================================== */

  const uniqueDates = Array.from(new Set(attendance.map(item => item.check_in?.split('T')[0]).filter(Boolean)));
  const totalUniqueDays = uniqueDates.length || 1;
  const employeePresentDays = selectedEmployee
    ? attendance.filter(item => item.employee_name?.toLowerCase() === selectedEmployee.toLowerCase()).length
    : 0;

  const attendanceData = selectedEmployee ? [
    {
      name: 'Present',
      value: employeePresentDays,
    },
    {
      name: 'Absent',
      value: Math.max(0, totalUniqueDays - employeePresentDays),
    },
  ] : [
    {
      name: 'Present',
      value: presentTodayCount,
    },
    {
      name: 'Absent',
      value: Math.max(0, employees.length - presentTodayCount),
    },
  ];

  /* ===================================== */
  /* REPORT CHART */
  /* ===================================== */

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyCounts: { [key: string]: number } = {};
  months.forEach(m => { monthlyCounts[m] = 0; });
  
  const filteredReportsForChart = selectedEmployee
    ? reportsList.filter(r => r.employee?.toLowerCase() === selectedEmployee.toLowerCase() || r.enteredBy?.toLowerCase() === selectedEmployee.toLowerCase())
    : reportsList;
    
  filteredReportsForChart.forEach(r => {
    if (r.date) {
      const dateParts = r.date.split('-');
      if (dateParts.length >= 2) {
        const monthIndex = parseInt(dateParts[1], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          const monthName = months[monthIndex];
          monthlyCounts[monthName] = (monthlyCounts[monthName] || 0) + 1;
        }
      }
    }
  });

  const currentMonthIndex = new Date().getMonth();
  const reportData = [];
  for (let i = 5; i >= 0; i--) {
    const mIndex = (currentMonthIndex - i + 12) % 12;
    const monthName = months[mIndex];
    reportData.push({
      month: monthName,
      reports: monthlyCounts[monthName] || 0
    });
  }

  const COLORS = [
    '#2563eb',
    '#22c55e',
  ]

  const schoolCommunitiesCount = selectedEmployee
    ? schoolCommRaw.filter(item => item.entered_by?.toLowerCase() === selectedEmployee.toLowerCase()).length
    : (schoolCommRaw.length > 0 ? schoolCommRaw.length : 3);

  const coreTeamsCount = selectedEmployee
    ? coreTeamsRaw.filter(item => item.entered_by?.toLowerCase() === selectedEmployee.toLowerCase()).length
    : (coreTeamsRaw.length > 0 ? coreTeamsRaw.length : 3);

  const whatsappGroupsCount = selectedEmployee
    ? whatsappRaw.filter(item => item.entered_by?.toLowerCase() === selectedEmployee.toLowerCase()).length
    : (whatsappRaw.length > 0 ? whatsappRaw.length : 3);

  const coreEngagementsCount = selectedEmployee
    ? engagementsRaw.filter(item => item.entered_by?.toLowerCase() === selectedEmployee.toLowerCase()).length
    : (engagementsRaw.length > 0 ? engagementsRaw.length : 3);

  const displayedSchoolCommunities = selectedEmployee
    ? schoolCommunitiesList.filter(
        item => item.entered_by?.toLowerCase() === selectedEmployee.toLowerCase()
      )
    : schoolCommunitiesList;

  const myAttendanceToday = attendance
    .filter(item => item.employee_name?.toLowerCase() === currentUser?.name?.toLowerCase() && item.check_in?.split('T')[0] === todayStr)
    .sort((a, b) => b.id - a.id)[0];

  return (

    <div className="space-y-8">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">

            Dashboard

          </h1>

          <p className="text-slate-500 mt-1">

            Welcome back, {currentUser ? currentUser.name : 'User'} 👋

          </p>

        </div>

        {/* ===================================== */}
        {/* PERFORMANCE */}
        {/* ===================================== */}

        <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl shadow-sm border border-slate-200">

          <div className="bg-green-100 p-3 rounded-xl">

            <TrendingUp
              className="text-green-600"
              size={24}
            />

          </div>

          <div>

            <h2 className="font-bold text-slate-800">

              +18%

            </h2>

            <p className="text-sm text-slate-500">

              Usage Increased

            </p>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* MY ATTENDANCE WIDGET (EMPLOYEES ONLY) */}
      {/* ===================================== */}
      {currentUser?.role === 'employee' && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
              <Clock3 size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Daily Attendance Tracker</h2>
              <p className="text-blue-100 text-sm mt-1">
                {!myAttendanceToday 
                  ? "You haven't checked in yet today. Start your work day now!" 
                  : !myAttendanceToday.check_out 
                  ? `Checked in at ${new Date(myAttendanceToday.check_in).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}. Don't forget to check out when you finish.`
                  : `Work day completed! Checked out at ${new Date(myAttendanceToday.check_out).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            {!myAttendanceToday ? (
              <button
                onClick={handleCheckIn}
                disabled={submittingAttendance}
                className="bg-white text-blue-600 font-bold px-6 py-3.5 rounded-2xl hover:bg-blue-50 active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-md text-center"
              >
                {submittingAttendance ? 'Checking In...' : 'Check In Now'}
              </button>
            ) : !myAttendanceToday.check_out ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                <input
                  type="text"
                  placeholder="Describe your work done today..."
                  value={workDone}
                  onChange={(e) => setWorkDone(e.target.value)}
                  className="bg-white/10 text-white placeholder-blue-200 border border-white/20 px-4 py-3 rounded-2xl outline-none focus:bg-white/20 transition-all text-sm w-full sm:w-64"
                />
                <button
                  onClick={() => handleCheckOut(myAttendanceToday)}
                  disabled={submittingAttendance}
                  className="bg-red-500 text-white font-bold px-6 py-3.5 rounded-2xl hover:bg-red-600 active:scale-95 transition-all duration-300 disabled:opacity-50 shadow-md text-center whitespace-nowrap"
                >
                  {submittingAttendance ? 'Checking Out...' : 'Check Out'}
                </button>
              </div>
            ) : (
              <div className="bg-white/20 px-6 py-3 rounded-2xl text-sm font-semibold backdrop-blur-md text-center">
                Checked Out for Today
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {stats.map((item, index) => (

          <div
            key={index}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-slate-500 text-sm mb-2">

                  {item.title}

                </p>

                <h2 className="text-4xl font-bold text-slate-800">

                  {item.value}

                </h2>

              </div>

              <div
                className={`${item.bg} ${item.text} p-4 rounded-2xl`}
              >

                {item.icon}

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* ===================================== */}
      {/* ALUMNI COMMUNITY KPIS */}
      {/* ===================================== */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Alumni Community KPIs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              title: "School Communities",
              value: schoolCommunitiesCount,
              icon: <School size={28} />,
              bg: "bg-blue-100",
              text: "text-blue-600",
            },
            {
              title: "Core Teams Formed",
              value: coreTeamsCount,
              icon: <Users size={28} />,
              bg: "bg-violet-100",
              text: "text-violet-600",
            },
            {
              title: "WhatsApp Groups",
              value: whatsappGroupsCount,
              icon: <MessageSquare size={28} />,
              bg: "bg-green-100",
              text: "text-green-600",
            },
            {
              title: "Core Engagements",
              value: coreEngagementsCount,
              icon: <Activity size={28} />,
              bg: "bg-emerald-100",
              text: "text-emerald-600",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-sm mb-2">{item.title}</p>
                  <h2 className="text-4xl font-bold text-slate-800">{item.value}</h2>
                </div>
                <div className={`${item.bg} ${item.text} p-4 rounded-2xl`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================================== */}
      {/* ANALYTICS */}
      {/* ===================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ===================================== */}
        {/* ATTENDANCE CHART */}
        {/* ===================================== */}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">

                Attendance Overview

              </h2>

              <p className="text-slate-500 mt-1">

                Daily attendance reflection

              </p>

            </div>

            <div className="bg-blue-100 p-3 rounded-xl">

              <Activity
                className="text-blue-600"
                size={22}
              />

            </div>

          </div>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={attendanceData}
                  dataKey="value"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                >

                  {
                    attendanceData.map(
                      (
                        _,
                        index
                      ) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[index]
                          }
                        />
                      )
                    )
                  }

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* ===================================== */}
        {/* REPORTS CHART */}
        {/* ===================================== */}

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">

                Reports Analytics

              </h2>

              <p className="text-slate-500 mt-1">

                Monthly reports submitted

              </p>

            </div>

            <div className="bg-purple-100 p-3 rounded-xl">

              <FileText
                className="text-purple-600"
                size={22}
              />

            </div>

          </div>

          <div className="h-72">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={reportData}
              >

                <XAxis
                  dataKey="month"
                />

                <Tooltip />

                <Bar
                  dataKey="reports"
                  fill="#2563eb"
                  radius={[
                    10,
                    10,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* ===================================== */}
      {/* SCHOOL LEVEL ALUMNI COMMUNITIES (KP1) */}
      {/* ===================================== */}

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">

              School Level Alumni Communities (KP1)

            </h2>

            <p className="text-slate-500 mt-1 text-sm">

              Formed alumni networks, group sizes, and platform active status

            </p>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-200 text-left">

                <th className="py-4 text-slate-600 font-semibold text-sm">School Name</th>

                <th className="py-4 text-slate-600 font-semibold text-sm">WhatsApp Group</th>

                <th className="py-4 text-slate-600 font-semibold text-sm">Mobilization</th>

                <th className="py-4 text-slate-600 font-semibold text-sm">Members</th>

                <th className="py-4 text-slate-600 font-semibold text-sm">Celebrated Platform</th>

                <th className="py-4 text-slate-600 font-semibold text-sm">Remarks</th>

              </tr>

            </thead>

            <tbody>

              {displayedSchoolCommunities.map((item, index) => (

                <tr

                  key={item.id || index}

                  className="border-b border-slate-100 hover:bg-slate-50 transition-all"

                >

                  <td className="py-5 font-semibold text-slate-800">

                    {item.school_name}

                  </td>

                  <td className="py-5 text-slate-600">

                    {item.whatsapp_group || <span className="text-slate-300">—</span>}

                  </td>

                  <td className="py-5">

                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${

                      item.mobilization === "Yes"

                        ? "bg-emerald-50 text-emerald-700"

                        : "bg-red-50 text-red-600"

                    }`}>

                      {item.mobilization === "Yes" ? <CheckCircle size={12} /> : <XCircle size={12} />}

                      {item.mobilization}

                    </span>

                  </td>

                  <td className="py-5">

                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">

                      {Number(item.members).toLocaleString()}+

                    </span>

                  </td>

                  <td className="py-5 text-slate-600">

                    {item.platform || <span className="text-slate-300">—</span>}

                  </td>

                  <td className="py-5 text-slate-500 max-w-[200px] truncate" title={item.remarks}>

                    {item.remarks || <span className="text-slate-300">—</span>}

                  </td>

                </tr>

              ))}

              {displayedSchoolCommunities.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 font-medium">
                    No school communities found for this view.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ===================================== */}
      {/* ADMIN PERFORMANCE TRACKER (ADMIN ONLY) */}
      {/* ===================================== */}
      {currentUser?.role === 'admin' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Alumni Performance & Work Tracker (State Admin View)
              </h2>
              <p className="text-slate-500 mt-1 text-sm">
                Filter employee submissions, review performance metrics, and export CSV reports.
              </p>
            </div>
            {selectedEmployee && (
              <button
                onClick={() => downloadReport(selectedEmployee)}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold px-5 py-3 rounded-2xl transition shadow-md shadow-emerald-100"
              >
                <Download size={16} />
                Download Report ({selectedEmployee})
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Filter by Employee Name:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedEmployee('')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  selectedEmployee === ''
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Submissions
              </button>
              {Array.from(new Set([
                ...employees.map(e => e.name),
                ...reportsList.map(r => r.employee)
              ])).filter(Boolean).map(emp => (
                <button
                  key={emp}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    selectedEmployee === emp
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {emp}
                </button>
              ))}
            </div>
          </div>

          {/* Scoped Performance Stats */}
          {selectedEmployee && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
              {[
                { label: 'KPIs Logged', value: reportsList.filter(r => r.employee?.toLowerCase() === selectedEmployee.toLowerCase() || r.enteredBy?.toLowerCase() === selectedEmployee.toLowerCase()).length, color: 'text-slate-800' },
                { label: 'Completed Activity', value: reportsList.filter(r => (r.employee?.toLowerCase() === selectedEmployee.toLowerCase() || r.enteredBy?.toLowerCase() === selectedEmployee.toLowerCase()) && r.status === 'Completed').length, color: 'text-green-600' },
                { label: 'Submitted Activity', value: reportsList.filter(r => (r.employee?.toLowerCase() === selectedEmployee.toLowerCase() || r.enteredBy?.toLowerCase() === selectedEmployee.toLowerCase()) && r.status === 'Submitted').length, color: 'text-blue-600' },
              ].map(s => (
                <div key={s.label} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4">
                  <p className="text-slate-500 text-xs mb-1 font-semibold">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Work Submissions Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Sl No</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Report / KPI</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Employee</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Remarks</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Entered By</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Entered Time</th>
                  <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(selectedEmployee
                  ? reportsList.filter(r => r.employee?.toLowerCase() === selectedEmployee.toLowerCase() || r.enteredBy?.toLowerCase() === selectedEmployee.toLowerCase())
                  : reportsList
                ).map((r, idx) => (
                  <tr key={r.id || idx} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3 text-slate-400 font-semibold">{String(idx + 1).padStart(2, '0')}</td>
                    <td className="px-5 py-3 font-semibold text-slate-800">{r.title}</td>
                    <td className="px-5 py-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {r.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-700">{r.employee}</td>
                    <td className="px-5 py-3 text-slate-500">{r.date}</td>
                    <td className="px-5 py-3 text-slate-500 max-w-xs truncate" title={r.remark}>{r.remark || '—'}</td>
                    <td className="px-5 py-3 text-slate-700 font-medium">{r.enteredBy || r.employee}</td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{r.enteredTime || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        r.status === 'Completed' ? 'bg-green-50 text-green-700' :
                        r.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {r.status || 'Submitted'}
                      </span>
                    </td>
                  </tr>
                ))}
                {((selectedEmployee
                  ? reportsList.filter(r => r.employee?.toLowerCase() === selectedEmployee.toLowerCase() || r.enteredBy?.toLowerCase() === selectedEmployee.toLowerCase())
                  : reportsList
                ).length === 0) && (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400 font-medium">
                      No KPI submissions found for this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================== */}
      {/* EMPLOYEE LIST */}
      {/* ===================================== */}

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">

              Employees

            </h2>

            <p className="text-slate-500 mt-1">

              Recent employee details

            </p>

          </div>

          <button
            onClick={fetchEmployees}
            className="bg-blue-600 text-white px-5 py-3 rounded-2xl text-sm hover:bg-blue-700 transition shadow-lg"
          >

            Refresh

          </button>

        </div>

        {/* ===================================== */}
        {/* LOADING */}
        {/* ===================================== */}

        {
          loading ? (

            <div className="text-center py-10 text-slate-500">

              Loading Employees...

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-200 text-left">

                    <th className="py-4 text-slate-600">
                      Name
                    </th>

                    <th className="py-4 text-slate-600">
                      Email
                    </th>

                    <th className="py-4 text-slate-600">
                      Phone
                    </th>

                    <th className="py-4 text-slate-600">
                      Department
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {
                    Array.isArray(employees) &&

                    employees.length > 0 ? (

                      employees.map((employee) => (

                        <tr
                          key={employee.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-all"
                        >

                          <td className="py-5 font-medium text-slate-800">

                            {employee.name}

                          </td>

                          <td className="py-5 text-slate-600">

                            {employee.email}

                          </td>

                          <td className="py-5 text-slate-600">

                            {
                              employee.phone ||
                              '-'
                            }

                          </td>

                          <td className="py-5 text-slate-600">

                            {
                              employee.department ||
                              '-'
                            }

                          </td>

                        </tr>

                      ))

                    ) : (

                      <tr>

                        <td
                          colSpan={4}
                          className="text-center py-10 text-slate-400"
                        >

                          No Employees Found

                        </td>

                      </tr>

                    )
                  }

                </tbody>

              </table>

            </div>

          )
        }

      </div>

    </div>
  )
}