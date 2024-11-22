import * as d3 from "d3";
import { bellPoints } from "../utils/statistics.ts";

interface DataPoint {
  sigma: number;
  y: number;
}

interface DistributionChartProps {
  document: { createElement: (tagName: string) => HTMLElement };
  lowerBound: number;
  upperBound: number;
  width: number;
  height: number;
}

export function DistributionChartSvg(
  { document, lowerBound, upperBound, width, height }:
    DistributionChartProps,
) {
  // Set up dimensions
  const margin = { top: 40, right: 40, bottom: 40, left: 60 };

  const svg = d3.select(document.createElement("svg"))
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;

  const data = bellPoints
  // Set up scales
  const x = d3.scaleLinear()
    .domain([-4, 4])
    .range([margin.left, width - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.y) as number])
    .range([height - margin.bottom, margin.top]);

  // Create line generator
  const line1 = d3.line<DataPoint>()
    .x((d) => x(d.sigma))
    .y((d: DataPoint) => y(d.y))
    .curve(d3.curveBasis);

  // Create area generator for the selected range
  const area1 = d3.area<DataPoint>()
    .x((d) => x(d.sigma))
    .y0(height - margin.bottom)
    .y1((d) => y(d.y))
    .curve(d3.curveBasis);

  // Add X-axis
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(
      d3.axisBottom(x)
        .ticks(8)
        .tickFormat((d) => `${d}σ`)
        .tickSize(-chartH),
    )
    .style("stroke", "#e5e7eb")
    .style("stroke-opacity", 0.5)
    .style("color", "#6b7280")
    .selectAll("text")
    .style("font-size", "12px");

  // Add Y-axis
  svg
    .append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(
      d3.axisLeft(y)
        .ticks(5)
        .tickFormat((d) => `${d}`)
        .tickSize(-chartW),
    )
    .style("stroke", "#e5e7eb")
    .style("stroke-opacity", 0.5)
    .style("color", "#6b7280")
    .selectAll("text")
    .style("font-size", "12px");

  {
    const g = svg.append("g");
    // Add the distribution line
    g
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#6366f1")
      .attr("stroke-width", 2)
      .attr("d", line1);

    // Add the full distribution area (gray)
    g
      .append("path")
      .datum(data)
      .attr("fill", "#e5e7eb")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "none")
      .attr("d", area1);

    // Add the selected range area
    const selectedData = data.filter(
      (d) => d.sigma >= lowerBound && d.sigma <= upperBound,
    );

    g
      .append("path")
      .datum(selectedData)
      .attr("fill", "#818cf8")
      .attr("stroke", "none")
      .attr("d", area1);
  }

  // Add boundary lines
  const addBoundaryLine = (value: number) => {
    svg
      .append("path")
      .attr("d", `M${x(value)},${margin.top}V${height - margin.bottom}`)
      .attr("stroke", "#4f46e5")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");

    svg
      .append("text")
      .attr("x", x(value))
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("fill", "#4f46e5")
      .style("font-size", "12px")
      .text(`${value}σ`);
  };

  addBoundaryLine(lowerBound);
  addBoundaryLine(upperBound);

  return svg.node()!.outerHTML;
}
