import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { AnalyticsData } from '../../types';
import { Card, LoadingSpinner, Alert } from '../common';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getDashboardAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error} />;
  if (!analytics) return null;

  const { summary, todayBookings, trend } = analytics;
  // Let's assume an average plate cost of $150 minimum per guest for The Prime Cut
  const projectedRevenue = Math.round((analytics as any).totalGuestsCurrentMonth || summary.confirmedBookings * 2) * 150;

  return (
    <div className="space-y-8 pb-16">
      <div className="mb-10 text-center md:text-left border-b border-outline-variant/30 pb-6">
        <h1 className="headline text-4xl mb-2 text-primary">Executive Dashboard</h1>
        <p className="text-on-surface-variant uppercase tracking-widest text-sm">The Prime Cut Operations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-low p-6 border-l-4 border-l-primary rounded-r-lg shadow-luxury-ambient hover:scale-105 transition-transform duration-300">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-2 font-bold">Total Reservations</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-on-surface">{summary.totalBookings}</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 border-l-4 border-l-secondary rounded-r-lg shadow-luxury-ambient hover:scale-105 transition-transform duration-300">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-2 font-bold">Confirmed Service</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-on-surface">{summary.confirmedBookings}</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 border-l-4 border-l-tertiary rounded-r-lg shadow-luxury-ambient hover:scale-105 transition-transform duration-300">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-2 font-bold">Occupancy Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-on-surface">{summary.occupancyRate}%</span>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 border-l-4 border-l-green-600 rounded-r-lg shadow-luxury-ambient hover:scale-105 transition-transform duration-300">
          <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-2 font-bold">Proj. Revenue</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-on-surface">${projectedRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {/* Trend Visualization */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-luxury-ambient border border-outline-variant/20">
          <h2 className="headline text-2xl mb-8 flex items-center justify-between">
            <span>7-Day Trajectory</span>
            <span className="text-xs font-sans text-on-surface-variant uppercase tracking-widest">Bookings</span>
          </h2>
          <div className="flex items-end gap-3 h-48 border-b border-l border-outline-variant/30 pl-4 pb-2">
            {trend.map((day) => {
              const heightPct = Math.max(10, (day.count / Math.max(...trend.map(d => d.count), 1)) * 100);
              return (
                <div key={day._id} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-container-highest px-3 py-1 rounded text-xs">
                    {day.count}
                  </div>
                  <div
                    className="w-full bg-primary/80 group-hover:bg-primary rounded-t-sm transition-all duration-500 shadow-[0_0_10px_rgba(255,77,0,0.2)]"
                    style={{ height: `${heightPct}%` }}
                  />
                  <p className="text-[10px] mt-3 text-on-surface-variant uppercase tracking-wider -rotate-45 origin-top-left absolute -bottom-10 left-1/2">
                    {day._id.substring(5)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Service */}
        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-luxury-ambient border border-outline-variant/20">
          <h2 className="headline text-2xl mb-8 flex items-center justify-between">
            <span>Evening Service</span>
            <span className="text-xs font-sans bg-primary px-3 py-1 rounded-full text-on-primary font-bold">
              {todayBookings.count} Active
            </span>
          </h2>
          {todayBookings.bookings.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-on-surface-variant border-2 border-dashed border-outline-variant/20 rounded-lg">
              <span className="text-3xl mb-2 opacity-50">🍽️</span>
              <p>No bookings active for tonight</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {todayBookings.bookings.map((booking) => (
                <div key={booking._id} className="flex justify-between items-center p-4 bg-surface-container-low rounded-lg border border-outline-variant/10 hover:border-primary/50 transition-colors">
                  <div>
                    <p className="font-semibold text-lg text-secondary mb-1">{booking.guestName}</p>
                    <p className="text-xs uppercase tracking-widest text-on-surface-variant flex gap-3">
                      <span>Table {booking.tableId.tableNumber}</span>
                      <span>•</span>
                      <span className="text-primary">{booking.startTime}</span>
                    </p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold ${
                    booking.status === 'confirmed' ? 'bg-secondary/20 text-secondary' : 'bg-tertiary/20 text-tertiary'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
