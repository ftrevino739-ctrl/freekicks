# Free Kick Legends

The complete specification (scope, mechanics, build order) is in `PROJETO.md`. Read it before changing anything: it is the source of truth.

## How to work on this project

- The person leading the project does not code. Reply in simple English; when using a technical term, explain it in one sentence.
- Small stages. At the end of each stage: what changed and how to test on the computer and on the phone.
- One commit per stage that works.
- Nothing outside the scope of v0.1 without asking first.

## Technical conventions

- No build: HTML + JavaScript (ES modules) + Three.js `0.160.0` via the import map in `index.html`.
- Files:
  - `js/config.js`: all adjustable numbers (`CONFIG`) and the `VERSAO` label shown on screen.
  - `js/physics.js`: ball physics, no Three.js dependency (can run in Node).
  - `js/main.js`: scene, camera, controls, loop, replay, the three modes (`estado.modo`: treino, desafio, penalti), the Daily Challenge (seeds by date, records and share) and the glue between the modules below.
  - `js/elenco.js`: the 22 legends (attributes, foot, uniform, kicking style, visual), `overall`, free-kick rating (`notaParaFalta`), penalty rating (`notaParaPenalti`) and taker suggestion.
  - `js/interface.js`: HUD (taker card, "Who takes the kick?" list, result, score, mode buttons). Only touches the HTML.
  - `js/estadio.js`: pitch, goal, cloth net (mass-spring), stands and crowd. `PADRAO_CENARIO`.
  - `js/barreira.js` and `js/goleiro.js`: logic (position, jump, reaction, dive, collision), no drawing. `PADRAO_BARREIRA`, `PADRAO_GOLEIRO`, `PADRAO_PENALTI` (penalty goalkeeper: guesses the corner, hint, memory) and `semBarreira` (penalty).
  - `js/jogadores.js`: figures (body, face, shirts by pattern), poses and the taker's run/kick (`criarCobranca`, poses by legend). `PADRAO_COBRANCA`.
  - `js/animacaoDefesa.js`: drawing of the goalkeeper and wall on top of the logic (steps, dive, fall, gestures).
  - `js/audio.js`: synthesized sound (no files). `PADRAO_AUDIO`.
  - `js/replay.js`: records the kick as video (MediaRecorder) and downloads/shares the goal.
  - `js/painel.js`: adjustment panel (sliders that change `CONFIG` on the fly). Every new number that affects the game feel gets a slider here. `bloquear(sim)`: in the Daily Challenge the panel disappears and game numbers return to default (sound, camera and scenery stay).
  - `js/ranking.js`: daily ranking on the internet (Supabase via HTTP: `enviar`, `listar`), no Three.js. Address and key in `CONFIG.ranking`; empty = off. Test: `node testes/ranking.mjs`.
  - The `PADRAO_*` from the modules enter `CONFIG` when the game opens (`js/main.js`); what is written in `config.js` has priority. In the challenge, the goalkeeper uses `PADRAO_GOLEIRO` + `CONFIG.desafio.goleiro` (fixed, outside the panel): everyone faces the same goalkeeper.
  - `testes/fisica.mjs` and `testes/defesa.mjs`: tests in Node. Run `node testes/fisica.mjs` and `node testes/defesa.mjs` before each commit that touches physics, goalkeeper or wall. `testes/*.html` are visual inspection pages.
- Axes: x = right of the taker, y = up, z = from the goal to the taker. Goal at z = 0, kick goes to negative z.
- **Replay = repeat the kick.** Physics runs in fixed steps (`PASSO_FISICA`), and every random draw that affects the play comes from `sorteioDaJogada(n)` (setup; n = 2 is the penalty goalkeeper decision) or `sorteioChute` (kick and goalkeeper in flight), with seeds stored in `registro` (along with mode, pressure and penalty history). Never use `Math.random`/`aleatorio` in something that changes the ball, wall or goalkeeper after the kick, otherwise the replay will not match. In the Daily Challenge the seeds come from `sementeDoTexto(dia#índice#uso)`: same date, same free kicks for everyone.
- **Cache:** hosting caches files for a few minutes. Every published stage, increase the number `?v=N` in all imports and links (`index.html` and `js/*.js`) and update `VERSAO`:
  `sed -i 's/?v=[0-9]*/?v=NOVO/g' index.html js/*.js`
- Testing on a real phone is mandatory; the version label in the corner of the screen confirms which version is loaded.
- **Test mode:** opening with `?teste` in the address makes each frame exactly 1/60 s, fixes the random draw (and the Daily Challenge date to 2026-10-10) and exposes `window.tempoDeJogo` and `window.jogoTeste` (free kick, taker, contact, aim, shoot, state, video, mode, challenge, goalkeeper, score, records). Useful for predictable automatic captures (Playwright), even with a slow browser.
- The Three.js CDN does not open inside the cloud development environment: Playwright tests intercept the import and serve a local copy (`npm pack three@0.160.0`).
