import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { callService } from '@/services/api/callService';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import { format } from 'date-fns';

const CallLogs = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [queueFilter, setQueueFilter] = useState('all');
  const [directionFilter, setDirectionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedCall, setSelectedCall] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchCalls();
  }, []);

  const fetchCalls = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await callService.getAll();
      setCalls(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch call logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone) => {
    return phone || 'N/A';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'transferred':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionIcon = (direction) => {
    return direction === 'inbound' ? 'PhoneIncoming' : 'PhoneOutgoing';
  };

  const getDirectionColor = (direction) => {
    return direction === 'inbound' ? 'text-green-600' : 'text-blue-600';
  };

  const filteredAndSortedCalls = calls
    .filter(call => {
      const matchesSearch = 
        call.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.agentName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
      const matchesQueue = queueFilter === 'all' || call.queue === queueFilter;
      const matchesDirection = directionFilter === 'all' || call.direction === directionFilter;
      
      return matchesSearch && matchesStatus && matchesQueue && matchesDirection;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'timestamp') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const uniqueQueues = [...new Set(calls.map(call => call.queue))];

  const handleCallDetails = (call) => {
    setSelectedCall(call);
    setShowDetails(true);
  };

  const handlePlayRecording = (recording) => {
    if (recording) {
      toast.info('Playing recording: ' + recording);
    } else {
      toast.warning('No recording available for this call');
    }
  };

  const handleRefresh = () => {
    fetchCalls();
    toast.success('Call logs refreshed');
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={fetchCalls} />;

return (
    <div className="space-y-6">
      {/* Header Section with Breadcrumb and Date Picker */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
            <span>Home</span>
            <ApperIcon name="ChevronRight" size={16} />
            <span className="text-gray-900 font-medium">Call Logs</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Call Log Dashboard</h1>
        </div>
        <div className="mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2">
            <ApperIcon name="Calendar" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">Jan 1, 2024 - Jan 31, 2024</span>
            <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button className="border-b-2 border-black py-4 px-1 text-sm font-medium text-black">
            Call Report
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Voice OTP
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Auto Voice Broadcast
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Auto Voice Survey
          </button>
          <button className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            App Call Log
          </button>
        </nav>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-9 gap-4">
        {/* Live Call Card */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Live Call</h3>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <ApperIcon name="Headphones" size={20} className="text-green-600" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155 A 15.9155 15.9155 0 0 1 18 2.0845"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                />
                <path
                  d="M18 2.0845 A 15.9155 15.9155 0 0 1 18 33.9155 A 15.9155 15.9155 0 0 1 18 2.0845"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="0, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-600">Total Calls</h3>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Phone" size={16} className="text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{calls.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-600">Answered</h3>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="PhoneCall" size={16} className="text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{calls.filter(c => c.status === 'completed').length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-600">Not Answered</h3>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="PhoneMissed" size={16} className="text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{calls.filter(c => c.status === 'missed').length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-600">Not Assigned</h3>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserX" size={16} className="text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">0</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-600">Voicemail</h3>
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Voicemail" size={16} className="text-teal-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">0</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-600">Welcome Sound</h3>
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Volume2" size={16} className="text-pink-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">0</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-600">Click to Call</h3>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="MousePointer" size={16} className="text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">0</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-600">Transferred</h3>
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="PhoneForwarded" size={16} className="text-gray-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{calls.filter(c => c.status === 'transferred').length}</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Quick Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100">
              Unique <span className="ml-1 bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">{calls.length}</span>
            </button>
            <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100">
              Today <span className="ml-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">0</span>
            </button>
            <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100">
              Yesterday <span className="ml-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">0</span>
            </button>
            <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100">
              This Week <span className="ml-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">{calls.length}</span>
            </button>
            <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100">
              This Month <span className="ml-1 bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs">{calls.length}</span>
            </button>
          </div>
        </div>

        {/* Filters and Actions Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Desk Phone</option>
              <option>All Phones</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
              <option>Deskphone</option>
              <option>Mobile</option>
            </select>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search calls..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              <ApperIcon name="Download" size={16} />
            </button>
            <button className="p-2 bg-black text-white rounded-lg hover:bg-gray-800">
              <ApperIcon name="Download" size={16} />
            </button>
            <button onClick={handleRefresh} className="p-2 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">
              <ApperIcon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>
      </div>

{/* Call Log Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.NO
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DESKPHONE
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CALLER
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MEMBER
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CALL GROUP
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DATE TIME
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DURATION
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CALL STATUS
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CIRCLE
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KEY
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedCalls.map((call, index) => (
                <motion.tr
                  key={call.Id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {call.agentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className={`${getDirectionColor(call.direction)}`}>
                        <ApperIcon name={getDirectionIcon(call.direction)} size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatPhoneNumber(call.customerPhone)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {call.customerName || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {call.customerName || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {call.queue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(call.timestamp), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(call.timestamp), 'HH:mm:ss')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(call.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(call.status)}`}>
                      {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(call.status)}`}>
                      {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Active
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{call.Id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCallDetails(call)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <ApperIcon name="Eye" size={16} />
                      </button>
                      {call.recording && (
                        <button
                          onClick={() => handlePlayRecording(call.recording)}
                          className="text-green-600 hover:text-green-800"
                          title="Play Recording"
                        >
                          <ApperIcon name="Play" size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => toast.info('Call details copied to clipboard')}
                        className="text-gray-600 hover:text-gray-800"
                        title="Copy Details"
                      >
                        <ApperIcon name="Copy" size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Info */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing 1 to {filteredAndSortedCalls.length} of {calls.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</span>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </div>

        {filteredAndSortedCalls.length === 0 && (
          <div className="text-center py-12">
            <ApperIcon name="Phone" size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No call logs found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' || queueFilter !== 'all' || directionFilter !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'No call logs available at the moment.'}
            </p>
          </div>
        )}
      </div>

      {/* Call Details Modal */}
      {showDetails && selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Call Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Call Information</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Call ID:</span>
                      <span className="ml-2 text-gray-900">{selectedCall.Id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date & Time:</span>
                      <span className="ml-2 text-gray-900">
                        {format(new Date(selectedCall.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-2 text-gray-900">{formatDuration(selectedCall.duration)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Direction:</span>
                      <span className="ml-2 text-gray-900 capitalize">{selectedCall.direction}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedCall.status)}`}>
                        {selectedCall.status.charAt(0).toUpperCase() + selectedCall.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Queue:</span>
                      <span className="ml-2 text-gray-900">{selectedCall.queue}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Participants</h4>
                  <div className="space-y-4 text-sm">
                    <div>
                      <div className="text-gray-500 mb-1">Customer</div>
                      <div className="text-gray-900">{selectedCall.customerName || 'Unknown'}</div>
                      <div className="text-gray-500">{formatPhoneNumber(selectedCall.customerPhone)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 mb-1">Agent</div>
                      <div className="text-gray-900">{selectedCall.agentName}</div>
                      <div className="text-gray-500">ID: {selectedCall.agentId}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedCall.tags && selectedCall.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCall.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedCall.recording && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Recording</h4>
                  <Button
                    onClick={() => handlePlayRecording(selectedCall.recording)}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Play" size={16} />
                    <span>Play Recording</span>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CallLogs;