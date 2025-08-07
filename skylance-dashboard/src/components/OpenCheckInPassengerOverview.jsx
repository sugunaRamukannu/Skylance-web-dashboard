import { useState } from "react";
import { Plane, Filter, Clock, CheckCircle, XCircle, Eye } from "lucide-react";

const OpenCheckInPassengerOverview = ({ selectedFlight, onViewDetails }) => {
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
            <button
              onClick={() => onViewDetails(selectedFlight)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye size={16} />
              <span>View Details</span>
            </button>
          )}
        </div>

        {selectedFlight ? (
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
              <p className="text-2xl font-bold text-amber-600">0</p>
              <p className="text-sm text-gray-600">Standby</p>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Plane className="mx-auto mb-4 text-gray-300" size={48} />
            <p>Select a flight to view passenger overview</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpenCheckInPassengerOverview;
