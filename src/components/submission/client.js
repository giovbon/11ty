import { validarArquivoZip } from "../../client/shared/zip.js"

/**
 * Componente `submission` — entrega de atividade no Google Apps Script.
 *
 * ATENÇÃO: este arquivo é uma porta fiel de `quartz/components/scripts/submission.inline.ts`.
 * O backend (Apps Script) NÃO é alterado por este projeto, então nenhuma regra
 * abaixo pode ser "melhorada" sem testar contra o deploy real:
 *
 *  - as consultas são GET com `action=buscarAtividade` / `action=listarAtividades`;
 *  - o POST repete os campos na query string, porque o Apps Script responde 302
 *    para script.googleusercontent.com e o navegador pode converter o POST em GET;
 *  - "já enviou esta atividade" significa duplicidade nas últimas 24h (entrega OK);
 *  - o 404 pode acontecer DEPOIS de a entrega ter sido salva.
 */

/* ──────────────────────────── transporte ──────────────────────────── */

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const resultado = String(reader.result)
      resolve(resultado.split(",")[1] || resultado)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function getFromGAS(url, params) {
  const query = Object.entries(params)
    .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(valor)}`)
    .join("&")

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("GET", `${url}?${query}`)
    xhr.timeout = 15000
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          reject(new Error("Resposta inválida do servidor."))
        }
      } else {
        reject(new Error(`Erro HTTP ${xhr.status}: ${xhr.responseText}`))
      }
    }
    xhr.onerror = () => reject(new Error("Erro de rede ao conectar com o servidor."))
    xhr.ontimeout = () => reject(new Error("Tempo limite excedido. Tente novamente."))
    xhr.send()
  })
}

function postToGAS(url, formData) {
  const queryParams = ["action=submit"]
  for (const [chave, valor] of formData.entries()) {
    if (typeof valor === "string" && chave !== "arquivo_zip_base64" && chave !== "mensagem") {
      queryParams.push(`${encodeURIComponent(chave)}=${encodeURIComponent(valor)}`)
    }
  }
  const urlCompleta = url.includes("?") ? `${url}&${queryParams.join("&")}` : `${url}?${queryParams.join("&")}`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", urlCompleta)
    xhr.timeout = 120000 // 2 minutos: ZIP grande em rede ruim
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.responseText)
      else reject(new Error(`Erro HTTP ${xhr.status}: ${xhr.responseText}`))
    }
    xhr.onerror = () => reject(new Error("Erro de rede ao conectar com o servidor."))
    xhr.ontimeout = () => reject(new Error("Tempo limite excedido. Tente novamente."))
    xhr.send(formData)
  })
}

/* ──────────────────────────── apoio ──────────────────────────── */

function showStatus(elemento, tipo, mensagem) {
  elemento.style.display = "block"
  elemento.className = `status-message ${tipo}`
  elemento.innerHTML = tipo === "error" ? `❌ ${mensagem}` : `✅ ${mensagem}`
}

function formatarData(isoString) {
  return new Date(isoString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function gerarComprovante(dados) {
  const separador = "═".repeat(56)
  const linhaSimples = "─".repeat(56)

  return [
    separador,
    "        COMPROVANTE DE ENTREGA - IMPACTA",
    separador,
    "",
    `  ID de Comprovação: ${dados.protocol}`,
    `  Data/Hora:         ${dados.data}`,
    `  Aluno:             ${dados.aluno}`,
    `  RA:                ${dados.ra}`,
    `  Atividade:         ${dados.atividade}`,
    `  Status:            ${dados.status}`,
    "",
    linhaSimples,
    `  Referência: ${dados.link}`,
    linhaSimples,
    "",
    "  Este documento é a prova oficial de sua entrega eletrônica.",
    `  Autenticação: ${dados.protocol}-${dados.ra}`,
    "",
    separador,
  ].join("\n")
}

function createReceiptButton(container, dados) {
  container.querySelector(".download-receipt-btn")?.remove()

  const botao = document.createElement("button")
  botao.type = "button"
  botao.className = "download-receipt-btn"
  botao.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg><span>Baixar Comprovante (TXT)</span>`

  botao.onclick = () => {
    const conteudoOriginal = botao.innerHTML
    const blob = new Blob([gerarComprovante(dados)], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `comprovante_${dados.ra}_${dados.protocol}.txt`
    link.click()
    URL.revokeObjectURL(url)

    botao.innerHTML = "✅ Comprovante Baixado"
    window.setTimeout(() => {
      botao.innerHTML = conteudoOriginal
    }, 3000)
  }

  container.appendChild(botao)
}

