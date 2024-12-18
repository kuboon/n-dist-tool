import { bellPoints, normalCDF } from "./statistics.ts";
import * as d3 from "d3";

interface DistributionChartProps {
  document: { createElementNS: (tagName: 'http://www.w3.org/2000/svg', ns: string) => HTMLElement };
  lowerBound: number;
  upperBound: number;
}

export function DistributionChartSvg(
  { document, lowerBound, upperBound }: DistributionChartProps,
) {
  // Set up dimensions
  const width = 300
  const height = 157;
  const margin = { top: 20, right: 60, bottom: 20, left: 60 };


  const lowerCDF = normalCDF(lowerBound);
  const upperCDF = normalCDF(upperBound);
  const cumulativePercentage = ((upperCDF - lowerCDF) * 100).toFixed(2);

  const rootElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const svg = d3.select(rootElem)
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "width: 100%; height: 100%;")
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")

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
      .text(`${value}σ`);
  };

  addBoundaryLine(lowerBound);
  addBoundaryLine(upperBound);

  svg.append("text")
  .attr("text-anchor", "middle")
  .attr("x", x(0))
  .attr("y", y(22))
  .attr("stroke", "#fff")
  .style("font-size", "300%")
  .text(cumulativePercentage + "%")

  return { svgElem: svg.node()!, x };
}
