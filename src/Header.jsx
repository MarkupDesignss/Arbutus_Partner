import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Menu,
  X,
  LogOut,
  LogIn,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./Redux/authSlice";
import { useSendPaymentLogoutMutation } from "./Redux/api/privateApiSlice";
import { purgePersistedState } from "./Redux/store";
import { useGetHeaderQuery } from "./Redux/api/publicApiSlice";
import { getImagePath } from "./utils/assetHelper";

// ✅ Route mapping — API titles ke exact match
const getRoutePath = (title) => {
  const routeMap = {
    Home: "/",
    "Alt Database": "/AltDatabaseMain",
    Altdb: "/Altdbmain",
    AltDB: "/Altdbmain",
    Research: "/Researchpage",
    "About Us": "/Aboutmain",
    Contact: "/Contactmain",
    Levels: "/Levelmain",
    Commentary: "/ArticlePage",
    "Partner Directory": "/PartnerDirectory",
    "Partner Page": "/FieraRealEstate",
  };
  return routeMap[title] || `/${title.toLowerCase().replace(/\s+/g, "")}`;
};

export default function Header({ onUserClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sendLogout, { isLoading: isLoggingOut }] =
    useSendPaymentLogoutMutation();

  // Fetch header data from API
  const { data: headerData } = useGetHeaderQuery();

  const { email } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);
  const headerRef = useRef(null);

  // Get menus from API
  const menus = headerData?.data?.menus || [];
  const logoUrl = headerData?.data?.logo || getImagePath("Header/Logo.png");

  // ✅ Home menu ko sabse pehle add karo (agar API me nahi hai)
  const homeMenu = { id: "home", title: "Home", sort_order: "-1" };
  const menusWithHome = menus.some(
    (m) => m.title?.toLowerCase() === "home"
  )
    ? menus
    : [homeMenu, ...menus];

  // User name formatting
  const userName = email
    ? email.split("@")[0].split(".")[0].charAt(0).toUpperCase() +
    email.split("@")[0].split(".")[0].slice(1)
    : "Guest";

  // User initials
  const userInitials = email
    ? email
      .split("@")[0]
      .split(".")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "G";

  // Nav class with hover underline animation
  const navClass = ({ isActive }) =>
    isActive
      ? "text-[#0760F0] font-semibold relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#0760F0] after:transition-all after:duration-300"
      : "text-gray-700 hover:text-[#0760F0] transition-colors duration-300 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#0760F0] after:transition-all after:duration-300 hover:after:w-full";

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await sendLogout().unwrap();
    } catch (error) {
      console.log("Logout API failed, clearing locally");
    } finally {
      dispatch(logout());
      purgePersistedState();
      setShowProfileMenu(false);
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    if (email) {
      setShowProfileMenu((prev) => !prev);
    } else {
      onUserClick?.();
    }
  };


  // Sort menus by sort_order (Home sabse pehle rahega)
  const sortedMenus = [...menusWithHome].sort((a, b) => {
    const orderA = parseInt(a.sort_order) || 0;
    const orderB = parseInt(b.sort_order) || 0;
    return orderA - orderB;
  });

  return (
    <>
      <header
        ref={headerRef}
        className={`w-full sticky top-0 z-50 font-ubuntu transition-all duration-500
          ${isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20"
            : "bg-white/70 backdrop-blur-sm shadow-sm"
          }`}
      >
        <div className="max-w-[1300px] mx-auto px-3 sm:px-5">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-2">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0 group"
            >
              <img
                src={logoUrl}
                alt="AltDB"
                className="h-9 sm:h-12 lg:h-14 object-contain transition-all duration-500 group-hover:scale-105 group-hover:rotate-[-2deg]"
                onError={(e) => {
                  e.target.src = "/placeholder-logo.png";
                  console.warn("Logo not found, using fallback");
                }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-nowrap whitespace-nowrap mx-2 xl:mx-4 font-roboto">
              {sortedMenus.map((menu, index) => {
                const route = getRoutePath(menu.title);
                const isHome = route === "/";

                return (
                  <NavLink
                    key={menu.id || index}
                    to={route}
                    end={isHome}
                    className={({ isActive }) => `
                      ${isActive
                        ? "text-[#0760F0] bg-blue-50/80 backdrop-blur-sm"
                        : "text-gray-700 hover:bg-white/50 hover:backdrop-blur-sm"
                      }
                      px-2 xl:px-3 py-1.5 rounded-lg text-[13px] xl:text-sm font-medium
                      transition-all duration-300 relative whitespace-nowrap flex-shrink-0
                      ${navClass({ isActive })}
                    `}
                  >
                    <span>{menu.title}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Section */}
            <div
              className="flex items-center gap-2 sm:gap-3 relative cursor-pointer flex-shrink-0"
              ref={profileRef}
            >
              <button
                onClick={handleProfileClick}
                className={`hidden sm:flex items-center gap-2 cursor-pointer px-3 sm:px-4 py-2 rounded-full 
                  backdrop-blur-sm transition-all duration-300 group
                  ${email
                    ? "border border-blue-200/50 bg-blue-50/60 hover:bg-blue-100/80 hover:backdrop-blur-md"
                    : "border border-gray-200/50 bg-white/60 hover:bg-white/90 hover:backdrop-blur-md"
                  }
                  ${isScrolled ? "shadow-md" : "shadow-sm"}`}
              >
                {email ? (
                  <>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center cursor-pointer justify-center text-white text-xs font-bold shadow-md">
                      {userInitials}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                      {userName}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-all duration-300 
                      ${showProfileMenu ? "rotate-180" : ""}`}
                    />
                  </>
                ) : (
                  <>
                    <div className="w-7 h-7 rounded-full cursor-pointer bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Guest
                    </span>
                  </>
                )}
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && email && (
                <div className="absolute right-0 top-12 w-72 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-50 animate-slideDown">
                  <div className="px-5 py-4 border-b border-gray-100/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {userInitials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition-all duration-300
                      ${isLoggingOut
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:bg-red-50/80 hover:backdrop-blur-sm hover:gap-4"
                      }`}
                  >
                    {isLoggingOut ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-gray-500"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Logging out...
                      </span>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Mobile Toggle */}
              <button
                className={`lg:hidden p-2 rounded-lg transition-all duration-300 relative
                  ${isScrolled
                    ? "bg-white/50 backdrop-blur-sm hover:bg-white/80"
                    : "hover:bg-gray-100/50"
                  }`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
                {!isOpen && !email && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed top-16 lg:top-20 left-0 w-full h-[calc(100vh-4rem)] bg-white/80 backdrop-blur-xl z-40 
          transform transition-all duration-500 ease-in-out
          ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-6 py-4">
            {/* User Section */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-xl mb-4 border border-white/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                {email ? userInitials : "G"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {email ? userName : "Guest User"}
                </p>
                {email && (
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                )}
                {!email && (
                  <p className="text-xs text-gray-500">
                    Sign in for more features
                  </p>
                )}
              </div>
              {!email && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onUserClick?.();
                  }}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {sortedMenus.map((menu, index) => {
                const route = getRoutePath(menu.title);
                const isHome = route === "/";

                return (
                  <NavLink
                    key={menu.id || index}
                    to={route}
                    end={isHome}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl backdrop-blur-sm transition-all duration-300 group relative ${isActive
                        ? "bg-white/60 text-[#0760F0]"
                        : "hover:bg-white/50 text-gray-700"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`text-sm font-medium transition-colors ${isActive
                              ? "text-[#0760F0]"
                              : "text-gray-700 group-hover:text-[#0760F0]"
                            }`}
                        >
                          {menu.title}
                        </span>
                        <span className="ml-auto text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                          →
                        </span>
                        <span
                          className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#0760F0] to-purple-500 transition-transform duration-300 origin-left ${isActive
                              ? "scale-x-100"
                              : "scale-x-0 group-hover:scale-x-100"
                            }`}
                        ></span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100/50">
              {email ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl backdrop-blur-sm
                    ${isLoggingOut
                      ? "bg-gray-100/50 text-gray-400"
                      : "bg-red-50/80 text-red-600 hover:bg-red-100/80"
                    } 
                    transition-all duration-300 font-medium text-sm border border-red-200/30`}
                >
                  {isLoggingOut ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onUserClick?.();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 text-sm font-medium hover:scale-[1.02]"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In / Register
                </button>
              )}
            </div>

            <div className="mt-4 text-center">
              <p className="text-[10px] text-gray-400/80 backdrop-blur-sm px-3 py-1 rounded-full bg-white/30 inline-block">
                v2.0.1 • © 2026 AltDB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .backdrop-blur-md {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </>
  );
}