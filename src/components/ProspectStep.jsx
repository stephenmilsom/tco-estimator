import { C, INDUSTRIES, CONTRACT_LENGTHS, CURRENCIES, DEFAULT_UPLIFT } from "../data/constants.js";
import { fmt } from "../data/format.js";
import NumberInput from "./NumberInput.jsx";

const inputStyle = {
  width: "100%", boxSizing: "border-box",
  border: `1.5px solid ${C.grey200}`, borderRadius: 8,
  padding: "11px 14px", fontSize: 14, color: C.black,
  background: C.white, outline: "none", fontFamily: "inherit",
};

function FieldLabel({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.grey700, marginBottom: 7 }}>
      {children}
    </label>
  );
}

function FieldNote({ children }) {
  return <div style={{ fontSize: 11, color: C.grey500, marginTop: 5 }}>{children}</div>;
}

function TextInput({ id, value, onChange, placeholder }) {
  return (
    <input id={id} type="text" value={value} onChange={onChange} placeholder={placeholder}
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = C.purple}
      onBlur={e => e.target.style.borderColor = C.grey200}
    />
  );
}

function SelectInput({ id, value, onChange, children }) {
  return (
    <select id={id} value={value} onChange={onChange}
      style={{
        ...inputStyle, cursor: "pointer", appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B2FA0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
      }}
      onFocus={e => e.target.style.borderColor = C.purple}
      onBlur={e => e.target.style.borderColor = C.grey200}
    >
      {children}
    </select>
  );
}

