import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface BookingEmailData {
  guestName: string;
  guestEmail: string;
  bookingId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  numberOfGuests: number;
  tableNumber: number;
  tableLocation: string;
  specialRequests?: string;
}

export const sendBookingConfirmationEmail = async (data: BookingEmailData): Promise<void> => {
  try {
    const formattedDate = new Date(data.bookingDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#0c0b0a; font-family:'Georgia','Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0c0b0a; padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#141311; border:1px solid rgba(201,169,110,0.15); border-radius:12px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1408 0%, #141311 100%); padding:40px 40px 30px; text-align:center; border-bottom:1px solid rgba(201,169,110,0.12);">
              <div style="width:50px; height:50px; border-radius:50%; background:rgba(201,169,110,0.1); border:1px solid rgba(201,169,110,0.3); margin:0 auto 16px; line-height:50px; color:#C9A96E; font-size:20px; font-weight:bold;">P</div>
              <h1 style="color:#C9A96E; font-size:14px; letter-spacing:4px; text-transform:uppercase; margin:0 0 4px; font-weight:400;">The Prime Cut</h1>
              <p style="color:rgba(158,153,142,0.6); font-size:10px; letter-spacing:3px; text-transform:uppercase; margin:0;">Steakhouse · Kharar</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:40px 40px 20px;">
              <h2 style="color:#f0ece4; font-size:24px; font-weight:400; margin:0 0 16px; line-height:1.3;">Your Table Awaits, ${data.guestName}</h2>
              <p style="color:#9e998e; font-size:14px; line-height:1.7; margin:0;">
                We are delighted to confirm your reservation at The Prime Cut. Every detail has been noted, and our team is preparing to make your evening truly exceptional. From the moment you walk through our doors, expect nothing less than an unforgettable dining experience.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px; background:linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent);"></div>
            </td>
          </tr>

          <!-- Reservation Details -->
          <tr>
            <td style="padding:30px 40px;">
              <h3 style="color:#C9A96E; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin:0 0 20px; font-weight:400;">Reservation Details</h3>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid rgba(61,58,51,0.4);">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Confirmation</span><br>
                    <span style="color:#C9A96E; font-size:16px; font-family:monospace; letter-spacing:1px;">${data.bookingId}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid rgba(61,58,51,0.4);">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Date</span><br>
                    <span style="color:#f0ece4; font-size:16px;">${formattedDate}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid rgba(61,58,51,0.4);">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Time</span><br>
                    <span style="color:#f0ece4; font-size:16px;">${data.startTime} — ${data.endTime}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid rgba(61,58,51,0.4);">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Party Size</span><br>
                    <span style="color:#f0ece4; font-size:16px;">${data.numberOfGuests} ${data.numberOfGuests === 1 ? 'Guest' : 'Guests'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;${data.specialRequests ? ' border-bottom:1px solid rgba(61,58,51,0.4);' : ''}">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Table</span><br>
                    <span style="color:#f0ece4; font-size:16px;">Table ${data.tableNumber} · ${data.tableLocation.charAt(0).toUpperCase() + data.tableLocation.slice(1)} Section</span>
                  </td>
                </tr>
                ${data.specialRequests ? `
                <tr>
                  <td style="padding:10px 0;">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Special Requests</span><br>
                    <span style="color:#f0ece4; font-size:14px; font-style:italic;">"${data.specialRequests}"</span>
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px; background:linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent);"></div>
            </td>
          </tr>

          <!-- Personal Message -->
          <tr>
            <td style="padding:30px 40px;">
              <p style="color:#9e998e; font-size:14px; line-height:1.8; margin:0; font-style:italic;">
                "At The Prime Cut, we believe dining is not merely eating — it is a celebration of craft, community, and the finest ingredients. We have hand-selected every cut, curated every detail, and prepared our dining room especially for you. We cannot wait to welcome you."
              </p>
              <p style="color:#C9A96E; font-size:12px; margin:16px 0 0; letter-spacing:1px;">
                — The Prime Cut Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:rgba(8,8,7,0.6); padding:24px 40px; text-align:center; border-top:1px solid rgba(61,58,51,0.2);">
              <p style="color:rgba(158,153,142,0.5); font-size:11px; margin:0 0 4px; letter-spacing:1px;">The Prime Cut Steakhouse</p>
              <p style="color:rgba(158,153,142,0.4); font-size:10px; margin:0;">Kharar, Punjab · +91 98765 43210 · info@theprimecut.com</p>
              <p style="color:rgba(158,153,142,0.3); font-size:10px; margin:8px 0 0;">&copy; 2024 The Prime Cut. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const info = await transporter.sendMail({
      from: `"The Prime Cut" <${process.env.SMTP_USER}>`,
      to: data.guestEmail,
      subject: `Your Table is Reserved, ${data.guestName} — The Prime Cut ✦`,
      html: htmlContent,
    });

    console.log(`📧 Booking confirmation email sent to ${data.guestEmail} (Message ID: ${info.messageId})`);
  } catch (error: any) {
    console.error('📧 Failed to send booking email:', error.message);
    // Don't throw — email failure should not block the booking
  }
};

export const sendDeliveryConfirmationEmail = async (email: string, delivery: any): Promise<void> => {
  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#0c0b0a; font-family:'Georgia','Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0c0b0a; padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#141311; border:1px solid rgba(201,169,110,0.15); border-radius:12px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1a1408 0%, #141311 100%); padding:40px 40px 30px; text-align:center; border-bottom:1px solid rgba(201,169,110,0.12);">
              <div style="width:50px; height:50px; border-radius:50%; background:rgba(201,169,110,0.1); border:1px solid rgba(201,169,110,0.3); margin:0 auto 16px; line-height:50px; color:#C9A96E; font-size:20px; font-weight:bold;">🚗</div>
              <h1 style="color:#C9A96E; font-size:14px; letter-spacing:4px; text-transform:uppercase; margin:0 0 4px; font-weight:400;">Home Delivery Confirmed</h1>
              <p style="color:rgba(158,153,142,0.6); font-size:10px; letter-spacing:3px; text-transform:uppercase; margin:0;">The Prime Cut · Premium Cuisine</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:40px 40px 20px;">
              <h2 style="color:#f0ece4; font-size:24px; font-weight:400; margin:0 0 16px; line-height:1.3;">Your Order is On Its Way!</h2>
              <p style="color:#9e998e; font-size:14px; line-height:1.7; margin:0;">
                We've received your delivery order and are preparing your meal with the same care and attention we bring to our dining room. Your food will arrive fresh, hot, and ready to enjoy.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px; background:linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent);"></div>
            </td>
          </tr>

          <!-- Delivery Details -->
          <tr>
            <td style="padding:30px 40px;">
              <h3 style="color:#C9A96E; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin:0 0 20px; font-weight:400;">Delivery Information</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid rgba(61,58,51,0.4);">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Delivery ID</span><br>
                    <span style="color:#f0ece4; font-size:16px; font-family:monospace;">${delivery.deliveryId}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid rgba(61,58,51,0.4);">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Recipient</span><br>
                    <span style="color:#f0ece4; font-size:16px;">${delivery.recipientName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid rgba(61,58,51,0.4);">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Delivery Address</span><br>
                    <span style="color:#f0ece4; font-size:16px;">${delivery.deliveryAddress.street}<br>${delivery.deliveryAddress.city}, ${delivery.deliveryAddress.state} ${delivery.deliveryAddress.zipCode}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Estimated Delivery</span><br>
                    <span style="color:#C9A96E; font-size:16px; font-weight:bold;">45 minutes</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Summary -->
          <tr>
            <td style="padding:30px 40px; background:rgba(20,19,17,0.4); border-top:1px solid rgba(61,58,51,0.3); border-bottom:1px solid rgba(61,58,51,0.3);">
              <h3 style="color:#C9A96E; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin:0 0 16px; font-weight:400;">Order Total</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:8px 0; color:#9e998e; font-size:13px;">Subtotal: <span style="float:right; color:#f0ece4;">₹${delivery.totalAmount.toFixed(2)}</span></td>
                </tr>
                <tr>
                  <td style="padding:8px 0; color:#9e998e; font-size:13px;">Delivery Fee: <span style="float:right; color:#f0ece4;">₹${delivery.deliveryFee.toFixed(2)}</span></td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-top:1px solid rgba(61,58,51,0.4); color:#C9A96E; font-size:15px; font-weight:bold;">
                    Grand Total: <span style="float:right;">₹${(delivery.totalAmount + delivery.deliveryFee).toFixed(2)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:rgba(8,8,7,0.6); padding:24px 40px; text-align:center; border-top:1px solid rgba(61,58,51,0.2);">
              <p style="color:rgba(158,153,142,0.5); font-size:11px; margin:0 0 4px; letter-spacing:1px;">The Prime Cut Steakhouse</p>
              <p style="color:rgba(158,153,142,0.4); font-size:10px; margin:0;">Kharar, Punjab · +91 98765 43210 · info@theprimecut.com</p>
              <p style="color:rgba(158,153,142,0.3); font-size:10px; margin:8px 0 0;">Thank you for choosing The Prime Cut for home dining! 🚗</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"The Prime Cut" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Delivery Order Confirmed — ${delivery.deliveryId} ✦`,
      html: htmlContent,
    });

    console.log(`📧 Delivery confirmation email sent to ${email}`);
  } catch (error: any) {
    console.error('📧 Failed to send delivery email:', error.message);
  }
};

