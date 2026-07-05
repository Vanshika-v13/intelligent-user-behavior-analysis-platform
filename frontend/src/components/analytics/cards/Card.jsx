import React from 'react';
import PropTypes from 'prop-types';

export const Card = ({
  children,
  title,
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'No data available',
  onRetry = null,
  action = null,
  className = '',
}) => {
  // Skeleton state with premium shimmer gradient
  if (loading) {
    return (
      <div className={`bg-surface border border-border/60 rounded-soft p-5 shadow-premium h-full flex flex-col ${className}`}>
        {title && <div className="h-5 w-1/3 bg-gradient-to-r from-muted/10 via-muted/20 to-muted/10 rounded animate-shimmer mb-5"></div>}
        <div className="flex-1 space-y-4">
          <div className="h-4 w-full bg-gradient-to-r from-muted/10 via-muted/20 to-muted/10 rounded animate-shimmer"></div>
          <div className="h-4 w-5/6 bg-gradient-to-r from-muted/10 via-muted/20 to-muted/10 rounded animate-shimmer"></div>
          <div className="h-4 w-4/6 bg-gradient-to-r from-muted/10 via-muted/20 to-muted/10 rounded animate-shimmer"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-surface border border-error/20 bg-error/5 rounded-soft p-5 shadow-premium h-full flex flex-col items-center justify-center text-center ${className}`}>
        <div className="text-error mb-3 bg-error/10 p-3 rounded-full">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-error mb-1">Failed to load data</h3>
        <p className="text-xs text-error/80 mb-4 max-w-[250px] leading-relaxed">{error.message || 'An unexpected error occurred while fetching data.'}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-1.5 text-xs font-medium text-surface bg-error rounded-soft hover:bg-error/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/50"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty state
  if (empty) {
    return (
      <div className={`bg-surface border border-border/60 rounded-soft p-5 shadow-premium h-full flex flex-col items-center justify-center text-center ${className}`}>
        <div className="text-muted/60 mb-3 bg-muted/5 p-3 rounded-full">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-primary-text mb-1">{emptyMessage}</h3>
        <p className="text-xs text-muted max-w-[250px] leading-relaxed mb-4">There is not enough activity yet to generate this chart.</p>
        {action && (
          <div className="mt-1">
            {action}
          </div>
        )}
      </div>
    );
  }

  // Default state with subtle borders and premium hover
  return (
    <div className={`bg-surface border border-border/60 rounded-soft shadow-premium hover:shadow-premium-hover hover:-translate-y-[2px] transition-all duration-300 ease-out flex flex-col animate-fade-in-up h-full ${className}`}>
      {title && (
        <div className="px-5 pt-5 pb-3 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-primary-text tracking-tight">{title}</h3>
        </div>
      )}
      <div className="px-5 pb-5 pt-2 flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string
  }),
  empty: PropTypes.bool,
  emptyMessage: PropTypes.string,
  onRetry: PropTypes.func,
  action: PropTypes.node,
  className: PropTypes.string,
};
