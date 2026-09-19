import { buildNavigation, getEntries } from "../_lib/content.js"

/** Árvore da barra lateral (pastas de nível raiz + páginas soltas). */
export default function () {
  return buildNavigation(getEntries())
}
