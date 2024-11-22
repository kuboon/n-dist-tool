import { DistributionChartSvg } from "./DistributionChartSvg.ts";
import React, { useEffect, useRef } from "react";

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

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svgElem = DistributionChartSvg({
      document,
      lowerBound,
      upperBound,
      width,
      height,
    });
    containerRef.current.innerHTML = svgElem.outerHTML;
  });

  return (
    <div
      className="h-80 w-full bg-white rounded-lg border border-gray-100 relative"
      ref={containerRef}
    />
  );
}
