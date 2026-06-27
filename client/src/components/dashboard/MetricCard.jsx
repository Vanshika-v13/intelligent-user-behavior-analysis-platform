import React from 'react';
import Card from '../ui/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function MetricCard({ title, value, trend, trendValue, icon: Icon }) {
  const isPositive = trend === 'up';
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {Icon && (
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Icon size={20} />
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-4">
        <h2 className="text-3xl font-semibold text-gray-900">{value}</h2>
        
        {trend && (
          <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
            {trendValue}
          </span>
        )}
      </div>
    </Card>
  );
}
