import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MainDashboard from "./MainDashboard";
import FlightRegistry from "./FlightRegistry";
import PassengerRegistryView from "./PassengerRegistryView";
import ChatWidget from "./chatbox";

const Layout = ({ setIsAuthenticated }) => {
  const [activePage, setActivePage] = useState("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "flights":
        return <FlightRegistry />;
      case "passengers":
        return <PassengerRegistryView />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 z-50">
        <Sidebar setActivePage={setActivePage} activePage={activePage} />
      </div>

      {/* Main content wrapper */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Fixed Navbar */}
        <div className="fixed top-0 left-64 right-0 h-16 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 z-40">
          <Navbar setIsAuthenticated={setIsAuthenticated} />
        </div>

        {/* Dashboard content area, dynamically render the component*/}
        <div className="mt-16 flex-1 p-6">{renderContent()}</div>
        <div>
          <ChatWidget />
        </div>
      </div>
    </div>
  );
};

export default Layout;
