import { useState, useCallback } from "react";
import { C, CURRENCIES } from "./data/constants.js";
import { useTco } from "./hooks/useTco.js";

import TopBar         from "./components/TopBar.jsx";
import Stepper        from "./components/Stepper.jsx";
import Footer         from "./components/Footer.jsx";
import StepNav        from "./components/StepNav.jsx";
import WelcomeStep    from "./components/WelcomeStep.jsx";
import ProspectStep   from "./components/ProspectStep.jsx";
import OnPremStep     from "./components/OnPremStep.jsx";
import SaasStep       from "./components/SaasStep.jsx";
import ComparisonStep from "./components/ComparisonStep.jsx";

const DEFAULT_INPUTS = {
  prospectName: "", revenue: "", industryIdx: 0, erpPct: 25,
  currentMaintenance: "", upgradeCost: "2000000", upgradeSplit: 40,
  acv: "", contractYears: 5, upliftPct: 3, currency: "EUR",
};

// Maximum content width — prevents tennis-match eye movement on ultra-wide screens
const MAX_CONTENT_WIDTH = 1440;

export default function App() {
  const [step,         setStep]         = useState(0);
  const [inputs,       setInputs]       = useState(DEFAULT_INPUTS);
  const [tableEditing, setTableEditing] = useState(false);

  const handleChange    = (key, value) => setInputs(prev => ({ ...prev, [key]: value }));
  const handleEditState = useCallback(dirty => setTableEditing(dirty), []);
  const reset = () => { setStep(0); setInputs(DEFAULT_INPUTS); setTableEditing(false); };
  const goToStep = n => { setTableEditing(false); setStep(n); };

  const { maintNum, acvNum, onPremSections, saasSections, onPremTotals, saasTotals, years, uplift, currency } = useTco(inputs);

  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const symbol      = currencyObj.symbol;

  const baseCanProceed = step === 0 || (inputs.revenue !== "" && inputs.acv !== "");
  const canProceed     = baseCanProceed && !tableEditing;

  const renderStep = () => {
    switch (step) {
      case 0: return <WelcomeStep />;
      case 1: return <ProspectStep inputs={inputs} onChange={handleChange} />;
      case 2: return <OnPremStep   sections={onPremSections} prospectName={inputs.prospectName} hasCustomMaint={maintNum > 0} years={years} upliftPct={uplift} symbol={symbol} onEditStateChange={handleEditState} />;
      case 3: return <SaasStep     sections={saasSections}   prospectName={inputs.prospectName} acvNum={acvNum} years={years} upliftPct={uplift} symbol={symbol} onEditStateChange={handleEditState} />;
      case 4: return <ComparisonStep onPremTotals={onPremTotals} saasTotals={saasTotals} prospectName={inputs.prospectName} years={years} symbol={symbol} upliftPct={uplift} />;
      default: return null;
    }
  };

  const TOPBAR_H  = 56;
  const STEPPER_H = step > 0 ? 56 : 0;
  const NAV_H     = 56;
  const FOOTER_H  = 40;

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      height: "100vh", display: "flex", flexDirection: "column",
      color: C.black, background: C.white, overflow: "hidden",
    }}>

      {/* ── TopBar — full bleed but content centred ── */}
      <TopBar maxWidth={MAX_CONTENT_WIDTH} />

      {/* ── Stepper bar — full bleed, content centred ── */}
      {step > 0 && (
        <div style={{
          height: STEPPER_H,
          borderBottom: `1px solid ${C.grey100}`,
          background: C.white,
          flexShrink: 0,
        }}>
          <div style={{
            maxWidth: MAX_CONTENT_WIDTH,
            margin: "0 auto",
            height: "100%",
            display: "flex",
            alignItems: "center",
            padding: "0 40px",
            boxSizing: "border-box",
          }}>
            <Stepper step={step} onNavigate={goToStep} />
          </div>
        </div>
      )}

      {/* ── Scrollable content ── */}
      <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {step === 0 ? (
          // Welcome: full-bleed layout, hero handles its own internal width
          <div style={{ minHeight: `calc(100vh - ${TOPBAR_H + NAV_H + FOOTER_H}px)` }}>
            <WelcomeStep maxWidth={MAX_CONTENT_WIDTH} />
          </div>
        ) : (
          <div style={{
            maxWidth: MAX_CONTENT_WIDTH,
            margin: "0 auto",
            padding: "36px 40px",
            boxSizing: "border-box",
          }}>
            {renderStep()}
          </div>
        )}
      </main>

      {/* ── Nav bar — full bleed, content centred ── */}
      <div style={{
        height: NAV_H,
        borderTop: `1px solid ${tableEditing ? C.amber : C.grey100}`,
        background: tableEditing ? "#fffbeb" : C.white,
        flexShrink: 0,
        transition: "all 0.2s",
      }}>
        <div style={{
          maxWidth: MAX_CONTENT_WIDTH,
          margin: "0 auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
          boxSizing: "border-box",
        }}>
          {tableEditing && (
            <span style={{ fontSize: 12, color: C.amber, fontWeight: 600 }}>
              ⚠️ You have unsaved edits — save or cancel before continuing
            </span>
          )}
          <StepNav
            onRestart={() => { reset(); goToStep(0); }}
            step={step}
            onBack={() => goToStep(step - 1)}
            onNext={() => goToStep(step + 1)}
            onReset={reset}
            canProceed={canProceed}
          />
        </div>
      </div>

      {/* ── Footer — full bleed, content centred ── */}
      <Footer maxWidth={MAX_CONTENT_WIDTH} />
    </div>
  );
}
