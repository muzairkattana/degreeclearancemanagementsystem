import prisma, { withDbRetry } from '../config/prisma.js';
import { buildClearancePdf } from '../utils/pdf.service.js';

// GET /api/clearance/:clearance_id/download-pdf
export const downloadClearanceCertificatePdf = async (req, res) => {
  try {
    const clearanceId = parseInt(req.params.clearance_id, 10);
    const user = req.user;

    if (isNaN(clearanceId)) {
      return res.status(400).json({ success: false, message: 'Invalid clearance ID.' });
    }

    const clearance = await withDbRetry(() =>
      prisma.clearanceRequest.findUnique({
        where: { clearance_id: clearanceId },
        include: {
          student: {
            include: {
              program: true,
            },
          },
          departmentReviews: {
            include: {
              department: true,
              officer: { select: { full_name: true } },
            },
            orderBy: { department_id: 'asc' },
          },
        },
      })
    );

    if (!clearance) {
      return res.status(404).json({ success: false, message: 'Clearance request not found.' });
    }

    // Role security check: Only the student themselves or Admin/Controller can download
    if (user.role === 'student' && clearance.student_id !== user.user_id) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only download your own certificate.' });
    }

    // Check completion
    if (clearance.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `Clearance certificate is not yet ready. Current status: ${clearance.status}`,
      });
    }

    // Set PDF download headers
    const filename = `UETM_Clearance_Certificate_${clearance.student.registration_no || clearanceId}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    // Stream PDF directly to client
    buildClearancePdf(clearance, res);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Failed to generate PDF certificate.', error: error.message });
    }
  }
};
