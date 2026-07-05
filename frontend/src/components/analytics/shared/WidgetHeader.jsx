import React from 'react';
import PropTypes from 'prop-types';

export const WidgetHeader = ({ title, badge, action, tooltip }) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-primary-text">{title}</span>
        {tooltip && (
          <div className="group relative flex items-center">
            <svg className="w-4 h-4 text-muted hover:text-primary-text transition-colors cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-surface border border-border/60 shadow-premium rounded text-xs text-muted z-10 text-center pointer-events-none">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {badge && <div>{badge}</div>}
        {action && <div>{action}</div>}
      </div>
    </div>
  );
};

WidgetHeader.propTypes = {
  title: PropTypes.string.isRequired,
  badge: PropTypes.node,
  action: PropTypes.node,
  tooltip: PropTypes.string,
};
