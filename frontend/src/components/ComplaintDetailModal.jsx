import React, { useState } from 'react';
import axios from 'axios';
import { X, Check, AlertCircle, Clock, CheckCircle, Phone, Mail, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const ComplaintDetailModal = ({ complaint, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resolutionData, setResolutionData] = useState({
    status: complaint.status,
    remarks: '',
    resolution: ''
  });

  const handleStatusChange = (e) => {
    setResolutionData({ ...resolutionData, status: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminInfo_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.put(
        `${API_BASE_URL}/admin/update-status/${complaint._id}`,
        resolutionData,
        config
      );

      if (response.data.success) {
        setSuccess('Complaint updated successfully!');
        setTimeout(() => {
          onUpdate();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating complaint');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'In-Progress':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">Complaint Details</h2>
            <p className="text-blue-100 text-sm">ID: {complaint.trackingId}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 p-2 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-green-700">{success}</span>
            </div>
          )}

          {/* Status Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6 border border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Current Status</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-bold text-sm ${getStatusColor(complaint.status)}`}>
                  {complaint.status === 'Resolved' && <CheckCircle className="w-4 h-4" />}
                  {complaint.status === 'In-Progress' && <Clock className="w-4 h-4" />}
                  {complaint.status === 'Pending' && <Clock className="w-4 h-4" />}
                  {complaint.status === 'Rejected' && <AlertCircle className="w-4 h-4" />}
                  {complaint.status}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Priority</p>
                <p className="text-lg font-bold text-gray-800">{complaint.priority}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Department</p>
                <p className="text-lg font-bold text-gray-800">{complaint.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Date Submitted</p>
                <p className="text-sm font-bold text-gray-800">
                  {new Date(complaint.submittedAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Citizen Information */}
          <div className="mb-6">
            <h3 className="text-lg font-black text-gray-800 mb-4 uppercase">Citizen Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">👤</span>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Full Name</p>
                  <p className="font-bold text-gray-800">{complaint.citizenMetadata?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Mobile Number</p>
                  <p className="font-bold text-gray-800">{complaint.citizenMetadata?.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Email Address</p>
                  <p className="font-bold text-gray-800 break-all">{complaint.citizenMetadata?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🆔</span>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">Aadhaar Number</p>
                  <p className="font-bold text-gray-800">XXXX-XXXX-{complaint.citizenMetadata?.aadhaar?.slice(-4) || 'XXXX'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-6">
            <h3 className="text-lg font-black text-gray-800 mb-4 uppercase flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Location Details
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">State</p>
                  <p className="font-bold text-gray-800">{complaint.state}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">District</p>
                  <p className="font-bold text-gray-800">{complaint.district}</p>
                </div>
                {complaint.location && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Specific Location</p>
                    <p className="font-bold text-gray-800">{complaint.location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Complaint Description */}
          <div className="mb-6">
            <h3 className="text-lg font-black text-gray-800 mb-4 uppercase">Complaint Description</h3>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-sm font-bold text-gray-700 mb-2">{complaint.title}</p>
              <p className="text-gray-700 leading-relaxed">{complaint.description}</p>
              {complaint.imageUrl && (
                <div className="mt-4">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Attached Image</p>
                  <img src={complaint.imageUrl} alt="Complaint evidence" className="max-w-xs rounded-lg border border-gray-300" />
                </div>
              )}
            </div>
          </div>

          {/* Action Timeline */}
          {complaint.actionLog && complaint.actionLog.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-black text-gray-800 mb-4 uppercase">Action Timeline</h3>
              <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
                {complaint.actionLog.map((log, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-bold text-gray-800">{log.action}</p>
                      <p className="text-sm text-gray-600 mt-1">{log.remarks}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(log.timestamp).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Update Status Form */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-black text-gray-800 mb-4 uppercase">Update Complaint Status</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Status Dropdown */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Status</label>
                <select
                  value={resolutionData.status}
                  onChange={handleStatusChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-semibold"
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Action Remarks</label>
                <textarea
                  value={resolutionData.remarks}
                  onChange={(e) => setResolutionData({ ...resolutionData, remarks: e.target.value })}
                  placeholder="Add any remarks or notes about this action..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-semibold"
                  rows="3"
                />
              </div>

              {/* Resolution Details (if Resolved) */}
              {resolutionData.status === 'Resolved' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Resolution Details</label>
                  <textarea
                    value={resolutionData.resolution}
                    onChange={(e) => setResolutionData({ ...resolutionData, resolution: e.target.value })}
                    placeholder="Describe how the grievance was resolved..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-semibold"
                    rows="3"
                    required
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-black uppercase transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {loading ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-black uppercase transition"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailModal;
