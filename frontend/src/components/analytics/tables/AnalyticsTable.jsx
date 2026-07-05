import React from 'react';

export const TableContainer = ({ children, className = '' }) => (
  <div className={`w-full overflow-x-auto ${className}`}>
    <table className="w-full text-left border-collapse min-w-full">
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className = '' }) => (
  <thead className={className}>
    <tr className="border-b border-border text-xs font-medium text-muted uppercase tracking-wider">
      {children}
    </tr>
  </thead>
);

export const TableHead = ({ children, className = '', align = 'left' }) => (
  <th className={`py-3 px-4 font-semibold text-${align} ${className}`}>
    {children}
  </th>
);

export const TableBody = ({ children, className = '' }) => (
  <tbody className={className}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = '' }) => (
  <tr className={`border-b border-border/50 hover:bg-muted/5 transition-colors text-sm ${className}`}>
    {children}
  </tr>
);

export const TableCell = ({ children, className = '', align = 'left' }) => (
  <td className={`py-3 px-4 text-${align} ${className}`}>
    {children}
  </td>
);
