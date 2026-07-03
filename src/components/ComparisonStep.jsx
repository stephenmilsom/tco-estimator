import { C } from "../data/constants.js";
import { fmt, fmtFull } from "../data/format.js";
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: C.white, border: `1px solid ${C.grey200}`,
      borderRadius: 8, padding: "10px 14px", fontSize: 13,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: C.grey900 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>{p.name}: {fmt(p.value, symbol)}</div>
      ))}
    </div>
  );
}

export default function ComparisonStep({ onPremTotals, saasTotals, prospectName, years = 5, symbol = "€", upliftPct = 3 }) {
  const yearNums    = Array.from({ length: years }, (_, i) => i + 1);
  const savings     = yearNums.map((_, i) => onPremTotals[i] - saasTotals[i]);
  const cumSavings  = savings.reduce((acc, v, i) => { acc.push((acc[i - 1] || 0) + v); return acc; }, []);
  const onPremTotal = onPremTotals.reduce((a, b) => a + b, 0);
  const saasTotal   = saasTotals.reduce((a, b) => a + b, 0);
  const totalSaving = onPremTotal - saasTotal;
  const breakevenYr = cumSavings.findIndex(v => v > 0);

  const chartData = yearNums.map((y, i) => ({
    year:                `Year ${y}`,
    "On-Premise":        Math.round(onPremTotals[i]),
    "Infor Cloud":       Math.round(saasTotals[i]),
    "Cumulative Saving": Math.round(cumSavings[i]),
  }));

  const kpis = [
    { label: `${years}-year on-premise TCO`,  value: fmt(onPremTotal, symbol), sub: "total cost of ownership",   color: C.red    },
    { label: `${years}-year Infor cloud TCO`,  value: fmt(saasTotal, symbol),  sub: "total cost of ownership",   color: C.purple },
    {
      label: totalSaving >= 0 ? `${years}-year cloud saving` : `${years}-year cloud premium`,
      value: fmt(Math.abs(totalSaving), symbol),
      sub: totalSaving >= 0
        ? `Break-even: ${breakevenYr >= 0 ? "Year " + (breakevenYr + 1) : `beyond Year ${years}`}`
        : "on-premise is lower TCO",
      color: totalSaving >= 0 ? C.green : C.amber,
    },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: C.black, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
        Scenario comparison
      </h2>
      <p style={{ fontSize: 14, color: C.grey500, marginBottom: 28, marginTop: 0 }}>
        {years}-year cost comparison for {prospectName || "the prospect"}: on-premise versus Infor CloudSuite.
      </p>

      {/* KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            background: C.white, border: `1px solid ${C.grey100}`,
            borderRadius: 12, padding: "20px 24px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <div style={{ fontSize: 11, color: C.grey500, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: kpi.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: C.grey500, marginTop: 8 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{
        background: C.white, border: `1px solid ${C.grey100}`,
        borderRadius: 12, padding: "24px", marginBottom: 24,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.grey900, marginBottom: 4 }}>
          Annual cost comparison & cumulative saving
        </div>
        <div style={{ fontSize: 12, color: C.grey500, marginBottom: 20 }}>
          Bars show annual spend per scenario. Line shows cumulative saving from choosing Infor cloud (right axis).
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 50, left: 20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.grey100} vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: C.grey500 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left"  tickFormatter={v => fmt(v, symbol)} tick={{ fontSize: 11, fill: C.grey500 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={v => fmt(v, symbol)} tick={{ fontSize: 11, fill: C.grey500 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
            <Bar yAxisId="left" dataKey="On-Premise"  fill={C.red}    radius={[4, 4, 0, 0]} opacity={0.85} />
            <Bar yAxisId="left" dataKey="Infor Cloud" fill={C.purple} radius={[4, 4, 0, 0]} opacity={0.85} />
            <Line yAxisId="right" type="monotone" dataKey="Cumulative Saving" stroke={C.black} strokeWidth={2.5} dot={{ r: 4, fill: C.black }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Year-by-year table */}
      <div style={{
        background: C.white, border: `1px solid ${C.grey100}`,
        borderRadius: 12, padding: "24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.grey900, marginBottom: 16 }}>
          Year-by-year breakdown
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.grey900 }}>
                <th style={{ padding: "10px 14px", textAlign: "left", color: C.white, fontWeight: 700, borderRadius: "8px 0 0 0" }}>Scenario</th>
                {yearNums.map(y => (
                  <th key={y} style={{ padding: "10px 14px", textAlign: "right", color: C.white, fontWeight: 700 }}>Year {y}</th>
                ))}
                <th style={{ padding: "10px 14px", textAlign: "right", color: C.white, fontWeight: 700, borderRadius: "0 8px 0 0" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: "#fff5f5" }}>
                <td style={{ padding: "10px 14px", fontWeight: 600, color: C.red }}>On-Premise</td>
                {onPremTotals.map((v, i) => (
                  <td key={i} style={{ padding: "10px 14px", textAlign: "right", color: C.grey700, fontVariantNumeric: "tabular-nums" }}>{fmtFull(v, symbol)}</td>
                ))}
                <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: C.red }}>{fmt(onPremTotal, symbol)}</td>
              </tr>
              <tr style={{ background: C.purpleLight }}>
                <td style={{ padding: "10px 14px", fontWeight: 600, color: C.purple }}>Infor Cloud</td>
                {saasTotals.map((v, i) => (
                  <td key={i} style={{ padding: "10px 14px", textAlign: "right", color: C.grey700, fontVariantNumeric: "tabular-nums" }}>{fmtFull(v, symbol)}</td>
                ))}
                <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700, color: C.purple }}>{fmt(saasTotal, symbol)}</td>
              </tr>
              <tr style={{ background: totalSaving >= 0 ? "#f0fdf4" : "#fffbeb", borderTop: `2px solid ${C.grey200}` }}>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: totalSaving >= 0 ? C.green : C.amber }}>
                  {totalSaving >= 0 ? "Cloud saving" : "Cloud premium"}
                </td>
                {savings.map((v, i) => (
                  <td key={i} style={{ padding: "10px 14px", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: v >= 0 ? C.green : C.amber }}>
                    {v >= 0 ? fmtFull(v, symbol) : `(${fmtFull(Math.abs(v), symbol)})`}
                  </td>
                ))}
                <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: totalSaving >= 0 ? C.green : C.amber }}>
                  {totalSaving >= 0 ? fmt(totalSaving, symbol) : `(${fmt(Math.abs(totalSaving), symbol)})`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
