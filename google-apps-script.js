/**
 * Lista Lifted Lab de Halloween — recebe os nomes do site e salva na planilha.
 * Cole este código em: Planilha > Extensões > Apps Script (apague o que estiver lá).
 */
const SHEET_NAME = 'Lista';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return resposta({ ok: true }); // robô caiu na armadilha

    const nome = limpar(p.nome, 60);
    const insta = limpar(String(p.instagram || '').replace(/^@+/, ''), 40);
    if (!nome) return resposta({ ok: false });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(['Data e hora', 'Nome', 'Instagram', 'Chegou?']);
      sh.setFrozenRows(1);
      sh.getRange('A1:D1').setFontWeight('bold');
    }
    sh.appendRow([new Date(), nome, insta ? '@' + insta : '', false]);
    sh.getRange(sh.getLastRow(), 4).insertCheckboxes();
    return resposta({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// abrir o link /exec no navegador mostra isso — serve pra testar se publicou certo
function doGet() {
  return resposta({ ok: true, msg: 'Lista no ar.' });
}

function limpar(v, max) {
  let s = String(v || '').replace(/\s+/g, ' ').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s; // evita que alguém escreva uma fórmula
  return s;
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
