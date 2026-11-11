import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [clearance, setClearance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    fetchClearanceStatus();
  }, []);

  const fetchClearanceStatus = async () => {
    try {
      const res = await api.get('/clearance/my-status');
      if (res.data?.success) {
        setClearance(res.data.data);
      }
    } catch (err) {
      console.log('No existing clearance or error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    if (!clearance) return;
    setDownloading(true);
    try {
      const res = await api.get(`/clearance/${clearance.clearance_id}/download-pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `UETM_Clearance_Certificate_${user?.registration_no || clearance.clearance_id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Certificate is only available once all 8 departments approve your clearance.');
    } finally {
      setDownloading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>Approved</span>;
      case 'rejected':
        return <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>Rejected</span>;
      case 'in_progress':
      case 'pending':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>In Progress</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-semibold capitalize">{status || 'Draft'}</span>;
    }
  };

  const isCompleted = clearance?.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-[#00173b] to-[#0a2b5c] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>UET Mardan Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Reg No: <span className="font-semibold text-white">{user?.registration_no || '2021-SE-101'}</span> | Department of Computer Software Engineering
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {!clearance ? (
              <Link
                to="/student/apply"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-[#00173b] px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition"
              >
                <span className="material-symbols-outlined text-xl">description</span>
                <span>Initiate Clearance Application</span>
              </Link>
            ) : isCompleted ? (
              <button
                onClick={handleDownloadCertificate}
                disabled={downloading}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">download</span>
                <span>{downloading ? 'Preparing Certificate...' : 'Download Official Certificate (PDF)'}</span>
              </button>
            ) : (
              <div className="inline-flex items-center gap-2 bg-white/10 text-slate-200 border border-white/20 px-4 py-2 rounded-xl text-xs font-medium">
                <span className="material-symbols-outlined text-amber-400 text-lg">pending</span>
                <span>Clearance in progress across 8 departments</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STUDENT STEP-BY-STEP USER GUIDE */}
      <div className="bg-white rounded-xl shadow-xs border border-blue-200 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">help_outline</span>
            <h3 className="font-bold text-slate-900 text-sm">Student Quick Clearance Guide (How It Works)</h3>
          </div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
          >
            {showGuide ? 'Collapse Guide' : 'Expand Guide'}
          </button>
        </div>

        {showGuide && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 flex gap-2.5">
              <span className="font-bold text-blue-700 bg-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-blue-200 shadow-xs">1</span>
              <div>
                <p className="font-bold text-slate-800 mb-0.5">Apply Online</p>
                <p className="text-slate-600">Click Apply Clearance, fill your CGPA, session & attach your CV and paid fee challan scan.</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 flex gap-2.5">
              <span className="font-bold text-indigo-700 bg-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-indigo-200 shadow-xs">2</span>
              <div>
                <p className="font-bold text-slate-800 mb-0.5">Parallel Verification</p>
                <p className="text-slate-600">Your application is sent simultaneously to 8 departments: Accounts, Library, Hostel, FYP, Store, Transport, Admission & CLO.</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100 flex gap-2.5">
              <span className="font-bold text-amber-700 bg-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-amber-200 shadow-xs">3</span>
              <div>
                <p className="font-bold text-slate-800 mb-0.5">Real-Time Tracking</p>
                <p className="text-slate-600">Check this dashboard anytime to see which officers approved and view any feedback remarks.</p>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100 flex gap-2.5">
              <span className="font-bold text-emerald-700 bg-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 border border-emerald-200 shadow-xs">4</span>
              <div>
                <p className="font-bold text-slate-800 mb-0.5">Certificate Download</p>
                <p className="text-slate-600">When all 8 departments approve, your official signed Clearance Certificate PDF is generated instantly.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Completion Banner if Approved */}
      {isCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">verified</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">Degree Clearance Approved & Finalized</h3>
              <p className="text-xs text-emerald-800">All 8 administrative departments have officially granted clearance. Your degree issuance file is ready.</p>
            </div>
          </div>
          <button
            onClick={handleDownloadCertificate}
            disabled={downloading}
            className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">picture_as_pdf</span>
            <span>Download Certificate PDF</span>
          </button>
        </div>
      )}

      {/* Clearance Overview Card */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined">assignment_turned_in</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Parallel Departmental Clearance Status</h2>
              <p className="text-xs text-slate-500">Live verification across 8 administrative offices</p>
            </div>
          </div>
          {clearance && getStatusBadge(clearance.status)}
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading clearance records...</p>
          </div>
        ) : !clearance ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-3xl">inbox</span>
            </div>
            <h3 className="text-base font-semibold text-slate-800">No active clearance application</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              You haven't initiated your degree clearance yet. Start the process now to send parallel verification requests to all 8 university offices.
            </p>
            <Link
              to="/student/apply"
              className="inline-flex items-center gap-2 bg-[#00173b] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0a2b5c] transition"
            >
              Start Application
            </Link>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {clearance.departmentReviews?.map((rev) => (
                <div
                  key={rev.review_id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">{rev.department?.name || 'Department'}</span>
                    {getStatusBadge(rev.status)}
                  </div>
                  <div className="mt-3 text-xs text-slate-500">
                    {rev.remarks ? (
                      <p className="italic text-slate-600 bg-white p-2 rounded border border-slate-200">
                        "{rev.remarks}"
                      </p>
                    ) : (
                      <span>Pending departmental inspection</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
