'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Icon from '@/components/AppIcon';
import ComplaintForm from './components/ComplaintForm';
import { fetchGrievances, createGrievance } from '@/services/api';
import FilterControls from './components/FilterControls';
import ComplaintList from './components/ComplaintList';
import DetailPanel from './components/DetailPanel';
import NewComplaintForm from './components/NewComplaintForm';
import { CATEGORIES } from '@/constants';

const UserDashboard = () => {
  const router = useRouter();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isNewComplaintModalOpen, setIsNewComplaintModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    dateRange: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      router.push('/auth');
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [filters, currentPage]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchGrievances({
        ...filters,
        page: currentPage
      });

      if (response && response.grievances) {
        setComplaints(response.grievances);
        setPagination(response.pagination || {
          total: response.grievances.length,
          page: currentPage,
          limit: 10,
          totalPages: Math.ceil(response.grievances.length / 10)
        });
      } else {
        setComplaints([]);
        setPagination({
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        });
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
      setError(error.message || 'Failed to fetch complaints');
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailPanelOpen(true);
  };

  const handleNewComplaintSubmit = async (complaintData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createGrievance(complaintData);
      if (result.success) {
        await fetchData(); // Refresh the complaints list
        return { success: true };
      }
    } catch (error) {
      console.error('Error creating complaint:', error);
      setError(error.message || 'Failed to create complaint');
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
    <div className="min-h-screen bg-surface">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden relative">
                  {userData.avatar ? (
                    <Image
                      src={userData.avatar}
                      alt={userData.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Icon name="User" size={20} className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                title="Logout"
              >
                <Icon name="LogOut" size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 space-y-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Icon name="User" size={24} color="var(--color-primary)" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Welcome back, {userData.name}!</h2>
                <p className="text-gray-600">Submit and track your complaints easily</p>
              </div>
            </div>
          </div>

          {/* Complaint Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Icon name="Plus" size={24} color="var(--color-primary)" />
              <h3 className="text-lg font-semibold text-gray-900">Submit New Complaint</h3>
            </div>
            <ComplaintForm
              categories={CATEGORIES}
              onSubmit={handleNewComplaintSubmit}
              isSubmitting={isLoading}
            />
          </div>

          {/* Complaints Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Icon name="FileText" size={24} color="var(--color-primary)" />
                <h3 className="text-lg font-semibold text-gray-900">My Complaints</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                  {pagination.total || 0}
                </span>
              </div>
            </div>

            {/* Filter Controls */}
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Complaints List */}
            <ComplaintList
              complaints={complaints}
              isLoading={isLoading}
              onComplaintClick={handleComplaintClick}
            />

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-outline"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="btn btn-outline"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail Panel */}
      {selectedComplaint && (
        <DetailPanel
          complaint={selectedComplaint}
          isOpen={isDetailPanelOpen}
          onClose={() => setIsDetailPanelOpen(false)}
        />
      )}

      {/* New Complaint Modal */}
      <NewComplaintForm
        isOpen={isNewComplaintModalOpen}
        onClose={() => setIsNewComplaintModalOpen(false)}
        onSubmit={handleNewComplaintSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default UserDashboard;