export const sendSpecialOccasionEmail = async (email: string, delivery: any): Promise<void> => {
  try {
    const occasion = delivery.specialOccasion?.type || 'celebration';
    const occasionEmojiMap: Record<string, string> = {
      birthday: '🎂',
      anniversary: '💕',
      celebration: '🎉',
      promotion: '🏆',
      wedding: '💒',
    };
    const occasionEmoji = occasionEmojiMap[occasion] || '✨';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#0c0b0a; font-family:'Georgia','Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0c0b0a; padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color:#141311; border:1px solid rgba(185,139,139,0.15); border-radius:12px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, rgba(185,139,139,0.1) 0%, #141311 100%); padding:40px 40px 30px; text-align:center; border-bottom:1px solid rgba(185,139,139,0.12);">
              <div style="font-size:50px; margin:0 0 16px; letter-spacing:4px;">${occasionEmoji}</div>
              <h1 style="color:#B88B8B; font-size:14px; letter-spacing:4px; text-transform:uppercase; margin:0 0 4px; font-weight:400;">A Special Moment Awaits</h1>
              <p style="color:rgba(158,153,142,0.6); font-size:10px; letter-spacing:3px; text-transform:uppercase; margin:0;">The Prime Cut · Premium Celebration Service</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:40px 40px 20px;">
              <h2 style="color:#f0ece4; font-size:24px; font-weight:400; margin:0 0 16px; line-height:1.3;">
                ${occasion === 'birthday' ? 'Let Them Have Cake!' : occasion === 'anniversary' ? 'A Moment to Celebrate Love' : 'A Culinary Celebration'}
              </h2>
              <p style="color:#9e998e; font-size:14px; line-height:1.7; margin:0;">
                We're thrilled to be part of this special moment! ${delivery.specialOccasion?.message ? `<br><br><em style="color:#B88B8B;">"${delivery.specialOccasion.message}"</em>` : ''}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px; background:linear-gradient(90deg, transparent, rgba(185,139,139,0.2), transparent);"></div>
            </td>
          </tr>

          <!-- Special Details -->
          <tr>
            <td style="padding:30px 40px; background:rgba(185,139,139,0.05);">
              <h3 style="color:#B88B8B; font-size:11px; letter-spacing:3px; text-transform:uppercase; margin:0 0 16px; font-weight:400;">Celebration Details</h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:8px 0;">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">For: ${delivery.specialOccasion?.recipientName || 'Our Honored Guest'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <span style="color:#9e998e; font-size:11px; text-transform:uppercase; letter-spacing:2px;">Occasion: ${occasion.charAt(0).toUpperCase() + occasion.slice(1)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Thank You -->
          <tr>
            <td style="padding:30px 40px;">
              <p style="color:#9e998e; font-size:14px; line-height:1.8; margin:0;">
                Thank you for choosing The Prime Cut to make this moment unforgettable. Our team has carefully prepared each dish to ensure your celebration is nothing short of extraordinary. We wish you endless joy and cherished memories with your loved ones!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:rgba(8,8,7,0.6); padding:24px 40px; text-align:center; border-top:1px solid rgba(61,58,51,0.2);">
              <p style="color:rgba(185,139,139,0.7); font-size:11px; margin:0 0 4px; letter-spacing:1px;">The Prime Cut Steakhouse</p>
              <p style="color:rgba(158,153,142,0.4); font-size:10px; margin:0;">Kharar, Punjab · +91 98765 43210 · info@theprimecut.com</p>
              <p style="color:rgba(158,153,142,0.3); font-size:10px; margin:8px 0 0;">Celebrating life's finest moments, one meal at a time ${occasionEmoji}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: `"The Prime Cut" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `A Special Celebration with The Prime Cut ${occasionEmoji}`,
      html: htmlContent,
    });

    console.log(`📧 Special occasion email sent to ${email}`);
  } catch (error: any) {
    console.error('📧 Failed to send special occasion email:', error.message);
  }
};
