import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  useGetAssetClassesQuery,
  useGetCategoriesQuery,
  useGetStrategiesQuery,
  useGetTypesQuery,
  useGetFundQuery,
  useFilterFundsQuery,
  useGetPageQuery,
} from "../../Redux/api/publicApiSlice";

import { useSendGetSubscriptionMutation } from "../../Redux/api/privateApiSlice";

import FundPerformance from "./FundPerformance";
import { CustomSelect } from "./CustomSelect";

import {
  TrendingUp,
  TrendingDown,
  Filter,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Lock,
  X,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Info,
  Mail,
} from "lucide-react";
import LoginAuth from "../Authscreens/LoginAuth";

// =========================================================
// CONSTANTS
// =========================================================

const ITEMS_PER_PAGE = 15;
const HEADER_HEIGHT = 66;
const POPUP_WIDTH = 320;
const PAGE_SLUG = "alt_database";
const POPPINS = "'Poppins', sans-serif";

const FREE_COLUMNS = new Set([
  "Symbol Code",
  "Fund Name",
  "Asset Class",
  "Type",
  "Strategy",
  "CIFSC Category",
]);

const BASE_COLUMNS = [
  "Symbol Code",
  "Fund Name",
  "Asset Class",
  "Type",
  "Strategy",
  "CIFSC Category",
  "1 Month",
  "YTD",
  "1 Year",
  "3 Years",
  "Since Inception",
  "3 Year Std Dev",
  "Distribution Yield",
  "Risk Rating",
  "Inception Date",
  "Fund AUM",
  "Firm AUM",
  "Fund Library Link",
  "External Link",
  "Overall Rating",
];

const NUMERIC_SORT_KEYS = {
  "1 Month": "rawOneMonth",
  YTD: "rawYtd",
  "1 Year": "rawOneYear",
  "3 Years": "rawThreeYears",
  "Since Inception": "rawSinceInception",
  "3 Year Std Dev": "rawThreeYearStdDev",
  "Distribution Yield": "rawDistributionYield",
};

const TEXT_SORT_KEYS = {
  "Symbol Code": "symbol",
  "Fund Name": "fundName",
  "Asset Class": "assetClass",
  Type: "type",
  Strategy: "strategy",
  "CIFSC Category": "cifscCategory",
  "Risk Rating": "riskRating",
  "Inception Date": "inceptionDate",
  "Fund AUM": "fundAum",
  "Firm AUM": "firmAum",
  "Overall Rating": "overallRating",
};

const NUMERIC_COLUMNS = [
  "1 Month",
  "YTD",
  "1 Year",
  "3 Years",
  "Since Inception",
  "3 Year Std Dev",
  "Distribution Yield",
  "Fund AUM",
  "Firm AUM",
  "Overall Rating",
];

const TEXT_COLUMNS = [
  "Symbol Code",
  "Fund Name",
  "Asset Class",
  "Type",
  "Strategy",
  "CIFSC Category",
  "Risk Rating",
  "Inception Date",
  "Fund Library Link",
  "External Link",
];

const GROUP_STYLES = {
  identity: { backgroundColor: "#5FB3CE" },
  classification: { backgroundColor: "#8BCF6A" },
  performance: { backgroundColor: "#E6A57A" },
  extra: { backgroundColor: "#D86DCD" },
  rating: { backgroundColor: "#D2D2D2" },
};

// =========================================================
// HELPERS
// =========================================================

const formatPercentValue = (value) => {
  if (value === null || value === undefined) return "N/A";

  if (typeof value === "string") {
    const trimmed = value.trim();
    const lower = trimmed.toLowerCase();

    if (
      trimmed === "" ||
      lower === "null" ||
      lower === "undefined" ||
      lower === "nan"
    ) {
      return "N/A";
    }

    if (Number.isNaN(Number(trimmed))) return "N/A";
    return `${trimmed}%`;
  }

  if (Number.isNaN(Number(value))) return "N/A";
  return `${value}%`;
};

const formatPlainValue = (value) => {
  if (value === null || value === undefined) return "N/A";

  if (typeof value === "string") {
    const trimmed = value.trim();
    const lower = trimmed.toLowerCase();

    if (trimmed === "" || lower === "null" || lower === "undefined") {
      return "N/A";
    }

    return trimmed;
  }

  return value;
};

const parseRaw = (value) =>
  value !== null && value !== undefined && value !== ""
    ? parseFloat(value)
    : null;

const getColumnGroup = (column) => {
  if (["Symbol Code", "Fund Name"].includes(column)) return "identity";

  if (["Asset Class", "Type", "Strategy", "CIFSC Category"].includes(column)) {
    return "classification";
  }

  if (
    [
      "1 Month",
      "YTD",
      "1 Year",
      "3 Years",
      "Since Inception",
      "3 Year Std Dev",
    ].includes(column)
  ) {
    return "performance";
  }

  if (
    [
      "Distribution Yield",
      "Inception Date",
      "Fund AUM",
      "Firm AUM",
      "Risk Rating",
      "Fund Library Link",
      "External Link",
    ].includes(column)
  ) {
    return "extra";
  }

  return "rating";
};

