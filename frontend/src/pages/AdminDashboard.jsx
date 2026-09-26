import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LogOut, Eye, CheckCircle, Clock, AlertCircle, TrendingUp, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ComplaintDetailModal from '../components/ComplaintDetailModal';
import { API_BASE_URL } from '../config/api';

const AdminDashboard = () => {
  const { admin, setAdmin } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resolvingId, setResolvingId] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();

  // Analytics data
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    rejected: 0,
    byPriority: {},
    byDepartment: {},
    dailyTrend: []
  });

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [admin, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminInfo_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.get(
        `${API_BASE_URL}/admin/complaints`,
        config
      );

      if (response.data.success) {
        setComplaints(response.data.complaints);
        calculateStats(response.data.complaints);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading complaints');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const statsByStatus = {
      pending: 0,
      inProgress: 0,
      resolved: 0,
      rejected: 0
    };
    
    const byPriority = { 'High': 0, 'Medium': 0, 'Low': 0 };
    const byDepartment = {};
    
    data.forEach(complaint => {
      statsByStatus[complaint.status.toLowerCase().replace('-', '')] = 
        (statsByStatus[complaint.status.toLowerCase().replace('-', '')] || 0) + 1;
      
      byPriority[complaint.priority] = (byPriority[complaint.priority] || 0) + 1;
      
      const dept = complaint.department || 'Unassigned';
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
    });

    setStats({
      total: data.length,
      pending: statsByStatus.pending || 0,
      inProgress: statsByStatus.inProgress || statsByStatus.inprogress || 0,
      resolved: statsByStatus.resolved || 0,
      rejected: statsByStatus.rejected || 0,
      byPriority: Object.entries(byPriority).map(([name, value]) => ({ name, value })),
      byDepartment: Object.entries(byDepartment).map(([name, value]) => ({ name, value })),
      dailyTrend: generateTrendData(data)
    });
  };

  const generateTrendData = (data) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      
      const count = data.filter(c => {
        const submittedDate = new Date(c.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
        return submittedDate === dateStr;
      }).length;
      
      last7Days.push({ date: dateStr, complaints: count });
    }
    return last7Days;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminInfo_token');
    localStorage.removeItem('adminInfo_admin');
    setAdmin(null);
    navigate('/admin/login');
  };

  const handleResolve = async (complaint) => {
    if (complaint.status === 'Resolved' || resolvingId) return;

    try {
      setResolvingId(complaint._id);
      setError('');
      setSuccess('');
      const token = localStorage.getItem('adminInfo_token');
      const response = await axios.patch(
        `${API_BASE_URL}/complaints/${complaint._id}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedComplaint = response.data.complaint;
        const updatedComplaints = complaints.map(item =>
          item._id === updatedComplaint._id ? updatedComplaint : item
        );
        setComplaints(updatedComplaints);
        calculateStats(updatedComplaints);
        setSelectedComplaint(current =>
          current?._id === updatedComplaint._id ? updatedComplaint : current
        );
        setSuccess('Complaint marked as resolved.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error resolving complaint');
    } finally {
      setResolvingId(null);
    }
  };

  const filteredComplaints = filterStatus === 'All' 
    ? complaints 
    : complaints.filter(c => c.status === filterStatus);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black">Admin Dashboard</h1>
              <p className="text-blue-100 text-sm mt-2">JanSathi Grievance Management System</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 mb-2">Welcome back</p>
              <p className="text-xl font-bold">{admin?.name}</p>
              <p className="text-xs text-blue-100 mt-1 bg-blue-800 px-3 py-1 rounded-full inline-block">Role: {admin?.role}</p>
            </div>
          </div>
        </div>

        {/* Admin Info Bar */}
        <div className="bg-blue-800 px-4 sm:px-6 lg:px-8 py-3 border-t border-blue-700">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
            <div>
              <span className="text-blue-100">Area: </span>
              <span className="text-white font-bold">{admin?.assignedState || admin?.assignedDistrict || 'National'}</span>
            </div>
            <div>
              <span className="text-blue-100">Department: </span>
              <span className="text-white font-bold">{admin?.assignedDepartment || 'All'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
            <p className="mt-4 text-gray-600 font-bold">Loading complaints...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Grievances', count: stats.total, color: 'blue', icon: '📋' },
                { label: 'Pending', count: stats.pending, color: 'yellow', icon: '⏳' },
                { label: 'In Progress', count: stats.inProgress, color: 'purple', icon: '⚙️' },
                { label: 'Resolved', count: stats.resolved, color: 'green', icon: '✅' },
                { label: 'Rejected', count: stats.rejected, color: 'red', icon: '❌' }
              ].map((stat, i) => (
                <div key={i} className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${stat.color}-500 hover:shadow-lg transition`}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-800 mt-2">{stat.count}</p>
                </div>
              ))}
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Priority Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Grievance by Priority
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.byPriority}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {stats.byPriority.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Grievances by Department
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.byDepartment}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{fontSize: 12}} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 7-Day Trend */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 lg:col-span-2">
                <h3 className="text-lg font-black text-gray-800 mb-6">7-Day Grievance Trend</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.dailyTrend}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="complaints" stroke="#3b82f6" strokeWidth={3} dot={{fill: '#3b82f6', r: 5}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Complaints Table */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              {/* Filter Buttons */}
              <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap gap-2">
                {['All', 'Pending', 'In-Progress', 'Resolved', 'Rejected'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                      filterStatus === status
                        ? 'bg-blue-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b text-gray-700 text-xs font-black uppercase sticky top-0">
                    <tr>
                      <th className="px-6 py-4">Tracking ID</th>
                      <th className="px-6 py-4">Citizen Name</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Department</th>
                      <th className="px-6 py-4">Priority</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredComplaints.length > 0 ? (
                      filteredComplaints.map(complaint => (
                        <tr key={complaint._id} className="hover:bg-blue-50 transition">
                          <td className="px-6 py-4 font-mono font-bold text-blue-700">{complaint.trackingId}</td>
                          <td className="px-6 py-4 font-semibold text-gray-800">{complaint.citizenMetadata?.name || 'N/A'}</td>
                          <td className="px-6 py-4 text-gray-700">{complaint.citizenMetadata?.phone || 'N/A'}</td>
                          <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{complaint.title}</td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                              {complaint.department}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              complaint.priority === 'High' ? 'bg-red-100 text-red-700' :
                              complaint.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {complaint.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                              complaint.status === 'In-Progress' ? 'bg-blue-100 text-blue-700' :
                              complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {complaint.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => setSelectedComplaint(complaint)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </button>
                              {complaint.status === 'Resolved' ? (
                                <span className="text-green-700 font-bold px-2 py-2 flex items-center gap-1">
                                  <CheckCircle className="w-4 h-4" />
                                  Resolved
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleResolve(complaint)}
                                  disabled={resolvingId !== null}
                                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-3 py-2 rounded-lg font-bold transition flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  {resolvingId === complaint._id ? 'Resolving...' : 'Mark as Resolved'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center text-gray-600">
                          No complaints found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          onUpdate={() => {
            setSelectedComplaint(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
