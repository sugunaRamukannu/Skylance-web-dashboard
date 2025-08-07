import { useState } from "react";

import { Plane, Users, TrendingUp, AlertTriangle } from "lucide-react";

import TicketSalesBarChart from "./TicketSalesBarChart";
import Card from "./Card";
import RevenueChart from "./RevenueChart";
import OpenCheckInFlightSummary from "./OpenCheckInFlightSummary";
import FlightShowPredictionPie from "./FlightShowPredictionPie";
import PassengerShowGauge from "./PassengerShowGauge";
import OpenCheckInPassengerDetailView from "./OpenCheckInPassengerDetailView";
import OpenCheckInPassengerOverview from "./OpenCheckInPassengerOverview";

const MainDashboard = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");

  const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
    setCurrentView("OpenCheckInPassengerDetailView");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  if (currentView === "OpenCheckInPassengerDetailView") {
    return (
      <OpenCheckInPassengerDetailView
        selectedFlight={selectedFlight}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Overview Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            icon={<Plane className="text-white" size={24} />}
            title="Active Flights"
            value="15"
            trend="+12%"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <Card
            icon={<AlertTriangle className="text-white" size={24} />}
            title="Overbooked Flights"
            value="8"
            trend="+5%"
            color="bg-gradient-to-br from-amber-500 to-orange-500"
          />
          <Card
            icon={<Users className="text-white" size={24} />}
            title="Total Passengers"
            value="2,847"
            trend="+18%"
            color="bg-gradient-to-br from-green-500 to-emerald-500"
          />
          <Card
            icon={<TrendingUp className="text-white" size={24} />}
            title="Revenue Today"
            value="$428K"
            trend="+22%"
            color="bg-gradient-to-br from-purple-500 to-pink-500"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <TicketSalesBarChart />
          <RevenueChart />
          <PassengerShowGauge />
        </div>

        {/* Flight Summary and Passenger Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OpenCheckInFlightSummary
              onFlightSelect={setSelectedFlight}
              selectedFlight={selectedFlight}
            />
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
            <FlightShowPredictionPie />
            <OpenCheckInPassengerOverview
              selectedFlight={selectedFlight}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
