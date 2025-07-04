import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MetricCard from '@/components/molecules/MetricCard';
import CallVolumeChart from '@/components/organisms/CallVolumeChart';
import AgentGrid from '@/components/organisms/AgentGrid';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { metricService } from '@/services/api/metricService';

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await metricService.getAll();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadMetrics} />;
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
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400">Real-time call center overview</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span>Live data</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Calls"
          value="47"
          change={12}
          changeType="positive"
          icon="Phone"
          color="primary"
        />
        <MetricCard
          title="Waiting Calls"
          value="8"
          change={-5}
          changeType="negative"
          icon="Clock"
          color="warning"
        />
        <MetricCard
          title="Agents Online"
          value="23"
          change={3}
          changeType="positive"
          icon="Users"
          color="success"
        />
        <MetricCard
          title="Avg Wait Time"
          value="2.3"
          change={-8}
          changeType="positive"
          icon="Timer"
          color="info"
          suffix="min"
        />
      </div>

      {/* Charts and Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CallVolumeChart />
        <AgentGrid />
      </div>

      {/* Queue Status */}
      <div className="bg-surface rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Queue Status</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-slate-400">Real-time</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">8</div>
            <div className="text-sm text-slate-400">Calls in Queue</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-warning mb-2">2.5</div>
            <div className="text-sm text-slate-400">Avg Wait Time (min)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success mb-2">94%</div>
            <div className="text-sm text-slate-400">Service Level</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;