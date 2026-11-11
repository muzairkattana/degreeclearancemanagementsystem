import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clearance/officer/pending');
      if (res.data?.success) {
        setQueue(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    if (!selectedReview) return;
    setActionLoading(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await api.put(`/clearance/officer/review/${selectedReview.review_id}`, {
        status, // 'approved' or 'rejected'
        remarks: remarks || (status === 'approved' ? 'All dues cleared, approved.' : 'Dues pending.'),
      });

      if (res.data?.success) {
        setMsg({ text: `Application ${status} successfully!`, type: 'success' });
        setSelectedReview(null);
        setRemarks('');
        fetchQueue();
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Action failed', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Officer Verification Queue</h1>
          <p className="text-sm text-slate-500">
            Assigned Department: <span className="font-semibold text-slate-800">{user?.department?.name || 'Department Reviewer'}</span>
          </p>
        </div>
        <button
          onClick={fetchQueue}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          <span>Refresh Queue</span>
        </button>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
          msg.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <span className="material-symbols-outlined">{msg.type === 'success' ? 'check_circle' : 'error'}</span>
          <span>{msg.text}</span>
        </div>
      )}

      {/* Pending Table / Cards */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">Pending Student Clearances ({queue.length})</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Fetching pending departmental items...</p>
          </div>
        ) : queue.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">verified</span>
            <p className="text-sm font-medium">All cleared! No pending requests for your department.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Clearance ID</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Reg No</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queue.map((item) => (
                  <tr key={item.review_id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-800">#{item.clearance_id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.clearanceRequest?.student?.full_name || 'Student'}</td>
                    <td className="px-6 py-4 text-xs font-mono">{item.clearanceRequest?.student?.registration_no || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 capitalize">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedReview(item)}
                        className="px-3 py-1.5 rounded-lg bg-[#00173b] hover:bg-[#0a2b5c] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal Dialog */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Review Clearance Request #{selectedReview.clearance_id}</h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
              <p><strong className="text-slate-700">Student:</strong> {selectedReview.clearanceRequest?.student?.full_name}</p>
              <p><strong className="text-slate-700">Registration No:</strong> {selectedReview.clearanceRequest?.student?.registration_no}</p>
              <p><strong className="text-slate-700">Department Being Cleared:</strong> {user?.department?.name}</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Official Remarks / Clearance Notes
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Books returned, laboratory equipment verified, no outstanding liability."
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleAction('rejected')}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                Reject (Outstanding Dues)
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleAction('approved')}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                Approve & Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
