import React, { useState, useEffect } from 'react';
import { generateQRCodeForBooking, downloadQRCode } from '../../utils/qrCode';

interface BookingQRProps {
  bookingId: string;
}

const BookingQRCode: React.FC<BookingQRProps> = ({ bookingId }) => {
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateBookingQR();
  }, [bookingId]);

  const generateBookingQR = async () => {
    try {
      setLoading(true);
      const qrData = await generateQRCodeForBooking(bookingId);
      setQrCode(qrData);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Generating QR Code...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md">
      <h3 className="font-bold text-lg">Booking QR Code</h3>
      {qrCode && <img src={qrCode} alt="Booking QR Code" className="w-48 h-48" />}
      <button
        onClick={() => downloadQRCode(qrCode, `booking-${bookingId}.png`)}
        className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 font-medium"
      >
        Download QR Code
      </button>
      <p className="text-xs text-gray-600 text-center">
        Scan this code to view booking details
      </p>
    </div>
  );
};

export default BookingQRCode;
