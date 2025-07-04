import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive', 
  icon,
  color = 'primary',
  suffix = '',
  loading = false,
  className = '' 
}) => {
  const colorClasses = {
    primary: 'border-t-primary text-primary',
    success: 'border-t-success text-success',
    warning: 'border-t-warning text-warning',
    error: 'border-t-error text-error',
    info: 'border-t-info text-info'
  };

  const changeClasses = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-slate-400'
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      default:
        return 'Minus';
    }
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-lg p-6 border-t-4 border-slate-600 border border-slate-700 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-slate-600 rounded w-24"></div>
          <div className="w-8 h-8 bg-slate-600 rounded"></div>
        </div>
        <div className="h-8 bg-slate-600 rounded w-16 mb-2"></div>
        <div className="h-3 bg-slate-600 rounded w-20"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-lg p-6 border-t-4 ${colorClasses[color]} border border-slate-700 card-hover ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        {icon && (
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${color}/20 to-${color}/10 flex items-center justify-center`}>
            <ApperIcon name={icon} size={20} className={colorClasses[color]} />
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white metric-number">
            {value}
            {suffix && <span className="text-lg text-slate-400 ml-1">{suffix}</span>}
          </p>
          {change !== undefined && (
            <div className={`flex items-center mt-1 text-sm ${changeClasses[changeType]}`}>
              <ApperIcon name={getChangeIcon()} size={16} className="mr-1" />
              <span>{Math.abs(change)}% from last period</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;