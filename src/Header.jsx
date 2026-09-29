
import React, { useState, useRef, useEffect } from "react";

import {
  User,
  Menu,
  X,
  LogOut,
  LogIn,
  ChevronDown,
} from "lucide-react";

import { NavLink, Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

import { logout } from "./Redux/authSlice";

import { useSendPaymentLogoutMutation } from "./Redux/api/privateApiSlice";

import { purgePersistedState } from "./Redux/store";

import { useGetHeaderQuery } from "./Redux/api/publicApiSlice";

import { getImagePath } from "./utils/assetHelper";

/* =========================================================
   FONT FAMILY
========================================================= */

const FONT_FAMILY =
  "'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, 'Roboto', 'Helvetica Neue', sans-serif";

/* =========================================================
   COLORS
========================================================= */

const PRIMARY_COLOR = "#2A57C4";

/* =========================================================
   ROUTE MAPPING
========================================================= */

const getRoutePath = (title) => {
  const routeMap = {
    Home: "/",
    "Alt Database": "/Altdbmain",
    Altdb: "/Altdbmain",
    AltDB: "/Altdbmain",
    Research: "/Researchpage",
    "About Us": "/Aboutmain",
    Contact: "/Contactmain",
    Levels: "/Levelmain",
    Commentary: "/ArticlePage",
    "Partner Directory": "/PartnerDirectory",
    "Partner Page": "/FieraRealEstate",
    "Insight Investment": "/AlternativeInvestmentsPage",
    "Insights Investment": "/AlternativeInvestmentsPage",
    "Insights Investments": "/AlternativeInvestmentsPage",
    "Insight Reports": "/insightreports",
    "Alternative Investments": "/AlternativeInvestmentsPage",
  };

  return (
    routeMap[title] ||
    `/${title.toLowerCase().replace(/\s+/g, "")}`
  );
};

/* =========================================================
   HEADER COMPONENT
========================================================= */

export default function Header({ onUserClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sendLogout, { isLoading: isLoggingOut }] =
    useSendPaymentLogoutMutation();

  /* =========================================================
     FETCH HEADER DATA
  ========================================================= */

  const { data: headerData } = useGetHeaderQuery();

  const { email } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const profileRef = useRef(null);
  const headerRef = useRef(null);

  /* =========================================================
     GET HEADER MENUS
  ========================================================= */

  const menus = headerData?.data?.menus || [];

  const filteredMenus = menus.filter(
    (menu) => menu.title?.toLowerCase() !== "partner page"
  );

  /* =========================================================
     LOGO
  ========================================================= */

  const logoUrl =
    headerData?.data?.logo ||
    getImagePath("Header/Logo.png");

  /* =========================================================
     HOME MENU
  ========================================================= */

  const homeMenu = {
    id: "home",
    title: "Home",
    sort_order: "-1",
  };

  const menusWithHome = filteredMenus.some(
    (menu) => menu.title?.toLowerCase() === "home"
  )
    ? filteredMenus
    : [homeMenu, ...filteredMenus];

  /* =========================================================
     USER NAME
  ========================================================= */

  const userName = email
    ? email.split("@")[0].split(".")[0].charAt(0).toUpperCase() +
      email.split("@")[0].split(".")[0].slice(1)
    : "Guest";

  /* =========================================================
     USER INITIALS
  ========================================================= */

  const userInitials = email
    ? email
        .split("@")[0]
        .split(".")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "G";

  /* =========================================================
     SCROLL EFFECT
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================================
     CLICK OUTSIDE PROFILE MENU
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = async () => {
    try {
      await sendLogout().unwrap();
    } catch (error) {
      // API failure should not prevent local logout.
    } finally {
      dispatch(logout());
      purgePersistedState();

      setShowProfileMenu(false);
      setIsOpen(false);

      navigate("/");
    }
  };

  /* =========================================================
     PROFILE CLICK
  ========================================================= */

  const handleProfileClick = () => {
    if (email) {
      setShowProfileMenu((prev) => !prev);
    } else {
      onUserClick?.();
    }
  };

  /* =========================================================
     SORT MENUS
  ========================================================= */

  const sortedMenus = [...menusWithHome].sort((a, b) => {
    const orderA = parseInt(a.sort_order) || 0;
    const orderB = parseInt(b.sort_order) || 0;

    return orderA - orderB;
  });

  /* =========================================================
     NAVIGATION CLASS
     FONT WEIGHT = 400
  ========================================================= */

  const navClass = ({ isActive }) =>
    isActive
      ? [
          "relative",
          "text-[#2A57C4]",
          "font-[400]",
          "after:content-['']",
          "after:absolute",
          "after:left-0",
          "after:right-0",
          "after:-bottom-[3px]",
          "after:h-[1px]",
          "after:bg-[#2A57C4]",
        ].join(" ")
      : [
          "relative",
          "text-[#35445C]",
          "font-[400]",
          "transition-colors",
          "duration-200",
          "hover:text-[#2A57C4]",
          "after:content-['']",
          "after:absolute",
          "after:left-0",
          "after:right-0",
          "after:-bottom-[3px]",
          "after:h-[1px]",
          "after:bg-[#2A57C4]",
          "after:scale-x-0",
          "after:origin-left",
          "after:transition-transform",
          "after:duration-200",
          "hover:after:scale-x-100",
        ].join(" ");

  return (
    <>
      {/* =====================================================
          DESKTOP HEADER
      ===================================================== */}

      <header
        ref={headerRef}
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 400,
        }}
        className={[
          "sticky",
          "top-0",
          "z-50",
          "w-full",
          "bg-white",
          "border-b",
          "border-[#E7E7E7]",
          "transition-all",
          "duration-300",
          isScrolled ? "shadow-sm" : "",
        ].join(" ")}
      >
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              h-[64px]
              lg:h-[68px]
            "
          >
            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              className="
                flex
                items-center
                flex-shrink-0
                group
              "
            >
              <img
                src={logoUrl}
                alt="AltDB"
                className="
                  h-8
                  sm:h-9
                  lg:h-10
                  w-auto
                  object-contain
                  transition-transform
                  duration-200
                  group-hover:scale-[1.02]
                "
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src =
                    "/placeholder-logo.png";
                }}
              />
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <nav
              className="
                hidden
                lg:flex
                items-center
                justify-center
                flex-1
                min-w-0
                gap-1
                xl:gap-2
                whitespace-nowrap
                mx-4
              "
              aria-label="Main Navigation"
            >
              {sortedMenus.map((menu, index) => {
                const route = getRoutePath(menu.title);
                const isHome = route === "/";

                return (
                  <NavLink
                    key={menu.id || index}
                    to={route}
                    end={isHome}
                    className={({ isActive }) =>
                      [
                        "flex",
                        "items-center",
                        "relative",
                        "px-2",
                        "xl:px-3",
                        "py-2",
                        "text-[14px]",
                        "xl:text-[15px]",
                        "font-[400]",
                        "leading-none",
                        "whitespace-nowrap",
                        "transition-colors",
                        "duration-200",
                        navClass({ isActive }),
                      ].join(" ")
                    }
                  >
                    <span className="font-[400]">
                      {menu.title}
                    </span>
                  </NavLink>
                );
              })}
            </nav>

            {/* =================================================
                RIGHT SECTION
            ================================================= */}

            <div
              ref={profileRef}
              className="
                flex
                items-center
                gap-2
                sm:gap-3
                relative
                flex-shrink-0
              "
            >
              {/* =================================================
                  DESKTOP LOGIN / PROFILE
              ================================================= */}

              <button
                type="button"
                onClick={handleProfileClick}
                className="
                  hidden
                  sm:flex
                  items-center
                  justify-center
                  gap-1.5
                  cursor-pointer
                  h-[34px]
                  px-4
                  rounded-full
                  border
                  border-[#7FA2F1]
                  bg-white
                  text-[#2A57C4]
                  text-[13px]
                  font-[400]
                  leading-none
                  transition-colors
                  duration-200
                  hover:bg-[#F6F8FD]
                "
              >
                {email ? (
                  <>
                    <div
                      className="
                        w-6
                        h-6
                        rounded-full
                        bg-[#2A57C4]
                        flex
                        items-center
                        justify-center
                        text-white
                        text-[10px]
                        font-[400]
                      "
                    >
                      {userInitials}
                    </div>

                    <span className="max-w-[100px] truncate font-[400]">
                      {userName}
                    </span>

                    <ChevronDown
                      size={13}
                      strokeWidth={1.6}
                      className={[
                        "text-[#2A57C4]",
                        "transition-transform",
                        "duration-200",
                        showProfileMenu
                          ? "rotate-180"
                          : "",
                      ].join(" ")}
                    />
                  </>
                ) : (
                  <>
                    <User
                      size={14}
                      strokeWidth={1.7}
                      className="text-[#2A57C4]"
                    />

                    <span className="font-[400]">
                      Log In
                    </span>
                  </>
                )}
              </button>

              {/* =================================================
                  PROFILE DROPDOWN
              ================================================= */}

              {showProfileMenu && email && (
                <div
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontWeight: 400,
                  }}
                  className="
                    absolute
                    right-0
                    top-11
                    w-64
                    bg-white
                    border
                    border-[#E5E7EB]
                    rounded-lg
                    shadow-lg
                    z-[60]
                    overflow-hidden
                  "
                >
                  <div
                    className="
                      px-4
                      py-3
                      border-b
                      border-[#EEEEEE]
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          w-9
                          h-9
                          rounded-full
                          bg-[#2A57C4]
                          flex
                          items-center
                          justify-center
                          text-white
                          text-xs
                          font-[400]
                          flex-shrink-0
                        "
                      >
                        {userInitials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="
                            text-[13px]
                            font-[400]
                            text-[#2A57C4]
                            truncate
                          "
                        >
                          {userName}
                        </p>

                        <p
                          className="
                            text-[11px]
                            font-[400]
                            text-[#6B7280]
                            truncate
                            mt-0.5
                          "
                        >
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="
                      w-full
                      flex
                      items-center
                      gap-2
                      px-4
                      py-3
                      text-[12px]
                      text-red-600
                      font-[400]
                      transition-colors
                      duration-200
                      hover:bg-red-50
                      disabled:text-gray-400
                      disabled:cursor-not-allowed
                    "
                  >
                    {isLoggingOut ? (
                      <>
                        <svg
                          className="animate-spin h-3.5 w-3.5"
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

                        <span className="font-[400]">
                          Logging out...
                        </span>
                      </>
                    ) : (
                      <>
                        <LogOut
                          size={14}
                          strokeWidth={1.7}
                        />

                        <span className="font-[400]">
                          Sign Out
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* =================================================
                  MOBILE TOGGLE
              ================================================= */}

              <button
                type="button"
                className="
                  lg:hidden
                  flex
                  items-center
                  justify-center
                  w-9
                  h-9
                  rounded-md
                  text-[#2A57C4]
                  font-[400]
                  hover:bg-[#F5F6F8]
                  transition-colors
                  duration-200
                "
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                aria-expanded={isOpen}
              >
                {isOpen ? (
                  <X
                    size={19}
                    strokeWidth={1.7}
                  />
                ) : (
                  <Menu
                    size={19}
                    strokeWidth={1.7}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}

      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontWeight: 400,
        }}
        className={[
          "fixed",
          "top-[64px]",
          "left-0",
          "w-full",
          "h-[calc(100vh-64px)]",
          "bg-white",
          "border-b",
          "border-[#E7E7E7]",
          "shadow-md",
          "z-40",
          "lg:hidden",
          "transition-all",
          "duration-300",
          "ease-in-out",
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-5 py-4">
            {/* =================================================
                USER SECTION
            ================================================= */}

            <div
              className="
                flex
                items-center
                gap-3
                p-3
                bg-[#F7F9FC]
                rounded-lg
                mb-4
                border
                border-[#E8EDF5]
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-[#2A57C4]
                  flex
                  items-center
                  justify-center
                  text-white
                  text-sm
                  font-[400]
                  flex-shrink-0
                "
              >
                {email ? userInitials : "G"}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="
                    text-[14px]
                    font-[400]
                    text-[#2A57C4]
                  "
                >
                  {email ? userName : "Guest User"}
                </p>

                {email && (
                  <p
                    className="
                      text-[12px]
                      font-[400]
                      text-[#6B7280]
                      truncate
                      mt-0.5
                    "
                  >
                    {email}
                  </p>
                )}

                {!email && (
                  <p
                    className="
                      text-[12px]
                      font-[400]
                      text-[#6B7280]
                      mt-0.5
                    "
                  >
                    Sign in for more features
                  </p>
                )}
              </div>

              {!email && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onUserClick?.();
                  }}
                  className="
                    px-3
                    py-1.5
                    rounded-full
                    border
                    border-[#7FA2F1]
                    bg-white
                    text-[#2A57C4]
                    text-[12px]
                    font-[400]
                  "
                >
                  Sign In
                </button>
              )}
            </div>

            {/* =================================================
                MOBILE NAV LINKS
            ================================================= */}

            <nav className="flex flex-col">
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
                      [
                        "relative",
                        "flex",
                        "items-center",
                        "px-3",
                        "py-3.5",
                        "border-b",
                        "border-[#EEF0F3]",
                        "transition-colors",
                        "duration-200",
                        isActive
                          ? "text-[#2A57C4] font-[400]"
                          : "text-[#35445C] font-[400] hover:text-[#2A57C4]",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="text-[14px] font-[400]">
                          {menu.title}
                        </span>

                        <span
                          className="
                            ml-auto
                            text-[14px]
                            font-[400]
                            text-[#2A57C4]
                          "
                        >
                          →
                        </span>

                        <span
                          className={[
                            "absolute",
                            "bottom-0",
                            "left-3",
                            "w-10",
                            "h-[1px]",
                            "bg-[#2A57C4]",
                            "transition-transform",
                            "duration-200",
                            isActive
                              ? "scale-x-100"
                              : "scale-x-0",
                          ].join(" ")}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* =================================================
                BOTTOM ACTIONS
            ================================================= */}

            <div className="mt-5 pt-4 border-t border-[#E9ECEF]">
              {email ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  disabled={isLoggingOut}
                  className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-4
                    py-2.5
                    rounded-full
                    border
                    border-red-200
                    bg-white
                    text-red-600
                    text-[13px]
                    font-[400]
                    hover:bg-red-50
                    transition-colors
                    duration-200
                    disabled:text-gray-400
                  "
                >
                  {isLoggingOut ? (
                    <>
                      <svg
                        className="animate-spin h-3.5 w-3.5"
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

                      <span className="font-[400]">
                        Logging out...
                      </span>
                    </>
                  ) : (
                    <>
                      <LogOut
                        size={14}
                        strokeWidth={1.7}
                      />

                      <span className="font-[400]">
                        Sign Out
                      </span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onUserClick?.();
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-4
                    py-2.5
                    rounded-full
                    border
                    border-[#7FA2F1]
                    bg-white
                    text-[#2A57C4]
                    text-[13px]
                    font-[400]
                    hover:bg-[#F6F8FD]
                    transition-colors
                    duration-200
                  "
                >
                  <LogIn
                    size={14}
                    strokeWidth={1.7}
                  />

                  <span className="font-[400]">
                    Sign In / Register
                  </span>
                </button>
              )}
            </div>

            {/* =================================================
                VERSION
            ================================================= */}

            <div className="mt-4 text-center">
              <p
                className="
                  text-[10px]
                  font-[400]
                  text-[#9CA3AF]
                "
              >
                v2.0.1 • © 2026 AltDB
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

