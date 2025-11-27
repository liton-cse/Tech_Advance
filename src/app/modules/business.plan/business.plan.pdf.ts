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
      const userId = req.user.id;

      const [responses, user] = await Promise.all([
        UserResponseModel.findOne({ userId }).sort({ createdAt: -1 }),
        User.findById(userId).select('name email'),
      ]);

      if (!responses) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'No responses found for this user',
        });
      }

      if (!user) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'User not found',
        });
      }

      // Set headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="business_plan_${responses.businessName.replace(
          /\s+/g,
          '_'
        )}_${Date.now()}.pdf"`
      );

      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 80, left: 50, right: 50 },
        bufferPages: true,
      });

      doc.pipe(res);

      // Watermark
      const addWatermark = (doc: PDFKit.PDFDocument, text = 'T3ch Advance') => {
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        doc.save();
        doc.translate(pageWidth / 2, pageHeight / 2);
        doc.rotate(-45);
        doc
          .font('Helvetica-Bold')
          .fontSize(100)
          .fillColor('#000000')
          .fillOpacity(0.03)
          .text(text, -doc.widthOfString(text) / 2, -40);
        doc.restore();
      };

      addWatermark(doc);

      // Header background
      doc.rect(0, 0, doc.page.width, 120).fillColor('#2c3e50').fill();

      doc
        .fillColor('#ffffff')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('BUSINESS PLAN REPORT', 0, 50, {
          align: 'center',
          width: doc.page.width,
        });

      doc
        .fillColor('#ecf0f1')
        .fontSize(12)
        .font('Helvetica')
        .text('Strategic Business Development Document', 0, 85, {
          align: 'center',
          width: doc.page.width,
        });

      // ================================
      //   USER INFO (NO PROFILE IMAGE)
      // ================================

      const userSectionY = 140;

      doc
        .fillColor('#2c3e50')
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(user.name, 50, userSectionY);

      doc
        .fillColor('#7f8c8d')
        .fontSize(10)
        .font('Helvetica')
        .text('PREPARED BY', 50, userSectionY + 20)
        .text(user.email, 50, userSectionY + 35)
        .text(
          `Generated: ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`,
          50,
          userSectionY + 50
        );

      // ================================
      // BUSINESS OVERVIEW SECTION
      // ================================

      const businessSectionY = userSectionY + 80;

      doc
        .fillColor('#34495e')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('BUSINESS OVERVIEW', 50, businessSectionY);

      const cardWidth = 495;

      // Business Identity
      const identityY = businessSectionY + 30;

      doc
        .rect(50, identityY, cardWidth, 80)
        .fillColor('#f8f9fa')
        .fill()
        .strokeColor('#e9ecef')
        .stroke();

      doc
        .fillColor('#2c3e50')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('BUSINESS IDENTITY', 70, identityY + 15);

      doc
        .fillColor('#7f8c8d')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Business Name:', 70, identityY + 40)
        .fillColor('#2c3e50')
        .fontSize(10)
        .text(responses.businessName, 160, identityY + 40);

      doc
        .fillColor('#7f8c8d')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Business Type:', 70, identityY + 60)
        .fillColor('#2c3e50')
        .fontSize(10)
        .text(responses.businessType, 160, identityY + 60);

      // Helper functions
      const splitIntoBulletPoints = (text: string): string[] => {
        if (!text) return [];
        return text
          .split(/(?<=[.!?])\s+/)
          .filter(t => t.trim())
          .map(t => t.trim());
      };

      const calculateCardHeight = (
        bulletPoints: string[],
        fontSize: number,
        lineGap: number,
        maxWidth: number
      ): number => {
        if (!bulletPoints.length) return 80;
        let height = 40;
        const lineHeight = fontSize + lineGap;

        bulletPoints.forEach(point => {
          const lines = Math.ceil(
            doc.heightOfString(point, { width: maxWidth }) / lineHeight
          );
          height += lines * lineHeight + 5;
        });

        return Math.max(120, height + 20);
      };

      const missionBP = splitIntoBulletPoints(responses.mission);
      const visionBP = splitIntoBulletPoints(responses.vision);

      const halfWidth = cardWidth / 2 - 10;
      const textWidth = halfWidth - 40;

      const missionHeight = calculateCardHeight(missionBP, 10, 4, textWidth);
      const visionHeight = calculateCardHeight(visionBP, 10, 4, textWidth);
      const cardHeight = Math.max(missionHeight, visionHeight);

      // Mission card
      const missionY = identityY + 100;

      doc
        .rect(50, missionY, halfWidth, cardHeight)
        .fillColor('#f8f9fa')
        .fill()
        .strokeColor('#e9ecef')
        .stroke();

      doc
        .fillColor('#2c3e50')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('MISSION', 70, missionY + 15);

      let mY = missionY + 40;

      missionBP.forEach(point => {
        doc.fillColor('#3498db').fontSize(10).text('•', 70, mY);

        doc
          .fillColor('#495057')
          .fontSize(10)
          .text(point, 85, mY, { width: textWidth });

        mY += doc.heightOfString(point, { width: textWidth }) + 8;
      });

      // Vision card
      const visionX = 50 + halfWidth + 20;

      doc
        .rect(visionX, missionY, halfWidth, cardHeight)
        .fillColor('#f8f9fa')
        .fill()
        .strokeColor('#e9ecef')
        .stroke();

      doc
        .fillColor('#2c3e50')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('VISION', visionX + 20, missionY + 15);

      let vY = missionY + 40;

      visionBP.forEach(point => {
        doc
          .fillColor('#3498db')
          .fontSize(10)
          .text('•', visionX + 20, vY);

        doc
          .fillColor('#495057')
          .fontSize(10)
          .text(point, visionX + 35, vY, { width: textWidth });

        vY += doc.heightOfString(point, { width: textWidth }) + 8;
      });

      // Move cursor
      doc.y = missionY + cardHeight + 20;

      // ================================
      //  ASSESSMENT RESPONSES
      // ================================

      doc
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .strokeColor('#bdc3c7')
        .stroke();

      doc.y += 20;

      doc
        .fillColor('#34495e')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('ASSESSMENT RESPONSES', 50, doc.y);

      doc.y += 30;

      responses.quizAnswers?.forEach((qa, i) => {
        if (doc.y > 650) {
          doc.addPage();
          addWatermark(doc);
          doc.y = 100;
        }

        const y = doc.y;

        doc
          .rect(50, y, 495, 50)
          .fillColor(i % 2 ? '#ffffff' : '#f8f9fa')
          .fill()
          .strokeColor('#ecf0f1')
          .stroke();

        doc
          .circle(65, y + 25, 12)
          .fillColor('#3498db')
          .fill();

        doc
          .fillColor('#ffffff')
          .fontSize(9)
          .text((i + 1).toString(), 60, y + 21);

        doc
          .fillColor('#000000')
          .fontSize(10)
          .font('Helvetica-Bold')
          .text(qa.question, 85, y + 10, { width: 430 });

        doc
          .fillColor('#7f8c8d')
          .fontSize(9)
          .font('Helvetica-Bold')
          .text('Answer: ', 85, y + 30)
          .fillColor('#000000')
          .text(qa.selectedAnswer, 145, y + 30, { width: 390 });

        doc.y = y + 60;
      });

      // ================================
      // EXECUTIVE SUMMARY
      // ================================

      if (doc.y > 600) {
        doc.addPage();
        addWatermark(doc);
        doc.y = 100;
      }

      doc
        .fillColor('#34495e')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('EXECUTIVE SUMMARY', 50, doc.y);

      doc.y += 10;

      const sumY = doc.y;

      doc
        .rect(50, sumY, 495, 150)
        .fillColor('#f8f9fa')
        .fill()
        .strokeColor('#e9ecef')
        .stroke();

      const summaryText = `This comprehensive business plan outlines the strategic framework for ${responses.businessName}, operating within the ${responses.businessType} sector. The organization demonstrates clear direction with defined mission and vision, supported by detailed assessment responses indicating strong strategic planning.`;

      doc
        .fillColor('#495057')
        .fontSize(10)
        .text(summaryText, 60, sumY + 20, {
          width: 465,
          align: 'justify',
        });

      doc.end();
    } catch (err) {
      if (!res.headersSent) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Error generating PDF',
          data: err instanceof Error ? err.message : 'Unknown error',
        });
      }
      console.log(err);
    }
  }
);
