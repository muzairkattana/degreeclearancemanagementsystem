import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminGuide, setShowAdminGuide] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, requestsRes] = await Promise.all([
        api.get('/clearance/analytics'),
        api.get('/clearance/admin/all'),
      ]);
      if (analyticsRes.data?.success) {
        setStats(analyticsRes.data.data);
      }
      if (requestsRes.data?.success) {
        setRequests(requestsRes.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCert = async (clearanceId, studentName) => {
    try {
      const res = await api.get(`/clearance/${clearanceId}/download-pdf`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `UETM_Clearance_${studentName.replace(/\s+/g, '_')}_#${clearanceId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Certificate is available for completed clearances.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Institutional Administration & Audit</h1>
          <p className="text-sm text-slate-500">System metrics, clearance pipelines, and issuance tracking</p>
        </div>
        <button
          onClick={fetchAdminData}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Applications</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats?.totalApplications ?? requests.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">In Progress</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{stats?.inProgressApplications ?? 3}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Fully Cleared</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats?.completedApplications ?? 2}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">verified</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Departments Active</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">8</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">corporate_fare</span>
          </div>
        </div>
      </div>

      {/* INSTITUTIONAL ADMIN & CONTROLLER AUDIT GUIDE */}
      <div className="bg-white rounded-xl shadow-xs border border-purple-200 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-700">admin_panel_settings</span>
            <h3 className="font-bold text-slate-900 text-sm">Controller & Administrator Operations Guide</h3>
          </div>
          <button
            onClick={() => setShowAdminGuide(!showAdminGuide)}
            className="text-xs text-purple-600 hover:underline font-medium cursor-pointer"
          >
            {showAdminGuide ? 'Collapse Guide' : 'Expand Guide'}
          </button>
        </div>

        {showAdminGuide && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-blue-600 text-base">monitoring</span>
                <p className="font-bold text-slate-800">Clearance Pipeline Monitoring</p>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Track all university student clearance workflows in real time. Observe departmental bottlenecks and track pending departmental approvals.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-emerald-700 text-base">verified_user</span>
                <p className="font-bold text-emerald-900">Certificate Verification & Printing</p>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                When an application reaches 8/8 approvals, the Examination Branch can generate, audit, and print the official degree clearance certificate with verification ID.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-purple-50/70 border border-purple-200">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="material-symbols-outlined text-purple-700 text-base">manage_accounts</span>
                <p className="font-bold text-purple-900">Eligibility & Registrations</p>
              </div>
              <p className="text-purple-800 leading-relaxed">
                Review graduation lists and batch-import eligible graduates via registrar CSV records to maintain strict security over degree clearance applications.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Recent Degree Clearance Applications</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Loading applications...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p className="text-sm">No clearance applications submitted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Reg No</th>
                  <th className="px-6 py-3">Department Approvals</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => {
                  const completed = r.progress ? r.progress.completed : (r.status === 'completed' ? 8 : 0);
                  const total = r.progress ? r.progress.total : 8;
                  const percentage = r.progress ? r.progress.percentage : (r.status === 'completed' ? 100 : 0);
                  const isDone = r.status === 'completed' || completed === total;

                  return (
                    <tr key={r.clearance_id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-800">#{r.clearance_id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{r.student?.full_name}</td>
                      <td className="px-6 py-4 text-xs font-mono">{r.student?.registration_no}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isDone ? 'bg-emerald-500' : completed > 0 ? 'bg-blue-600' : 'bg-slate-300'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-bold ${isDone ? 'text-emerald-700' : 'text-slate-700'}`}>
                            {completed}/{total}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isDone ? (
                          <button
                            onClick={() => handleDownloadCert(r.clearance_id, r.student?.full_name || 'Student')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00173b] hover:bg-[#0a2b5c] text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[15px]">download</span>
                            <span>Certificate</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Pending Reviews</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
