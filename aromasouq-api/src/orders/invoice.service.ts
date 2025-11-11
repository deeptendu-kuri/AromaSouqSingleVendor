import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Order } from '@prisma/client';

@Injectable()
export class InvoiceService {
  async generateInvoicePDF(order: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('INVOICE', { align: 'right' });

      doc.moveDown();

      // Company Info (left side)
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text('AromaSouq', 50, 150);
      doc
        .font('Helvetica')
        .fontSize(9)
        .text('Dubai, UAE', 50, 165)
        .text('info@aromasouq.com', 50, 178)
        .text('www.aromasouq.com', 50, 191);

      // Invoice Details (right side)
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('Invoice Number:', 350, 150, { continued: true })
        .font('Helvetica')
        .text(` ${order.orderNumber}`, { align: 'right' });

      doc
        .font('Helvetica-Bold')
        .text('Order Date:', 350, 165, { continued: true })
        .font('Helvetica')
        .text(
          ` ${new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}`,
          { align: 'right' }
        );

      doc
        .font('Helvetica-Bold')
        .text('Status:', 350, 180, { continued: true })
        .font('Helvetica')
        .text(` ${order.orderStatus}`, { align: 'right' });

      // Customer Info
      doc.moveDown(3);
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('Bill To:', 50);

      doc
        .font('Helvetica')
        .fontSize(9)
        .text(`${order.user.firstName} ${order.user.lastName}`, 50)
        .text(order.user.email, 50)
        .text(order.user.phone || 'N/A', 50);

      // Shipping Address
      doc.moveDown(1);
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('Ship To:', 50);

      doc
        .font('Helvetica')
        .fontSize(9)
        .text(order.address.fullName, 50)
        .text(order.address.addressLine1, 50);

      if (order.address.addressLine2) {
        doc.text(order.address.addressLine2, 50);
      }

      doc
        .text(`${order.address.city}, ${order.address.state}`, 50)
        .text(order.address.phone, 50);

      // Line separator
      doc.moveDown(2);
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();

      doc.moveDown(1);

      // Table Header
      const tableTop = doc.y;
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('Item', 50, tableTop)
        .text('Quantity', 300, tableTop, { width: 80, align: 'center' })
        .text('Price', 380, tableTop, { width: 80, align: 'right' })
        .text('Total', 460, tableTop, { width: 90, align: 'right' });

      // Line under header
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, tableTop + 15)
        .lineTo(550, tableTop + 15)
        .stroke();

      doc.moveDown(1);

      // Table Items
      let itemY = tableTop + 25;
      doc.font('Helvetica').fontSize(9);

      order.items.forEach((item: any) => {
        if (itemY > 700) {
          // Start new page if near bottom
          doc.addPage();
          itemY = 50;
        }

        const itemTotal = item.price * item.quantity;

        doc
          .text(item.product.name, 50, itemY, { width: 230 })
          .text(item.quantity.toString(), 300, itemY, { width: 80, align: 'center' })
          .text(`AED ${item.price.toFixed(2)}`, 380, itemY, { width: 80, align: 'right' })
          .text(`AED ${itemTotal.toFixed(2)}`, 460, itemY, { width: 90, align: 'right' });

        itemY += 25;
      });

      // Line before totals
      doc.moveDown(1);
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(350, itemY + 10)
        .lineTo(550, itemY + 10)
        .stroke();

      itemY += 20;

      // Totals
      doc
        .font('Helvetica')
        .fontSize(10)
        .text('Subtotal:', 380, itemY, { width: 80, align: 'right' })
        .text(`AED ${order.subtotal.toFixed(2)}`, 460, itemY, { width: 90, align: 'right' });

      itemY += 20;

      if (order.discount > 0) {
        doc
          .fillColor('green')
          .text('Discount:', 380, itemY, { width: 80, align: 'right' })
          .text(`-AED ${order.discount.toFixed(2)}`, 460, itemY, { width: 90, align: 'right' })
          .fillColor('black');

        itemY += 20;
      }

      doc
        .text('Shipping:', 380, itemY, { width: 80, align: 'right' })
        .text(`AED ${order.shippingFee.toFixed(2)}`, 460, itemY, { width: 90, align: 'right' });

      itemY += 20;

      if (order.giftWrappingFee > 0) {
        doc
          .text('Gift Wrapping:', 380, itemY, { width: 80, align: 'right' })
          .text(`AED ${order.giftWrappingFee.toFixed(2)}`, 460, itemY, {
            width: 90,
            align: 'right',
          });

        itemY += 20;
      }

      doc
        .text('Tax (5%):', 380, itemY, { width: 80, align: 'right' })
        .text(`AED ${order.tax.toFixed(2)}`, 460, itemY, { width: 90, align: 'right' });

      itemY += 20;

      // Line before grand total
      doc
        .strokeColor('#000000')
        .lineWidth(2)
        .moveTo(350, itemY)
        .lineTo(550, itemY)
        .stroke();

      itemY += 10;

      // Grand Total
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('Total:', 380, itemY, { width: 80, align: 'right' })
        .text(`AED ${order.total.toFixed(2)}`, 460, itemY, { width: 90, align: 'right' });

      // Payment Info
      doc.moveDown(3);
      doc
        .font('Helvetica')
        .fontSize(9)
        .text(`Payment Method: ${order.paymentMethod === 'CARD' ? 'Credit/Debit Card' : 'Cash on Delivery'}`, 50);

      if (order.coinsUsed > 0) {
        doc.text(`Coins Redeemed: ${order.coinsUsed} coins`, 50);
      }

      if (order.coinsEarned > 0) {
        doc.text(`Coins Earned: ${order.coinsEarned} coins`, 50);
      }

      // Footer
      doc
        .fontSize(8)
        .fillColor('#666666')
        .text(
          'Thank you for your business! For questions, contact info@aromasouq.com',
          50,
          750,
          { align: 'center', width: 500 }
        );

      doc.end();
    });
  }
}
