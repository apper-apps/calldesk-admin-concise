import React, { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Settings from "@/components/pages/Settings";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ onMenuToggle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const notifications = [
    { id: 1, type: 'warning', message: 'Queue wait time above threshold', time: '2 min ago' },
    { id: 2, type: 'success', message: 'Agent Sarah Johnson back online', time: '5 min ago' },
    { id: 3, type: 'info', message: 'New call recording available', time: '10 min ago' }
  ];

  const topMenuItems = [
    {
      label: 'Contact',
      path: '/contact',
      icon: 'Phone'
    },
    {
      label: 'Report',
      icon: 'BarChart3',
      children: [
        { path: '/call-logs', label: 'Call Logs', icon: 'Phone' },
        { path: '/voice-otp-logs', label: 'Voice OTP Logs', icon: 'Shield' },
        { path: '/app-call-logs', label: 'App Call Logs', icon: 'Smartphone' }
      ]
    },
    {
      label: 'User Management',
      icon: 'Users',
      children: [
        { path: '/members', label: 'Members', icon: 'User' },
        { path: '/call-groups', label: 'Call Groups', icon: 'Users' },
        { path: '/member-analysis', label: 'Member Analysis', icon: 'BarChart3' }
      ]
    },
    {
      label: 'Admin',
      icon: 'Shield',
      children: [
        { path: '/account', label: 'Account', icon: 'Settings' }
      ]
    }
  ];

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return 'AlertTriangle';
      case 'success': return 'CheckCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
      case 'info': return 'text-info';
      default: return 'text-slate-400';
    }
  };

  return (
<header className="bg-white border-b border-gray-200 px-4 py-3">
    <div className="flex items-center justify-between">
        {/* Left Side - Mobile Menu & Top Navigation */}
        <div className="flex items-center space-x-6 flex-1">
            <button
                onClick={onMenuToggle}
                className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
                <ApperIcon name="Menu" size={20} />
            </button>
            {/* Top Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-1">
                {topMenuItems.map((item, index) => <div key={index} className="relative">
                    {item.children ? <div>
                        <button
                            onClick={() => toggleDropdown(index)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                            <ApperIcon name={item.icon} size={16} />
                            <span>{item.label}</span>
                            <ApperIcon name="ChevronDown" size={14} />
                        </button>
                        {activeDropdown === index && <motion.div
                            initial={{
                                opacity: 0,
                                y: -10
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            {item.children.map((child, childIndex) => <a
                                key={childIndex}
                                href={child.path}
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                                onClick={() => setActiveDropdown(null)}>
                                <ApperIcon name={child.icon} size={14} />
                                <span>{child.label}</span>
                            </a>)}
                        </motion.div>}
                    </div> : <a
                        href={item.path}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                        <ApperIcon name={item.icon} size={16} />
                        <span>{item.label}</span>
                    </a>}
                </div>)}
            </nav>
            {/* Right Side - Actions */}
            <div className="flex items-center space-x-4">
                {/* Real-time Status */}
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-gray-600">Live</span>
                </div>
                {/* Notifications */}
                <div className="relative">
                    <motion.button
                        whileHover={{
                            scale: 1.05
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                        <ApperIcon name="Bell" size={24} />
                        {notifications.length > 0 && <span
                            className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {notifications.length}
                        </span>}
                    </motion.button>
                    {showNotifications && <motion.div
                        initial={{
                            opacity: 0,
                            y: -10
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="p-4 border-b border-gray-200">
                            <h4 className="font-medium text-gray-900">Notifications</h4>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.map(notification => <div
                                key={notification.id}
                                className="p-4 border-b border-gray-200 hover:bg-gray-50">
                                <div className="flex items-start space-x-3">
                                    <ApperIcon
                                        name={getNotificationIcon(notification.type)}
                                        size={20}
                                        className={getNotificationColor(notification.type)} />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900">{notification.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                    </div>
                                </div>
                            </div>)}
                        </div>
                        <div className="p-4 border-t border-gray-200">
                            <button className="text-sm text-primary hover:text-primary/80 font-medium">View all notifications
                                                  </button>
                        </div>
                    </motion.div>}
                </div>
                {/* User Profile Menu */}
                <div className="relative">
                    <motion.button
                        whileHover={{
                            scale: 1.05
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        onClick={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")}
                        className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
                        <div
                            className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">AD</span>
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-medium text-gray-900">Admin User</p>
                            <p className="text-xs text-gray-500">admin@company.com</p>
                        </div>
                        <ApperIcon name="ChevronDown" size={16} />
                    </motion.button>
                    {activeDropdown === "profile" && <motion.div
                        initial={{
                            opacity: 0,
                            y: -10
                        }}
                        animate={{
                            opacity: 1,
                            y: 0
                        }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                        <div className="p-4 border-b border-gray-200">
                            <p className="text-sm font-medium text-gray-900">Admin User</p>
                            <p className="text-xs text-gray-500">admin@company.com</p>
                        </div>
                        <div className="py-2">
                            <button
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                <ApperIcon name="User" size={16} />
                                <span>Profile Settings</span>
                            </button>
                            <button
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                <ApperIcon name="Settings" size={16} />
                                <span>Account Settings</span>
                            </button>
                            <button
                                onClick={() => setActiveDropdown(null)}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                <ApperIcon name="Bell" size={16} />
                                <span>Notifications</span>
                            </button>
                            <div className="border-t border-gray-200 mt-2 pt-2">
                                <button
                                    onClick={() => {
                                        setActiveDropdown(null);
                                        console.log("Logout clicked");
                                    }}
                                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700">
                                    <ApperIcon name="LogOut" size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>}
                </div>
                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                    <motion.button
                        whileHover={{
                            scale: 1.05
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                        title="Refresh Data">
                        <ApperIcon name="RefreshCw" size={20} />
                    </motion.button>
                    <motion.button
                        whileHover={{
                            scale: 1.05
                        }}
                        whileTap={{
                            scale: 0.95
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
                        title="Full Screen">
                        <ApperIcon name="Maximize" size={20} />
                    </motion.button>
                </div>
            </div>
        </div>
    </div></header>
  );
};

export default Header;