/**
 * Utilitários de URL compartilhados entre componentes e build.
 *
 * A base do site vem de `<meta name="base-url">` (definida no layout, já com o
 * `BASE_URL` aplicado) — por isso é lida **em tempo de uso**, e não no topo do
 * módulo: assim o mesmo arquivo funciona no navegador, no build e nos testes.
 */
export function getBaseUrl() {
  if (typeof document !== "undefined") {
    return document.querySelector('meta[name="base-url"]')?.getAttribute("content") ?? "/"
  }
  return process.env.BASE_URL ?? "/"
}

export const isExternal = (url) =>
  /^(https?:)?\/\//.test(url) || url.startsWith("#") || url.startsWith("mailto:")

/** Prefixa caminhos absolutos com a base do site; ignora o que já está prefixado. */
export function resolveUrl(url, base = getBaseUrl()) {
  if (!url || isExternal(url)) return url
  if (!url.startsWith("/")) return url

  const prefix = base.endsWith("/") ? base.slice(0, -1) : base
  if (prefix === "" || url.startsWith(`${prefix}/`)) return url
  return `${prefix}${url}`
}
