import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/agents', label: 'Agents', icon: 'Users' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/queues', label: 'Queues', icon: 'Phone' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) => `
        flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
        ${isActive 
          ? 'bg-primary text-white border-l-4 border-l-accent' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }
      `}
    >
      <ApperIcon 
        name={item.icon} 
        size={20} 
        className="group-hover:scale-110 transition-transform duration-200" 
      />
      <span className="font-medium">{item.label}</span>
    </NavLink>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-surface border-r border-slate-700 h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <ApperIcon name="Phone" size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Calldesk</h1>
            <p className="text-sm text-slate-400">Admin Panel</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavItem key={item.path} item={item} />
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
        className="lg:hidden fixed left-0 top-0 w-64 h-full bg-surface border-r border-slate-700 z-50"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Phone" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Calldesk</h1>
                <p className="text-sm text-slate-400">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <NavItem key={item.path} item={item} />
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