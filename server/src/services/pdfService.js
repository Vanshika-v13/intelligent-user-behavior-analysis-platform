import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const generateCertificatePDF = (certificateData) => {
  return new Promise((resolve, reject) => {
    try {
      const { userName, courseTitle, quizScore, issuedAt, certificateNumber, certificateId } = certificateData
      
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 50
      })

      // We go up: src/services -> src -> server -> public/certificates
      const certificatesDir = path.join(__dirname, '..', '..', 'public', 'certificates')
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true })
      }

      const fileName = `${certificateId}.pdf`
      const filePath = path.join(certificatesDir, fileName)
      const stream = fs.createWriteStream(filePath)

      doc.pipe(stream)

      // Colors
      const primaryColor = '#FF6B35'
      const darkColor = '#0F172A'
      const bgColor = '#F8FAFC'
      const borderColor = '#E2E8F0'

      // Background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(bgColor)
      
      // Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
         .lineWidth(2)
         .stroke(borderColor)
      doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50)
         .lineWidth(1)
         .stroke(borderColor)

      // Header
      doc.y = 80
      doc.fillColor(primaryColor)
         .font('Helvetica-Bold')
         .fontSize(40)
         .text('LEARNPULSE', { align: 'center' })

      doc.moveDown(0.5)
      doc.fillColor(darkColor)
         .font('Helvetica')
         .fontSize(24)
         .text('Certificate of Completion', { align: 'center' })

      // Body
      doc.moveDown(2)
      doc.fillColor('#64748B')
         .fontSize(16)
         .text('This certifies that', { align: 'center' })

      doc.moveDown(0.5)
      doc.fillColor(darkColor)
         .font('Helvetica-Bold')
         .fontSize(36)
         .text(userName, { align: 'center' })

      doc.moveDown(0.5)
      doc.fillColor('#64748B')
         .font('Helvetica')
         .fontSize(16)
         .text('has successfully completed', { align: 'center' })

      doc.moveDown(0.5)
      doc.fillColor(primaryColor)
         .font('Helvetica-Bold')
         .fontSize(28)
         .text(courseTitle, { align: 'center' })

      doc.moveDown(0.5)
      doc.fillColor(darkColor)
         .font('Helvetica')
         .fontSize(16)
         .text(`With a score of ${quizScore}%`, { align: 'center' })

      // Footer
      const footerY = doc.page.height - 120
      
      // Date and ID (Left)
      doc.y = footerY
      const formattedDate = new Date(issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      doc.fillColor('#64748B')
         .font('Helvetica')
         .fontSize(12)
         .text(`Issued On: ${formattedDate}`, 80, footerY)
      doc.text(`Certificate No: ${certificateNumber}`, 80, footerY + 20)
      doc.text(`ID: ${certificateId}`, 80, footerY + 40)

      // Seal (Center)
      const centerX = doc.page.width / 2
      doc.circle(centerX, footerY + 20, 35)
         .lineWidth(2)
         .stroke(primaryColor)
      doc.circle(centerX, footerY + 20, 30)
         .lineWidth(1)
         .stroke(primaryColor)
      doc.fillColor(primaryColor)
         .font('Helvetica-Bold')
         .fontSize(10)
         .text('LEARNPULSE', centerX - 32, footerY + 16, { width: 64, align: 'center' })
      doc.font('Helvetica')
         .fontSize(8)
         .text('CERTIFIED', centerX - 32, footerY + 26, { width: 64, align: 'center' })

      // Signature (Right)
      doc.fillColor(darkColor)
         .font('Helvetica')
         .fontSize(16)
         .text('Jane Doe', doc.page.width - 250, footerY + 20, { align: 'center', width: 170 })
      
      doc.moveTo(doc.page.width - 250, footerY + 40)
         .lineTo(doc.page.width - 80, footerY + 40)
         .stroke(borderColor)
         
      doc.fillColor('#64748B')
         .fontSize(12)
         .text('Lead Instructor', doc.page.width - 250, footerY + 45, { align: 'center', width: 170 })

      doc.end()

      stream.on('finish', () => {
        resolve(`/certificates/${fileName}`) // Return the public URL
      })

      stream.on('error', (err) => {
        reject(err)
      })

    } catch (error) {
      reject(error)
    }
  })
}
