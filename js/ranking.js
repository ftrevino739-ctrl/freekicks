// Ranking do dia: a melhor sequência de gols de cada pessoa no Desafio do Dia vai para um banco na
// internet (Supabase, via HTTP). Sem endereço e chave em CONFIG.ranking, tudo fica desligado e o
// jogo continua igual (a sequência fica só no aparelho).

export function criarRanking(config) {
  const url = (config?.url || '').replace(/\/$/, '');
  const chave = config?.chave || '';
  const tabela = config?.tabela || 'ranking';
  const ligado = Boolean(url && chave);

  async function listar(dia) {
    if (!ligado) return [];
    const query = new URLSearchParams({
      select: 'nome,gols,criado_em',
      dia: `eq.${dia}`,
      order: 'gols.desc,criado_em.asc',
      limit: '20',
    });
    const resposta = await fetch(`${url}/rest/v1/${tabela}?${query}`, {
      headers: { apikey: chave, Authorization: `Bearer ${chave}` },
    });
    if (!resposta.ok) throw new Error(`ranking ${resposta.status}`);
    return resposta.json();
  }

  async function enviar(dia, nome, gols) {
    if (!ligado) throw new Error('ranking desligado');
    const resposta = await fetch(`${url}/rest/v1/${tabela}`, {
      method: 'POST',
      headers: {
        apikey: chave,
        Authorization: `Bearer ${chave}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ dia, nome, gols }),
    });
    if (!resposta.ok) {
      const texto = await resposta.text();
      throw new Error(texto || `ranking ${resposta.status}`);
    }
  }

  return { ligado, listar, enviar };
}
