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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Logs</h1>
          <p className="text-gray-600 mt-1">View and manage all call records</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            <span>Refresh</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" size={16} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, phone, or agent..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="active">Active</option>
              <option value="missed">Missed</option>
              <option value="transferred">Transferred</option>
            </select>
          </div>

          {/* Queue Filter */}
          <div>
            <select
              value={queueFilter}
              onChange={(e) => setQueueFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Queues</option>
              {uniqueQueues.map(queue => (
                <option key={queue} value={queue}>{queue}</option>
              ))}
            </select>
          </div>

          {/* Direction Filter */}
          <div>
            <select
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Directions</option>
              <option value="inbound">Inbound</option>
              <option value="outbound">Outbound</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {filteredAndSortedCalls.length} of {calls.length} calls
        </span>
        <div className="flex items-center space-x-4">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="timestamp">Date/Time</option>
            <option value="duration">Duration</option>
            <option value="customerName">Customer</option>
            <option value="agentName">Agent</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="text-blue-600 hover:text-blue-800"
          >
            <ApperIcon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
          </button>
        </div>
      </div>

      {/* Call Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Call Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Queue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedCalls.map((call) => (
                <motion.tr
                  key={call.Id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`${getDirectionColor(call.direction)}`}>
                        <ApperIcon name={getDirectionIcon(call.direction)} size={16} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {format(new Date(call.timestamp), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(call.timestamp), 'HH:mm:ss')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {call.customerName || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPhoneNumber(call.customerPhone)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{call.agentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDuration(call.duration)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(call.status)}`}>
                      {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{call.queue}</div>
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