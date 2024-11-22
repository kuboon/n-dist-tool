export interface DistributionParams {
  mean: number;
  stdDev: number;
  lowerBound: number;
  upperBound: number;
}

export function saveToHash(params: DistributionParams): void {
  const str = new URLSearchParams(params as never);
  globalThis.history.replaceState(null, '', `#${str}`);
}

export function loadFromHash(): DistributionParams | null {
  try {
    const hash = globalThis.location.hash.slice(1);
    if (!hash) return null;

    const params_ = new URLSearchParams(hash);
    const params: DistributionParams = {
      mean: parseInt(params_.get('mean')!),
      stdDev: parseInt(params_.get('stdDev')!),
      lowerBound: parseInt(params_.get('lowerBound')!),
      upperBound: parseInt(params_.get('upperBound')!),
    };

    // Validate params
    if (
      typeof params.mean !== 'number' ||
      typeof params.stdDev !== 'number' ||
      typeof params.lowerBound !== 'number' ||
      typeof params.upperBound !== 'number'
    ) {
      return null;
    }

    return params;
  } catch {
    return null;
  }
}
