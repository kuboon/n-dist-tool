import React from 'react';

interface RangeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  mean: number;
  stdDev: number;
  validate?: (value: number) => boolean;
}

export function RangeSlider({ label, value, onChange, min, max, step, mean, stdDev, validate }: RangeSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!validate || validate(newValue)) {
      onChange(newValue);
    }
  };
  const calcValue = mean + stdDev * value

  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-gray-700 font-medium">{label}: {calcValue} [{value}σ]</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer mt-2
                   focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </label>
    </div>
  );
}