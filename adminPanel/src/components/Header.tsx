import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-gradient-to-r from-cyan/80 to-cyan/60 backdrop-blur-md border-b-2 border-white/30 text-white flex justify-between items-center px-6 py-4 shadow-lg relative">
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm -z-10"></div>

      {/* Project Name / Logo */}
      <div className="text-2xl font-bold relative z-10">KareXpert</div>

      {/* Profile Section */}
      {user && (
        <div className="relative z-10" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/30 transition-all duration-200"
          >
            <User className="w-5 h-5" />
            <span className="font-medium">{user.name}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu - Less Transparent */}
          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-xl border border-white/40 text-gray-800 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-gray-200 bg-white/60">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600">{user.role}</p>
              </div>

              {/* Dropdown Items */}
              <button
                className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-cyan/20 text-gray-700 transition-colors duration-200"
                onClick={() => alert("Profile clicked")}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>

              <button
                className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-cyan/20 text-gray-700 transition-colors duration-200"
                onClick={() => alert("Settings clicked")}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-red-100 text-red-600 transition-colors duration-200 border-t border-gray-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}