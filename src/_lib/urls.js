/**
 * Prefixo de URL do site.
 *
 * Em dev:        BASE_URL="/"        (padrão)
 * GitHub Pages:  BASE_URL=/impacta/  (site publicado em subpasta)
 *
 * Toda URL interna deve passar pelo filtro `link` nos templates, para que o site
 * funcione tanto na raiz quanto em subpasta, sem edição manual.
 */
const RAW = process.env.BASE_URL ?? "/"

export const PREFIX = RAW.endsWith("/") ? RAW.slice(0, -1) : RAW

export function withPrefix(url) {
  if (!url || typeof url !== "string") return url
  if (/^(https?:)?\/\//.test(url) || url.startsWith("#") || url.startsWith("mailto:")) return url
  const normalized = url.startsWith("/") ? url : `/${url}`
  return `${PREFIX}${normalized}`
}
