export interface DistributionParams {
  lowerBound: number;
  upperBound: number;
}

export function saveToQueryStr(params: DistributionParams): void {
  const str = new URLSearchParams(params as never);
  globalThis.history.replaceState(null, '', `?${str}`);
}

export function loadFromQueryStr(): DistributionParams | null {
  try {
    const qs = globalThis.location.search.slice(1);
    if (!qs) return null;

    const params_ = new URLSearchParams(qs);
    const params: DistributionParams = {
      lowerBound: parseInt(params_.get('lowerBound')!),
      upperBound: parseInt(params_.get('upperBound')!),
    };

    // Validate params
    if (
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
