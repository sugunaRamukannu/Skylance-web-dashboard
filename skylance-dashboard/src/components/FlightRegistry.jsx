import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Plane, Users, UserCheck, Crown } from "lucide-react";

const FlightRegistry = () => {
  const [filters, setFilters] = useState({
    airline: "",
    arrival: "",
    departure: "",
    dateOfTravel: "",
    status: "",
  });

  const [flightsData, setFlightsData] = useState([]);
  const [totalFlights, setTotalFlights] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to calculate flight duration
  const calculateDuration = (departureDate, arrivalTime) => {
    try {
      const departure = new Date(departureDate);
      const arrival = new Date(arrivalTime);

      if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
        return "—";
      }

      const diffMs = arrival.getTime() - departure.getTime();

      // Handle negative duration (arrival before departure - likely next day)
      const adjustedDiffMs = diffMs < 0 ? diffMs + 24 * 60 * 60 * 1000 : diffMs;

      const hours = Math.floor(adjustedDiffMs / (1000 * 60 * 60));
      const minutes = Math.floor(
        (adjustedDiffMs % (1000 * 60 * 60)) / (1000 * 60)
      );

      return `${hours}h ${minutes}m`;
    } catch (error) {
      return "—";
    }
  };

  useEffect(() => {
    let intervalId;

    const fetchFlights = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/webflights/allflights?page=${currentPage}&pageSize=${pageSize}`
        );

        const apiFlights = response.data.flights.map((f, index) => ({
          id: index + 1 + (currentPage - 1) * pageSize,
          airline: f.airlineName,
          flightNumber: f.flightName,
          departure: {
            city: f.departureCity,
            code: f.departureCityCode,
            time: new Date(f.departureDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          },
          arrival: {
            city: f.arrivalCity,
            code: f.arrivalCityCode,
            time: new Date(f.arrivalTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          },
          duration: calculateDuration(f.departureDate, f.arrivalTime),
          date: f.departureDate.slice(0, 10), // YYYY-MM-DD
          passengers: f.totalNoOfPassengers,
          crew: f.totalNoOfCrew,
          status: f.flightStatus.toLowerCase(),
        }));
        console.log("respo", response.data);
        setFlightsData(apiFlights);
        setTotalFlights(response.data.totalFlights);
      } catch (err) {
        setError("Failed to fetch flight data");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();

    intervalId = setInterval(fetchFlights, 10000);

    return () => clearInterval(intervalId);
  }, [currentPage]);

  const airlines = [...new Set(flightsData.map((flight) => flight.airline))];
  const cities = [
    ...new Set([
      ...flightsData.map((flight) => flight.departure.city),
      ...flightsData.map((flight) => flight.arrival.city),
    ]),
  ];

  const statusOptions = [
    { value: "ontime", label: "On Time" },
    { value: "delayed", label: "Delayed" },
    { value: "landed", label: "Landed" },
    { value: "scheduled", label: "Scheduled" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "ontime":
      case "scheduled":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "delayed":
        return "bg-gradient-to-r from-red-500 to-rose-500 text-white";
      case "landed":
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
      default:
        return "bg-gradient-to-r from-purple-500 to-violet-500 text-white";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredFlights = useMemo(() => {
    return flightsData.filter((flight) => {
      const matchesAirline =
        !filters.airline || flight.airline === filters.airline;
      const matchesArrival =
        !filters.arrival || flight.arrival.city === filters.arrival;
      const matchesDeparture =
        !filters.departure || flight.departure.city === filters.departure;
      const matchesStatus =
        !filters.status || flight.status === filters.status.toLowerCase();
      const matchesDate =
        !filters.dateOfTravel || flight.date === filters.dateOfTravel;

      return (
        matchesAirline &&
        matchesArrival &&
        matchesDeparture &&
        matchesStatus &&
        matchesDate
      );
    });
  }, [filters, flightsData]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      airline: "",
      arrival: "",
      departure: "",
      dateOfTravel: "",
      status: "",
    });
  };

  const totalPages = Math.ceil(totalFlights / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Filters UI */}
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Airline
              </label>
              <select
                value={filters.airline}
                onChange={(e) => updateFilter("airline", e.target.value)}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Airlines</option>
                {airlines.map((airline) => (
                  <option key={airline} value={airline}>
                    {airline}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure
              </label>
              <select
                value={filters.departure}
                onChange={(e) => updateFilter("departure", e.target.value)}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arrival
              </label>
              <select
                value={filters.arrival}
                onChange={(e) => updateFilter("arrival", e.target.value)}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Travel
              </label>
              <input
                type="date"
                value={filters.dateOfTravel}
                onChange={(e) => updateFilter("dateOfTravel", e.target.value)}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-7 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg hover:from-purple-600 hover:to-violet-600 transition-all duration-200 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-purple-600">
              {filteredFlights.length}
            </span>{" "}
            of {flightsData.length} flights
          </p>
        </div>

        {/* Flight List */}
        <div className="space-y-4">
          {filteredFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 hover:shadow-xl transition-all duration-300 hover:border-purple-200"
            >
              <div className="flex items-center justify-between">
                {/* Airline Info */}
                <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {flight.airline}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {flight.flightNumber}
                    </p>
                  </div>
                </div>

                {/* Centered Flight Route */}
                <div className="flex items-center justify-center flex-1 mx-8">
                  <div className="flex items-center space-x-8 max-w-3xl w-full">
                    {/* Departure */}
                    <div className="text-center flex-shrink-0">
                      <p className="text-2xl font-bold text-gray-800">
                        {flight.departure.time}
                      </p>
                      <p className="text-sm text-gray-500">
                        {flight.departure.city}
                      </p>
                      <p className="text-xs text-gray-400">
                        {flight.departure.code}
                      </p>
                    </div>

                    {/* Flight Path with Duration */}
                    <div className="flex-1 relative">
                      <div className="flex items-center justify-center">
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-300 to-violet-300"></div>
                        <div className="mx-4 flex flex-col items-center">
                          <Plane className="h-6 w-6 text-purple-500 mb-1" />
                          <p className="text-xs text-gray-500 font-medium whitespace-nowrap">
                            {flight.duration}
                          </p>
                        </div>
                        <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-300 to-violet-300"></div>
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center flex-shrink-0">
                      <p className="text-2xl font-bold text-gray-800">
                        {flight.arrival.time}
                      </p>
                      <p className="text-sm text-gray-500">
                        {flight.arrival.city}
                      </p>
                      <p className="text-xs text-gray-400">
                        {flight.arrival.code}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flight Details */}
                <div className="flex items-center space-x-6 min-w-0 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-semibold text-gray-800">{flight.date}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1 text-blue-500" />
                      <span>{flight.passengers}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Crown className="h-4 w-4 mr-1 text-yellow-500" />
                      <span>{flight.crew}</span>
                    </div>
                  </div>

                  <div
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                      flight.status
                    )}`}
                  >
                    {getStatusLabel(flight.status)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFlights.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No flights found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters to see more results
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredFlights.length > 0 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  i + 1 === currentPage
                    ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white"
                    : "text-purple-600 hover:bg-purple-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightRegistry;
