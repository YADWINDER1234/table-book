import React from 'react';
import { Booking } from '../../types';
import { formatDate, formatTime, getStatusColor, getLocationIcon } from '../../utils/formatters';
import { Button, Card } from '../common';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  onView?: (id: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel, onView }) => {
  const statusColor = getStatusColor(booking.status);
  const locationIcon = getLocationIcon(booking.tableId.location);

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg">{booking.tableId.tableNumber} - {booking.guestName}</h3>
          <p className="text-sm text-gray-600">ID: {booking.bookingId}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
        <div>
          <p className="text-xs text-gray-500">Date & Time</p>
          <p className="font-medium">{formatDate(booking.bookingDate)}</p>
          <p className="text-sm">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Guests & Location</p>
          <p className="font-medium">{booking.numberOfGuests} guests</p>
          <p className="text-sm">{locationIcon} {booking.tableId.location.charAt(0).toUpperCase() + booking.tableId.location.slice(1)}</p>
        </div>
      </div>

      {booking.specialRequests && (
        <p className="text-sm text-gray-700 mb-4"><strong>Requests:</strong> {booking.specialRequests}</p>
      )}

      <div className="flex gap-2">
        {onView && (
          <Button variant="ghost" size="sm" onClick={() => onView(booking._id)}>
            View Details
          </Button>
        )}
        {onCancel && booking.status === 'pending' && (
          <Button variant="danger" size="sm" onClick={() => onCancel(booking._id)}>
            Cancel
          </Button>
        )}
      </div>
    </Card>
  );
};
