import { DistributionChartSvg } from "./DistributionChartSvg.ts";
import React, { useEffect, useRef } from "react";

interface DataPoint {
  sigma: number;
  y: number;
}

interface DistributionChartProps {
  lowerBound: number;
  upperBound: number;
}

export function DistributionChart(
  { lowerBound, upperBound }: DistributionChartProps,
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Set up dimensions
    // const margin = { top: 40, right: 40, bottom: 40, left: 60 };
    const width = containerRef.current.clientWidth; // - margin.left - margin.right;
    const height = containerRef.current.clientHeight; // - margin.top - margin.bottom;

    containerRef.current.innerHTML = DistributionChartSvg({
      document,
      lowerBound,
      upperBound,
      width,
      height,
    });
  });

  return (
    <div
      className="h-80 w-full bg-white rounded-lg border border-gray-100 relative"
      ref={containerRef}
    />
  );
}
