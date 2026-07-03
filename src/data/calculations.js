// Project base value forward using uplift rate
export function project(base, years = 5, upliftPct = 3) {
  const rate = 1 + upliftPct / 100;
  return Array.from({ length: years }, (_, i) => Math.round(base * Math.pow(rate, i)));
}

// Project from a known Year 1 value forward
export function projectFromY1(y1, years, upliftPct) {
  const rate = 1 + upliftPct / 100;
  return Array.from({ length: years }, (_, i) => Math.round(y1 * Math.pow(rate, i)));
}

export function sectionTotals(sections, years) {
  const totals = Array(years).fill(0);
  sections.forEach(s =>
    s.rows.forEach(r =>
      r.vals.forEach((v, i) => { if (i < years) totals[i] += v; })
    )
  );
  return totals;
}

export function buildOnPremSections(itBudget, erpPct, upgradeCost, upgradeSplit, currentMaintenance, years = 5, upliftPct = 3) {
  const erp       = itBudget * (erpPct / 100);
  const dc        = itBudget * 0.13;
  const hw        = itBudget * 0.15;
  const dr        = itBudget * 0.05;
  const itOrg     = itBudget * 0.40;
  const outsource = itBudget * 0.25;
  const appSup    = itBudget * 0.18;
  const y1ext     = (upgradeSplit / 100) * upgradeCost;
  const y2ext     = upgradeCost - y1ext;
  const maintLine = currentMaintenance > 0 ? currentMaintenance : erp * 0.40;

  const p = (base) => project(base, years, upliftPct);

  const upgradeExt = Array(years).fill(0);
  upgradeExt[0] = Math.round(y1ext);
  if (years > 1) upgradeExt[1] = Math.round(y2ext);

  const upgradeInt = Array(years).fill(0);
  upgradeInt[0] = Math.round(y1ext * 0.30);
  if (years > 1) upgradeInt[1] = Math.round(y2ext * 0.30);

  return [
    {
      id: "hw", label: "Hardware Cost", color: "#b45309", bg: "#fef9ee",
      rows: [
        { label: "Hardware refresh (new servers, virtual environments, racks)",   note: "ERP share of hardware capex (25%)",       vals: p(hw * 0.23 * 0.25) },
        { label: "Hardware installation costs",                                    note: "10% of refresh value",                   vals: p(hw * 0.23 * 0.25 * 0.10) },
      ],
    },
    {
      id: "infra", label: "Infrastructure Costs", color: "#1d4ed8", bg: "#eff6ff",
      rows: [
        { label: "Database maintenance",                                            note: "ERP share of data centre budget",        vals: p(dc * 0.15 * 0.25) },
        { label: "Hardware & storage maintenance",                                  note: "ERP share of data centre budget",        vals: p(dc * 0.30 * 0.25) },
        { label: "Annual facilities costs (power, AC, real estate, insurance)",    note: "ERP share of data centre budget",        vals: p(dc * 0.25 * 0.25) },
        { label: "Third party hosting & services costs",                           note: "ERP share of data centre budget",        vals: p(dc * 0.20 * 0.25) },
        { label: "OS & VM maintenance",                                            note: "ERP share of data centre budget",        vals: p(dc * 0.10 * 0.25) },
      ],
    },
    {
      id: "risk", label: "Risk Costs", color: "#b91c1c", bg: "#fef2f2",
      rows: [
        { label: "Disaster recovery (hardware, database, etc.)",                   note: "ERP share of DR budget",                 vals: p(dr * 0.60 * 0.40) },
        { label: "Other DR costs (additional licences, testing, etc.)",            note: "ERP share of DR budget",                 vals: p(dr * 0.40 * 0.40) },
      ],
    },
    {
      id: "itres", label: "IT Resource Costs", color: "#166534", bg: "#f0fdf4",
      rows: [
        { label: "Technical IT resource supporting Infor apps (DBAs, Sys/OS/Server Admins)", note: "40% of application support headcount", vals: p(appSup * 0.40) },
        { label: "Cost to recruit new IT hires",                                   note: "ERP share of IT org recruiting budget",  vals: p(itOrg * 0.05 * 0.25) },
        { label: "Technical IT resource training",                                 note: "ERP share of IT org training budget",    vals: p(itOrg * 0.03 * 0.25) },
      ],
    },
    {
      id: "app", label: "Application Maintenance", color: "#6b21a8", bg: "#faf5ff",
      rows: [
        { label: "Current enterprise systems on-premise maintenance costs",
          note: currentMaintenance > 0 ? "Customer-provided actual" : "Benchmark: 40% of ERP budget",
          vals: p(maintLine), customerActual: currentMaintenance > 0 },
        { label: "New software planned to be replaced by Infor cloud",             note: "20% of ERP budget",                     vals: p(erp * 0.20) },
        { label: "Annual maintenance support for new software",                    note: "22% of new software value",             vals: p(erp * 0.20 * 0.22) },
        { label: "Provision for new bespoke modifications",                        note: "8% of ERP budget",                      vals: p(erp * 0.08) },
        { label: "Annual support of existing bespoke modifications",               note: "6% of ERP budget",                      vals: p(erp * 0.06) },
        { label: "Other server application costs",                                 note: "6% of ERP budget",                      vals: p(erp * 0.06) },
      ],
    },
    {
      id: "svc", label: "Services", color: "#374151", bg: "#f9fafb",
      rows: [
        { label: "Annual spend on enterprise systems related services",            note: "ERP share of outsourcing budget",        vals: p(outsource * 0.25 * 0.20) },
        { label: "External cost to complete an upgrade (integrations, uplifting mods)",
          note: `${Math.round(upgradeSplit)}% Y1 / ${Math.round(100 - upgradeSplit)}% Y2`,
          vals: upgradeExt, fixed: true },
        { label: "Internal cost to upgrade enterprise systems",                    note: "30% of external upgrade cost",
          vals: upgradeInt, fixed: true },
      ],
    },
  ];
}

export function buildSaaSSections(itBudget, erpPct, upgradeCost, upgradeSplit, acv, years = 5, upliftPct = 3) {
  const y1ext = (upgradeSplit / 100) * upgradeCost;
  const y2ext = upgradeCost - y1ext;

  const p = (base) => project(base, years, upliftPct);

  const upgradeExt = Array(years).fill(0);
  upgradeExt[0] = Math.round(y1ext);
  if (years > 1) upgradeExt[1] = Math.round(y2ext);

  const upgradeInt = Array(years).fill(0);
  upgradeInt[0] = Math.round(y1ext * 0.30);
  if (years > 1) upgradeInt[1] = Math.round(y2ext * 0.30);

  return [
    {
      id: "saas", label: "CloudSuite Subscription", color: "#6B2FA0", bg: "#f5f0ff",
      rows: [
        { label: "Infor CloudSuite Annual Contract Value (ACV)",   note: "Proposed annual subscription", vals: p(acv) },
        { label: "Annual maintenance support for bespoke modifications", note: "5% of ACV",             vals: p(acv * 0.05) },
        { label: "Other cloud application costs",                   note: "3% of ACV",                  vals: p(acv * 0.03) },
      ],
    },
    {
      id: "svc", label: "Project Costs", color: "#374151", bg: "#f9fafb",
      rows: [
        { label: "External cost for cloud migration project",
          note: `${Math.round(upgradeSplit)}% Y1 / ${Math.round(100 - upgradeSplit)}% Y2`,
          vals: upgradeExt, fixed: true },
        { label: "Internal cost for cloud migration project", note: "30% of external project cost",
          vals: upgradeInt, fixed: true },
      ],
    },
  ];
}
