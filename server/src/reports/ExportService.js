/**
 * Future-compatible export service for CSV/PDF/JSON report artifacts.
 */
export class ExportService {
  async exportToFormat(_payload, format = 'json') {
    return {
      format,
      status: 'not_implemented',
      message: 'Export pipeline reserved for a later phase',
    }
  }
}

export default ExportService
