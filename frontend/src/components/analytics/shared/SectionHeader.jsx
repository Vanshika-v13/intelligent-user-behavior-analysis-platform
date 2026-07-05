import React from 'react';
import PropTypes from 'prop-types';

export const SectionHeader = ({ title, description, actions, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h2 className="text-xl font-bold text-primary-text tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted mt-1 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
  className: PropTypes.string,
};
