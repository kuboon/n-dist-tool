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
      const callOnDrag = (xy: { clientX: number, clientY: number }) => {
        const pointX = new DOMPointReadOnly(xy.clientX, xy.clientY).matrixTransform(matrix).x;
        onDrag(x.invert(pointX));
      }
      elem.addEventListener("mousemove", (e) => { if (e.buttons == 1) callOnDrag(e); });
      elem.addEventListener("touchmove", (e) => { callOnDrag(e.targetTouches[0]); });
    }
  });

  return (
    <div
      className="w-full bg-white rounded-lg border border-gray-100 relative select-none"
      ref={containerRef}
    />
  );
}
