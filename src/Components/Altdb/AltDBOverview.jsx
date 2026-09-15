import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
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
} from "../../Redux/api/publicApiSlice";

import { useSendGetSubscriptionMutation } from "../../Redux/api/privateApiSlice";

import FundPerformance from "./FundPerformance";
import { CustomSelect } from "./CustomSelect";
import Login from "../Authscreens/Login";

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
} from "lucide-react";

const AltDBOverview = () => {
  const { email } = useSelector((state) => state.auth);
  const isLoggedIn = !!email;

  const [isLoginModalOpen, setIsLoginModalOpen] =
    useState(false);

  const [assetClassId, setAssetClassId] =
    useState("");

  const [typeId, setTypeId] = useState("");

  const [strategyId, setStrategyId] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [activeRowIndex, setActiveRowIndex] =
    useState(null);

  const [selectedFund, setSelectedFund] =
    useState(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  // =========================================================
  // PAGINATION
  // =========================================================

  const ITEMS_PER_PAGE = 15;

  const [currentPage, setCurrentPage] =
    useState(1);

  // =========================================================
  // SORTING
  // =========================================================

  const [sortConfig, setSortConfig] =
    useState({
      key: null,
      direction: "asc",
    });

  const location = useLocation();

  const {
    symbolCode,
    scrollToRestricted,
  } = location.state || {};

  const [activeSymbol, setActiveSymbol] =
    useState(symbolCode || null);

  // =========================================================
  // REFS
  // =========================================================

  const filtersRef = useRef(null);
  const headerRef = useRef(null);

  // =========================================================
  // LOGIN EVENT
  // =========================================================

  useEffect(() => {
    const handleOpenLogin = () => {
      setIsLoginModalOpen(true);
    };

    window.addEventListener(
      "openLoginModal",
      handleOpenLogin
    );

    return () => {
      window.removeEventListener(
        "openLoginModal",
        handleOpenLogin
      );
    };
  }, []);

  // =========================================================
  // API HOOKS
  // =========================================================

  const {
    data: assetData,
    isLoading: assetLoading,
  } = useGetAssetClassesQuery();

  const {
    data: typeData,
    isLoading: typeLoading,
  } = useGetTypesQuery();

  const {
    data: strategyData,
    isLoading: strategyLoading,
  } = useGetStrategiesQuery();

  const {
    data: categoryData,
    isLoading: categoryLoading,
  } = useGetCategoriesQuery();

  const anyFilterSelected = Boolean(
    assetClassId ||
      typeId ||
      strategyId ||
      categoryId
  );

  // =========================================================
  // SUBSCRIPTIONS
  // =========================================================

  const [
    getSubscriptions,
    { data: subscriptionResp },
  ] = useSendGetSubscriptionMutation();

  useEffect(() => {
    if (isLoggedIn) {
      getSubscriptions();
    }
  }, [
    getSubscriptions,
    isLoggedIn,
  ]);

  // =========================================================
  // RESTRICTED ACCESS SCROLL
  // This remains only for the restricted login section.
  // =========================================================

  useEffect(() => {
    if (
      !isLoggedIn &&
      scrollToRestricted
    ) {
      const timer = setTimeout(() => {
        const section =
          document.getElementById(
            "access-restricted"
          );

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);

      return () =>
        clearTimeout(timer);
    }
  }, [
    isLoggedIn,
    scrollToRestricted,
  ]);

  // =========================================================
  // ACTIVE SUBSCRIPTION
  // =========================================================

  const hasActiveSubscription =
    useMemo(() => {
      if (!subscriptionResp?.data) {
        return false;
      }

      const today = new Date();

      return subscriptionResp.data.some(
        (sub) => {
          if (!sub.is_active) {
            return false;
          }

          const start = new Date(
            sub.start_date
          );

          const end = new Date(
            sub.end_date
          );

          return (
            today >= start &&
            today <= end
          );
        }
      );
    }, [subscriptionResp]);

  // =========================================================
  // FILTER PARAMS
  // =========================================================

  const filterParams = useMemo(
    () => ({
      asset_class_id:
        assetClassId || undefined,

      category_id:
        categoryId || undefined,

      type_id:
        typeId || undefined,

      strategy_id:
        strategyId || undefined,
    }),
    [
      assetClassId,
      typeId,
      strategyId,
      categoryId,
    ]
  );

  // =========================================================
  // ALL FUNDS
  // =========================================================

  const {
    data: allFundsResp,
    isLoading: allFundsLoading,
    isFetching: allFundsFetching,
  } = useGetFundQuery(undefined, {
    skip:
      !isLoggedIn ||
      anyFilterSelected,
  });

  // =========================================================
  // FILTERED FUNDS
  // =========================================================

  const {
    data: filteredResp,
    isLoading: filteredLoading,
    isFetching: filteredFetching,
  } = useFilterFundsQuery(
    filterParams,
    {
      skip:
        !anyFilterSelected ||
        !isLoggedIn,
    }
  );

  const fundsResp = anyFilterSelected
    ? filteredResp
    : allFundsResp;

  const fundsLoading = anyFilterSelected
    ? filteredLoading ||
      filteredFetching
    : allFundsLoading ||
      allFundsFetching;

  // =========================================================
  // FILTER OPTIONS
  // =========================================================

  const apiOptions = useMemo(() => {
    const getOptions = (
      apiData
    ) =>
      (apiData?.data ?? [])
        .filter(
          (i) =>
            String(i.status) === "1"
        )
        .map((i) => ({
          id: i.id,
          name: i.name,
        }));

    return {
      assetClass:
        getOptions(assetData),

      type:
        getOptions(typeData),

      strategy:
        getOptions(strategyData),

      cifscCategory:
        getOptions(categoryData),
    };
  }, [
    assetData,
    typeData,
    strategyData,
    categoryData,
  ]);

  // =========================================================
  // FORMATTERS
  // =========================================================

  const formatPercentValue = (
    val
  ) => {
    if (
      val === null ||
      val === undefined
    ) {
      return "N/A";
    }

    if (typeof val === "string") {
      const trimmed = val.trim();

      if (
        trimmed === "" ||
        trimmed.toLowerCase() ===
          "null" ||
        trimmed.toLowerCase() ===
          "undefined" ||
        trimmed.toLowerCase() ===
          "nan"
      ) {
        return "N/A";
      }

      const num = Number(trimmed);

      if (Number.isNaN(num)) {
        return "N/A";
      }

      return `${trimmed}%`;
    }

    if (
      Number.isNaN(Number(val))
    ) {
      return "N/A";
    }

    return `${val}%`;
  };

  const formatPlainValue = (val) => {
    if (
      val === null ||
      val === undefined
    ) {
      return "N/A";
    }

    if (typeof val === "string") {
      const trimmed = val.trim();

      if (
        trimmed === "" ||
        trimmed.toLowerCase() ===
          "null" ||
        trimmed.toLowerCase() ===
          "undefined"
      ) {
        return "N/A";
      }

      return trimmed;
    }

    return val;
  };

  // =========================================================
  // DATA PROCESSING
  // =========================================================

  const allData = useMemo(() => {
    if (!isLoggedIn) {
      return [];
    }

    return (
      fundsResp?.data ?? []
    ).map((f) => ({
      id: f.id,

      symbol:
        formatPlainValue(
          f.symbol_code
        ),

      fundName:
        formatPlainValue(
          f.fund_name
        ),

      asOfMonth:
        formatPlainValue(
          f.as_of_month
        ),

      fundLibraryLink:
        formatPlainValue(
          f.fund_library_link
        ),

      externalLink:
        formatPlainValue(
          f.external_link
        ),

      sinceInception:
        formatPercentValue(
          f.since_inception
        ),

      distributionYield:
        formatPercentValue(
          f.distribution_yield
        ),

      inceptionDate:
        formatPlainValue(
          f.inception_date
        ),

      assetClass:
        formatPlainValue(
          f.asset_class?.name
        ),

      type:
        formatPlainValue(
          f.type?.name
        ),

      strategy:
        formatPlainValue(
          f.strategy?.name
        ),

      cifscCategory:
        formatPlainValue(
          f.category?.name
        ),

      riskRating:
        formatPlainValue(
          f.risk_rating?.name
        ),

      oneMonth:
        formatPercentValue(
          f.one_month
        ),

      ytd:
        formatPercentValue(
          f.ytd
        ),

      oneYear:
        formatPercentValue(
          f.one_year
        ),

      threeYears:
        formatPercentValue(
          f.three_year
        ),

      threeYearStdDev:
        formatPercentValue(
          f.three_year_std_dev
        ),

      fundAum:
        formatPlainValue(
          f.fund_aum
        ),

      firmAum:
        formatPlainValue(
          f.firm?.firm_aum
        ),

      raw: f,

      rawOneMonth:
        f.one_month !== null &&
        f.one_month !== undefined &&
        f.one_month !== ""
          ? parseFloat(
              f.one_month
            )
          : null,

      rawYtd:
        f.ytd !== null &&
        f.ytd !== undefined &&
        f.ytd !== ""
          ? parseFloat(f.ytd)
          : null,

      rawOneYear:
        f.one_year !== null &&
        f.one_year !== undefined &&
        f.one_year !== ""
          ? parseFloat(
              f.one_year
            )
          : null,

      rawThreeYears:
        f.three_year !== null &&
        f.three_year !== undefined &&
        f.three_year !== ""
          ? parseFloat(
              f.three_year
            )
          : null,

      rawSinceInception:
        f.since_inception !== null &&
        f.since_inception !== undefined &&
        f.since_inception !== ""
          ? parseFloat(
              f.since_inception
            )
          : null,

      rawThreeYearStdDev:
        f.three_year_std_dev !== null &&
        f.three_year_std_dev !== undefined &&
        f.three_year_std_dev !== ""
          ? parseFloat(
              f.three_year_std_dev
            )
          : null,

      rawDistributionYield:
        f.distribution_yield !== null &&
        f.distribution_yield !== undefined &&
        f.distribution_yield !== ""
          ? parseFloat(
              f.distribution_yield
            )
          : null,
    }));
  }, [
    fundsResp,
    isLoggedIn,
  ]);

  // =========================================================
  // SORTING
  // =========================================================

  const sortData = (
    data,
    sortKey,
    direction
  ) => {
    if (!sortKey) {
      return data;
    }

    const sorted = [...data];

    sorted.sort((a, b) => {
      let aVal;
      let bVal;

      const numericColumns = [
        "1 Month",
        "YTD",
        "1 Year",
        "3 Years",
        "Since Inception",
        "3 Year Std Dev",
        "Distribution Yield",
      ];

      if (
        numericColumns.includes(
          sortKey
        )
      ) {
        const keyMap = {
          "1 Month":
            "rawOneMonth",

          YTD:
            "rawYtd",

          "1 Year":
            "rawOneYear",

          "3 Years":
            "rawThreeYears",

          "Since Inception":
            "rawSinceInception",

          "3 Year Std Dev":
            "rawThreeYearStdDev",

          "Distribution Yield":
            "rawDistributionYield",
        };

        const rawKey =
          keyMap[sortKey];

        aVal =
          a[rawKey] !==
            undefined &&
          a[rawKey] !== null
            ? a[rawKey]
            : null;

        bVal =
          b[rawKey] !==
            undefined &&
          b[rawKey] !== null
            ? b[rawKey]
            : null;

        // Keep N/A values at bottom
        if (
          aVal === null &&
          bVal === null
        ) {
          return 0;
        }

        if (aVal === null) {
          return 1;
        }

        if (bVal === null) {
          return -1;
        }
      } else {
        const keyMap = {
          "Symbol Code":
            "symbol",

          "Fund Name":
            "fundName",

          "Asset Class":
            "assetClass",

          Type:
            "type",

          Strategy:
            "strategy",

          "CIFSC Category":
            "cifscCategory",

          "Risk Rating":
            "riskRating",

          "Inception Date":
            "inceptionDate",

          "Fund AUM":
            "fundAum",

          "Firm AUM":
            "firmAum",

          "Overall Rating":
            "overallRating",
        };

        const dataKey =
          keyMap[sortKey];

        aVal =
          a[dataKey] !==
            undefined &&
          a[dataKey] !== null
            ? a[dataKey]
                .toString()
                .toLowerCase()
            : "";

        bVal =
          b[dataKey] !==
            undefined &&
          b[dataKey] !== null
            ? b[dataKey]
                .toString()
                .toLowerCase()
            : "";
      }

      if (aVal < bVal) {
        return direction === "asc"
          ? -1
          : 1;
      }

      if (aVal > bVal) {
        return direction === "asc"
          ? 1
          : -1;
      }

      return 0;
    });

    return sorted;
  };

  const displayedData = useMemo(() => {
    let data = allData;

    if (sortConfig.key) {
      data = sortData(
        data,
        sortConfig.key,
        sortConfig.direction
      );
    }

    return data;
  }, [
    allData,
    sortConfig,
  ]);

  // =========================================================
  // RESET PAGINATION ON FILTER
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    assetClassId,
    typeId,
    strategyId,
    categoryId,
  ]);

  // =========================================================
  // RESET PAGINATION ON SORT
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [sortConfig]);

  // =========================================================
  // PAGINATION CALCULATION
  // =========================================================

  const totalRecords =
    displayedData.length;

  const totalPages =
    totalRecords > 0
      ? Math.ceil(
          totalRecords /
            ITEMS_PER_PAGE
        )
      : 1;

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const endIndex =
    startIndex +
    ITEMS_PER_PAGE;

  const paginatedData = useMemo(
    () =>
      displayedData.slice(
        startIndex,
        endIndex
      ),
    [
      displayedData,
      startIndex,
      endIndex,
    ]
  );

  const startRecord =
    totalRecords === 0
      ? 0
      : startIndex + 1;

  const endRecord = Math.min(
    endIndex,
    totalRecords
  );

  // =========================================================
  // PAGE NUMBERS
  // =========================================================

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from(
        {
          length: totalPages,
        },
        (_, index) =>
          index + 1
      );
    }

    if (currentPage <= 4) {
      return [
        1,
        2,
        3,
        4,
        5,
        "...",
        totalPages,
      ];
    }

    if (
      currentPage >=
      totalPages - 3
    ) {
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

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  }, [
    currentPage,
    totalPages,
  ]);

  // =========================================================
  // PAGINATION HANDLERS
  // IMPORTANT:
  // NO window.scrollTo() HERE.
  // Page will NOT move to top when pagination changes.
  // =========================================================

  const goToPage = (page) => {
    if (
      typeof page !== "number" ||
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(page);
  };

  const goPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(
        (prev) => prev - 1
      );
    }
  };

  const goNext = () => {
    if (
      currentPage < totalPages
    ) {
      setCurrentPage(
        (prev) => prev + 1
      );
    }
  };

  // =========================================================
  // SORT HANDLER
  // =========================================================

  const handleSort = (
    column
  ) => {
    setSortConfig(
      (prevConfig) => {
        if (
          prevConfig.key ===
          column
        ) {
          return {
            key: column,
            direction:
              prevConfig.direction ===
              "asc"
                ? "desc"
                : "asc",
          };
        }

        return {
          key: column,
          direction: "asc",
        };
      }
    );
  };

  const getSortIndicator = (
    column
  ) => {
    if (
      sortConfig.key !==
      column
    ) {
      return null;
    }

    return sortConfig.direction ===
      "asc" ? (
      <ArrowUp className="w-3 h-3" />
    ) : (
      <ArrowDown className="w-3 h-3" />
    );
  };

  // =========================================================
  // AUTO OPEN FROM SCREENER
  // =========================================================

  useEffect(() => {
    if (
      symbolCode &&
      allData.length > 0 &&
      isLoggedIn
    ) {
      setActiveSymbol(
        symbolCode
      );

      setIsLoading(true);

      const matchingFund =
        allData.find(
          (fund) =>
            fund.symbol ===
            symbolCode
        );

      const index =
        allData.findIndex(
          (fund) =>
            fund.symbol ===
            symbolCode
        );

      if (index !== -1) {
        setActiveRowIndex(
          index
        );

        const page =
          Math.floor(
            index /
              ITEMS_PER_PAGE
          ) + 1;

        setCurrentPage(page);
      }

      const scrollTimer =
        setTimeout(() => {
          if (
            filtersRef.current
          ) {
            filtersRef.current.scrollIntoView(
              {
                behavior:
                  "smooth",
                block: "start",
              }
            );
          }
        }, 300);

      const modalTimer =
        setTimeout(() => {
          if (matchingFund) {
            setSelectedFund(
              matchingFund.raw
            );

            setIsModalOpen(true);
          }

          setIsLoading(false);
        }, 2000);

      return () => {
        clearTimeout(
          scrollTimer
        );

        clearTimeout(
          modalTimer
        );
      };
    }

    setIsLoading(false);
  }, [
    symbolCode,
    allData,
    isLoggedIn,
  ]);

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  const baseColumns = [
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

  const visibleColumns = useMemo(
    () => {
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

      return baseColumns.filter(
        (col) => {
          if (
            always.has(col)
          ) {
            return true;
          }

          return displayedData.some(
            (row) => {
              const map = {
                "Symbol Code":
                  row.symbol,

                "Fund Name":
                  row.fundName,

                "Asset Class":
                  row.assetClass,

                Type:
                  row.type,

                Strategy:
                  row.strategy,

                "CIFSC Category":
                  row.cifscCategory,

                "Risk Rating":
                  row.riskRating,

                "1 Month":
                  row.oneMonth,

                YTD:
                  row.ytd,

                "1 Year":
                  row.oneYear,

                "3 Years":
                  row.threeYears,

                "Since Inception":
                  row.sinceInception,

                "3 Year Std Dev":
                  row.threeYearStdDev,

                "Fund AUM":
                  row.fundAum,

                "Firm AUM":
                  row.firmAum,

                "Distribution Yield":
                  row.distributionYield,

                "Inception Date":
                  row.inceptionDate,

                "Fund Library Link":
                  row.fundLibraryLink,

                "External Link":
                  row.externalLink,
              };

              const value =
                map[col];

              return (
                value !==
                  undefined &&
                value !== null &&
                String(
                  value
                ).trim() !==
                  "N/A" &&
                String(
                  value
                ).trim() !== ""
              );
            }
          );
        }
      );
    },
    [displayedData]
  );

  // =========================================================
  // FILTER HANDLER
  // =========================================================

  const handleFilterChange =
    (setter) => (val) => {
      setter(val);
    };

  // =========================================================
  // COLUMN GROUP
  // =========================================================

  const getColumnGroup = (
    column
  ) => {
    if (
      [
        "Symbol Code",
        "Fund Name",
      ].includes(column)
    ) {
      return "identity";
    }

    if (
      [
        "Asset Class",
        "Type",
        "Strategy",
        "CIFSC Category",
      ].includes(column)
    ) {
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

  const columnHeaderStyle = (
    column
  ) => {
    const group =
      getColumnGroup(
        column
      );

    const styles = {
      identity: {
        backgroundColor:
          "#5FB3CE",
      },

      classification: {
        backgroundColor:
          "#8BCF6A",
      },

      performance: {
        backgroundColor:
          "#E6A57A",
      },

      extra: {
        backgroundColor:
          "#D86DCD",
      },

      rating: {
        backgroundColor:
          "#D2D2D2",
      },
    };

    return (
      styles[group] ||
      styles.rating
    );
  };

  // =========================================================
  // NUMERIC COLUMNS
  // =========================================================

  const isNumericColumn = (
    column
  ) => {
    const numericColumns = [
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

    return numericColumns.includes(
      column
    );
  };

  // =========================================================
  // TEXT COLUMNS
  // =========================================================

  const isTextColumn = (
    column
  ) => {
    const textColumns = [
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

    return textColumns.includes(
      column
    );
  };

  // =========================================================
  // CELL CONTENT
  // =========================================================

  const renderCellContent = (
    item,
    column
  ) => {
    if (
      column ===
      "Overall Rating"
    ) {
      const rating =
        item.raw
          ?.overall_rating ??
        item.raw?.rating;

      if (hasActiveSubscription) {
        if (
          rating === null ||
          rating ===
            undefined ||
          rating === "" ||
          rating === "N/A"
        ) {
          return (
            <div className="flex justify-center items-center">
              <Link to="/Levelmain">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                  <Lock className="w-3.5 h-3.5 opacity-60" />
                </div>
              </Link>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-center">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200">
              {rating}
            </span>
          </div>
        );
      }

      return (
        <div className="flex justify-center items-center">
          <Link to="/Levelmain">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
              <Lock className="w-3.5 h-3.5 opacity-60" />
            </div>
          </Link>
        </div>
      );
    }

    if (
      column ===
      "Fund Library Link"
    ) {
      if (
        !item.fundLibraryLink ||
        item.fundLibraryLink ===
          "N/A"
      ) {
        return (
          <span className="text-gray-400 text-xs">
            N/A
          </span>
        );
      }

      return (
        <a
          href={
            item.fundLibraryLink
          }
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) =>
            e.stopPropagation()
          }
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150"
        >
          <ExternalLink className="w-3 h-3" />
          Open
        </a>
      );
    }

    if (
      column ===
      "External Link"
    ) {
      if (
        !item.externalLink ||
        item.externalLink ===
          "N/A"
      ) {
        return (
          <span className="text-gray-400 text-xs">
            N/A
          </span>
        );
      }

      return (
        <a
          href={
            item.externalLink
          }
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) =>
            e.stopPropagation()
          }
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150"
        >
          <ExternalLink className="w-3 h-3" />
          Visit
        </a>
      );
    }

    if (
      column ===
      "Distribution Yield"
    ) {
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-1 text-sm">
          {
            item.distributionYield
          }
        </span>
      );
    }

    if (
      column ===
      "Inception Date"
    ) {
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-1 text-sm">
          {
            item.inceptionDate
          }
        </span>
      );
    }

    if (
      column ===
      "Fund AUM"
    ) {
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-1 text-sm">
          {item.fundAum}
        </span>
      );
    }

    if (
      column ===
      "Firm AUM"
    ) {
      return (
        <span className="inline-flex items-center justify-center px-2.5 py-1 text-sm">
          {item.firmAum}
        </span>
      );
    }

    const isPerformance = [
      "1 Month",
      "YTD",
      "1 Year",
      "3 Years",
      "Since Inception",
    ].includes(column);

    if (isPerformance) {
      const performanceMap = {
        "1 Month":
          item.oneMonth,

        YTD:
          item.ytd,

        "1 Year":
          item.oneYear,

        "3 Years":
          item.threeYears,

        "Since Inception":
          item.sinceInception,
      };

      const val =
        performanceMap[column];

      const numVal =
        parseFloat(val);

      const isPositive =
        !Number.isNaN(numVal) &&
        numVal > 0;

      const isNegative =
        !Number.isNaN(numVal) &&
        numVal < 0;

      return (
        <span
          className={`font-medium tabular-nums text-xs ${
            isPositive
              ? "text-emerald-600"
              : isNegative
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {isPositive && (
            <TrendingUp className="w-3 h-3 inline mr-0.5" />
          )}

          {isNegative && (
            <TrendingDown className="w-3 h-3 inline mr-0.5" />
          )}

          {val}
        </span>
      );
    }

    const map = {
      "Symbol Code":
        item.symbol,

      "Fund Name":
        item.fundName,

      "Asset Class":
        item.assetClass,

      Type:
        item.type,

      Strategy:
        item.strategy,

      "CIFSC Category":
        item.cifscCategory,

      "Risk Rating":
        item.riskRating,

      "3 Year Std Dev":
        item.threeYearStdDev,
    };

    return (
      map[column] ?? ""
    );
  };

  // =========================================================
  // CELL CLICK
  // =========================================================

  const handleCellClick = (
    item,
    index
  ) => {
    setActiveRowIndex(index);
    setActiveSymbol(item.symbol);
    setIsLoading(true);

    const timer = setTimeout(() => {
      setSelectedFund(
        item.raw ?? item
      );

      setIsModalOpen(true);
      setIsLoading(false);
    }, 2000);

    return () =>
      clearTimeout(timer);
  };

  // =========================================================
  // MODAL
  // =========================================================

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFund(null);
    setIsLoading(false);
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginModalOpen(false);
  };

  // =========================================================
  // LOGGED OUT VIEW
  // =========================================================

  if (!isLoggedIn) {
    return (
      <>
        <div className="w-full min-h-screen py-8 md:py-10 bg-gradient-to-b from-slate-50 to-white">
          <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 lg:px-10">

            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>

                <span className="text-xs font-semibold text-blue-600 tracking-widest uppercase">
                  Alternative Investments
                </span>
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                AltDB{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                  Overview
                </span>
              </h1>

              <p className="max-w-2xl text-sm mx-auto text-gray-500 leading-relaxed">
                Explore alternative investment funds with detailed analytics and performance metrics.
              </p>
            </div>

            <div
              id="access-restricted"
              className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-12 md:p-16 text-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-transparent to-purple-50/40 pointer-events-none"></div>

              <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl animate-pulse"></div>

              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6 mx-auto relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 animate-ping"></div>

                  <Lock className="w-10 h-10 text-gray-600 relative z-10" />
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Access Restricted
                </h2>

                <p className="text-gray-600 max-w-md mx-auto mb-3 text-base">
                  Please log in to access the AltDB Fund Overview and view detailed fund information.
                </p>

                <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
                  Sign in to explore alternative investment funds, filter by strategy, and analyze performance metrics.
                </p>

                <button
                  onClick={
                    handleLoginClick
                  }
                  className="inline-flex items-center cursor-pointer gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 text-sm font-medium hover:scale-105 group"
                >
                  <span>
                    Sign In to Continue
                  </span>

                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    Fund Screener
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                    Performance Analytics
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    Filter & Compare
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Login
          isOpen={
            isLoginModalOpen
          }
          onClose={
            handleLoginClose
          }
        />
      </>
    );
  }

  // =========================================================
  // LOGGED IN VIEW
  // =========================================================

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-10 px-4 md:px-6 lg:px-16">
        <div className="max-w-[1400px] mx-auto">

          {/* HEADER */}
          <div
            ref={headerRef}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>

              <span className="text-xs font-semibold text-blue-600 tracking-widest uppercase">
                Alternative Investments
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
              AltDB{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                Overview
              </span>
            </h1>

            <p className="max-w-2xl text-sm mx-auto text-gray-500 leading-relaxed">
              Explore and filter alternative investment funds by asset class, strategy, and performance. Click any fund name to view detailed analytics.
            </p>
          </div>

          {/* FILTERS */}
          <div
            ref={filtersRef}
            className="mb-8 scroll-mt-4"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">

              <div className="flex items-center gap-2 mb-5">
                <div className="p-1.5 rounded-lg bg-slate-100">
                  <Filter className="w-4 h-4 text-slate-600" />
                </div>

                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Filter Funds
                </h2>

                {anyFilterSelected && (
                  <span className="ml-auto text-xs text-blue-600 font-medium bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {totalRecords} results
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

                <CustomSelect
                  label="Asset Class"
                  value={assetClassId}
                  onChange={handleFilterChange(
                    setAssetClassId
                  )}
                  options={
                    apiOptions.assetClass
                  }
                  loading={
                    assetLoading
                  }
                />

                <CustomSelect
                  label="Type"
                  value={typeId}
                  onChange={handleFilterChange(
                    setTypeId
                  )}
                  options={
                    apiOptions.type
                  }
                  loading={
                    typeLoading
                  }
                />

                <CustomSelect
                  label="Strategy"
                  value={strategyId}
                  onChange={handleFilterChange(
                    setStrategyId
                  )}
                  options={
                    apiOptions.strategy
                  }
                  loading={
                    strategyLoading
                  }
                />

                <CustomSelect
                  label="CIFSC Category"
                  value={categoryId}
                  onChange={handleFilterChange(
                    setCategoryId
                  )}
                  options={
                    apiOptions.cifscCategory
                  }
                  loading={
                    categoryLoading
                  }
                />

              </div>
            </div>
          </div>

          {/* =================================================
              TABLE
              FIXED HEIGHT: 580px
              INTERNAL VERTICAL + HORIZONTAL SCROLL
          ================================================= */}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">

            {/* LOADING OVERLAY */}
            {(isLoading ||
              fundsLoading) && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">

                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>

                    <Loader2 className="absolute top-0 left-0 w-16 h-16 text-blue-600 animate-spin" />
                  </div>

                  <div className="flex flex-col items-center gap-1">

                    <span className="text-sm font-semibold text-gray-700">
                      {fundsLoading
                        ? "Loading Funds"
                        : "Loading Fund Details"}
                    </span>

                    <span className="text-xs text-gray-400">
                      Please wait...
                    </span>

                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                SCROLL AREA
                NO PAGE SCROLL ON PAGINATION
            ================================================= */}

            <div
              className="overflow-auto"
              style={{
                height: "580px",
              }}
            >
              <table className="w-full min-w-[1400px] border-collapse text-sm">

                {/* HEADER */}
                <thead className="sticky top-0 z-30 bg-white">
                  <tr>
                    {visibleColumns.map(
                      (
                        column,
                        index
                      ) => {

                        const isSortable =
                          column !==
                            "Fund Library Link" &&
                          column !==
                            "External Link";

                        return (
                          <th
                            key={index}
                            onClick={() =>
                              isSortable &&
                              handleSort(
                                column
                              )
                            }
                            className={`px-4 py-4 text-center text-sm font-bold border-r border-white/20 last:border-r-0 whitespace-nowrap tracking-wide select-none ${
                              isSortable
                                ? "cursor-pointer hover:opacity-80 transition-opacity"
                                : ""
                            }`}
                            style={columnHeaderStyle(
                              column
                            )}
                          >
                            <div className="flex items-center justify-center gap-1.5">

                              <span>
                                {
                                  column
                                }
                              </span>

                              {isSortable && (
                                <span className="inline-flex flex-col items-center">

                                  {sortConfig.key ===
                                  column ? (
                                    getSortIndicator(
                                      column
                                    )
                                  ) : (
                                    <div className="flex flex-col">
                                      <ArrowUp className="w-2.5 h-2.5 -mb-0.5" />
                                      <ArrowDown className="w-2.5 h-2.5 -mt-0.5" />
                                    </div>
                                  )}

                                </span>
                              )}

                            </div>
                          </th>
                        );
                      }
                    )}
                  </tr>
                </thead>

                {/* BODY */}
                <tbody className="divide-y divide-gray-100">

                  {fundsLoading ? (
                    [...Array(10)].map(
                      (
                        _,
                        rowIndex
                      ) => (
                        <tr
                          key={`loading-${rowIndex}`}
                          className="animate-pulse"
                        >
                          {visibleColumns.map(
                            (
                              _,
                              colIndex
                            ) => (
                              <td
                                key={
                                  colIndex
                                }
                                className="px-3 py-4 border-r border-gray-100"
                              >
                                <div
                                  className={`h-4 bg-gray-200 rounded ${
                                    colIndex ===
                                    1
                                      ? "w-44"
                                      : "w-20"
                                  }`}
                                />
                              </td>
                            )
                          )}
                        </tr>
                      )
                    )
                  ) : paginatedData.length ===
                    0 ? (
                    <tr>
                      <td
                        colSpan={
                          visibleColumns.length
                        }
                        className="py-16 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-2">

                          <Search className="w-10 h-10 text-gray-200" />

                          <span>
                            No funds found
                          </span>

                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map(
                      (
                        item,
                        pageIndex
                      ) => {

                        const globalIndex =
                          startIndex +
                          pageIndex;

                        const isSelected =
                          item.symbol ===
                          activeSymbol;

                        return (
                          <tr
                            key={
                              item.id ??
                              item.symbol ??
                              globalIndex
                            }
                            className={`transition-colors duration-150 group ${
                              isSelected
                                ? "bg-amber-50 ring-1 ring-inset ring-amber-300"
                                : globalIndex %
                                    2 ===
                                  0
                                ? "bg-white"
                                : "bg-slate-50/60"
                            } hover:bg-teal-50/70`}
                          >

                            {visibleColumns.map(
                              (
                                column,
                                colIndex
                              ) => {

                                const isFundName =
                                  column ===
                                  "Fund Name";

                                const isSymbol =
                                  column ===
                                  "Symbol Code";

                                const isOverall =
                                  column ===
                                  "Overall Rating";

                                const isLinkColumn =
                                  column ===
                                    "Fund Library Link" ||
                                  column ===
                                    "External Link";

                                const isNumeric =
                                  isNumericColumn(
                                    column
                                  );

                                const isText =
                                  isTextColumn(
                                    column
                                  );

                                let textAlign =
                                  "text-center";

                                if (
                                  isText
                                ) {
                                  textAlign =
                                    "text-left";
                                }

                                if (
                                  isNumeric
                                ) {
                                  textAlign =
                                    "text-right";
                                }

                                return (
                                  <td
                                    key={
                                      colIndex
                                    }
                                    onClick={
                                      isFundName
                                        ? () =>
                                            handleCellClick(
                                              item,
                                              globalIndex
                                            )
                                        : undefined
                                    }
                                    className={`px-3 py-3 text-sm border-r border-gray-100 last:border-r-0 whitespace-nowrap ${textAlign} ${
                                      isOverall
                                        ? "bg-white group-hover:bg-teal-50/70"
                                        : ""
                                    } ${
                                      isSymbol
                                        ? "font-bold tracking-wide text-gray-900"
                                        : ""
                                    } ${
                                      isFundName
                                        ? "text-blue-700 font-medium max-w-[220px] cursor-pointer hover:underline underline-offset-2 decoration-blue-300"
                                        : ""
                                    } ${
                                      !isSymbol &&
                                      !isFundName &&
                                      !isOverall &&
                                      !isLinkColumn
                                        ? "text-gray-700"
                                        : ""
                                    } ${
                                      isLinkColumn
                                        ? "text-center"
                                        : ""
                                    } ${
                                      isNumeric &&
                                      !isOverall
                                        ? "tabular-nums"
                                        : ""
                                    }`}
                                  >

                                    {isFundName ? (
                                      <div className="flex items-center gap-1.5 max-w-[220px]">

                                        <span className="truncate">
                                          {
                                            item.fundName
                                          }
                                        </span>

                                        <ArrowUp className="w-3 h-3 shrink-0 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity rotate-90" />

                                      </div>
                                    ) : (
                                      renderCellContent(
                                        item,
                                        column
                                      )
                                    )}

                                  </td>
                                );
                              }
                            )}

                          </tr>
                        );
                      }
                    )
                  )}

                </tbody>
              </table>
            </div>

            {/* =================================================
                PAGINATION - BOTTOM RIGHT
            ================================================= */}

            {!fundsLoading &&
              totalRecords > 0 && (
                <div className="border-t border-gray-200 bg-white px-4 md:px-6 py-4">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    {/* LEFT RECORD COUNT */}
                    <div className="text-xs sm:text-sm text-gray-500">
                      Showing{" "}
                      <span className="font-semibold text-gray-800">
                        {startRecord}
                      </span>{" "}
                      -{" "}
                      <span className="font-semibold text-gray-800">
                        {endRecord}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-800">
                        {totalRecords}
                      </span>{" "}
                      funds
                    </div>

                    {/* RIGHT PAGINATION */}
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">

                      {/* PREVIOUS */}
                      <button
                        type="button"
                        onClick={
                          goPrevious
                        }
                        disabled={
                          currentPage ===
                          1
                        }
                        className={`h-9 px-3 rounded-lg border inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium transition-all ${
                          currentPage ===
                          1
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />

                        <span className="hidden sm:inline">
                          Previous
                        </span>
                      </button>

                      {/* PAGE NUMBERS */}
                      <div className="flex items-center gap-1">

                        {pageNumbers.map(
                          (
                            page,
                            index
                          ) => {

                            if (
                              page ===
                              "..."
                            ) {
                              return (
                                <span
                                  key={`dots-${index}`}
                                  className="w-8 h-9 sm:w-9 flex items-center justify-center text-gray-400 text-sm"
                                >
                                  ...
                                </span>
                              );
                            }

                            const isActive =
                              page ===
                              currentPage;

                            return (
                              <button
                                key={
                                  page
                                }
                                type="button"
                                onClick={() =>
                                  goToPage(
                                    page
                                  )
                                }
                                className={`w-8 h-9 sm:w-9 rounded-lg border text-xs sm:text-sm font-semibold transition-all ${
                                  isActive
                                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                    : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600"
                                }`}
                              >
                                {
                                  page
                                }
                              </button>
                            );
                          }
                        )}

                      </div>

                      {/* NEXT */}
                      <button
                        type="button"
                        onClick={
                          goNext
                        }
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        className={`h-9 px-3 rounded-lg border inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium transition-all ${
                          currentPage ===
                          totalPages
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600"
                        }`}
                      >
                        <span className="hidden sm:inline">
                          Next
                        </span>

                        <ChevronRight className="w-4 h-4" />
                      </button>

                    </div>
                  </div>

                  {/* PAGE INFO */}
                  <div className="flex justify-end mt-2">
                    <span className="text-[11px] text-gray-400">
                      Page{" "}
                      <span className="font-semibold text-gray-600">
                        {currentPage}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-gray-600">
                        {totalPages}
                      </span>

                      <span className="mx-1.5">
                        •
                      </span>

                      15 per page
                    </span>
                  </div>

                </div>
              )}

            {/* SMALL FOOTER */}
            {!fundsLoading &&
              totalRecords > 0 && (
                <div className="border-t border-gray-100 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 bg-gray-50/80">
                  <span className="text-xs text-gray-400">
                    {totalRecords} record
                    {totalRecords !==
                    1
                      ? "s"
                      : ""}{" "}
                    total
                  </span>

                  <span className="text-xs text-gray-400">
                    Click on Fund Name to view details
                  </span>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* =====================================================
          FUND DETAILS MODAL
      ===================================================== */}

      {isModalOpen &&
        selectedFund && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              backgroundColor:
                "rgba(15, 23, 42, 0.7)",
              backdropFilter:
                "blur(8px)",
            }}
          >
            <div className="bg-white w-full md:w-[95%] lg:w-[85%] max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl relative animate-scaleIn">

              {/* MODAL HEADER */}
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm rounded-t-3xl">
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100">

                  <div className="flex items-center gap-4">

                    <div className="w-2 h-10 rounded-full bg-gradient-to-b from-blue-600 to-teal-400 shadow-lg shadow-blue-200"></div>

                    <div>

                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest flex items-center gap-2">
                        <span className="inline-block w-1 h-1 rounded-full bg-blue-500"></span>
                        Fund Details
                      </p>

                      <h3 className="text-lg font-bold text-gray-800 mt-0.5">
                        {selectedFund?.fund_name ??
                          selectedFund?.fundName ??
                          "N/A"}
                      </h3>

                      <div className="flex items-center gap-2 mt-0.5">

                        <span className="text-xs font-medium text-gray-500">
                          Category:
                        </span>

                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                          {selectedFund?.category?.name ??
                            selectedFund?.fundName ??
                            "N/A"}
                        </span>

                      </div>
                    </div>
                  </div>

                  <button
                    onClick={
                      closeModal
                    }
                    className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-red-50 hover:scale-110 transition-all duration-300 ease-in-out"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors duration-200" />
                  </button>

                </div>
              </div>

              {/* PERFORMANCE */}
              <div className="px-8 py-6">
                <FundPerformance
                  fund={selectedFund}
                />
              </div>

            </div>
          </div>
        )}

      {/* LOGIN */}
      <Login
        isOpen={
          isLoginModalOpen
        }
        onClose={
          handleLoginClose
        }
      />
    </>
  );
};

export default AltDBOverview;
