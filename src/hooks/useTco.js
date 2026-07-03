import { useMemo } from "react";
import { INDUSTRIES } from "../data/constants.js";
import { buildOnPremSections, buildSaaSSections, sectionTotals } from "../data/calculations.js";

function parseNum(v) {
  return parseFloat(String(v).replace(/,/g, "")) || 0;
}

export function useTco(inputs) {
  const {
    revenue, industryIdx, erpPct, currentMaintenance,
    upgradeCost, upgradeSplit, acv,
    contractYears = 5, upliftPct = 3, currency = "EUR",
  } = inputs;

  const revNum     = parseNum(revenue);
  const maintNum   = parseNum(currentMaintenance);
  const acvNum     = parseNum(acv);
  const upgradeNum = parseNum(upgradeCost);
  const years      = contractYears;
  const uplift     = parseFloat(upliftPct) || 3;

  const itBudget  = revNum * INDUSTRIES[industryIdx].pct;
  const erpBudget = itBudget * (erpPct / 100);

  const onPremSections = useMemo(() =>
    buildOnPremSections(itBudget, erpPct, upgradeNum, upgradeSplit, maintNum, years, uplift),
    [itBudget, erpPct, upgradeNum, upgradeSplit, maintNum, years, uplift]
  );

  const saasSections = useMemo(() =>
    buildSaaSSections(itBudget, erpPct, upgradeNum, upgradeSplit, acvNum, years, uplift),
    [itBudget, erpPct, upgradeNum, upgradeSplit, acvNum, years, uplift]
  );

  const onPremTotals = useMemo(() => sectionTotals(onPremSections, years), [onPremSections, years]);
  const saasTotals   = useMemo(() => sectionTotals(saasSections, years),   [saasSections, years]);

  return { itBudget, erpBudget, revNum, maintNum, acvNum, upgradeNum, onPremSections, saasSections, onPremTotals, saasTotals, years, uplift, currency };
}
