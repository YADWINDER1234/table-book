import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Booking } from '../../types';
import { Card, LoadingSpinner, Alert, Button } from '../common';
import { formatDate, formatTime, getStatusColor } from '../../utils/formatters';

export const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getAllBookings({ page, limit: 10 });
      setBookings(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await adminService.updateBookingStatus(id, status);
      fetchBookings();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><LoadingSpinner /></div>;
  if (error) return <Alert type="error" message={error} />;
  if (!bookings) return null;

  return (
    <div>
      <h2 className="text-2xl font-serif mb-6 text-on-surface">Booking Management</h2>
      
      <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-container-high border-b border-outline-variant/20">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-variant">Booking ID</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-variant">Guest</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-variant">Table</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-variant">Date & Time</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-variant">Status</th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-on-surface-variant">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {bookings.bookings.map((booking: Booking) => (
              <tr key={booking._id} className="bg-surface-container hover:bg-surface-container-high transition-colors duration-200">
                <td className="px-5 py-4 font-mono text-sm text-primary">{booking.bookingId}</td>
                <td className="px-5 py-4">
                  <div className="text-on-surface text-sm font-medium">{booking.guestName}</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">{booking.guestEmail}</div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                    {booking.tableId.tableNumber}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="text-on-surface text-sm">{formatDate(booking.bookingDate)}</div>
                  <div className="text-xs text-on-surface-variant mt-0.5">{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface border border-outline-variant/30 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirm</option>
                    <option value="completed">Complete</option>
                    <option value="cancelled">Cancel</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button
          variant="ghost"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ← Previous
        </Button>
        <span className="text-sm text-on-surface-variant">Page {page} of {bookings.pagination.pages}</span>
        <Button
          variant="ghost"
          disabled={page === bookings.pagination.pages}
          onClick={() => setPage(page + 1)}
        >
          Next →
        </Button>
      </div>
    </div>
  );
};
