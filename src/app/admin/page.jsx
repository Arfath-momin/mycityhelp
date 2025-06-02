"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/AppIcon';
import { fetchGrievances, updateGrievanceStatus } from '@/services/api';

const AdminDashboard = () => {
  const router = useRouter();
  const [grievances, setGrievances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        if (typeof window === 'undefined') return;

        const token = window.localStorage.getItem('token');
        const userRole = window.localStorage.getItem('userRole');
        const storedUserData = window.localStorage.getItem('userData');

        console.log('Auth check:', { 
          hasToken: !!token, 
          role: userRole,
          hasUserData: !!storedUserData 
        });

        if (!token || userRole !== 'admin') {
          console.log('Not authenticated as admin, redirecting to auth');
          router.replace('/auth');
          return;
        }

        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          console.log('User data loaded:', userData);
          setUserData(userData);
        }

        await fetchData();
      } catch (error) {
        console.error('Authentication check failed:', error);
        router.replace('/auth');
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Fetching grievances...');
      const response = await fetchGrievances();
      console.log('Grievances response:', response);
      
      if (response && response.grievances) {
        console.log('Setting grievances:', response.grievances.length, 'items');
        setGrievances(response.grievances);
      } else {
        console.log('No grievances found in response');
        setGrievances([]);
      }
    } catch (error) {
      console.error('Failed to fetch grievances:', error);
      setError('Failed to fetch grievances. Please try again.');
      setGrievances([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (grievanceId, newStatus) => {
    try {
      console.log('Updating status:', { grievanceId, newStatus });
      await updateGrievanceStatus(grievanceId, newStatus);
      console.log('Status updated successfully');
      await fetchData(); // Refresh the grievances list
    } catch (error) {
      console.error('Failed to update status:', error);
      // You could add a toast notification here to show the error
    }
  };

  const handleLogout = () => {
    try {
      window.localStorage.clear();
      router.replace('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/auth';
    }
  };

  const filteredGrievances = Array.isArray(grievances) ? grievances.filter(grievance => {
    const matchesSearch = 
      grievance.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grievance.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || grievance.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'in-progress': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'pending':
        return `${baseStyle} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500`;
      case 'in-progress':
        return `${baseStyle} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500`;
      case 'resolved':
        return `${baseStyle} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500`;
      default:
        return `${baseStyle} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500`;
    }
  };

  const metrics = {
    total: Array.isArray(grievances) ? grievances.length : 0,
    pending: Array.isArray(grievances) ? grievances.filter(g => g.status === 'pending').length : 0,
    inProgress: Array.isArray(grievances) ? grievances.filter(g => g.status === 'in-progress').length : 0,
    resolved: Array.isArray(grievances) ? grievances.filter(g => g.status === 'resolved').length : 0,
  };

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <header className="bg-[var(--background)] border-b border-[var(--border)] px-6 py-4 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
              <Icon name="Briefcase" className="text-[var(--primary)]" />
              Department Dashboard
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Manage and track department grievances
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
              <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                <span className="text-sm font-medium text-[var(--primary)]">
                  {userData?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">{userData?.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{userData?.department} Admin</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-lg transition-colors"
            >
              <Icon name="LogOut" size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto">
        <div className="flex-1 overflow-auto">
          {error ? (
            <div className="min-h-[50vh] flex items-center justify-center p-6">
              <div className="text-center max-w-md mx-auto">
                <Icon name="AlertTriangle" size={48} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-[var(--text)] mb-2">Error</h2>
                <p className="text-[var(--text-secondary)] mb-4">{error}</p>
                <button
                  onClick={fetchData}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
                >
                  <Icon name="RefreshCw" size={18} />
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Metrics Section */}
              <section className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Total Grievances Card */}
                  <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-[var(--primary-light)]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <Icon name="InboxIcon" size={24} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)]">Total Grievances</p>
                        <p className="text-2xl font-bold text-[var(--text)]">
                          {isLoading ? (
                            <span className="inline-block w-16 h-8 bg-[var(--surface)] rounded animate-pulse" />
                          ) : metrics.total}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pending Grievances Card */}
                  <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-[var(--primary-light)]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                        <Icon name="AlertCircle" size={24} className="text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)]">Pending</p>
                        <p className="text-2xl font-bold text-[var(--text)]">
                          {isLoading ? (
                            <span className="inline-block w-16 h-8 bg-[var(--surface)] rounded animate-pulse" />
                          ) : metrics.pending}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* In Progress Grievances Card */}
                  <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-[var(--primary-light)]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <Icon name="Loader" size={24} className="text-blue-500 animate-spin-slow" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)]">In Progress</p>
                        <p className="text-2xl font-bold text-[var(--text)]">
                          {isLoading ? (
                            <span className="inline-block w-16 h-8 bg-[var(--surface)] rounded animate-pulse" />
                          ) : metrics.inProgress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Resolved Grievances Card */}
                  <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-[var(--primary-light)]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                        <Icon name="CheckCircle" size={24} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)]">Resolved</p>
                        <p className="text-2xl font-bold text-[var(--text)]">
                          {isLoading ? (
                            <span className="inline-block w-16 h-8 bg-[var(--surface)] rounded animate-pulse" />
                          ) : metrics.resolved}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Grievances Section */}
              <section className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold text-[var(--text)] flex items-center gap-2">
                    <Icon name="List" className="text-[var(--primary)]" />
                    Grievances List
                  </h2>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon name="Search" size={18} className="text-[var(--text-secondary)]" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search grievances..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
                      />
                    </div>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="pl-4 pr-10 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)]"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6 animate-pulse">
                        <div className="h-4 bg-[var(--border)] rounded w-1/4 mb-4" />
                        <div className="h-4 bg-[var(--border)] rounded w-3/4 mb-2" />
                        <div className="h-4 bg-[var(--border)] rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : filteredGrievances.length === 0 ? (
                  <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-8 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                        <Icon name="Inbox" size={32} className="text-[var(--primary)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text)]">No Grievances Found</h3>
                        <p className="text-[var(--text-secondary)] mt-1">
                          {searchTerm ? 'Try adjusting your search' : 'No grievances have been submitted yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredGrievances.map((grievance) => (
                      <div key={grievance._id} className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6 transition-all duration-200 hover:shadow-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-[var(--text)]">{grievance.title}</h3>
                              <span className={getStatusBadgeStyle(grievance.status)}>
                                {grievance.status.replace('_', ' ').charAt(0).toUpperCase() + grievance.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-[var(--text-secondary)] mb-4">{grievance.description}</p>
                            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
                              <span className="flex items-center gap-1">
                                <Icon name="User" size={14} />
                                {grievance.userName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Calendar" size={14} />
                                {new Date(grievance.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={grievance.status}
                              onChange={(e) => handleStatusUpdate(grievance._id, e.target.value)}
                              className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text)] text-sm"
                            >
                              <option value="pending">Pending</option>
                              <option value="in-progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;