/* ──────────────────────────── card ──────────────────────────── */

function initCard(card) {
  const SCRIPT_URL = card.dataset.scriptUrl
  const form = card.querySelector(".submission-form")
  if (!form || !SCRIPT_URL) return

  const statusMsg = card.querySelector(".status-message")
  const receiptContainer = card.querySelector(".receipt-container")
  const fileInput = card.querySelector('input[type="file"]')
  const fileNameDisplay = card.querySelector(".file-name-display")
  const clearFileBtn = card.querySelector(".clear-file-btn")
  const pickFileBtn = card.querySelector(".file-pick-btn")
  const submitBtn = form.querySelector('button[type="submit"]')
  const raInput = form.querySelector("#ra")
  const nomeInput = form.querySelector("#nome_aluno")
  const studentNameDisplay = card.querySelector(".student-name-display")
  const confirmedNameDisplay = card.querySelector(".confirmed-name")
  const raValidationStatus = card.querySelector(".ra-validation-status")

  const selectionScreen = card.querySelector(".selection-screen")
  const formScreen = card.querySelector(".form-screen")
  const selectButtons = card.querySelectorAll(".select-activity-btn")
  const backBtn = card.querySelector(".back-to-selection")
  const activityHighlight = card.querySelector(".highlight-activity")

  /* ── atividade encerrada (ativo = FALSE na aba "Atividades") ── */
  // O backend grava a entrega mesmo com a atividade desativada, então quem barra
  // é o front. Só vale quando a planilha respondeu: se `listarAtividades` falhar,
  // nada é encerrado (mesmo fail-open do rótulo vindo do frontmatter).
  // Chave = nome exato normalizado: o backend compara o texto inteiro, não o
  // código — "AST06" e "AST06 ADS3-SI3 ADS4-SI4" são atividades diferentes.
  const encerradas = new Map() // nome normalizado → nome como está na planilha

  // Motivo da última recusa do anexo. Precisa ficar guardado porque
  // `mostrarErroArquivo` limpa o `<input type="file">`: sem isso, o submit diria
  // "é obrigatório anexar um arquivo" quando o aluno anexou um arquivo recusado.
  let ultimoErroArquivo = ""

  const codigoDaAtividade = (valor) => String(valor || "").trim().split(/\s+/)[0].toUpperCase()

  const normalizarAtividade = (valor) => String(valor || "").trim().toLowerCase()

  const estaEncerrada = (atividade) => encerradas.has(normalizarAtividade(atividade))

  function limparBloqueio() {
    formScreen?.querySelector(".submission-closed")?.remove()
    form.style.display = ""
  }

  function bloquearEntrega() {
    if (!formScreen || formScreen.querySelector(".submission-closed")) return

    const nomes = Array.from(encerradas.values()).join(", ")

    const aviso = document.createElement("div")
    aviso.className = "submission-closed"
    const titulo = document.createElement("strong")
    titulo.textContent = "🚫 Atividade encerrada"
    const texto = document.createElement("p")
    texto.textContent = `${nomes} não recebe mais entregas. Se você precisa entregar, fale com o professor.`
    aviso.append(titulo, texto)

    formScreen.insertBefore(aviso, form)
    // O formulário sai de cena inteiro: sem campos e sem botão, não há envio pela página.
    form.style.display = "none"
    submitBtn.style.display = "none"
    submitBtn.disabled = true

    if (activityHighlight && !activityHighlight.textContent.trim()) {
      activityHighlight.textContent = nomes
    }
    selectionScreen?.classList.add("hidden")
    formScreen.classList.remove("hidden")
  }

  /* ── prazo ── */
  async function exibirInfoPrazo(atividade) {
    form.querySelector(".deadline-info")?.remove()

    let resultado
    try {
      resultado = await getFromGAS(SCRIPT_URL, { action: "buscarAtividade", atividade })
    } catch {
      return
    }
    if (!resultado?.found || !resultado.data_limite) return

    const dataLimite = new Date(resultado.data_limite)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    dataLimite.setHours(0, 0, 0, 0)

    const dias = Math.ceil((dataLimite.getTime() - hoje.getTime()) / 86400000)

    let mensagem
    let classe
    if (dias < 0) {
      mensagem = `⚠️ Prazo encerrado em ${formatarData(resultado.data_limite)} (${Math.abs(dias)} dia(s) de atraso)`
      classe = "late"
    } else if (dias === 0) {
      mensagem = "🔴 Último dia de prazo! Entrega até 23:59"
      classe = "late"
    } else if (dias <= 3) {
      mensagem = `🟡 Prazo: ${formatarData(resultado.data_limite)} (faltam ${dias} dia(s))`
      classe = "on-time"
    } else {
      mensagem = `🟢 Prazo: ${formatarData(resultado.data_limite)} (faltam ${dias} dia(s))`
      classe = "on-time"
    }

    const info = document.createElement("div")
    info.className = `deadline-info ${classe}`
    info.textContent = mensagem
    form.insertBefore(info, form.firstChild)
  }

  /* ── validação local do RA (sem API) ── */
  raInput.addEventListener("input", () => {
    const ra = raInput.value.trim()

    studentNameDisplay.style.display = "none"
    nomeInput.value = ""
    confirmedNameDisplay.textContent = ""

    if (ra.length === 0 || ra.length < 7) {
      raValidationStatus.className = "ra-validation-status"
      raValidationStatus.textContent = ""
      return
    }

    if (!/^[0-9]{7}$/.test(ra)) {
      raValidationStatus.className = "ra-validation-status invalid"
      raValidationStatus.textContent = "❌ RA deve conter exatamente 7 dígitos"
      return
    }

    raValidationStatus.className = "ra-validation-status valid"
    raValidationStatus.textContent = "✔️ RA válido"
  })

  /* ── escolha de atividade ── */
  async function onActivitySelected(atividade) {
    form.setAttribute("data-activity", atividade)
    if (activityHighlight) activityHighlight.textContent = atividade

    selectionScreen?.classList.add("hidden")
    formScreen?.classList.remove("hidden")

    form.reset()
    statusMsg.style.display = "none"
    statusMsg.textContent = ""
    receiptContainer.innerHTML = ""
    fileNameDisplay.textContent = "Nenhum arquivo selecionado"
    clearFileBtn.style.display = "none"
    ultimoErroArquivo = ""
    studentNameDisplay.style.display = "none"
    nomeInput.value = ""
    confirmedNameDisplay.textContent = ""
    raValidationStatus.className = "ra-validation-status"
    raValidationStatus.textContent = ""
    submitBtn.style.display = ""
    submitBtn.disabled = false
    limparBloqueio()

    if (estaEncerrada(atividade)) {
      bloquearEntrega()
      return
    }

    exibirInfoPrazo(atividade)
  }

  // Delegação: sobrevive à reconstrução da lista de atividades
  card.addEventListener("click", (evento) => {
    const botao = evento.target?.closest(".select-activity-btn")
    if (!botao) return
    evento.preventDefault()
    onActivitySelected(botao.getAttribute("data-activity") || "")
  })

  backBtn?.addEventListener("click", () => {
    formScreen?.classList.add("hidden")
    selectionScreen?.classList.remove("hidden")
  })

  const atividadeUnica = form.getAttribute("data-activity")
  if (atividadeUnica) exibirInfoPrazo(atividadeUnica)

  /* ── lista canônica de atividades (aba "Atividades") ── */
  async function sincronizarAtividades() {
    const fallback = Array.from(selectButtons)
      .map((botao) => botao.getAttribute("data-activity") || "")
      .filter((valor) => valor.trim().length > 0)

    const codigos = new Set(fallback.map((valor) => valor.trim().split(/\s+/)[0].toUpperCase()))
    if (codigos.size === 0) return

    const lista = []
    try {
      const resposta = await getFromGAS(SCRIPT_URL, { action: "listarAtividades" })
      if (!resposta || resposta.result !== "success" || !Array.isArray(resposta.atividades)) return

      const vistos = new Set()
      for (const item of resposta.atividades) {
        const nome = String(item?.atividade ?? "").trim()
        if (!nome) continue
        if (!codigos.has(codigoDaAtividade(nome))) continue
        if (item?.ativo === false || String(item?.ativo).toLowerCase() === "false") {
          encerradas.set(normalizarAtividade(nome), nome)
          continue
        }
        const chave = nome.toLowerCase()
        if (vistos.has(chave)) continue
        vistos.add(chave)
        lista.push(nome)
      }
    } catch {
      return // consulta indisponível → mantém o rótulo do frontmatter
    }

    if (lista.length === 0) {
      // Nada ativo casou com o frontmatter. Se a atividade declarada é justamente
      // a desativada, encerra em vez de deixar o formulário do frontmatter valendo.
      if (estaEncerrada(form.getAttribute("data-activity"))) bloquearEntrega()
      return
    }

    const activityList = card.querySelector(".activity-list")
    const template = activityList?.querySelector(".select-activity-btn")

    if (lista.length > 1 && activityList && template) {
      activityList.innerHTML = ""
      for (const nome of lista) {
        const clone = template.cloneNode(true)
        clone.setAttribute("data-activity", nome)
        const rotulo = clone.querySelector(".act-name")
        if (rotulo) rotulo.textContent = nome
        activityList.appendChild(clone)
      }
      form.setAttribute("data-activity", "")
      backBtn?.classList.remove("hidden")
      selectionScreen?.classList.remove("hidden")
      formScreen?.classList.add("hidden")
      return
    }

    const nome = lista[0]
    const atual = form.getAttribute("data-activity") || ""
    form.setAttribute("data-activity", nome)
    if (activityHighlight) activityHighlight.textContent = nome
    backBtn?.classList.add("hidden")
    selectionScreen?.classList.add("hidden")
    formScreen?.classList.remove("hidden")
    // Não chama onActivitySelected(): ele daria form.reset() e apagaria o que o
    // aluno já digitou enquanto a consulta respondia.
    if (atual.trim().toLowerCase() !== nome.toLowerCase()) exibirInfoPrazo(nome)
  }

  sincronizarAtividades().catch(() => {})

  /* ── anexo ── */
  function mostrarErroArquivo(mensagem) {
    ultimoErroArquivo = mensagem
    fileNameDisplay.textContent = `❌ ${mensagem}`
    fileNameDisplay.style.color = "var(--danger)"
    clearFileBtn.style.display = "flex"
    fileInput.value = ""
  }

  fileInput.addEventListener("change", async () => {
    if (fileInput.files && fileInput.files.length > 0) {
      const arquivo = fileInput.files[0]
      const erro = await validarArquivoZip(arquivo)
      if (erro) {
        mostrarErroArquivo(erro)
        return
      }
      ultimoErroArquivo = ""
      fileNameDisplay.textContent = `📄 ${arquivo.name}`
      fileNameDisplay.style.color = "var(--accent)"
      clearFileBtn.style.display = "flex"
    } else {
      ultimoErroArquivo = ""
      fileNameDisplay.textContent = "Nenhum arquivo selecionado"
      fileNameDisplay.style.color = "var(--muted)"
      clearFileBtn.style.display = "none"
    }
  })

  clearFileBtn.addEventListener("click", (evento) => {
    evento.preventDefault()
    evento.stopPropagation()
    fileInput.value = ""
    ultimoErroArquivo = ""
    fileNameDisplay.textContent = "Nenhum arquivo selecionado"
    fileNameDisplay.style.color = "var(--muted)"
    clearFileBtn.style.display = "none"
  })

  // Somente pelo botão (arrastar e soltar foi removido de propósito)
  pickFileBtn?.addEventListener("click", (evento) => {
    evento.preventDefault()
    evento.stopPropagation()
    fileInput.click()
  })

  // Sem isso o navegador abriria o arquivo solto e a página perderia o formulário
  for (const evento of ["dragenter", "dragover", "dragleave", "drop"]) {
    card.addEventListener(evento, (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
  }

  /* ── envio ── */
  form.addEventListener("submit", async (evento) => {
    evento.preventDefault()

    const atividade = form.getAttribute("data-activity")

    // Barreira final: a consulta à planilha é assíncrona, então a atividade pode
    // ter sido encerrada depois de a página abrir.
    if (estaEncerrada(atividade)) {
      bloquearEntrega()
      return
    }

    const ra = raInput.value.trim()

    if (!/^[0-9]{7}$/.test(ra)) {
      showStatus(statusMsg, "error", "O RA deve conter exatamente 7 dígitos numéricos.")
      return
    }

    const github = form.querySelector("#github")?.value.trim() || ""
    const mensagem = form.querySelector("#mensagem")?.value.trim() || ""
    const zipFile = fileInput.files?.[0]

    const temLink = github.length > 0
    const temArquivo = Boolean(zipFile)

    if (temLink && temArquivo) {
      showStatus(statusMsg, "error", "Envie apenas o link OU o arquivo ZIP, não ambos.")
      return
    }
    if (!temLink && !temArquivo) {
      // Anexo recusado agora explica melhor que "falta anexar" (o aluno anexou).
      showStatus(
        statusMsg,
        "error",
        ultimoErroArquivo || "É obrigatório fornecer o link do GitHub OU anexar um arquivo ZIP."
      )
      return
    }
    if (temLink) {
      const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/
      if (!githubRegex.test(github) || github.endsWith(".git")) {
        showStatus(statusMsg, "error", "Link inválido. Use: https://github.com/usuario/repositorio")
        return
      }
    }
    if (temArquivo) {
      const erroArquivo = await validarArquivoZip(zipFile)
      if (erroArquivo) {
        showStatus(statusMsg, "error", erroArquivo)
        return
      }
    }

    statusMsg.style.display = "block"
    statusMsg.className = "status-message"
    statusMsg.innerHTML = temArquivo ? "📤 Preparando arquivo..." : "📝 Enviando dados..."
    receiptContainer.innerHTML = ""
    submitBtn.disabled = true

    try {
      let arquivoZipBase64 = ""
      let arquivoZipNome = ""

      if (temArquivo) {
        arquivoZipNome = zipFile.name
        arquivoZipBase64 = await fileToBase64(zipFile)
      }

      statusMsg.innerHTML = "📨 Enviando a atividade... ⚠️AGUARDE⚠️"

      const params = {
        ra,
        atividade: atividade || "",
        mensagem,
        link_github: github,
        arquivo_zip_nome: arquivoZipNome,
      }
      if (arquivoZipBase64) params.arquivo_zip_base64 = arquivoZipBase64

      const postData = new FormData()
      for (const [chave, valor] of Object.entries(params)) postData.append(chave, valor)

      const textoResposta = await postToGAS(SCRIPT_URL, postData)

      let resultado
      try {
        resultado = JSON.parse(textoResposta)
      } catch {
        throw new Error("Resposta inválida do servidor. Tente novamente.")
      }

      if (resultado.result !== "success") {
        // Duplicidade de 24h = a entrega JÁ existe (a resposta anterior se perdeu)
        if (/j[áa] enviou esta atividade/i.test(String(resultado.error || ""))) {
          statusMsg.style.display = "block"
          statusMsg.className = "status-message success"
          statusMsg.innerHTML =
            "✅ Esta entrega já havia sido registrada nas últimas 24 horas — nenhum envio duplicado foi criado."
          return
        }
        throw new Error(resultado.error || "Erro ao salvar na planilha.")
      }

      const statusValor = resultado.status_prazo
      const nomeAluno = resultado.nome_aluno || ra

      let statusTexto = "No Prazo"
      if (typeof statusValor === "number" && statusValor > 0) statusTexto = `Atrasado (${statusValor} dia(s))`
      else if (statusValor === 0 || statusValor === "0") statusTexto = "No Prazo"
      else if (typeof statusValor === "string") statusTexto = statusValor

      nomeInput.value = nomeAluno
      confirmedNameDisplay.textContent = nomeAluno
      studentNameDisplay.style.display = "block"

      statusMsg.className = "status-message success"
      statusMsg.innerHTML = `✨ Entrega confirmada! Aluno: <strong>${nomeAluno}</strong> (${statusTexto})`
      submitBtn.style.display = "none"

      createReceiptButton(receiptContainer, {
        protocol: resultado.id || resultado.row || Date.now(),
        ra,
        aluno: nomeAluno,
        atividade,
        data: new Date().toLocaleString("pt-BR"),
        status: statusTexto,
        link: temArquivo ? `ZIP: ${arquivoZipNome}` : github,
      })
    } catch (erro) {
      statusMsg.className = "status-message error"
      const aviso404 = /404/.test(String(erro.message))
        ? "<br><small>⚠️ Em alguns casos a entrega é registrada mesmo com este erro. Confirme com o professor antes de reenviar.</small>"
        : ""
      statusMsg.innerHTML = `❌ ${erro.message}${aviso404}`
    } finally {
      if (submitBtn.style.display !== "none") submitBtn.disabled = false
    }
  })
}

export function initSubmission() {
  for (const card of document.querySelectorAll(".submission-container")) initCard(card)
}
