import { DistributionChartSvg } from "../utils/DistributionChartSvg.ts";
import React, { useEffect, useRef } from "react";

interface DistributionChartProps {
  lowerBound: number;
  upperBound: number;
  onDrag: (x: number) => void;
}

export function DistributionChart(
  { lowerBound, upperBound, onDrag }: DistributionChartProps,
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const { svgElem, x } = DistributionChartSvg({
      document,
      lowerBound,
      upperBound,
    });
    // const doc = new DOMParser().parseFromString(svgElem.outerHTML, "image/svg+xml");
    // document.body.appendChild(doc.lastChild!);
    containerRef.current.replaceChildren(svgElem);
    {
      const elem = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      elem.setAttribute("x", "20");
      elem.setAttribute("width", "260");
      elem.setAttribute("height", "200");
      elem.setAttribute("fill", "transparent");
      elem.style.pointerEvents = "all";
      svgElem.appendChild(elem);

      const matrix = elem.getScreenCTM()!.inverse();
      elem.addEventListener("mousemove", (e) => {
        const pointX = new DOMPointReadOnly(e.clientX, e.clientY).matrixTransform(matrix).x;
        if (e.buttons == 1) { onDrag(x.invert(pointX)); }
      });
    }
  });

  return (
    <div
      className="h-80 w-full bg-white rounded-lg border border-gray-100 relative select-none"
      ref={containerRef}
    />
  );
}
