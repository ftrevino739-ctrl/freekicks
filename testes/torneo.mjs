import assert from 'node:assert/strict';
import { registrarTiroTorneo, RONDAS_TORNEO, TIROS_POR_RONDA, probabilidadGolRival } from '../js/torneo.js';

const estadoInicial = () => ({
  ronda: 0,
  tirosRonda: 0,
  golesJugador: 0,
  golesRival: 0,
  enPenales: false,
  tirosPenales: 0,
  golesPenalesJugador: 0,
  golesPenalesRival: 0,
  muerteSubitaPenales: false,
  melhorHoje: 0,
  tentativas: 0,
  terminado: false,
  campeon: false,
});

const tiro = (estado, golJugador, golRival) =>
  registrarTiroTorneo(estado, { golJugador, golRival });

const primerTiro = tiro(estadoInicial(), true, false);
assert.equal(primerTiro.estado.tirosRonda, 1);
assert.equal(primerTiro.estado.golesJugador, 1);
assert.match(primerTiro.mensaje, /Score 1-0/);

let empate = estadoInicial();
empate = tiro(empate, true, false).estado;
empate = tiro(empate, false, true).estado;
const tanda = tiro(empate, false, false);
assert.equal(tanda.estado.ronda, 0);
assert.equal(tanda.estado.terminado, false);
assert.equal(tanda.estado.enPenales, true);
assert.equal(tanda.estado.tirosPenales, 0);
assert.match(tanda.mensaje, /Round decided on penalties/);

let tandaGanada = tanda.estado;
for (let i = 0; i < 4; i++) {
  tandaGanada = tiro(tandaGanada, false, false).estado;
}
const quintoPenal = tiro(tandaGanada, true, false);
assert.equal(quintoPenal.estado.ronda, 1);
assert.equal(quintoPenal.estado.enPenales, false);
assert.equal(quintoPenal.estado.tirosRonda, 0);
assert.match(quintoPenal.mensaje, /Advancing to Quarterfinals/);

let tandaEmpatada = tanda.estado;
for (let i = 0; i < 5; i++) {
  tandaEmpatada = tiro(tandaEmpatada, false, false).estado;
}
assert.equal(tandaEmpatada.muerteSubitaPenales, true);
const muerteSubita = tiro(tandaEmpatada, true, false);
assert.equal(muerteSubita.estado.ronda, 1);
assert.match(muerteSubita.mensaje, /Advancing to Quarterfinals/);

let avanza = estadoInicial();
avanza = tiro(avanza, true, false).estado;
avanza = tiro(avanza, false, true).estado;
const cuartos = tiro(avanza, true, false);
assert.equal(cuartos.estado.ronda, 1);
assert.equal(cuartos.estado.melhorHoje, 1);
assert.equal(cuartos.estado.tirosRonda, 0);
assert.match(cuartos.mensaje, /Quarterfinals/);

let pierde = estadoInicial();
pierde = tiro(pierde, false, true).estado;
pierde = tiro(pierde, true, false).estado;
const eliminado = tiro(pierde, false, true);
assert.equal(eliminado.estado.terminado, true);
assert.equal(eliminado.estado.campeon, false);

let final = { ...estadoInicial(), ronda: RONDAS_TORNEO.length - 1, melhorHoje: RONDAS_TORNEO.length - 1 };
final = tiro(final, true, false).estado;
final = tiro(final, true, true).estado;
const campeon = tiro(final, true, false);
assert.equal(campeon.estado.terminado, true);
assert.equal(campeon.estado.campeon, true);
assert.equal(campeon.estado.melhorHoje, RONDAS_TORNEO.length);

assert.equal(TIROS_POR_RONDA, 3);
assert.equal(probabilidadGolRival(0), 0.25);
assert.equal(probabilidadGolRival(3), 0.43);
assert.equal(probabilidadGolRival(0, true), 0.52);
assert.equal(probabilidadGolRival(3, true), 0.61);
assert.ok(probabilidadGolRival(9) <= 0.43);

console.log('All tournament tests passed.');
