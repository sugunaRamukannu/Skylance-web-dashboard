import React, { useState, useEffect } from "react";
import {
  Plane,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Filter,
} from "lucide-react";

const FlightOverbookingDashboard = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Sample flight data
  const flights = [
    {
      id: "AA101",
      route: "NYC → LAX",
      departure: "08:30",
      capacity: 180,
      booked: 195,
      checkedIn: 165,
      noShows: 15,
      status: "overbooked",
      gate: "A12",
      aircraft: "Boeing 737",
    },
    {
      id: "DL205",
      route: "SFO → MIA",
      departure: "14:15",
      capacity: 220,
      booked: 235,
      checkedIn: 210,
      noShows: 8,
      status: "critical",
      gate: "B7",
      aircraft: "Airbus A321",
    },
    {
      id: "UA330",
      route: "ORD → SEA",
      departure: "18:45",
      capacity: 160,
      booked: 172,
      checkedIn: 145,
      noShows: 12,
      status: "overbooked",
      gate: "C15",
      aircraft: "Boeing 737",
    },
    {
      id: "SW892",
      route: "DEN → PHX",
      departure: "11:20",
      capacity: 140,
      booked: 138,
      checkedIn: 128,
      noShows: 3,
      status: "normal",
      gate: "D9",
      aircraft: "Boeing 737",
    },
  ];

  // Sample passenger data for selected flight
  const getPassengerData = (flightId) => {
    const passengers = [
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
    return passengers;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "overbooked":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPassengerStatusIcon = (status) => {
    switch (status) {
      case "checked-in":
        return <CheckCircle className="text-green-600" size={16} />;
      case "no-show":
        return <XCircle className="text-red-600" size={16} />;
      case "standby":
        return <Clock className="text-yellow-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Platinum":
        return "bg-purple-100 text-purple-800";
      case "Gold":
        return "bg-yellow-100 text-yellow-800";
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Plane className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">
              Flight Overbooking Dashboard
            </h1>
          </div>
          <p className="text-gray-600">
            Monitor flight capacity, overbooking status, and passenger check-ins
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Flights</p>
                <p className="text-2xl font-bold text-gray-900">
                  {flights.length}
                </p>
              </div>
              <Plane className="text-blue-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overbooked Flights</p>
                <p className="text-2xl font-bold text-red-600">
                  {
                    flights.filter(
                      (f) =>
                        f.status === "overbooked" || f.status === "critical"
                    ).length
                  }
                </p>
              </div>
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Passengers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {flights.reduce((sum, f) => sum + f.booked, 0)}
                </p>
              </div>
              <Users className="text-green-600" size={24} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Overbooking</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(
                    flights.reduce(
                      (sum, f) =>
                        sum + ((f.booked - f.capacity) / f.capacity) * 100,
                      0
                    ) / flights.length
                  )}
                  %
                </p>
              </div>
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  Flight Summary
                </h2>
              </div>
              <div className="divide-y">
                {flights.map((flight) => {
                  const overbookingRate =
                    ((flight.booked - flight.capacity) / flight.capacity) * 100;
                  const showRate = (flight.checkedIn / flight.booked) * 100;

                  return (
                    <div
                      key={flight.id}
                      className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedFlight?.id === flight.id
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                      onClick={() => setSelectedFlight(flight)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {flight.id}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              flight.status
                            )}`}
                          >
                            {flight.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Gate {flight.gate}
                          </p>
                          <p className="text-sm font-medium">
                            {flight.departure}
                          </p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-gray-700 font-medium">
                          {flight.route}
                        </p>
                        <p className="text-sm text-gray-600">
                          {flight.aircraft}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Capacity</p>
                          <p className="font-medium">{flight.capacity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Booked</p>
                          <p className="font-medium text-blue-600">
                            {flight.booked}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Checked In</p>
                          <p className="font-medium text-green-600">
                            {flight.checkedIn}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Overbooking</p>
                          <p
                            className={`font-medium ${
                              overbookingRate > 15
                                ? "text-red-600"
                                : overbookingRate > 5
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {overbookingRate > 0 ? "+" : ""}
                            {overbookingRate.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Show Rate</p>
                          <p className="font-medium text-blue-600">
                            {showRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedFlight
                      ? `${selectedFlight.id} Passengers`
                      : "Select a Flight"}
                  </h2>
                  {selectedFlight && (
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-gray-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
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
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="text-green-600 font-medium">
                        {selectedFlight.checkedIn}
                      </p>
                      <p className="text-gray-600">Checked In</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <p className="text-red-600 font-medium">
                        {selectedFlight.noShows}
                      </p>
                      <p className="text-gray-600">No Shows</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <p className="text-yellow-600 font-medium">
                        {selectedFlight.booked -
                          selectedFlight.checkedIn -
                          selectedFlight.noShows}
                      </p>
                      <p className="text-gray-600">Standby</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {selectedFlight ? (
                  <div className="divide-y">
                    {filteredPassengers.map((passenger) => (
                      <div key={passenger.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">
                            {passenger.name}
                          </h4>
                          {getPassengerStatusIcon(passenger.status)}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Seat {passenger.seat}
                          </span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightOverbookingDashboard;
