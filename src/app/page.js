"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [complaintId, setComplaintId] = useState("");
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Smooth scroll functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });

    // Check authentication status
    const token = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData');
    
    if (token && storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleAuth = () => {
    if (isLoggedIn) {
      // Handle logout
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      setIsLoggedIn(false);
      setUserData(null);
      router.push('/');
    } else {
      // Navigate to auth page
      router.push('/auth');
    }
  };

  const handleFileComplaint = () => {
    const token = localStorage.getItem('token');

    if (!token || !userData) {
      router.push('/auth'); // Redirect to login if not authenticated
      return;
    }

    switch (userData.role) {
      case 'admin':
        router.push('/admin');
        break;
      case 'superadmin':
        router.push('/super-admin');
        break;
      default:
        router.push('/dashboard'); // Default to user dashboard
    }
  };

  const checkStatus = async (e) => {
    e.preventDefault();
    
    // Validate complaint ID format (either 24 chars for full ID or 6 chars for tracking ID)
    const fullIdRegex = /^[0-9a-fA-F]{24}$/;
    const trackingIdRegex = /^[0-9a-fA-F]{6}$/;
    
    if (!complaintId.trim()) {
      setError("Please enter your complaint ID");
      return;
    }
    if (!fullIdRegex.test(complaintId.trim()) && !trackingIdRegex.test(complaintId.trim())) {
      setError("Please enter a valid complaint ID (24 characters) or tracking ID (6 characters)");
      return;
    }

    setLoading(true);
    setError("");
    setStatusData(null);

    try {
      const response = await fetch(`/api/grievances/status?id=${encodeURIComponent(complaintId.trim())}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch status');
      }

      setStatusData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-sm shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a href="#home" className="text-2xl font-bold text-blue-600">
                MyCityHelp
              </a>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </a>
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">
                Services
              </a>
             
              <a href="#track" className="text-gray-600 hover:text-blue-600 transition-colors">
                Track Status
              </a>
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  {userData?.role && (
                    <Link 
                      href={
                        userData.role === 'admin' ? '/admin' :
                        userData.role === 'superadmin' ? '/super-admin' :
                        '/dashboard'
                      }
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <span className="text-sm text-gray-600">
                    Welcome, {userData?.name}
                  </span>
                  <button 
                    onClick={handleAuth}
                    className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleAuth}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Sign In
                </button>
              )}
            </div>
            <button className="md:hidden">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/city-hero.jpg"
            alt="City Services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to <span className="text-blue-400">MyCityHelp</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Your voice matters. Report issues, track progress, and help make our city better for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleFileComplaint}
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              File a Complaint
            </button>
            <a
              href="#track"
              className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
            >
              Track Status
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Report and track various civic issues in your neighborhood</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Road Issues',
                icon: 'M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z',
                description: 'Report potholes, damaged roads, or street light issues'
              },
              {
                title: 'Sanitation',
                icon: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
                description: 'Report garbage collection issues or cleanliness concerns'
              },
              {
                title: 'Water Supply',
                icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
                description: 'Report water supply issues or leakages'
              },
              {
                title: 'Public Safety',
                icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
                description: 'Report security concerns or suspicious activities'
              },
              {
                title: 'Parks & Recreation',
                icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
                description: 'Report issues in parks or recreational facilities'
              },
              {
                title: 'Noise Pollution',
                icon: 'M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z',
                description: 'Report noise violations and disturbances'
              }
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-blue-600 mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Status Section */}
      <section id="track" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Track Your Complaint</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-600">Track the progress of your complaint</p>
          </div>
          <div className="bg-gray-50 rounded-2xl shadow-xl p-8">
            <form onSubmit={checkStatus} className="space-y-6">
              <div>
                <label htmlFor="complaintId" className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint ID
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="complaintId"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value.toLowerCase())}
                    placeholder="Enter your complaint ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking Status...
                  </span>
                ) : (
                  'Check Status'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {statusData && (
              <div className="mt-6 p-6 bg-white border border-gray-200 rounded-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="flex items-center text-lg">
                      <span className="font-medium mr-2">Category:</span>
                      {statusData.category}
                    </p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusData.status)}`}>
                      {statusData.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <h2 className="text-2xl font-bold text-blue-400">MyCityHelp</h2>
              <p className="mt-2 text-gray-400">Your platform for civic engagement and issue resolution.</p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#complaints" className="text-gray-400 hover:text-white transition-colors">File Complaint</a></li>
                <li><a href="#track" className="text-gray-400 hover:text-white transition-colors">Track Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@mycityhelp.com</li>
                <li>Emergency: 112</li>
                <li>24/7 Helpline: 1800-123-4567</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Download App</h3>
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.928 2.072a4.728 4.728 0 00-6.672 0l-1.256 1.256-1.256-1.256a4.728 4.728 0 00-6.672 6.672l1.256 1.256L12 18.672l8.672-8.672 1.256-1.256a4.728 4.728 0 000-6.672z"/>
                  </svg>
                  App Store
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18v18H3V3zm15.707 4.707l-1.414-1.414L12 11.586 6.707 6.293 5.293 7.707 10.586 13l-5.293 5.293 1.414 1.414L12 14.414l5.293 5.293 1.414-1.414L13.414 13l5.293-5.293z"/>
                  </svg>
                  Play Store
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MyCityHelp. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
