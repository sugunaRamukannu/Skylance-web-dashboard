import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, Search } from "lucide-react";

const OpenCheckInFlightSummary = ({ onFlightSelect, selectedFlight }) => {
  const [flights, setFlights] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 3;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const authToken = localStorage.getItem("authToken");

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/webflights/open-for-checkin?page=${currentPage}&pageSize=${pageSize}`,
        {
          method: "GET",
          headers: {
            "Session-Token": authToken,
            "Content-Type": "application/json",
          },
        }
      );
      const json = await res.json();
      if (json.status === "success") {
        setFlights(json.data);
        setTotalPages(json.pagination.totalPages);
        setTotalItems(json.pagination.totalItems);
      } else {
        throw new Error("Failed to load flight data");
      }
    } catch (err) {
      setError("Failed to fetch flight data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, [currentPage]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "overbooked":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "normal":
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const determineStatus = (flight) => {
    if (flight.booked > flight.capacity) {
      if (flight.overbookingCount > 0) return "Overbooked";
      if (flight.checkedIn >= flight.capacity * 0.97) return "Critical";
      return "Normal";
    }
    return "Normal";
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

  const filteredFlights = flights.filter((flight) =>
    flight.flightid
      ?.toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Flights Open for Check-In
            </h2>
            {/* <p className="text-sm text-gray-500 mt-1">
              Daily flights for{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p> */}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar size={16} />
            <span>Scheduled Flight(s)</span>
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
            placeholder="Search by flight ID"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Flight Cards */}
      {loading ? (
        <div className="p-6 text-center text-gray-500">Loading flights...</div>
      ) : error ? (
        <div className="p-6 text-center text-red-500">{error}</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filteredFlights.map((flight) => {
            const overbookingRate =
              ((flight.booked - flight.capacity) / flight.capacity) * 100;
            const showRate = (flight.checkedIn / flight.booked) * 100;
            const status = determineStatus(flight);

            return (
              <div
                key={flight.flightid}
                className={`p-6 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                  selectedFlight?.flightid === flight.flightid
                    ? "bg-purple-50 border-l-4 border-l-purple-500"
                    : ""
                }`}
                onClick={() => onFlightSelect(flight)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {flight.flightid}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        status
                      )}`}
                    >
                      {status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Gate {flight.gate || "---"}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {flight.date
                        ? new Date(flight.date).toLocaleDateString("en-GB")
                        : "N/A"}
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
      )}

      {/* Pagination */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
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
