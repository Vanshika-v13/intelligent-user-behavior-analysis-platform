import fs from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  generateCertificateForUser,
  getUserCertificates,
  getCertificateById,
  incrementDownloadCount
} from '../services/certificateService.js'

export const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.user._id // Provided by auth middleware

    const result = await generateCertificateForUser(userId, courseId)
    
    // Status can be 'created' or 'existing'
    res.status(result.status === 'created' ? 201 : 200).json({
      success: true,
      message: result.status === 'created' ? 'Certificate generated successfully' : 'Certificate already exists',
      certificate: result.certificate
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export const getMyCertificates = async (req, res) => {
  try {
    const userId = req.user._id
    const certificates = await getUserCertificates(userId)

    res.status(200).json({
      success: true,
      count: certificates.length,
      certificates
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates'
    })
  }
}

export const getCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params
    const certificate = await getCertificateById(certificateId)

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      })
    }

    res.status(200).json({
      success: true,
      certificate
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate'
    })
  }
}

export const downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params
    const certificate = await getCertificateById(certificateId)

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      })
    }

    // Resolve the absolute file path from the stored pdfUrl
    // pdfUrl is stored as "/certificates/<uuid>.pdf"
    // __dirname = server/src/controllers  →  go up two levels to reach server/
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    const filePath = join(__dirname, '..', '..', 'public', certificate.pdfUrl)
    console.log('[download] Resolved PDF path:', filePath)

    // Verify the file exists on disk
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Certificate PDF file not found on server'
      })
    }

    // Increment download count
    await incrementDownloadCount(certificateId)

    // Set proper response headers and send the actual PDF file
    const downloadName = `LearnPulse-Certificate-${certificate.certificateNumber}.pdf`
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`)
    res.sendFile(filePath)
  } catch (error) {
    console.error('Certificate download error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to download certificate'
    })
  }
}
