export const bellPoints = (() => {
  const points = [];
  for (let x = -40; x <= 40; x += 1) {
    points.push({
      sigma: Number((x / 10).toFixed(1)),
      y: normalPDF(x / 10) * 100,
    });
  }
  return points;
})();
function normalPDF(x: number, mean: number = 0, stdDev: number = 1): number {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return coefficient * Math.exp(exponent);
}

export function normalCDF(
  x: number,
  mean: number = 0,
  stdDev: number = 1,
): number {
  return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
}

function erf(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 -
    (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}
