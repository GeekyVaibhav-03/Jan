import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('/api/complaints/my-complaints', config);
        setComplaints(data.complaints || []);
        prepareChart(data.complaints || []);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchData();
  }, [token]);

  const prepareChart = (data) => {
    const counts = {};
    const key = 'department';
    data.forEach(item => {
      const val = item[key] || 'Not Assigned';
      counts[val] = (counts[val] || 0) + 1;
    });
    setChartData(Object.keys(counts).map(k => ({ name: k, count: counts[k] })));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Sub-Header */}
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <h2 className="text-xl font-bold text-gray-700">Administrative Dashboard</h2>
        <div className="flex gap-4 text-sm">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">Role: {user.role}</span>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold">Area: {user.assignedDistrict || user.assignedState || 'National'}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Grievances', count: complaints.length, color: 'border-blue-600', icon: '📋' },
            { label: 'Pending', count: complaints.filter(c => c.status === 'Pending').length, color: 'border-orange-500', icon: '⏳' },
            { label: 'Resolved', count: complaints.filter(c => c.status === 'Resolved').length, color: 'border-green-600', icon: '✅' },
            { label: 'In-Progress', count: complaints.filter(c => c.status === 'In-Progress').length, color: 'border-purple-600', icon: '⚙️' },
          ].map((stat, i) => (
            <div key={i} className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${stat.color}`}>
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-800">{stat.count}</h3>
            </div>
          ))}
        </div>

        {/* Charts & Analytics */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-10 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-700 mb-6 uppercase tracking-wider border-b pb-3">Grievance Distribution Analytics</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="count" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint List Table */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] border-b text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-bold">Tracking ID</th>
                <th className="px-6 py-4 font-bold">Citizen Name</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold">State/District</th>
                <th className="px-6 py-4 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.map((c) => (
                <tr key={c._id} className="hover:bg-blue-50 transition cursor-pointer">
                  <td className="px-6 py-4 font-mono font-bold text-blue-700">{c.trackingId}</td>
                  <td className="px-6 py-4 font-medium">{user?.name || 'Citizen'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded text-[10px] font-black uppercase ${
                      c.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                      c.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.state} / {c.district}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;