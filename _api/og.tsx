import { DistributionChartSvg } from '../src/components/DistributionChartSvg';
import { parseHTML } from 'linkedom';
import { Resvg, initWasm } from '@resvg/resvg-wasm'
import resvgWasm from './_resvg.wasm'

export const edge = true;

const initPromise = async () => {
  await initWasm(resvgWasm)
  const ttf = await fetch(new URL("./_noto-sans-v27-latin-regular.ttf", import.meta.url))
  if (!ttf.ok) throw new Error('font load failed')
  return new Uint8Array(await ttf.arrayBuffer())
}

export async function GET(request: Request) {
  const fontBuf = await initPromise()

  const { searchParams } = new URL(request.url);
  const lowerBound = parseFloat(searchParams.get('lowerBound') || '-1');
  const upperBound = parseFloat(searchParams.get('upperBound') || '1');
  const width = 1200
  const height = 630
  const { document } = parseHTML("");
  const svgStr = DistributionChartSvg({
    document,
    lowerBound,
    upperBound,
    width,
    height,
  }).outerHTML;
  // const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  //   <rect width="100%" height="100%" fill="blue"/>
  //   <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" fill="black">Hello, World!${request.url}</text>
  // </svg>`;

  const resvg = new Resvg(svgStr, {
    fitTo: { mode: 'width', value: 1200 },
    font: { fontBuffers: [fontBuf], loadSystemFonts: false }
  })
  const pngData = resvg.render()
  const pngBuffer = pngData.asPng()

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      // 'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
