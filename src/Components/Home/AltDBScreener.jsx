import React, { useEffect, useMemo, useState } from "react";
import {
  Lock,
  Filter,
  Loader2,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetAssetClassesQuery,
  useGetCategoriesQuery,
  useGetStrategiesQuery,
  useGetTypesQuery,
  useFilterFundsQuery,
  useGetFundQuery,
  useGetPageQuery,
} from "../../Redux/api/publicApiSlice";
import { CustomSelect } from "../Altdb/CustomSelect";

const AltDBScreener = () => {
  const navigate = useNavigate();
  const [loadingFund, setLoadingFund] = useState(null);

  // ==================== PAGINATION ====================
  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  // ==================== SORTING ====================
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // ==================== FILTERS ====================
  const [assetClassId, setAssetClassId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [strategyId, setStrategyId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // ==================== HOME USER GUIDE CONTENT ====================
  const { data: userGuideResponse, isLoading: userGuideLoading } =
    useGetPageQuery("home_user_guide");

  const userGuide = userGuideResponse?.data;

  // ==================== FILTER OPTIONS ====================
  const { data: assetData, isLoading: assetLoading } =
    useGetAssetClassesQuery();
  const { data: typeData, isLoading: typeLoading } = useGetTypesQuery();
  const { data: strategyData, isLoading: strategyLoading } =
    useGetStrategiesQuery();
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoriesQuery();

  const anyFilterSelected = Boolean(
    assetClassId || typeId || strategyId || categoryId
  );

  const filters = useMemo(() => {
    const obj = {};
    if (assetClassId) obj.asset_class_id = assetClassId;
    if (typeId) obj.type_id = typeId;
    if (strategyId) obj.strategy_id = strategyId;
    if (categoryId) obj.category_id = categoryId;
    return obj;
  }, [assetClassId, typeId, strategyId, categoryId]);

  // ==================== FILTERED FUNDS ====================
  const {
    data: filteredResponse,
    isLoading: filterLoading,
    isFetching: filterFetching,
  } = useFilterFundsQuery(filters, {
    skip: !anyFilterSelected,
  });

  // ==================== ALL FUNDS ====================
  const {
    data: allFundsResponse,
    isLoading: allLoading,
    isFetching: allFetching,
  } = useGetFundQuery(undefined, {
    skip: anyFilterSelected,
  });

  // ==================== FUNDS ====================
  const funds = useMemo(() => {
    if (anyFilterSelected) {
      return filteredResponse?.data ?? [];
    }
    return allFundsResponse?.data ?? [];
  }, [anyFilterSelected, filteredResponse, allFundsResponse]);

  const loading = anyFilterSelected
    ? filterLoading || filterFetching
    : allLoading || allFetching;

  // ==================== NORMALIZE OPTIONS ====================
  const normalizeOptions = (data) =>
    data?.map((d) => ({
      id: d.id ?? d.value ?? d.key,
      name: d.name ?? d.title ?? String(d),
    })) ?? [];

  const optionFilter = (data) =>
    normalizeOptions(
      data?.data?.filter((i) => String(i.status) === "1") ?? []
    );

  // ==================== SORT ====================
  const handleSort = (column) => {
    setSortConfig((prev) => ({
      key: column,
      direction:
        prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  // ==================== 1Y RETURN SORT VALUE ====================
  const getSortValue = (fund) => {
    if (
      fund.one_year === undefined ||
      fund.one_year === null ||
      fund.one_year === ""
    ) {
      return null;
    }
    const numValue =
      typeof fund.one_year === "string"
        ? parseFloat(fund.one_year)
        : fund.one_year;
    return Number.isNaN(numValue) ? null : numValue;
  };

  // ==================== SORTED FUNDS ====================
  const sortedFunds = useMemo(() => {
    if (!funds || funds.length === 0) {
      return [];
    }
    if (!sortConfig.key) {
      return funds;
    }
    const sorted = [...funds].sort((a, b) => {
      let aVal;
      let bVal;
      if (sortConfig.key === "one_year") {
        aVal = getSortValue(a);
        bVal = getSortValue(b);
        if (aVal === null && bVal === null) return 0;
        if (aVal === null) return 1;
        if (bVal === null) return -1;
        return sortConfig.direction === "asc"
          ? aVal - bVal
          : bVal - aVal;
      }
      aVal = String(a[sortConfig.key] || "").toLowerCase();
      bVal = String(b[sortConfig.key] || "").toLowerCase();
      return sortConfig.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
    return sorted;
  }, [funds, sortConfig]);

  // ==================== PAGINATION CALCULATION ====================
  const totalRecords = sortedFunds?.length ?? 0;
  const totalPages = Math.max(
    1,
    Math.ceil(totalRecords / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [assetClassId, typeId, strategyId, categoryId]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ==================== CURRENT PAGE DATA ====================
  const paginatedFunds = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedFunds.slice(startIndex, endIndex);
  }, [sortedFunds, currentPage]);

  // ==================== PAGE RANGE ====================
  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages);
      return pages;
    }
    if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
      return pages;
    }
    pages.push(
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages
    );
    return pages;
  }, [totalPages, currentPage]);

  // ==================== FUND CLICK ====================
  const handleFundClick = (fund) => {
    // Disable navigation if fund_performance is null
    if (!fund?.fund_performance) {
      return;
    }

    setLoadingFund(fund.id ?? fund.fundatakey);
    setTimeout(() => {
      navigate("/Altdbmain", {
        state: {
          symbolCode: fund.symbol_code,
          scrollToRestricted: true,
        },
      });
      setLoadingFund(null);
    }, 1000);
  };

  // ==================== FORMAT RETURN ====================
  const formatOneYearReturn = (value) => {
    if (value === undefined || value === null || value === "") {
      return null;
    }
    const numValue =
      typeof value === "string" ? parseFloat(value) : value;
    if (Number.isNaN(numValue)) {
      return null;
    }
    return numValue;
  };

  const getReturnColor = (value) => {
    if (value === null) return "text-gray-400";
    return value >= 0 ? "text-emerald-600" : "text-red-600";
  };

  const getReturnBackground = (value) => {
    if (value === null) return "bg-gray-50";
    return value >= 0 ? "bg-emerald-50" : "bg-red-50";
  };

  const getReturnIcon = (value) => {
    if (value === null) return null;
    return value >= 0 ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    );
  };

  // ==================== SORT INDICATOR ====================
  const getSortIndicator = (column) => {
    if (sortConfig.key !== column) {
      return (
        <div className="flex flex-col ml-1">
          <ArrowUp className="w-3 h-3 -mb-0.5" />
          <ArrowDown className="w-3 h-3 -mt-0.5" />
        </div>
      );
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  // ==================== PAGINATION HANDLERS ====================
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageChange = (page) => {
    if (typeof page === "number" && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startRecord =
    totalRecords === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endRecord = Math.min(
    currentPage * ITEMS_PER_PAGE,
    totalRecords
  );

  return (
    <div
      className="w-full min-h-screen py-6 md:py-10 bg-gradient-to-b from-slate-50 via-white to-slate-50"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10">
        {/* ==================== HEADER (CENTERED) ==================== */}
        <div className="flex flex-col items-center justify-center text-center mb-6 md:mb-8">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-full px-3.5 py-1 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span
              className="text-[11px] font-semibold text-blue-600 tracking-widest uppercase"
              style={{
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: "0.08em",
              }}
            >
              Alternative Investments
            </span>
          </div>
          <h1
            className="text-[22px] md:text-[28px] lg:text-[34px] font-semibold text-gray-900 tracking-tight mb-3 text-center leading-tight"
            style={{  fontFamily: "'Poppins', sans-serif"}}
          >
            Try the entry level AltDB Investment{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Fund Screener below!
            </span>
          </h1>
          <div className="w-28 h-[3px] rounded-full bg-gradient-to-r from-blue-600 to-teal-500 mb-4"></div>
          <p
            className="max-w-xl mx-auto text-[13px] md:text-[14px] text-gray-500 leading-snug text-center"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
          >
            Select at least one filter to narrow down your fund search.
          </p>
          <div className="mt-3 inline-flex items-center justify-center gap-3 bg-white border border-gray-100 rounded-full px-4 py-1.5 shadow-sm text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Positive returns in green
            </span>
            <span className="w-px h-3 bg-gray-200"></span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              Negative returns in red
            </span>
          </div>
        </div>

        {/* ==================== HOME USER GUIDE ==================== */}
        {userGuideLoading ? (
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
        ) : userGuide?.content?.trim() ? (
          <section className="max-w-5xl mx-auto mb-8 md:mb-12">
            <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400" />

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
                  <h2 className="text-base font-bold leading-snug text-slate-900 md:text-lg">
                    {userGuide.title || "Home User Guide"}
                  </h2>
                  <p className="text-xs leading-relaxed text-slate-500 md:text-[13px]">
                    Learn how to filter, compare, and explore funds with AltDB.
                  </p>
                </div>
              </div>

              <div className="px-4 py-4 md:px-6 md:py-5">
                <div
                  className="prose prose-sm max-w-none text-left text-[13px]  text-slate-600 prose-p:mb-3 prose-p:leading-7 prose-p:last:mb-0 prose-strong:font-semibold prose-strong:text-slate-800 prose-a:font-medium prose-a:text-blue-600 prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-blue-800 prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5 prose-li:my-1 md:text-sm"
                  dangerouslySetInnerHTML={{ __html: userGuide.content }}
                />
              </div>
            </div>
          </section>
        ) : null}

        {/* ==================== FILTERS ==================== */}

        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5 mb-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-3.5">
            <div className="p-1.5 rounded-lg bg-slate-100">
              <Filter className="w-3.5 h-3.5 text-slate-600" />
            </div>

            <h2
              className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              Filter
            </h2>

            {anyFilterSelected && (
              <span
                className="ml-auto text-[11px] text-blue-600 font-medium bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {totalRecords} results
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <CustomSelect
              label="Asset Class"
              value={assetClassId}
              onChange={(val) => setAssetClassId(String(val))}
              options={optionFilter(assetData)}
              loading={assetLoading}
            />

            <CustomSelect
              label="Type"
              value={typeId}
              onChange={(val) => setTypeId(String(val))}
              options={optionFilter(typeData)}
              loading={typeLoading}
            />

            <CustomSelect
              label="Strategy"
              value={strategyId}
              onChange={(val) => setStrategyId(String(val))}
              options={optionFilter(strategyData)}
              loading={strategyLoading}
            />

            <CustomSelect
              label="CIFSC Category"
              value={categoryId}
              onChange={(val) => setCategoryId(String(val))}
              options={optionFilter(categoryData)}
              loading={categoryLoading}
            />
          </div>
        </div>

        {/* ==================== TABLE ==================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
          <div className="overflow-x-auto max-h-[580px] overflow-y-auto">
            <table
              className="min-w-[1200px] w-full table-fixed border-collapse text-[11px]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <thead className="sticky top-0 z-20">
                <tr>
                  <th className="bg-[#5FB3CE] border border-white/20 px-2.5 py-2 w-[10%] text-left align-middle text-white text-[11px] font-bold uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="bg-[#5FB3CE] border border-white/20 px-2.5 py-2 w-[22%] text-left align-middle text-white text-[11px] font-bold uppercase tracking-wider">
                    Fund Name
                  </th>
                  <th className="bg-[#8ED973] border border-white/20 px-2.5 py-2 w-[9%] text-left align-middle text-white text-[11px] font-bold uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="bg-[#8ED973] border border-white/20 px-2.5 py-2 w-[9%] text-left align-middle text-white text-[11px] font-bold uppercase tracking-wider">
                    Type
                  </th>
                  <th className="bg-[#8ED973] border border-white/20 px-2.5 py-2 w-[13%] text-left align-middle text-white text-[11px] font-bold uppercase tracking-wider">
                    Strategy
                  </th>
                  <th className="bg-[#8ED973] border border-white/20 px-2.5 py-2 w-[9%] text-left align-middle text-white text-[11px] font-bold uppercase tracking-wider">
                    CIFSC
                  </th>
                  <th
                    className="bg-[#F1A983] border border-white/20 px-2.5 py-2 w-[7%] text-right align-middle text-white text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort("one_year")}
                  >
                    <div className="flex items-center justify-end">
                      1Y Return
                      {getSortIndicator("one_year")}
                    </div>
                  </th>
                  <th className="bg-[#D86DCD] border border-white/20 px-2.5 py-2 w-[13%] text-left align-middle text-white text-[11px] font-bold uppercase tracking-wider">
                    Fund Link
                  </th>
                  <th className="bg-[#D2D2D2] border border-white/20 px-2.5 py-2 w-[8%] text-center align-middle text-gray-700 text-[11px] font-bold uppercase tracking-wider">
                    Rank
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* ==================== LOADING ==================== */}
                {loading ? (
                  [...Array(8)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="border border-gray-100 px-2.5 py-1.5">
                        <div className="h-3.5 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="border border-gray-100 px-2.5 py-1.5">
                        <div className="h-3.5 bg-gray-200 rounded w-48"></div>
                      </td>
                      <td className="border border-gray-100 px-2.5 py-1.5">
                        <div className="h-3.5 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="border border-gray-100 px-2.5 py-1.5">
                        <div className="h-3.5 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="border border-gray-100 px-2.5 py-1.5">
                        <div className="h-3.5 bg-gray-200 rounded w-28"></div>
                      </td>
                      <td className="border border-gray-100 px-2.5 py-1.5">
                        <div className="h-3.5 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="border border-gray-100 px-2.5 py-1.5">
                        <div className="h-3.5 bg-gray-200 rounded w-14 ml-auto"></div>
                      </td>
                      <td className="border border-gray-100 px-2.5 py-1.5">
                        <div className="h-3.5 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="border border-gray-100 px-2.5 py-1.5">
                        <div className="h-3.5 bg-gray-200 rounded w-10 mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : paginatedFunds && paginatedFunds.length > 0 ? (
                  /* ==================== PAGINATED DATA ==================== */
                  paginatedFunds.map((fund, index) => {
                    const isFundLoading =
                      loadingFund === (fund.id ?? fund.fundatakey);
                    const returnValue = formatOneYearReturn(
                      fund.one_year
                    );
                    const returnColor = getReturnColor(returnValue);
                    const returnBg = getReturnBackground(returnValue);
                    const returnIcon = getReturnIcon(returnValue);
                    const hasPerformance = !!fund?.fund_performance;

                    return (
                      <tr
                        key={fund.id ?? fund.fundatakey}
                        onClick={
                          hasPerformance
                            ? () => handleFundClick(fund)
                            : undefined
                        }
                        className={`transition-all duration-200 ${hasPerformance
                          ? "cursor-pointer hover:bg-blue-50 hover:shadow-sm"
                          : "cursor-not-allowed"
                          } ${index % 2 === 0
                            ? "bg-white"
                            : "bg-slate-50/60"
                          } ${isFundLoading ? "opacity-50" : ""}`}
                      >
                        {/* Symbol */}
                        <td className="border border-gray-100 px-2.5 py-1.5 text-left align-middle font-semibold text-gray-800 whitespace-nowrap">
                          <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-mono">
                            {fund.symbol_code}
                          </span>
                        </td>

                        {/* Fund Name */}
                        <td className="border border-gray-100 px-2.5 py-1.5 text-left align-middle">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`break-words text-[11px] leading-snug ${hasPerformance
                                ? "text-blue-700 font-medium hover:underline underline-offset-2 cursor-pointer"
                                : "text-gray-400 font-medium cursor-not-allowed"
                                }`}
                            >
                              {fund.fund_name}
                            </div>
                            {isFundLoading && (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />
                            )}
                          </div>
                        </td>

                        {/* Asset */}
                        <td className="border border-gray-100 px-2.5 py-1.5 text-left align-middle text-black break-words">
                          <span className="bg-gray-50 px-1.5 py-0.5 rounded text-[10px] inline-block">
                            {fund.asset_class?.name ?? "N/A"}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="border border-gray-100 px-2.5 py-1.5 text-left align-middle text-black break-words">
                          <span className="bg-gray-50 px-1.5 py-0.5 rounded text-[10px] inline-block">
                            {fund.type?.name ?? "N/A"}
                          </span>
                        </td>

                        {/* Strategy */}
                        <td className="border border-gray-100 px-2.5 py-1.5 text-left align-middle text-black break-words">
                          <span className="bg-gray-50 px-1.5 py-0.5 rounded text-[10px] inline-block">
                            {fund.strategy?.name ?? "N/A"}
                          </span>
                        </td>

                        {/* CIFSC */}
                        <td className="border border-gray-100 px-2.5 py-1.5 text-left align-middle text-black break-words">
                          <span className="bg-gray-50 px-1.5 py-0.5 rounded text-[10px] inline-block">
                            {fund.category?.name ?? "N/A"}
                          </span>
                        </td>

                        {/* 1Y Return */}
                        <td className="border border-gray-100 px-2.5 py-1.5 text-right align-middle whitespace-nowrap">
                          {returnValue !== null ? (
                            <span
                              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-bold text-[10px] ${returnBg} ${returnColor}`}
                            >
                              {returnIcon}
                              {returnValue > 0 ? "+" : ""}
                              {returnValue.toFixed(2)}%
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[10px]">
                              N/A
                            </span>
                          )}
                        </td>

                        {/* Fund Link */}
                        <td className="border border-gray-100 px-2.5 py-1.5 text-left align-middle whitespace-nowrap">
                          {hasPerformance && fund.fund_library_link ? (
                            <a
                              href={fund.fund_library_link}
                              onClick={(e) => e.stopPropagation()}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline font-medium text-[10px] transition-colors"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              fundlibrary
                            </a>
                          ) : hasPerformance && fund.external_link ? (
                            <a
                              href={fund.external_link}
                              onClick={(e) => e.stopPropagation()}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline font-medium text-[10px] transition-colors"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              external
                            </a>
                          ) : (
                            <span className="text-gray-400 text-[10px]">
                              N/A
                            </span>
                          )}
                        </td>

                        {/* Rank */}
                        <td className="border border-gray-100 px-2.5 py-1.5 text-center align-middle whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <Lock
                              size={12}
                              className="text-gray-500 shrink-0"
                            />
                            <span className="text-[10px] text-gray-400">
                              locked
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  /* ==================== EMPTY ==================== */
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-10 text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Filter className="w-7 h-7 text-gray-300" />
                        <p className="text-[12px] font-medium">
                          No funds found
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Try adjusting your filters
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ==================== FOOTER ==================== */}
          <div className="border-t border-gray-100 px-4 md:px-5 py-2 bg-gray-50/80">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
              <span className="text-[11px] text-gray-500 text-center md:text-left">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {startRecord}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-gray-700">
                  {endRecord}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {totalRecords}
                </span>{" "}
                records
              </span>

              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentPage === 1 || loading}
                  className={`inline-flex items-center justify-center gap-1 h-7.5 px-2.5 rounded-lg border text-[11px] font-medium transition-all ${currentPage === 1 || loading
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-0.5">
                  {pageNumbers.map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="w-7 h-7 flex items-center justify-center text-[11px] text-gray-400"
                        >
                          ...
                        </span>
                      );
                    }
                    const isActive = page === currentPage;
                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                        className={`w-7 h-7 rounded-lg text-[11px] font-semibold border transition-all ${isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                          } ${loading
                            ? "cursor-not-allowed opacity-60"
                            : ""
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentPage === totalPages || loading}
                  className={`inline-flex items-center justify-center gap-1 h-7.5 px-2.5 rounded-lg border text-[11px] font-medium transition-all ${currentPage === totalPages || loading
                    ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-between mt-2.5 pt-2 border-t border-gray-200/70">
              <span className="hidden md:block text-[10px] text-gray-400">
                Page{" "}
                <span className="font-semibold text-gray-600">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-600">
                  {totalPages}
                </span>
                {" "}• {ITEMS_PER_PAGE} records per page
              </span>
              <div className="flex items-center gap-2.5 text-[10px] text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Positive
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                  Negative
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltDBScreener;