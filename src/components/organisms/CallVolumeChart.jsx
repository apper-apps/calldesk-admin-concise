import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';

const CallVolumeChart = ({ className = '' }) => {
  const [chartData, setChartData] = useState({
    series: [{
      name: 'Calls',
      data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 75, 82, 70]
    }],
    options: {
      chart: {
        type: 'area',
        height: 350,
        background: 'transparent',
        toolbar: {
          show: false
        }
      },
      theme: {
        mode: 'dark'
      },
      colors: ['#3B82F6'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 3
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: '#9CA3AF'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#9CA3AF'
          }
        }
      },
      tooltip: {
        theme: 'dark',
        style: {
          fontSize: '12px',
          backgroundColor: '#1E293B'
        }
      }
    }
  });

  const [timeRange, setTimeRange] = useState('24h');

  const timeRanges = [
    { key: '24h', label: '24 Hours' },
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' }
  ];

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    // Simulate data update
    const newData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 20);
    setChartData(prev => ({
      ...prev,
      series: [{
        ...prev.series[0],
        data: newData
      }]
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-lg p-6 border border-slate-700 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name="TrendingUp" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Call Volume</h3>
            <p className="text-sm text-slate-400">Real-time call traffic</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range.key}
              onClick={() => handleTimeRangeChange(range.key)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range.key
                  ? 'bg-primary text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="area"
          height="100%"
        />
      </div>
    </motion.div>
  );
};

export default CallVolumeChart;