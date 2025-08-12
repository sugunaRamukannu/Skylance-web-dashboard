import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const OpenCheckInPassengerDetailView = ({
  selectedFlight,
  onBackToDashboard,
}) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPassengers, setTotalPassengers] = useState(0);

  useEffect(() => {
    const fetchPassengers = async () => {
      if (!selectedFlight?.flightid) return;
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/${
            selectedFlight.flightid
          }/passengers?page=${page}&pageSize=${pageSize}`
        );
        if (!response.ok) throw new Error("Failed to fetch passengers");
        const data = await response.json();
        setPassengers(data.passengers || []);
        setTotalPassengers(data.totalPassengers || 0);
      } catch (error) {
        console.error("Error fetching passengers:", error);
        setPassengers([]);
        setTotalPassengers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPassengers();
  }, [selectedFlight?.flightid, page, pageSize]);

  const getPassengerStatusIcon = (status) => {
    switch ((status || "").toLowerCase()) {
      case "checked-in":
      case "checkedin":
        return <CheckCircle className="text-green-600" size={16} />;
      case "no-show":
      case "noshow":
        return <XCircle className="text-red-600" size={16} />;
      case "standby":
        return <Clock className="text-amber-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch ((priority || "").toLowerCase()) {
      case "platinum":
        return "bg-purple-100 text-purple-800";
      case "gold":
        return "bg-amber-100 text-amber-800";
      case "silver":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const filteredPassengers = passengers.filter((passenger) => {
    const passengerStatus = (passenger.bookingStatus || "").toLowerCase();
    const passengerPriority = (passenger.membershipTier || "").toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();

    const matchesStatus =
      filterStatus === "all" || passengerStatus === filterStatus;
    const matchesPriority =
      filterPriority === "all" || passengerPriority === filterPriority;
    const matchesSearch =
      (passenger.passengerName || "").toLowerCase().includes(searchTermLower) ||
      (passenger.seatNumber || "").toLowerCase().includes(searchTermLower);

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const totalPages = Math.ceil(totalPassengers / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToDashboard}
                className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedFlight?.flightid} - Passenger Details
              </h1>
            </div>
          </div>

          {/* Flight Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">
                {selectedFlight?.capacity}
              </p>
              <p className="text-sm text-gray-600">Capacity</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">
                {selectedFlight?.booked}
              </p>
              <p className="text-sm text-gray-600">Booked</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">
                {selectedFlight?.checkedIn}
              </p>
              <p className="text-sm text-gray-600">Checked In</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-xl">
              <p className="text-2xl font-bold text-red-600">
                {(selectedFlight?.booked || 0) -
                  (selectedFlight?.checkedIn || 0)}
              </p>
              <p className="text-sm text-gray-600">No Shows</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search passengers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Booking Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="checkedin">Checked In</option>
                <option value="cancelled">Cancelled</option>
                <option value="rebooked">Rebooked</option>
                <option value="noshow">No Show</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Priority</option>
                <option value="regular">Regular</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="normal">Normal</option>
              </select>
            </div>

            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredPassengers.length} of {totalPassengers}{" "}
              passengers
            </div>
          </div>
        </div>

        {/* Passenger Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Passenger
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Seat
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Booking Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Booking Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Check-in Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Prediction
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Special Requests
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">
                      Loading passengers...
                    </td>
                  </tr>
                ) : filteredPassengers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">
                      No passengers found.
                    </td>
                  </tr>
                ) : (
                  filteredPassengers.map((passenger) => (
                    <tr
                      key={passenger.passengerId || passenger.passengerName}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {passenger.passengerName || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {passenger.seatNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getPassengerStatusIcon(passenger.bookingStatus)}
                          <span className="text-sm text-gray-600 capitalize">
                            {(passenger.bookingStatus || "unknown").replace(
                              /-/g,
                              " "
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            passenger.membershipTier
                          )}`}
                        >
                          {passenger.membershipTier || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {passenger.bookingDate &&
                        passenger.bookingDate !== "0001-01-01T00:00:00"
                          ? new Date(passenger.bookingDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {passenger.checkinTime || "Not checked in"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium">
                          {passenger.prediction || "No Prediction"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {passenger.specialRequests || ""}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex justify-end items-center space-x-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 
        ${
          page === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
        }`}
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-lg transition-colors duration-200
        ${
          page === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
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

export default OpenCheckInPassengerDetailView;
