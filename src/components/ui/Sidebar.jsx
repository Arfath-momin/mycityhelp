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
            id: 'dashboard',
            label: 'Dashboard', 
            path: '/super-admin', 
            icon: 'LayoutDashboard',
            description: 'Super admin dashboard'
          },
          { 
            id: 'administrators',
            label: 'Administrators', 
            path: '/super-admin#administrators', 
            icon: 'Users',
            description: 'Manage administrators',
            scrollTo: 'administrators-section'
          },
          { 
            id: 'analytics',
            label: 'Analytics', 
            path: '/super-admin#analytics', 
            icon: 'BarChart3',
            description: 'System-wide analytics',
            scrollTo: 'analytics-section'
          }
      
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
        className={`bg-[var(--background)] border-r border-[var(--border)] transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${className}`}
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
            {!isCollapsed && (
              <h2 className="text-lg font-semibold text-[var(--text)] capitalize">
                {userRole} Panel
              </h2>
            )}
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-md text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} />
            </button>
          </div>

          {/* Navigation menu */}
          <nav className="flex-1 p-4 space-y-2" aria-label="Sidebar menu">
            {menuItems.map((item) => {
              const isActive = isActiveRoute(item.path.split('#')[0]);
              
              return (
                <div key={item.id || item.path} className="relative">
                  <Link
                    href={item.path}
                    onClick={(e) => {
                      if (item.scrollTo) {
                        e.preventDefault();
                        const element = document.getElementById(item.scrollTo);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    onMouseEnter={() => setHoveredItem(item.id || item.path)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[var(--primary)] bg-[var(--primary-light)] border-r-2 border-[var(--primary)]' 
                        : 'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface)]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon 
                      name={item.icon} 
                      size={20} 
                      className={`flex-shrink-0 ${isActive ? 'text-[var(--primary)]' : ''}`}
                    />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && hoveredItem === (item.id || item.path) && (
                    <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-[var(--surface)] text-[var(--text)] text-sm rounded-md whitespace-nowrap z-50 border border-[var(--border)] shadow-lg">
                      <div className="flex items-center space-x-2">
                        <span>{item.label}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">{item.description}</p>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[var(--surface)] border-l border-t border-[var(--border)] rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-[var(--border)]">
              <div className="text-xs text-[var(--text-secondary)]">
                <p>MyCityHelp v1.0</p>
                <p>© {new Date().getFullYear()} All rights reserved</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile backdrop */}
      {!isCollapsed && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm md:hidden" onClick={onToggleCollapse} />
      )}
    </>
  );
};

export default Sidebar;