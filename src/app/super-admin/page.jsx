"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/AppIcon';
import Sidebar from '@/components/ui/Sidebar';
import AdminTable from './components/AdminTable';
import AdminForm from './components/AdminForm';
import AnalyticsCards from './components/AnalyticsCards';
import BarChart from './components/BarChart';
import { fetchAdmins, createAdmin, updateAdmin, deleteAdmin, fetchDepartmentAnalytics } from '../../services/api';
import { DEPARTMENTS } from '../../constants';

const SuperAdminDashboard = () => {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNewAdminModalOpen, setIsNewAdminModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Check authentication on mount (client-side only)
        if (typeof window === 'undefined') return;

        const token = window.localStorage.getItem('token');
        const userRole = window.localStorage.getItem('userRole');
        const storedUserData = window.localStorage.getItem('userData');
        
        console.log('Auth check:', { 
          hasToken: !!token, 
          role: userRole,
          hasUserData: !!storedUserData 
        });

        if (!token) {
          console.log('No auth token found');
          router.replace('/auth');
          return;
        }

        if (userRole !== 'superadmin') {
          console.log('User is not a superadmin:', userRole);
          router.replace('/auth');
          return;
        }

        let userData = {};
        try {
          if (storedUserData) {
            userData = JSON.parse(storedUserData);
            setUserData(userData);
            console.log('User data loaded:', userData);
          } else {
            console.log('No user data found');
            router.replace('/auth');
            return;
          }
        } catch (e) {
          console.error('Failed to parse user data:', e);
          router.replace('/auth');
          return;
        }
        
        await fetchData();
      } catch (error) {
        console.error('Authentication check failed:', error);
        setError('Session expired. Please log in again.');
        router.replace('/auth');
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch admins first to verify authentication
      const adminsData = await fetchAdmins();
      if (!adminsData) {
        throw new Error('Failed to fetch admins data');
      }
      setAdmins(adminsData);

      try {
        // Fetch analytics for all departments
        const analyticsPromises = DEPARTMENTS.map(dept => fetchDepartmentAnalytics(dept));
        const analyticsResults = await Promise.all(analyticsPromises);
        
        // Combine analytics data
        const combinedAnalytics = {
          metrics: {
            totalGrievances: 0,
            resolvedGrievances: 0,
            pendingGrievances: 0,
            inProgressGrievances: 0
          },
          departmentBreakdown: DEPARTMENTS.map((dept, index) => ({
            department: dept,
            count: analyticsResults[index]?.metrics?.totalGrievances || 0
          }))
        };

        // Sum up metrics safely
        analyticsResults.forEach(result => {
          if (result?.metrics) {
            combinedAnalytics.metrics.totalGrievances += result.metrics.totalGrievances || 0;
            combinedAnalytics.metrics.resolvedGrievances += result.metrics.resolvedGrievances || 0;
            combinedAnalytics.metrics.pendingGrievances += result.metrics.pendingGrievances || 0;
            combinedAnalytics.metrics.inProgressGrievances += result.metrics.inProgressGrievances || 0;
          }
        });

        setAnalyticsData(combinedAnalytics);
      } catch (analyticsError) {
        console.error('Failed to fetch analytics:', analyticsError);
        // Set default analytics data instead of showing error
        setAnalyticsData({
          metrics: {
            totalGrievances: 0,
            resolvedGrievances: 0,
            pendingGrievances: 0,
            inProgressGrievances: 0
          },
          departmentBreakdown: DEPARTMENTS.map(dept => ({
            department: dept,
            count: 0
          }))
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      if (error.message.includes('Failed to fetch admins') || error.message.includes('Unauthorized')) {
        router.replace('/auth');
        return;
      }
      setError(error.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAdminSubmit = async (adminData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Validate required fields
      const { name, email, password, department } = adminData;
      if (!name || !email || !password || !department) {
        throw new Error('Please fill in all required fields');
      }

      // Create admin
      await createAdmin(adminData);
      
      // Close modal and refresh data
      setIsNewAdminModalOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Failed to create admin:', error);
      setError(error.message || 'Failed to create admin. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminUpdate = async (adminId, updates) => {
    setIsLoading(true);
    try {
      await updateAdmin(adminId, updates);
      fetchData(); // Refresh the admins list
    } catch (error) {
      setError(error.message || 'Failed to update admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    setIsLoading(true);
    try {
      await deleteAdmin(adminId);
      fetchData(); // Refresh the admins list
    } catch (error) {
      setError(error.message || 'Failed to delete admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        // Clear all auth-related data
        window.localStorage.clear();
        // Use replace instead of push to prevent back navigation
        router.replace('/auth');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Force reload as fallback
      window.location.href = '/auth';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertTriangle" size={48} className="text-error mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">Error</h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)] flex">
      <Sidebar 
        userRole="superadmin"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[var(--background)] border-b border-[var(--border)] px-6 py-4 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
                <Icon name="Shield" className="text-[var(--primary)]" />
                Super Admin Dashboard
              </h1>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Manage administrators and monitor system performance
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
                  <p className="text-xs text-[var(--text-secondary)]">Super Admin</p>
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
              {/* Analytics Section */}
              <section id="analytics-section" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[var(--text)] flex items-center gap-2">
                    <Icon name="BarChart2" className="text-[var(--primary)]" />
                    System Analytics
                  </h2>
                  <button
                    onClick={fetchData}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-lg transition-colors"
                    title="Refresh Data"
                  >
                    <Icon name="RefreshCw" size={18} />
                  </button>
                </div>
                <AnalyticsCards data={analyticsData?.metrics} isLoading={isLoading} />
                <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6">
                  <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Department Distribution</h3>
                  <BarChart data={analyticsData?.departmentBreakdown} />
                </div>
              </section>

              {/* Administrators Section */}
              <section id="administrators-section" className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[var(--text)] flex items-center gap-2">
                    <Icon name="Users" className="text-[var(--primary)]" />
                    Department Administrators
                  </h2>
                  <button
                    onClick={() => setIsNewAdminModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    <Icon name="UserPlus" size={18} />
                    Add Administrator
                  </button>
                </div>
                <AdminTable
                  admins={admins}
                  onEdit={setSelectedAdmin}
                  onDelete={handleAdminDelete}
                  isLoading={isLoading}
                />
              </section>
            </>
          )}
        </div>
      </div>

      {/* Admin Form Modal */}
      {(isNewAdminModalOpen || selectedAdmin) && (
        <AdminForm
          admin={selectedAdmin}
          onClose={() => {
            setIsNewAdminModalOpen(false);
            setSelectedAdmin(null);
          }}
          onSubmit={selectedAdmin ? handleAdminUpdate : handleNewAdminSubmit}
          isLoading={isLoading}
          departments={DEPARTMENTS}
        />
      )}
    </div>
  );
};

export default SuperAdminDashboard;