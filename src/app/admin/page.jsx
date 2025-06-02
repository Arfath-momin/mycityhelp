'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/AppIcon';
import Sidebar from '@/components/ui/Sidebar';
import FilterControls from './components/FilterControls';
import ComplaintTable from './components/ComplaintTable';
import DetailPanel from './components/DetailPanel';
import AnalyticsCards from './components/AnalyticsCards';
import BarChart from './components/BarChart';
import { fetchGrievances, updateGrievance, fetchDepartmentAnalytics } from '@/services/api';

const AdminDashboard = () => {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    dateRange: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check authentication and user role
    const token = localStorage.getItem('token');
    const storedUserData = localStorage.getItem('userData');
    const userRole = localStorage.getItem('userRole');

    if (!token || !storedUserData || userRole !== 'admin') {
      router.push('/auth');
      return;
    }

    const parsedUserData = JSON.parse(storedUserData);
    setUserData(parsedUserData);
  }, [router]);

  useEffect(() => {
    if (userData?.department) {
      fetchData();
    }
  }, [filters, currentPage, userData?.department]);

  const fetchData = async () => {
    if (!userData?.department) return;

    setIsLoading(true);
    setError(null);
    try {
      // Fetch grievances with filters
      const grievancesData = await fetchGrievances({
        ...filters,
        department: userData.department,
        page: currentPage
      });

      // Ensure we have valid data
      setComplaints(grievancesData?.grievances || []);

      // Fetch analytics data
      const analytics = await fetchDepartmentAnalytics(userData.department);
      setAnalyticsData(analytics);
    } catch (error) {
      console.error('Data fetch error:', error);
      setError(error.message || 'Failed to fetch data');
      setComplaints([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailPanelOpen(true);
  };

  const handleStatusUpdate = async (complaintId, newStatus, notes) => {
    setIsLoading(true);
    try {
      const updatedComplaint = await updateGrievance(complaintId, {
        status: newStatus,
        note: notes,
        isPublicNote: true
      });

      // Update the complaint in the list
      setComplaints(prevComplaints =>
        prevComplaints.map(complaint =>
          complaint.id === complaintId ? updatedComplaint : complaint
        )
      );

      // Update selected complaint if it's open in detail panel
      if (selectedComplaint?.id === complaintId) {
        setSelectedComplaint(updatedComplaint);
      }

      // Refresh analytics after status update
      const analytics = await fetchDepartmentAnalytics(userData.department);
      setAnalyticsData(analytics);
    } catch (error) {
      setError(error.message || 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    router.push('/auth');
  };

  if (!userData) {
    return null; // or a loading spinner
  }

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
    <div className="min-h-screen bg-surface flex">
      <Sidebar 
        userRole="admin"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                {userData.department} Department
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Icon name="User" size={16} />
                <span>{userData.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline flex items-center space-x-2"
              >
                <Icon name="LogOut" size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Analytics Section */}
            {analyticsData && (
              <>
                <AnalyticsCards data={analyticsData.metrics} />
                <BarChart data={analyticsData.categoryBreakdown} />
              </>
            )}

            {/* Filters */}
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Complaints Table */}
            <ComplaintTable
              complaints={complaints}
              isLoading={isLoading}
              onComplaintClick={handleComplaintClick}
            />
          </div>
        </main>
      </div>

      {/* Detail Panel */}
      {selectedComplaint && (
        <DetailPanel
          complaint={selectedComplaint}
          isOpen={isDetailPanelOpen}
          onClose={() => setIsDetailPanelOpen(false)}
          onStatusUpdate={handleStatusUpdate}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default AdminDashboard;