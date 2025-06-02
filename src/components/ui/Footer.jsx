import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Footer = ({ variant = 'default', className = '' }) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const isCompact = variant === 'compact';

  const handleNavigation = (path) => {
    navigate(path);
  };

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Careers', path: '/careers' },
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Guidelines', path: '/guidelines' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', url: 'https://twitter.com' },
    { name: 'Facebook', icon: 'Facebook', url: 'https://facebook.com' },
    { name: 'LinkedIn', icon: 'Linkedin', url: 'https://linkedin.com' },
    { name: 'Instagram', icon: 'Instagram', url: 'https://instagram.com' },
  ];

  if (isCompact) {
    return (
      <footer className={`bg-white border-t border-gray-200 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Icon name="MessageSquare" size={14} color="white" />
              </div>
              <span className="text-sm font-medium text-gray-900">ComplaintHub</span>
            </div>
            <p className="text-sm text-gray-500">
              © {currentYear} ComplaintHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`bg-white border-t border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="MessageSquare" size={20} color="white" />
                </div>
                <span className="text-xl font-bold text-gray-900">ComplaintHub</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md">
                Your trusted platform for submitting and tracking complaints. 
                We ensure your voice is heard and your concerns are addressed promptly.
              </p>
              
              {/* Social links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-md"
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <Icon name={social.icon} size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Company links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => handleNavigation(link.path)}
                      className="text-gray-600 hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => handleNavigation(link.path)}
                      className="text-gray-600 hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => handleNavigation(link.path)}
                      className="text-gray-600 hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Icon name="Mail" size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <a 
                    href="mailto:support@complainthub.com"
                    className="text-sm text-gray-600 hover:text-primary"
                  >
                    support@complainthub.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Icon name="Phone" size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <a 
                    href="tel:+1234567890"
                    className="text-sm text-gray-600 hover:text-primary"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Icon name="MapPin" size={20} className="text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">
                    123 Business St, Suite 100<br />
                    City, State 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500">
              © {currentYear} ComplaintHub. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleNavigation('/accessibility')}
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                Accessibility
              </button>
              <button
                onClick={() => handleNavigation('/sitemap')}
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                Sitemap
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;