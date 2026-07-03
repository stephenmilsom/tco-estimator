import { useState, useEffect } from "react";
import { projectFromY1 } from "../data/calculations.js";

// Only Year 1 is editable. Years 2+ are derived: Y1_override × uplift^(n-1)
export function useEditableTable(sections, years, upliftPct) {
  const [editing,   setEditing]   = useState(false);
  const [y1Overrides, setY1Overrides] = useState({}); // { "sectionId-rowIdx": y1Value }
  const [draftY1,   setDraftY1]   = useState({});
  const [isDirty,   setIsDirty]   = useState(false);

  // Reset when base data changes
  useEffect(() => {
    setY1Overrides({});
    setDraftY1({});
    setEditing(false);
    setIsDirty(false);
  }, [JSON.stringify(sections.map(s => s.rows.map(r => r.vals[0])))]);

  const startEdit = () => {
    const d = {};
    sections.forEach(sec => {
      sec.rows.forEach((row, ri) => {
        const key = `${sec.id}-${ri}`;
        d[key] = y1Overrides[key] !== undefined ? y1Overrides[key] : row.vals[0];
      });
    });
    setDraftY1(d);
    setEditing(true);
  };

  const updateDraft = (key, value) => {
    setDraftY1(prev => ({ ...prev, [key]: parseInt(String(value).replace(/,/g, "")) || 0 }));
    setIsDirty(true);
  };

  const saveEdit = () => {
    setY1Overrides(draftY1);
    setEditing(false);
    setIsDirty(false);
  };

  const cancelEdit = () => {
    setDraftY1({});
    setEditing(false);
    setIsDirty(false);
  };

  const resetToCalculated = () => {
    setY1Overrides({});
    setDraftY1({});
    setEditing(false);
    setIsDirty(false);
  };

  // Build effective sections: apply Y1 override, then project forward with uplift
  const effectiveSections = sections.map(sec => ({
    ...sec,
    rows: sec.rows.map((row, ri) => {
      const key = `${sec.id}-${ri}`;
      const hasOverride = y1Overrides[key] !== undefined;
      // Fixed rows (upgrade project costs) are never recalculated
      if (row.fixed) return { ...row, edited: false };
      const y1 = hasOverride ? y1Overrides[key] : row.vals[0];
      const vals = projectFromY1(y1, years, upliftPct);
      return { ...row, vals, edited: hasOverride };
    }),
  }));

  const hasOverrides = Object.keys(y1Overrides).length > 0;

  return {
    editing, isDirty, hasOverrides,
    y1Overrides, draftY1, effectiveSections,
    startEdit, updateDraft, saveEdit, cancelEdit, resetToCalculated,
  };
}
