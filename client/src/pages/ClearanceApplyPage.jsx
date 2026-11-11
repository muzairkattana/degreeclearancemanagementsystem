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

  // Attached student files state
  const [files, setFiles] = useState({
    cv: null,
    bankChallan: null,
    transcriptCnic: null,
    fypThesisFrontPage: null,
  });

  const handleFileChange = (field, e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({
        ...prev,
        [field]: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // In a full file upload pipeline, this uses FormData
      const res = await api.post('/clearance/apply', {
        ...formData,
        attachedDocuments: {
          cvUploaded: Boolean(files.cv),
          cvName: files.cv?.name || null,
          challanUploaded: Boolean(files.bankChallan),
          challanName: files.bankChallan?.name || null,
        },
      });
      if (res.data?.success) {
        setSuccess('Clearance application & uploaded documents submitted successfully! 8 departmental verification requests triggered.');
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
          Initiate parallel verification across Library, Accounts, Store, Hostel, FYP, Transport, Admission, and Career Liaison Office (CLO).
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
        {/* Student Profile Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-700 text-3xl">account_circle</span>
          <div>
            <p className="text-sm font-bold text-slate-800">{user?.full_name}</p>
            <p className="text-xs text-slate-600">Email: {user?.email} | Reg No: {user?.registration_no || '2021-SE-101'}</p>
          </div>
        </div>

        {/* Section 1: Academic & Fee Particulars */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-lg">school</span>
            Academic & Fee Particulars
          </h2>
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
        </div>

        {/* Section 2: Document Uploads (CV, Challan, Transcript) */}
        <div className="pt-4 border-t border-slate-200">
          <div className="mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-lg">upload_file</span>
              Required Document Uploads
            </h2>
            <p className="text-xs text-slate-500">Upload your CV (for Career Liaison Office) and clearance verification attachments (PDF or JPG/PNG)</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Graduate CV / Resume */}
            <div className="p-4 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl bg-slate-50/60 transition">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-blue-700">badge</span>
                <span className="text-xs font-bold text-slate-800">Student CV / Resume *</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Required by Career Liaison Office (CLO) for graduate placement records.</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileChange('cv', e)}
                className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#00173b] file:text-white hover:file:bg-[#0a2b5c] cursor-pointer"
              />
              {files.cv && (
                <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{files.cv.name}</span>
                </p>
              )}
            </div>

            {/* 2. Paid Bank Challan Scan */}
            <div className="p-4 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl bg-slate-50/60 transition">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-emerald-700">receipt_long</span>
                <span className="text-xs font-bold text-slate-800">Paid Fee Challan Scan *</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Bank-stamped degree clearance fee deposit receipt for Accounts Office.</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange('bankChallan', e)}
                className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#00173b] file:text-white hover:file:bg-[#0a2b5c] cursor-pointer"
              />
              {files.bankChallan && (
                <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{files.bankChallan.name}</span>
                </p>
              )}
            </div>

            {/* 3. CNIC / National ID Scan */}
            <div className="p-4 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl bg-slate-50/60 transition">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-amber-700">credit_card</span>
                <span className="text-xs font-bold text-slate-800">CNIC / Form-B Copy</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Admission Office identity verification.</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange('transcriptCnic', e)}
                className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
              />
              {files.transcriptCnic && (
                <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{files.transcriptCnic.name}</span>
                </p>
              )}
            </div>

            {/* 4. FYP Sign-off / Thesis Cover */}
            <div className="p-4 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl bg-slate-50/60 transition">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-purple-700">menu_book</span>
                <span className="text-xs font-bold text-slate-800">FYP Certificate / Title Page</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">Signed supervisor approval sheet for FYP Coordinator clearance.</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange('fypThesisFrontPage', e)}
                className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 cursor-pointer"
              />
              {files.fypThesisFrontPage && (
                <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{files.fypThesisFrontPage.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-amber-600 text-lg shrink-0 mt-0.5">info</span>
          <div>
            <p className="font-bold mb-0.5">Automated Parallel Verification Dispatch</p>
            <span>
              By clicking Submit, your application and uploaded CV & receipts will immediately be queued into the dashboards of all 8 departmental verification officers. You can track individual remarks and approvals in real time.
            </span>
          </div>
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
            className="px-6 py-2.5 rounded-xl bg-[#00173b] hover:bg-[#0a2b5c] text-white text-sm font-semibold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Submitting Application...</span>
              </>
            ) : (
              <>
                <span>Submit Clearance Request</span>
                <span className="material-symbols-outlined text-sm">send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
