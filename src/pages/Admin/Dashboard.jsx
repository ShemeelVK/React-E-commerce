import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, ShoppingCart, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Helper function to format date to YYYY-MM-DD for input fields
const formatDateForInput = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [revenueByDay, setRevenueByDay] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the date range filter
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const usersResponse = await axios.get('http://localhost:3000/users');
        const allUsers = usersResponse.data;

        let allOrders = [];
        allUsers.forEach(user => {
          if (user.orders && user.orders.length > 0) {
            allOrders = [...allOrders, ...user.orders];
          }
        });

        // Filter orders based on the selected date range
        const filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.orderDate);
            const adjustedEndDate = new Date(endDate);
            adjustedEndDate.setHours(23, 59, 59, 999); // Include the entire end day
            return orderDate >= startDate && orderDate <= adjustedEndDate;
        });

        // All calculations for stats and charts now use 'filteredOrders'
        const totalUsers = allUsers.filter(u => u.role === 'user').length;
        const totalOrders = filteredOrders.length;
        const totalRevenue = filteredOrders.reduce((acc, order) => acc + order.totalAmount, 0);
        setStats({ totalUsers, totalOrders, totalRevenue });

        // Process data for Revenue Per Day (Area Chart)
        const dailyRevenue = {};
        filteredOrders.forEach(order => {
          const date = new Date(order.orderDate).toLocaleDateString('en-CA');
          dailyRevenue[date] = (dailyRevenue[date] || 0) + order.totalAmount;
        });
        const revenueData = Object.keys(dailyRevenue).map(date => ({
          date,
          revenue: parseFloat(dailyRevenue[date].toFixed(2)),
        })).sort((a, b) => new Date(a.date) - new Date(b.date));
        setRevenueByDay(revenueData);
        
        // Process data for Orders by Status (Pie Chart)
        const statusCount = {};
        filteredOrders.forEach(order => {
          const status = order.status || 'Unknown';
          statusCount[status] = (statusCount[status] || 0) + 1;
        });
        const pieData = Object.keys(statusCount).map(status => ({
            name: status,
            value: statusCount[status]
        }));
        setOrdersByStatus(pieData);

        // Get recent orders (from all orders, not filtered by date)
        const sortedOrders = allOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setRecentOrders(sortedOrders.slice(0, 5));

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (loading) {
    return <div className="text-center p-10">Loading dashboard...</div>;
  }

  const PIE_COLORS = ['#F59E0B', '#10B981', '#EF4444', '#3B82F6'];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={<Users className="w-8 h-8 text-blue-500" />}
        />
        <DashboardCard 
          title="Total Orders (in range)" 
          value={stats.totalOrders} 
          icon={<ShoppingCart className="w-8 h-8 text-green-500" />}
        />
        <DashboardCard 
          title="Total Revenue (in range)" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          icon={<DollarSign className="w-8 h-8 text-yellow-500" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
             <h2 className="text-lg font-semibold">Revenue per Day</h2>
             <div className="flex items-center gap-2">
                <input
                    type="date"
                    value={formatDateForInput(startDate)}
                    onChange={(e) => setStartDate(new Date(e.target.value))}
                    className="p-2 border rounded-md text-sm"
                />
                <span className="text-gray-500">to</span>
                <input
                    type="date"
                    value={formatDateForInput(endDate)}
                    onChange={(e) => setEndDate(new Date(e.target.value))}
                    className="p-2 border rounded-md text-sm"
                />
             </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueByDay}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Orders by Status (in range)</h2>
           <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={ordersByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {ordersByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
       <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Recent Orders (All Time)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.orderId} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-indigo-600">
                    #{order.orderId.split("-")[1]}
                  </td>
                  <td className="p-3">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">{order.shippingAddress.name}</td>
                  <td className="p-3 font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "Cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className="bg-gray-100 p-3 rounded-full">
      {icon}
    </div>
  </div>
);

export default Dashboard;

