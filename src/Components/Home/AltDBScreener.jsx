import React, { useMemo, useState } from "react";
import { Lock, Filter, Loader2, TrendingUp, TrendingDown, ExternalLink, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useGetAssetClassesQuery,
  useGetCategoriesQuery,
  useGetStrategiesQuery,
  useGetTypesQuery,
  useFilterFundsQuery,
  useGetFundQuery,
} from "../../Redux/api/publicApiSlice";
import { CustomSelect } from "../Altdb/CustomSelect";

const AltDBScreener = () => {
  const navigate = useNavigate();
  const [loadingFund, setLoadingFund] = useState(null);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const [assetClassId, setAssetClassId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [strategyId, setStrategyId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const { data: assetData, isLoading: assetLoading } = useGetAssetClassesQuery();
  const { data: typeData, isLoading: typeLoading } = useGetTypesQuery();
  const { data: strategyData, isLoading: strategyLoading } = useGetStrategiesQuery();
  const { data: categoryData, isLoading: categoryLoading } = useGetCategoriesQuery();

  const anyFilterSelected = Boolean(assetClassId || typeId || strategyId || categoryId);

  const filters = useMemo(() => {
    const obj = {};
    if (assetClassId) obj.asset_class_id = assetClassId;
    if (typeId) obj.type_id = typeId;
    if (strategyId) obj.strategy_id = strategyId;
    if (categoryId) obj.category_id = categoryId;
    return obj;
  }, [assetClassId, typeId, strategyId, categoryId]);

  const {
    data: filteredResponse,
    isLoading: filterLoading,
    isFetching: filterFetching,
  } = useFilterFundsQuery(filters, { skip: !anyFilterSelected });

  const {
    data: allFundsResponse,
    isLoading: allLoading,
    isFetching: allFetching,
  } = useGetFundQuery(undefined, { skip: anyFilterSelected });

  const funds = useMemo(() => {
    if (anyFilterSelected) return filteredResponse?.data ?? [];
    return allFundsResponse?.data ?? [];
  }, [anyFilterSelected, filteredResponse, allFundsResponse]);

  const loading = anyFilterSelected
    ? filterLoading || filterFetching
    : allLoading || allFetching;

  const normalizeOptions = (data) =>
    data?.map((d) => ({
      id: d.id ?? d.value ?? d.key,
      name: d.name ?? d.title ?? String(d),
    })) ?? [];

  const optionFilter = (data) =>
    normalizeOptions(data?.data?.filter((i) => String(i.status) === "1") ?? []);

  // Handle sort click
  const handleSort = (column) => {
    setSortConfig((prev) => ({
      key: column,
      direction:
        prev.key === column && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Get sort value for 1Y Return
  const getSortValue = (fund) => {
    if (fund.one_year === undefined || fund.one_year === null || fund.one_year === "") {
      return -999999; // Put N/A values at the end
    }
    const numValue = typeof fund.one_year === 'string' ? parseFloat(fund.one_year) : fund.one_year;
    return isNaN(numValue) ? -999999 : numValue;
  };

  // Sort funds
  const sortedFunds = useMemo(() => {
    if (!funds || funds.length === 0) return funds;
    
    if (!sortConfig.key) return funds;

    const sorted = [...funds].sort((a, b) => {
      let aVal, bVal;
      
      if (sortConfig.key === 'one_year') {
        aVal = getSortValue(a);
        bVal = getSortValue(b);
      } else {
        // Default string sorting for other columns (if needed)
        aVal = String(a[sortConfig.key] || '').toLowerCase();
        bVal = String(b[sortConfig.key] || '').toLowerCase();
      }

      // Handle N/A values (which are set to -999999)
      if (aVal === -999999 && bVal === -999999) return 0;
      if (aVal === -999999) return 1;
      if (bVal === -999999) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return sortConfig.direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return sorted;
  }, [funds, sortConfig]);

  const handleFundClick = (fund) => {
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

  // Format and color code 1Y return
  const formatOneYearReturn = (value) => {
    if (value === undefined || value === null || value === "") return null;
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return null;
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
    return value >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
  };

  // Get sort indicator
  const getSortIndicator = (column) => {
    if (sortConfig.key !== column) {
      return (
        <div className="flex flex-col ml-1">
          <ArrowUp className="w-3 h-3 -mb-0.5" />
          <ArrowDown className="w-3 h-3 -mt-0.5" />
        </div>
      );
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4 ml-1" /> : 
      <ArrowDown className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="w-full min-h-screen py-8 md:py-10 roboto-regular bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-blue-600 tracking-widest uppercase">
              Fund Screener
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3 roboto-bold">
            AltDB{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Fund Screener
            </span>
          </h1>

          <div className="max-w-3xl mx-auto text-sm text-gray-500 leading-relaxed space-y-1">
            <p>Select at least one filter to narrow down your fund search.</p>
            <p className="text-xs text-gray-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>
              Positive returns in green 
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 ml-3 mr-1"></span>
              Negative returns in red
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 mb-8 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-slate-100">
              <Filter className="w-4 h-4 text-slate-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Filter Funds
            </h2>

            {anyFilterSelected && (
              <span className="ml-auto text-xs text-blue-600 font-medium bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 animate-pulse">
                {sortedFunds?.length || 0} results
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
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

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
          <div className="overflow-x-auto max-h-[700px] overflow-y-auto">
            <table className="min-w-[1200px] w-full table-fixed border-collapse text-[11px] sm:text-[12px]">
              <thead className="sticky top-0 z-20">
                <tr>
                  <th className="bg-[#5FB3CE] border border-white/20 px-3 py-3 w-[10%] text-left align-middle text-white text-xs font-bold uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="bg-[#5FB3CE] border border-white/20 px-3 py-3 w-[22%] text-left align-middle text-white text-xs font-bold uppercase tracking-wider">
                    Fund Name
                  </th>
                  <th className="bg-[#8ED973] border border-white/20 px-3 py-3 w-[9%] text-left align-middle text-white text-xs font-bold uppercase tracking-wider">
                    Asset
                  </th>
                  <th className="bg-[#8ED973] border border-white/20 px-3 py-3 w-[9%] text-left align-middle text-white text-xs font-bold uppercase tracking-wider">
                    Type
                  </th>
                  <th className="bg-[#8ED973] border border-white/20 px-3 py-3 w-[13%] text-left align-middle text-white text-xs font-bold uppercase tracking-wider">
                    Strategy
                  </th>
                  <th className="bg-[#8ED973] border border-white/20 px-3 py-3 w-[9%] text-left align-middle text-white text-xs font-bold uppercase tracking-wider">
                    CIFSC
                  </th>
                  <th 
                    className="bg-[#F1A983] border border-white/20 px-3 py-3 w-[7%] text-right align-middle text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('one_year')}
                  >
                    <div className="flex items-center justify-end">
                      1Y Return
                      {getSortIndicator('one_year')}
                    </div>
                  </th>
                  <th className="bg-[#D86DCD] border border-white/20 px-3 py-3 w-[13%] text-left align-middle text-white text-xs font-bold uppercase tracking-wider">
                    Fund Link
                  </th>
                  <th className="bg-[#D2D2D2] border border-white/20 px-3 py-3 w-[8%] text-center align-middle text-gray-700 text-xs font-bold uppercase tracking-wider">
                    Rank
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  [...Array(8)].map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="border border-gray-100 px-3 py-3 text-left align-middle">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="border border-gray-100 px-3 py-3 text-left align-middle">
                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                      </td>
                      <td className="border border-gray-100 px-3 py-3 text-left align-middle">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="border border-gray-100 px-3 py-3 text-left align-middle">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="border border-gray-100 px-3 py-3 text-left align-middle">
                        <div className="h-4 bg-gray-200 rounded w-28"></div>
                      </td>
                      <td className="border border-gray-100 px-3 py-3 text-left align-middle">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="border border-gray-100 px-3 py-3 text-right align-middle">
                        <div className="h-4 bg-gray-200 rounded w-14 ml-auto"></div>
                      </td>
                      <td className="border border-gray-100 px-3 py-3 text-left align-middle">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="border border-gray-100 px-3 py-3 text-center align-middle">
                        <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : sortedFunds && sortedFunds.length > 0 ? (
                  sortedFunds.map((fund, index) => {
                    const isFundLoading = loadingFund === (fund.id ?? fund.fundatakey);
                    const returnValue = formatOneYearReturn(fund.one_year);
                    const returnColor = getReturnColor(returnValue);
                    const returnBg = getReturnBackground(returnValue);
                    const returnIcon = getReturnIcon(returnValue);
                    
                    return (
                      <tr
                        key={fund.id ?? fund.fundatakey}
                        onClick={() => handleFundClick(fund)}
                        className={`cursor-pointer transition-all duration-200 ${
                          index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                        } hover:bg-blue-50 hover:shadow-sm ${
                          isFundLoading ? "opacity-50" : ""
                        }`}
                      >
                        <td className="border border-gray-100 px-3 py-3 text-left align-middle font-semibold text-gray-800 whitespace-nowrap">
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                            {fund.symbol_code}
                          </span>
                        </td>

                        <td className="border border-gray-100 px-3 py-3 text-left align-middle text-blue-700 font-medium">
                          <div className="flex items-center gap-2">
                            <div className="break-words hover:underline underline-offset-2 cursor-pointer">
                              {fund.fund_name}
                            </div>
                            {isFundLoading && (
                              <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                            )}
                          </div>
                        </td>

                        <td className="border border-gray-100 px-3 py-3 text-left align-middle text-black break-words">
                          <span className="bg-gray-50 px-2 py-0.5 rounded text-xs inline-block">
                            {fund.asset_class?.name ?? "N/A"}
                          </span>
                        </td>

                        <td className="border border-gray-100 px-3 py-3 text-left align-middle text-black break-words">
                          <span className="bg-gray-50 px-2 py-0.5 rounded text-xs inline-block">
                            {fund.type?.name ?? "N/A"}
                          </span>
                        </td>

                        <td className="border border-gray-100 px-3 py-3 text-left align-middle text-black break-words">
                          <span className="bg-gray-50 px-2 py-0.5 rounded text-xs inline-block">
                            {fund.strategy?.name ?? "N/A"}
                          </span>
                        </td>

                        <td className="border border-gray-100 px-3 py-3 text-left align-middle text-black break-words">
                          <span className="bg-gray-50 px-2 py-0.5 rounded text-xs inline-block">
                            {fund.category?.name ?? "N/A"}
                          </span>
                        </td>

                        <td className="border border-gray-100 px-3 py-3 text-right align-middle whitespace-nowrap">
                          {returnValue !== null ? (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-xs ${returnBg} ${returnColor}`}>
                              {returnIcon}
                              {returnValue > 0 ? "+" : ""}{returnValue.toFixed(2)}%
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">N/A</span>
                          )}
                        </td>

                        <td className="border border-gray-100 px-3 py-3 text-left align-middle whitespace-nowrap">
                          {fund.fund_library_link ? (
                            <a
                              href={fund.fund_library_link}
                              onClick={(e) => e.stopPropagation()}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline font-medium text-xs transition-colors"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              fundlibrary
                            </a>
                          ) : fund.external_link ? (
                            <a
                              href={fund.external_link}
                              onClick={(e) => e.stopPropagation()}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline font-medium text-xs transition-colors"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              external
                            </a>
                          ) : (
                            <span className="text-gray-400 text-xs">N/A</span>
                          )}
                        </td>

                        <td className="border border-gray-100 px-3 py-3 text-center align-middle whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <Lock size={14} className="text-gray-500 shrink-0" />
                            <span className="text-xs text-gray-400">locked</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Filter className="w-8 h-8 text-gray-300" />
                        <p className="text-sm font-medium">No funds found</p>
                        <p className="text-xs text-gray-400">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50/80">
            <span className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{sortedFunds?.length ?? 0}</span> record{sortedFunds?.length !== 1 ? "s" : ""} total
            </span>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Positive
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Negative
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltDBScreener;