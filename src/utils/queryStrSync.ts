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
    const params = new URLSearchParams(qs);
    return {
      lowerBound: parseFloat(params.get('lowerBound')!) || -1,
      upperBound: parseFloat(params.get('upperBound')!) || 1,
    };
  } catch {
    return null;
  }
}
