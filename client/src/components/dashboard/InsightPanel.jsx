import React from 'react';
import Card from '../ui/Card';
import { Lightbulb } from 'lucide-react';

export function InsightPanel({ title = 'AI Insights', children }) {
  return (
    <Card className="p-6 bg-blue-50 border-blue-100">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </Card>
  );
}