function SectionHeading({ label }) {
  return (
    <div style={{ gridColumn: "1/-1", margin: "32px 0 20px", paddingBottom: 10, borderBottom: `2px solid ${C.purple}` }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
    </div>
  );
}

export default function ProspectStep({ inputs, onChange }) {
  const { revenue, industryIdx, erpPct, currentMaintenance, upgradeCost, upgradeSplit, acv, contractYears, upliftPct = DEFAULT_UPLIFT, currency = "EUR", prospectName } = inputs;

  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const symbol      = currencyObj.symbol;
  const industry    = INDUSTRIES[industryIdx];
  const revNum      = parseFloat(String(revenue).replace(/,/g, "")) || 0;
  const itBudget    = revNum * industry.pct;
  const erpBudget   = itBudget * (erpPct / 100);
  const upgradeNum  = parseFloat(String(upgradeCost).replace(/,/g, "")) || 0;

  const set = key => e => onChange(key, e.target.value);

  return (
    <div style={{ width: "100%" }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: C.black, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
        Opportunity profile
      </h2>
      <p style={{ fontSize: 14, color: C.grey500, marginBottom: 0 }}>
        Enter the opportunity details to generate benchmark-driven cost estimates.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0 32px" }}>

        <SectionHeading label="Company profile" />

        <div style={{ gridColumn: "1/3", marginBottom: 24 }}>
          <FieldLabel htmlFor="pname">Prospect name</FieldLabel>
          <TextInput id="pname" value={prospectName} onChange={set("prospectName")} placeholder="e.g. Haulotte Group" />
        </div>

        <div style={{ marginBottom: 24 }}>
          <FieldLabel htmlFor="rev">Annual revenue ({symbol})</FieldLabel>
          <NumberInput id="rev" value={revenue} onChange={v => onChange("revenue", v)} placeholder="e.g. 510,700,000" prefix={symbol} />
          <FieldNote>Full value — e.g. 510700000 for {symbol}510.7m</FieldNote>
        </div>

        <div style={{ marginBottom: 24 }}>
          <FieldLabel htmlFor="ind">Industry sector</FieldLabel>
          <SelectInput id="ind" value={industryIdx} onChange={e => onChange("industryIdx", parseInt(e.target.value))}>
            {INDUSTRIES.map((ind, i) => <option key={i} value={i}>{ind.label}</option>)}
          </SelectInput>
          <FieldNote>
            Gartner benchmark: {(industry.pct * 100).toFixed(1)}% of revenue
            {itBudget > 0 ? ` = ${fmt(itBudget, symbol)} IT budget` : ""}
          </FieldNote>
        </div>

        <SectionHeading label="On-premise assumptions" />

        <div style={{ marginBottom: 24 }}>
          <FieldLabel htmlFor="erp">ERP as % of IT spend: {erpPct}%</FieldLabel>
          <input id="erp" type="range" min={15} max={40} step={1} value={erpPct}
            onChange={e => onChange("erpPct", parseInt(e.target.value))}
            style={{ width: "100%", accentColor: C.purple, marginTop: 8, marginBottom: 4 }} />
          <FieldNote>ERP budget: {erpBudget > 0 ? fmt(erpBudget, symbol) : "—"} · Typically 20–30%</FieldNote>
        </div>

        <div style={{ marginBottom: 24 }}>
          <FieldLabel htmlFor="maint">Current ERP maintenance ({symbol} / year)</FieldLabel>
          <NumberInput id="maint" value={currentMaintenance} onChange={v => onChange("currentMaintenance", v)} placeholder="Leave blank to use benchmark" prefix={symbol} />
          <FieldNote>Overrides the Gartner benchmark if provided</FieldNote>
        </div>

        <div style={{ marginBottom: 24 }}>
          <FieldLabel htmlFor="upg">Implementation project cost ({symbol})</FieldLabel>
          <NumberInput id="upg" value={upgradeCost} onChange={v => onChange("upgradeCost", v)} placeholder="e.g. 2,000,000" prefix={symbol} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <FieldLabel htmlFor="split">Y1 / Y2 split: {upgradeSplit}% / {100 - upgradeSplit}%</FieldLabel>
          <input id="split" type="range" min={10} max={90} step={5} value={upgradeSplit}
            onChange={e => onChange("upgradeSplit", parseInt(e.target.value))}
            style={{ width: "100%", accentColor: C.purple, marginTop: 8, marginBottom: 4 }} />
          <FieldNote>Y1: {fmt((upgradeNum * upgradeSplit) / 100, symbol)} · Y2: {fmt(upgradeNum * (1 - upgradeSplit / 100), symbol)}</FieldNote>
        </div>

        <SectionHeading label="SaaS proposal" />

        <div style={{ marginBottom: 24 }}>
          <FieldLabel htmlFor="acv">Infor CloudSuite ACV ({symbol} / year) *</FieldLabel>
          <NumberInput id="acv" value={acv} onChange={v => onChange("acv", v)} placeholder="e.g. 480,000" prefix={symbol} />
          <FieldNote>Full annual value — e.g. 480000 for {symbol}480k ACV</FieldNote>
        </div>

        <div style={{ marginBottom: 24 }}>
          <FieldLabel htmlFor="clen">Contract / analysis period</FieldLabel>
          <SelectInput id="clen" value={contractYears} onChange={e => onChange("contractYears", parseInt(e.target.value))}>
            {CONTRACT_LENGTHS.map(y => <option key={y} value={y}>{y} years</option>)}
          </SelectInput>
          <FieldNote>TCO analysis will cover this many years</FieldNote>
        </div>

        <SectionHeading label="Model assumptions" />

        <div style={{ marginBottom: 24 }}>
          <FieldLabel htmlFor="uplift">Annual cost uplift factor (%)</FieldLabel>
          <input id="uplift" type="number" min={0} max={20} step={0.5}
            value={upliftPct}
            onChange={e => onChange("upliftPct", parseFloat(e.target.value) || 0)}
            style={{ ...inputStyle }}
            onFocus={e => e.target.style.borderColor = C.purple}
            onBlur={e => e.target.style.borderColor = C.grey200}
          />
          <FieldNote>Applied to Year 2 onwards in all cost projections</FieldNote>
        </div>

        <div style={{ marginBottom: 24 }}>
          <FieldLabel htmlFor="currency">Currency</FieldLabel>
          <SelectInput id="currency" value={currency} onChange={e => onChange("currency", e.target.value)}>
            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </SelectInput>
          <FieldNote>All monetary values will display in this currency</FieldNote>
        </div>

      </div>
    </div>
  );
}
