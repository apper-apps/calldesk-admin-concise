import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import MetricCard from '@/components/molecules/MetricCard';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { metricService } from '@/services/api/metricService';

const Analytics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('30d');

  const dateRanges = [
    { key: '24h', label: '24 Hours' },
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' }
  ];

  useEffect(() => {
    loadMetrics();
  }, [dateRange]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await metricService.getAll();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const callVolumeChart = {
    series: [{
      name: 'Inbound Calls',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 67, 70, 72]
    }, {
      name: 'Outbound Calls',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 44, 48, 52]
    }],
    options: {
      chart: {
        type: 'line',
        height: 350,
        background: 'transparent',
        toolbar: { show: false }
      },
      theme: { mode: 'dark' },
      colors: ['#3B82F6', '#10B981'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      grid: { borderColor: '#374151', strokeDashArray: 3 },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: { style: { colors: '#9CA3AF' } }
      },
      yaxis: { labels: { style: { colors: '#9CA3AF' } } },
      tooltip: { theme: 'dark' },
      legend: { labels: { colors: '#9CA3AF' } }
    }
  };

  const responseTimeChart = {
    series: [{
      name: 'Response Time',
      data: [2.3, 3.1, 4.0, 1.8, 2.1, 1.4, 2.8, 3.5, 2.2, 1.9, 2.6, 3.2]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        background: 'transparent',
        toolbar: { show: false }
      },
      theme: { mode: 'dark' },
      colors: ['#F59E0B'],
      dataLabels: { enabled: false },
      grid: { borderColor: '#374151', strokeDashArray: 3 },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: { style: { colors: '#9CA3AF' } }
      },
      yaxis: { labels: { style: { colors: '#9CA3AF' } } },
      tooltip: { theme: 'dark' }
    }
  };

  const satisfactionChart = {
    series: [94, 6],
    options: {
      chart: {
        type: 'donut',
        height: 300,
        background: 'transparent'
      },
      theme: { mode: 'dark' },
      colors: ['#10B981', '#EF4444'],
      labels: ['Satisfied', 'Dissatisfied'],
      dataLabels: {
        enabled: true,
        style: { colors: ['#FFFFFF'] }
      },
      legend: { labels: { colors: '#9CA3AF' } },
      plotOptions: {
        pie: {
          donut: { size: '70%' }
        }
      }
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
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400">Detailed performance insights and trends</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {dateRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setDateRange(range.key)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range.key
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <Button variant="secondary" icon="Download">
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Calls"
          value="1,247"
          change={15}
          changeType="positive"
          icon="Phone"
          color="primary"
        />
        <MetricCard
          title="Avg Handle Time"
          value="3.2"
          change={-8}
          changeType="positive"
          icon="Clock"
          color="success"
          suffix="min"
        />
        <MetricCard
          title="First Call Resolution"
          value="87"
          change={5}
          changeType="positive"
          icon="CheckCircle"
          color="info"
          suffix="%"
        />
        <MetricCard
          title="Customer Satisfaction"
          value="4.7"
          change={2}
          changeType="positive"
          icon="Star"
          color="warning"
          suffix="/5"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Volume Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface rounded-lg p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Call Volume Trends</h3>
                <p className="text-sm text-slate-400">Inbound vs Outbound</p>
              </div>
            </div>
          </div>
          <Chart
            options={callVolumeChart.options}
            series={callVolumeChart.series}
            type="line"
            height={300}
          />
        </motion.div>

        {/* Response Time Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface rounded-lg p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-warning/20 to-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Timer" size={20} className="text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Response Time</h3>
                <p className="text-sm text-slate-400">Average response time by month</p>
              </div>
            </div>
          </div>
          <Chart
            options={responseTimeChart.options}
            series={responseTimeChart.series}
            type="bar"
            height={300}
          />
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Satisfaction Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-lg p-6 border border-slate-700"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-success/20 to-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Star" size={20} className="text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Customer Satisfaction</h3>
              <p className="text-sm text-slate-400">Overall satisfaction rate</p>
            </div>
          </div>
          <Chart
            options={satisfactionChart.options}
            series={satisfactionChart.series}
            type="donut"
            height={250}
          />
        </motion.div>

        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-surface rounded-lg p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Service Level (24h)</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <span className="text-white font-medium">94%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Abandonment Rate</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-error rounded-full" style={{ width: '6%' }}></div>
                  </div>
                  <span className="text-white font-medium">6%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Agent Utilization</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-600 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-white font-medium">78%</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Peak Hours</span>
                <span className="text-white font-medium">10AM - 2PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Busiest Day</span>
                <span className="text-white font-medium">Tuesday</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Calls/Agent/Day</span>
                <span className="text-white font-medium">54</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;