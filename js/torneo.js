export const RONDAS_TORNEO = ['Round of 16', 'Quarterfinals', 'Semifinal', 'Final'];
export const TIROS_POR_RONDA = 3;

export function probabilidadGolRival(ronda, penalti = false) {
  if (penalti) return Math.min(0.61, 0.52 + ronda * 0.03);
  return Math.min(0.43, 0.25 + ronda * 0.06);
}

export function registrarTiroTorneo(estado, { golJugador, golRival }) {
  if (estado.terminado) return { estado, mensaje: '' };

  if (estado.enPenales) {
    const siguiente = {
      ...estado,
      tirosPenales: (estado.tirosPenales || 0) + 1,
      golesPenalesJugador: (estado.golesPenalesJugador || 0) + Number(golJugador),
      golesPenalesRival: (estado.golesPenalesRival || 0) + Number(golRival),
      tentativas: (estado.tentativas || 0) + 1,
    };
    const { tirosPenales, golesPenalesJugador, golesPenalesRival } = siguiente;
    const marcadorPenales = `${golesPenalesJugador}-${golesPenalesRival}`;
    const muerteSubita = Boolean(estado.muerteSubitaPenales);

    if (!muerteSubita && tirosPenales < 5) {
      return { estado: siguiente, mensaje: `Penalties ${marcadorPenales} · Shootout ${tirosPenales} of 5` };
    }
    if (golesPenalesJugador === golesPenalesRival) {
      siguiente.muerteSubitaPenales = true;
      return { estado: siguiente, mensaje: `Penalty draw ${marcadorPenales} · Sudden death!` };
    }
    return resolverRonda(siguiente, golesPenalesJugador, golesPenalesRival, 'penalties');
  }

  const siguiente = {
    ...estado,
    tirosRonda: estado.tirosRonda + 1,
    golesJugador: estado.golesJugador + Number(golJugador),
    golesRival: estado.golesRival + Number(golRival),
    tentativas: (estado.tentativas || 0) + 1,
  };
  const marcador = `${siguiente.golesJugador}-${siguiente.golesRival}`;
  const accionRival = golRival ? 'Rival scored' : 'Rival missed';

  if (siguiente.tirosRonda < TIROS_POR_RONDA) {
    return { estado: siguiente, mensaje: `${accionRival} · Score ${marcador}` };
  }
  if (siguiente.golesJugador === siguiente.golesRival) {
    siguiente.enPenales = true;
    siguiente.tirosPenales = 0;
    siguiente.golesPenalesJugador = 0;
    siguiente.golesPenalesRival = 0;
    siguiente.muerteSubitaPenales = false;
    return { estado: siguiente, mensaje: `Draw ${marcador} · Round decided on penalties!` };
  }

  return resolverRonda(siguiente, siguiente.golesJugador, siguiente.golesRival, 'free kicks');
}

function resolverRonda(siguiente, golesJugador, golesRival, desempate) {
  const rondaActual = RONDAS_TORNEO[siguiente.ronda] || 'Tournament';
  const marcador = `${golesJugador}-${golesRival}`;
  if (golesJugador > golesRival) {
    siguiente.ronda++;
    siguiente.mejorHoje = Math.max(siguiente.mejorHoje, siguiente.ronda);
    if (siguiente.ronda >= RONDAS_TORNEO.length) {
      siguiente.terminado = true;
      siguiente.campeon = true;
      const etiqueta = desempate === 'penalties' ? ' on penalties' : '';
      return { estado: siguiente, mensaje: `You won the final${etiqueta} ${marcador}! You are the tournament champion!` };
    }
    const siguienteRonda = RONDAS_TORNEO[siguiente.ronda];
    siguiente.tirosRonda = 0;
    siguiente.golesJugador = 0;
    siguiente.golesRival = 0;
    siguiente.enPenales = false;
    siguiente.tirosPenales = 0;
    siguiente.golesPenalesJugador = 0;
    siguiente.golesPenalesRival = 0;
    siguiente.muerteSubitaPenales = false;
    const etiqueta = desempate === 'penalties' ? ' on penalties' : '';
    return { estado: siguiente, mensaje: `You won ${rondaActual}${etiqueta} ${marcador}! Advancing to ${siguienteRonda}.` };
  }

  siguiente.terminado = true;
  siguiente.campeon = false;
  return { estado: siguiente, mensaje: `The rival won ${rondaActual} in ${desempate} ${marcador}. You were eliminated.` };
}
