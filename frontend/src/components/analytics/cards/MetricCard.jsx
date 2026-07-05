import React from 'react';
import PropTypes from 'prop-types';
import { Card } from './Card';
import { useCountUp } from '../../../hooks/useCountUp';

export const MetricCard = React.memo(({ 
  title, 
  value, 
  trend, 
  trendValue, 
  isPositive,
  subtitle,
  accent,
  loading, 
  error, 
  refetch 
}) => {
  // If the value is a number, we can use useCountUp. 
  // If it's a string (like '1m 20s' or '50%'), we should just display it.
  const isNumber = typeof value === 'number';
  const animatedValue = useCountUp(isNumber ? value : 0, 1000);
  const displayValue = isNumber ? animatedValue : value;

  // trendValue from Overview, trend from UserKPIs. Combine them.
  const displayTrend = trendValue || trend;

  return (
    <Card loading={loading} error={error} onRetry={refetch} className="flex-1 group">
      <div className="flex flex-col h-full justify-between">
        <h3 className="text-sm font-medium text-muted-text mb-3 tracking-tight group-hover:text-primary-text transition-colors uppercase">{title}</h3>
        <div className="flex items-baseline gap-3">
          <span className={`text-3xl font-heading font-bold tracking-tight ${accent || 'text-primary-text'}`}>
            {displayValue}
          </span>
          {displayTrend && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${isPositive ? 'text-success bg-success/10 group-hover:bg-success/20' : 'text-error bg-error/10 group-hover:bg-error/20'}`}>
              <span className={`transform transition-transform duration-300 ${isPositive ? 'group-hover:-translate-y-0.5' : 'group-hover:translate-y-0.5'}`}>
                {isPositive ? '↑' : '↓'}
              </span>
              {displayTrend}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-muted mt-2">{subtitle}</p>}
      </div>
    </Card>
  );
});

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.string,
  trendValue: PropTypes.string,
  isPositive: PropTypes.bool,
  subtitle: PropTypes.string,
  accent: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.object,
  refetch: PropTypes.func,
};
