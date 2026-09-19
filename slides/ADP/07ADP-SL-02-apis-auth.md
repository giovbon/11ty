<!-- .slide: data-background-image="https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg" data-background-size="cover" data-background-opacity="0.4" -->

<div class="glass-box">
    <h1>APIs de autenticação</h1>
</div>

---

## APIs de Autenticação


Os três endpoints (`auth/login`, `auth/signup` e `auth/me`), fazem parte do grupo de APIs de Autenticação do Xano e são fundamentais para o *gerenciamento de usuários e sessões em qualquer aplicação*.

Eles utilizam o modelo padrão de autenticação por Token (JWT), onde o Xano se destaca por já fornecer essa funcionalidade pronta, baseada na tabela `user` interna.

---

O endpoint de `auth/signup` (**Cadastro**) é a porta de entrada para *novos usuários* na sua aplicação. Ele recebe as informações iniciais, como nome, e-mail e senha. O papel fundamental dessa API é pegar a *senha* fornecida, *criptografá-la de forma segura e salvar o novo registro na tabela user do banco de dados*. Para melhorar a experiência do usuário, logo após criar a conta com sucesso essa API já devolve um token JWT (authToken) para que o usuário seja logado automaticamente, sem precisar passar pela tela de login logo em seguida.


<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNp9ks9q20AQxu9-irkYy2CTkKMOgbhGoW1IQmVTXSfSWF6i3XFmd00h5GFKD3kQv1hnpTQxMVQHwfLNb-abP-Pxs3Em5PA8CVuyNMlh0qA8Tl5exuORp6dIrqalwVbQjkA_jIFdtA8k_XOHEkxtdugCrAE9rH08_BbDJ2qR1ELYhTm55kSuklyhY8iu7r9OT_TlIgUs0NUMDcESG_aQrfCBOoToSaajnlnPLy-LHO6F1PmWYMNiY9dbgsyxpRnQ3KLpZuDJbXGoVChVKXVXruBMW9yeedO6uPsP0v9uORDwngSqmVpMdbkm79GSC73Rktoo6A6v2APVUOiLmF1gHeoGAYesKTiZTc-EvIentCV2ewQGx3sGodb4IAw123e6_sjYDOxyMX8rxm5jUmKNwcPr4Y8aY53Z0aJOm9EZXpP8Cye4Sm3xcQ9JVktpWit-JAfZt5-rKTTJkfeKvQUPC_lBgcV9AsqAIXq4OD-Hu-9HYy0G5jqiNJ8Q-pVDxzV2pebDlj72t87hhlvsL9SiHk6_BIJMqDFCtWEtryeFoH0TglFRHU3_AiUs-GA=" width="70%" data-preview-image>
</div>

---

O endpoint `auth/login` (**Entrar**) é utilizado quando um usuário que já possui conta deseja *acessar a aplicação novamente*. Ele recebe as credenciais (geralmente e-mail e senha), *vai até a tabela user e verifica se o e-mail existe e se a senha fornecida, após passar pelo algoritmo de verificação, corresponde àquela que está criptografada no banco de dados*. Se tudo estiver correto, o Xano gera e devolve um token JWT (authToken). Esse token funciona como um "crachá de acesso" digital, temporário e inviolável, que o usuário usará para provar quem ele é nas próximas requisições.

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNp1ksFq20AQhu9-imnA2IaYhB51CNR2FdqGJNR2out4dywNkXbc3VUohDxM6KEP4hfrSHIcJ6Y6CMT8_873_6t-_4kdxwSeBrGgigYJDCz6h8Hzc7_fC_SrJmdoxph7rHqgD9ZRXF2tyLefG_SRDW_QRVgCBliGevviWY6maTNNvbg4JmePxlkzztAJDL_cfhsdzWeTRjBBZwQswQytBBgucEUlQh3Ij3qtZzm-uEgTuPWk5AUBjSvkEggCuQJbSaqSTCU38wWcaZ7irJScHQypkZ52yo6gfV1LJJBH8pCdKkcCd-R5zQa3f7d_WpqpJ6vrGDm0jkw3NMJJHUxD11UCGyrlFWgt3pFh2xU1m4w7qJ8UdYCg4Wwb0cqbf2ikAuz4wHjeRNF7WaPd0WbdGVOptDncKy3nHFUEh3Y9d9WU-Z-YWuHXikNoAwqcTD2aYvty8m7PW2p4xJIVGMMnuCTdLc2PUizkgbTX7_eLV8DudvYpD1XziLEO8Pn8HG5-HNSfdp7LGr39YKHfCZRisJzreZjTaG9YJnDFqx2JoRAEdp1olYTqypX2H9lX8ys=" width="70%" data-preview-image>
</div>

---

