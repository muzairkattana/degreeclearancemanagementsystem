import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {stats?.inProgressCount ?? requests.filter(r => r.status === 'in_progress').length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Fully Cleared</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {stats?.completedCount ?? requests.filter(r => r.status === 'completed' || r.status === 'approved').length}
            </h3>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((r) => {
                  const approvedCount = r.departmentReviews?.filter(rev => rev.status === 'approved').length || 0;
                  const totalCount = r.departmentReviews?.length || 8;
                  return (
                    <tr key={r.clearance_id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-800">#{r.clearance_id}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{r.student?.full_name}</td>
                      <td className="px-6 py-4 text-xs font-mono">{r.student?.registration_no}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all"
                              style={{ width: `${(approvedCount / totalCount) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{approvedCount}/{totalCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          r.status === 'completed' || r.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {r.status}
                        </span>
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
