import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({ label, value, onChange, min, max, step = 1 }: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value);
    if (!Number.isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                 transition-colors duration-200 ease-in-out"
      />
    </div>
  );
}