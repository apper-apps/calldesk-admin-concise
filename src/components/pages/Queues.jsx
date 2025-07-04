import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DataTable from '@/components/molecules/DataTable';
import SearchBar from '@/components/molecules/SearchBar';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { queueService } from '@/services/api/queueService';

const Queues = () => {
  const [queues, setQueues] = useState([]);
  const [filteredQueues, setFilteredQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadQueues();
  }, []);

  useEffect(() => {
    filterQueues();
  }, [queues, searchTerm]);

  const loadQueues = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await queueService.getAll();
      setQueues(data);
    } catch (err) {
      setError(err.message || 'Failed to load queues');
    } finally {
      setLoading(false);
    }
  };

  const filterQueues = () => {
    let filtered = queues;

    if (searchTerm) {
      filtered = filtered.filter(queue =>
        queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        queue.Id.toString().includes(searchTerm)
      );
    }

    setFilteredQueues(filtered);
  };

  const getPriorityBadge = (priority) => {
    if (priority >= 8) return <Badge variant="danger">High</Badge>;
    if (priority >= 5) return <Badge variant="warning">Medium</Badge>;
    return <Badge variant="success">Low</Badge>;
  };

  const getStatusColor = (waitingCalls) => {
    if (waitingCalls > 10) return 'text-error';
    if (waitingCalls > 5) return 'text-warning';
    return 'text-success';
  };

  const columns = [
    {
      key: 'name',
      label: 'Queue Name',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <ApperIcon name="Phone" size={16} className="text-primary" />
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-sm text-slate-400">ID: {row.Id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'waitingCalls',
      label: 'Waiting Calls',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <ApperIcon name="Clock" size={16} className={getStatusColor(value)} />
          <span className={`font-medium ${getStatusColor(value)}`}>{value}</span>
        </div>
      )
    },
    {
      key: 'avgWaitTime',
      label: 'Avg Wait Time',
      render: (value) => (
        <span className="text-slate-300">{value} min</span>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (value) => getPriorityBadge(value)
    },
    {
      key: 'agents',
      label: 'Agents',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <ApperIcon name="Users" size={16} className="text-slate-400" />
          <span className="text-slate-300">{value.length}</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <Button size="small" variant="ghost" icon="Settings" />
          <Button size="small" variant="ghost" icon="BarChart3" />
          <Button size="small" variant="ghost" icon="MoreVertical" />
        </div>
      )
    }
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadQueues} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Queues</h1>
          <p className="text-slate-400">Manage call queues and routing</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon="Download">
            Export
          </Button>
          <Button variant="primary" icon="Plus">
            Create Queue
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search queues by name or ID..."
        onSearch={setSearchTerm}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Queues</p>
              <p className="text-2xl font-bold text-white">{queues.length}</p>
            </div>
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Phone" size={20} className="text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Waiting Calls</p>
              <p className="text-2xl font-bold text-warning">
                {queues.reduce((total, queue) => total + queue.waitingCalls, 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-warning" />
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg Wait Time</p>
              <p className="text-2xl font-bold text-info">
                {queues.length > 0 ? (queues.reduce((total, queue) => total + queue.avgWaitTime, 0) / queues.length).toFixed(1) : 0} min
              </p>
            </div>
            <div className="w-10 h-10 bg-info/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Timer" size={20} className="text-info" />
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">High Priority</p>
              <p className="text-2xl font-bold text-error">
                {queues.filter(q => q.priority >= 8).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-error/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={20} className="text-error" />
            </div>
          </div>
        </div>
      </div>

      {/* Queue Performance */}
      <div className="bg-surface rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Queue Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">94%</div>
            <div className="text-sm text-slate-400">Service Level</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning mb-2">2.3</div>
            <div className="text-sm text-slate-400">Avg Answer Time (min)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-error mb-2">6%</div>
            <div className="text-sm text-slate-400">Abandonment Rate</div>
          </div>
        </div>
      </div>

      {/* Queues Table */}
      {filteredQueues.length === 0 ? (
        <Empty
          title="No queues found"
          description="Try adjusting your search or create a new queue."
          icon="Phone"
          actionText="Create Queue"
          onAction={() => console.log('Create queue')}
        />
      ) : (
        <DataTable
          data={filteredQueues}
          columns={columns}
          onRowClick={(queue) => console.log('Queue clicked:', queue)}
        />
      )}
    </motion.div>
  );
};

export default Queues;