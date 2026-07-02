import { useState, useMemo } from "react";

const INDUSTRIES = [
  { label: "Construction & Natural Resources", pct: 0.012 },
  { label: "Industrial Manufacturing", pct: 0.019 },
  { label: "Transportation", pct: 0.032 },
  { label: "Consumer Products", pct: 0.022 },
  { label: "Retail & Wholesale", pct: 0.016 },
  { label: "Food & Beverage", pct: 0.015 },
  { label: "Energy", pct: 0.015 },
  { label: "Chemicals", pct: 0.014 },
  { label: "Healthcare", pct: 0.041 },
  { label: "Professional Services", pct: 0.047 },
];

const UPLIFT = 0.03;

function project(base, years = 5) {
  return Array.from({ length: years }, (_, i) =>
    Math.round(base * Math.pow(1 + UPLIFT, i))
  );
}

function fmt(v, compact = false) {
  if (v === 0) return "—";
  if (compact && v >= 1_000_000)
    return "€" + (v / 1_000_000).toFixed(1) + "m";
  if (compact && v >= 1_000)
    return "€" + Math.round(v / 1_000) + "k";
  return "€" + Math.round(v).toLocaleString("en-GB");
}

function calcRows(itBudget, erpPct, upgradeCost, upgradeSplit) {
  const erp = itBudget * erpPct;
  const dc = itBudget * 0.13;
  const hw = itBudget * 0.15;
  const dr = itBudget * 0.05;
  const itOrg = itBudget * 0.40;
  const outsource = itBudget * 0.25;
  const appSup = itBudget * 0.18;

  const y1split = upgradeSplit / 100;
  const y2split = 1 - y1split;

  const sections = [
    {
      id: "hw", label: "Hardware cost",
      color: "#b45309", bg: "#fef3c7",
      rows: [
        { label: "Hardware refresh (servers, virtual environments, racks)", note: "25% of hardware capex — ERP server estate", vals: project(hw * 0.23 * 0.25) },
        { label: "Hardware installation costs", note: "10% of refresh", vals: project(hw * 0.23 * 0.25 * 0.10) },
      ]
    },
    {
      id: "infra", label: "Infrastructure costs",
      color: "#1d4ed8", bg: "#eff6ff",
      rows: [
        { label: "Database maintenance", note: "ERP share of data centre", vals: project(dc * 0.15 * 0.25) },
        { label: "Hardware & storage maintenance", note: "ERP share of data centre", vals: project(dc * 0.30 * 0.25) },
        { label: "Annual facilities costs (power, AC, real estate, insurance)", note: "ERP share of data centre", vals: project(dc * 0.25 * 0.25) },
        { label: "Third party hosting & services costs", note: "ERP share of data centre", vals: project(dc * 0.20 * 0.25) },
        { label: "OS & VM maintenance", note: "ERP share of data centre", vals: project(dc * 0.10 * 0.25) },
      ]
    },
    {
      id: "risk", label: "Risk costs",
      color: "#b91c1c", bg: "#fef2f2",
      rows: [
        { label: "Disaster recovery (hardware, database, etc.)", note: "ERP share of DR budget", vals: project(dr * 0.60 * 0.40) },
        { label: "Other DR costs (additional licences, testing, etc.)", note: "ERP share of DR budget", vals: project(dr * 0.40 * 0.40) },
      ]
    },
    {
      id: "itres", label: "IT resource costs",
      color: "#166534", bg: "#f0fdf4",
      rows: [
        { label: "Technical IT resource supporting Infor apps (DBAs, Sys/OS/Server Admins)", note: "40% of application support headcount", vals: project(appSup * 0.40) },
        { label: "Cost to recruit new IT hires", note: "ERP share of IT org recruiting", vals: project(itOrg * 0.05 * 0.25) },
        { label: "Technical IT resource training", note: "ERP share of IT org training", vals: project(itOrg * 0.03 * 0.25) },
      ]
    },
    {
      id: "app", label: "Application maintenance",
      color: "#6b21a8", bg: "#faf5ff",
      rows: [
        { label: "Current enterprise systems on-premise maintenance costs", note: "40% of ERP budget — to be replaced by Infor cloud", vals: project(erp * 0.40) },
        { label: "New software planned to be replaced by Infor cloud", note: "20% of ERP budget", vals: project(erp * 0.20) },
        { label: "Annual maintenance support for new software (22%)", note: "22% of new software value", vals: project(erp * 0.20 * 0.22) },
        { label: "Provision for new bespoke modifications", note: "8% of ERP budget", vals: project(erp * 0.08) },
        { label: "Annual support of existing bespoke modifications", note: "6% of ERP budget", vals: project(erp * 0.06) },
        { label: "Other server application costs", note: "6% of ERP budget", vals: project(erp * 0.06) },
      ]
    },
    {
      id: "svc", label: "Services",
      color: "#374151", bg: "#f9fafb",
      rows: [
        { label: "Annual spend on enterprise systems related services", note: "ERP share of outsourcing budget", vals: project(outsource * 0.25 * 0.20) },
        {
          label: "External cost to complete an upgrade (integrations, uplifting mods)",
          note: `€${Math.round(upgradeCost).toLocaleString("en-GB")} total — split ${Math.round(y1split*100)}% / ${Math.round(y2split*100)}% over Y1/Y2`,
          vals: [Math.round(upgradeCost * y1split), Math.round(upgradeCost * y2split), 0, 0, 0],
          fixed: true
        },
        {
          label: "Internal cost to upgrade enterprise systems",
          note: "30% of external upgrade cost",
          vals: [Math.round(upgradeCost * y1split * 0.30), Math.round(upgradeCost * y2split * 0.30), 0, 0, 0],
          fixed: true
        },
      ]
    },
  ];

  return sections;
}

