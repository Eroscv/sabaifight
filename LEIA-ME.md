# Site Sabai Fight — pronto pra publicar

Esta pasta tem o site estático completo: `index.html` + `logo.png`. Não precisa de build, framework nem servidor — é só subir como está.

## 1. Colocar no ar (grátis)

1. Crie uma conta na [Vercel](https://vercel.com) ou [Netlify](https://netlify.com) (as duas têm plano grátis que cobre esse site de sobra).
2. Arraste esta pasta (`index.html` + `logo.png`) direto na área de deploy do painel deles — nenhuma das duas precisa de comandos de terminal pra isso.
3. Depois do primeiro deploy, vá em **Domains** / **Domínios** no painel e adicione `sabaifight.com.br`.
4. A plataforma vai te dar um ou dois registros DNS (tipo A ou CNAME) pra colar no painel do Registro.br, onde você comprou o domínio. Isso leva algumas horas pra propagar.

## 2. Ligar o formulário de contato numa planilha

O formulário já está pronto no `index.html`, só falta uma URL. Veja a constante `FORM_ENDPOINT = ''` perto do fim do arquivo (dentro da tag `<script>`).

**Passo a passo:**

1. Crie uma [Google Sheets](https://sheets.google.com) nova. Dê o nome que quiser (ex. "Contatos Sabai Fight").
2. Na primeira linha, pode deixar os cabeçalhos: `Data`, `Nome`, `WhatsApp`, `Já treinou`.
3. Menu **Extensões → Apps Script**.
4. Apague o conteúdo padrão e cole:

   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var d = e.parameter;
     sheet.appendRow([new Date(), d.nome, d.whatsapp, d.experiencia]);
     return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

5. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**.
   - Executar como: **Eu** (sua conta).
   - Quem tem acesso: **Qualquer pessoa**.
6. Autorize o acesso quando o Google pedir (é a sua própria planilha, então é seguro).
7. Copie a URL que termina em `/exec`.
8. Abra o `index.html`, ache a linha:

   ```javascript
   var FORM_ENDPOINT = '';
   ```

   e cole a URL entre as aspas:

   ```javascript
   var FORM_ENDPOINT = 'https://script.google.com/macros/s/SEU_ID_AQUI/exec';
   ```

9. Suba o arquivo atualizado de novo (repete o passo 1.2).

Pronto: cada envio do formulário vira uma linha nova na planilha. Quando quiser o arquivo `.xlsx`, é só abrir a planilha e ir em **Arquivo → Fazer download → Microsoft Excel (.xlsx)**.

## O que ainda falta preencher no site

Antes de divulgar, procure por `[ENTRE COLCHETES]` no `index.html` e substitua:

- `[NÚMERO]` do WhatsApp (aparece 4 vezes — cabeçalho, menu mobile, seção de contato e botão flutuante; procure por `wa.me/` e troque por `wa.me/55SEUNUMEROAQUI`)
- `[RUA, NÚMERO, BAIRRO]` — endereço da unidade
- `[DIAS]` / `[HORÁRIO]` — na tabela de horários
- `[DIAS E PERÍODOS...]` — horário de funcionamento
- `[HISTÓRIA DO PROFESSOR...]`
- `[IDADE MÍNIMA...]` e `[RESPOSTA SOBRE EQUIPAMENTO...]` — nas Dúvidas comuns
- As 3 citações de depoimentos (`[Depoimento de um aluno...]`) — troque por depoimentos reais quando tiver
- As duas fotos placeholder ("Foto da escola" e "Foto de fundo") — troque `background:#ece6d5` por `background-image:url('sua-foto.jpg')` nos dois `<div>` correspondentes
