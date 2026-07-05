/**
 * Future-compatible report processor.
 * Phase 3 prepares the contract only — no report output yet.
 */
export const processReportJob = async (payload = {}) => {
  const reportType = payload.reportType || 'weekly-summary'

  return {
    status: 'prepared',
    reportType,
    message: 'Report infrastructure ready — generation deferred to a later phase',
    preparedAt: new Date().toISOString(),
    metadata: payload.metadata || {},
  }
}

export default processReportJob
