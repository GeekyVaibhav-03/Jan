import React, { useState } from 'react';
import axios from 'axios';
import { Search, AlertCircle, CheckCircle, Clock, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const TrackStatus = () => {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [complaint, setComplaint] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/complaints/track/${trackingId}`
      );

      if (response.data.success) {
        setComplaint(response.data.complaint);
      } else {
        setError(response.data.message || 'Grievance not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Tracking ID. Please check and try again.');
      setComplaint(null);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircle className="w-5 h-5" />;
      case 'In-Progress':
        return <Clock className="w-5 h-5" />;
      case 'Rejected':
        return <AlertCircle className="w-5 h-5" />;
      case 'Pending':
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Low':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-blue-900 mb-3 uppercase">Track Your Grievance</h1>
          <p className="text-gray-600 text-lg">Enter your tracking ID to view real-time status updates</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3 uppercase">Tracking ID</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => {
                      setTrackingId(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="e.g., JS-17294"
                    className="w-full px-6 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-lg font-semibold"
                  />
                  <Search className="absolute right-4 top-4 w-6 h-6 text-gray-400" />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-black transition disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {complaint && (
          <div className="space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-6 text-white">
                <h2 className="text-2xl font-black uppercase mb-4">Grievance Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-blue-100 text-xs uppercase font-semibold mb-1">Tracking ID</p>
                    <p className="text-2xl font-black tracking-widest">{complaint.trackingId}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs uppercase font-semibold mb-1">Status</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 font-bold ${getStatusColor(complaint.status)}`}>
                      {getStatusIcon(complaint.status)}
                      {complaint.status}
                    </div>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs uppercase font-semibold mb-1">Priority</p>
                    <p className={`inline-block px-3 py-1 rounded-full border text-sm font-bold ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-xs uppercase font-semibold mb-1">Department</p>
                    <p className="font-bold text-white">{complaint.department}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Submitted Date & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Submitted On</label>
                    <p className="text-lg font-bold text-gray-800">
                      {new Date(complaint.submittedAt).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Location</label>
                    <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-orange-500" />
                      {complaint.district}, {complaint.state}
                    </p>
                  </div>
                </div>

                {/* Complaint Description */}
                <div className="mb-8">
                  <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Your Complaint</label>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 leading-relaxed">{complaint.description}</p>
                  </div>
                </div>

                {/* Citizen Information */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="text-sm font-bold text-gray-700 uppercase mb-4">Registered Citizen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👤</span>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">Name</p>
                        <p className="font-bold text-gray-800">{complaint.citizenMetadata?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">Mobile</p>
                        <p className="font-bold text-gray-800">{complaint.citizenMetadata?.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">Email</p>
                        <p className="font-bold text-gray-800">{complaint.citizenMetadata?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🆔</span>
                      <div>
                        <p className="text-xs text-gray-600 font-semibold">Aadhaar</p>
                        <p className="font-bold text-gray-800">XXXX-XXXX-{complaint.citizenMetadata?.aadhaar?.slice(-4)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expected Resolution */}
                {complaint.expectedResolutionDate && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mb-8">
                    <p className="text-xs font-bold text-orange-700 uppercase mb-1">Expected Resolution Date</p>
                    <p className="text-lg font-bold text-orange-900">
                      {new Date(complaint.expectedResolutionDate).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-black text-gray-800 mb-8 uppercase">Action Timeline</h3>

              {complaint.actionLog && complaint.actionLog.length > 0 ? (
                <div className="space-y-0">
                  {complaint.actionLog.map((log, index) => (
                    <div key={index} className="relative pb-8 last:pb-0">
                      {/* Timeline Line */}
                      {index < complaint.actionLog.length - 1 && (
                        <div className="absolute left-6 top-12 bottom-0 w-1 bg-gradient-to-b from-blue-900 to-gray-300"></div>
                      )}

                      {/* Timeline Item */}
                      <div className="flex gap-6">
                        {/* Circle */}
                        <div className="relative z-10 flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                            log.status === 'Resolved' 
                              ? 'bg-green-500'
                              : log.status === 'Rejected'
                              ? 'bg-red-500'
                              : 'bg-blue-900'
                          }`}>
                            {log.status === 'Resolved' ? '✓' : log.status === 'Rejected' ? '✕' : index + 1}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-black text-gray-800 uppercase text-lg">{log.action}</h4>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(log.status)}`}>
                              {log.status}
                            </span>
                          </div>

                          {log.remarks && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-3">
                              <p className="text-sm text-gray-700">{log.remarks}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-gray-600 font-semibold">
                            <Clock className="w-4 h-4" />
                            {new Date(log.timestamp).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm">No action history available yet. Your grievance has been submitted and is pending initial review.</p>
                </div>
              )}
            </div>

            {/* Resolution Details */}
            {complaint.status === 'Resolved' && complaint.resolutionDetails && (
              <div className="bg-green-50 rounded-2xl shadow-lg p-8 border-2 border-green-200">
                <h3 className="text-xl font-black text-green-900 mb-4 uppercase flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" /> Resolution Details
                </h3>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-gray-800 leading-relaxed">{complaint.resolutionDetails}</p>
                </div>
                <p className="text-sm text-green-700 font-semibold mt-4">
                  Resolved on: {new Date(complaint.resolvedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            )}

            {complaint.status === 'Rejected' && (
              <div className="bg-red-50 rounded-2xl shadow-lg p-8 border-2 border-red-200">
                <h3 className="text-xl font-black text-red-900 mb-4 uppercase flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" /> Grievance Rejected
                </h3>
                <p className="text-gray-800 mb-4">Your grievance has been rejected. Please review the details and contact support if you believe this is an error.</p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition">
                  Contact Support
                </button>
              </div>
            )}

            {/* Help Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-lg font-black text-gray-800 mb-4 uppercase">Need Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-bold text-blue-900 mb-2">📞 Call Us</p>
                  <p className="text-sm text-gray-700">National Helpline: <span className="font-bold">1800-11-2026</span></p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-bold text-blue-900 mb-2">✉️ Email Us</p>
                  <p className="text-sm text-gray-700">support@jansathi.gov.in</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-bold text-blue-900 mb-2">🌐 Chat</p>
                  <p className="text-sm text-gray-700">24/7 Online Support Available</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Search Yet */}
        {!complaint && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">Enter your tracking ID above to view the status of your grievance</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackStatus;