"use client";

import { useEffect, useState } from "react";

const ELLIPSIS_MS = 450;
const FLAVOR_MS = 3000;

const DOCUMENTARY_FLAVOR_LINES = [
  "Fetching repository metadata",
  "Reading commit history",
  "Analyzing contributor patterns",
  "Mapping the project timeline",
  "Identifying key turning points",
  "Detecting pivotal moments",
  "Almost there",
  "Synthesizing the documentary",
] as const;

const ELLIPSIS_FRAMES = ["", ".", "..", "..."] as const;

export function DocumentaryFlavorText() {
  const lines = DOCUMENTARY_FLAVOR_LINES;
  const [flavorIndex, setFlavorIndex] = useState(0);
  const [ellipsisIndex, setEllipsisIndex] = useState(0);

  useEffect(() => {
    const ellipsisId = window.setInterval(() => {
      setEllipsisIndex((i) => (i + 1) % ELLIPSIS_FRAMES.length);
    }, ELLIPSIS_MS);

    const flavorId = window.setInterval(() => {
      setFlavorIndex((i) => (i + 1) % lines.length);
    }, FLAVOR_MS);

    return () => {
      window.clearInterval(ellipsisId);
      window.clearInterval(flavorId);
    };
  }, [lines.length]);

  const line = lines[flavorIndex] ?? lines[0];
  const dots = ELLIPSIS_FRAMES[ellipsisIndex] ?? "";

  return (
    <p
      className="min-h-[1.25rem] text-sm text-zinc-600"
      role="status"
      aria-live="polite"
    >
      {line}
      <span className="inline-block min-w-[1.25em] font-mono tabular-nums text-zinc-500">
        {dots}
      </span>
    </p>
  );
}
