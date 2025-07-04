import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background';
  
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white focus:ring-primary',
    secondary: 'bg-surface hover:bg-surface/80 text-white border border-slate-600 focus:ring-primary',
    success: 'bg-success hover:bg-success/90 text-white focus:ring-success',
    danger: 'bg-error hover:bg-error/90 text-white focus:ring-error',
    warning: 'bg-warning hover:bg-warning/90 text-white focus:ring-warning',
    ghost: 'hover:bg-slate-700 text-slate-300 hover:text-white focus:ring-primary',
    gradient: 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white focus:ring-primary'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="mr-2">
          <ApperIcon name="Loader2" size={16} className="animate-spin" />
        </div>
      )}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} size={16} className="mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} size={16} className="ml-2" />
      )}
    </motion.button>
  );
};

export default Button;