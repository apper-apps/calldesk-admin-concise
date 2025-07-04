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
import { agentService } from '@/services/api/agentService';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  const statusFilters = [
    { key: 'online', label: 'Online' },
    { key: 'busy', label: 'Busy' },
    { key: 'away', label: 'Away' },
    { key: 'offline', label: 'Offline' }
  ];

  useEffect(() => {
    loadAgents();
  }, []);

  useEffect(() => {
    filterAgents();
  }, [agents, searchTerm, activeFilters]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await agentService.getAll();
      setAgents(data);
    } catch (err) {
      setError(err.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const filterAgents = () => {
    let filtered = agents;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.Id.toString().includes(searchTerm)
      );
    }

    // Apply status filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(agent =>
        activeFilters.includes(agent.status.toLowerCase())
      );
    }

    setFilteredAgents(filtered);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      online: { variant: 'online', icon: 'CircleDot' },
      busy: { variant: 'busy', icon: 'Phone' },
      away: { variant: 'away', icon: 'Clock' },
      offline: { variant: 'offline', icon: 'Circle' }
    };

    const config = statusMap[status.toLowerCase()] || statusMap.offline;
    
    return (
      <Badge variant={config.variant} size="small">
        <ApperIcon name={config.icon} size={12} className="mr-1" />
        {status}
      </Badge>
    );
  };

  const columns = [
    {
      key: 'name',
      label: 'Agent',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-primary" />
          </div>
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-sm text-slate-400">ID: {row.Id}</div>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => getStatusBadge(value)
    },
    {
      key: 'currentCall',
      label: 'Current Call',
      render: (value) => value || <span className="text-slate-500">None</span>
    },
    {
      key: 'totalCalls',
      label: 'Total Calls',
      render: (value) => <span className="font-medium text-white">{value}</span>
    },
    {
      key: 'avgHandleTime',
      label: 'Avg Handle Time',
      render: (value) => <span className="text-slate-300">{value}s</span>
    },
    {
      key: 'satisfaction',
      label: 'Satisfaction',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="w-16 h-2 bg-slate-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm text-white">{value}%</span>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <Button size="small" variant="ghost" icon="Phone" />
          <Button size="small" variant="ghost" icon="MessageSquare" />
          <Button size="small" variant="ghost" icon="MoreVertical" />
        </div>
      )
    }
  ];

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAgents} />;
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
          <h1 className="text-2xl font-bold text-white">Agents</h1>
          <p className="text-slate-400">Manage and monitor agent performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon="Download">
            Export
          </Button>
          <Button variant="primary" icon="Plus">
            Add Agent
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search agents by name or ID..."
            onSearch={setSearchTerm}
            showFilters={true}
            filters={statusFilters}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Agents</p>
              <p className="text-2xl font-bold text-white">{agents.length}</p>
            </div>
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-primary" />
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Online</p>
              <p className="text-2xl font-bold text-success">
                {agents.filter(a => a.status === 'online').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="CircleDot" size={20} className="text-success" />
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Busy</p>
              <p className="text-2xl font-bold text-error">
                {agents.filter(a => a.status === 'busy').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-error/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Phone" size={20} className="text-error" />
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Away</p>
              <p className="text-2xl font-bold text-warning">
                {agents.filter(a => a.status === 'away').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-warning/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Clock" size={20} className="text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Agents Table */}
      {filteredAgents.length === 0 ? (
        <Empty
          title="No agents found"
          description="Try adjusting your search or filters to find agents."
          icon="Users"
        />
      ) : (
        <DataTable
          data={filteredAgents}
          columns={columns}
          onRowClick={(agent) => console.log('Agent clicked:', agent)}
        />
      )}
    </motion.div>
  );
};

export default Agents;