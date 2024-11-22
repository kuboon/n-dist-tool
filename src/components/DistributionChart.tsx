import { DistributionChartSvg } from "./DistributionChartSvg.ts";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  sigma: number;
  y: number;
}

interface DistributionChartProps {
  data: DataPoint[];
  lowerBound: number;
  upperBound: number;
}

export function DistributionChart(
  { data, lowerBound, upperBound }: DistributionChartProps,
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
      data,
      lowerBound,
      upperBound,
      width,
      height,
    });
    const container = d3.select(containerRef.current);

    // Set up scales
    const x = d3.scaleLinear()
      .domain([-4, 4])
      .range([0, width]);

    // Add hover effects
    const tooltip = container
      .append("div")
      .attr(
        "class",
        "absolute hidden bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-sm",
      )
      .style("pointer-events", "none");

    const bisect = d3.bisector<DataPoint, number>((d) => d.sigma).left;

    const svg = container.select("svg");
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);
        const x0 = x.invert(mouseX);
        const i = bisect(data, x0);
        const d = data[i];

        if (d) {
          tooltip
            .style("left", `${event.offsetX + 10}px`)
            .style("top", `${event.offsetY - 10}px`)
            .html(`
              <div class="font-medium">${d.sigma.toFixed(2)}σ</div>
              <div class="text-gray-600">Density: ${d.y.toFixed(2)}</div>
            `)
            .classed("hidden", false);
        }
      })
      .on("mouseleave", () => {
        tooltip.classed("hidden", true);
      });
  }, [data, lowerBound, upperBound]);

  return (
    <div
      className="h-80 w-full bg-white rounded-lg border border-gray-100 relative"
      ref={containerRef}
    >
      {
        /* <svg
        ref={containerRef}
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      /> */
      }
    </div>
  );
}
