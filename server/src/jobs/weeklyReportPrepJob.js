import { processReportJob } from '../processors/reportProcessor.js'

export const runWeeklyReportPrepJob = async () =>
  processReportJob({ reportType: 'weekly-summary' })

export default runWeeklyReportPrepJob
