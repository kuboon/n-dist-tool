import { DistributionChartSvg } from '../src/utils/DistributionChartSvg.ts';
import { parseHTML } from 'linkedom';
import { initialize, svg2png } from 'svg2png-wasm';
import wasm from './svg2png_wasm_bg.wasm'

export const edge = true;

const initPromise = initialize(wasm).then(async () => {
  const ttf = await fetch(new URL("./_roboto-v32-greek_latin-regular.ttf", import.meta.url))
  if (!ttf.ok) throw new Error('font load failed')
  return new Uint8Array(await ttf.arrayBuffer())
})

export async function GET(request: Request) {
  const fontBuf = await initPromise

  const { searchParams } = new URL(request.url);
  const lowerBound = parseFloat(searchParams.get('lowerBound')!) || -1;
  const upperBound = parseFloat(searchParams.get('upperBound')!) || 1;
  const width = 1200
  const height = 630
  const { document } = parseHTML("<body></body>");
  const svgStr = DistributionChartSvg({
    document,
    lowerBound,
    upperBound,
  }).svgElem.outerHTML;

  const png = await svg2png(svgStr, {
    width,
    height,
    fonts: [fontBuf],
    defaultFontFamily: {
      sansSerifFamily: 'Roboto',
      serifFamily: 'Roboto',
      cursiveFamily: 'Roboto',
      fantasyFamily: 'Roboto',
      monospaceFamily: 'Roboto',
    },
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
