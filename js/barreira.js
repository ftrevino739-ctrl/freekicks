// Barreira: os jogadores que ficam a 9,15 m da bola tapando parte do gol.
// Aqui só a lógica (onde cada um fica, o pulo) e a colisão com a bola; o desenho dos bonecos é de outro arquivo.
// Não depende do Three.js: dá para rodar no Node (veja testes/defesa.mjs).
// Eixos: x = direita de quem cobra, y = para cima, z = do gol em direção a quem cobra (gol em z = 0).

export const PADRAO_BARREIRA = {
  distancia: 9.15,       // m da bola até a barreira (regra do futebol)
  espacamento: 0.55,     // m entre os centros de dois jogadores lado a lado
  sobraTrave: 0.3,       // m que o jogador de fora passa da linha bola -> trave, para o lado de fora
  altura: 1.85,          // m: altura média dos jogadores (com a cabeça)
  variacaoAltura: 0.07,  // m para mais ou para menos em cada jogador
  raio: 0.23,            // m: "grossura" do corpo (metade da largura dos ombros)
  raioCabeca: 0.12,      // m
  chancePulo: 0.4,       // chance de a barreira pular na cobrança (0 = nunca, 1 = sempre)
  alturaPulo: 0.4,       // m que os pés sobem no pulo (média)
  variacaoPulo: 0.05,    // m para mais ou para menos em cada jogador
  atrasoPulo: 0.14,      // s depois do chute para começar a subir (média)
  variacaoAtraso: 0.04,  // s para mais ou para menos: cada um pula num instante
  duracaoPulo: 0.55,     // s no ar
  quique: 0.3,           // quanto a bola volta ao bater na barreira (0 = morre, 1 = volta tudo)
  atrito: 0.6,           // quanto sobra da velocidade "de raspão" depois da batida
};

const GRAUS = Math.PI / 180;
const lerCfg = (cfg) => ({ ...PADRAO_BARREIRA, ...((cfg && cfg.barreira) || {}) });

// Quantos jogadores vão para a barreira: menos quanto mais longe; de ângulo aberto, no máximo 3
export function quantidadeNaBarreira(distancia, anguloGraus) {
  let n = distancia <= 20 ? 5 : distancia <= 24 ? 4 : distancia <= 28 ? 3 : 2;
  if (Math.abs(anguloGraus) > 25) n = Math.min(n, 3);
  return n;
}

