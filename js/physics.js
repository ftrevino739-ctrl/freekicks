// Física da bola. Não depende do Three.js: só números, para poder ser testada sozinha.
// Eixos: x = direita de quem cobra, y = para cima, z = do gol em direção a quem cobra
// (o gol fica em z = 0 e a bola é chutada no sentido de z negativo).

const GRAUS = Math.PI / 180;
const limitar01 = (v) => Math.min(1, Math.max(0, v));
// Passagem suave de 0 (v <= a) para 1 (v >= b), sem degrau
const suave = (a, b, v) => {
  const t = limitar01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// A bola é oca: momento de inércia I = 2/3 · m · r². Diz quanto um empurrão no ponto de contato
// vira giro e quanto continua como velocidade.
const INERCIA = 2 / 3;

// Cobrador usado quando ninguém é informado: notas 85 em tudo, destro, sem especialidades
export const COBRADOR_NEUTRO = {
  pe: 'D',
  atributos: { FOR: 85, CUR: 85, QUE: 85, PRE: 85, FRI: 85 },
  especiais: [],
};

// Nota do atributo -> 0 (nota 0) a 1 (nota 99), em linha reta
const nivel = (nota) => limitar01(nota / 99);
// Multiplicador de um atributo: 1 para a nota 85 (o cobrador neutro).
// O intervalo completo de 0 a 99 deve ser perceptível sem tornar 99 muito mais forte que o padrão.
const fatorAtributo = (nota, cfg) => 1 + cfg.pesoAtributos * (nivel(nota) - nivel(85));

// Tudo o que o cobrador e o ponto de contato mudam no chute, em forma de multiplicadores
// (o resto do cálculo fica igual). Exportado para o painel de ajuste mostrar o efeito.
export function fatoresDoChute(cobrador, contato, cfg) {
  const { FOR, CUR, QUE, PRE, FRI } = cobrador.atributos;
  const pe = cobrador.pe === 'E' ? -1 : 1;
  const contatoX = contato.x * pe;
  const contatoY = contato.y;
  const forca = fatorAtributo(FOR, cfg);
  const curva = fatorAtributo(CUR, cfg);
  const queda = fatorAtributo(QUE, cfg);
  const precisao = fatorAtributo(PRE, cfg);
  const frieza = fatorAtributo(FRI, cfg);
  return {
    forca,
    curva: curva * (1 + Math.abs(contatoX) * 0.4),
    queda: queda * (contatoY < 0 ? 1 + Math.abs(contatoY) * 0.6 : 1),
    precisao,
    frieza,
    erro: 1 / precisao,
  };
}
