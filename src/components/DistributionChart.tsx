import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

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
  const formatXAxis = (value: number) => `${value}σ`;
  
  const rangedData = data.map(x=>({
    sigma: x.sigma,
    y: x.y,
    y2: x.sigma >= lowerBound && x.sigma <= upperBound ? x.y : null
  }));

  return (
    <div className="h-80 w-full bg-white rounded-lg p-4 border border-gray-100">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rangedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="sigma" 
            tickFormatter={formatXAxis}
            stroke="#6B7280"
            domain={[-4, 4]}
            ticks={[-4, -3, -2, -1, 0, 1, 2, 3, 4]}
          />
          <YAxis stroke="#6B7280" />
          <Tooltip 
            labelFormatter={(value) => `${value}σ`}
            formatter={(value: number) => [value.toFixed(4), 'Probability Density']}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
            }}
          />
          {/* Selected range area */}
          <Area
            type="monotone"
            dataKey="y2"
            stroke="#6366F1"
            fill="url(#colorGradient)"
            fillOpacity={0.8}
            isAnimationActive={false}
          />
          {/* Base area (full distribution) */}
          <Area
            type="monotone"
            dataKey="y"
            stroke="#E5E7EB"
            fill="#E5E7EB"
            fillOpacity={0.3}
            isAnimationActive={false}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818CF8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0.6}/>
            </linearGradient>
          </defs>
          <ReferenceLine
            x={lowerBound}
            stroke="#4F46E5"
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{
              value: `${lowerBound}σ`,
              position: 'top',
              fill: '#4F46E5',
              fontSize: 12,
            }}
            isAnimationActive={false}
          />
          <ReferenceLine
            x={upperBound}
            stroke="#4F46E5"
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{
              value: `${upperBound}σ`,
              position: 'top',
              fill: '#4F46E5',
              fontSize: 12,
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}