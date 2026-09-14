import React, { useMemo, useRef, useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useGetFundGraphDataQuery } from "../../Redux/api/publicApiSlice";
import { AnnualizedReturnCanvas, ScatterDot } from "./Graphpopus";

export default function FundPerformance({ fund, printableMode = false }) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const fundId = fund?.id;

  const {
    data: apiResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetFundGraphDataQuery(fundId, {
    refetchOnMountOrArgChange: true,
    skip: !fundId,
  });

  const data = apiResponse?.data ?? null;

  const barData = useMemo(() => {
    const labels = data?.annualized_returns?.x_axis?.values ?? [];
    const fundVals = data?.annualized_returns?.y_axis?.fund ?? [];
    const meanVals = data?.annualized_returns?.y_axis?.category_mean ?? [];

    return labels.map((label, i) => ({
      period: String(label),
      mean: Number(meanVals[i] ?? 0),
      fund: Number(fundVals[i] ?? 0),
    }));
  }, [data]);

  const quartileBands = useMemo(
    () => data?.annualized_returns?.y_axis?.quartile_bands ?? {},
    [data]
  );

  const yMin = Number(data?.annualized_returns?.y_axis?.min ?? -10);
  const yMax = Number(data?.annualized_returns?.y_axis?.max ?? 120);
  const annualizedTickInterval = Number(
    data?.annualized_returns?.y_axis?.tickInterval ?? 20
  );

  const rr = data?.risk_return;
  const xMin = Number(rr?.x_axis?.min ?? 0);
  const xMax = Number(rr?.x_axis?.max ?? 1400);
  const xTick = Number(rr?.x_axis?.tickInterval ?? 100);
  const rrYMin = Number(rr?.y_axis?.min ?? 0);
  const rrYMax = Number(rr?.y_axis?.max ?? 18);
  const rrYTick = Number(rr?.y_axis?.tickInterval ?? 5);

  const xTicks = useMemo(() => {
    const t = [];
    for (let v = xMin; v <= xMax; v += xTick) t.push(v);
    return t;
  }, [xMin, xMax, xTick]);

  const yTicksRR = useMemo(() => {
    const t = [];
    for (let v = rrYMin; v <= rrYMax; v += rrYTick) t.push(v);
    return t;
  }, [rrYMin, rrYMax, rrYTick]);

  const allScatterData = useMemo(() => {
    const others = (rr?.other_funds ?? []).map((f) => ({
      x: Number(f.x),
      y: Number(f.y),
      fund_name: String(f.fund_name ?? ""),
      type: "other",
    }));

    const avg = rr?.category_avg
      ? [
        {
          x: Number(rr.category_avg.x),
          y: Number(rr.category_avg.y),
          fund_name: String(rr.category_avg.label ?? "Category Average"),
          type: "avg",
        },
      ]
      : [];

    const current = rr?.current_fund
      ? [
        {
          x: Number(rr.current_fund.x),
          y: Number(rr.current_fund.y),
          fund_name: String(rr.current_fund.fund_name ?? ""),
          type: "current",
        },
      ]
      : [];

    return [...others, ...avg, ...current];
  }, [rr]);

  const refX = rr?.category_avg?.x != null ? Number(rr.category_avg.x) : null;
  const refY = rr?.category_avg?.y != null ? Number(rr.category_avg.y) : null;

  const card = {
    background: "#fff",
    borderRadius: 14,
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
    overflow: "visible",
    position: "relative",
    zIndex: 1,
  };

  const cardHeader = {
    background: "linear-gradient(90deg, #1e7fa0 0%, #2596be 60%, #3ab3d6 100%)",
    padding: "10px 20px",
    color: "#fff",
    fontSize: 16,
    fontWeight: 500,
    letterSpacing: 0.4,
    textAlign: "center",
  };

  const cardBody = { padding: "16px 20px 20px" };

  // Sort function for the table
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key: key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      }
      return {
        key: key,
        direction: 'asc'
      };
    });
  };

  // Sort bar data for table display
  const sortedBarData = useMemo(() => {
    if (!sortConfig.key) return barData;
    
    const sorted = [...barData];
    sorted.sort((a, b) => {
      let aVal, bVal;
      
      if (sortConfig.key === 'period') {
        aVal = a.period;
        bVal = b.period;
      } else if (sortConfig.key === 'mean') {
        aVal = a.mean;
        bVal = b.mean;
      } else if (sortConfig.key === 'fund') {
        aVal = a.fund;
        bVal = b.fund;
      } else {
        return 0;
      }

      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
    
    return sorted;
  }, [barData, sortConfig]);

  // Now we can conditionally return after all hooks are called
  // Show loading state while fetching
  if (isLoading || isFetching) {
    return (
      <div
        style={{
          background: printableMode ? "transparent" : "#f1f5f9",
          padding: "24px 16px",
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40,
            height: 40,
            border: "4px solid #e2e8f0",
            borderTop: "4px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 12px"
          }} />
          <p style={{ color: "#64748b", fontSize: 14 }}>Loading fund data...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div
        style={{
          background: printableMode ? "transparent" : "#f1f5f9",
          padding: "24px 16px",
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            ...card,
            padding: 20,
            marginBottom: 16,
            color: "#b91c1c",
            fontSize: 14,
          }}
        >
          Failed to load fund performance data.
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div
        style={{
          background: printableMode ? "transparent" : "#f1f5f9",
          padding: "24px 16px",
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ ...card, padding: 20, color: "#475569", fontSize: 14 }}>
          No fund data available.
        </div>
      </div>
    );
  }

  // Main render with data
  return (
    <div
      style={{
        background: printableMode ? "transparent" : "#f1f5f9",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
            gap: 24,
            position: "relative",
            overflow: "visible",
            isolation: "isolate",
          }}
        >
          {/* ── Annualized Return ── */}
          <div
            style={{
              ...card,
              position: "relative",
              overflow: "visible",
              zIndex: 1000,
            }}
          >
            <div style={cardHeader}>Annualized Return</div>
            <div style={cardBody}>
              {/* Canvas chart */}
              <div
                style={{
                  height: 340,
                  position: "relative",
                  overflow: "visible",
                  zIndex: 999,
                }}
              >
                <AnnualizedReturnCanvas
                  barData={barData}
                  quartileBands={quartileBands}
                  yMin={yMin}
                  yMax={yMax}
                  yTickInterval={annualizedTickInterval}
                />
              </div>

              {/* Data table with sorting */}
              <div
                style={{
                  marginTop: 14,
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    fontSize: 13,
                    borderCollapse: "collapse",
                    tableLayout: "fixed",
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th
                        onClick={() => handleSort('period')}
                        style={{
                          textAlign: "left",
                          padding: "7px 12px",
                          color: "#64748b",
                          fontWeight: 500,
                          borderBottom: "1px solid #e2e8f0",
                          width: "60px",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          Period
                          {sortConfig.key === 'period' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      {sortedBarData.map((it) => (
                        <th
                          key={it.period}
                          onClick={() => handleSort('mean')}
                          style={{
                            textAlign: "center",
                            padding: "7px 6px",
                            color: "#64748b",
                            fontWeight: 500,
                            borderBottom: "1px solid #e2e8f0",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            userSelect: "none",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            {it.period}
                            {sortConfig.key === 'mean' && (
                              <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td
                        onClick={() => handleSort('mean')}
                        style={{
                          padding: "7px 12px",
                          fontWeight: 600,
                          color: "#334155",
                          fontSize: 13,
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          Mean
                          {sortConfig.key === 'mean' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </td>
                      {sortedBarData.map((it) => (
                        <td
                          key={it.period}
                          style={{
                            textAlign: "center",
                            padding: "7px 6px",
                            color: "#334155",
                          }}
                        >
                          {it.mean.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td
                        onClick={() => handleSort('fund')}
                        style={{
                          padding: "7px 12px",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#c8483f",
                                display: "inline-block",
                              }}
                            />
                            Fund
                          </span>
                          {sortConfig.key === 'fund' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </td>
                      {sortedBarData.map((it) => (
                        <td
                          key={it.period}
                          style={{
                            textAlign: "center",
                            padding: "7px 6px",
                            fontWeight: 600,
                            color: "#c8483f",
                          }}
                        >
                          {it.fund.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Risk / Return ── */}
          <div
            style={{
              ...card,
              position: "relative",
              overflow: "hidden",
              zIndex: 1,
            }}
          >
            <div style={cardHeader}>Risk / Return</div>
            <div style={cardBody}>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 20, left: 8, bottom: 36 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      domain={[xMin, xMax]}
                      ticks={xTicks}
                      tick={{ fill: "#334155", fontSize: 11 }}
                      axisLine={{ stroke: "#cbd5e1" }}
                      label={{
                        value: String(rr?.x_axis?.label ?? "Risk (Standard Deviation %)"),
                        position: "insideBottom",
                        offset: -20,
                        fontSize: 11,
                        fill: "#475569",
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      domain={[rrYMin, rrYMax]}
                      ticks={yTicksRR}
                      tick={{ fill: "#334155", fontSize: 11 }}
                      axisLine={{ stroke: "#cbd5e1" }}
                      label={{
                        value: String(rr?.y_axis?.label ?? "3-Year Annualized Return (%)"),
                        angle: -90,
                        position: "insideLeft",
                        fontSize: 11,
                        fill: "#475569",
                        dy: 80,
                      }}
                    />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<ScatterChart />} />
                    {refX != null && (
                      <ReferenceLine
                        x={refX}
                        stroke="#3b82f6"
                        strokeWidth={1.5}
                        strokeDasharray="5 4"
                      />
                    )}
                    {refY != null && (
                      <ReferenceLine
                        y={refY}
                        stroke="#3b82f6"
                        strokeWidth={1.5}
                        strokeDasharray="5 4"
                      />
                    )}
                    <Scatter
                      name="Funds"
                      data={allScatterData}
                      isAnimationActive={false}
                      shape={<ScatterDot />}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div
                style={{
                  marginTop: 14,
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "12px 16px",
                  background: "#f8fafc",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: "#c8483f",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontWeight: 500 }}>
                      {String(data?.fund_name ?? "Current Fund")}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: "#9aa3ad",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: "#475569" }}>Other funds in the category</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: "#3b82f6",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: "#475569" }}>Category Average</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}