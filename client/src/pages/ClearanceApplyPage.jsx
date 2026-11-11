import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ClearanceApplyPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    session: '2021-2025',
    cgpa: '3.65',
    challanNo: 'CH-98124',
    feeAmount: '3500',
    receiptDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/clearance/apply', {
        ...formData,
      });
      if (res.data?.success) {
        setSuccess('Clearance application submitted successfully! 8 departmental verification requests triggered.');
        setTimeout(() => {
          navigate('/student');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Apply for Degree Clearance</h1>
        <p className="text-sm text-slate-500 mt-1">
          Initiate parallel verification across Library, Accounts, Store, Hostel, FYP, Transport, Admission, and CLO.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-red-500">error</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-500">check_circle</span>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-700 text-2xl">account_circle</span>
          <div>
            <p className="text-sm font-bold text-slate-800">{user?.full_name}</p>
            <p className="text-xs text-slate-600">Email: {user?.email} | Reg No: {user?.registration_no || '2021-SE-101'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Graduation Batch / Session</label>
            <input
              type="text"
              value={formData.session}
              onChange={(e) => setFormData({ ...formData, session: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Final CGPA</label>
            <input
              type="text"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Degree Fee Bank Challan No.</label>
            <input
              type="text"
              value={formData.challanNo}
              onChange={(e) => setFormData({ ...formData, challanNo: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Challan Paid Amount (PKR)</label>
            <input
              type="number"
              value={formData.feeAmount}
              onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
          <span className="material-symbols-outlined text-amber-600 text-lg shrink-0">info</span>
          <span>
            By clicking Submit, your application will immediately be queued into the dashboards of all 8 departmental verification officers. You can track remarks and approvals in real-time.
          </span>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/student')}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-[#00173b] hover:bg-[#0a2b5c] text-white text-sm font-semibold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Clearance Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