// Monta a barreira para uma falta. posBola: {x, z}. aleatorio: função que devolve de 0 a 1.
// O jogador de fora fica alinhado com a trave mais próxima (vista da bola), um pouco para fora,
// e os outros vão lado a lado em direção ao centro do gol. Em falta central, cobre uma das metades.
// Todos ficam a 9,15 m da bola (num arco), virados para ela.
export function montarBarreira(posBola, cfg = {}, aleatorio = Math.random) {
  const c = lerCfg(cfg);
  const meia = (cfg.golLargura ?? 7.32) / 2;
  const bola = { x: posBola.x, z: posBola.z };
  const distanciaGol = Math.hypot(bola.x, bola.z);
  const angulo = Math.atan2(bola.x, bola.z) / GRAUS;
  const n = quantidadeNaBarreira(distanciaGol, angulo);

  // Sorteios sempre na mesma ordem e na mesma quantidade: mesma semente, mesma barreira
  const sorteioLado = aleatorio();
  const sorteioPulo = aleatorio();
  const sorteios = [];
  for (let i = 0; i < n; i++) sorteios.push([aleatorio(), aleatorio(), aleatorio(), aleatorio()]);

  // Lado coberto: o da trave mais próxima. Bem de frente, sorteia uma das metades.
  const lado = Math.abs(angulo) >= 4 ? Math.sign(bola.x) : sorteioLado < 0.5 ? -1 : 1;

  // Direção da bola para a trave do lado coberto, e a perpendicular que aponta para fora do gol
  const tx = lado * meia - bola.x;
  const tz = -bola.z;
  const dt = Math.hypot(tx, tz) || 1;
  const paraTrave = { x: tx / dt, z: tz / dt };
  let fora = { x: -paraTrave.z, z: paraTrave.x };
  if (fora.x * lado < 0) fora = { x: -fora.x, z: -fora.z };

  // Alturas variadas; os mais altos ficam do lado de fora (onde a bola curva por cima)
  const alturas = sorteios
    .map(([s]) => c.altura + (2 * s - 1) * c.variacaoAltura)
    .sort((a, b) => b - a);

  const pula = sorteioPulo < c.chancePulo;
  const jogadores = [];
  for (let i = 0; i < n; i++) {
    // Ângulo (visto da bola) a partir da linha bola -> trave: + = para fora
    const a = (c.sobraTrave - i * c.espacamento) / c.distancia;
    const dx = paraTrave.x * Math.cos(a) + fora.x * Math.sin(a);
    const dz = paraTrave.z * Math.cos(a) + fora.z * Math.sin(a);
    const [, s1, s2, s3] = sorteios[i];
    jogadores.push({
      x: bola.x + dx * c.distancia,
      z: bola.z + dz * c.distancia,
      raio: c.raio,
      altura: alturas[i],
      rotacaoY: Math.atan2(-dx, -dz), // de frente para a bola (0 = olhando para +z)
      yPes: 0,                       // altura da sola (sobe no pulo)
      progressoPulo: 0,              // 0 = no chão antes do pulo, 1 = pulo terminado
      pulo: {
        vai: pula,
        // (nunca antes do chute, nem com os pés abaixo do chão, mesmo com os ajustes no zero)
        atraso: Math.max(0, c.atrasoPulo + (2 * s1 - 1) * c.variacaoAtraso),
        altura: Math.max(0, c.alturaPulo + (2 * s2 - 1) * c.variacaoPulo),
        duracao: Math.max(0.05, c.duracaoPulo * (0.95 + 0.1 * s3)),
      },
      batida: 0,                     // força da última bolada (para o boneco reagir)
    });
  }

  return {
    jogadores,
    lado,
    pula,
    bola,
    distancia: c.distancia,
    direcao: { x: (0 - bola.x) / distanciaGol, z: (0 - bola.z) / distanciaGol },
    batidas: 0,
    ultimaBatida: null,
    _anterior: null,
    _bola: null,
  };
}

// Atualiza o pulo de cada jogador da barreira. tempo: segundos desde o chute.
export function atualizarBarreira(b, tempo) {
  for (const j of b.jogadores) {
    if (!j.pulo.vai) continue;
    const t = tempo - j.pulo.atraso;
    if (t <= 0) {
      j.progressoPulo = 0;
      j.yPes = 0;
    } else if (t >= j.pulo.duracao) {
      j.progressoPulo = 1;
      j.yPes = 0;
    } else {
      j.progressoPulo = t / j.pulo.duracao;
      // Parábola: sobe e desce
      j.yPes = 4 * j.pulo.altura * j.progressoPulo * (1 - j.progressoPulo);
    }
  }
}

