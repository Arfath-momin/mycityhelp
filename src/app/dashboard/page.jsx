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
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center p-6">
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
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface)]">
      {/* Header */}
      <header className="bg-[var(--background)] border-b border-[var(--border)] px-6 py-4 sticky top-0 z-10 backdrop-blur-sm bg-opacity-80">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)] flex items-center gap-2">
              <Icon name="LayoutDashboard" className="text-[var(--primary)]" />
              My Dashboard
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Submit and track your grievances
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Profile */}
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--surface)] rounded-lg border border-[var(--border)]">
              <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                {userData.avatar ? (
                  <Image
                    src={userData.avatar}
                    alt={userData.name}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-medium text-[var(--primary)]">
                    {userData.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text)]">{userData.name}</p>
                <p className="text-xs text-[var(--text-secondary)]">{userData.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)] rounded-lg transition-colors"
            >
              <Icon name="LogOut" size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <section className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center">
              <Icon name="User" size={24} className="text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">Welcome back, {userData.name}!</h2>
              <p className="text-[var(--text-secondary)]">Submit and track your grievances easily</p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => setIsNewComplaintModalOpen(true)}
            className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6 hover:border-[var(--primary-light)] transition-all duration-200 hover:shadow-lg group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--primary-light)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="Plus" size={24} className="text-[var(--primary)]" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-[var(--text)]">New Grievance</h3>
                <p className="text-sm text-[var(--text-secondary)]">Submit a new complaint</p>
              </div>
            </div>
          </button>

          <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Icon name="Clock" size={24} className="text-yellow-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">Pending</h3>
                <p className="text-2xl font-bold text-[var(--text)]">
                  {complaints.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Icon name="Loader" size={24} className="text-blue-500 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">In Progress</h3>
                <p className="text-2xl font-bold text-[var(--text)]">
                  {complaints.filter(c => c.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Icon name="CheckCircle" size={24} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)]">Resolved</h3>
                <p className="text-2xl font-bold text-[var(--text)]">
                  {complaints.filter(c => c.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Complaints List Section */}
        <section className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={24} className="text-[var(--primary)]" />
              <h3 className="text-lg font-semibold text-[var(--text)]">My Grievances</h3>
              <span className="px-2 py-1 bg-[var(--primary-light)] text-[var(--primary)] text-sm font-medium rounded-full">
                {pagination.total || 0}
              </span>
            </div>
          </div>

          <FilterControls
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <ComplaintList
            complaints={complaints}
            isLoading={isLoading}
            onComplaintClick={handleComplaintClick}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--background)] transition-colors"
              >
                <Icon name="ChevronLeft" size={18} />
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      currentPage === page
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--background)]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--background)] transition-colors"
              >
                Next
                <Icon name="ChevronRight" size={18} />
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Detail Panel */}
      {isDetailPanelOpen && (
        <DetailPanel
          complaint={selectedComplaint}
          onClose={() => setIsDetailPanelOpen(false)}
        />
      )}

      {/* New Complaint Modal */}
      {isNewComplaintModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[var(--text)]">Submit New Grievance</h2>
              <button
                onClick={() => setIsNewComplaintModalOpen(false)}
                className="p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"
              >
                <Icon name="X" size={20} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            <NewComplaintForm
              onSubmit={async (data) => {
                const result = await handleNewComplaintSubmit(data);
                if (result.success) {
                  setIsNewComplaintModalOpen(false);
                }
                return result;
              }}
              isSubmitting={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;