const columnHeaderStyle = (column) =>
  GROUP_STYLES[getColumnGroup(column)] || GROUP_STYLES.rating;

const isNumericColumn = (column) => NUMERIC_COLUMNS.includes(column);
const isTextColumn = (column) => TEXT_COLUMNS.includes(column);

const sortData = (data, sortKey, direction) => {
  if (!sortKey) return data;

  const sorted = [...data];

  sorted.sort((a, b) => {
    let aVal;
    let bVal;

    if (NUMERIC_SORT_KEYS[sortKey]) {
      const rawKey = NUMERIC_SORT_KEYS[sortKey];
      aVal = a[rawKey] !== undefined && a[rawKey] !== null ? a[rawKey] : null;
      bVal = b[rawKey] !== undefined && b[rawKey] !== null ? b[rawKey] : null;

      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
    } else {
      const dataKey = TEXT_SORT_KEYS[sortKey];
      aVal =
        a[dataKey] !== undefined && a[dataKey] !== null
          ? a[dataKey].toString().toLowerCase()
          : "";
      bVal =
        b[dataKey] !== undefined && b[dataKey] !== null
          ? b[dataKey].toString().toLowerCase()
          : "";
    }

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
};

// =========================================================
// COMPONENT
// =========================================================

const AltDBOverview = () => {
  const { email } = useSelector((state) => state.auth);
  const isLoggedIn = !!email;
  const isGuest = !isLoggedIn;

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [assetClassId, setAssetClassId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [strategyId, setStrategyId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [selectedFund, setSelectedFund] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const location = useLocation();
  const { symbolCode } = location.state || {};
  const [activeSymbol, setActiveSymbol] = useState(symbolCode || null);

  const filtersRef = useRef(null);
  const headerRef = useRef(null);
  const scrollRef = useRef(null);
  const lastFreeThRef = useRef(null);

  const [view, setView] = useState({
    scrollLeft: 0,
    clientWidth: 0,
    freeEnd: 0,
  });

  // =========================================================
  // LOGIN EVENT
  // =========================================================

  useEffect(() => {
    const handleOpenLogin = () => setIsLoginModalOpen(true);
    window.addEventListener("openLoginModal", handleOpenLogin);
    return () => window.removeEventListener("openLoginModal", handleOpenLogin);
  }, []);

  // =========================================================
  // PAGE CONTENT
  // =========================================================

  const { data: pageData, isLoading: pageLoading } = useGetPageQuery(PAGE_SLUG);
  const pageContent = pageData?.data;

  const visibleSections = useMemo(() => {
    return (pageContent?.sections ?? []).filter(
      (section) =>
        section &&
        ((section.data && section.data.trim() !== "") ||
          (section.images && section.images.length > 0))
    );
  }, [pageContent]);

  // =========================================================
  // API HOOKS
  // =========================================================

  const { data: assetData, isLoading: assetLoading } = useGetAssetClassesQuery();
  const { data: typeData, isLoading: typeLoading } = useGetTypesQuery();
  const { data: strategyData, isLoading: strategyLoading } = useGetStrategiesQuery();
  const { data: categoryData, isLoading: categoryLoading } = useGetCategoriesQuery();

  const anyFilterSelected = Boolean(assetClassId || typeId || strategyId || categoryId);

  // =========================================================
  // SUBSCRIPTION
  // =========================================================

  const [getSubscriptions, { data: subscriptionResp }] =
    useSendGetSubscriptionMutation();

  useEffect(() => {
    if (isLoggedIn) getSubscriptions();
  }, [getSubscriptions, isLoggedIn]);

  const hasActiveSubscription = useMemo(() => {
    if (!subscriptionResp?.data) return false;
    const today = new Date();

    return subscriptionResp.data.some((sub) => {
      if (!sub.is_active) return false;
      const start = new Date(sub.start_date);
      const end = new Date(sub.end_date);
      return today >= start && today <= end;
    });
  }, [subscriptionResp]);

  // =========================================================
  // FUNDS
  // =========================================================

  const filterParams = useMemo(
    () => ({
      asset_class_id: assetClassId || undefined,
      category_id: categoryId || undefined,
      type_id: typeId || undefined,
      strategy_id: strategyId || undefined,
    }),
    [assetClassId, typeId, strategyId, categoryId]
  );

  const {
    data: allFundsResp,
    isLoading: allFundsLoading,
    isFetching: allFundsFetching,
  } = useGetFundQuery(undefined, { skip: anyFilterSelected });

  const {
    data: filteredResp,
    isLoading: filteredLoading,
    isFetching: filteredFetching,
  } = useFilterFundsQuery(filterParams, { skip: !anyFilterSelected });

  const fundsResp = anyFilterSelected ? filteredResp : allFundsResp;
  const fundsLoading = anyFilterSelected
    ? filteredLoading || filteredFetching
    : allFundsLoading || allFundsFetching;

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const apiOptions = useMemo(() => {
    const getOptions = (apiData) =>
      (apiData?.data ?? [])
        .filter((item) => String(item.status) === "1")
        .map((item) => ({ id: item.id, name: item.name }));

    return {
      assetClass: getOptions(assetData),
      type: getOptions(typeData),
      strategy: getOptions(strategyData),
      cifscCategory: getOptions(categoryData),
    };
  }, [assetData, typeData, strategyData, categoryData]);

  // =========================================================
  // DATA PROCESSING
  // =========================================================

  const allData = useMemo(() => {
    return (fundsResp?.data ?? []).map((fund) => ({
      id: fund.id,
      symbol: formatPlainValue(fund.symbol_code),
      fundName: formatPlainValue(fund.fund_name),
      asOfMonth: formatPlainValue(fund.as_of_month),
      fundLibraryLink: formatPlainValue(fund.fund_library_link),
      externalLink: formatPlainValue(fund.external_link),
      sinceInception: formatPercentValue(fund.since_inception),
      distributionYield: formatPercentValue(fund.distribution_yield),
      inceptionDate: formatPlainValue(fund.inception_date),
      assetClass: formatPlainValue(fund.asset_class?.name),
      type: formatPlainValue(fund.type?.name),
      strategy: formatPlainValue(fund.strategy?.name),
      cifscCategory: formatPlainValue(fund.category?.name),
      riskRating: formatPlainValue(fund.risk_rating?.name),
      oneMonth: formatPercentValue(fund.one_month),
      ytd: formatPercentValue(fund.ytd),
      oneYear: formatPercentValue(fund.one_year),
      threeYears: formatPercentValue(fund.three_year),
      threeYearStdDev: formatPercentValue(fund.three_year_std_dev),
      fundAum: formatPlainValue(fund.fund_aum),
      firmAum: formatPlainValue(fund.firm?.firm_aum),
      raw: fund,
      rawOneMonth: parseRaw(fund.one_month),
      rawYtd: parseRaw(fund.ytd),
      rawOneYear: parseRaw(fund.one_year),
      rawThreeYears: parseRaw(fund.three_year),
      rawSinceInception: parseRaw(fund.since_inception),
      rawThreeYearStdDev: parseRaw(fund.three_year_std_dev),
      rawDistributionYield: parseRaw(fund.distribution_yield),
    }));
  }, [fundsResp]);

  // =========================================================
  // SORTED DATA
  // =========================================================

  const displayedData = useMemo(() => {
    if (sortConfig.key) return sortData(allData, sortConfig.key, sortConfig.direction);
    return allData;
  }, [allData, sortConfig]);

  // =========================================================
  // PAGINATION
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [assetClassId, typeId, strategyId, categoryId, sortConfig]);

  const totalRecords = displayedData.length;
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / ITEMS_PER_PAGE) : 1;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = useMemo(
    () => displayedData.slice(startIndex, endIndex),
    [displayedData, startIndex, endIndex]
  );
  const startRecord = totalRecords === 0 ? 0 : startIndex + 1;
  const endRecord = Math.min(endIndex, totalRecords);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    if (typeof page !== "number" || page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  const goPrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };
  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  // =========================================================
  // SORT HANDLER
  // =========================================================

  const handleSort = (column) => {
    setSortConfig((prev) => {
      if (prev.key === column) {
        return { key: column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key: column, direction: "asc" };
    });
  };

  const getSortIndicator = (column) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  // =========================================================
  // AUTO OPEN FROM SCREENER
  // =========================================================

  useEffect(() => {
    if (symbolCode && allData.length > 0 && isLoggedIn) {
      setActiveSymbol(symbolCode);
      setIsLoading(true);

      const matchingFund = allData.find((fund) => fund.symbol === symbolCode);
      const index = allData.findIndex((fund) => fund.symbol === symbolCode);
      if (index !== -1) {
        setActiveRowIndex(index);
        setCurrentPage(Math.floor(index / ITEMS_PER_PAGE) + 1);
      }

      const scrollTimer = setTimeout(() => {
        if (filtersRef.current) {
          filtersRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);

      const modalTimer = setTimeout(() => {
        if (matchingFund) {
          setSelectedFund(matchingFund.raw);
          setIsModalOpen(true);
        }
        setIsLoading(false);
      }, 2000);

      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(modalTimer);
      };
    }
    setIsLoading(false);
  }, [symbolCode, allData, isLoggedIn]);

  // =========================================================
  // VISIBLE COLUMNS
  // =========================================================

  const visibleColumns = useMemo(() => {
    const always = new Set([
      "Overall Rating",
      "3 Years",
      "3 Year Std Dev",
      "1 Year",
      "1 Month",
      "YTD",
      "Since Inception",
      "Fund AUM",
      "Firm AUM",
      "Distribution Yield",
      "Inception Date",
    ]);

    return BASE_COLUMNS.filter((column) => {
      if (always.has(column)) return true;
      return displayedData.some((row) => {
        const map = {
          "Symbol Code": row.symbol,
          "Fund Name": row.fundName,
          "Asset Class": row.assetClass,
          Type: row.type,
          Strategy: row.strategy,
          "CIFSC Category": row.cifscCategory,
          "Risk Rating": row.riskRating,
          "Fund Library Link": row.fundLibraryLink,
          "External Link": row.externalLink,
        };
        const value = map[column];
        return (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== "N/A" &&
          String(value).trim() !== ""
        );
      });
    });
  }, [displayedData]);

  const lastFreeColumn = useMemo(() => {
    const free = visibleColumns.filter((column) => FREE_COLUMNS.has(column));
    return free.length ? free[free.length - 1] : null;
  }, [visibleColumns]);

  // =========================================================
  // OVERLAY MEASURE
  // =========================================================

  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const th = lastFreeThRef.current;
    setView({
      scrollLeft: el.scrollLeft,
      clientWidth: el.clientWidth,
      freeEnd: th ? th.offsetLeft + th.offsetWidth : 0,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, visibleColumns, paginatedData.length, fundsLoading]);

  const regionLeft = Math.max(view.freeEnd - view.scrollLeft, 0);
  const regionWidth = view.clientWidth - regionLeft;
  const popupLeft = Math.min(
    Math.max(regionLeft + regionWidth / 2 - POPUP_WIDTH / 2, 0),
    Math.max(view.clientWidth - POPUP_WIDTH, 0)
  );
  const showPopup =
    isGuest &&
    !fundsLoading &&
    paginatedData.length > 0 &&
    view.clientWidth > 0 &&
    regionWidth > 60;

  // =========================================================
  // FILTER HANDLER
  // =========================================================

  const handleFilterChange = (setter) => (value) => setter(value);

  // =========================================================
  // CELL CONTENT
  // =========================================================

  const renderCellContent = (item, column) => {
    if (column === "Overall Rating") {
      const rating = item.raw?.overall_rating ?? item.raw?.rating;
      const lockedIcon = (
        <div className="flex justify-center items-center">
          <Link to="/Levelmain">
            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <Lock className="w-3 h-3 opacity-60" />
            </div>
          </Link>
        </div>
      );

      if (hasActiveSubscription) {
        if (rating === null || rating === undefined || rating === "" || rating === "N/A") {
          return lockedIcon;
        }
        return (
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-200">
              {rating}
            </span>
          </div>
        );
      }
      return lockedIcon;
    }

    if (column === "Fund Library Link" || column === "External Link") {
      const link = column === "Fund Library Link" ? item.fundLibraryLink : item.externalLink;
      if (!link || link === "N/A") {
        return <span className="text-gray-400 text-[11px]">N/A</span>;
      }
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150"
        >
          <ExternalLink className="w-3 h-3" />
          {column === "Fund Library Link" ? "Open" : "Visit"}
        </a>
      );
    }

    const plainMap = {
      "Distribution Yield": item.distributionYield,
      "Inception Date": item.inceptionDate,
      "Fund AUM": item.fundAum,
      "Firm AUM": item.firmAum,
    };
    if (column in plainMap) {
      return (
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[12px]">
          {plainMap[column]}
        </span>
      );
    }

    const performanceMap = {
      "1 Month": item.oneMonth,
      YTD: item.ytd,
      "1 Year": item.oneYear,
      "3 Years": item.threeYears,
      "Since Inception": item.sinceInception,
    };
    if (column in performanceMap) {
      const val = performanceMap[column];
      const numVal = parseFloat(val);
      const isPositive = !Number.isNaN(numVal) && numVal > 0;
      const isNegative = !Number.isNaN(numVal) && numVal < 0;

      return (
        <span
          className={`font-medium tabular-nums text-[12px] ${
            isPositive ? "text-emerald-600" : isNegative ? "text-red-500" : "text-gray-500"
          }`}
        >
          {isPositive && <TrendingUp className="w-3 h-3 inline mr-0.5" />}
          {isNegative && <TrendingDown className="w-3 h-3 inline mr-0.5" />}
          {val}
        </span>
      );
    }

    const map = {
      "Symbol Code": item.symbol,
      "Fund Name": item.fundName,
      "Asset Class": item.assetClass,
      Type: item.type,
      Strategy: item.strategy,
      "CIFSC Category": item.cifscCategory,
      "Risk Rating": item.riskRating,
      "3 Year Std Dev": item.threeYearStdDev,
    };
    return map[column] ?? "";
  };

  // =========================================================
  // CELL CLICK
  // =========================================================

  const handleCellClick = (item, index) => {
    // Do not open fund details when fund_performance is null.
    if (!item.raw?.fund_performance) return;
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setActiveRowIndex(index);
    setActiveSymbol(item.symbol);
    setIsLoading(true);
    setTimeout(() => {
      setSelectedFund(item.raw ?? item);
      setIsModalOpen(true);
      setIsLoading(false);
    }, 2000);
  };

  // =========================================================
  // MODAL / LOGIN
  // =========================================================

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFund(null);
    setIsLoading(false);
  };
  const handleLoginClick = () => setIsLoginModalOpen(true);
  const handleLoginClose = () => setIsLoginModalOpen(false);

  // =========================================================
  // MAIN
  // =========================================================

  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-6 md:py-10 px-4 md:px-6 lg:px-16"
        style={{ fontFamily: POPPINS }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* ==================== HEADER ==================== */}
          <div
            ref={headerRef}
            className="flex flex-col items-center justify-center text-center mb-6 md:mb-8"
          >
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1 mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span
                className="text-[11px] font-semibold text-blue-600 uppercase"
                style={{ fontFamily: POPPINS, letterSpacing: "0.08em" }}
              >
                Alternative Investments
              </span>
            </div>

            <h1
              className="text-[22px] md:text-[28px] lg:text-[34px] font-bold text-gray-900 tracking-tight mb-3 text-center leading-tight"
              style={{ fontFamily: POPPINS, fontWeight: 700 }}
            >
              AltDB{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                Overview
              </span>
            </h1>

            <div className="w-14 h-[3px] rounded-full bg-gradient-to-r from-blue-600 to-teal-500 mb-4" />

            <p
              className="max-w-xl mx-auto text-[13px] md:text-[14px] text-gray-500 leading-snug text-center"
              style={{ fontFamily: POPPINS, fontWeight: 400 }}
            >
              Explore and filter alternative investment funds by asset class,
              strategy, and performance. Click any fund name to view detailed
              analytics.
            </p>

            <div className="mt-3 inline-flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-full px-4 py-1.5 shadow-sm text-[11px] text-gray-500">
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Positive returns in green
              </span>
              <span className="w-px h-3 bg-gray-200" />
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Negative returns in red
              </span>
            </div>
          </div>

          {/* ==================== USER GUIDE ==================== */}
          {pageLoading ? (
            <div className="max-w-5xl mx-auto mb-8 md:mb-12 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-blue-100" />
                <div className="flex-1">
                  <div className="mb-2 h-3 w-24 animate-pulse rounded bg-slate-200" />
                  <div className="h-5 w-48 max-w-full animate-pulse rounded bg-slate-200" />
                </div>
              </div>
              <div className="mb-3 h-3 w-full animate-pulse rounded bg-slate-100" />
              <div className="mb-3 h-3 w-11/12 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
            </div>
          ) : visibleSections.length > 0 ? (
            <div className="max-w-5xl mx-auto mb-8 md:mb-12 grid grid-cols-1 gap-4">
              {visibleSections.map((section, index) => (
                <section
                  key={index}
                  className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400" />

                  {(section.label || section.heading) && (
                    <div className="flex items-start gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-white to-teal-50/60 px-4 py-4 md:px-6 md:py-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-white text-blue-600 shadow-sm">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                            Screener Guide
                          </span>
                          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                            Quick Read
                          </span>
                        </div>
                        <h3
                          className="text-base font-bold leading-snug text-slate-900 md:text-lg"
                          style={{ fontFamily: POPPINS, fontWeight: 700 }}
                        >
                          {section.heading || section.label}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 md:text-[13px]">
                          Explore the details and learn more with this quick guide.
                        </p>
                      </div>
                    </div>
                  )}

                  {section.data && section.data.trim() !== "" && (
                    <div className="px-4 py-4 md:px-6 md:py-5">
                      <div
                        className="prose prose-sm max-w-none text-left text-[13px] text-slate-600 prose-p:mb-3 prose-p:leading-7 prose-p:last:mb-0 prose-strong:font-semibold prose-strong:text-slate-800 prose-a:font-medium prose-a:text-blue-600 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-blue-800 prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5 prose-li:my-1 md:text-sm"
                        style={{ fontFamily: POPPINS }}
                        dangerouslySetInnerHTML={{ __html: section.data }}
                      />
                    </div>
                  )}

                  {section.images?.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 px-4 pb-4 sm:grid-cols-2 md:px-6 md:pb-5 lg:grid-cols-3">
                      {section.images.map((img, imgIndex) => {
                        const src = typeof img === "string" ? img : img?.url || img?.src;
                        if (!src) return null;
                        return (
                          <div
                            key={imgIndex}
                            className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-shadow duration-200 hover:shadow-sm"
                          >
                            <img
                              src={src}
                              alt={
                                (typeof img === "object" && img?.alt) ||
                                `${section.heading || section.label || "Guide"} image ${imgIndex + 1}`
                              }
                              className="h-auto w-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              ))}
            </div>
          ) : null}

          {/* ==================== FILTERS ==================== */}
          <div ref={filtersRef} className="mb-6 scroll-mt-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center gap-2 mb-3.5">
                <div className="p-1.5 rounded-lg bg-slate-100">
                  <Filter className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <h2
                  className="text-[12px] font-semibold text-gray-700 uppercase"
                  style={{ fontFamily: POPPINS, fontWeight: 600, letterSpacing: "0.06em" }}
                >
                  Filter Funds
                </h2>
                {anyFilterSelected && (
                  <span
                    className="ml-auto text-[11px] text-blue-600 font-medium bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100"
                    style={{ fontFamily: POPPINS }}
                  >
                    {totalRecords} results
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <CustomSelect
                  label="Asset Class"
                  value={assetClassId}
                  onChange={handleFilterChange(setAssetClassId)}
                  options={apiOptions.assetClass}
                  loading={assetLoading}
                />
                <CustomSelect
                  label="Type"
                  value={typeId}
                  onChange={handleFilterChange(setTypeId)}
                  options={apiOptions.type}
                  loading={typeLoading}
                />
                <CustomSelect
                  label="Strategy"
                  value={strategyId}
                  onChange={handleFilterChange(setStrategyId)}
                  options={apiOptions.strategy}
                  loading={strategyLoading}
                />
                <CustomSelect
                  label="CIFSC Category"
                  value={categoryId}
                  onChange={handleFilterChange(setCategoryId)}
                  options={apiOptions.cifscCategory}
                  loading={categoryLoading}
                />
              </div>
            </div>
          </div>

          {/* ==================== TABLE OUTER ==================== */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative transition-all duration-200 hover:shadow-md">
            {fundsLoading && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full" />
                    <Loader2 className="absolute top-0 left-0 w-16 h-16 text-blue-600 animate-spin" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[13px] font-semibold text-gray-700" style={{ fontFamily: POPPINS }}>
                      Loading Funds
                    </span>
                    <span className="text-[11px] text-gray-400" style={{ fontFamily: POPPINS }}>
                      Please wait...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TABLE VIEWPORT */}
            <div className="relative">
              <div
                ref={scrollRef}
                onScroll={measure}
                className="relative overflow-auto"
                style={{ height: "580px" }}
              >
                <table className="w-full min-w-[1400px] border-collapse text-[12px]" style={{ fontFamily: POPPINS }}>
                  <thead className="sticky top-0 z-30 bg-white">
                    <tr>
                      {visibleColumns.map((column, index) => {
                        const isSortable = column !== "Fund Library Link" && column !== "External Link";
                        const lockedForGuest = isGuest && !FREE_COLUMNS.has(column);

                        const onHeaderClick = () => {
                          if (!isSortable) return;
                          if (lockedForGuest) {
                            setIsLoginModalOpen(true);
                            return;
                          }
                          handleSort(column);
                        };

                        return (
                          <th
                            key={index}
                            ref={column === lastFreeColumn ? lastFreeThRef : null}
                            onClick={onHeaderClick}
                            className={`px-3 py-3 text-center text-[11px] font-bold border-r border-white/20 last:border-r-0 whitespace-nowrap select-none ${
                              isSortable ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
                            }`}
                            style={{
                              ...columnHeaderStyle(column),
                              fontFamily: POPPINS,
                              fontWeight: 700,
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                            }}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <span>{column}</span>
                              {isSortable && (
                                <span className="inline-flex flex-col items-center">
                                  {sortConfig.key === column ? (
                                    getSortIndicator(column)
                                  ) : (
                                    <span className="flex flex-col">
                                      <ArrowUp className="w-2.5 h-2.5 -mb-0.5" />
                                      <ArrowDown className="w-2.5 h-2.5 -mt-0.5" />
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {fundsLoading ? (
                      [...Array(10)].map((_, rowIndex) => (
                        <tr key={`loading-${rowIndex}`} className="animate-pulse">
                          {visibleColumns.map((_, colIndex) => (
                            <td key={colIndex} className="px-3 py-3 border-r border-gray-100">
                              <div className={`h-3.5 bg-gray-200 rounded ${colIndex === 1 ? "w-44" : "w-20"}`} />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : paginatedData.length === 0 ? (
                      <tr>
                        <td colSpan={visibleColumns.length} className="py-14 text-center text-gray-400">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="w-9 h-9 text-gray-200" />
                            <span className="text-[13px]" style={{ fontFamily: POPPINS }}>
                              No funds found
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedData.map((item, pageIndex) => {
                        const globalIndex = startIndex + pageIndex;
                        const isSelected = item.symbol === activeSymbol;
                        const hasPerformance = !!item.raw?.fund_performance;

                        return (
                          <tr
                            key={item.id ?? item.symbol ?? globalIndex}
                            className={`transition-colors duration-150 group ${
                              isSelected
                                ? "bg-amber-50 ring-1 ring-inset ring-amber-300"
                                : globalIndex % 2 === 0
                                ? "bg-white"
                                : "bg-slate-50/60"
                            } hover:bg-teal-50/70`}
                          >
                            {visibleColumns.map((column, colIndex) => {
                              const isFundName = column === "Fund Name";
                              const isSymbol = column === "Symbol Code";
                              const isOverall = column === "Overall Rating";
                              const isLinkColumn = column === "Fund Library Link" || column === "External Link";
                              const isNumeric = isNumericColumn(column);
                              const isText = isTextColumn(column);
                              const isBlurred = isGuest && !FREE_COLUMNS.has(column);

                              let textAlign = "text-center";
                              if (isText) textAlign = "text-left";
                              if (isNumeric) textAlign = "text-right";

                              return (
                                <td
                                  key={colIndex}
                                  onClick={isFundName && hasPerformance ? () => handleCellClick(item, globalIndex) : undefined}
                                  className={`px-3 py-2 text-[12px] border-r border-gray-100 last:border-r-0 whitespace-nowrap ${textAlign} ${
                                    isBlurred ? "blur-[5px] select-none pointer-events-none" : ""
                                  } ${isOverall ? "bg-white group-hover:bg-teal-50/70" : ""} ${
                                    isSymbol ? "font-bold tracking-wide text-gray-900" : ""
                                  } ${
                                    isFundName
                                      ? hasPerformance
                                        ? "text-blue-700 font-medium max-w-[220px] cursor-pointer hover:underline underline-offset-2 decoration-blue-300"
                                        : "text-gray-400 font-medium max-w-[220px] cursor-not-allowed"
                                      : ""
                                  } ${
                                    !isSymbol && !isFundName && !isOverall && !isLinkColumn ? "text-gray-700" : ""
                                  } ${isLinkColumn ? "text-center" : ""} ${isNumeric && !isOverall ? "tabular-nums" : ""}`}
                                >
                                  {isFundName ? (
                                    <div className="flex items-center gap-1.5 max-w-[220px]">
                                      <span className="truncate">{item.fundName}</span>
                                      {hasPerformance && (
                                        <ArrowUp className="w-3 h-3 shrink-0 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity rotate-90" />
                                      )}
                                    </div>
                                  ) : (
                                    renderCellContent(item, column)
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* SIGN IN POPUP */}
              {showPopup && (
                <div
                  className="absolute left-0 z-40 pointer-events-none"
                  style={{ top: `${HEADER_HEIGHT}px`, bottom: "16px", width: `${view.clientWidth}px` }}
                >
                  <div
                    className="absolute pointer-events-auto flex flex-col items-center justify-center px-6 py-5 rounded-2xl bg-white/95 border border-white shadow-2xl shadow-slate-900/20 backdrop-blur-md"
                    style={{
                      width: `${POPUP_WIDTH}px`,
                      left: `${popupLeft}px`,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontFamily: POPPINS,
                    }}
                  >
                    <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                      <Lock className="w-4.5 h-4.5 text-blue-600" />
                    </div>
                    <h3 className="text-[16px] sm:text-[17px] font-bold text-gray-900 mb-1" style={{ fontFamily: POPPINS, fontWeight: 700 }}>
                      Sign In to Continue
                    </h3>
                    <p className="text-[11px] sm:text-[12px] text-gray-500 leading-snug text-center mb-4 max-w-[260px]" style={{ fontFamily: POPPINS, fontWeight: 400 }}>
                      what happens next.
                    </p>
                    <button
                      type="button"
                      onClick={handleLoginClick}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[12px] font-semibold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl transition-all duration-200"
                      style={{ fontFamily: POPPINS, fontWeight: 600 }}
                    >
                      <span>Sign In to Continue</span>
                      <ArrowUp className="w-3.5 h-3.5 rotate-90" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* PAGINATION */}
            {!fundsLoading && totalRecords > 0 && (
              <div className="border-t border-gray-200 bg-white px-4 md:px-5 py-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="text-[11px] sm:text-[12px] text-gray-500" style={{ fontFamily: POPPINS }}>
                    Showing <span className="font-semibold text-gray-800">{startRecord}</span>{" "}
                    - <span className="font-semibold text-gray-800">{endRecord}</span>{" "}
                    of <span className="font-semibold text-gray-800">{totalRecords}</span> funds
                  </div>

                  <div className="flex items-center justify-end gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={goPrevious}
                      disabled={currentPage === 1}
                      className={`h-8 px-2.5 rounded-lg border inline-flex items-center justify-center gap-1 text-[11px] sm:text-[12px] font-medium transition-all ${
                        currentPage === 1
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600"
                      }`}
                      style={{ fontFamily: POPPINS }}
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>

                    <div className="flex items-center gap-0.5">
                      {pageNumbers.map((page, index) => {
                        if (page === "...") {
                          return (
                            <span key={`dots-${index}`} className="w-7 h-8 flex items-center justify-center text-gray-400 text-[11px]">
                              ...
                            </span>
                          );
                        }
                        const isActive = page === currentPage;
                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() => goToPage(page)}
                            className={`w-7 h-8 rounded-lg border text-[11px] font-semibold transition-all ${
                              isActive
                                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600"
                            }`}
                            style={{ fontFamily: POPPINS }}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={goNext}
                      disabled={currentPage === totalPages}
                      className={`h-8 px-2.5 rounded-lg border inline-flex items-center justify-center gap-1 text-[11px] sm:text-[12px] font-medium transition-all ${
                        currentPage === totalPages
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600"
                      }`}
                      style={{ fontFamily: POPPINS }}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end mt-1.5">
                  <span className="text-[10px] text-gray-400" style={{ fontFamily: POPPINS }}>
                    Page <span className="font-semibold text-gray-600">{currentPage}</span> of{" "}
                    <span className="font-semibold text-gray-600">{totalPages}</span>
                    <span className="mx-1.5">•</span>
                    {ITEMS_PER_PAGE} per page
                  </span>
                </div>
              </div>
            )}

            {/* SMALL FOOTER */}
            {!fundsLoading && totalRecords > 0 && (
              <div className="border-t border-gray-100 px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-1.5 bg-gray-50/80">
                <span className="text-[10px] text-gray-400" style={{ fontFamily: POPPINS }}>
                  {totalRecords} record{totalRecords !== 1 ? "s" : ""} total
                </span>
                <span className="text-[10px] text-gray-400" style={{ fontFamily: POPPINS }}>
                  Click on Fund Name to view details
                </span>
              </div>
            )}
          </div>

          {/* ==================== ALTDB NOTE ==================== */}
          <div className="mt-4 overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/80 via-white to-teal-50/70">
            <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-600 shadow-sm">
                <Info className="h-[18px] w-[18px]" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700">
                    Note
                  </span>
                  <span className="h-1 w-1 rounded-full bg-blue-300" />
                  <span className="text-[10px] font-medium text-slate-500">
                    Help us improve AltDB
                  </span>
                </div>
                <p className="text-[12px] leading-6 text-slate-600 sm:text-[13px]">
                  Are we missing an Alt Fund from a Canadian licensed investment fund company? Want to add a fund to AltDB? Email us with the fund name, fund company name, and the latest fact sheet, if available.
                </p>
                <a
                  href="mailto:info@altdb.ca"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md text-[12px] font-semibold text-blue-700 transition-colors hover:text-blue-900 hover:underline hover:underline-offset-4"
                >
                  <Mail className="h-3.5 w-3.5" />
                  info@altdb.ca
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            </div>
            <div className="h-[2px] bg-gradient-to-r from-blue-500/70 via-cyan-400/70 to-emerald-400/70" />
          </div>
        </div>
      </div>

      {/* ==================== FUND DETAILS MODAL ==================== */}
      {isModalOpen && selectedFund && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(8px)" }}
        >
          <div
            className="bg-white w-full md:w-[95%] lg:w-[85%] max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-scaleIn"
            style={{ fontFamily: POPPINS }}
          >
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm rounded-t-3xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-1.5 h-9 rounded-full bg-gradient-to-b from-blue-600 to-teal-400 shadow-lg shadow-blue-200" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase flex items-center gap-1.5" style={{ fontFamily: POPPINS, letterSpacing: "0.08em" }}>
                      <span className="inline-block w-1 h-1 rounded-full bg-blue-500" />
                      Fund Details
                    </p>
                    <h3 className="text-[15px] font-bold text-gray-800 mt-0.5" style={{ fontFamily: POPPINS, fontWeight: 700 }}>
                      {selectedFund?.fund_name ?? selectedFund?.fundName ?? "N/A"}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[11px] font-medium text-gray-500" style={{ fontFamily: POPPINS }}>
                        Category:
                      </span>
                      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full" style={{ fontFamily: POPPINS }}>
                        {selectedFund?.category?.name ?? selectedFund?.fundName ?? "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="group flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-gray-100 hover:bg-red-50 hover:scale-110 transition-all duration-300"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
                </button>
              </div>
            </div>
            <div className="px-4 sm:px-6 py-5">
              <FundPerformance fund={selectedFund} />
            </div>
          </div>
        </div>
      )}

      {/* LOGIN */}
      <LoginAuth isOpen={isLoginModalOpen} onClose={handleLoginClose} />
    </>
  );
};

export default AltDBOverview;
