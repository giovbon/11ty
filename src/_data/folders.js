import { buildFolders, getEntries } from "../_lib/content.js"

/** Uma entrada por pasta, usada para gerar as páginas de listagem (`/CTT/`, `/CTT/Git/`). */
export default function () {
  return buildFolders(getEntries())
}
