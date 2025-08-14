import { useEffect, useState } from "react";
import { Plane, Users, TrendingUp, AlertTriangle } from "lucide-react";

import TicketSalesBarChart from "./TicketSalesBarChart";
import Card from "./Card";
import RevenueChart from "./RevenueChart";
import OpenCheckInFlightSummary from "./OpenCheckInFlightSummary";
import FlightShowPredictionPie from "./FlightShowPredictionPie";
import PassengerShowGauge from "./PassengerShowGauge";
import OpenCheckInPassengerDetailView from "./OpenCheckInPassengerDetailView";
import OpenCheckInPassengerOverview from "./OpenCheckInPassengerOverview";
import { Result } from "postcss";

const MainDashboard = () => {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem("authToken");
  // console.log(authToken);

  const handleViewDetails = (flight) => {
    setSelectedFlight(flight);
    setCurrentView("OpenCheckInPassengerDetailView");
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/dashboard/summary`,
          {
            method: "GET",
            headers: {
              "Session-Token": authToken,
              "Content-Type": "application/json",
            },
          }
        );

        const json = await res.json();
        console.log(json);

        if (json.status === "success") {
          setDashboardData(json.data);
        } else {
          throw new Error("Failed to load dashboard data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        {/* Loading/Error State */}
        {loading ? (
          <p className="text-center text-lg">Loading dashboard...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error: {error}</p>
        ) : (
          <>
            {/* Overview Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                icon={<Plane className="text-white" size={24} />}
                title="Active Flights"
                valueToday={dashboardData.checkInFlights}
                // percentChange={dashboardData.activeFlights.percentChange}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <Card
                icon={<AlertTriangle className="text-white" size={24} />}
                title="Overbooked Flights"
                valueToday={dashboardData.overbookedFlights.valueToday}
                percentChange={dashboardData.overbookedFlights.percentChange}
                color="bg-gradient-to-br from-amber-500 to-orange-500"
              />
              <Card
                icon={<Users className="text-white" size={24} />}
                title="Total Passengers"
                valueToday={dashboardData.totalPassengers.valueToday.toLocaleString()}
                percentChange={dashboardData.totalPassengers.percentChange}
                color="bg-gradient-to-br from-green-500 to-emerald-500"
              />
              <Card
                icon={<TrendingUp className="text-white" size={24} />}
                title="Revenue Today"
                valueToday={`$${dashboardData.revenueToday.valueToday.toLocaleString()}`}
                percentChange={dashboardData.revenueToday.percentChange}
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
          </>
        )}
      </div>
    </div>
  );
};

export default MainDashboard;
