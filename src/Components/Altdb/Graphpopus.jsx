import React, { useRef, useEffect } from "react";

export const ScatterTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload;
  if (!p) return null;

  return (
    <div
      style={{
        background: "#1e293b",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: 8,
        fontSize: 13,
        border: "1px solid #475569",
        pointerEvents: "none",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>
        {p.fund_name || "Fund"}
      </div>
      <div>Risk: {Number(p.x).toFixed(2)}</div>
      <div>Return: {Number(p.y).toFixed(2)}%</div>
      {p.type === "current" && (
        <div style={{ color: "#fde68a", marginTop: 4, fontWeight: 600 }}>
          Current Fund
        </div>
      )}
      {p.type === "avg" && (
        <div style={{ color: "#93c5fd", marginTop: 4 }}>Category Average</div>
      )}
    </div>
  );
};

export const ScatterDot = (props) => {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null;

  const styleMap = {
    current: { fill: "#c8483f", r: 9, fillOpacity: 1 },
    avg: { fill: "#3b82f6", r: 7, fillOpacity: 0.65 },
    other: { fill: "#9aa3ad", r: 6, fillOpacity: 0.75 },
  };

  const s = styleMap[payload?.type] ?? styleMap.other;
  return <circle cx={cx} cy={cy} r={s.r} fill={s.fill} fillOpacity={s.fillOpacity} />;
};

export const BarTooltipBox = ({
  visible,
  x,
  y,
  period,
  mean,
  fund,
}) => {
  if (!visible) return null;

  const TOOLTIP_WIDTH = 170;

  let left = x + 14;

  if (left + TOOLTIP_WIDTH > window.innerWidth) {
    left = x - TOOLTIP_WIDTH - 14;
  }

  return (
    <div
      style={{
        position: "absolute",
        left,
        top: Math.max(15, y - 20),
        transform: "translateY(-100%)",
        width: TOOLTIP_WIDTH,
        background: "#172033",
        color: "#fff",
        borderRadius: 10,
        padding: "14px 16px",
        pointerEvents: "none",
        zIndex: 999999,
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        {period}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 5,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 4,
            background: "#7dd3fc",
          }}
        />
        <span style={{ fontSize: 14 }}>
          Mean : {Number(mean).toFixed(2)}%
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#d84d42",
          }}
        />
        <span style={{ fontSize: 14 }}>
          Fund : {Number(fund).toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

export const AnnualizedReturnCanvas = ({
  barData,
  quartileBands,
  yMin,
  yMax,
  yTickInterval,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const [tooltip, setTooltip] = React.useState({
    visible: false,
    x: 0,
    y: 0,
    period: "",
    mean: 0,
    fund: 0,
  });

  const hitRectsRef = useRef([]);

  // Padding configuration
  const PADDING = { top: 28, right: 18, bottom: 50, left: 66 };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w: W, h: H, dpr } = sizeRef.current;
    if (!W || !H) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    ctx.imageSmoothingEnabled = true;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const chartW = W - PADDING.left - PADDING.right;
    const chartH = H - PADDING.top - PADDING.bottom;

    const n = barData.length;
    if (!n) return;

    // yMin should be 0 or close to 0 for bars to start from axis
    const effectiveYMin = Math.min(0, yMin);
    const effectiveYMax = Math.max(yMax, 0);
    const yRange = effectiveYMax - effectiveYMin || 1;
    
    const toY = (val) => PADDING.top + chartH - ((val - effectiveYMin) / yRange) * chartH;
    const axisY = toY(0); // Y position of the x-axis (where y=0)

    const colW = chartW / n;
    const barW = colW * 0.42;
    hitRectsRef.current = [];

    // ── Y axis labels ──────────────────────────────────────────────────
    const step = Number(yTickInterval) > 0 ? Number(yTickInterval) : 5;
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    // Show labels from effectiveYMin to effectiveYMax
    for (let v = effectiveYMin; v <= effectiveYMax; v += step) {
      const py = toY(v);
      ctx.fillText(`${Number(v).toFixed(0)}%`, PADDING.left - 8, py);
    }

    // ── X axis line at y=0 ────────────────────────────────────────────
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING.left, axisY);
    ctx.lineTo(W - PADDING.right, axisY);
    ctx.stroke();

    // ── Y axis line ────────────────────────────────────────────────────
    ctx.beginPath();
    ctx.moveTo(PADDING.left, PADDING.top);
    ctx.lineTo(PADDING.left, PADDING.top + chartH);
    ctx.stroke();

    // ── Quartile boxes ────────────────────────────────────────────────
    barData.forEach((item, i) => {
      const cx = PADDING.left + (i + 0.5) * colW;
      const q = quartileBands[item.period] || {};
      const bLeft = cx - barW / 2;

      // Get values, ensuring they're relative to 0
      const minVal = q.min != null ? q.min : 0;
      const maxVal = q.max != null ? q.max : 0;
      const q1Val = q.q1 != null ? q.q1 : 0;
      const q3Val = q.q3 != null ? q.q3 : 0;
      const q2Val = q.q2 != null ? q.q2 : 0;

      // Calculate Y positions relative to axis
      const yMinPos = toY(Math.min(minVal, 0));
      const yMaxPos = toY(Math.max(maxVal, 0));
      const yQ1Pos = toY(Math.min(q1Val, 0));
      const yQ3Pos = toY(Math.max(q3Val, 0));
      const yQ2Pos = toY(q2Val);

      // Full range box - always starting from axis (y=0) going upward
      if (q.min != null && q.max != null) {
        const boxTop = yMaxPos;
        const boxBottom = axisY; // Start from axis
        const boxHeight = boxBottom - boxTop;

        if (boxHeight > 0) {
          ctx.fillStyle = "rgba(173,216,230,0.25)";
          ctx.strokeStyle = "#93c8d8";
          ctx.lineWidth = 0.8;
          ctx.fillRect(bLeft, boxTop, barW, boxHeight);
          ctx.strokeRect(bLeft, boxTop, barW, boxHeight);

          // Whiskers at top
          ctx.strokeStyle = "#7ab8cc";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - barW / 4, boxTop);
          ctx.lineTo(cx + barW / 4, boxTop);
          ctx.stroke();
        }
      }

      // IQR box - always starting from axis going upward
      if (q.q1 != null && q.q3 != null) {
        const boxTop = yQ3Pos;
        const boxBottom = axisY; // Start from axis
        const boxHeight = boxBottom - boxTop;

        if (boxHeight > 0) {
          ctx.fillStyle = "rgba(135,200,218,0.45)";
          ctx.strokeStyle = "#6aafca";
          ctx.lineWidth = 0.8;
          ctx.fillRect(bLeft, boxTop, barW, boxHeight);
          ctx.strokeRect(bLeft, boxTop, barW, boxHeight);
        }
      }

      // Mean line
      if (q.q2 != null) {
        ctx.strokeStyle = "#3a95af";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bLeft, yQ2Pos);
        ctx.lineTo(bLeft + barW, yQ2Pos);
        ctx.stroke();
      }

      // Tooltip hit area
      hitRectsRef.current.push({
        x1: bLeft,
        x2: bLeft + barW,
        y1: PADDING.top,
        y2: PADDING.top + chartH,
        period: item.period,
        mean: item.mean,
        fund: item.fund,
      });

      // X axis label
      ctx.fillStyle = "#0f172a";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(item.period, cx, axisY + 8);
    });

    // ── Mean connecting line ──────────────────────────────────────────
    ctx.strokeStyle = "#2a9d8f";
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    barData.forEach((item, i) => {
      const cx = PADDING.left + (i + 0.5) * colW;
      const py = toY(item.mean);
      if (i === 0) ctx.moveTo(cx, py);
      else ctx.lineTo(cx, py);
    });
    ctx.stroke();

    // Mean dots
    barData.forEach((item, i) => {
      const cx = PADDING.left + (i + 0.5) * colW;
      const py = toY(item.mean);
      ctx.beginPath();
      ctx.arc(cx, py, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#2a9d8f";
      ctx.fill();
    });

    // Red fund dots
    barData.forEach((item, i) => {
      const cx = PADDING.left + (i + 0.5) * colW;
      const py = toY(item.fund);
      ctx.beginPath();
      ctx.arc(cx, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#c8483f";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  };

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const w = container.clientWidth;
      const h = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      sizeRef.current = { w, h, dpr };

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);

      draw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [barData, quartileBands, yMin, yMax, yTickInterval]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = hitRectsRef.current.find(
      (r) => mx >= r.x1 && mx <= r.x2 && my >= r.y1 && my <= r.y2
    );

    if (hit) {
      setTooltip({
        visible: true,
        x: mx,
        y: my,
        period: hit.period,
        mean: hit.mean,
        fund: hit.fund,
      });
    } else {
      setTooltip((t) => ({ ...t, visible: false }));
    }
  };

  const handleMouseLeave = () =>
    setTooltip((t) => ({ ...t, visible: false }));

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "visible",
        zIndex: 9999,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label="Annualized return chart showing quartile boxes, fund dots, and mean line"
      />
      <BarTooltipBox {...tooltip} />
    </div>
  );
};