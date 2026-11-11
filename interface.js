// Interface (HUD): cartão do cobrador, lista "Quem bate?", resultado, placar e botões do topo.
// Só mexe na página (HTML); não sabe nada de 3D nem de física.

import { overall } from './elenco.js?v=10';

const ATRIBUTOS = [
  ['FOR', 'Strength'],
  ['CUR', 'Curve'],
  ['QUE', 'Dip'],
  ['PRE', 'Precision'],
  ['FRI', 'Composure'],
];

const NOMES_ESPECIAIS = {
  trivela: 'Trivela',
  semRotacao: 'No spin',
  folhaSeca: 'Dry leaf',
};

const POSICIONES = {
  GOL: 'POR', LD: 'LD', ZAG: 'DFC', LE: 'LI', MC: 'MC', MD: 'MD', MEI: 'MCO', ME: 'MI', ATA: 'DEL',
};

const $ = (id) => document.getElementById(id);

// Texto que vem de fora (nomes do ranking, da internet) nunca entra como HTML
function escaparHtml(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 'AAAA-MM-DD' vira 'DD/MM'
function diaCurto(dia) {
  const partes = String(dia || '').split('-');
  return partes.length === 3 ? `${partes[2]}/${partes[1]}` : '';
}

const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;
const abreviarEquipo = (nombre) => {
  const palabras = String(nombre || '').trim().split(/\s+/).filter(Boolean);
  const siglas = palabras.length > 1
    ? palabras.slice(0, 3).map((palabra) => palabra[0]).join('')
    : (palabras[0] || 'EQ').slice(0, 3);
  return siglas.toLocaleUpperCase('es-MX');
};

// Cor da nota: verde para as altas, amarelo para as médias, laranja para as baixas
function corDaNota(nota) {
  if (nota >= 90) return '#4ade80';
  if (nota >= 80) return '#f7d84a';
  return '#f59e0b';
}

function barrasDeAtributos(jogador) {
  return ATRIBUTOS.map(([chave, nome]) => {
    const v = jogador.atributos[chave];
    return `<div class="atributo" title="${nome}">
      <span>${nome}</span>
      <i><b style="width:${Math.max(0, Math.min(100, (v / 99) * 100))}%;background:${corDaNota(v)}"></b></i>
      <em>${v}</em>
    </div>`;
  }).join('');
}

function selos(jogador) {
  const pe = `<span class="selo">${jogador.pe === 'E' ? 'Left-footed' : 'Right-footed'}</span>`;
  const especiais = (jogador.especiais || [])
    .map((e) => `<span class="selo especial">${NOMES_ESPECIAIS[e] || e}</span>`)
    .join('');
  return pe + especiais;
}

const EXPLICA_LISTA = {
  falta: 'Ordenados por su rating for ESTE free kick: distancia, lado, pierna hábil y estilo. La valoración general es solo una referencia.',
  penalti: 'Ordenados por su rating for penalties: cuentan la precisión y el temple; la fuerza también ayuda. La valoración general es solo una referencia.',
};

// aoAbrirRanking(): pediram a folha do ranking (o main.js carrega e chama mostrarRanking).
// aoEnviarRanking(nome): a pessoa quer entrar no ranking com esse nome (o main.js envia e chama mostrarRanking de novo).
export function criarInterface({
  aoEscolherCobrador, aoAlternarMudo, aoAlternarFixar, aoTrocarModo = () => {},
  aoAbrirRanking = () => {}, aoEnviarRanking = () => {}, aoReiniciarTorneo = () => {},
}) {
  const cartao = $('cartao-cobrador');
  const lista = $('lista-cobradores');
  const itens = $('lista-itens');
  const resultado = $('resultado');
  const hud = $('hud');
  const ranking = $('ranking');
  const rankingNome = $('ranking-nome');
  const rankingEnviar = $('ranking-enviar');
  const botaoReiniciarTorneo = $('botao-reiniciar-torneo');
  const panelTorneo = $('torneo-panel');
  const progresoTorneo = $('torneo-progreso');
  const rutaTorneo = $('torneo-ruta');
  const efectosTorneo = $('efectos-torneo');
  let timerEfectoTorneo = 0;
  let timerParticulasTorneo = 0;
  let atual = null;
  let opcoes = [];
  let enviandoRanking = false; // esperando o main.js responder ao aoEnviarRanking
  let nomeEditado = false;     // a pessoa mexeu no campo do nome e ainda não enviou
  let chaveTorneoAnterior = '';
  let rondaAnterior = null;

  function desenharCartao() {
    if (!atual) return;
    const { jogador, nota, sugerido } = atual;
    cartao.innerHTML = `
      <div class="cartao-linha">
        <span class="cartao-numero">${jogador.numero}</span>
        <div class="cartao-nome">
          <b>${jogador.nome}</b>
          <small>${jogador.apelido} · ${jogador.estilo}</small>
        </div>
          <div class="cartao-ovr"><b>${overall(jogador)}</b><small>OVR</small></div>
      </div>
      <div class="cartao-nota">${sugerido ? 'Recomendado · ' : ''}rating for ${modoAtual === 'penalti' ? 'penalties' : 'this free kick'} <b>${Math.round(nota)}</b> · <u>change</u></div>`;
  }

  function desenharLista() {
    itens.innerHTML = opcoes.map(({ jogador, nota }, i) => `
      <button class="item-cobrador${atual && atual.jogador === jogador ? ' escolhido' : ''}" data-indice="${i}" type="button">
        <span class="item-numero">${jogador.numero}</span>
        <span class="item-meio">
          <b>${jogador.nome}${i === 0 ? ' <span class="selo sugerido">Recomendado</span>' : ''}</b>
          <small>${jogador.apelido} · ${POSICIONES[jogador.posicao] || jogador.posicao} · ${jogador.estilo}</small>
          <span class="item-selos">${selos(jogador)}</span>
          <span class="atributos">${barrasDeAtributos(jogador)}</span>
        </span>
        <span class="item-notas">
          <b style="color:${corDaNota(nota)}">${Math.round(nota)}</b><small>${modoAtual === 'penalti' ? 'penalties' : 'free kick'}</small>
          <em>${overall(jogador)} OVR</em>
        </span>
      </button>`).join('');
  }

  cartao.addEventListener('click', () => {
    desenharLista();
    lista.hidden = false;
    const escolhido = itens.querySelector('.escolhido');
    if (escolhido) escolhido.scrollIntoView({ block: 'nearest' });
  });
  itens.addEventListener('click', (e) => {
    const botao = e.target.closest('.item-cobrador');
    if (!botao) return;
    const { jogador, nota } = opcoes[Number(botao.dataset.indice)];
    lista.hidden = true;
    aoEscolherCobrador(jogador, nota);
  });
  $('lista-fechar').addEventListener('click', () => {
    lista.hidden = true;
  });

  // ---------- Ranking do dia ----------
  function fecharRanking() {
    ranking.hidden = true;
    rankingNome.blur();
  }

  // Monta a folha com o que o main.js mandou. linhas: [{ posicao, nome, gols }]
  function mostrarRanking({ dia = '', linhas = [], meuNome = '', melhorHoje = 0, podeEnviar = false, enviado = false, mensagem = '' } = {}) {
    const data = diaCurto(dia);
    $('ranking-titulo').textContent = `🏆 Tabla del torneo${data ? ` · ${data}` : ''}`;

    // Bloco "Entrar no ranking"
    const entrar = $('ranking-entrar');
    entrar.hidden = !podeEnviar;
    $('ranking-melhor').textContent = `Tus rondas ganadas hoy: ${melhorHoje}`;
    enviandoRanking = false;
    rankingEnviar.disabled = false;
    rankingEnviar.textContent = `Registrar ${plural(melhorHoje, 'victoria', 'victorias')}`;
    $('ranking-aviso').hidden = true;
    if (!podeEnviar) nomeEditado = false; // já enviou (ou não pode): o nome volta a seguir o main.js
    if (!nomeEditado) rankingNome.value = meuNome || '';

    const ja = $('ranking-ja');
    ja.hidden = !(enviado && !podeEnviar);
    ja.textContent = ja.hidden ? '' : `Ya estás en la tabla con ${plural(melhorHoje, 'victoria', 'victorias')}`;

    const aviso = $('ranking-mensagem');
    aviso.hidden = !mensagem;
    aviso.textContent = mensagem || '';

    const MEDALHA = { 1: 'ouro', 2: 'prata', 3: 'bronze' };
    const itensRanking = $('ranking-lista');
    itensRanking.innerHTML = linhas.length
      ? linhas.map(({ posicao, nome, gols }) => `
        <div class="ranking-linha${meuNome && nome === meuNome ? ' meu' : ''}">
          <span class="ranking-posicao ${MEDALHA[posicao] || ''}">${posicao}</span>
          <span class="ranking-nome" title="${escaparHtml(nome)}">${escaparHtml(nome)}</span>
          <span class="ranking-gols">${gols}<small>${gols === 1 ? 'victoria' : 'victorias'}</small></span>
        </div>`).join('')
      : '<p class="ranking-vazio">Aún no hay resultados. ¡Sé el primero en ganar una ronda!</p>';

    if (ranking.hidden) {
      ranking.hidden = false;
      ranking.querySelector('.folha').scrollTop = 0;
    }
  }

  function enviarNomeDoRanking() {
    if (enviandoRanking) return;
    const nome = rankingNome.value.trim();
    if (!nome) {
      $('ranking-aviso').hidden = false;
      rankingNome.focus();
      return;
    }
    enviandoRanking = true;
    rankingEnviar.disabled = true;
    rankingEnviar.textContent = 'Enviando...';
    rankingNome.blur();
    aoEnviarRanking(nome);
  }

  rankingNome.addEventListener('input', () => {
    nomeEditado = true;
    $('ranking-aviso').hidden = true;
  });
  rankingNome.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      enviarNomeDoRanking();
    }
  });
  rankingEnviar.addEventListener('click', (e) => {
    e.currentTarget.blur();
    enviarNomeDoRanking();
  });
  botaoReiniciarTorneo.addEventListener('click', (e) => {
    e.currentTarget.blur();
    aoReiniciarTorneo();
  });
  $('ranking-fechar').addEventListener('click', fecharRanking);
  // Os dois botões (coluna da direita e depois da cobrança) abrem a mesma folha
  const botaoRanking = $('botao-ranking');
  for (const botao of [botaoRanking, $('botao-entrar-ranking')]) {
    botao.addEventListener('click', (e) => {
      e.currentTarget.blur();
      aoAbrirRanking();
    });
  }
  const rankingAberto = () => !ranking.hidden;
  // Alguma folha (Quem bate? ou ranking) está aberta: o main.js não chuta enquanto isso
  const folhaAberta = () => !lista.hidden || rankingAberto();

  const botaoMudo = $('botao-mudo');
  botaoMudo.hidden = false;
  botaoMudo.addEventListener('click', (e) => {
    e.currentTarget.blur();
    aoAlternarMudo();
  });
  const botaoFixar = $('botao-fixar');
  botaoFixar.hidden = false;
  botaoFixar.addEventListener('click', (e) => {
    e.currentTarget.blur();
    aoAlternarFixar();
  });
  // Modos de jogo: Treino (falta sorteada), Desafio do Dia e Pênaltis
  const botoesModo = Array.from(document.querySelectorAll('#modos button'));
  let modoAtual = 'treino';
  for (const b of botoesModo) {
    b.addEventListener('click', (e) => {
      e.currentTarget.blur();
      aoTrocarModo(b.dataset.modo);
    });
  }

  const api = {
    // opcoes: lista ordenada [{ jogador, nota }] (a primeira é a sugerida)
    mostrarCobrador(jogador, nota, listaOrdenada) {
      opcoes = listaOrdenada;
      atual = { jogador, nota, sugerido: listaOrdenada[0] && listaOrdenada[0].jogador === jogador };
      desenharCartao();
    },
    folhaAberta,
    listaAberta: folhaAberta, // nome antigo: vale para qualquer folha aberta
    // Ranking do dia: { dia: 'AAAA-MM-DD', linhas: [{ posicao, nome, gols }], meuNome, melhorHoje,
    // podeEnviar, enviado, mensagem }. Pode ser chamada de novo com a folha aberta, para atualizar.
    mostrarRanking,
    rankingAberto,
    fecharRanking,
    // rival: nome do time cujas cores a barreira e o goleiro vestem (opcional).
    // desafio: número da falta no Desafio do Dia (opcional). falta.penalti: é pênalti.
    mostrarFalta({ distancia, angulo, penalti = false }, rival = '', torneo = 0) {
      const contra = rival && !(typeof torneo === 'string' && torneo)
        ? ` · contra ${escaparHtml(rival)}`
        : '';
      if (penalti) {
        const tanda = typeof torneo === 'string' && torneo.includes('Penal')
          ? ' · tanda de penalties'
          : '';
        $('info').innerHTML = `Penal${tanda}<br><small>desde el punto, sin barrera${contra}</small>`;
        return;
      }
      const lado = angulo > 4 ? 'por la derecha' : angulo < -4 ? 'por la izquierda' : 'de frente';
      const titulo = typeof torneo === 'string' && torneo
        ? 'Tiro libre'
        : typeof torneo === 'number' && torneo > 0
          ? `Tiro libre ${torneo} del día`
          : 'Tiro libre';
      $('info').innerHTML = `${titulo} · <b>${Math.round(distancia)}&nbsp;m</b><br><small>${lado}${contra}</small>`;
    },
    mostrarTorneo({
      visible = false, ronda = 0, rondas = [], tirosRonda = 0, tirosMaximos = 3,
      golesJugador = 0, golesRival = 0, terminado = false, campeon = false,
      enPenales = false, tirosPenales = 0, muerteSubitaPenales = false,
      equipoJugador = 'Tu equipo', equipoRival = 'Equipo rival',
      colorJugador = '#245d3b', colorRival = '#263a5d', eventos = [],
    } = {}) {
      panelTorneo.hidden = !visible;
      if (!visible) return;

      const nombreRonda = rondas[ronda] || (campeon ? 'Torneo completado' : 'Torneo');
      const rondaCorta = nombreRonda.replace(' de final', '');
      const etiquetaPenal = muerteSubitaPenales
        ? `MS ${Math.max(1, tirosPenales - 4)}`
        : `P ${tirosPenales + 1}/5`;
      $('torneo-ronda').textContent = enPenales && !terminado
        ? `${rondaCorta} · ${etiquetaPenal}`
        : nombreRonda;
      $('torneo-equipo-jugador').textContent = equipoJugador || 'Tu equipo';
      $('torneo-equipo-rival').textContent = equipoRival || 'Equipo rival';
      const insigniaJugador = $('torneo-insignia-jugador');
      const insigniaRival = $('torneo-insignia-rival');
      insigniaJugador.textContent = abreviarEquipo(equipoJugador);
      insigniaRival.textContent = abreviarEquipo(equipoRival);
      insigniaJugador.style.backgroundColor = colorJugador;
      insigniaRival.style.backgroundColor = colorRival;
      $('torneo-goles-jugador').textContent = String(golesJugador);
      $('torneo-goles-rival').textContent = String(golesRival);

      const estadoTexto = campeon ? 'CHAMPION' : terminado ? 'ELIMINATION' : enPenales ? 'PENALTIES' : 'IN PLAY';
      $('torneo-estado').textContent = estadoTexto;
      const turno = $('torneo-turno');
      if (campeon) turno.textContent = 'Campeón del torneo';
      else if (terminado) turno.textContent = `${tirosRonda} tiros · ronda concluida`;
      else if (enPenales && muerteSubitaPenales) turno.textContent = `Muerte súbita ${Math.max(1, tirosPenales - 4)}`;
      else if (enPenales) turno.textContent = `Penal ${tirosPenales + 1} de 5`;
      else if (tirosRonda < tirosMaximos) turno.textContent = `Tiro ${tirosRonda + 1} de ${tirosMaximos}`;
      else turno.textContent = `Muerte súbita ${tirosRonda - tirosMaximos + 1}`;

      progresoTorneo.replaceChildren();
      const totalTiros = Math.max(tirosMaximos, eventos.length + (terminado ? 0 : 1));
      for (let i = 0; i < totalTiros; i++) {
        const barra = document.createElement('span');
        barra.className = 'torneo-tiro';
        const relleno = document.createElement('span');
        const evento = eventos[i];
        if (evento) {
          const gol = Boolean(evento.golJugador);
          barra.classList.add(gol ? 'gol' : 'fallo');
          const resultadoJugador = gol ? 'anotaste' : 'fallaste';
          const resultadoRival = evento.golRival ? 'el rival anotó' : 'el rival falló';
          const tipoTiro = evento.penalti ? 'Penal' : 'Tiro';
          barra.setAttribute('aria-label', `${tipoTiro} ${i + 1}: ${resultadoJugador}; ${resultadoRival}`);
          barra.title = `${tipoTiro} ${i + 1}: ${resultadoJugador}; ${resultadoRival}`;
        } else {
          barra.classList.add('pendiente');
          barra.setAttribute('aria-label', `Tiro ${i + 1}: pendiente`);
        }
        barra.setAttribute('role', 'img');
        barra.append(relleno);
        progresoTorneo.append(barra);
      }

      rutaTorneo.replaceChildren();
      rondas.forEach((nombre, indice) => {
        const paso = document.createElement('span');
        paso.className = 'torneo-ruta-paso';
        paso.setAttribute('role', 'listitem');
        paso.textContent = nombre.replace(' de final', '');
        if (campeon || indice < ronda) paso.classList.add('superada');
        else if (indice === ronda && !terminado) {
          paso.classList.add('actual');
          paso.setAttribute('aria-current', 'step');
        } else if (indice === ronda && terminado) {
          paso.classList.add('actual');
        }
        const estadoPaso = campeon || indice < ronda
          ? 'superada'
          : indice === ronda && terminado
            ? 'finalizada'
            : indice === ronda
              ? 'ronda actual'
              : 'pendiente';
        paso.setAttribute('aria-label', `${nombre}, ${estadoPaso}`);
        rutaTorneo.append(paso);
      });

      const claveTorneo = `${ronda}:${eventos.length}:${golesJugador}-${golesRival}:${terminado}:${campeon}`;
      panelTorneo.classList.remove('evento', 'cambio-ronda');
      if (rondaAnterior !== null && ronda !== rondaAnterior) {
        void panelTorneo.offsetWidth;
        panelTorneo.classList.add('cambio-ronda');
      } else if (chaveTorneoAnterior && claveTorneo !== chaveTorneoAnterior) {
        void panelTorneo.offsetWidth;
        panelTorneo.classList.add('evento');
      }
      chaveTorneoAnterior = claveTorneo;
      rondaAnterior = ronda;
    },
    efectoTorneo(tipo) {
      if (modoAtual !== 'desafio') return;
      hud.classList.remove('torneo-disparo', 'torneo-efecto-gol', 'torneo-efecto-rival', 'torneo-efecto-fallo');
      void hud.offsetWidth;
      const clase = {
        disparo: 'torneo-disparo',
        gol: 'torneo-efecto-gol',
        rival: 'torneo-efecto-rival',
        fallo: 'torneo-efecto-fallo',
      }[tipo];
      if (!clase) return;
      hud.classList.add(clase);
      window.clearTimeout(timerEfectoTorneo);
      timerEfectoTorneo = window.setTimeout(() => hud.classList.remove(clase), tipo === 'gol' ? 1150 : 520);

      if (tipo === 'gol') {
        const colores = ['#ffe16a', '#b8ef71', '#ffffff', '#ff9d57', '#78e5d1'];
        const particulas = Array.from({ length: 30 }, () => {
          const chispa = document.createElement('i');
          chispa.className = 'torneo-particula';
          chispa.style.setProperty('--x', `${Math.round(Math.random() * 120 - 60)}px`);
          chispa.style.setProperty('--y', `${Math.round(Math.random() * 54 - 27)}px`);
          chispa.style.setProperty('--dx', `${Math.round(Math.random() * 500 - 250)}px`);
          chispa.style.setProperty('--dy', `${Math.round(Math.random() * -440 - 60)}px`);
          chispa.style.setProperty('--giro', `${Math.round(Math.random() * 900 - 450)}deg`);
          chispa.style.setProperty('--tamano', `${Math.round(Math.random() * 6 + 4)}px`);
          chispa.style.setProperty('--demora', `${Math.round(Math.random() * 150)}ms`);
          chispa.style.setProperty('--color', colores[Math.floor(Math.random() * colores.length)]);
          return chispa;
        });
        window.clearTimeout(timerParticulasTorneo);
        efectosTorneo.replaceChildren(...particulas);
        timerParticulasTorneo = window.setTimeout(() => efectosTorneo.replaceChildren(), 1500);
      }
    },
    // Marca o modo ativo nos botões; o botão de falta fixa só existe no treino, o do ranking só no desafio
    definirModo(modo) {
      modoAtual = modo;
      hud.classList.toggle('modo-torneo', modo === 'desafio');
      for (const b of botoesModo) b.classList.toggle('ativo', b.dataset.modo === modo);
      botaoFixar.hidden = modo !== 'treino';
      botaoRanking.hidden = modo !== 'desafio';
      if (modo !== 'desafio') fecharRanking();
      $('lista-explica').textContent = modo === 'penalti' ? EXPLICA_LISTA.penalti : EXPLICA_LISTA.falta;
    },
    modo: () => modoAtual,
    mostrarPlacar(texto) {
      $('placar').textContent = texto;
    },
    mostrarMensagem(texto) {
      $('mensagem').textContent = texto;
    },
    mostrarResultado({ tipo, titulo, sub }) {
      $('resultado-titulo').textContent = titulo;
      $('resultado-sub').textContent = sub || '';
      resultado.className = tipo;
      void resultado.offsetWidth; // reinicia a animação
      resultado.classList.add('mostrar');
    },
    esconderResultado() {
      resultado.className = '';
    },
    emJogo(sim) {
      hud.classList.toggle('em-jogo', sim);
    },
    // Replay: esconde os controles (e a folha do ranking) e mostra a etiqueta REPLAY
    modoReplay(sim) {
      hud.classList.toggle('replay', sim);
      if (sim) fecharRanking();
    },
    definirMudo(mudo) {
      botaoMudo.textContent = mudo ? '🔇' : '🔊';
      botaoMudo.setAttribute('aria-label', mudo ? 'Activar sonido' : 'Silenciar sonido');
    },
    definirFixar(fixo) {
      botaoFixar.classList.toggle('ativo', fixo);
      botaoFixar.textContent = fixo ? '📍 Tiro fijo' : '🎲 Tiro al azar';
    },
    mostrarReiniciarTorneo(visible) {
      botaoReiniciarTorneo.hidden = !visible;
    },
  };

  // No modo teste (?teste), as capturas automáticas abrem a folha do ranking sem passar pela internet
  if (new URLSearchParams(location.search).has('teste')) {
    window.interfaceTeste = { mostrarRanking, fecharRanking, rankingAberto, folhaAberta };
  }

  return api;
}
