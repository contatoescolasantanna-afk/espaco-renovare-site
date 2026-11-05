/**
 * PLANILHA DE PEDIDOS DE VISITA — Espaço Renovare
 * Cada pedido feito no site vira uma linha nesta planilha e um e-mail para a escola.
 * Assim dá para contar quantos contatos o site gera por mês e de onde vieram.
 *
 * Como instalar (5 minutos, com a conta Google da escola):
 * 1. Crie uma planilha no Google Sheets chamada "Pedidos de visita – Site".
 * 2. Menu Extensões > Apps Script. Apague o conteúdo e cole este arquivo inteiro.
 * 3. Clique em Implantar > Nova implantação > tipo "App da Web".
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 4. Autorize e copie a URL do app da Web (termina em /exec).
 * 5. No painel do site (Configurações gerais), cole a URL em
 *    "Receber pedidos de visita também por e-mail (endpoint)".
 */
var EMAIL_ESCOLA = "contato.escolasantanna@gmail.com";

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.site) return ContentService.createTextOutput("ok"); // proteção contra robôs
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var aba = planilha.getSheetByName("Visitas") || planilha.insertSheet("Visitas");
  if (aba.getLastRow() === 0) {
    aba.appendRow(["Data", "Nome", "WhatsApp", "Criança", "Idade", "Período", "Melhor horário", "Como conheceu", "Página", "Status"]);
    aba.setFrozenRows(1);
  }
  aba.appendRow([new Date(), p.nome, p.whatsapp, p.crianca, p.idade, p.periodo, p.quando, p.origem, p.pagina, "Novo"]);

  var corpo = [
    "Novo pedido de visita pelo site!",
    "",
    "Nome: " + (p.nome || ""),
    "WhatsApp: " + (p.whatsapp || ""),
    "Criança: " + (p.crianca || "-") + " (" + (p.idade || "") + ")",
    "Período de interesse: " + (p.periodo || "-"),
    "Melhor horário: " + (p.quando || "-"),
    "Conheceu por: " + (p.origem || "-"),
    "",
    "Responder pelo WhatsApp: https://wa.me/55" + String(p.whatsapp || "").replace(/\D/g, "")
  ].join("\n");
  MailApp.sendEmail(EMAIL_ESCOLA, "🌞 Novo pedido de visita – " + (p.nome || "site"), corpo);
  return ContentService.createTextOutput("ok");
}
