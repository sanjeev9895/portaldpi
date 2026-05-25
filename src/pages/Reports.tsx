import { useState } from 'react';

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
} from 'lucide-react';

interface Report {
  id: number;
  title: string;
  category: string;
  employee: string;
  date: string;
  status: string;
}
export default function Reports() {

  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      title: 'Daily Work Report',
      category: 'Development',
      employee: 'Karthikeyan',
      date: '2026-05-14',
      status: 'Submitted',
    },

    {
      id: 2,
      title: 'Attendance Summary',
      category: 'HR',
      employee: 'Arun Kumar',
      date: '2026-05-13',
      status: 'Pending',
    },

    {
      id: 3,
      title: 'UI Progress Report',
      category: 'Design',
      employee: 'Vignesh',
      date: '2026-05-12',
      status: 'Completed',
    },
  ]);

  const [search, setSearch] = useState('');

  // Status Filter
  const [status, setStatus] = useState('All Reports');

  // Add/Edit Modal
  const [open, setOpen] = useState(false);

  // Delete Modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Edit
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [employee, setEmployee] = useState('');
  const [date, setDate] = useState('');

  // Save Report
  const handleSaveReport = () => {

    if (
      !title.trim() ||
      !category.trim() ||
      !employee.trim() ||
      !date.trim()
    ) {
      return;
    }

    // Update
    if (isEdit && editId !== null) {

      const updatedReports = reports.map((report) =>

        report.id === editId
          ? {
              ...report,
              title,
              category,
              employee,
              date,
            }
          : report
      );

      setReports(updatedReports);

    } else {

      // Add
      const newReport = {
        id: Date.now(),
        title,
        category,
        employee,
        date,
        status: 'Submitted',
      };

      setReports([newReport, ...reports]);
    }

    // Reset
    setTitle('');
    setCategory('');
    setEmployee('');
    setDate('');

    setEditId(null);
    setIsEdit(false);

    setOpen(false);
  };

  // Edit
  const handleEdit = (report: Report) => {

    setTitle(report.title);
    setCategory(report.category);
    setEmployee(report.employee);
    setDate(report.date);

    setEditId(report.id);
    setIsEdit(true);

    setOpen(true);
  };

  // Delete
  const handleDelete = (id: number) => {

    const updatedReports = reports.filter(
      (report) => report.id !== id
    );

    setReports(updatedReports);

    setDeleteOpen(false);
    setDeleteId(null);
  };

  // Confirm Delete
  const confirmDelete = (id: number) => {

    setDeleteId(id);
    setDeleteOpen(true);
  };

  // Search + Filter
  const filteredReports = reports.filter((report) => {

    const matchesSearch =
      report.title.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === 'All Reports'
        ? true
        : report.status === status;

    return matchesSearch && matchesStatus;
  });

  const handleExportPDF = () => {

  window.print()
}

  return (

<div className="min-h-screen bg-slate-100 print-area">
  
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            Reports Management
          </h1>

          <p className="text-slate-500 mt-2">
            Create, manage and monitor employee reports
          </p>

        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">

          <button

  onClick={handleExportPDF}

  className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 px-5 py-3 rounded-2xl text-slate-700 font-medium transition"
>

  <Download size={18} />

  Export PDF

</button>
<style>

  {`

    @media print {

      body * {

        visibility: hidden;
      }

      .print-area,
      .print-area * {

        visibility: visible;
      }

      .print-area {

        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
    }

  `}
  
</style>

          <button
            onClick={() => {

              setOpen(true);

              setIsEdit(false);

              setTitle('');
              setCategory('');
              setEmployee('');
              setDate('');

            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow-sm transition"
          >

            <Plus size={20} />

            Create Report

          </button>

        </div>

      </div>
      
 {/* Search + Filter */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 mb-8">

        <div className="flex flex-col md:flex-row md:items-center gap-4">

          {/* Search */}
          <div className="flex items-center gap-3 flex-1 bg-slate-50 rounded-2xl px-4 py-3 border border-slate-200">

            <Search
              className="text-slate-400"
              size={20}
            />

            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />

          </div>

          {/* Status Filter */}
          <div className="min-w-[220px]">

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none text-slate-700 focus:border-blue-500 transition"
            >

              <option>
                All Reports
              </option>

              <option>
                Submitted
              </option>

              <option>
                Pending
              </option>

              <option>
                Completed
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

          <h2 className="text-slate-500 text-sm mb-2">
            Total Reports
          </h2>

          <h1 className="text-4xl font-bold text-slate-800">
            {reports.length}
          </h1>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

          <h2 className="text-slate-500 text-sm mb-2">
            Submitted
          </h2>

          <h1 className="text-4xl font-bold text-green-600">

            {
              reports.filter(
                (report) => report.status === 'Submitted'
              ).length
            }

          </h1>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

          <h2 className="text-slate-500 text-sm mb-2">
            Pending
          </h2>

          <h1 className="text-4xl font-bold text-orange-500">

            {
              reports.filter(
                (report) => report.status === 'Pending'
              ).length
            }

          </h1>

        </div>

      </div>

     

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

        {/* Table Header */}
        <div className="grid grid-cols-6 bg-slate-100 px-6 py-4 border-b border-slate-200">

          <h2 className="font-semibold text-slate-700">
            Report
          </h2>

          <h2 className="font-semibold text-slate-700">
            Category
          </h2>

          <h2 className="font-semibold text-slate-700">
            Employee
          </h2>

          <h2 className="font-semibold text-slate-700">
            Date
          </h2>

          <h2 className="font-semibold text-slate-700">
            Status
          </h2>

          <h2 className="font-semibold text-slate-700 text-center">
            Actions
          </h2>

        </div>

        {/* Table Body */}
        <div>

          {filteredReports.map((report) => (

            <div
              key={report.id}
              className="grid grid-cols-6 items-center px-6 py-5 border-b border-slate-100 hover:bg-slate-50 transition"
            >

              {/* Report */}
              <div className="flex items-center gap-4">

                <div className="bg-purple-100 p-3 rounded-2xl">

                  <FileText
                    className="text-purple-600"
                    size={22}
                  />

                </div>

                <div>

                  <h2 className="font-semibold text-slate-800">
                    {report.title}
                  </h2>

                  <p className="text-sm text-slate-500">
                    Report ID #{report.id}
                  </p>

                </div>

              </div>

              {/* Category */}
              <div>

                <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">

                  {report.category}

                </span>

              </div>

              {/* Employee */}
              <div className="text-slate-700 font-medium">
                {report.employee}
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-slate-600">

                <CalendarDays size={16} />

                <span>
                  {report.date}
                </span>

              </div>

              {/* Status */}
              <div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium
                    ${
                      report.status === 'Submitted'
                        ? 'bg-green-100 text-green-600'
                        : report.status === 'Pending'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-blue-100 text-blue-600'
                    }
                  `}
                >

                  {report.status}

                </span>

              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3">

                {/* View */}
                <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">

                  <Eye size={18} />

                </button>

                {/* Edit */}
                <button
                  onClick={() => handleEdit(report)}
                  className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
                >

                  <Pencil size={18} />

                </button>

                {/* Delete */}
                <button
                  onClick={() => confirmDelete(report.id)}
                  className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition"
                >

                  <Trash2 size={18} />

                </button>

              </div>

            </div>

          ))}

          {/* Empty */}
          {filteredReports.length === 0 && (

            <div className="p-12 text-center">

              <h2 className="text-2xl font-bold text-slate-700 mb-2">
                No Reports Found
              </h2>

              <p className="text-slate-500">
                Create reports to display here
              </p>

            </div>

          )}

        </div>

      </div>

      {/* Create/Edit Modal */}
      {open && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-slate-800">

                  {isEdit
                    ? 'Edit Report'
                    : 'Create Report'
                  }

                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Fill all report details
                </p>

              </div>

              <button
                onClick={() => setOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 p-2 rounded-xl"
              >

                <X size={20} />

              </button>

            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium text-slate-600 mb-2">

                  Report Title

                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter report title"
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-600 mb-2">

                  Category

                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category"
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-600 mb-2">

                  Employee Name

                </label>

                <input
                  type="text"
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value)}
                  placeholder="Enter employee name"
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-600 mb-2">

                  Date

                </label>

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:border-blue-500"
                />

              </div>

            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">

              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-2xl font-medium"
              >

                Cancel

              </button>

              <button
                onClick={handleSaveReport}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-medium"
              >

                {isEdit
                  ? 'Update Report'
                  : 'Create Report'
                }

              </button>

            </div>

          </div>

        </div>

      )}

      {/* Delete Modal */}
      {deleteOpen && (

        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">

            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Delete Report
            </h2>

            <p className="text-slate-500 mb-6">
              Are you sure you want to delete this report?
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setDeleteOpen(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-2xl font-medium"
              >

                Cancel

              </button>

              <button
                onClick={() => {
                  if (deleteId !== null) {
                    handleDelete(deleteId);
                  }
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-medium"
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