import React from 'react';
import Card from '../ui/Card';

export function ChartContainer({ title, description, children, height = 300, action }) {
  return (
    <Card className="p-6 flex flex-col w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full flex-grow" style={{ minHeight: height }}>
        {children}
      </div>
    </Card>
  );
}
