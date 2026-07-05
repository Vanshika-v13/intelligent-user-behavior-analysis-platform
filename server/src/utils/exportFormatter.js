import XLSX from 'xlsx'

/**
 * Converts a flat object array to a CSV string.
 * @param {Object[]} rows
 * @param {string[]} headers - column keys in order
 * @returns {string}
 */
const toCSV = (rows, headers) => {
  if (!rows || rows.length === 0) return headers.join(',') + '\r\n'
  const escape = (v) => {
    const s = v == null ? '' : String(v)
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const csvRows = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ]
  return csvRows.join('\r\n') + '\r\n'
}

/**
 * Builds the multi-sheet XLSX workbook and returns a Buffer.
 * @param {Object} sheets - { sheetName: { headers, rows } }
 * @returns {Buffer}
 */
const toXLSX = (sheets) => {
  const wb = XLSX.utils.book_new()

  for (const [name, { headers, rows }] of Object.entries(sheets)) {
    const data = [headers, ...(rows || []).map((r) => headers.map((h) => r[h] ?? ''))]
    const ws = XLSX.utils.aoa_to_sheet(data)

    // Auto-width columns
    ws['!cols'] = headers.map((h) => ({
      wch: Math.max(h.length, ...rows.slice(0, 100).map((r) => String(r[h] ?? '').length)) + 2,
    }))

    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31))
  }

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
}

/**
 * Formats the aggregated analytics data payload into the requested file format.
 *
 * @param {Object} payload  - structured analytics data (see analyticsExportController)
 * @param {'csv'|'xlsx'} format
 * @returns {{ contentType: string, buffer: Buffer|string, filename: string }}
 */
