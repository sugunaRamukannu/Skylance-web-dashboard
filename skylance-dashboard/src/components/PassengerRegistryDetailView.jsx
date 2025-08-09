import {
  Search,
  CheckCircle,
  XCircle,
  Plane,
  ArrowLeft,
  Mail,
  FileText,
  MapPin,
  User,
  Luggage,
} from "lucide-react";
import getMembershipColor from "./GetMembershipColor";
import getStatusColor from "./GetStatusColor";
import getStatusIcon from "./GetStatusIcon";

// Detailed View Component
const PassengerRegistryDetailView = ({ passenger, onBack }) => (
  <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <div className="px-6 py-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to List</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Passenger Details</h1>
      </div>
    </div>

    {/* Detail Cards */}
    <div className="p-6 space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <User className="w-5 h-5 text-purple-600" />
          <span>Basic Information</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Passenger Name
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {passenger.passengerName}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">PNR</label>
            <p className="text-lg font-semibold text-purple-600">
              {passenger.pnr}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Membership Tier
            </label>
            <p
              className={`text-lg font-semibold ${getMembershipColor(
                passenger.membershipTier
              )}`}
            >
              {passenger.membershipTier}
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Mail className="w-5 h-5 text-blue-600" />
          <span>Contact Information</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg text-gray-900">{passenger.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Phone Number
            </label>
            <p className="text-lg text-gray-900">{passenger.phoneNumber}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Passport Number
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {passenger.passportNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Flight Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Plane className="w-5 h-5 text-purple-600" />
          <span>Flight Information</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Flight Number
            </label>
            <p className="text-lg font-semibold text-purple-600">
              {passenger.flightNumber}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Airline</label>
            <p className="text-lg text-gray-900">{passenger.airlineName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Class</label>
            <p className="text-lg font-semibold text-purple-600">
              {passenger.class}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Seat Number
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {passenger.seatNumber}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Travel Date
            </label>
            <p className="text-lg text-gray-900">{passenger.dateOfTravel}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Booking Status
            </label>
            <span
              className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                passenger.bookingStatus
              )}`}
            >
              {getStatusIcon(passenger.bookingStatus)}
              <span>{passenger.bookingStatus}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Travel Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-green-600" />
          <span>Travel Information</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Departure City
            </label>
            <p className="text-lg text-gray-900">{passenger.departureCity}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Arrival City
            </label>
            <p className="text-lg text-gray-900">{passenger.arrivalCity}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Check-in Status
            </label>
            <span
              className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                passenger.checkinStatus === "Checked In"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {passenger.checkinStatus === "Checked In" ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Checked In</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Not Checked</span>
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Baggage Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Luggage className="w-5 h-5 text-orange-600" />
          <span>Baggage Information</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Weight Allowed
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {passenger.baggageAllowed}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">
              Weight Carried
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {passenger.baggageChecked}
            </p>
          </div>
        </div>
      </div>

      {/* Special Requests */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-red-600" />
          <span>Special Requests</span>
        </h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-900">{passenger.specialRequests}</p>
        </div>
      </div>
    </div>
  </div>
);

export default PassengerRegistryDetailView;
