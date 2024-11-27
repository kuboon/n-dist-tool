import { bellPoints } from "../utils/statistics.ts";
import * as d3 from "d3";

interface DistributionChartProps {
  document: { createElement: (tagName: string) => HTMLElement };
  lowerBound: number;
  upperBound: number;
  width: number;
  height: number;
}

export function DistributionChartSvg(
  { document, lowerBound, upperBound, width, height }: DistributionChartProps,
) {
  // Set up dimensions
  const margin = { top: 40, right: 40, bottom: 40, left: 60 };

  const svg = d3.select(document.createElement("svg"))
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  const chartW = width - margin.left - margin.right;
  const chartH = height - margin.top - margin.bottom;

  const data = bellPoints;

  // Set up scales
  const x = d3.scaleLinear()
    .domain([-4, 4])
    .range([margin.left, width - margin.right]);
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d[1]) as number])
    .range([height - margin.bottom, margin.top]);

  // axis
  {
    const g = svg.append("g")
      .style("stroke", "#e5e7eb")
      .style("stroke-opacity", 0.5)
      .style("color", "#6b7280");

    // Add X-axis
    g.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(
        d3.axisBottom(x)
          .ticks(8)
          .tickFormat((d) => `${d}σ`)
          .tickSize(-chartH),
      );

    // Add Y-axis
    g.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(
        d3.axisLeft(y)
          .ticks(5)
          .tickSize(-chartW),
      );
  }

  {
    const g = svg.append("g");

    // Add the full distribution area (gray)
    const line = d3.line()
      .x((d) => x(d[0]))
      .y((d) => y(d[1]))
      .curve(d3.curveBasis);
    g.append("path")
      .attr("fill", "#ccd7eb")
      .attr("fill-opacity", 0.3)
      .attr("stroke", "#6366f1")
      .attr("stroke-width", 2)
      .attr("d", line(data));

    // Add the selected range area
    const area1 = d3.area()
      .x((d) => x(d[0]))
      .y0(height - margin.bottom)
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);
    const selectedData = data.filter(
      (d) => d[0] >= lowerBound && d[0] <= upperBound,
    );

    g.append("path")
      .attr("fill", "#818cf8")
      .attr("stroke", "none")
      .attr("d", area1(selectedData));
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
      .attr("y", margin.top - 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#4f46e5")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .text(`${value}σ`);
  };

  addBoundaryLine(lowerBound);
  addBoundaryLine(upperBound);

  return svg.node()!;
}
