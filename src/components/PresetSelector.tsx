import React from 'react';

export interface Preset {
  label: string;
  mean: number;
  stdDev: number;
  lowerBound?: number;
  upperBound?: number;
}

interface PresetSelectorProps {
  label: string;
  presets: Preset[];
  onSelect: (preset: Preset) => void;
  currentMean: number;
  currentStdDev: number;
}

export function PresetSelector({
  label,
  presets,
  onSelect,
  currentMean,
  currentStdDev,
}: PresetSelectorProps) {
  const getCurrentValue = (): string => {
    const matchingPreset = presets.find(
      (p) => p.mean === currentMean && p.stdDev === currentStdDev
    );
    return matchingPreset ? matchingPreset.label : 'custom';
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        {label}
      </label>
      <select
        value={getCurrentValue()}
        onChange={(e) => {
          const preset = presets.find((p) => p.label === e.target.value);
          if (preset) onSelect(preset);
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400
                 focus:border-transparent transition-colors duration-200 ease-in-out appearance-none
                 bg-white"
      >
        <option value="custom" disabled={getCurrentValue() !== 'custom'}>
          Custom
        </option>
        {presets.map((preset) => (
          <option key={preset.label} value={preset.label}>
            {preset.label}
          </option>
        ))}
      </select>
    </div>
  );
}
