import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    {
      id: "home",
      path: "/home",
      label: "Home",
      description: "Dashboard",
    },
    {
      id: "meals",
      path: "/meal",
      label: "Meals",
      description: "Log Daily Meals",
    },
  ];

  return (
    <div className="shrink-0 max-h-screen overflow-auto bg-accent dark:bg-background border-r flex flex-col p-2 border-gray-200 w-64 z-40">
      <div className="flex items-center p-4">
        <span className="font-bold text-lg text-gray-800">Calorie Tracker</span>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <div className="flex-1 text-left">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4">
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
}
