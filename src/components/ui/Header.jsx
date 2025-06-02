import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = ({ 
  variant = 'default', 
  isAuthenticated = false, 
  userRole = null, 
  userName = 'User',
  onLogout = () => {} 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setIsProfileOpen(false);
    navigate('/authentication-screen');
  };

  const getNavigationItems = () => {
    if (!isAuthenticated) return [];
    
    switch (userRole) {
      case 'user':
        return [
          { label: 'Dashboard', path: '/user-dashboard', icon: 'Home' },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin-dashboard', icon: 'LayoutDashboard' },
        ];
      case 'superadmin':
        return [
          { label: 'Dashboard', path: '/super-admin-dashboard', icon: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();
  const isCompact = variant === 'compact';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary text-white px-4 py-2 rounded-md z-50"
      >
        Skip to content
      </a>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center ${isCompact ? 'h-14' : 'h-16'}`}>
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation(isAuthenticated ? 
                (userRole === 'user' ? '/user-dashboard' : 
                 userRole === 'admin'? '/admin-dashboard' : '/super-admin-dashboard') : 
                '/authentication-screen'
              )}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              aria-label="Go to home"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="MessageSquare" size={20} color="white" />
              </div>
              {!isCompact && (
                <span className="text-xl font-bold text-gray-900">ComplaintHub</span>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          {!isCompact && isAuthenticated && navigationItems.length > 0 && (
            <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary-50' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Mobile menu button */}
                {navigationItems.length > 0 && (
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    aria-expanded={isMenuOpen}
                    aria-label="Toggle navigation menu"
                  >
                    <Icon name={isMenuOpen ? 'X' : 'Menu'} size={20} />
                  </button>
                )}

                {/* User profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    aria-expanded={isProfileOpen}
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="#2563EB" />
                    </div>
                    {!isCompact && (
                      <>
                        <span className="text-sm font-medium hidden sm:block">{userName}</span>
                        <Icon name="ChevronDown" size={16} />
                      </>
                    )}
                  </button>

                  {/* Profile dropdown menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Icon name="LogOut" size={16} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleNavigation('/authentication-screen')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign in
                </button>
                <button
                  onClick={() => handleNavigation('/authentication-screen')}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-700 rounded-md"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMenuOpen && isAuthenticated && navigationItems.length > 0 && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <nav className="space-y-1" aria-label="Mobile navigation">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full text-left flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary-50' :'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Backdrop for mobile menu */}
      {(isMenuOpen || isProfileOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileOpen(false);
          }}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

export default Header;