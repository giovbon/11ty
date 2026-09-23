import { asList } from "../../_lib/content.js"

/**
 * Componente `submission` — entrega de atividade pelo Google Apps Script.
 *
 * Frontmatter:
 *   submission: "AST06"                       # uma atividade: form direto
 *   submission:                               # várias: tela de escolha
 *     - "AST06"
 *     - "AST06 ADS3-SI3 ADS4-SI4"
 *
 * O contrato HTTP do backend é FIXO (ver src/components/submission/client.js):
 * este componente só monta o HTML; nenhuma validação acontece no servidor de
 * build. O texto final do rótulo vem da aba "Atividades" da planilha.
 */

/** URL do Web App do Apps Script (mesma implantação usada pelo site atual). */
export const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwauFvnfDsrpl_ACYeZ46NxwKAp2BR9b-3Z0Nz9uTelTaRIYsdQwWYYTYO4GvNBmw4/exec"

const svg = (conteudo, tamanho = 16) =>
  `<svg viewBox="0 0 24 24" width="${tamanho}" height="${tamanho}" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">${conteudo}</svg>`

const ICONE = {
  pasta: svg(
    `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>`,
    32,
  ),
  foguete: svg(
    `<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.79-1.81.19-2.55L4.5 16.5z"/><path d="M15 15l-3.5 3.5L7 14l3.5-3.5L15 15z"/><path d="M9 3.5l4 4a1.5 1.5 0 0 0 2.12 0l2.88-2.88a1.5 1.5 0 0 1 2.12 0L21 5.5s-1.5 4.5-4 7-6 2-9-1-1-6.5 1-9z"/><path d="M15 9l1 1"/>`,
    32,
  ),
  usuario: svg(`<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`),
  link: svg(
    `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
  ),
  upload: svg(
    `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>`,
  ),
  mensagem: svg(
    `<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>`,
  ),
  seta: svg(
    `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>`,
    20,
  ),
  chevron: svg(`<polyline points="9 18 15 12 9 6"/>`, 18),
  voltar: svg(`<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>`, 18),
  fechar: svg(`<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`),
}

const escapeHtml = (valor) =>
  String(valor).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

const escapeAttr = (valor) => escapeHtml(valor).replace(/"/g, "&quot;")

function renderSelecao(activities, multiplas, sobraEmLista) {
  const botoes = activities
    .map(
      (atividade) =>
        `        <button type="button" class="select-activity-btn" data-activity="${escapeAttr(atividade)}"><span class="act-name">${escapeHtml(atividade)}</span>${ICONE.chevron}</button>`,
    )
    .join("\n")

  return `    <div class="selection-screen${multiplas ? "" : " hidden"}">
      <div class="card-header">
        <div class="icon-wrapper">${ICONE.pasta}</div>
        <div class="header-text">
          <h3>Escolha a Atividade</h3>
          <p class="subtitle">Selecione para qual atividade deseja entregar</p>
        </div>
      </div>
      <div class="activity-list">
${botoes}
${sobraEmLista}
      </div>
    </div>`
}

function renderFormulario(atividade, multiplas) {
  return `    <div class="form-screen${multiplas ? " hidden" : ""}">
      <div class="card-header">
        <button type="button" class="back-to-selection${multiplas ? "" : " hidden"}" title="Voltar para escolha">${ICONE.voltar}</button>
        <div class="icon-wrapper">${ICONE.foguete}</div>
        <div class="header-text">
          <h3>Entrega de Atividade</h3>
          <p class="subtitle">Atividade: <span class="highlight-activity">${escapeHtml(multiplas ? "" : atividade)}</span></p>
        </div>
      </div>

      <form class="submission-form" data-activity="${escapeAttr(multiplas ? "" : atividade)}">
        <div class="input-group">
          <label for="ra">${ICONE.usuario} RA do Aluno (7 dígitos)</label>
          <div class="input-wrapper">
            <input type="text" id="ra" name="ra" placeholder="Ex: 1234567" required pattern="[0-9]{7}" maxlength="7" title="O RA deve conter exatamente 7 dígitos numéricos" autocomplete="off" />
            <div class="ra-validation-status"></div>
          </div>
          <input type="hidden" id="nome_aluno" name="nome_aluno" value="" />
          <div class="student-name-display" style="display:none;">
            <label>${ICONE.usuario} Aluno Confirmado</label>
            <div class="input-wrapper"><span class="confirmed-name"></span></div>
          </div>
        </div>

        <div class="input-group">
          <label for="github">${ICONE.link} Link do Projeto (GitHub)</label>
          <div class="input-wrapper">
            <input type="url" id="github" name="github" placeholder="https://github.com/usuario/projeto" title="Insira o link da página do repositório no GitHub (não use o link .git)" />
          </div>
        </div>

        <div class="input-group">
          <label>${ICONE.upload} Ou Enviar Arquivo ZIP</label>
          <div class="file-input-area">
            <input type="file" id="zipfile" name="zipfile" accept=".zip,application/zip,application/x-zip-compressed" class="file-input-hidden" />
            <button type="button" class="file-pick-btn">${ICONE.upload} <span>Escolher arquivo .zip</span></button>
            <div class="file-info-container">
              <span class="file-name-display">Nenhum arquivo selecionado</span>
              <button type="button" class="clear-file-btn" title="Remover arquivo">${ICONE.fechar}</button>
            </div>
            <small class="file-hint">Somente .zip com conteúdo (Máx. 20MB) — PDF, .py, .rar, .7z e ZIP vazio são recusados. 🚨 NÃO ENVIE PASTAS COM DEPENDÊNCIAS DO PROJETO INSTALADAS (ex: pasta .venv ou node_modules). ⚠️ NÃO ENVIE JUNTO A ATIVIDADE MISTURADA COM AS ANTERIORES OU UM REPO COM VÁRIAS ATIVIDADES. A não observância dessas regras representará desconto de nota.</small>
          </div>
        </div>

        <div class="input-group">
          <label for="mensagem">${ICONE.mensagem} Mensagem (Opcional)</label>
          <div class="input-wrapper">
            <textarea id="mensagem" name="mensagem" placeholder="Alguma observação sobre sua entrega?"></textarea>
          </div>
        </div>

        <div class="status-message"></div>
        <div class="receipt-container"></div>

        <button type="submit" class="submit-btn"><span>Confirmar Entrega</span>${ICONE.seta}</button>
      </form>
    </div>`
}

/** HTML do componente (string vazia quando o frontmatter não declara `submission`). */
export function renderSubmission(frontmatter) {
  const activities = asList(frontmatter?.submission)
  if (activities.length === 0) return ""

  const multiplas = activities.length > 1

  return `<div class="submission-container" data-script-url="${escapeAttr(SCRIPT_URL)}">
  <div class="submission-card">
${renderSelecao(activities, multiplas, "")}
${renderFormulario(activities[0], multiplas)}
  </div>
</div>`
}
