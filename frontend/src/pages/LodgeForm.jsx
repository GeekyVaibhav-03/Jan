import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { locationData } from '../data/locations';
import { AlertCircle, CheckCircle, Mic, MicOff, ChevronRight, ChevronLeft, Copy } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const DEPARTMENTS = [
  'Water Supply',
  'Electricity',
  'Roads',
  'Waste Management',
  'Public Health',
  'General'
];

const LodgeForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { state: { redirectTo: '/lodge-form' } });
    }
  }, [isAuthenticated, user, navigate]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-IN';

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        
        if (event.results[event.results.length - 1].isFinal) {
          setFormData(prev => ({
            ...prev,
            description: prev.description + ' ' + transcript
          }));
        }
      };

      recognitionRef.current.onerror = (event) => {
        setError(`Speech Recognition Error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    department: '',
    description: '',
    departmentInput: ''
  });

  const [errors, setErrors] = useState({});

  const states = Object.keys(locationData);
  const districts = formData.state ? locationData[formData.state] : [];

  // Department auto-suggestion
  const suggestedDepartments = formData.departmentInput
    ? DEPARTMENTS.filter(dept =>
        dept.toLowerCase().includes(formData.departmentInput.toLowerCase())
      )
    : [];

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setError('');
  };

  const handleDepartmentSelect = (dept) => {
    setFormData(prev => ({
      ...prev,
      department: dept,
      departmentInput: dept
    }));
  };

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      setError('Speech Recognition not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Validation
  const validateStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1 || stepNum === 2) {
      if (!formData.state) {
        newErrors.state = 'Please select a state';
      }
      if (!formData.district) {
        newErrors.district = 'Please select a district';
      }
    }

    if (stepNum === 2 || stepNum === 3) {
      if (!formData.department) {
        newErrors.department = 'Please select a department';
      }
    }

    if (stepNum === 3) {
      if (!formData.description.trim()) {
        newErrors.description = 'Please describe your grievance';
      } else if (formData.description.trim().length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateStep(3)) {
    return;
  }

  setLoading(true);
  setError('');
  setSuccess('');

  try {
    // ✅ FIX: Send ALL required fields
    const payload = {
      // ✅ Location (Required)
      state: formData.state,
      district: formData.district,
      // ✅ Department & Grievance (Required)
      department: formData.department,
      title: `Grievance - ${formData.district}, ${formData.state}`,
      description: formData.description,
      language: 'en'
    };

    console.log('📤 Submitting payload:', payload);

    const response = await axios.post(
      `${API_BASE_URL}/complaints/lodge`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('✅ Response received:', response.data);

    if (response.data.success) {
      setSuccess('✅ Grievance lodged successfully!');
      setTrackingId(response.data.trackingId || response.data.complaint?.trackingId || '');
      
      // Show success for 3 seconds, then reset
      setTimeout(() => {
        setStep(4); // Success step
      }, 500);

      // Reset form after delay
      setTimeout(() => {
        resetForm();
      }, 3000);
    } else {
      setError(response.data.message || 'Failed to lodge grievance');
    }
  } catch (err) {
    console.error('❌ Error Details:', {
      status: err.response?.status,
      message: err.response?.data?.message,
      error: err.message
    });

    const errorMessage = 
      err.response?.data?.message || 
      err.message || 
      'Error lodging grievance. Please try again.';
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

// ✅ Add this helper function to reset form
const resetForm = () => {
  setFormData({
    name: '',
    phone: '',
    email: '',
    aadhaar: '',
    address: '',
    state: '',
    district: '',
    department: '',
    title: '',
    description: '',
    language: 'en'
  });
  setLocation(null);
  setStep(1);
  setSuccess('');
  setError('');
};
  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackingId);
    setSuccess('Tracking ID copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-blue-900 mb-2 uppercase">Lodge Your Grievance</h1>
          <p className="text-gray-600">JanSathi - Public Grievance Portal</p>
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-2 w-12 rounded-full transition-all ${
                i <= step ? 'bg-blue-900' : 'bg-gray-300'
              }`}></div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-green-700 text-sm">{success}</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-6 text-white">
            <p className="text-sm font-semibold opacity-90">Step {step} of 3</p>
            <h2 className="text-2xl font-black mt-1 uppercase">
              {step === 1 && 'Location Details'}
              {step === 2 && 'Department & Problem'}
              {step === 3 && 'Review & Submit'}
            </h2>
          </div>

          <div className="p-8">
            {/* STEP 1: USER & LOCATION */}
            {step === 1 && (
              <div className="space-y-6">
                {/* Auto-filled User Info */}
                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-4 uppercase text-sm">Your Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">Name</label>
                      <p className="text-lg font-bold text-gray-800 mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">Email</label>
                      <p className="text-base font-bold text-gray-800 mt-1">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">Mobile</label>
                      <p className="text-base font-bold text-gray-800 mt-1">{user.mobile}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">Aadhaar</label>
                      <p className="text-base font-bold text-gray-800 mt-1">XXXX-XXXX-{user.aadhaar?.slice(-4)}</p>
                    </div>
                  </div>
                </div>

                {/* Location Selection */}
                <div className="space-y-4">
                  {/* State */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2 uppercase">
                      Select State <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Choose a state...</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2 uppercase">
                      Select District <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      disabled={!formData.state}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                        errors.district ? 'border-red-500' : 'border-gray-300'
                      } ${!formData.state ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Choose a district...</option>
                      {districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DEPARTMENT & DESCRIPTION */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Department Auto-Suggestion */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 uppercase">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="departmentInput"
                      value={formData.departmentInput}
                      onChange={handleInputChange}
                      placeholder="Type to search departments..."
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                        errors.department ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    
                    {/* Dropdown */}
                    {formData.departmentInput && suggestedDepartments.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-blue-300 rounded-lg shadow-lg z-10">
                        {suggestedDepartments.map(dept => (
                          <button
                            key={dept}
                            type="button"
                            onClick={() => handleDepartmentSelect(dept)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b last:border-b-0 font-semibold text-gray-800"
                          >
                            {dept}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* All Departments */}
                  {!suggestedDepartments.length && !formData.departmentInput && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {DEPARTMENTS.map(dept => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => handleDepartmentSelect(dept)}
                          className={`px-4 py-2 rounded-lg transition border-2 font-semibold text-sm ${
                            formData.department === dept
                              ? 'bg-blue-900 text-white border-blue-900'
                              : 'bg-white text-gray-800 border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                </div>

                {/* Problem Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 uppercase flex items-center justify-between">
                    <span>
                      Problem Description <span className="text-red-500">*</span>
                    </span>
                    <button
                      type="button"
                      onClick={toggleVoiceRecognition}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition text-xs font-semibold ${
                        isListening
                          ? 'bg-red-500 text-white'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-4 h-4" /> Stop
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4" /> Voice
                        </>
                      )}
                    </button>
                  </label>
                  
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your grievance in detail (minimum 20 characters)..."
                    rows="6"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-xs text-gray-500">
                      {formData.description.length} characters
                    </p>
                    {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                  </div>
                  {isListening && (
                    <p className="text-orange-600 text-xs mt-2 font-semibold animate-pulse">
                      🎤 Listening... Speak now
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & SUBMIT */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 space-y-4">
                  <h3 className="font-bold text-blue-900 uppercase text-sm">Review Your Grievance</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">State</label>
                      <p className="text-base font-bold text-gray-800 mt-1">{formData.state}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase">District</label>
                      <p className="text-base font-bold text-gray-800 mt-1">{formData.district}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">Department</label>
                    <p className="text-base font-bold text-gray-800 mt-1">{formData.department}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase">Description</label>
                    <p className="text-sm text-gray-800 mt-1 bg-white p-3 rounded border border-gray-300 max-h-24 overflow-y-auto">
                      {formData.description}
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 text-sm text-yellow-800">
                  <p className="font-semibold">Important Notice:</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• You will receive a unique Tracking ID for future reference</li>
                    <li>• Status updates will be sent to your email and mobile</li>
                    <li>• Resolution SLA is 30 days from submission</li>
                    <li>• You can track progress anytime on our portal</li>
                  </ul>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <div className="space-y-6 text-center">
                <div className="text-6xl">✅</div>
                <div>
                  <h3 className="text-2xl font-black text-green-600 mb-2">Grievance Submitted Successfully!</h3>
                  <p className="text-gray-600">Your complaint has been registered in the system.</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200">
                  <label className="block text-xs font-bold text-gray-700 mb-3 uppercase">Your Tracking ID</label>
                  <div className="flex items-center justify-between bg-white p-4 rounded-lg border-2 border-blue-300">
                    <span className="text-3xl font-black text-blue-900 tracking-widest">{trackingId}</span>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg transition"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-4">Save this ID for tracking your grievance status</p>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl space-y-3 text-sm">
                  <p><strong>Next Steps:</strong></p>
                  <ul className="space-y-2 text-left">
                    <li>✓ Initial assessment within 48 hours</li>
                    <li>✓ Auto-routing to concerned department</li>
                    <li>✓ Weekly status updates via SMS & Email</li>
                    <li>✓ Resolution within 30 days SLA</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/track')}
                    className="flex-1 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-black transition uppercase"
                  >
                    Track Now
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-black transition uppercase"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={step === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition ${
                    step === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg font-black transition uppercase"
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-black transition uppercase disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Grievance'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Need help? Contact us at <strong>support@jansathi.gov.in</strong> or call <strong>1800-11-2026</strong></p>
        </div>
      </div>
    </div>
  );
};

export default LodgeForm;