function MetricCard({ label, value, sub }) {
  return (
    <div style={{ background: "#f8f7f4", borderRadius: 10, padding: "12px 16px", minWidth: 0 }}>
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: "#111827", letterSpacing: "-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function InputRow({ label, children, note }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 5 }}>{label}</label>
      {children}
      {note && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>{note}</div>}
    </div>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  border: "1px solid #e5e7eb", borderRadius: 7, padding: "7px 10px",
  fontSize: 13, color: "#111827", background: "#fff",
  outline: "none",
};

const selectStyle = { ...inputStyle, cursor: "pointer" };

export default function App() {
  const [revenue, setRevenue] = useState(510.7);
  const [industryIdx, setIndustryIdx] = useState(0);
  const [erpPct, setErpPct] = useState(25);
  const [upgradeCost, setUpgradeCost] = useState(2_000_000);
  const [upgradeSplit, setUpgradeSplit] = useState(40);
  const [showNotes, setShowNotes] = useState(false);

  const industry = INDUSTRIES[industryIdx];
  const itBudget = (revenue * 1_000_000) * industry.pct;
  const erpBudget = itBudget * (erpPct / 100);

  const sections = useMemo(
    () => calcRows(itBudget, erpPct / 100, upgradeCost, upgradeSplit),
    [itBudget, erpPct, upgradeCost, upgradeSplit]
  );

  const grandTotals = useMemo(() => {
    const totals = [0, 0, 0, 0, 0];
    sections.forEach(s => s.rows.forEach(r => r.vals.forEach((v, i) => { totals[i] += v; })));
    return totals;
  }, [sections]);

  const fiveYearTotal = grandTotals.reduce((a, b) => a + b, 0);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", minHeight: "100vh", background: "#ffffff", color: "#111827" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #f0efeb", padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.02em", color: "#111827" }}>On-premise TCO estimator</div>
          <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>Gartner IT spend benchmarks → TCO template inputs</div>
        </div>
        <div style={{ fontSize: 11, background: "#f3f4f6", padding: "4px 10px", borderRadius: 20, color: "#6b7280" }}>
          Infor pre-sales
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 61px)" }}>

        {/* Left panel — inputs */}
        <div style={{ width: 260, flexShrink: 0, borderRight: "1px solid #f0efeb", padding: "20px 20px", background: "#fafaf9" }}>

          <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Prospect inputs</div>

          <InputRow label="Annual revenue (€m)">
            <input
              type="number" style={inputStyle} value={revenue}
              onChange={e => setRevenue(parseFloat(e.target.value) || 0)}
            />
          </InputRow>

          <InputRow label="Industry" note={`Gartner benchmark: ${(industry.pct * 100).toFixed(1)}% of revenue`}>
            <select style={selectStyle} value={industryIdx} onChange={e => setIndustryIdx(parseInt(e.target.value))}>
              {INDUSTRIES.map((ind, i) => (
                <option key={i} value={i}>{ind.label}</option>
              ))}
            </select>
          </InputRow>

          <div style={{ borderTop: "1px solid #e5e7eb", margin: "20px 0" }} />
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>Assumptions</div>

          <InputRow
            label={`ERP as % of total IT spend: ${erpPct}%`}
            note="Typically 20–30% for industrial / manufacturing"
          >
            <input
              type="range" min={15} max={40} step={1} value={erpPct}
              onChange={e => setErpPct(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#4f46e5" }}
            />
          </InputRow>

          <InputRow label="Upgrade project cost (€)">
            <input
              type="number" style={inputStyle} value={upgradeCost}
              onChange={e => setUpgradeCost(parseFloat(e.target.value) || 0)}
              step={50000}
            />
          </InputRow>

          <InputRow
            label={`Y1 / Y2 upgrade split: ${upgradeSplit}% / ${100 - upgradeSplit}%`}
            note="Remaining spend falls in Year 2"
          >
            <input
              type="range" min={10} max={90} step={5} value={upgradeSplit}
              onChange={e => setUpgradeSplit(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: "#4f46e5" }}
            />
          </InputRow>

          <div style={{ borderTop: "1px solid #e5e7eb", margin: "20px 0" }} />

          {/* Derived budget summary */}
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>Derived budgets</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <MetricCard label="Total IT budget" value={fmt(itBudget, true)} sub={`${(industry.pct * 100).toFixed(1)}% of revenue`} />
            <MetricCard label="ERP-scoped budget" value={fmt(erpBudget, true)} sub={`${erpPct}% of IT budget`} />
          </div>

          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setShowNotes(n => !n)}
              style={{ fontSize: 12, color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
            >
              {showNotes ? "Hide" : "Show"} methodology notes
            </button>
          </div>

          {showNotes && (
            <div style={{ marginTop: 12, fontSize: 11, color: "#9ca3af", lineHeight: 1.6, background: "#f3f4f6", borderRadius: 8, padding: "10px 12px" }}>
              <strong style={{ color: "#6b7280", display: "block", marginBottom: 4 }}>How figures are derived</strong>
              Hardware: 15% of IT budget, 23% capex, 25% ERP share.<br />
              Infrastructure: Gartner data centre (13% of IT), 25% attributed to ERP.<br />
              Risk: DR budget (5% of IT), 40% ERP share.<br />
              IT Resource: 40% of application support headcount.<br />
              App Maintenance: scaled from ERP-scoped budget.<br />
              Services: 20% of outsourcing budget ERP-share + upgrade project.<br />
              3% annual uplift applied from Year 2. Upgrade lines are fixed costs.
            </div>
          )}
        </div>

        {/* Right panel — TCO table */}
        <div style={{ flex: 1, padding: "20px 24px", overflowX: "auto" }}>

          {/* Summary metric cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 24 }}>
            {grandTotals.map((v, i) => (
              <MetricCard key={i} label={`Year ${i + 1}`} value={fmt(v, true)} />
            ))}
            <MetricCard label="5-year total" value={fmt(fiveYearTotal, true)} sub="on-premise TCO" />
          </div>

          {/* Table */}
          <div style={{ fontSize: 12 }}>
            {/* Column header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 100px 100px",
              padding: "6px 10px", borderBottom: "2px solid #e5e7eb",
              color: "#9ca3af", fontWeight: 600, fontSize: 11, letterSpacing: "0.04em"
            }}>
              <div>Cost item</div>
              {["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"].map(y => (
                <div key={y} style={{ textAlign: "right" }}>{y}</div>
              ))}
            </div>

            {sections.map(sec => (
              <div key={sec.id} style={{ marginBottom: 2 }}>
                {/* Section header */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 100px 100px",
                  padding: "7px 10px", background: sec.bg,
                  borderLeft: `3px solid ${sec.color}`, marginTop: 10,
                  borderRadius: "0 6px 6px 0",
                }}>
                  <div style={{ fontWeight: 600, color: sec.color, fontSize: 12 }}>{sec.label}</div>
                  {sec.rows.reduce((acc, r) => {
                    r.vals.forEach((v, i) => { acc[i] = (acc[i] || 0) + v; });
                    return acc;
                  }, [0,0,0,0,0]).map((v, i) => (
                    <div key={i} style={{ textAlign: "right", fontWeight: 600, color: sec.color, fontSize: 12 }}>
                      {fmt(v, true)}
                    </div>
                  ))}
                </div>

                {/* Data rows */}
                {sec.rows.map((row, ri) => (
                  <div key={ri} style={{
                    display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 100px 100px",
                    padding: "6px 10px 6px 13px",
                    borderBottom: "1px solid #f3f4f6",
                    background: ri % 2 === 0 ? "#ffffff" : "#fafafa",
                    borderLeft: `3px solid ${sec.color}22`,
                  }}>
                    <div>
                      <div style={{ color: "#374151", lineHeight: 1.4 }}>{row.label}</div>
                      {row.note && <div style={{ fontSize: 10, color: "#d1d5db", marginTop: 2 }}>{row.note}</div>}
                    </div>
                    {row.vals.map((v, i) => (
                      <div key={i} style={{
                        textAlign: "right",
                        color: row.fixed && v > 0 ? "#92400e" : v === 0 ? "#d1d5db" : "#374151",
                        fontVariantNumeric: "tabular-nums",
                      }}>
                        {fmt(v)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            {/* Grand total */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 100px 100px 100px 100px 100px",
              padding: "10px 10px", marginTop: 8,
              borderTop: "2px solid #111827", borderBottom: "2px solid #111827",
              background: "#111827", borderRadius: 6,
            }}>
              <div style={{ fontWeight: 600, color: "#ffffff", fontSize: 13 }}>Total on-premise cash flow</div>
              {grandTotals.map((v, i) => (
                <div key={i} style={{ textAlign: "right", fontWeight: 600, color: "#ffffff", fontVariantNumeric: "tabular-nums", fontSize: 13 }}>
                  {fmt(v)}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16, fontSize: 11, color: "#d1d5db", lineHeight: 1.6 }}>
            Annual uplift of 3% applied from Year 2. Upgrade project lines are fixed costs (amber). All figures in EUR (€).
            Benchmarks sourced from Gartner IT Key Metrics Data.
          </div>
        </div>
      </div>
    </div>
  );
}