export const formatExport = (payload, format) => {
  const {
    overview,
    courses,
    videos,
    quizzes,
    devices,
    funnels,
    engagement,
  } = payload

  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `analytics-export-${timestamp}`

  // ---- Build row arrays ----

  // Overview (single-row KPI sheet)
  const overviewRow = {
    'Total Users': overview?.totalUsers ?? 0,
    'Active Users': overview?.activeUsers ?? 0,
    'Total Sessions': overview?.totalSessions ?? 0,
    'Avg Session Duration (s)': overview?.averageSessionDuration ?? 0,
    'Bounce Rate (%)': overview?.bounceRate ?? 0,
    'Total Events': overview?.totalEvents ?? 0,
  }

  // Courses
  const completionRates = courses?.completionRates || []
  const enrollments = courses?.enrollments || []
  const enrollMap = new Map(enrollments.map((e) => [e.courseId, e.enrollments]))

  const courseRows = completionRates.map((c) => ({
    'Course ID': c.courseId,
    'Enrollments': enrollMap.get(c.courseId) ?? 0,
    'Active Learners (Total Users)': c.totalUsers ?? 0,
    'Completions': c.completedUsers ?? 0,
    'Completion %': c.completionRate ?? 0,
    'Avg Progress %': c.averageProgress ?? 0,
  }))

  // Videos
  const videoRows = (videos?.byVideo || []).map((v) => ({
    'Video ID': v.videoId,
    'Views (Starts)': v.starts ?? 0,
    'Completions': v.completes ?? 0,
    'Completion Rate %': v.completionRate ?? 0,
    'Avg Watch Time (s)': v.averageWatchTime ?? 0,
    'Drop-off Rate %': v.dropOffRate ?? 0,
  }))

  // Quizzes (by quiz)
  const quizRows = (quizzes?.byQuiz || []).map((q) => ({
    'Quiz ID': q.quizId,
    'Attempts': q.attempts ?? 0,
    'Avg Score': q.averageScore ?? 0,
    'Pass Rate %': q.passRate ?? 0,
  }))

  // Devices
  const deviceData = devices || {}
  const deviceRows = (deviceData.deviceDistribution || []).map((d) => ({
    'Device': d.device,
    'Sessions': d.count ?? 0,
    'Percentage %': d.percentage ?? 0,
  }))

  // Browser distribution
  const browserRows = (deviceData.browserDistribution || []).map((b) => ({
    'Browser': b.browser,
    'Sessions': b.count ?? 0,
    'Percentage %': b.percentage ?? 0,
  }))

  // OS distribution
  const osRows = (deviceData.osDistribution || []).map((o) => ({
    'OS': o.os,
    'Sessions': o.count ?? 0,
    'Percentage %': o.percentage ?? 0,
  }))

  // Funnels
  const funnelRows = (funnels?.steps || []).map((s) => ({
    'Step': s.step,
    'Event Type': s.eventType,
    'Users': s.users ?? 0,
    'Conversion Rate %': s.conversionRate ?? 0,
    'Drop-off Rate %': s.dropOffRate ?? 0,
  }))

  // Engagement
  const engagementScores = engagement?.engagementScores || []
  const engagementLevels = engagement?.engagementLevels || []
  const levelMap = new Map(engagementLevels.map((l) => [l.userId, l.level]))
  const highCount = engagementLevels.filter((l) => l.level === 'High').length
  const mediumCount = engagementLevels.filter((l) => l.level === 'Medium').length
  const lowCount = engagementLevels.filter((l) => l.level === 'Low').length
  const avgScore =
    engagementScores.length > 0
      ? Math.round(engagementScores.reduce((s, e) => s + (e.engagementScore || 0), 0) / engagementScores.length)
      : 0

  const engagementSummaryRow = {
    'High Engagement Users': highCount,
    'Medium Engagement Users': mediumCount,
    'Low Engagement Users': lowCount,
    'Avg Engagement Score': avgScore,
    'Total Users Measured': engagementScores.length,
  }

  // ---- Compose output ----

  if (format === 'xlsx') {
    const sheets = {
      'Overview': {
        headers: Object.keys(overviewRow),
        rows: [overviewRow],
      },
      'Courses': {
        headers: courseRows.length > 0 ? Object.keys(courseRows[0]) : ['Course ID', 'Enrollments', 'Active Learners (Total Users)', 'Completions', 'Completion %', 'Avg Progress %'],
        rows: courseRows,
      },
      'Videos': {
        headers: videoRows.length > 0 ? Object.keys(videoRows[0]) : ['Video ID', 'Views (Starts)', 'Completions', 'Completion Rate %', 'Avg Watch Time (s)', 'Drop-off Rate %'],
        rows: videoRows,
      },
      'Quizzes': {
        headers: quizRows.length > 0 ? Object.keys(quizRows[0]) : ['Quiz ID', 'Attempts', 'Avg Score', 'Pass Rate %'],
        rows: quizRows,
      },
      'Devices': {
        headers: deviceRows.length > 0 ? Object.keys(deviceRows[0]) : ['Device', 'Sessions', 'Percentage %'],
        rows: deviceRows,
      },
      'Browsers': {
        headers: browserRows.length > 0 ? Object.keys(browserRows[0]) : ['Browser', 'Sessions', 'Percentage %'],
        rows: browserRows,
      },
      'OS': {
        headers: osRows.length > 0 ? Object.keys(osRows[0]) : ['OS', 'Sessions', 'Percentage %'],
        rows: osRows,
      },
      'Funnel': {
        headers: funnelRows.length > 0 ? Object.keys(funnelRows[0]) : ['Step', 'Event Type', 'Users', 'Conversion Rate %', 'Drop-off Rate %'],
        rows: funnelRows,
      },
      'Engagement': {
        headers: Object.keys(engagementSummaryRow),
        rows: [engagementSummaryRow],
      },
    }

    return {
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: toXLSX(sheets),
      filename: `${filename}.xlsx`,
    }
  }

  // CSV: concatenate all sections with section headers
  const sections = [
    `\r\n### Overview ###\r\n${toCSV([overviewRow], Object.keys(overviewRow))}`,
    `\r\n### Course Analytics ###\r\n${toCSV(courseRows, courseRows.length > 0 ? Object.keys(courseRows[0]) : [])}`,
    `\r\n### Video Analytics ###\r\n${toCSV(videoRows, videoRows.length > 0 ? Object.keys(videoRows[0]) : [])}`,
    `\r\n### Quiz Analytics ###\r\n${toCSV(quizRows, quizRows.length > 0 ? Object.keys(quizRows[0]) : [])}`,
    `\r\n### Device Analytics ###\r\n${toCSV(deviceRows, deviceRows.length > 0 ? Object.keys(deviceRows[0]) : [])}`,
    `\r\n### Browser Distribution ###\r\n${toCSV(browserRows, browserRows.length > 0 ? Object.keys(browserRows[0]) : [])}`,
    `\r\n### OS Distribution ###\r\n${toCSV(osRows, osRows.length > 0 ? Object.keys(osRows[0]) : [])}`,
    `\r\n### Funnel Analytics ###\r\n${toCSV(funnelRows, funnelRows.length > 0 ? Object.keys(funnelRows[0]) : [])}`,
    `\r\n### Engagement Analytics ###\r\n${toCSV([engagementSummaryRow], Object.keys(engagementSummaryRow))}`,
  ]

  return {
    contentType: 'text/csv; charset=utf-8',
    buffer: '\uFEFF' + sections.join(''), // BOM for Excel-compatible UTF-8
    filename: `${filename}.csv`,
  }
}
