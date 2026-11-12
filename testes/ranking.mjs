// Testes do ranking do dia (sem internet: o fetch é falso). Rodar com: node testes/ranking.mjs
import assert from 'node:assert/strict';
import { criarRanking, limparNome } from '../js/ranking.js';

const teste = (nome, fn) => Promise.resolve(fn()).then(() => console.log('ok -', nome));

function fetchFalso(resposta = { ok: true, status: 201 }) {
  const chamadas = [];
  const fn = async (url, opcoes) => {
    chamadas.push({ url, opcoes });
    if (typeof resposta === 'function') return resposta(url, opcoes);
    return resposta;
  };
  fn.chamadas = chamadas;
  return fn;
}

const URL = 'https://abc.supabase.co';
const CHAVE = 'chave-anon';

await teste('sem url e chave, ligado é false', async () => {
  const r = criarRanking({});
  assert.equal(r.ligado, false);
});

await teste('limparNome corta e limpa', () => {
  assert.equal(limparNome('  Ana  Maria  '), 'Ana Maria');
  assert.equal(limparNome('a'.repeat(30)).length, 24);
});

console.log('ranking tests ok');
