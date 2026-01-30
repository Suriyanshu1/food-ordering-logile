import { useState, useEffect } from 'react';
import { Calendar, Users, IndianRupee, TrendingUp, Download, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FoodOrder } from '../types';

interface AdminProps {
  onBack: () => void;
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  lunchOrders: number;
  dinnerOrders: number;
}

interface DailySummary {
  date: string;
  orders: FoodOrder[];
  totalAmount: number;
  totalOrders: number;
}

function Admin({ onBack }: AdminProps) {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    lunchOrders: 0,
    dinnerOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_orders')
        .select('*')
        .order('order_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOrders(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData: FoodOrder[]) => {
    const totalOrders = ordersData.length;
    const totalRevenue = ordersData.reduce((sum, order) => sum + order.total_price, 0);
    const lunchOrders = ordersData.filter(order => order.meal_type.includes('lunch')).length;
    const dinnerOrders = ordersData.filter(order => order.meal_type.includes('dinner')).length;

    setStats({ totalOrders, totalRevenue, lunchOrders, dinnerOrders });
  };

  const getDailyOrders = () => {
    return orders.filter(order => order.order_date === selectedDate);
  };

  const getOrdersByDateRange = () => {
    return orders.filter(order => {
      return order.order_date >= dateRange.startDate && order.order_date <= dateRange.endDate;
    });
  };

  const getDailySummary = (): DailySummary[] => {
    const ordersInRange = getOrdersByDateRange();
    const groupedByDate = ordersInRange.reduce((acc, order) => {
      const date = order.order_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(order);
      return acc;
    }, {} as Record<string, FoodOrder[]>);

    return Object.entries(groupedByDate).map(([date, orders]) => ({
      date,
      orders,
      totalAmount: orders.reduce((sum, order) => sum + order.total_price, 0),
      totalOrders: orders.length,
    })).sort((a, b) => b.date.localeCompare(a.date));
  };

  const getUserSummary = () => {
    const ordersInRange = getOrdersByDateRange();
    const groupedByUser = ordersInRange.reduce((acc, order) => {
      const email = order.user_email;
      if (!acc[email]) {
        acc[email] = {
          name: order.user_name,
          email: order.user_email,
          orders: [],
          totalAmount: 0,
          totalOrders: 0,
        };
      }
      acc[email].orders.push(order);
      acc[email].totalAmount += order.total_price;
      acc[email].totalOrders += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedByUser).sort((a: any, b: any) => b.totalAmount - a.totalAmount);
  };

  const exportToCSV = () => {
    const ordersInRange = getOrdersByDateRange();
    const csvContent = [
      ['Date', 'Name', 'Email', 'Meal Type', 'Lunch Preference', 'Lunch Type', 'Dinner Preference', 'Dinner Type', 'Total Amount'].join(','),
      ...ordersInRange.map(order => [
        order.order_date,
        order.user_name,
        order.user_email,
        order.meal_type,
        order.lunch_preference,
        order.lunch_type,
        order.dinner_preference,
        order.dinner_type,
        order.total_price,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-orders-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    a.click();
  };

  const dailyOrders = getDailyOrders();
  const dailySummary = getDailySummary();
  const userSummary = getUserSummary();
  const rangeTotal = getOrdersByDateRange().reduce((sum, order) => sum + order.total_price, 0);

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
            Back to Order Form
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <img
                src="https://images.prismic.io/logile/aLsMtmGNHVfTOttw_Logile-NoTagline-Dark--1-.png?auto=format%2Ccompress&fit=max&w=3840"
                alt="Logile"
                className="h-10 mb-4 animate-slide-down filter brightness-0 invert"
              />
              <h1 className="text-4xl font-bold text-white animate-slide-down">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-400 mt-2 animate-slide-up">
                Manage and view all food orders
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-scale-in transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalOrders}</p>
              </div>
              <div className="bg-blue-900/50 p-3 rounded-lg border border-blue-800/50">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-scale-in transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white mt-2">₹{stats.totalRevenue}</p>
              </div>
              <div className="bg-green-900/50 p-3 rounded-lg border border-green-800/50">
                <IndianRupee className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-scale-in transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Lunch Orders</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.lunchOrders}</p>
              </div>
              <div className="bg-amber-900/50 p-3 rounded-lg border border-amber-800/50">
                <Calendar className="w-8 h-8 text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 animate-scale-in transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Dinner Orders</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.dinnerOrders}</p>
              </div>
              <div className="bg-purple-900/50 p-3 rounded-lg border border-purple-800/50">
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 animate-scale-in border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Today's Orders</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
            />
          </div>

          {loading ? (
            <p className="text-gray-400">Loading orders...</p>
          ) : dailyOrders.length === 0 ? (
            <p className="text-gray-400">No orders for this date.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-600">
                    <th className="text-left py-3 px-4 font-semibold text-white">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Meal Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Lunch</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Dinner</th>
                    <th className="text-right py-3 px-4 font-semibold text-white">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-white">{order.user_name}</td>
                      <td className="py-3 px-4 text-gray-400">{order.user_email}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-800/50">
                          {order.meal_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {order.lunch_preference !== 'none' 
                          ? `${order.lunch_preference} (${order.lunch_type.replace('_', ' ')})` 
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {order.dinner_preference !== 'none' 
                          ? `${order.dinner_preference} (${order.dinner_type.replace('_', ' ')})` 
                          : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-white">₹{order.total_price}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-900/30 font-semibold">
                    <td colSpan={5} className="py-3 px-4 text-white">Total for {selectedDate}</td>
                    <td className="py-3 px-4 text-right text-blue-400 text-lg">
                      ₹{dailyOrders.reduce((sum, order) => sum + order.total_price, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Date Range Analysis */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 animate-scale-in border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Date Range Analysis</h2>
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
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
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
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
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>
          </div>

          {/* Daily Summary */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Daily Summary</h3>
            <div className="space-y-4">
              {dailySummary.map((day) => (
                <div key={day.date} className="border border-slate-600 rounded-lg p-4 hover:border-blue-500 transition-colors bg-slate-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{day.date}</h4>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{day.totalOrders} orders</p>
                      <p className="font-semibold text-blue-400">₹{day.totalAmount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-lg border border-blue-700/50">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-white">Total for Selected Range</span>
                <span className="text-2xl font-bold text-blue-400">₹{rangeTotal}</span>
              </div>
            </div>
          </div>

          {/* User Summary */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">User Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-600">
                    <th className="text-left py-3 px-4 font-semibold text-white">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-white">Email</th>
                    <th className="text-center py-3 px-4 font-semibold text-white">Total Orders</th>
                    <th className="text-right py-3 px-4 font-semibold text-white">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {userSummary.map((user: any) => (
                    <tr key={user.email} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="py-3 px-4 text-white">{user.name}</td>
                      <td className="py-3 px-4 text-gray-400">{user.email}</td>
                      <td className="py-3 px-4 text-center text-white">{user.totalOrders}</td>
                      <td className="py-3 px-4 text-right font-semibold text-white">₹{user.totalAmount}</td>
                    </tr>
                  ))}
                  <tr className="bg-blue-900/30 font-semibold">
                    <td colSpan={3} className="py-3 px-4 text-white">Grand Total</td>
                    <td className="py-3 px-4 text-right text-blue-400 text-lg">₹{rangeTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
