import { useState } from 'react';
import axios from 'axios';

const UpdateStatusModal = ({ complaint, user, onClose, onRefresh }) => {
  const [status, setStatus] = useState(complaint.status);
  const [dept, setDept] = useState(complaint.departmentAssigned);
  const [remarks, setRemarks] = useState('');

  const handleUpdate = async () => {
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      await axios.put(`/api/complaints/admin/update/${complaint._id}`, {
        status,
        departmentAssigned: dept,
        remarks
      }, config);
      onRefresh();
      onClose();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Take Action: {complaint.trackingId}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Update Status</label>
            <select className="w-full p-2 border rounded" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In-Progress">In-Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assign Department</label>
            <select className="w-full p-2 border rounded" value={dept} onChange={e => setDept(e.target.value)}>
              <option value="Unassigned">Unassigned</option>
              <option value="Water Dept">Water Dept</option>
              <option value="Electricity Board">Electricity Board</option>
              <option value="Public Works (PWD)">Public Works (PWD)</option>
              <option value="Health & Sanitation">Health & Sanitation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Admin Remarks</label>
            <textarea 
              className="w-full p-2 border rounded h-24" 
              placeholder="Explain the update..."
              onChange={e => setRemarks(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button onClick={handleUpdate} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold">Save Changes</button>
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;