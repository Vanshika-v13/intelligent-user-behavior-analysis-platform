import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Download, Clock, ExternalLink } from 'lucide-react';
import { getMyCertificates, downloadCertificate, getCertificateViewUrl } from '../services/certificateService';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';
import analyticsService from '../services/analytics/analyticsV1Service';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await getMyCertificates();
        setCertificates(data.certificates || []);
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
    
    // Log view event
    analyticsService.trackEvent('CERTIFICATE_VIEWED', { page: '/dashboard/certificates' }).catch(console.error);
  }, []);

  const handleDownload = async (cert) => {
    try {
      // Fetch the PDF binary blob through the authenticated download endpoint
      // This also increments the downloadCount and sets lastDownloadedAt on the server
      const blob = await downloadCertificate(cert.certificateId);

      // Log analytics event
      analyticsService.trackEvent('CERTIFICATE_DOWNLOADED', { 
        page: '/dashboard/certificates',
        metadata: { certificateId: cert.certificateId, courseId: cert.courseId }
      }).catch(console.error);

      // Create a temporary object URL from the blob and trigger a browser download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `LearnPulse-Certificate-${cert.certificateNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Release the object URL to free memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download certificate', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 animate-pulse flex flex-col gap-8 h-full">
        <div className="h-10 w-48 bg-[#F1F5F9] rounded-xl mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-[#F1F5F9] rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 h-full overflow-y-auto bg-[#F8FAFC]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight flex items-center gap-3">
          <Award className="text-[#FF6B35] w-8 h-8" /> 
          My Certificates
        </h1>
        <p className="text-[#64748B] mt-2">View and download your earned certificates for completed courses.</p>
      </div>

      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-6 text-white flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none text-[#FF6B35]">
                  <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" className="absolute -right-6 -bottom-6">
                    <path d="M12 2L2 22h20L12 2zm0 3.5l7.5 15h-15L12 5.5z"/>
                  </svg>
                </div>
                <Award className="text-[#FF6B35] w-12 h-12 mb-3 relative z-10" />
                <h3 className="font-bold text-lg mb-1 relative z-10 line-clamp-2">{cert.courseTitle}</h3>
                <p className="text-xs text-[#94A3B8] uppercase tracking-wider relative z-10">Certificate of Completion</p>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Score: {cert.quizScore}%</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                    <Clock size={12}/> {new Date(cert.issuedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-6">
                  <p className="text-xs text-[#94A3B8] mb-1">Certificate ID</p>
                  <p className="text-sm font-medium text-[#0F172A] break-all">{cert.certificateNumber}</p>
                </div>
                
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <a 
                    href={getCertificateViewUrl(cert.pdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    <ExternalLink size={16} />
                    View
                  </a>
                  <button 
                    onClick={() => handleDownload(cert)}
                    className="flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#E85D2C] text-white font-semibold py-2.5 rounded-xl shadow-[0_4px_14px_0_rgba(255,107,53,0.39)] hover:shadow-[0_6px_20px_rgba(255,107,53,0.23)] hover:-translate-y-0.5 transition-all text-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-10 md:p-16 shadow-sm text-center max-w-2xl mx-auto mt-8">
          <div className="w-20 h-20 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#E2E8F0]">
            <Award className="text-[#94A3B8] w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-3">No certificates earned yet</h3>
          <p className="text-[#64748B] mb-8 max-w-md mx-auto leading-relaxed">
            Complete courses with 100% progress and pass the final quizzes to unlock your certificates.
          </p>
          <Link to={ROUTES.COURSES} className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F172A] text-white font-semibold rounded-xl hover:bg-[#1E293B] transition-colors">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
