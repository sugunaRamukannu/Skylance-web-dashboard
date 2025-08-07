import { useState, useEffect } from "react";

import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";

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
    gate:
      Math.random() > 0.3
        ? `${String.fromCharCode(65 + Math.floor(Math.random() * 4))}${
            Math.floor(Math.random() * 20) + 1
          }`
        : null,
    aircraft: Math.random() > 0.5 ? "Boeing 737" : "Airbus A321",
    date: new Date().toISOString().split("T")[0],
  }));
};

const OpenCheckInFlightSummary = ({ onFlightSelect, selectedFlight }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [flights] = useState(generateFlightData());
  const [searchQuery, setSearchQuery] = useState("");
  const flightsPerPage = 2;

  // Filter flights based on search query
  const filteredFlights = flights.filter((flight) =>
    flight.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = filteredFlights.slice(
    indexOfFirstFlight,
    indexOfLastFlight
  );
  const totalPages = Math.ceil(filteredFlights.length / flightsPerPage);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
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

        {/* Search Filter */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by flight number"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
                  ? "bg-purple-50 border-l-4 border-l-purple-500"
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
                  <p className="text-sm text-gray-600">
                    Gate {flight.gate || "---"}
                  </p>
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
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-gray-500">Booked</p>
                  <p className="font-semibold text-purple-600">
                    {flight.booked}
                  </p>
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
                <div className="text-center p-2 bg-indigo-50 rounded-lg">
                  <p className="text-gray-500">Show Rate</p>
                  <p className="font-semibold text-indigo-600">
                    {showRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Pagination */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {indexOfFirstFlight + 1} to{" "}
            {Math.min(indexOfLastFlight, filteredFlights.length)} of{" "}
            {filteredFlights.length} flights
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>

            {getVisiblePages().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={page === "..."}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    : page === "..."
                    ? "text-gray-400 cursor-default"
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
              className="flex items-center px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenCheckInFlightSummary;
