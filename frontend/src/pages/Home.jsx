import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLodgeGrievance = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: '/lodge-form' } });
    } else {
      navigate('/lodge-form');
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-black text-blue-900 tracking-tighter">JanSathi</Link>
          <div className="flex items-center gap-6">
            <Link to="/track" className="text-sm font-semibold text-gray-700 hover:text-blue-900 transition">
              Track Grievance
            </Link>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Welcome, <strong>{user.name}</strong></span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-32 px-6 border-b-8 border-orange-500 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-block bg-orange-500 text-xs font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wider">
              🇮🇳 Official Portal 2026
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 uppercase tracking-tight">
              Empowering Citizens <br /> 
              <span className="text-orange-400">Solving Grievances</span>
            </h1>
            <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-lg font-light">
              JanSathi is India's premier digital platform for transparent governance. 
              Register your complaint and receive direct resolutions from District authorities within 30 days.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={handleLodgeGrievance}
                className="bg-white text-blue-900 px-10 py-4 rounded-xl font-black text-base shadow-2xl hover:bg-orange-500 hover:text-white transition duration-300 uppercase tracking-wide"
              >
                Lodge Grievance Now
              </button>
              <Link to="/track" className="bg-transparent border-2 border-white px-10 py-4 rounded-xl font-black text-base hover:bg-white/10 transition uppercase">
                Track Status
              </Link>
            </div>
          </div>

          {/* Stats Box */}
          <div className="space-y-6">
            <div className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl">
              <h4 className="font-bold text-orange-400 mb-8 uppercase tracking-widest text-xs text-center border-b border-white/10 pb-4">Live Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-8 text-center">
                <div className="border-r border-white/10">
                  <p className="text-5xl font-black">42,890</p>
                  <p className="text-[11px] text-blue-200 uppercase mt-3 font-bold tracking-widest">Active Grievances</p>
                </div>
                <div>
                  <p className="text-5xl font-black">94.2%</p>
                  <p className="text-[11px] text-blue-200 uppercase mt-3 font-bold tracking-widest">Resolution Rate</p>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4 text-center text-xs">
                <div>
                  <p className="text-2xl font-black">28 hrs</p>
                  <p className="text-blue-200">Avg Response</p>
                </div>
                <div>
                  <p className="text-2xl font-black">15</p>
                  <p className="text-blue-200">States Active</p>
                </div>
              </div>
            </div>
            
            <div className="bg-orange-500 p-6 rounded-xl flex items-start gap-4 text-white shadow-lg animate-pulse">
              <span className="text-2xl flex-shrink-0">📢</span>
              <div>
                <p className="text-xs font-black uppercase tracking-tight mb-1">Breaking News</p>
                <p className="text-sm leading-snug">District Admin Dashboards for Indore, Bhopal, and Pune now feature AI-powered auto-routing and sentiment analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KEY SERVICES */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-4">Our Services</h3>
            <h2 className="text-4xl md:text-5xl font-black text-blue-900 uppercase">Complete Grievance Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: '📝', 
                title: 'Simple Registration', 
                desc: 'Lodge complaints in under 2 minutes with auto-populated citizen data.' 
              },
              { 
                icon: '📱', 
                title: 'Real-Time Tracking', 
                desc: 'Receive SMS updates and live status on your mobile every step.' 
              },
              { 
                icon: '🎯', 
                title: 'Auto-Routing', 
                desc: 'AI automatically assigns complaints to relevant departments.' 
              },
              { 
                icon: '✅', 
                title: 'Guaranteed Resolution', 
                desc: 'SLA-based resolution within 30 days by law.' 
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition group">
                <div className="text-5xl mb-4 group-hover:scale-125 transition transform duration-300">{item.icon}</div>
                <h4 className="font-black text-gray-800 mb-3 uppercase text-sm tracking-wide">{item.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. GUIDELINES & PROCESS */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          {/* Guidelines */}
          <div>
            <h3 className="text-3xl font-black text-blue-900 uppercase mb-8 flex items-center gap-4">
              <span className="w-1 h-10 bg-orange-500"></span> Eligibility Guidelines
            </h3>
            <p className="text-gray-700 text-base leading-relaxed mb-8 bg-blue-50 p-6 rounded-lg border-l-4 border-blue-900">
              JanSathi welcomes grievances related to public services. However, the following matters CANNOT be processed and will be auto-rejected:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Personal disputes or family matters",
                "Right to Information (RTI) requests",
                "Court-related or sub-judice matters",
                "Religious or communal disputes",
                "Grievances against foreign entities",
                "Private business complaints",
                "Suggestions (Use Feedback Portal)"
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3 bg-red-50 p-4 rounded-lg text-red-800 text-sm font-semibold border-l-4 border-red-500">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The Process */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-12 rounded-3xl border-2 border-blue-100">
            <h4 className="text-3xl font-black text-blue-900 mb-10 uppercase">The Redressal Journey</h4>
            <div className="space-y-8">
              {[
                { 
                  num: "01", 
                  title: "Registration & Tracking ID", 
                  desc: "Your complaint receives a unique tracking ID (e.g., JS-17294) instantly for future reference." 
                },
                { 
                  num: "02", 
                  title: "Initial Assessment", 
                  desc: "Nodal Officer reviews within 48 hours and auto-routes to the concerned department." 
                },
                { 
                  num: "03", 
                  title: "Action & Investigation", 
                  desc: "Ground-level action taken by the assigned department with weekly status updates." 
                },
                { 
                  num: "04", 
                  title: "Resolution & Closure", 
                  desc: "Grievance closed only after your satisfaction with a final resolution report." 
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-8">
                  <div className="flex flex-col items-center">
                    <div className="font-black text-4xl text-blue-900 mb-2">{step.num}</div>
                    {i < 3 && <div className="w-1 h-16 bg-orange-500"></div>}
                  </div>
                  <div className="pb-8">
                    <h5 className="font-black text-blue-900 uppercase text-lg mb-2">{step.title}</h5>
                    <p className="text-gray-700 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: '30 Days', label: 'Maximum SLA' },
              { num: '15 States', label: 'Coverage' },
              { num: '2.8M+', label: 'Total Resolved' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                <p className="text-3xl font-black text-orange-500 mb-2">{stat.num}</p>
                <p className="text-gray-700 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* CTA Box */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-lg border border-orange-200  top-24">
            <h4 className="font-black text-gray-800 mb-4 uppercase text-sm tracking-wider">Ready to Get Started?</h4>
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              {isAuthenticated 
                ? `Welcome back, ${user.name}! Click below to lodge a new grievance.`
                : 'Register or login with your email, mobile, and Aadhaar to begin.'}
            </p>
            <button 
              onClick={handleLodgeGrievance}
              className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white py-4 rounded-lg font-black uppercase text-sm hover:shadow-lg transition"
            >
              {isAuthenticated ? 'Lodge Grievance' : 'Login / Register'}
            </button>
          </div>

          {/* Support Box */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
            <h4 className="font-black text-gray-800 mb-6 uppercase text-xs tracking-wider border-b pb-4">Emergency Helplines</h4>
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-gray-600 font-semibold mb-1">National Helpline:</p>
                <p className="text-2xl font-black text-blue-900">1800-11-2026</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold mb-1">Women Grievances:</p>
                <p className="text-xl font-black text-orange-500">1091</p>
              </div>
              <div>
                <p className="text-gray-600 font-semibold mb-1">Cyber Crime:</p>
                <p className="text-xl font-black text-orange-500">1930</p>
              </div>
              <div className="pt-4 border-t">
                <p className="text-gray-600 font-semibold mb-2">Email Support:</p>
                <a href="mailto:support@jansathi.gov.in" className="text-blue-600 font-bold hover:underline break-all">
                  support@jansathi.gov.in
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Box */}
          <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-lg">
            <h4 className="font-black mb-4 uppercase text-xs tracking-wider border-b border-orange-400 pb-4">Need Help?</h4>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-orange-400 cursor-pointer transition font-semibold">→ How to lodge a grievance?</li>
              <li className="hover:text-orange-400 cursor-pointer transition font-semibold">→ Track my grievance</li>
              <li className="hover:text-orange-400 cursor-pointer transition font-semibold">→ Download mobile app</li>
              <li className="hover:text-orange-400 cursor-pointer transition font-semibold">→ View FAQs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="bg-gray-900 text-white pt-20 pb-10 px-6 border-t-4 border-orange-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-gray-800 pb-16">
          <div className="space-y-4">
            <h1 className="text-3xl font-black tracking-tighter">JANSATHI</h1>
            <p className="text-xs text-gray-400 leading-relaxed">
              An official initiative of the Department of Administrative Reforms and Public Grievances (DARPG), 
              empowering every citizen with digital accountability and transparent governance.
            </p>
            <div className="flex gap-3 pt-4">
              <span className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-bold">ISO 27001</span>
              <span className="text-xs bg-blue-900 text-white px-3 py-1 rounded-full font-bold">NIC Certified</span>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-orange-500 mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-3 text-xs text-gray-400 font-medium">
              <li className="hover:text-white cursor-pointer transition">Lodge Grievance</li>
              <li className="hover:text-white cursor-pointer transition">Track Complaint</li>
              <li className="hover:text-white cursor-pointer transition">Mobile App</li>
              <li className="hover:text-white cursor-pointer transition">Nodal Officers</li>
              <li className="hover:text-white cursor-pointer transition">Statistics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-orange-500 mb-6 uppercase text-xs tracking-widest">Support</h4>
            <ul className="space-y-3 text-xs text-gray-400 font-medium">
              <li className="hover:text-white cursor-pointer transition">Help Center</li>
              <li className="hover:text-white cursor-pointer transition">FAQs</li>
              <li className="hover:text-white cursor-pointer transition">Video Tutorials</li>
              <li className="hover:text-white cursor-pointer transition">Contact Us</li>
              <li className="hover:text-white cursor-pointer transition">Sitemap</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-orange-500 mb-6 uppercase text-xs tracking-widest">Legal</h4>
            <ul className="space-y-3 text-xs text-gray-400 font-medium">
              <li className="hover:text-white cursor-pointer transition">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer transition">Disclaimer</li>
              <li className="hover:text-white cursor-pointer transition">Accessibility</li>
              <li className="hover:text-white cursor-pointer transition">Grievance Redressal</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">
          <p>© 2026 NATIONAL INFORMATICS CENTRE (NIC). ALL RIGHTS RESERVED.</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <span>🌐 English</span>
            <span>♿ Accessibility: ON</span>
            <span>🔒 HTTPS Enabled</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;