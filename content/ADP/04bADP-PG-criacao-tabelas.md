---
title: Criação das tabelas no Xano
order: 7
---

Seguir o documento de [especificação](https://docs.google.com/document/d/17qAH2g9vHGn0i63Eah2UCYnIq4qpgj7KW71rpiQKyUE/edit?pli=1&tab=t.ago3hfddj9ud#heading=h.ha3wa69j2ro0) para a criação das tabelas no Xano.

- CADASTRO (Roxo)
- TOKENIZAÇÃO (Verde)
- CANCELAMENTO E ESTORNO (Laranja)
- PRODUÇÃO E ENTREGA (Amarelo)
- PRODUTOS E PEDIDOS (Rosa/Magenta)
- TRANSAÇÕES E SISTEMA (Azul-Acinzado)

<img src="https://kroki.io/dbml/svg/eNrFWMFu2zgQvecrCPSSPbRu0GzqFNgCis0sjDqW11L20KIQJiLjspVElqLSNIueeugX9Iv6Yx1Kliw5rpvYDNaH2KLpN5w3b4Yz6fXIX3d-7fV6ZOANvSCc-WR_Jq8l6ZFH_ZM_B6dHf9gv7wG1F8JFwsnUm9IxefOOA-M6lonUL2rEt-S_PUIEIyIzfM41eaM-vMWVWHMwnEVgiBEpzw2kCpcVKJ4Qw6_N3pcavcjtzxyAZ5DyCpsQnoJIqr-l2Tz_JDVrPtRHidrgml--IC8rb58IVlqSTMxlJJWx23CBgYGIXyuhIQbZMt-4E4ReeB5Eg_GITkLqxDF8N0W-QptLA5lcMhfzpEhAN4_qsv5YHSOKE8ERdR11Xd8XHNr43t78uFwvtyxdolMn7sRc1WcumtPHgiHwCol0MqQzOvCdmE3kXAOThZa1zaxI-fIplqlKeIrkNUsXIPRyAxLDNc9iAfWKAqZRZhdSWhlvYL5LORKwdhOd1oT37ltSQv8VnYxeez--_fiKdeVfrpFMLCwHT0-O-wdbFpaFXsIafODdikSF7yJhnFth3EQxaAMywqBpgUWijvRdA7VIKWPkB56JG1tTNuRV24OVzPFmoefj15PXQye-lQdaCtdWwYVTWEEhv6ej2whu4E0GdOydIYhPKKFB6M8mqLwxaMjeg9Xe6fHzZwdHu2kv8McdSyvkVSZcyO8hDKXSiKumfCjOBFurnykdjoZ-V3O5TGLIsNpDWZE2yG7l5F3l1dKs4_Ng_Dm1cAX4Y0zgWKRgK-tdyFjDwjKBEVnqbGPyLs6_dUJMZ_7wvCq_mA6TcEb_9si-l4LmSdnjUe_k2dP-bung37qBK1QXEXSEfT-ZS7UhJv50rZh9-oAk0P-DhE3dmk93k2ToByjIymxgJ44cemcwxzwqizQdHPaPj3dTZQV-i7gSeYegNPwovFNW4uTQpJEGklaxyS7jiLfuVuwejOZz2LZ7-LUWOvR1pb4InRMH2-MD4zm2QuVsVC18NCxiIlc1lhWv5rFsEWKfRQ6R0pIVN0I3_S4am0u9bIcLjRNbitpKVy_XytFRSM-cq6Qx4gwdKWmxUd5FUZEJ076QiotV2dwx5UsS119hi5h31SMMTzdoxzq9_dAw8yaBHRm-U1sjglGAaPbSuimSx14sshucl2yRODp8ftg_2XGKKI2tae4rcCc9iFMT6xpqwRR8tj1IvWCEalKp6lqWyrH_jLjC0eOXuVc5YbBhzn83WtSedatEOQbkTrxVCZ72Uuq0yebWjNEYPPX-cWON63lhb6BmtM6VzOvnLz8BPYQUxw==">

<!-- 


// ==========================================
// CADASTRO (Roxo / #8B5CF6)
// ==========================================

Table PAPEL [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  papel text
}

Table user [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  name text
  email email
  password password
  papel_id integer [ref: > PAPEL.id]
  codigo_opt int
  data_expiracao timestamp
}

Table STATUS_CLIENTE [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  status text
}

Table CLIENTE [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  nome text
  celular text
  cpf text
  status_cliente_id integer [ref: > STATUS_CLIENTE.id]
  user_id integer [ref: - user.id]
}

Table CEP [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  cep text
  uf text
  cidade text
}

Table ENDERECO [headercolor: #8B5CF6] {
  id integer [pk]
  created_at timestamp
  logradouro text
  numero text
  complemento text
  bairro text
  referencia text
  padrao bool
  cliente_id integer [ref: > CLIENTE.id]
  cep_id integer [ref: > CEP.id]
}

// ==========================================
// TOKENIZAÇÃO (Verde / #10B981)
// ==========================================

Table STATUS_TTOKENIZACAO [headercolor: #10B981] {
  id integer [pk]
  created_at timestamp
  status text
}

Table TTOKENIZACAO [headercolor: #10B981] {
  id integer [pk]
  created_at timestamp
  det_cartao_encript text
  cliente_id integer [ref: > CLIENTE.id]
  status_ttokenizacao_id integer [ref: > STATUS_TTOKENIZACAO.id]
}

Table CARTAOTOKNZD [headercolor: #10B981] {
  id integer [pk]
  created_at timestamp
  token text
  codigoclienteassas text
  cliente_id integer [ref: > CLIENTE.id]
}

// ==========================================
// CANCELAMENTO E ESTORNO (Laranja / #F97316)
// ==========================================

Table STATUS_SOLCANCELAMENTO [headercolor: #F97316] {
  id integer [pk]
  created_at timestamp
  status text
}

Table SOLCANCELAMENTO [headercolor: #F97316] {
  id integer [pk]
  created_at timestamp
  motivo text
  pedido_id integer [ref: > PEDIDO.id]
  status_solcancelamento_id integer [ref: > STATUS_SOLCANCELAMENTO.id]
}

Table STATUS_TESTORNO [headercolor: #F97316] {
  id integer [pk]
  created_at timestamp
  status text
}

Table TESTORNO [headercolor: #F97316] {
  id integer [pk]
  created_at timestamp
  valor decimal
  solcancelamento_id integer [ref: > SOLCANCELAMENTO.id]
  status_testorno_id integer [ref: > STATUS_TESTORNO.id]
}

// ==========================================
// PRODUÇÃO E ENTREGA (Amarelo / #EAB308)
// ==========================================

Table STATUS_OP [headercolor: #EAB308] {
  id integer [pk]
  created_at timestamp
  status text
}

Table OP [headercolor: #EAB308] {
  id integer [pk]
  created_at timestamp
  pedido_id integer [ref: > PEDIDO.id]
  status_op_id integer [ref: > STATUS_OP.id]
}

Table STATUS_OE [headercolor: #EAB308] {
  id integer [pk]
  created_at timestamp
  status text
}

Table OE [headercolor: #EAB308] {
  id integer [pk]
  created_at timestamp
  pedido_id integer [ref: > PEDIDO.id]
  status_oe_id integer [ref: > STATUS_OE.id]
}

// ==========================================
// PRODUTOS E PEDIDOS (Rosa/Magenta / #EC4899)
// ==========================================

Table STATUS_PEDIDO [headercolor: #EC4899] {
  id integer [pk]
  created_at timestamp
  status text
  status_para text
}

Table PEDIDO [headercolor: #EC4899] {
  id integer [pk]
  created_at timestamp
  total decimal
  nfc_e text
  cod_entrega text
  cliente_id integer [ref: > CLIENTE.id]
  status_pedido_id integer [ref: > STATUS_PEDIDO.id]
}

Table PRODUTO [headercolor: #EC4899] {
  id integer [pk]
  created_at timestamp
  nome text
  descricao text
  qtd_disp integer
  preco decimal
  precisa_produzir bool
  categoria text
  url_imagem text
}

Table STATUS_ITEM [headercolor: #EC4899] {
  id integer [pk]
  created_at timestamp
  status text
}

Table ITEM [headercolor: #EC4899] {
  id integer [pk]
  created_at timestamp
  qtd integer
  valor_unit decimal
  subtotal decimal
  pedido_id integer [ref: > PEDIDO.id]
  produto_id integer [ref: > PRODUTO.id]
  status_item_id integer [ref: > STATUS_ITEM.id]
}

// ==========================================
// TRANSAÇÕES E SISTEMA (Azul-Acinzado / #64748B)
// ==========================================

Table STATUS_TRANSACAO [headercolor: #64748B] {
  id integer [pk]
  created_at timestamp
  status text
}

Table TRANSACAO [headercolor: #64748B] {
  id integer [pk]
  created_at timestamp
  clienteassas text
  idpayment text
  tipo text
  valor integer
  datavenc text
  descricao text
  statustransacao_id integer [ref: > STATUS_TRANSACAO.id]
}

Table tokens [headercolor: #64748B] {
  id integer [pk]
  created_at timestamp
  plataforma text
  token text
}

Table FAQ [headercolor: #64748B] {
  id integer [pk]
  created_at timestamp
  pergunta text
  resposta text
}


-->