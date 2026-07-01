import api from './api'

// Base URL for the backend server (strips /api suffix)
const BACKEND_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '')

export const generateCertificate = async (courseId) => {
  const response = await api.post(`/certificates/generate/${courseId}`)
  return response.data
}

export const getMyCertificates = async () => {
  const response = await api.get('/certificates/my-certificates')
  return response.data
}

export const getCertificate = async (certificateId) => {
  const response = await api.get(`/certificates/${certificateId}`)
  return response.data
}

/**
 * Downloads a certificate PDF as a binary blob via the authenticated download endpoint.
 * Returns the raw Blob so the caller can create an object URL for download.
 */
export const downloadCertificate = async (certificateId) => {
  const response = await api.get(`/certificates/download/${certificateId}`, {
    responseType: 'blob'
  })
  return response.data // Blob
}

/**
 * Returns the absolute backend URL to view the PDF directly (for the "View" button).
 * The token is appended as a query param since <a href> cannot send Auth headers.
 */
export const getCertificateViewUrl = (pdfUrl) => {
  const token = localStorage.getItem('token')
  // pdfUrl is like "/certificates/<uuid>.pdf"
  return `${BACKEND_BASE_URL}${pdfUrl}${token ? `?token=${token}` : ''}`
}
