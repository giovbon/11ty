---
title: Sendgrid e Salvando Dados
presentation: "slides/NLCW/08NLCW-SL-salvando-dados.md"
order: 10
---

## Configuração do Sendgrid

Requisito: ter conta criada no [sendgrid](https://login.sendgrid.com/login/identifier). Vai envollver verificação de email e celular. Após criar a conta vai aparecer tela para validar um remetente para conseguir enviar e-mails (*Sender*), coloque um email seu, os dados de endereço, e depois valide pelo email que receberá nele.

No xano:

Pesquise no campo *marketplace* e entre, depois acesse ícone de *messaging* > *sendgrid email* > *get extension* > *get*. Depois que atualizar a página vá em *install extension* > *install* > *manage*

Com isso criará a API: Sendgrid Validation.

Os campos que exigirão preenchimento de valores: 
- `sendgrid_from_email`: o email que criou a conta no sendgrid
- `sendgrid_api_key`: começa com `SG.`, chave da api que deverá ser criada na [página](https://login.sendgrid.com/settings/api_keys) da interface web do sendgrid, de full access.

Não esqueça de salvar ambos os campos antes de sair da página.

## 📚 Referência
- [Introdução a Componentes | Documentação do FlutterFlow](https://docs.flutterflow.io/resources/ui/components/)