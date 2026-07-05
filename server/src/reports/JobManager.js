import { runJobByName } from '../jobs/jobManager.js'

/**
 * Report job orchestration layer — separate from analytics background jobs.
 */
export class ReportJobManager {
  async enqueueReportJob(reportDefinition) {
    return {
      status: 'queued',
      reportDefinition,
      handler: 'report-generation',
      message: 'Report job manager ready — execution deferred to a later phase',
    }
  }

  async enqueueMaintenanceJob(jobName) {
    return runJobByName(jobName)
  }
}

export default ReportJobManager
