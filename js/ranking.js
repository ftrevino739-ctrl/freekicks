// Ranking do dia: a melhor sequência de gols de cada pessoa no Desafio do Dia vai para um banco na
// internet (Supabase: serviço de banco de dados com API HTTP; a chave pública "anon" fica na página,
// que é o desenho normal dele). Todo mundo que abre o jogo vê o ranking de hoje; cada dia começa do zero.
// Sem Three.js, sem sorteio e sem estado global: roda no Node (testes/ranking.mjs).

export const NOME_MAXIMO = 24;   // letras no nome
export const LINHAS_MAXIMO = 50; // linhas mostradas no ranking
const TEMPO_LIMITE_MS = 8000;    // 8 s esperando a internet; depois desiste
const DIA_VALIDO = /^\d{4}-\d{2}-\d{2}$/;

// Tira quebras de linha e espaços sobrando e corta no tamanho máximo
export function limparNome(nome) {
  return String(nome ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, NOME_MAXIMO)
    .trim();
}

// Chama fetch com limite de tempo (AbortController: cancela a chamada quando passa do tempo)
async function fetchComTempo(url, opcoes) {
  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), TEMPO_LIMITE_MS);
  try {
    return await fetch(url, { ...opcoes, signal: controlador.signal });
  } finally {
    clearTimeout(timer);
  }
}

export function criarRanking(config) {
  const url = (config?.url || '').replace(/\/$/, '');
  const chave = config?.chave || '';
  const tabela = config?.tabela || 'ranking';
  const ligado = Boolean(url && chave);

  async function listar(dia) {
    if (!ligado) return [];
    if (!DIA_VALIDO.test(dia)) throw new Error('dia inválido');
    const query = new URLSearchParams({
      select: 'nome,gols,criado_em',
      dia: `eq.${dia}`,
      order: 'gols.desc,criado_em.asc',
      limit: String(LINHAS_MAXIMO),
    });
    const resposta = await fetchComTempo(`${url}/rest/v1/${tabela}?${query}`, {
      headers: { apikey: chave, Authorization: `Bearer ${chave}` },
    });
    if (!resposta.ok) throw new Error(`ranking ${resposta.status}`);
    return resposta.json();
  }

  async function enviar(dia, nome, gols) {
    if (!ligado) throw new Error('ranking desligado');
    const nomeLimpo = limparNome(nome);
    if (!nomeLimpo) throw new Error('nome vazio');
    if (!Number.isInteger(gols) || gols < 1 || gols > 200) throw new Error('gols inválidos');
    const resposta = await fetchComTempo(`${url}/rest/v1/${tabela}`, {
      method: 'POST',
      headers: {
        apikey: chave,
        Authorization: `Bearer ${chave}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ dia, nome: nomeLimpo, gols }),
    });
    if (!resposta.ok) {
      const texto = await resposta.text();
      throw new Error(texto || `ranking ${resposta.status}`);
    }
  }

  return { ligado, listar, enviar };
}
