import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  pulse = false,
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    primary: 'bg-primary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    danger: 'bg-error text-white',
    info: 'bg-info text-white',
    online: 'bg-success text-white status-online',
    busy: 'bg-error text-white status-busy',
    away: 'bg-warning text-white status-away',
    offline: 'bg-slate-600 text-slate-300 status-offline'
  };

  const sizes = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const Component = pulse ? motion.span : 'span';
  const motionProps = pulse ? {
    animate: { scale: [1, 1.1, 1] },
    transition: { duration: 2, repeat: Infinity }
  } : {};

  return (
    <Component className={classes} {...motionProps}>
      {children}
    </Component>
  );
};

export default Badge;