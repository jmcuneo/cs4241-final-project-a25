import React from "react";

interface SidebarProps {
  currentPage?: "home" | "meals";
  onNavigate?: (page: "home" | "meals") => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentPage = "home",
  onNavigate,
}) => {
  const handleNavigation = (page: "home" | "meals") => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      // Fallback to basic navigation if no callback provided
      window.location.href = `/${page}`;
    }
  };

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      description: "Dashboard & Overview",
    },
    {
      id: "meals",
      label: "Meals",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      description: "Log Daily Meals",
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 w-64 z-40">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="font-bold text-lg text-gray-800">CalTracker</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id as "home" | "meals")}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
              currentPage === item.id
                ? "bg-green-50 text-green-700 border border-green-200"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <div
              className={`flex-shrink-0 ${
                currentPage === item.id
                  ? "text-green-600"
                  : "text-gray-400 group-hover:text-gray-600"
              }`}
            >
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">{item.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {item.description}
              </div>
            </div>
            {currentPage === item.id && (
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm text-gray-800">
              User Profile
            </div>
            <div className="text-xs text-gray-500">Manage account</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
