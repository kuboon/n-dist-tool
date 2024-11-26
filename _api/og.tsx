import { DistributionChartSvg } from '../src/components/DistributionChartSvg';
import { Resvg, initWasm } from '@resvg/resvg-wasm'
import resvgWasm from './_resvg.wasm?module'

export const edge = true;

const wasmPromise = initWasm(resvgWasm)

export async function GET(request: Request) {
  await wasmPromise

  // const { searchParams } = new URL(request.url);
  // const lowerBound = parseFloat(searchParams.get('lowerBound') || '-1');
  // const upperBound = parseFloat(searchParams.get('upperBound') || '1');
  const width = 1200
  const height = 630
  // const svgStr = DistributionChartSvg({
  //   document,
  //   lowerBound,
  //   upperBound,
  //   width,
  //   height,
  // }).outerHTML;
  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <rect width="100%" height="100%" fill="white"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill="black">Hello, World!${request.url}</text>
  </svg>`;

  const resvg = new Resvg(svgStr, { fitTo: { mode: 'width', value: 1200 } })
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      // 'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
