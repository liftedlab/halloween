/**
 * Lista Lifted Lab de Halloween — recebe os nomes do site e salva na planilha.
 * Cole este código em: Planilha > Extensões > Apps Script (apague o que estiver lá).
 * Depois de mudar o código: Implantar > Gerenciar implantações > lápis > Versão: Nova versão > Implantar.
 */
const SHEET_NAME = 'Lista';
const FECHA_EM = new Date('2026-10-31T21:00:00-03:00'); // depois disso a lista não aceita mais nomes

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const p = (e && e.parameter) || {};
    if (p.website) return resposta({ ok: true }); // robô caiu na armadilha
    if (new Date() >= FECHA_EM) return resposta({ ok: false, erro: 'fechada' });

    const nome = limpar(p.nome, 60);
    const insta = limpar(String(p.instagram || '').replace(/^@+/, ''), 40);
    if (!nome) return resposta({ ok: false, erro: 'sem-nome' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(['Data e hora', 'Nome', 'Instagram', 'Chegou?']);
      sh.setFrozenRows(1);
      sh.getRange('A1:D1').setFontWeight('bold');
    }
    destacarRepetidos(sh);
    sh.appendRow([new Date(), nome, insta ? '@' + insta : '', false]);
    sh.getRange(sh.getLastRow(), 4).insertCheckboxes();
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, erro: 'falha' });
  } finally {
    lock.releaseLock();
  }
}

// pinta de vermelho claro as linhas com nome ou @ repetido (só cria a regra uma vez)
function destacarRepetidos(sh) {
  const regras = sh.getConditionalFormatRules();
  const MARCA = '=OR(AND($B2<>"",COUNTIF($B:$B,$B2)>1),AND($C2<>"",COUNTIF($C:$C,$C2)>1))';
  const jaTem = regras.some((r) => {
    const c = r.getBooleanCondition();
    return c && c.getCriteriaValues()[0] === MARCA;
  });
  if (jaTem) return;
  const regra = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(MARCA)
    .setBackground('#f4cccc')
    .setRanges([sh.getRange('A2:D')])
    .build();
  sh.setConditionalFormatRules(regras.concat(regra));
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
