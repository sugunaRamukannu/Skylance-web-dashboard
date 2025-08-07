import { useState } from "react";
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

  const getPassengerData = (flightId) => {
    return [
      {
        id: 1,
        name: "John Smith",
        seat: "12A",
        status: "checked-in",
        priority: "Gold",
        bookingTime: "2024-01-15",
        checkInTime: "2024-01-25 06:30",
        boardingGroup: "A",
        specialRequests: "Wheelchair",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        seat: "15C",
        status: "no-show",
        priority: "Silver",
        bookingTime: "2024-01-10",
        checkInTime: null,
        boardingGroup: "B",
        specialRequests: "None",
      },
      {
        id: 3,
        name: "Mike Wilson",
        seat: "8B",
        status: "checked-in",
        priority: "Platinum",
        bookingTime: "2024-01-08",
        checkInTime: "2024-01-25 05:45",
        boardingGroup: "A",
        specialRequests: "Extra Legroom",
      },
      {
        id: 4,
        name: "Emily Davis",
        seat: "22F",
        status: "checked-in",
        priority: "Basic",
        bookingTime: "2024-01-20",
        checkInTime: "2024-01-25 07:15",
        boardingGroup: "C",
        specialRequests: "Vegetarian Meal",
      },
      {
        id: 5,
        name: "Robert Brown",
        seat: "5A",
        status: "checked-in",
        priority: "Gold",
        bookingTime: "2024-01-12",
        checkInTime: "2024-01-25 06:00",
        boardingGroup: "A",
        specialRequests: "None",
      },
      {
        id: 6,
        name: "Lisa Garcia",
        seat: "18D",
        status: "no-show",
        priority: "Basic",
        bookingTime: "2024-01-18",
        checkInTime: null,
        boardingGroup: "C",
        specialRequests: "Child Meal",
      },
      {
        id: 7,
        name: "David Martinez",
        seat: "11E",
        status: "no-show",
        priority: "Silver",
        bookingTime: "2024-01-22",
        checkInTime: null,
        boardingGroup: "B",
        specialRequests: "None",
      },
      {
        id: 8,
        name: "Jennifer Lee",
        seat: "7C",
        status: "checked-in",
        priority: "Platinum",
        bookingTime: "2024-01-05",
        checkInTime: "2024-01-25 05:30",
        boardingGroup: "A",
        specialRequests: "Priority Boarding",
      },
    ];
  };

  const getPrediction = (passenger) => {
    // Simulate logic: lower priority and late booking = likely no-show
    const isLateBooking =
      new Date(passenger.bookingTime) > new Date("2024-01-15");

    if (
      passenger.status === "no-show" ||
      (passenger.priority === "Basic" && isLateBooking)
    ) {
      return {
        label: "Likely No Show",
        color: "bg-red-100 text-red-700",
      };
    }

    return {
      label: "Likely to Show",
      color: "bg-green-100 text-green-700",
    };
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

  const passengers = getPassengerData(selectedFlight?.id || "");

  const filteredPassengers = passengers.filter((passenger) => {
    const matchesStatus =
      filterStatus === "all" || passenger.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || passenger.priority === filterPriority;
    const matchesSearch =
      passenger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      passenger.seat.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back to Dashboard Button */}
        {/* <div className="mb-6">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div> */}

        {/* Header */}
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
                {selectedFlight?.id} - Passenger Details
              </h1>
              <p className="text-lg text-gray-600">
                {selectedFlight?.departure} → {selectedFlight?.arrival}
              </p>
              {/* <p className="text-lg font-semibold">{selectedFlight?.time}</p> */}
            </div>
            {/* <div className="text-right">
             
            </div> */}
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
                {selectedFlight?.noShows}
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
                <option value="all">All Status</option>
                <option value="checked-in">Checked In</option>
                <option value="no-show">No Show</option>
                <option value="standby">Standby</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="Platinum">Platinum</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Basic">Basic</option>
              </select>
            </div>

            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredPassengers.length} of {passengers.length}{" "}
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
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Priority
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Booking Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Check-in Time
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
                {filteredPassengers.map((passenger) => (
                  <tr key={passenger.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {passenger.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {passenger.seat}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getPassengerStatusIcon(passenger.status)}
                        <span className="text-sm text-gray-600 capitalize">
                          {passenger.status.replace("-", " ")}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          passenger.priority
                        )}`}
                      >
                        {passenger.priority}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {passenger.bookingTime}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {passenger.checkInTime || "Not checked in"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getPrediction(passenger).color
                        }`}
                      >
                        {getPrediction(passenger).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {passenger.specialRequests}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenCheckInPassengerDetailView;
