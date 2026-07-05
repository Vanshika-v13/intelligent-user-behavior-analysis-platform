import api from '../api';

/**
 * Calls GET /api/analytics/export with all active filters.
 * Backend returns a binary file (CSV or XLSX).
 * Triggers a browser download automatically.
 *
 * @param {Object} filters  - { dateRange, timeInterval, courseFilter }
 * @param {'csv'|'xlsx'} format
 */
export const exportAnalytics = async (filters, format = 'csv') => {
  const response = await api.get('/analytics/export', {
    params: {
      ...filters,
      format,
    },
    responseType: 'blob',
  });

  // Build a descriptive filename
  const ext = format === 'xlsx' ? 'xlsx' : 'csv';
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `analytics-export-${timestamp}.${ext}`;

  // Trigger browser download
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};
