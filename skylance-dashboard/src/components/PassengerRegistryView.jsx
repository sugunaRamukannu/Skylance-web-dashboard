import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Plane, Eye, Filter } from "lucide-react";

import getMembershipColor from "./GetMembershipColor";
import getStatusIcon from "./GetStatusIcon";
import getStatusColor from "./GetStatusColor";
import getClassColor from "./getClassColor";

import PassengerRegistryDetailView from "./PassengerRegistryDetailView";

const PassengerRegistryView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const recordsPerPage = 10;
  const authToken = localStorage.getItem("authToken");

  const [filters, setFilters] = useState({
    passengerName: "",
    dateOfTravel: "",
    checkinStatus: "",
    class: "",
    bookingStatus: "",
    membershipTier: "",
  });

  const [passengers, setPassengers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/allpassengers?page=${currentPage}&pageSize=${recordsPerPage}`,
          {
            method: "GET",
            headers: {
              "Session-Token": authToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          // console.error("HTTP error:", response.success, text);
          return;
        }
        const result = await response.json();
        // console.log("Full JSON response:", result);
        // console.log("adf", result.success);
        if (result.success) {
          setPassengers(result.data);
        } else {
          // console.error("Error fetching passengers:", result.message);
        }
      } catch (error) {
        // console.error("Error fetching passengers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPassengers();
  }, [currentPage]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      passengerName: "",
      dateOfTravel: "",
      checkinStatus: "",
      class: "",
      bookingStatus: "",
      membershipTier: "",
    });
    setSearchTerm("");
  };

  const filteredPassengers = passengers.filter((passenger) => {
    const matchesSearch =
      searchTerm === "" ||
      passenger.passengerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      passenger.flightNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (filters.passengerName === "" ||
        passenger.passengerName
          .toLowerCase()
          .includes(filters.passengerName.toLowerCase())) &&
      (filters.dateOfTravel === "" ||
        passenger.dateOfTravel === filters.dateOfTravel) &&
      (filters.checkinStatus === "" ||
        passenger.checkinStatus === filters.checkinStatus) &&
      (filters.class === "" || passenger.class === filters.class) &&
      (filters.bookingStatus === "" ||
        passenger.bookingStatus === filters.bookingStatus) &&
      (filters.membershipTier === "" ||
        passenger.membershipTier === filters.membershipTier);

    return matchesSearch && matchesFilters;
  });

  const totalPages = Math.ceil(filteredPassengers.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentPassengers = filteredPassengers.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = (passenger) => {
    setSelectedPassenger(passenger);
  };

  const handleBackToList = () => {
    setSelectedPassenger(null);
  };

  if (selectedPassenger) {
    return (
      <PassengerRegistryDetailView
        passenger={selectedPassenger}
        onBack={handleBackToList}
      />
    );
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading passengers...</div>;
  }

  // Main List View
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Passenger Dashboard
        </h1>

        {/* Search and Filter Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search passenger name or flight number..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passenger Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  value={filters.passengerName}
                  onChange={(e) =>
                    handleFilterChange("passengerName", e.target.value)
                  }
                  placeholder="Enter passenger name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Travel
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  value={filters.dateOfTravel}
                  onChange={(e) =>
                    handleFilterChange("dateOfTravel", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  value={filters.checkinStatus}
                  onChange={(e) =>
                    handleFilterChange("checkinStatus", e.target.value)
                  }
                >
                  <option value="">All</option>
                  <option value="Checked-In">Checked In</option>
                  <option value="Not Checked">Not Checked In</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  value={filters.class}
                  onChange={(e) => handleFilterChange("class", e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Economy">Economy</option>
                  <option value="PremiumEconomy">PremiumEconomy</option>
                  <option value="First">First</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  value={filters.bookingStatus}
                  onChange={(e) =>
                    handleFilterChange("bookingStatus", e.target.value)
                  }
                >
                  <option value="">All</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="CheckedIn">CheckedIn</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rebooked">Rebooked</option>
                  <option value="NoShow">NoShow</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Membership Tier
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  value={filters.membershipTier}
                  onChange={(e) =>
                    handleFilterChange("membershipTier", e.target.value)
                  }
                >
                  <option value="">All</option>
                  <option value="Regular">Regular</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table Header */}
      <div className="px-6 py-3 bg-gray-100 border-b">
        <div className="grid grid-cols-9 gap-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
          <div className="col-span-1 break-words">Passenger Name</div>
          <div className="col-span-1 break-words">Flight Num</div>
          <div className="col-span-1 break-words">Airline</div>
          <div className="col-span-1 ">Class</div>
          <div className="col-span-1 break-words">Membership</div>
          <div className="col-span-1 break-words">Travel Date</div>
          <div className="col-span-1 break-words">Booking Status</div>
          <div className="col-span-1 break-words">Check-in Status</div>
          <div className="col-span-1 break-words">Action</div>
        </div>
      </div>

      {/* Passenger List */}
      <div className="bg-white" key={currentPassengers.id}>
        {currentPassengers.map((passenger) => (
          <div
            key={passenger.id}
            className="px-6 py-4 border-b border-gray-100 hover:bg-gray-50"
          >
            <div className="grid grid-cols-9 gap-4 items-center text-sm">
              {/* Passenger Name */}
              <div className="col-span-1 break-words">
                <div className="font-semibold text-gray-900">
                  {passenger.passengerName}
                </div>
              </div>

              {/* Flight No. */}
              <div className="col-span-1 break-words">
                <div className="font-semibold items-center space-x-1">
                  <span>{passenger.flightNumber}</span>
                </div>
              </div>

              {/* Airline */}
              <div className="col-span-1 break-words">
                <div className="text-gray-900 font-medium">
                  {passenger.airline}
                </div>
              </div>

              {/* Class */}
              <div className="col-span-1">
                <div
                  className={`text-xs font-semibold ${getClassColor(
                    passenger.class
                  )}`}
                >
                  {passenger.class}
                </div>
              </div>

              {/* Membership */}
              <div className="col-span-1 break-words">
                <div
                  className={`text-xs font-semibold ${getMembershipColor(
                    passenger.membershipTier
                  )}`}
                >
                  {passenger.membershipTier}
                </div>
              </div>

              {/* Travel Date */}
              <div className="col-span-1 break-words">
                <div className="text-gray-900 font-medium">
                  {passenger.dateOfTravel
                    ? passenger.dateOfTravel.split("T")[0]
                    : ""}
                </div>
              </div>

              {/* Booking Status */}
              <div className="col-span-1 break-words">
                <span
                  className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    passenger.bookingStatus
                  )}`}
                >
                  {getStatusIcon(passenger.bookingStatus)}
                  <span>{passenger.bookingStatus}</span>
                </span>
              </div>

              {/* Check-in Status */}
              <div className="col-span-1 break-words">
                <div
                  className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    passenger.checkinStatus === "Checked In"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {passenger.checkinStatus === "Checked In" ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      <span>Checked In</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      <span>Not Checked</span>
                    </>
                  )}
                </div>
              </div>

              {/* View Details Button */}
              <div className="col-span-1 break-words">
                <button
                  key={passenger.passengerId}
                  onClick={() => handleViewDetails(passenger)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {currentPassengers.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            No passengers found matching your search criteria.
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 bg-white border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredPassengers.length)} of{" "}
            {filteredPassengers.length} passengers
          </div>

          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm border border-gray-300 rounded ${
                  currentPage === 1
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : "text-gray-500 bg-white hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              <span className="px-3 py-1 text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm border border-gray-300 rounded ${
                  currentPage === totalPages
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : "text-gray-500 bg-white hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassengerRegistryView;
