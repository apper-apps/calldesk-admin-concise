import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      children: [
        { path: '/admin-dashboard', label: 'Admin Dashboard', icon: 'Settings' },
        { path: '/sales-dashboard', label: 'Sales Dashboard', icon: 'TrendingUp' }
      ]
    },
    {
      path: '/deskphone-health',
      label: 'Deskphone Health',
      icon: 'Phone'
    },
    {
      label: 'IVR Journey',
      icon: 'GitBranch',
      children: [
        { path: '/ivr-standard', label: 'Standard IVR Flow', icon: 'ArrowRight' },
        { path: '/ivr-advance', label: 'Advance IVR Flow', icon: 'ArrowRightCircle' }
      ]
    },
    {
      label: 'Manage',
      icon: 'Settings',
      children: [
        { path: '/voice-template', label: 'Voice Template', icon: 'Mic' },
        { path: '/sms-templates', label: 'SMS Templates', icon: 'MessageSquare' },
        { path: '/sms-configuration', label: 'SMS Configuration', icon: 'MessageCircle' }
      ]
    },
    {
      label: 'Voice Reach',
      icon: 'Radio',
      children: [
        { path: '/voice-broadcast', label: 'Voice Broadcast', icon: 'Broadcast' },
        { path: '/auto-dialer', label: 'Auto Dialer', icon: 'PhoneCall' },
        { path: '/auto-survey', label: 'Auto Survey', icon: 'ClipboardList' },
        { path: '/desk-click', label: 'Desk Click', icon: 'MousePointer' },
        { path: '/web-call-tracker', label: 'Web Call Tracker', icon: 'Globe' }
      ]
    },
    {
      label: 'Other Tools',
      icon: 'Tool',
      children: [
        { path: '/blacklist-number', label: 'Blacklist Number', icon: 'Shield' },
        { path: '/download-centre', label: 'Download Centre', icon: 'Download' },
        { path: '/call-restriction', label: 'Call Restriction', icon: 'Ban' }
      ]
    },
    {
      path: '/profile-billing',
      label: 'My Profile & Billing',
      icon: 'User'
    },
    {
      label: 'API & Integration',
      icon: 'Plug',
      children: [
        { path: '/third-party-integration', label: '3rd Party Integration', icon: 'Link' },
        { path: '/api-key', label: 'API Key', icon: 'Key' },
        { path: '/webhook-integration', label: 'Webhook Integration', icon: 'Webhook' }
      ]
    },
    {
      label: 'Setting',
      icon: 'Cog',
      children: [
        { path: '/notification-control', label: 'Notification Control', icon: 'Bell' },
        { path: '/security-activity', label: 'Security & Activity', icon: 'Shield' }
      ]
    }
  ];

  const toggleMenu = (index) => {
    setExpandedMenus(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isMenuActive = (item) => {
    if (item.path) {
      return location.pathname === item.path;
    }
    if (item.children) {
      return item.children.some(child => location.pathname === child.path);
    }
    return false;
  };

  const NavItem = ({ item, index }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[index];
    const isActive = isMenuActive(item);

    if (hasChildren) {
      return (
        <div className="space-y-1">
          <button
            onClick={() => toggleMenu(index)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 group text-sm ${
              isActive 
                ? 'bg-slate-700 text-white border-l-2 border-l-accent' 
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ApperIcon 
                name={item.icon} 
                size={16} 
                className="group-hover:scale-110 transition-transform duration-200" 
              />
              <span className="font-medium">{item.label}</span>
            </div>
            <ApperIcon 
              name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
              size={14} 
              className="transition-transform duration-200"
            />
          </button>
          {isExpanded && (
            <div className="ml-4 space-y-1">
              {item.children.map((child, childIndex) => (
                <NavLink
                  key={childIndex}
                  to={child.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 group text-sm
                    ${isActive 
                      ? 'bg-primary text-white border-l-2 border-l-accent' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }
                  `}
                >
                  <ApperIcon 
                    name={child.icon} 
                    size={14} 
                    className="group-hover:scale-110 transition-transform duration-200" 
                  />
                  <span>{child.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        to={item.path}
        onClick={onClose}
        className={({ isActive }) => `
          flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 group text-sm
          ${isActive 
            ? 'bg-primary text-white border-l-2 border-l-accent' 
            : 'text-slate-300 hover:text-white hover:bg-slate-700'
          }
        `}
      >
        <ApperIcon 
          name={item.icon} 
          size={16} 
          className="group-hover:scale-110 transition-transform duration-200" 
        />
        <span className="font-medium">{item.label}</span>
      </NavLink>
    );
  };
  // Desktop Sidebar
const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-gray-800 border-r border-gray-700 h-screen sticky top-0">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Phone" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Calldesk</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {navigationItems.map((item, index) => (
            <NavItem key={index} item={item} index={index} />
          ))}
        </nav>
</div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Sidebar */}
<motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 w-64 h-full bg-gray-800 border-r border-gray-700 z-50"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Phone" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Calldesk</h1>
                <p className="text-xs text-slate-400">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"
            >
              <ApperIcon name="X" size={16} />
            </button>
          </div>
          
          <nav className="space-y-1">
            {navigationItems.map((item, index) => (
              <NavItem key={index} item={item} index={index} />
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;