o endpoint `auth/me` (**Autenticação**) exige que o authToken (o token JWT) seja anexado e enviado no cabeçalho (header) da requisição. Quando o Xano recebe a chamada, ele valida se o token não expirou e não foi adulterado, e descriptografa a assinatura para descobrir o ID do usuário. Ele serve principalmente como a etapa de *validação e liberação para acessar APIs restritas*. Ao confirmar a validade da sessão através do `auth/m`e e carregar as permissões do usuário, o front-end garante que aquele "crachá" está ativo e tem autorização para ser usado nas próximas requisições.

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNplUttq20AQfc9XDAFjG2oc-iiKwY7qNrS0JbWDX8fSKB5i7aizu6Yk5GNCH_oBpV-gH-ushFODtWJhdy7nnDk7GDyx45DB0zDsqKZhBsMS9WH4_DwYXHj6EckVlDPeK9YXYB_GIC7WW9Lu2KAGLrhBF2AN6GHtY_uiLGfRZYouVVyYkCvPwpsU3qATGM2_3YzP4vkiJSzQFQIlQY6leBitcEt7hOhJxxddzXoymy0zmG-VQGDeNDCFeUHeI6gEhMZ2uucSu-xln31LRWxI0SpM324lD-TA4_4g4BBqqts_yv8rNhl8eL-Cacqd1gSjj4QlqaHahSg_YmBxsCBUUnj32nLWy-q2L0YD5GDxzRsTl8Ed7o1V-7v9ZQIFLq8Vi137ctllb3rUO1KuuEDwSVzoaNLPhlUi2F8JA5ZxH0xKKaeFOflCuQliPlYItrxnhyGaZrIWQZGt402eoOOphalBoreI3nDLbuwENqyavW__kk8Vdqx4D6Po0dkxNeql5otJT-CWgqhLuMCuEq2T0lRtHEz4I5boz7DPB2VefWZ7e8c5Ue_tkerRzR7LmPZ8T_rC6HswSA9vr67g66fxq6frDK7FVWzMIM3XxBmAGXlIE1J7spSMtRg7m2-FRbr1QTngP4xsFLU=" width="70%" data-preview-image>
</div>

---

## Casos de uso

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNqtkMFOg0AQQO_9irkQaFJs9MihidZwMraxRblO2QlMCju4uzQmTT_Gb_HHXKDRQ-1NbmTePOYRBEfW7BI4hq6ihsIEQoVmH55OQTCx9N6RLuiRsTTYTMA_2DnRXbMjM7y2aBwX3KJ2kAFayGz39WlYLqZpP02NaBeTVhDdt-38jXbTCzDvwRy1QPSAxb6np5OBehZHIAcykM0gT-D2BlawNtwQG4GlV6PzW0tUaJ2RUZ3Fi0WaeIx8SkWgUIkFRVCcsYFKPeWN69VmC3PfWM0tl7prIdLS0AyoQa5nYElXOHrzeBQvDSN052ogMOTEaOx_VLWVPekfv4c3WB8Q5HcIEX0kUEuB9cbvYUlXWu_61pfB7ROfpGT9dx_F_an-kOHWK3F1v--_fbXqFWtWCIUh5bWMbP8j7RtuCsMn" data-preview-image>
</div>

---

<div style="text-align: center;">
    <img src="https://kroki.io/mermaid/svg/eNqtUrFu20AM3f0VXAzLgB0PaRehMKA0dVOgKIwkSr3SEiMTlu5U3qkIEuRjjA6dMgX5Av1YeVKQqEjH3kbyPT7y8cbjOzbsY7ib-B1VNIlhkqPsJ_f34_HI0Y-GTEanjIVgNQJ92HhrmmpL0oU1iueMazQeUkAHqWvag7B9U12F6kqs8XMyOURJXS--03b6BrgJwA0aC9EJZvuAno461DfrCexPEkhnsInhGAjeHcE5OY-NoMktIFyQc-0vJV9hyTm2vzXoRdL5crmKIdmKdgHVh4VyMxShApVZt4eCDXbYVY-9IuFrzhAcwa49hO13l3ZPBgxCRVX7KPxK0JE-f7qERUAtKoLojDAnUUlNWOFb9GwNnBCK7vDhpdmyn28zfxbtBh9oEQh5Kyp5irl1oHuuSa65fFFOY_jKehNlZbq_VQrdaEK3YuMVq2kobYE5_tvK90eQ9My1aKlg1YhSDT_qwdoH0_zt4YUt9Vxe5Tp_dT7nJcQR3cQQ2josczsDyjUrUFvnp0OfzvVrseOerYsl6y-DJv_HtxlkOz0v1CQV66d4IjewMvgY3Bx6mPhGe9yGz-CpRMhsBd1yTekV-wdSdg0Y" data-preview-image>
</div>