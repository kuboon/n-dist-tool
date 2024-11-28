import { DistributionChart } from './components/DistributionChart.tsx';
import { InfoPanel } from './components/InfoPanel.tsx';
import { NumberInput } from './components/NumberInput.tsx';
import { PresetSelector, Preset } from './components/PresetSelector.tsx';
import { RangeSlider } from './components/RangeSlider.tsx';
import { saveToHash, type DistributionParams } from './utils/hashSync.ts';
import { useDebouncedEffect } from './utils/useDebouncedEffect.ts';

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';

const DISTRIBUTION_PRESETS: Preset[] = [
  { label: '標準正規分布', mean: 0, stdDev: 1 },
  { label: '偏差値', mean: 50, stdDev: 10 },
  { label: 'IQ (ウェクスラー)', mean: 100, stdDev: 15 },
];

function App({ params }: { params: DistributionParams }) {
  const [lowerBound, setLowerBound] = useState(params.lowerBound);
  const [upperBound, setUpperBound] = useState(params.upperBound);
  const [mean, setMean] = useState(params.mean);
  const [stdDev, setStdDev] = useState(params.stdDev);
  const [showInfo, setShowInfo] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Save state to URL hash whenever parameters change
  useDebouncedEffect(() => {
    saveToHash({ mean, stdDev, lowerBound, upperBound });
  }, [mean, stdDev, lowerBound, upperBound], 100);

  const handlePresetSelect = (preset: Preset) => {
    setMean(preset.mean);
    setStdDev(preset.stdDev);
    if (preset.lowerBound) setLowerBound(preset.lowerBound);
    if (preset.upperBound) setUpperBound(preset.upperBound)
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(globalThis.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="flex items-center justify-center mb-8 relative">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                正規分布ツール
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="text-gray-500 hover:text-indigo-600 transition-colors p-2"
                  title="Share distribution"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <InfoPanel showInfo={showInfo} setShowInfo={setShowInfo} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="space-y-6">
                <PresetSelector
                  label="平均・偏差"
                  presets={DISTRIBUTION_PRESETS}
                  onSelect={handlePresetSelect}
                  currentMean={mean}
                  currentStdDev={stdDev}
                />
                <div className="grid gap-6 md:grid-cols-2">
                  <NumberInput
                    label="平均 Mean (μ)"
                    value={mean}
                    onChange={setMean}
                    step={1}
                  />
                  <NumberInput
                    label="標準偏差 Standard Deviation (σ)"
                    value={stdDev}
                    onChange={setStdDev}
                    min={0.1}
                    step={0.1}
                  />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <RangeSlider
                  label="下限"
                  value={lowerBound}
                  onChange={setLowerBound}
                  min={-4}
                  max={4}
                  step={0.1}
                  mean={mean}
                  stdDev={stdDev}
                  validate={(value) => value < upperBound}
                />
                <RangeSlider
                  label="上限"
                  value={upperBound}
                  onChange={setUpperBound}
                  min={-4}
                  max={4}
                  step={0.1}
                  mean={mean}
                  stdDev={stdDev}
                  validate={(value) => value > lowerBound}
                />
              </div>
            </div>

            <DistributionChart
              lowerBound={lowerBound}
              upperBound={upperBound}
            />

            {/* Share Toast */}
            <div
              className={`fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-200 ${showShareToast
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
                }`}
            >
              URL copied to clipboard!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
