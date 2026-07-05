/**
 * Future-compatible report generation service.
 * Phase 3 prepares the contract only — no report output yet.
 */
export class ReportService {
  constructor({ exportService, storageAdapter, jobManager } = {}) {
    this.exportService = exportService
    this.storageAdapter = storageAdapter
    this.jobManager = jobManager
  }

  async scheduleReport(reportDefinition) {
    if (!reportDefinition?.type) {
      throw new Error('Report type is required')
    }

    return {
      status: 'scheduled',
      reportDefinition,
      message: 'Report infrastructure ready — generation deferred to a later phase',
    }
  }

  async getReportStatus(reportId) {
    return {
      reportId,
      status: 'not_implemented',
    }
  }
}

export default ReportService
