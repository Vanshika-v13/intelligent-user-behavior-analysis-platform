import React from 'react';

export function RecommendationCard({ text, type = 'info' }) {
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'danger':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${getStyles()} text-sm font-medium`}>
      {text}
    </div>
  );
}
