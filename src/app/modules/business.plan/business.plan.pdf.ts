import { Request, Response, NextFunction } from 'express';
import PDFDocument from 'pdfkit';
import { UserResponseModel } from './business.plan.model';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { User } from '../user/user.model';
import axios from 'axios';

export const generatePdf = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      console.log('User ID:', userId);

      // Use Promise.all to get both responses and user data in parallel
      const [responses, user] = await Promise.all([
        UserResponseModel.findOne({ userId }).sort({ createdAt: -1 }),
        User.findById(userId).select('name image email'),
      ]);

      console.log('Responses:', responses);
      console.log('User data:', user);

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

      // Set headers BEFORE creating the PDF document
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
        margins: {
          top: 50,
          bottom: 80,
          left: 50,
          right: 50,
        },
        bufferPages: true,
      });

      // Pipe the document to response
      doc.pipe(res);

      // Add professional watermark function
      const addWatermark = (doc: PDFKit.PDFDocument, text = 'T3ch Advance') => {
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        doc.save();
        doc.translate(pageWidth / 2, pageHeight / 2);
        doc.rotate(-45, { origin: [0, 0] });

        doc
          .font('Helvetica-Bold')
          .fontSize(100)
          .fillColor('#000000')
          .fillOpacity(0.03)
          .text(text, -doc.widthOfString(text) / 2, -40, {
            align: 'center',
            width: doc.widthOfString(text),
          });

        doc.restore();
      };

      // Function to fetch and add image from URL
      const addImageFromUrl = async (
        doc: PDFKit.PDFDocument,
        imageUrl: string,
        x: number,
        y: number,
        size: number
      ) => {
        try {
          const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
          });
          const imageBuffer = Buffer.from(response.data);

          // Add circular mask for profile image
          doc.circle(x + size / 2, y + size / 2, size / 2).clip();

          doc.image(imageBuffer, x, y, {
            width: size,
            height: size,
            fit: [size, size],
          });

          doc.restore(); // Restore clipping

          // Add border
          doc
            .circle(x + size / 2, y + size / 2, size / 2)
            .strokeColor('#3498db')
            .lineWidth(2)
            .stroke();

          return true;
        } catch (error) {
          console.log('Error loading image from URL:', error);
          return false;
        }
      };

      // Function to split text into bullet points
      const splitIntoBulletPoints = (text: string): string[] => {
        if (!text) return [];

        // Split by common sentence endings
        const sentences = text.split(/(?<=[.!?])\s+/);

        // Filter out empty sentences and trim
        return sentences
          .filter(sentence => sentence.trim().length > 0)
          .map(sentence => sentence.trim());
      };

      // Function to calculate dynamic card height based on content
      const calculateCardHeight = (
        bulletPoints: string[],
        fontSize: number,
        lineGap: number,
        maxWidth: number
      ): number => {
        if (!bulletPoints.length) return 80;

        let totalHeight = 40; // Header and padding
        const lineHeight = fontSize + lineGap;

        bulletPoints.forEach(point => {
          const lines = Math.ceil(
            doc.widthOfString(point, { width: maxWidth }) / maxWidth
          );
          totalHeight += lineHeight * lines + 5; // 5px for bullet point spacing
        });

        return Math.max(80, totalHeight + 20); // Minimum height + extra padding
      };

      // Add watermark to first page
      addWatermark(doc);

      // Professional Header with gradient effect simulation
      doc.rect(0, 0, doc.page.width, 120).fillColor('#2c3e50').fill();

      doc
        .fillColor('#ffffff')
        .fontSize(28)
        .font('Helvetica-Bold')
        .text('BUSINESS PLAN REPORT', 0, 60, {
          align: 'center',
          width: doc.page.width,
        });

      doc
        .fillColor('#ecf0f1')
        .fontSize(12)
        .font('Helvetica')
        .text('Strategic Business Development Document', 0, 95, {
          align: 'center',
          width: doc.page.width,
        });

      // User Info Section with professional layout
      const userSectionY = 140;

      // User Profile Section with image from URL
      const profileSize = 60;
      const profileX = 50;

      if (user.image && user.image.startsWith('http')) {
        const imageLoaded = await addImageFromUrl(
          doc,
          user.image,
          profileX,
          userSectionY,
          profileSize
        );
        if (!imageLoaded) {
          // Fallback to professional placeholder
          doc
            .circle(
              profileX + profileSize / 2,
              userSectionY + profileSize / 2,
              profileSize / 2
            )
            .fillColor('#34495e')
            .fill()
            .strokeColor('#2c3e50')
            .lineWidth(2)
            .stroke();

          doc
            .fillColor('#ffffff')
            .fontSize(20)
            .font('Helvetica-Bold')
            .text(
              user.name.charAt(0).toUpperCase(),
              profileX + 20,
              userSectionY + 15
            );
        }
      } else {
        // Professional placeholder
        doc
          .circle(
            profileX + profileSize / 2,
            userSectionY + profileSize / 2,
            profileSize / 2
          )
          .fillColor('#34495e')
          .fill()
          .strokeColor('#2c3e50')
          .lineWidth(2)
          .stroke();

        doc
          .fillColor('#ffffff')
          .fontSize(20)
          .font('Helvetica-Bold')
          .text(
            user.name.charAt(0).toUpperCase(),
            profileX + 20,
            userSectionY + 15
          );
      }

      // User details with professional alignment
      const userInfoX = profileX + profileSize + 20;

      doc
        .fillColor('#2c3e50')
        .fontSize(16)
        .font('Helvetica-Bold')
        .text(user.name, userInfoX, userSectionY);

      doc
        .fillColor('#7f8c8d')
        .fontSize(10)
        .font('Helvetica')
        .text('PREPARED BY', userInfoX, userSectionY + 20, { continued: false })
        .text(user.email, userInfoX, userSectionY + 35, { continued: false })
        .text(
          `Generated: ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`,
          userInfoX,
          userSectionY + 50
        );

      // Business Info Section with professional cards
      const businessSectionY = userSectionY + 80;

      // Section header with icon
      doc
        .fillColor('#34495e')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('BUSINESS OVERVIEW', 50, businessSectionY);

      // Business details in professional cards
      const cardWidth = 495;
      const cardPadding = 20;

      // Business Identity Card
      const identityCardY = businessSectionY + 30;
      doc
        .rect(50, identityCardY, cardWidth, 80)
        .fillColor('#f8f9fa')
        .fill()
        .strokeColor('#e9ecef')
        .lineWidth(1)
        .stroke();

      // Card header
      doc
        .fillColor('#2c3e50')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('BUSINESS IDENTITY', 70, identityCardY + 15);

      // Business details in two columns
      const col1X = 70;
      const col2X = 300;
      const row1Y = identityCardY + 35;
      const row2Y = identityCardY + 55;

      // Column 1
      doc
        .fillColor('#7f8c8d')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Business Name:', col1X, row1Y)
        .fillColor('#2c3e50')
        .fontSize(10)
        .font('Helvetica')
        .text(responses.businessName, col1X + 80, row1Y);

      doc
        .fillColor('#7f8c8d')
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Business Type:', col1X, row2Y)
        .fillColor('#2c3e50')
        .fontSize(10)
        .font('Helvetica')
        .text(responses.businessType, col1X + 80, row2Y);

      // Process Mission and Vision into bullet points
      const missionBulletPoints = splitIntoBulletPoints(responses.mission);
      const visionBulletPoints = splitIntoBulletPoints(responses.vision);

      // Calculate dynamic card heights
      const missionCardTextWidth = cardWidth / 2 - 50;
      const visionCardTextWidth = cardWidth / 2 - 50;

      const missionCardHeight = calculateCardHeight(
        missionBulletPoints,
        10,
        4,
        missionCardTextWidth
      );
      const visionCardHeight = calculateCardHeight(
        visionBulletPoints,
        10,
        4,
        visionCardTextWidth
      );

      // Use the maximum height for both cards to keep them aligned
      const maxCardHeight = Math.max(missionCardHeight, visionCardHeight, 120);

      // Mission & Vision Cards with dynamic heights
      const missionCardY = identityCardY + 100;

      // Mission Card
      doc
        .rect(50, missionCardY, cardWidth / 2 - 10, maxCardHeight)
        .fillColor('#f8f9fa')
        .fill()
        .strokeColor('#e9ecef')
        .lineWidth(1)
        .stroke();

      doc
        .fillColor('#2c3e50')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('MISSION', 70, missionCardY + 15);

      // Add mission bullet points
      let missionCurrentY = missionCardY + 40;
      if (missionBulletPoints.length > 0) {
        missionBulletPoints.forEach((point, index) => {
          // Add bullet point
          doc
            .fillColor('#3498db')
            .fontSize(10)
            .font('Helvetica-Bold')
            .text('•', 70, missionCurrentY);

          // Add bullet point text
          doc
            .fillColor('#495057')
            .fontSize(10)
            .font('Helvetica')
            .text(point, 85, missionCurrentY, {
              width: missionCardTextWidth,
              align: 'left',
              lineGap: 4,
            });

          // Calculate height of this bullet point and move Y position
          const pointHeight = Math.ceil(
            doc.heightOfString(point, {
              width: missionCardTextWidth,
              lineGap: 4,
            }) || 15
          );

          missionCurrentY += pointHeight + 8;
        });
      } else {
        // Fallback if no bullet points
        doc
          .fillColor('#495057')
          .fontSize(10)
          .font('Helvetica')
          .text(responses.mission, 70, missionCurrentY, {
            width: missionCardTextWidth,
            align: 'left',
            lineGap: 4,
          });
      }

      // Vision Card
      const visionCardX = 50 + cardWidth / 2 + 10;
      doc
        .rect(visionCardX, missionCardY, cardWidth / 2 - 10, maxCardHeight)
        .fillColor('#f8f9fa')
        .fill()
        .strokeColor('#e9ecef')
        .lineWidth(1)
        .stroke();

      doc
        .fillColor('#2c3e50')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('VISION', visionCardX + 20, missionCardY + 15);

      // Add vision bullet points
      let visionCurrentY = missionCardY + 40;
      if (visionBulletPoints.length > 0) {
        visionBulletPoints.forEach((point, index) => {
          // Add bullet point
          doc
            .fillColor('#3498db')
            .fontSize(10)
            .font('Helvetica-Bold')
            .text('•', visionCardX + 20, visionCurrentY);

          // Add bullet point text
          doc
            .fillColor('#495057')
            .fontSize(10)
            .font('Helvetica')
            .text(point, visionCardX + 35, visionCurrentY, {
              width: visionCardTextWidth,
              align: 'left',
              lineGap: 4,
            });

          // Calculate height of this bullet point and move Y position
          const pointHeight = Math.ceil(
            doc.heightOfString(point, {
              width: visionCardTextWidth,
              lineGap: 4,
            }) || 15
          );

          visionCurrentY += pointHeight + 8;
        });
      } else {
        // Fallback if no bullet points
        doc
          .fillColor('#495057')
          .fontSize(10)
          .font('Helvetica')
          .text(responses.vision, visionCardX + 20, visionCurrentY, {
            width: visionCardTextWidth,
            align: 'left',
            lineGap: 4,
          });
      }

      // Move cursor below business section
      doc.y = missionCardY + maxCardHeight + 20;

      // Section separator
      doc
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .strokeColor('#bdc3c7')
        .lineWidth(0.5)
        .stroke();

      doc.y += 20;

      // Quiz Responses Section with professional table-like layout
      doc
        .fillColor('#34495e')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('ASSESSMENT RESPONSES', 50, doc.y);

      doc
        .fillColor('#7f8c8d')
        .fontSize(11)
        .font('Helvetica')
        .text(
          `Total Questions: ${responses.quizAnswers?.length || 0}`,
          400,
          doc.y
        );

      doc.y += 30;

      if (responses.quizAnswers && responses.quizAnswers.length > 0) {
        responses.quizAnswers.forEach((qa, idx) => {
          // Check if we need a new page
          if (doc.y > 650) {
            doc.addPage();
            addWatermark(doc);
            doc.y = 100;
          }

          const currentY = doc.y;

          // Question card with subtle background
          doc
            .rect(50, currentY, 495, 50)
            .fillColor(idx % 2 === 0 ? '#f8f9fa' : '#ffffff')
            .fill()
            .strokeColor('#ecf0f1')
            .lineWidth(0.5)
            .stroke();

          // Question number in circle
          doc
            .circle(65, currentY + 25, 12)
            .fillColor('#3498db')
            .fill();

          doc
            .fillColor('white')
            .fontSize(9)
            .font('Helvetica-Bold')
            .text((idx + 1).toString(), 60, currentY + 21);

          // Question text
          doc
            .fillColor('#2c3e50')
            .fontSize(10)
            .font('Helvetica-Bold')
            .text(qa.question, 85, currentY + 15, {
              width: 430,
            });

          // Answer with label
          doc
            .fillColor('#7f8c8d')
            .fontSize(9)
            .font('Helvetica-Bold')
            .text('Response:', 85, currentY + 32)
            .fillColor('#27ae60')
            .fontSize(9)
            .font('Helvetica')
            .text(qa.selectedAnswer, 125, currentY + 32, {
              width: 390,
            });

          doc.y = currentY + 60;
        });
      } else {
        doc
          .fillColor('#e74c3c')
          .fontSize(12)
          .font('Helvetica-Oblique')
          .text('No assessment responses found.');
      }

      // Executive Summary Section
      if (doc.y > 600) {
        doc.addPage();
        addWatermark(doc);
        doc.y = 100;
      } else {
        doc.y += 20;
      }

      doc
        .fillColor('#34495e')
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('EXECUTIVE SUMMARY', 50, doc.y);

      doc.y += 30;

      const summaryBoxY = doc.y;
      const summaryBoxHeight = 150;

      doc
        .rect(50, summaryBoxY, 495, summaryBoxHeight)
        .fillColor('#f8f9fa')
        .fill()
        .strokeColor('#e9ecef')
        .lineWidth(1)
        .stroke();

      const summaryText = `This comprehensive business plan outlines the strategic framework for ${responses.businessName}, operating within the ${responses.businessType} sector. The organization demonstrates a clear strategic direction through its defined mission and vision, supported by detailed assessment responses that reflect a structured approach to business planning and market positioning.`;

      doc
        .fillColor('#495057')
        .fontSize(10)
        .font('Helvetica')
        .text(summaryText, 60, summaryBoxY + 20, {
          width: 475,
          align: 'justify',
          lineGap: 5,
        });

      // Key Metrics in grid layout
      doc
        .fillColor('#2c3e50')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('KEY METRICS', 60, summaryBoxY + 80);

      const metrics = [
        { label: 'Business Sector', value: responses.businessType },
        {
          label: 'Assessment Score',
          value: `${responses.quizAnswers?.length || 0}/10`,
        },
        { label: 'Strategic Clarity', value: 'High' },
        { label: 'Document Status', value: 'Complete' },
      ];

      const metricWidth = 220;
      metrics.forEach((metric, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const metricX = 60 + col * metricWidth;
        const metricY = summaryBoxY + 100 + row * 25;

        doc
          .fillColor('#7f8c8d')
          .fontSize(9)
          .font('Helvetica')
          .text(metric.label, metricX, metricY)
          .fillColor('#2c3e50')
          .fontSize(10)
          .font('Helvetica-Bold')
          .text(metric.value, metricX + 100, metricY);
      });

      // Add professional footer to all pages
      const totalPages = doc.bufferedPageRange().count;

      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);

        // Footer line
        const footerY = doc.page.height - 40;
        doc
          .moveTo(50, footerY)
          .lineTo(doc.page.width - 50, footerY)
          .strokeColor('#bdc3c7')
          .lineWidth(0.5)
          .stroke();

        // Footer text
        doc
          .fillColor('#7f8c8d')
          .fontSize(8)
          .font('Helvetica')
          .text(
            `Confidential Business Plan • ${responses.businessName} • Page ${
              i + 1
            } of ${totalPages}`,
            50,
            footerY + 8,
            {
              width: doc.page.width - 100,
              align: 'center',
            }
          )
          .text(
            `Generated for ${
              user.name
            } on ${new Date().toLocaleString()} • © ${new Date().getFullYear()} T3ch Advance. All rights reserved.`,
            50,
            footerY + 20,
            {
              width: doc.page.width - 100,
              align: 'center',
            }
          );
      }

      // Finalize the PDF
      doc.end();
    } catch (err) {
      if (!res.headersSent) {
        return sendResponse(res, {
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Error generating PDF',
          data: err instanceof Error ? err.message : 'Unknown error',
        });
      } else {
        console.error('PDF generation error after headers sent:', err);
      }
    }
  }
);
