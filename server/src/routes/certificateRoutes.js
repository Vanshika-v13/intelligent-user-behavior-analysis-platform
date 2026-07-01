import express from 'express'
import {
  generateCertificate,
  getMyCertificates,
  getCertificate,
  downloadCertificate
} from '../controllers/certificateController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/generate/:courseId', protect, generateCertificate)
router.get('/my-certificates', protect, getMyCertificates)
router.get('/download/:certificateId', protect, downloadCertificate)
router.get('/:certificateId', protect, getCertificate)

export default router
