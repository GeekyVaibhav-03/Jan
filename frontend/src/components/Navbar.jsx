import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, admin, logout } = useContext(AuthContext);

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Strip */}
      <div className="bg-[#1e3a8a] text-white py-1 px-8 text-[10px] flex justify-between uppercase tracking-widest font-bold">
        <span>Government of India | Official Redressal Portal</span>
        <div className="flex gap-4">
          <span className="hover:text-orange-400 cursor-pointer">Helpdesk: 1800-11-2026</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* LOGO - Home par wapas jaane ke liye */}
        <Link to="/" className="flex items-center gap-4 group">
          <div className="h-12 w-12 bg-[#1e3a8a] rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:bg-orange-500 transition">JS</div>
          <div>
            <h1 className="text-xl font-black text-[#1e3a8a] leading-none uppercase">JanSathi</h1>
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Public Grievance Portal</span>
          </div>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="flex items-center gap-10">
          <Link to="/" className="text-gray-600 font-bold text-xs hover:text-blue-900 uppercase tracking-widest transition">Home</Link>
          <Link to="/track" className="text-gray-600 font-bold text-xs hover:text-blue-900 uppercase tracking-widest transition">Track Status</Link>
          
          {/* Lodge Grievance Link */}
          <Link to="/lodge-form" className="text-blue-700 font-black text-xs uppercase border-b-2 border-transparent hover:border-blue-700 pb-1 transition">Lodge Grievance</Link>

          {/* User Auth logic */}
          {admin ? (
            <div className="flex items-center gap-6 pl-6 border-l">
              <Link to="/admin/dashboard" className="bg-blue-900 text-white px-5 py-2 rounded shadow-lg shadow-blue-200 font-bold text-[10px] uppercase hover:bg-blue-800 transition">Admin Dashboard</Link>
              <button onClick={logout} className="text-red-500 font-bold text-[10px] uppercase hover:underline">Logout</button>
            </div>
          ) : user ? (
            <div className="flex items-center gap-6 pl-6 border-l">
              <Link to="/dashboard" className="bg-orange-600 text-white px-5 py-2 rounded shadow-lg shadow-orange-200 font-bold text-[10px] uppercase hover:bg-orange-700 transition">Dashboard</Link>
              <button onClick={logout} className="text-red-500 font-bold text-[10px] uppercase hover:underline">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-6 border-l">
              <Link to="/login" className="bg-gray-900 text-white px-5 py-2 rounded font-bold text-[10px] uppercase hover:bg-gray-800 transition">User Login</Link>
              <Link to="/admin/login" className="bg-blue-900 text-white px-5 py-2 rounded font-bold text-[10px] uppercase flex items-center gap-2 hover:bg-blue-800 transition shadow-lg">
                <span>Admin</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
              </Link>
            </div>
          )}
        </nav>
      </header>
    </div>
  );
};

export default Navbar;