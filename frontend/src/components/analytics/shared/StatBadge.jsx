import React from 'react';
import PropTypes from 'prop-types';

export const StatBadge = ({ value, type = 'neutral', label, className = '' }) => {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border';
  
  const typeStyles = {
    success: 'bg-success/10 text-success border-success/20',
    error: 'bg-error/10 text-error border-error/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    neutral: 'bg-muted/10 text-muted border-border/60',
    primary: 'bg-primary/10 text-primary border-primary/20',
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <span className={`${baseStyles} ${typeStyles[type]} ${className}`}>
      {getIcon()}
      <span>{value}</span>
      {label && <span className="opacity-80 font-normal">{label}</span>}
    </span>
  );
};

StatBadge.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'neutral', 'primary']),
  label: PropTypes.string,
  className: PropTypes.string,
};
