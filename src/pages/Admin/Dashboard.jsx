import React, { useState, useEffect } from "react";
import axios from "axios";
import {  Users, ShoppingCart, DollarSign, ArrowUp, ArrowDown, Import} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,Legend,} from "recharts";
import api from "../../utils/api";


//format date
const formatDateForInput = (date) => {
  if(!date) return "";
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
};

const STATUS_COLORS = {
  "In Progress": "#F59E0B", // Yellow/Orange
  "Pending":"#F59E0B",
  Shipped: "#3B82F6", // Blue
  Delivered: "#10B981", // Green
  Cancelled: "#EF4444", // Red
  Unknown: "#6B7280", // Gray
};

function Dashboard() {
  const [allTimeStats, setAllTimeStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [highlightStats, setHighlightStats] = useState({
    revenue: { value: 0, change: 0 },
    orders: { value: 0, change: 0 },
    avgOrderValue: { value: 0, change: 0 },
  });

  const [revenueByDay, setRevenueByDay] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // 1. Prepare Dates
        // Ensure End Date covers the FULL day (23:59:59)
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        // 2. Call the Dashboard Service Endpoint
        const response = await api.get(
          `${import.meta.env.VITE_API_URL}/Dashboard/Stats`,
          {
            params: {
              startDate: startDate.toISOString(),
              endDate: adjustedEndDate.toISOString(),
            },
          }
        );

        console.log(response.data);

        // Destructure Backend DTO
        const { totalUsers, totalOrders, totalRevenue, orders } = response.data;

        // Set All-Time Stats (From DB)
        setAllTimeStats({
          totalUsers,
          totalOrders,
          totalRevenue,
        });

        // Calculate "Highlights" for the selected period
        const currentRevenue = orders.reduce(
          (acc, o) => acc + o.totalAmount,
          0
        );
        const orderCount = orders.length;

        setHighlightStats({
          revenue: { value: currentRevenue, change: 0 }, // Implement compare logic if needed
          orders: { value: orderCount, change: 0 },
          avgOrderValue: {
            value: orderCount > 0 ? currentRevenue / orderCount : 0,
            change: 0,
          },
        });

        // Process Area Chart (Daily Revenue)
        const dailyRevenue = {};
        orders.forEach((order) => {
          // Extract YYYY-MM-DD part only
          const dateKey = new Date(order.orderDate).toISOString().split("T")[0];
          dailyRevenue[dateKey] =
            (dailyRevenue[dateKey] || 0) + order.totalAmount;
        });

        const revenueData = Object.keys(dailyRevenue)
          .map((date) => ({
            date,
            revenue: parseFloat(dailyRevenue[date].toFixed(2)),
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setRevenueByDay(revenueData);

        // Process Pie Chart (Status Distribution)
        const statusCount = {};
        orders.forEach((order) => {
          // Fallback to "Unknown" if status is null/empty
          const statusKey = order.status || "Unknown";
          statusCount[statusKey] = (statusCount[statusKey] || 0) + 1;
        });

        const pieData = Object.keys(statusCount).map((name) => ({
          name,
          value: statusCount[name],
        }));
        setOrdersByStatus(pieData);

        // Orders
        // The backend already sorts by date desc, so just slice
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (loading) {
    return (
      <div className="text-center p-10 text-white">Loading dashboard...</div>
    );
  }

  return (
    <div className="text-gray-200 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>

      {/* Top Cards (All Time) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Users"
          value={allTimeStats.totalUsers}
          icon={<Users className="w-8 h-8 text-blue-400" />}
        />
        <DashboardCard
          title="Total Orders (All Time)"
          value={allTimeStats.totalOrders}
          icon={<ShoppingCart className="w-8 h-8 text-green-400" />}
        />
        <DashboardCard
          title="Total Revenue (All Time)"
          value={`$${allTimeStats.totalRevenue.toFixed(2)}`}
          icon={<DollarSign className="w-8 h-8 text-yellow-400" />}
        />
      </div>

      {/* Date Picker & Charts Section */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold text-white">Sales Overview</h2>

          {/* Date Picker Controls */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={formatDateForInput(startDate)}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-gray-200 outline-none focus:border-blue-500"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              value={formatDateForInput(endDate)}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="p-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-gray-200 outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Highlight Stats for Selected Period */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <StatsHighlightCard
            title="Revenue (Selected Period)"
            value={`$${highlightStats.revenue.value.toFixed(2)}`}
            change={highlightStats.revenue.change}
          />
          <StatsHighlightCard
            title="Orders (Selected Period)"
            value={highlightStats.orders.value}
            change={highlightStats.orders.change}
          />
          <StatsHighlightCard
            title="Avg. Order Value"
            value={`$${highlightStats.avgOrderValue.value.toFixed(2)}`}
            change={highlightStats.avgOrderValue.change}
          />
        </div>

        {/* Revenue Area Chart */}
        <div className="w-full h-[450px] p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueByDay}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: "#9ca3af" }} />
              <YAxis tick={{ fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  color: "#fff",
                }}
                formatter={(value) => [`$${value}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#38bdf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section: Pie Chart & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="lg:col-span-1 bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Orders by Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {ordersByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || STATUS_COLORS.Unknown}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  borderColor: "#374151",
                }}
                // Add this line to make the text visible
                itemStyle={{ color: "#F3F4F6" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Recent Orders
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No orders found for this period.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr
                      key={order.id || order.orderReference}
                      className="border-b border-slate-700 hover:bg-slate-700/50"
                    >
                      <td className="p-3 font-medium text-sky-400">
                        {/* Handle ID display */}#
                        {order.orderReference.includes("-")
                          ? order.orderReference.split("-")[2]
                          : order.orderReference.substring(0, 8)}
                      </td>
                      <td className="p-3">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        {order.shippingAddress?.name || "N/A"}
                      </td>
                      <td className="p-3 font-semibold">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "In Progress" ||
                            order.status === "Pending"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : order.status === "Cancelled"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-green-500/10 text-green-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

//Cards Styling
const DashboardCard = ({ title, value, icon }) => (
  <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 flex items-center justify-between hover:bg-slate-700 transition-colors duration-300">
    <div>
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
    <div className="bg-slate-900 p-4 rounded-full">{icon}</div>
  </div>
);

const StatsHighlightCard = ({ title, value, change }) => {
  const isPositive = change >= 0;
  return (
    <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <div className="flex items-end justify-between mt-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        <div
          className={`flex items-center text-sm font-semibold px-2 py-1 rounded-md ${
            isPositive
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          <span className="ml-1">{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
