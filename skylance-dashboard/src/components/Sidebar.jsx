import {
  LayoutDashboard,
  Plane,
  Users,
  Calendar,
  FileText,
  Settings,
  HelpCircle,
} from "lucide-react";

const Sidebar = ({ setActivePage, activePage }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "flights", label: "Flight Management", icon: Plane },
    { id: "passengers", label: "Passenger Details", icon: Users },
    // { id: "schedule", label: "Flight Schedule", icon: Calendar },
    // { id: "reports", label: "Reports", icon: FileText },
    // { id: "settings", label: "Settings", icon: Settings },
    // { id: "help", label: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div className="h-full bg-white flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Plane className="text-white" size={18} />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Skylance
          </h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activePage === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActivePage(item.id)} //passing the active page id to the parent component (layout)
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <IconComponent size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
