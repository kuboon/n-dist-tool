export const edge = true;

export async function GET(request: Request) {
  const html = await fetch(new URL("./_index.html", import.meta.url)).then(x=>x.text())
  const ogUrl = new URL(`/api/og`, request.url)
  ogUrl.search = new URL(request.url).search
  const newBody = html.replace('<meta property="og:image" content="" />', `<meta property="og:image" content="${ogUrl}" />`)
  return new Response(newBody, { headers: { 'content-type': 'text/html' } })
}