// Colisão da bola com a barreira. Muda pos, vel e giro da bola se bater.
// Retorna true se bateu neste passo.
export function colidirBolaBarreira(b, bola, r = 0.11) {
  if (!b.jogadores.length) return false;
  const pos = bola.pos;
  const vel = bola.vel;
  const giro = bola.giro;
  const a = b._anterior || pos;
  const dx = pos.x - a.x;
  const dy = pos.y - a.y;
  const dz = pos.z - a.z;
  const andou = Math.hypot(dx, dy, dz);
  const amostras = Math.max(1, Math.ceil(andou / 0.05));
  let bateu = false;

  for (let k = 1; k <= amostras && !bateu; k++) {
    const f = andou > 2 ? 1 : k / amostras;
    const p = { x: a.x + dx * f, y: a.y + dy * f, z: a.z + dz * f };
    for (let i = 0; i < b.jogadores.length; i++) {
      const j = b.jogadores[i];
      // Descarta rápido quem está longe
      if (Math.abs(p.x - j.x) > 0.6 || Math.abs(p.z - j.z) > 0.6) continue;
      const m = maisPerto(j, p, { raio: j.raio, raioCabeca: 0.12 });
      if (m.folga >= r) continue;

      // Normal da batida: do corpo para a bola (se a bola estiver bem no eixo, usa a direção de onde ela veio)
      let nx = p.x - m.centro.x;
      let ny = p.y - m.centro.y;
      let nz = p.z - m.centro.z;
      let d = Math.hypot(nx, ny, nz);
      if (d < 1e-6) {
        const v = Math.hypot(vel.x, vel.y, vel.z) || 1;
        nx = -vel.x / v;
        ny = -vel.y / v;
        nz = -vel.z / v;
        d = 1;
      }
      nx /= d;
      ny /= d;
      nz /= d;
      const encosta = m.raio + r + 1e-3;
      pos.x = m.centro.x + nx * encosta;
      pos.y = Math.max(r, m.centro.y + ny * encosta);
      pos.z = m.centro.z + nz * encosta;

      const vn = vel.x * nx + vel.y * ny + vel.z * nz;
      if (vn < 0) {
        const tx = vel.x - vn * nx;
        const ty = vel.y - vn * ny;
        const tz = vel.z - vn * nz;
        vel.x = tx * 0.6 - vn * 0.3 * nx;
        vel.y = ty * 0.6 - vn * 0.3 * ny;
        vel.z = tz * 0.6 - vn * 0.3 * nz;
        const impacto = -vn;
        if (impacto > 0.5) {
          giro.x *= 0.3;
          giro.y *= 0.3;
          giro.z *= 0.3;
          bola.danca = null;
          if ('curvaTardia' in bola) bola.curvaTardia = null;
          j.batida = impacto;
          b.batidas++;
          b.ultimaBatida = { jogador: i, parte: m.parte, impacto };
          bola.eventos.push({ tipo: 'barreira', impacto, jogador: i, parte: m.parte, x: pos.x, y: pos.y, z: pos.z });
        }
      }
      bateu = true;
      break;
    }
  }

  b._anterior = { x: pos.x, y: pos.y, z: pos.z };
  b._bola = bola;
  return bateu;
}

// Sem barreira (pênalti): o mesmo formato que montarBarreira devolve, com a lista de jogadores vazia,
// para o resto do jogo (atualizar, colidir, bonecos) seguir sem caso especial.
export function semBarreira(posBola) {
  return {
    jogadores: [],
    lado: 0,
    pula: false,
    bola: { x: posBola.x, z: posBola.z },
    distancia: 0,
    direcao: { x: 0, z: -1 },
    batidas: 0,
    ultimaBatida: null,
    _anterior: null,
    _bola: null,
  };
}

function maisPerto(j, p, c) {
  // Simplificado: considera o corpo como um cilindro + cabeça
  const cy = j.yPes + j.altura * 0.5;
  const dist = Math.hypot(p.x - j.x, p.z - j.z);
  const folgaCorpo = dist - c.raio;
  const centroCorpo = { x: j.x, y: cy, z: j.z };
  if (folgaCorpo < 0.2) {
    return { folga: folgaCorpo, centro: centroCorpo, raio: c.raio, parte: 'corpo' };
  }
  const cabecaY = j.yPes + j.altura - c.raioCabeca;
  const distCabeca = Math.hypot(p.x - j.x, p.y - cabecaY, p.z - j.z);
  const folgaCabeca = distCabeca - c.raioCabeca;
  return { folga: Math.min(folgaCorpo, folgaCabeca), centro: { x: j.x, y: cabecaY, z: j.z }, raio: c.raioCabeca, parte: 'cabeca' };
}
