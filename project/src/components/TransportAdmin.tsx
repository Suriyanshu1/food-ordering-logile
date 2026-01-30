import { useState, useEffect } from 'react';
import { Calendar, Users, Car, Clock, Route, Download, ArrowLeft, MapPin, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TransportBooking } from '../types';

interface TransportAdminProps {
  onBack: () => void;
}

const ROUTES = [
  'Office-Patia-Cuttack',
  'Office - Jatani',
  'Office-Sahid nagar-Puri highway',
  'Office-Sundarpada',
  'Office-Silicon (For Interns only)',
  'Office-KIIT-Patia (For Interns only)'
];

const TIMINGS = [
  '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', 
  '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM'
];

function TransportAdmin({ onBack }: TransportAdminProps) {
  const [bookings, setBookings] = useState<TransportBooking[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transport_bookings')
        .select('*')
        .order('booking_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transport bookings:', error);
        setBookings([]);
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error fetching transport bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getDailyBookings = () => {
    return bookings.filter(b => b.booking_date === selectedDate);
  };

  const getBookingsByDateRange = () => {
    return bookings.filter(b => b.booking_date >= dateRange.startDate && b.booking_date <= dateRange.endDate);
  };

  // Get route statistics for selected date
  const getRouteStats = () => {
    const dailyBookings = getDailyBookings();
    const routeStats: Record<string, { total: number; byTiming: Record<string, number>; pickups: number; dropoffs: number }> = {};
    
    ROUTES.forEach(route => {
      routeStats[route] = { total: 0, byTiming: {}, pickups: 0, dropoffs: 0 };
      TIMINGS.forEach(timing => {
        routeStats[route].byTiming[timing] = 0;
      });
    });
    
    dailyBookings.forEach(booking => {
      if (booking.route && routeStats[booking.route]) {
        routeStats[booking.route].total++;
        if (booking.shift_end_time) {
          routeStats[booking.route].byTiming[booking.shift_end_time] = (routeStats[booking.route].byTiming[booking.shift_end_time] || 0) + 1;
        }
        if (booking.booking_type === 'pickup') {
          routeStats[booking.route].pickups++;
        } else {
          routeStats[booking.route].dropoffs++;
        }
      }
    });
    
    return routeStats;
  };

  // Get daily summary for date range
  const getDailySummary = () => {
    const rangeBookings = getBookingsByDateRange();
    const summary: Record<string, { total: number; pickups: number; dropoffs: number }> = {};
    
    rangeBookings.forEach(booking => {
      if (!summary[booking.booking_date]) {
        summary[booking.booking_date] = { total: 0, pickups: 0, dropoffs: 0 };
      }
      summary[booking.booking_date].total++;
      if (booking.booking_type === 'pickup') {
        summary[booking.booking_date].pickups++;
      } else {
        summary[booking.booking_date].dropoffs++;
      }
    });
    
    return Object.entries(summary)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => b.date.localeCompare(a.date));
  };

  const getTotalStats = () => {
    const rangeBookings = getBookingsByDateRange();
    return {
      total: rangeBookings.length,
      pickups: rangeBookings.filter(b => b.booking_type === 'pickup').length,
      dropoffs: rangeBookings.filter(b => b.booking_type === 'dropoff').length,
      uniqueUsers: new Set(rangeBookings.map(b => b.user_email)).size,
    };
  };

  const exportToCSV = () => {
    const rangeBookings = getBookingsByDateRange();
    const csvContent = [
      ['Date', 'Name', 'Email', 'Type', 'Route', 'Shift End Time', 'Pickup Time', 'Gender'].join(','),
      ...rangeBookings.map(b => [
        b.booking_date,
        b.user_name,
        b.user_email,
        b.booking_type,
        b.route || '-',
        b.shift_end_time || '-',
        b.pickup_time || '-',
        b.gender || '-',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transport-bookings-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    a.click();
  };

  const dailyBookings = getDailyBookings();
  const routeStats = getRouteStats();
  const dailySummary = getDailySummary();
  const totalStats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <button
            onClick={onBack}
            className="flex items-center text-blue-400 hover:text-blue-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Transport Booking
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <img
                src="https://images.prismic.io/logile/aLsMtmGNHVfTOttw_Logile-NoTagline-Dark--1-.png?auto=format%2Ccompress&fit=max&w=3840"
                alt="Logile"
                className="h-10 mb-4 animate-slide-down filter brightness-0 invert"
              />
              <h1 className="text-4xl font-bold text-white animate-slide-down">
                Transport Admin Dashboard
              </h1>
              <p className="text-lg text-gray-400 mt-2 animate-slide-up">
                Manage and view all transport bookings
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-scale-in transition-all hover:shadow-xl hover:-translate-y-1 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Bookings</p>
                <p className="text-3xl font-bold text-white mt-2">{totalStats.total}</p>
              </div>
              <div className="bg-blue-900/50 p-3 rounded-lg border border-blue-800/50">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-scale-in transition-all hover:shadow-xl hover:-translate-y-1 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Pickups</p>
                <p className="text-3xl font-bold text-white mt-2">{totalStats.pickups}</p>
              </div>
              <div className="bg-green-900/50 p-3 rounded-lg border border-green-800/50">
                <MapPin className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-scale-in transition-all hover:shadow-xl hover:-translate-y-1 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Drop-offs</p>
                <p className="text-3xl font-bold text-white mt-2">{totalStats.dropoffs}</p>
              </div>
              <div className="bg-amber-900/50 p-3 rounded-lg border border-amber-800/50">
                <Car className="w-8 h-8 text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-scale-in transition-all hover:shadow-xl hover:-translate-y-1 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Unique Users</p>
                <p className="text-3xl font-bold text-white mt-2">{totalStats.uniqueUsers}</p>
              </div>
              <div className="bg-purple-900/50 p-3 rounded-lg border border-purple-800/50">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Route Statistics by Date */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 animate-scale-in border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Route className="w-6 h-6 mr-3 text-blue-400" />
            Route Statistics by Date
          </h2>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 bg-slate-900 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          {loading ? (
            <p className="text-gray-400">Loading data...</p>
          ) : dailyBookings.length === 0 ? (
            <p className="text-gray-400">No bookings for this date.</p>
          ) : (
            <div className="space-y-6">
              {ROUTES.map(route => {
                const stats = routeStats[route];
                if (stats.total === 0) return null;
                
                return (
                  <div key={route} className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{route}</h3>
                      <div className="flex items-center space-x-4">
                        <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm border border-blue-800/50">
                          Total: {stats.total}
                        </span>
                        <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm border border-green-800/50">
                          Pickups: {stats.pickups}
                        </span>
                        <span className="px-3 py-1 bg-amber-900/50 text-amber-300 rounded-full text-sm border border-amber-800/50">
                          Drop-offs: {stats.dropoffs}
                        </span>
                      </div>
                    </div>
                    
                    {/* Timing breakdown */}
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                      {TIMINGS.map(timing => {
                        const count = stats.byTiming[timing] || 0;
                        return (
                          <div 
                            key={timing} 
                            className={`text-center p-2 rounded-lg ${
                              count > 0 
                                ? 'bg-blue-900/50 border border-blue-700/50' 
                                : 'bg-slate-800/50 border border-slate-700/50'
                            }`}
                          >
                            <p className="text-xs text-gray-400">{timing}</p>
                            <p className={`text-lg font-bold ${count > 0 ? 'text-blue-400' : 'text-gray-600'}`}>
                              {count}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Daily Summary */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 animate-scale-in border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-400" />
              Daily Pickups & Drop-offs
            </h2>
            <button
              onClick={exportToCSV}
              disabled={bookings.length === 0}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading data...</p>
          ) : dailySummary.length === 0 ? (
            <p className="text-gray-400">No bookings in the selected date range.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-600">
                    <th className="text-left py-3 px-4 font-semibold text-white">Date</th>
                    <th className="text-center py-3 px-4 font-semibold text-white">Total Bookings</th>
                    <th className="text-center py-3 px-4 font-semibold text-white">
                      <span className="flex items-center justify-center">
                        <MapPin className="w-4 h-4 mr-2 text-green-400" />
                        Pickups
                      </span>
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-white">
                      <span className="flex items-center justify-center">
                        <Car className="w-4 h-4 mr-2 text-amber-400" />
                        Drop-offs
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dailySummary.map((day) => (
                    <tr key={day.date} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-white font-medium">{day.date}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm border border-blue-800/50">
                          {day.total}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm border border-green-800/50">
                          {day.pickups}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-3 py-1 bg-amber-900/50 text-amber-300 rounded-full text-sm border border-amber-800/50">
                          {day.dropoffs}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {dailySummary.length > 0 && (
                    <tr className="bg-blue-900/30 font-semibold">
                      <td className="py-3 px-4 text-white">Total</td>
                      <td className="py-3 px-4 text-center text-blue-400 text-lg">{totalStats.total}</td>
                      <td className="py-3 px-4 text-center text-green-400 text-lg">{totalStats.pickups}</td>
                      <td className="py-3 px-4 text-center text-amber-400 text-lg">{totalStats.dropoffs}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Today's Detailed Bookings */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 animate-scale-in border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-blue-400" />
            Detailed Bookings for {selectedDate}
          </h2>

          {loading ? (
            <p className="text-gray-400">Loading data...</p>
          ) : dailyBookings.length === 0 ? (
            <p className="text-gray-400">No bookings for this date.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-600">
                    <th className="text-left py-3 px-4 font-semibold text-white">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Route</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Timing</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-white">{booking.user_name || '-'}</td>
                      <td className="py-3 px-4 text-gray-400">{booking.user_email || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          booking.booking_type === 'pickup' 
                            ? 'bg-green-900/50 text-green-300 border border-green-800/50' 
                            : 'bg-amber-900/50 text-amber-300 border border-amber-800/50'
                        }`}>
                          {booking.booking_type === 'pickup' ? 'Pickup' : 'Drop-off'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-300 text-sm">{booking.route || '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{booking.shift_end_time || booking.pickup_time || '-'}</td>
                      <td className="py-3 px-4 text-gray-300">{booking.gender || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransportAdmin;
