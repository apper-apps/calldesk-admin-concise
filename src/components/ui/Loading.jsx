import { motion } from 'framer-motion';

const Loading = ({ type = 'dashboard' }) => {
  const shimmer = {
    initial: { opacity: 0.5 },
    animate: { opacity: 1 },
    transition: { duration: 1.5, repeat: Infinity, repeatType: 'reverse' }
  };

  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              {...shimmer}
              className="bg-surface rounded-lg p-6 border border-slate-700"
            >
              <div className="h-4 bg-slate-600 rounded mb-3 w-3/4"></div>
              <div className="h-8 bg-slate-600 rounded mb-2 w-1/2"></div>
              <div className="h-3 bg-slate-600 rounded w-1/4"></div>
            </motion.div>
          ))}
        </div>

        {/* Chart Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            {...shimmer}
            className="bg-surface rounded-lg p-6 border border-slate-700"
          >
            <div className="h-6 bg-slate-600 rounded mb-6 w-1/3"></div>
            <div className="h-64 bg-slate-600 rounded"></div>
          </motion.div>

          {/* Agent Grid Skeleton */}
          <motion.div
            {...shimmer}
            className="bg-surface rounded-lg p-6 border border-slate-700"
          >
            <div className="h-6 bg-slate-600 rounded mb-6 w-1/4"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-600 rounded-full"></div>
                    <div className="h-4 bg-slate-600 rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-slate-600 rounded w-16"></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            {...shimmer}
            className="flex items-center justify-between p-4 bg-surface rounded-lg border border-slate-700"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-600 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-600 rounded w-32"></div>
                <div className="h-3 bg-slate-600 rounded w-24"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-6 bg-slate-600 rounded w-16"></div>
              <div className="h-4 bg-slate-600 rounded w-20"></div>
              <div className="h-8 bg-slate-600 rounded w-12"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-64">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;