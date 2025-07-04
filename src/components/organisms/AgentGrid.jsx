import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { agentService } from '@/services/api/agentService';

const AgentGrid = ({ className = '' }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'online';
      case 'busy':
        return 'busy';
      case 'away':
        return 'away';
      case 'offline':
        return 'offline';
      default:
        return 'offline';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'CircleDot';
      case 'busy':
        return 'Phone';
      case 'away':
        return 'Clock';
      case 'offline':
        return 'Circle';
      default:
        return 'Circle';
    }
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAgents} />;
  }

  if (agents.length === 0) {
    return (
      <Empty
        title="No agents available"
        description="There are no agents in the system yet."
        icon="Users"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-lg p-6 border border-slate-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="Users" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Agent Status</h3>
            <p className="text-sm text-slate-400">Real-time agent availability</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">
            {agents.filter(a => a.status === 'online').length} online
          </span>
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <ApperIcon name="User" size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{agent.name}</h4>
                  <p className="text-xs text-slate-400">Agent ID: {agent.Id}</p>
                </div>
              </div>
              <Badge variant={getStatusColor(agent.status)} size="small">
                <ApperIcon name={getStatusIcon(agent.status)} size={12} className="mr-1" />
                {agent.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Current Call:</span>
                <span className="text-white">
                  {agent.currentCall || 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Total Calls:</span>
                <span className="text-white">{agent.totalCalls}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Avg Handle Time:</span>
                <span className="text-white">{agent.avgHandleTime}s</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Satisfaction:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-1 bg-slate-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                      style={{ width: `${agent.satisfaction}%` }}
                    />
                  </div>
                  <span className="text-white text-xs">{agent.satisfaction}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AgentGrid;