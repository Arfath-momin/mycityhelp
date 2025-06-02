import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import ActionButton from './ActionButton';

const AdminTable = ({ admins, loading, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const departments = [...new Set(admins.map(admin => admin.department))];

  const getInitials = (name) => {
    return name.split(' ')
      .map(n => n[0])
      .join('');
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || admin.department === filterDepartment;
    const matchesStatus = !filterStatus || admin.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (loading) {
    return (
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-4 bg-[var(--surface)]">
                  <div className="h-4 w-24 bg-[var(--border)] rounded animate-pulse"/>
                </th>
                <th className="px-6 py-4 bg-[var(--surface)]">
                  <div className="h-4 w-32 bg-[var(--border)] rounded animate-pulse"/>
                </th>
                <th className="px-6 py-4 bg-[var(--surface)]">
                  <div className="h-4 w-28 bg-[var(--border)] rounded animate-pulse"/>
                </th>
                <th className="px-6 py-4 bg-[var(--surface)]">
                  <div className="h-4 w-20 bg-[var(--border)] rounded animate-pulse"/>
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b border-[var(--border)]">
                  <td className="px-6 py-4">
                    <div className="h-4 w-32 bg-[var(--border)] rounded animate-pulse"/>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-40 bg-[var(--border)] rounded animate-pulse"/>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-28 bg-[var(--border)] rounded animate-pulse"/>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-8 w-20 bg-[var(--border)] rounded animate-pulse"/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!filteredAdmins.length) {
    return (
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-8 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
            <Icon name="Users" size={32} className="text-[var(--primary)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--text)]">No Administrators Found</h3>
            <p className="text-[var(--text-secondary)] mt-1">
              Add department administrators to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text)] bg-[var(--surface)]">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text)] bg-[var(--surface)]">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text)] bg-[var(--surface)]">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text)] bg-[var(--surface)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr 
                key={admin._id} 
                className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                      <span className="text-sm font-medium text-[var(--primary)]">
                        {admin.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--text)]">{admin.name}</div>
                      <div className="text-sm text-[var(--text-secondary)]">Administrator</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-[var(--text-secondary)]">{admin.email}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--primary-light)] text-[var(--primary)]">
                    {admin.department}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(admin)}
                      className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] rounded-lg transition-colors"
                      title="Edit Administrator"
                    >
                      <Icon name="Edit2" size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(admin._id)}
                      className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Administrator"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;