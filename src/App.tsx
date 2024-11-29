import { DistributionChart } from './components/DistributionChart.tsx';
import { InfoPanel } from './components/InfoPanel.tsx';
import { NumberInput } from './components/NumberInput.tsx';
import { PresetSelector, Preset } from './components/PresetSelector.tsx';
import { RangeSlider } from './components/RangeSlider.tsx';
import { saveToQueryStr, type DistributionParams } from './utils/queryStrSync.ts';
import { useDebouncedEffect } from './utils/useDebouncedEffect.ts';

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';

const round = (x: number, n: number) => Math.round(x * 10 ** n) / 10 ** n;

const DISTRIBUTION_PRESETS: Preset[] = [
  { label: '偏差値', mean: 50, stdDev: 10 },
  { label: 'IQ (SD15)', mean: 100, stdDev: 15 },
  { label: 'IQ (SD24)', mean: 100, stdDev: 24 },
];

function App({ params }: { params: DistributionParams }) {
  const [lowerBound, setLowerBound] = useState(params.lowerBound);
  const [upperBound, setUpperBound] = useState(params.upperBound);
  const [showInfo, setShowInfo] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Save state to URL hash whenever parameters change
  useDebouncedEffect(() => {
    saveToQueryStr({ lowerBound, upperBound });
  }, [lowerBound, upperBound], 100);

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

            <DistributionChart
              lowerBound={lowerBound}
              upperBound={upperBound}
              onDrag={(x) => {
                // 近い方を動かす
                const center = (lowerBound + upperBound) / 2
                x = round(x, 1)
                if (x < center) setLowerBound(x)
                else setUpperBound(x)
              }}
            />

            <div className="grid grid-cols-[2fr,1fr,2fr] gap-6 mb-8 text-center">
              <div className="grid grid-cols-subgrid col-span-3">
                <RangeSlider
                  label="下限"
                  value={lowerBound}
                  onChange={setLowerBound}
                  min={-4}
                  max={4}
                  step={0.1}
                  validate={(value) => value < upperBound}
                />
                <div className='grid-flow-dense'/>
                <RangeSlider
                  label="上限"
                  value={upperBound}
                  onChange={setUpperBound}
                  min={-4}
                  max={4}
                  step={0.1}
                  validate={(value) => value > lowerBound}
                />
              </div>
              {DISTRIBUTION_PRESETS.map((x, i) => {
                const low = round(x.mean + x.stdDev * lowerBound, 1)
                const up = x.mean + round(x.stdDev * upperBound, 1)
                return <div className='grid grid-cols-subgrid col-span-3' key={i}>
                  <div key='low' className='place-content-center'>{low}</div>
                  <div key='label'>{x.label}</div>
                  <div key='up' className='place-content-center'>{up}</div>
                </div>
              })}
            </div>

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
