import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  sigma: number;
  y: number;
}

interface DistributionChartProps {
  data: DataPoint[];
  lowerBound: number;
  upperBound: number;
}

export function DistributionChart({ data, lowerBound, upperBound }: DistributionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const margin = { top: 40, right: 40, bottom: 40, left: 60 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = svgRef.current.clientHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales
    const x = d3
      .scaleLinear()
      .domain([-4, 4])
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.y) as number])
      .range([height, 0]);

    // Create line generator
    const line = d3
      .line<DataPoint>()
      .x(d => x(d.sigma))
      .y(d => y(d.y))
      .curve(d3.curveBasis);

    // Create area generator for the selected range
    const area = d3
      .area<DataPoint>()
      .x(d => x(d.sigma))
      .y0(height)
      .y1(d => y(d.y))
      .curve(d3.curveBasis);

    // Add grid lines
    svg
      .append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3.axisBottom(x)
          .ticks(8)
          .tickSize(-height)
          .tickFormat(() => '')
      )
      .style('stroke', '#e5e7eb')
      .style('stroke-opacity', 0.5);

    svg
      .append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(y)
          .ticks(5)
          .tickSize(-width)
          .tickFormat(() => '')
      )
      .style('stroke', '#e5e7eb')
      .style('stroke-opacity', 0.5);

    // Add X-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3.axisBottom(x)
          .ticks(8)
          .tickFormat(d => `${d}σ`)
      )
      .style('color', '#6b7280')
      .selectAll('text')
      .style('font-size', '12px');

    // Add Y-axis
    svg
      .append('g')
      .call(d3.axisLeft(y).ticks(5))
      .style('color', '#6b7280')
      .selectAll('text')
      .style('font-size', '12px');

    // Add the full distribution area (gray)
    svg
      .append('path')
      .datum(data)
      .attr('fill', '#e5e7eb')
      .attr('fill-opacity', 0.3)
      .attr('stroke', 'none')
      .attr('d', area);

    // Add the selected range area
    const selectedData = data.filter(
      d => d.sigma >= lowerBound && d.sigma <= upperBound
    );
    
    // Create gradient
    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', '0')
      .attr('y1', '0')
      .attr('x2', '0')
      .attr('y2', height);

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#818cf8')
      .attr('stop-opacity', 0.8);

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#6366f1')
      .attr('stop-opacity', 0.6);

    svg
      .append('path')
      .datum(selectedData)
      .attr('fill', 'url(#area-gradient)')
      .attr('stroke', 'none')
      .attr('d', area);

    // Add the distribution line
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add boundary lines
    const addBoundaryLine = (value: number) => {
      svg
        .append('line')
        .attr('x1', x(value))
        .attr('x2', x(value))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#4f46e5')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      svg
        .append('text')
        .attr('x', x(value))
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .attr('fill', '#4f46e5')
        .style('font-size', '12px')
        .text(`${value}σ`);
    };

    addBoundaryLine(lowerBound);
    addBoundaryLine(upperBound);

    // Add hover effects
    const tooltip = d3
      .select(svgRef.current.parentElement)
      .append('div')
      .attr('class', 'absolute hidden bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-200 text-sm')
      .style('pointer-events', 'none');

    const bisect = d3.bisector<DataPoint, number>(d => d.sigma).left;

    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event);
        const x0 = x.invert(mouseX);
        const i = bisect(data, x0);
        const d = data[i];

        if (d) {
          tooltip
            .style('left', `${event.offsetX + 10}px`)
            .style('top', `${event.offsetY - 10}px`)
            .html(`
              <div class="font-medium">${d.sigma.toFixed(2)}σ</div>
              <div class="text-gray-600">Density: ${d.y.toFixed(4)}</div>
            `)
            .classed('hidden', false);
        }
      })
      .on('mouseleave', () => {
        tooltip.classed('hidden', true);
      });

    return () => { tooltip.remove() }
  }, [data, lowerBound, upperBound]);

  return (
    <div className="h-80 w-full bg-white rounded-lg p-4 border border-gray-100 relative">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      />
    </div>
  );
}