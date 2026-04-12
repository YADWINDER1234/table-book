import QRCode from 'qrcode';

export const generateQRCode = async (data: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    throw error;
  }
};

export const generateQRCodeForBooking = async (bookingId: string): Promise<string> => {
  const bookingUrl = `${window.location.origin}/booking/${bookingId}`;
  return generateQRCode(bookingUrl);
};

export const generateQRCodeForMenu = async (): Promise<string> => {
  const menuUrl = `${window.location.origin}/menu`;
  return generateQRCode(menuUrl);
};

export const generateQRCodeForPayment = async (orderId: string): Promise<string> => {
  const paymentUrl = `${window.location.origin}/order/${orderId}/pay`;
  return generateQRCode(paymentUrl);
};

export const downloadQRCode = (dataUrl: string, filename: string = 'qrcode.png') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
