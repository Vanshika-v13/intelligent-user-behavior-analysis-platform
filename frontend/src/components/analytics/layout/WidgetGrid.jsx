import React from 'react';
import PropTypes from 'prop-types';

export const WidgetGrid = ({ children, className = '' }) => {
  // Convert children to array to safely inject animation delays
  const childrenArray = React.Children.toArray(children);

  return (
    <div 
      className={`grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] ${className}`}
    >
      {childrenArray.map((child, index) => {
        if (!React.isValidElement(child)) return child;
        
        // Clone element to inject animation delay for a staggered entrance effect
        return React.cloneElement(child, {
          style: {
            ...child.props.style,
            animationDelay: `${index * 60}ms`,
            animationFillMode: 'both' // Ensures it stays hidden before animation starts
          },
          className: `${child.props.className || ''} animate-fade-in-up`.trim()
        });
      })}
    </div>
  );
};

WidgetGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
