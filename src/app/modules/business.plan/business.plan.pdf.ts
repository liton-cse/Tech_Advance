import { Request, Response, NextFunction } from 'express';
import PDFDocument from 'pdfkit';
import { UserResponseModel } from './business.plan.model';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { User } from '../user/user.model';

export const generatePdf = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.params;

      const responses = await UserResponseModel.findOne({ userId });
      const user = await User.findById(userId);

      if (!responses) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'No responses found for this user',
        });
      }

      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50,
        },
      });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="business_plan_${userId}.pdf"`
      );
      doc.pipe(res);

      // Add watermark function
      const addWatermark = (doc: typeof PDFDocument, text = 'T3ch Advance') => {
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        doc.save();

        // Move origin to page center
        doc.translate(pageWidth / 2, pageHeight / 2);
        doc.rotate(-45, { origin: [0, 0] });

        // Styling for professional watermark
        doc
          .font('Helvetica-Bold')
          .fontSize(100)
          .fillColor('#000000')
          .fillOpacity(0.05)
          .text(text, -doc.widthOfString(text) / 2, -40, {
            align: 'center',
            width: doc.widthOfString(text),
          });

        doc.restore();
      };
      addWatermark(doc);

      // Header with company branding area
      doc
        .fillColor('#2c3e50')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('Business Plan Report', 0, 50, {
          align: 'center',
          width: doc.page.width,
        });

      doc
        .fillColor('#7f8c8d')
        .fontSize(12)
        .font('Helvetica')
        .text(`Generated on: ${new Date().toLocaleDateString()}`, {
          align: 'center',
        });

      doc.text(`User ID: ${user?.name}`, { align: 'center' });

      // Add a horizontal line
      doc
        .moveTo(50, 140)
        .lineTo(doc.page.width - 50, 140)
        .strokeColor('#bdc3c7')
        .lineWidth(2)
        .stroke();

      // Move cursor below the line
      doc.y = 160; // set Y position directly

      // Quiz Responses Section
      doc
        .fillColor('#34495e')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('Quiz Responses', 50, doc.y);

      doc.moveDown(1);

      if (responses.quizAnswers && responses.quizAnswers.length > 0) {
        responses.quizAnswers.forEach((qa, idx) => {
          const currentY = doc.y;

          // Question background - slightly taller for better spacing
          doc.rect(50, currentY, 495, 30).fillColor('#ecf0f1').fill();

          // Question text - properly centered vertically in the box
          doc
            .fillColor('#2c3e50')
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(`Q${idx + 1}. ${qa.question}`, 55, currentY + 10);

          // Move cursor to below the background box with proper spacing
          doc.y = currentY + 40;

          // Answer text with consistent indentation and spacing
          doc
            .fillColor('#27ae60')
            .fontSize(11)
            .font('Helvetica')
            .text('Answer:', 65, doc.y, { continued: true });

          // actual answer in black, same line
          doc
            .fillColor('black')
            .fontSize(11)
            .font('Helvetica')
            .text(` ${qa.selectedAnswer}`);

          doc.moveDown(1.2);
        });
      } else {
        doc
          .fillColor('#e74c3c')
          .fontSize(12)
          .font('Helvetica-Oblique')
          .text('No quiz responses found.');
      }

      doc.moveDown(1.5);

      // Written Responses Section
      doc
        .fillColor('#34495e')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('Written Responses', 50, doc.y);

      doc.moveDown(0.5);

      if (responses.writtenAnswers && responses.writtenAnswers.length > 0) {
        responses.writtenAnswers.forEach((wa, idx) => {
          const currentY = doc.y;

          // Question background - slightly taller for better spacing
          doc.rect(50, currentY, 495, 30).fillColor('#ecf0f1').fill();

          // Question text - properly centered vertically in the box
          doc
            .fillColor('#2c3e50')
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(`Q${idx + 1}. ${wa.question}`, 55, currentY + 10);

          // Move cursor to below the background box with proper spacing
          doc.y = currentY + 40;

          // Answer text with consistent indentation and spacing
          doc
            .fillColor('#27ae60')
            .fontSize(11)
            .font('Helvetica')
            .text('Answer:', 65, doc.y, { continued: true });

          // actual answer in black, same line
          doc
            .fillColor('black')
            .fontSize(11)
            .font('Helvetica')
            .text(` ${wa.answer}`);

          doc.moveDown(1.2);
        });
      } else {
        doc
          .fillColor('#e74c3c')
          .fontSize(12)
          .font('Helvetica-Oblique')
          .text('No written responses found.');
      }

      // Footer
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);

        const footerY = 750;
        doc
          .moveTo(50, footerY)
          .lineTo(545, footerY)
          .strokeColor('#bdc3c7')
          .lineWidth(1)
          .stroke();

        doc
          .fillColor('#7f8c8d')
          .fontSize(10)
          .font('Helvetica')
          .text(
            'This document contains confidential business information.',
            50,
            footerY + 10
          )
          .text(
            `Page ${i + 1} of ${
              pages.count
            } | Generated: ${new Date().toISOString()}`,
            50,
            footerY + 25
          );
      }

      doc.end();
    } catch (err) {
      next(err);
    }
  }
);
