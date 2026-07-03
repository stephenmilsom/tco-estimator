import { useState } from "react";
import { C } from "../data/constants.js";

// Displays formatted number with commas while editing shows raw digits
// Accepts full integers (e.g. 510700000 for €510.7m revenue)
export default function NumberInput({ id, value, onChange, placeholder, prefix = "" }) {
  const [focused, setFocused] = useState(false);

  // Strip commas to get raw numeric string
  const raw = String(value).replace(/,/g, "");
  const num = parseFloat(raw);

  // Format with commas for display
  const formatted = (!focused && num && !isNaN(num))
    ? Math.round(num).toLocaleString("en-GB")
    : raw;

  const handleChange = (e) => {
    // Only allow digits
    const digits = e.target.value.replace(/[^0-9]/g, "");
    onChange(digits);
  };

  const handleFocus = (e) => {
    setFocused(true);
    // Move cursor to end
    setTimeout(() => e.target.setSelectionRange(e.target.value.length, e.target.value.length), 0);
  };

  const handleBlur = (e) => {
    setFocused(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {prefix && (
        <span style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          fontSize: 14, color: C.grey500, pointerEvents: "none", zIndex: 1,
        }}>
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="text"
        inputMode="numeric"
        value={focused ? raw : formatted}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box",
          border: `1.5px solid ${C.grey200}`, borderRadius: 8,
          padding: prefix ? "11px 14px 11px 28px" : "11px 14px",
          fontSize: 14, color: C.black,
          background: C.white, outline: "none", fontFamily: "inherit",
          fontVariantNumeric: "tabular-nums",
        }}
        onFocus={e => { handleFocus(e); e.target.style.borderColor = C.purple; }}
        onBlur={e => { handleBlur(e); e.target.style.borderColor = C.grey200; }}
      />
    </div>
  );
}
