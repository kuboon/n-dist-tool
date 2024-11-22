import React from 'react'
import { Info } from 'lucide-react';

interface InfoPanelProps {
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
}

export function InfoPanel({ showInfo, setShowInfo }: InfoPanelProps) {
  return (
    <>
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="absolute right-0 text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <Info className="h-6 w-6" />
      </button>

      {showInfo && (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg text-sm text-gray-700 absolute right-6 top-1 z-10">
          <p>The normal distribution is a fundamental probability distribution that appears in many natural phenomena.
             The area between the bounds represents the probability of a random variable falling within that range.</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Mean (μ) determines the center of the distribution</li>
            <li>Standard Deviation (σ) determines the spread</li>
            <li>±1σ from mean contains ~68.27% of the data</li>
            <li>±2σ from mean contains ~95.45% of the data</li>
            <li>±3σ from mean contains ~99.73% of the data</li>
          </ul>
          <div className="mt-2 pt-2 border-t border-indigo-100">
            <p className="font-medium">Common Distributions:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Deviation Score: Used in standardized tests (μ=50, σ=10)</li>
              <li>IQ Score: Intelligence quotient scale (μ=100, σ=15)</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
