import React, { useState, useEffect } from "react";
import {
  Plane,
  Users,
  Calendar,
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data
const generateFlightData = () => {
  const routes = [
    "NYC → LAX",
    "SFO → MIA",
    "ORD → SEA",
    "DEN → PHX",
    "BOS → LAX",
    "ATL → JFK",
    "LAX → MIA",
    "SEA → ORD",
    "PHX → BOS",
    "MIA → SFO",
    "JFK → DEN",
    "LAX → ATL",
    "ORD → PHX",
    "SEA → NYC",
    "MIA → LAX",
  ];

  const airlines = ["AA", "DL", "UA", "SW", "B6"];
  const statuses = ["normal", "overbooked", "critical"];

  return Array.from({ length: 15 }, (_, i) => ({
    id: `${airlines[i % airlines.length]}${100 + i}`,
    route: routes[i],
    departure: `${String(Math.floor(Math.random() * 12) + 8).padStart(
      2,
      "0"
    )}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
    capacity: 140 + Math.floor(Math.random() * 80),
    booked: 160 + Math.floor(Math.random() * 60),
    checkedIn: 130 + Math.floor(Math.random() * 50),
    noShows: Math.floor(Math.random() * 20) + 5,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    gate: `${String.fromCharCode(65 + Math.floor(Math.random() * 4))}${
      Math.floor(Math.random() * 20) + 1
    }`,
    aircraft: Math.random() > 0.5 ? "Boeing 737" : "Airbus A321",
    date: new Date().toISOString().split("T")[0],
  }));
};

const salesData = {
  // week: [
  //   { period: "Mon", tickets: 1200, revenue: 120000 },
  //   { period: "Tue", tickets: 1800, revenue: 180000 },
  //   { period: "Wed", tickets: 900, revenue: 90000 },
  //   { period: "Thu", tickets: 2200, revenue: 220000 },
  //   { period: "Fri", tickets: 2800, revenue: 280000 },
  //   { period: "Sat", tickets: 3200, revenue: 320000 },
  //   { period: "Sun", tickets: 2900, revenue: 290000 },
  // ],
  month: [
    { period: "Jan", tickets: 12000, revenue: 1200000 },
    { period: "Feb", tickets: 18000, revenue: 1800000 },
    { period: "Mar", tickets: 15000, revenue: 1500000 },
    { period: "Apr", tickets: 22000, revenue: 2200000 },
    { period: "May", tickets: 25000, revenue: 2500000 },
    { period: "Jun", tickets: 28000, revenue: 2800000 },
  ],
  year: [
    { period: "2020", tickets: 180000, revenue: 18000000 },
    { period: "2021", tickets: 220000, revenue: 22000000 },
    { period: "2022", tickets: 280000, revenue: 28000000 },
    { period: "2023", tickets: 320000, revenue: 32000000 },
    { period: "2024", tickets: 350000, revenue: 35000000 },
  ],
};

const noShowData = {
  // week: { boarded: 85, noShow: 15 },
  month: { boarded: 78, noShow: 22 },
  year: { boarded: 82, noShow: 18 },
};

// Components
const StatCard = ({ icon, title, value, trend, color }) => (
  <div
    className={`p-6 rounded-2xl ${color} backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-white/20 rounded-xl">{icon}</div>
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="flex items-center text-white/90 text-sm">
          <TrendingUp size={16} className="mr-1" />
          {trend}
        </div>
      )}
    </div>
  </div>
);

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-blue-500 text-white shadow-md"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

const TicketSalesChart = () => {
  const [filter, setFilter] = useState("month");
  const data = salesData[filter];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Ticket Sales</h3>
        <div className="flex space-x-2">
          {["week", "month", "year"].map((period) => (
            <FilterButton
              key={period}
              active={filter === period}
              onClick={() => setFilter(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </FilterButton>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">
          {data.reduce((sum, item) => sum + item.tickets, 0).toLocaleString()}
        </span>
        <span className="text-gray-500 ml-2">Total Tickets</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="tickets"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const RevenueChart = () => {
  const [filter, setFilter] = useState("month");
  const data = salesData[filter];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Revenue Growth</h3>
        <div className="flex space-x-2">
          {["month", "year"].map((period) => (
            <FilterButton
              key={period}
              active={filter === period}
              onClick={() => setFilter(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </FilterButton>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">
          $
          {(
            data.reduce((sum, item) => sum + item.revenue, 0) / 1000000
          ).toFixed(1)}
          M
        </span>
        <span className="text-gray-500 ml-2">Total Revenue</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [
                `$${(value / 1000).toFixed(0)}K`,
                "Revenue",
              ]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: "#10b981", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const NoShowChart = () => {
  const [filter, setFilter] = useState("month");
  const data = noShowData[filter];
  const chartData = [
    { name: "Show", value: data.boarded },
    { name: "No Show", value: data.noShow },
  ];
  const COLORS = ["#3b82f6", "#ef4444"];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Passenger Show</h3>
        <div className="flex space-x-2">
          {["month", "year"].map((period) => (
            <FilterButton
              key={period}
              active={filter === period}
              onClick={() => setFilter(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </FilterButton>
          ))}
        </div>
      </div>

      <div className="relative h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {data.boarded}%
            </div>
            <div className="text-sm text-gray-500">Show</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-6">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FlightSummary = ({ onFlightSelect, selectedFlight }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [flights] = useState(generateFlightData());
  const flightsPerPage = 2;

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(flights.length / flightsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "overbooked":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Flights Open for Check-In
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Daily flights for{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>Today's Schedule</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {currentFlights.map((flight) => {
          const overbookingRate =
            ((flight.booked - flight.capacity) / flight.capacity) * 100;
          const showRate = (flight.checkedIn / flight.booked) * 100;

          return (
            <div
              key={flight.id}
              className={`p-6 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                selectedFlight?.id === flight.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : ""
              }`}
              onClick={() => onFlightSelect(flight)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {flight.id}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      flight.status
                    )}`}
                  >
                    {flight.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Gate {flight.gate}</p>
                  <p className="text-sm font-medium text-gray-900">
                    {flight.departure}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 font-medium">{flight.route}</p>
                <p className="text-sm text-gray-500">{flight.aircraft}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Capacity</p>
                  <p className="font-semibold text-gray-900">
                    {flight.capacity}
                  </p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-gray-500">Booked</p>
                  <p className="font-semibold text-blue-600">{flight.booked}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-gray-500">Checked In</p>
                  <p className="font-semibold text-green-600">
                    {flight.checkedIn}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-2 bg-amber-50 rounded-lg">
                  <p className="text-gray-500">Overbooking</p>
                  <p
                    className={`font-semibold ${
                      overbookingRate > 15
                        ? "text-red-600"
                        : overbookingRate > 5
                        ? "text-amber-600"
                        : "text-green-600"
                    }`}
                  >
                    {overbookingRate > 0 ? "+" : ""}
                    {overbookingRate.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <p className="text-gray-500">Show Rate</p>
                  <p className="font-semibold text-purple-600">
                    {showRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstFlight + 1} to{" "}
            {Math.min(indexOfLastFlight, flights.length)} of {flights.length}{" "}
            flights
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PassengerDetails = ({ selectedFlight }) => {
  const [filterStatus, setFilterStatus] = useState("all");

  const getPassengerData = (flightId) => {
    return [
      {
        id: 1,
        name: "John Smith",
        seat: "12A",
        status: "checked-in",
        priority: "Gold",
        bookingTime: "2024-01-15",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        seat: "15C",
        status: "no-show",
        priority: "Silver",
        bookingTime: "2024-01-10",
      },
      {
        id: 3,
        name: "Mike Wilson",
        seat: "8B",
        status: "checked-in",
        priority: "Platinum",
        bookingTime: "2024-01-08",
      },
      {
        id: 4,
        name: "Emily Davis",
        seat: "22F",
        status: "standby",
        priority: "Basic",
        bookingTime: "2024-01-20",
      },
      {
        id: 5,
        name: "Robert Brown",
        seat: "5A",
        status: "checked-in",
        priority: "Gold",
        bookingTime: "2024-01-12",
      },
      {
        id: 6,
        name: "Lisa Garcia",
        seat: "18D",
        status: "no-show",
        priority: "Basic",
        bookingTime: "2024-01-18",
      },
      {
        id: 7,
        name: "David Martinez",
        seat: "11E",
        status: "standby",
        priority: "Silver",
        bookingTime: "2024-01-22",
      },
      {
        id: 8,
        name: "Jennifer Lee",
        seat: "7C",
        status: "checked-in",
        priority: "Platinum",
        bookingTime: "2024-01-05",
      },
    ];
  };

  const getPassengerStatusIcon = (status) => {
    switch (status) {
      case "checked-in":
        return <CheckCircle className="text-green-600" size={16} />;
      case "no-show":
        return <XCircle className="text-red-600" size={16} />;
      case "standby":
        return <Clock className="text-amber-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Platinum":
        return "bg-purple-100 text-purple-800";
      case "Gold":
        return "bg-amber-100 text-amber-800";
      case "Silver":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const filteredPassengers = selectedFlight
    ? getPassengerData(selectedFlight.id).filter(
        (p) => filterStatus === "all" || p.status === filterStatus
      )
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedFlight
              ? `${selectedFlight.id} Passengers`
              : "Select a Flight"}
          </h2>
          {selectedFlight && (
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="checked-in">Checked In</option>
                <option value="no-show">No Show</option>
                <option value="standby">Standby</option>
              </select>
            </div>
          )}
        </div>

        {selectedFlight && (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">
                {selectedFlight.checkedIn}
              </p>
              <p className="text-sm text-gray-600">Checked In</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <p className="text-2xl font-bold text-red-600">
                {selectedFlight.noShows}
              </p>
              <p className="text-sm text-gray-600">No Shows</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <p className="text-2xl font-bold text-amber-600">
                {selectedFlight.booked -
                  selectedFlight.checkedIn -
                  selectedFlight.noShows}
              </p>
              <p className="text-sm text-gray-600">Standby</p>
            </div>
          </div>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto">
        {selectedFlight ? (
          <div className="divide-y divide-gray-100">
            {filteredPassengers.map((passenger) => (
              <div key={passenger.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {passenger.name}
                  </h4>
                  {getPassengerStatusIcon(passenger.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Seat {passenger.seat}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      passenger.priority
                    )}`}
                  >
                    {passenger.priority}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Booked: {passenger.bookingTime}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Plane className="mx-auto mb-4 text-gray-300" size={48} />
            <p>Select a flight to view passenger details</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Airline Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time flight management and passenger insights
          </p>
        </div> */}

        {/* Overview Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Plane className="text-white" size={24} />}
            title="Active Flights"
            value="15"
            trend="+12%"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={<AlertTriangle className="text-white" size={24} />}
            title="Overbooked Flights"
            value="8"
            trend="+5%"
            color="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <StatCard
            icon={<Users className="text-white" size={24} />}
            title="Total Passengers"
            value="2,847"
            trend="+18%"
            color="bg-gradient-to-br from-green-500 to-emerald-500"
          />
          <StatCard
            icon={<TrendingUp className="text-white" size={24} />}
            title="Revenue Today"
            value="$428K"
            trend="+22%"
            color="bg-gradient-to-br from-purple-500 to-pink-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TicketSalesChart />
          <RevenueChart />
          <NoShowChart />
        </div>

        {/* Flight Summary and Passenger Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FlightSummary
              onFlightSelect={setSelectedFlight}
              selectedFlight={selectedFlight}
            />
          </div>
          <div className="lg:col-span-1">
            <PassengerDetails selectedFlight={selectedFlight} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
