'use client'
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/AppIcon';

const Sidebar = ({ 
  userRole = 'user', 
  isCollapsed = false, 
  onToggleCollapse = () => {},
  className = '' 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState(null);

  const getMenuItems = () => {
    switch (userRole) {
      case 'user':
        return [
          { 
            label: 'Dashboard', 
            path: '/dashboard', 
            icon: 'Home',
            description: 'View your dashboard'
          },
          { 
            label: 'Submit Complaint', 
            path: '/dashboard/submit', 
            icon: 'Plus',
            description: 'Submit a new complaint'
          },
          { 
            label: 'My Complaints', 
            path: '/dashboard/complaints', 
            icon: 'FileText',
            description: 'Track your complaints'
          },
          { 
            label: 'Profile', 
            path: '/dashboard/profile', 
            icon: 'User',
            description: 'Manage your profile'
          },
        ];
      case 'admin':
        return [
          { 
            label: 'Dashboard', 
            path: '/admin', 
            icon: 'LayoutDashboard',
            description: 'Admin dashboard overview'
          },
          { 
            label: 'Complaints', 
            path: '/admin/complaints', 
            icon: 'FileText',
            description: 'Manage complaints'
          },
          { 
            label: 'Analytics', 
            path: '/admin/analytics', 
            icon: 'BarChart3',
            description: 'View analytics'
          },
          { 
            label: 'Settings', 
            path: '/admin/settings', 
            icon: 'Settings',
            description: 'Admin settings'
          },
        ];
      case 'superadmin':
        return [
          { 
            label: 'Dashboard', 
            path: '/super-admin', 
            icon: 'Settings',
            description: 'Super admin dashboard'
          },
          { 
            label: 'Admin Management', 
            path: '/super-admin/admins', 
            icon: 'Users',
            description: 'Manage administrators'
          },
          { 
            label: 'Global Analytics', 
            path: '/super-admin/analytics', 
            icon: 'TrendingUp',
            description: 'System-wide analytics'
          },
          { 
            label: 'System Settings', 
            path: '/super-admin/settings', 
            icon: 'Cog',
            description: 'System configuration'
          },
          { 
            label: 'Reports', 
            path: '/super-admin/reports', 
            icon: 'FileBarChart',
            description: 'Generate reports'
          },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const isActiveRoute = (path) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <>
      <aside 
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${className}`}
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {userRole} Panel
              </h2>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
            </button>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 p-4 space-y-2" aria-label="Sidebar menu">
            {menuItems.map((item) => {
              const isActive = isActiveRoute(item.path);
              
              return (
                <div key={item.path} className="relative">
                  <Link
                    href={item.path}
                    onMouseEnter={() => setHoveredItem(item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary bg-primary-50 border-r-2 border-primary' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon 
                      name={item.icon} 
                      size={20} 
                      className={`flex-shrink-0 ${isActive ? 'text-primary' : ''}`}
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && hoveredItem === item.path && (
                    <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md whitespace-nowrap z-50">
                      {item.label}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <p>ComplaintHub v1.0</p>
                <p>© 2024 All rights reserved</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile backdrop */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={onToggleCollapse}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;