// Painel de ajuste: sliders que mudam os números do CONFIG na hora.
// Os valores ficam salvos no aparelho até a próxima versão do jogo.

const CAMPOS = [
  { secao: 'Chute' },
  { chave: 'velocidadeMin', rotulo: 'Velocidade com a barra vazia (m/s)', min: 8, max: 22, passo: 0.5 },
  { chave: 'velocidadeMax', rotulo: 'Velocidade com a barra cheia (m/s)', min: 22, max: 45, passo: 0.5 },
  { chave: 'elevacaoBase', rotulo: 'Ângulo de saída da bola (graus)', min: 5, max: 30, passo: 0.5 },
  { chave: 'tempoCarga', rotulo: 'Tempo para encher a barra (s)', min: 0.5, max: 2.5, passo: 0.05 },

  { secao: 'Mira e erro' },
  { chave: 'erroMiraBase', rotulo: 'Tamanho do cone de erro (graus)', min: 0, max: 3, passo: 0.05 },
  { chave: 'forcaIdeal', rotulo: 'Ponto ideal da barra de força', min: 0.5, max: 1, passo: 0.01 },
  { chave: 'erroAcimaIdeal', rotulo: 'Erro a mais com a barra cheia', min: 0, max: 5, passo: 0.1 },
  { chave: 'pesoAtributos', rotulo: 'Impacto de los atributos (escala de 0 a 99)', min: 0, max: 0.8, passo: 0.01 },
  { chave: 'mira.sensibilidade', rotulo: 'Sensibilidade da mira no dedo', min: 0.3, max: 2, passo: 0.05 },

  { secao: 'Ponto de contato' },
  { chave: 'giroLateralMax', rotulo: 'Força da curva', min: 0, max: 120, passo: 1 },
  { chave: 'giroVerticalMax', rotulo: 'Força da queda (pé em cima)', min: 0, max: 100, passo: 1 },
  { chave: 'giroEmbaixoMax', rotulo: 'Flutuação (pé embaixo)', min: 0, max: 60, passo: 1 },
  { chave: 'elevacaoContatoEmbaixo', rotulo: 'Pé embaixo: graus a mais na saída', min: 0, max: 15, passo: 0.5 },
  { chave: 'elevacaoCavadinha', rotulo: 'Pé bem embaixo: graus a mais (cavadinha)', min: 0, max: 30, passo: 0.5 },
  { chave: 'elevacaoContatoEmCima', rotulo: 'Pé em cima: graus a menos na saída', min: 0, max: 15, passo: 0.5 },
  { chave: 'rasteiroInicio', rotulo: 'Altura do contato onde a bola começa a sair baixa', min: 0.4, max: 0.8, passo: 0.01 },
  { chave: 'elevacaoRasteiro', rotulo: 'Ângulo do chute rasteiro (graus)', min: -3, max: 8, passo: 0.5 },
  { chave: 'perdaVelocidadeContato', rotulo: 'Velocidade perdida ao bater na borda', min: 0, max: 0.5, passo: 0.01 },

  { secao: 'Folha seca, trivela e sem rotação' },
  { chave: 'quedaTardia', rotulo: 'Folha seca: quanto a queda cresce no fim', min: 0, max: 10, passo: 0.5 },
  { chave: 'quedaTardiaInicio', rotulo: 'Folha seca: queda logo depois do chute (fração)', min: 0.1, max: 1, passo: 0.05 },
  { chave: 'trivelaGiro', rotulo: 'Trivela de quem não é especialista: fração da curva', min: 0.2, max: 1.2, passo: 0.05 },
  { chave: 'trivelaTardia', rotulo: 'Trivela de especialista: quanto a curva fica para o fim', min: 0, max: 6, passo: 0.5 },
  { chave: 'semRotacaoAmplitude', rotulo: 'Sem rotação: quanto a bola dança', min: 0, max: 15, passo: 0.5 },
  { chave: 'semRotacaoEspecialista', rotulo: 'Sem rotação: dança do especialista (vezes)', min: 0.5, max: 3, passo: 0.1 },
  { chave: 'semRotacaoQueda', rotulo: 'Sem rotação: queda de repente no fim (m/s²)', min: 0, max: 10, passo: 0.5 },

  { secao: 'Goleiro' },
  { chave: 'goleiro.reflexo', rotulo: 'Tempo de reação (s)', min: 0.1, max: 0.6, passo: 0.01 },
  { chave: 'goleiro.erroLeitura', rotulo: 'Erro ao ler a bola (m, mais = mais gols)', min: 0, max: 1.2, passo: 0.05 },
  { chave: 'goleiro.velocidadeMergulho', rotulo: 'Velocidade do mergulho (m/s)', min: 2.5, max: 7, passo: 0.1 },
  { chave: 'goleiro.alcance', rotulo: 'Alcance dos braços (m)', min: 0.5, max: 1.2, passo: 0.01 },
  { chave: 'goleiro.alturaMaxima', rotulo: 'Altura máxima das mãos no pulo (m)', min: 2, max: 2.8, passo: 0.01 },
  { chave: 'goleiro.atrasoBarreira', rotulo: 'Atraso quando a barreira tapa a visão (s)', min: 0, max: 0.3, passo: 0.01 },
  { chave: 'goleiro.pesoCurva', rotulo: 'Quanto a curva engana', min: 0, max: 5, passo: 0.1 },
  { chave: 'goleiro.pesoSemRotacao', rotulo: 'Quanto a bola sem rotação engana', min: 0, max: 3, passo: 0.1 },
  { chave: 'goleiro.velocidadeSegura', rotulo: 'Bola mais rápida que ele ainda encaixa (m/s)', min: 5, max: 25, passo: 0.5 },
  { chave: 'goleiro.deslocamento', rotulo: 'Quanto vai para o lado sem barreira (m)', min: 0, max: 1.5, passo: 0.05 },

  { secao: 'Barreira' },
  { chave: 'barreira.chancePulo', rotulo: 'Chance de pular', min: 0, max: 1, passo: 0.05 },
  { chave: 'barreira.altura', rotulo: 'Altura média dos jogadores (m)', min: 1.6, max: 2.1, passo: 0.01 },
  { chave: 'barreira.alturaPulo', rotulo: 'Altura do pulo (m)', min: 0.05, max: 0.7, passo: 0.01 },
  { chave: 'barreira.atrasoPulo', rotulo: 'Atraso do pulo depois do chute (s)', min: 0.05, max: 0.4, passo: 0.01 },
  { chave: 'barreira.sobraTrave', rotulo: 'Quanto passa da trave (m)', min: -0.5, max: 1, passo: 0.05 },

  { secao: 'Gramado e gol' },
  { chave: 'quiqueChao', rotulo: 'Quique no gramado (batida lenta)', min: 0.2, max: 0.9, passo: 0.05 },
  { chave: 'atritoDeslize', rotulo: 'Atrito da grama com a bola escorregando', min: 0.05, max: 1, passo: 0.05 },
  { chave: 'atritoGrama', rotulo: 'Freada da bola rolando (m/s²)', min: 0.5, max: 5, passo: 0.1 },
  { chave: 'quiqueTrave', rotulo: 'Quanto a bola volta ao bater na trave', min: 0, max: 1, passo: 0.05 },
  { chave: 'redeRigidez', rotulo: 'Rigidez da rede (menor = estufa mais)', min: 500, max: 8000, passo: 100 },

  { secao: 'Cobrador e câmera de trás' },
  { chave: 'cobrador.distancia', rotulo: 'Distância da corrida (m)', min: 0.8, max: 4, passo: 0.1 },
  { chave: 'cobrador.angulo', rotulo: 'Ângulo da corrida (graus)', min: 0, max: 60, passo: 1 },
  { chave: 'cobrador.corrida', rotulo: 'Tempo correndo (s)', min: 0.15, max: 1.2, passo: 0.05 },
  { chave: 'cobrador.chute', rotulo: 'Tempo do chute (s, contato em 55%)', min: 0.45, max: 1.4, passo: 0.05 },
  { chave: 'cobrador.giroCorpo', rotulo: 'Chute de lado: quanto do ângulo da corrida o corpo guarda no contato', min: 0, max: 1, passo: 0.05 },
  { chave: 'camera.pesoCobrador', rotulo: 'Câmera: quanto desloca para o lado do cobrador', min: 0, max: 1, passo: 0.05 },
  { chave: 'camera.atras', rotulo: 'Câmera: distância mínima atrás da bola (m)', min: 3, max: 12, passo: 0.25 },
  { chave: 'camera.atrasCobrador', rotulo: 'Câmera: distância mínima atrás do cobrador (m)', min: 1.5, max: 8, passo: 0.25 },
  { chave: 'camera.altura', rotulo: 'Câmera: altura (m)', min: 1.2, max: 5, passo: 0.1 },
  { chave: 'camera.larguraVisivel', rotulo: 'Câmera: largura visível (graus, menos = mais zoom)', min: 16, max: 40, passo: 0.5 },

  { secao: 'Câmera aérea' },
  { chave: 'camera.aerea', rotulo: 'Câmera aérea depois do chute', tipo: 'liga' },
  { chave: 'camera.aereaAltura', rotulo: 'Aérea: altura (m)', min: 4, max: 30, passo: 0.5 },
  { chave: 'camera.aereaAtras', rotulo: 'Aérea: distância atrás da bola (m)', min: -5, max: 20, passo: 0.5 },
  { chave: 'camera.aereaLado', rotulo: 'Aérea: quanto fica de lado (m)', min: 0, max: 20, passo: 0.5 },
  { chave: 'camera.aereaAlvo', rotulo: 'Aérea: para onde olha (0 = bola, 1 = gol)', min: 0, max: 1, passo: 0.05 },
  { chave: 'camera.aereaAproxima', rotulo: 'Aérea: quanto anda junto com a bola', min: 0, max: 0.9, passo: 0.05 },
  { chave: 'camera.aereaTransicao', rotulo: 'Aérea: tempo da troca de câmera (s, 0 = corte seco)', min: 0, max: 1.5, passo: 0.05 },
  { chave: 'rastro', rotulo: 'Rastro atrás da bola', tipo: 'liga' },
  { chave: 'camera.cameraLenta', rotulo: 'Câmera lenta perto do gol', tipo: 'liga' },
  { chave: 'camera.cameraLentaFator', rotulo: 'Câmera lenta: velocidade do tempo (1 = normal)', min: 0.1, max: 1, passo: 0.05 },
  { chave: 'camera.cameraLentaDuracao', rotulo: 'Câmera lenta: duração (s de jogo)', min: 0.1, max: 1.5, passo: 0.05 },
  { chave: 'camera.cameraLentaDistancia', rotulo: 'Câmera lenta: começa a quantos m do gol', min: 1, max: 10, passo: 0.5 },
  { secao: 'Replay e vídeo' },
  { chave: 'video', rotulo: 'Botão de vídeo (grava o replay para salvar)', tipo: 'liga' },
  { chave: 'camera.replayLateral', rotulo: 'Replay: câmera lateral (desligado = atrás do gol)', tipo: 'liga' },
  { chave: 'camera.replayLateralDist', rotulo: 'Lateral: distância para o lado (m)', min: 5, max: 30, passo: 0.5 },
  { chave: 'camera.replayLateralAltura', rotulo: 'Lateral: altura da câmera (m)', min: 1, max: 12, passo: 0.1 },
  { chave: 'camera.replayLateralAlvo', rotulo: 'Lateral: quanto o olhar vai para o gol quando a bola chega (0 = só a bola)', min: 0, max: 1, passo: 0.05 },
  { chave: 'camera.replayLateralLargura', rotulo: 'Lateral: largura visível (graus, menos = mais zoom)', min: 10, max: 50, passo: 1 },
  { chave: 'camera.replayLateralSegue', rotulo: 'Lateral: quanto anda junto com a bola (0 = parada)', min: 0, max: 1, passo: 0.05 },
  { chave: 'camera.replayLateralFrente', rotulo: 'Lateral: quanto fica adiantada em relação à bola (m)', min: -6, max: 10, passo: 0.5 },
  { chave: 'camera.replayLado', rotulo: 'Atrás do gol: câmera para o lado (m)', min: 0, max: 12, passo: 0.5 },
  { chave: 'camera.replayAltura', rotulo: 'Atrás do gol: altura da câmera (m)', min: 0.5, max: 8, passo: 0.1 },
  { chave: 'camera.replayAtras', rotulo: 'Atrás do gol: atrás da linha do gol (m)', min: 1, max: 12, passo: 0.5 },

  { secao: 'Desafio do Dia' },
  { chave: 'desafio.pressaoPorGol', rotulo: 'Presión extra por tiro del torneo (aumenta el error; el temple la reduce)', min: 0, max: 0.3, passo: 0.01 },
  { chave: 'desafio.pressaoMax', rotulo: 'Pressão máxima', min: 0, max: 1, passo: 0.05 },

  { secao: 'Pênaltis (goleiro que adivinha o canto)' },
  { chave: 'penalti.pressao', rotulo: 'Pressão do pênalti (aumenta o erro; a frieza corta parte)', min: 0, max: 1, passo: 0.05 },
  { chave: 'penalti.chanceAdivinhar', rotulo: 'Chance de ir num canto (senão fica no meio e reage)', min: 0, max: 1, passo: 0.05 },
  { chave: 'penalti.chanceDica', rotulo: 'Chance de ir para o canto que ele apontou', min: 0, max: 1, passo: 0.05 },
  { chave: 'penalti.memoria', rotulo: 'Memória: quanto os seus últimos chutes puxam o canto dele', min: 0, max: 1, passo: 0.05 },
  { chave: 'penalti.atraso', rotulo: 'Quando se joga, em relação ao contato (s; negativo = antes, às cegas)', min: -0.3, max: 0.3, passo: 0.01 },
  { chave: 'penalti.variacaoAtraso', rotulo: 'Variação do atraso (s a mais, sorteado a cada pênalti)', min: 0, max: 0.2, passo: 0.01 },
  { chave: 'penalti.velocidadeMergulho', rotulo: 'Velocidade do mergulho no pênalti (m/s)', min: 4, max: 8, passo: 0.1 },
  { chave: 'penalti.alcance', rotulo: 'Alcance dos braços no pênalti (m)', min: 0.7, max: 1.1, passo: 0.01 },
  { chave: 'penalti.impulsoVertical', rotulo: 'Impulso do pulo no pênalti (m/s)', min: 2, max: 4, passo: 0.1 },
  { chave: 'penalti.erroLeitura', rotulo: 'Erro ao ler a bola no pênalti (m)', min: 0.2, max: 1.2, passo: 0.05 },
  { chave: 'penalti.alemDaLeitura', rotulo: 'Quanto estica além do ponto lido, para a trave (m)', min: 0, max: 0.8, passo: 0.05 },
  { chave: 'penalti.alturaPalpite', rotulo: 'Mergulho às cegas: altura das mãos (m)', min: 0.3, max: 2.2, passo: 0.05 },
  { chave: 'penalti.distanciaPalpite', rotulo: 'Mergulho às cegas: distância do meio (m)', min: 1.5, max: 3.6, passo: 0.1 },
  { chave: 'penalti.reflexo', rotulo: 'Tempo de reação quando fica no meio (s)', min: 0.1, max: 0.5, passo: 0.01 },

  { secao: 'Som' },
  { chave: 'audio.volume', rotulo: 'Volume geral', min: 0, max: 1, passo: 0.05 },
  { chave: 'audio.volumeEfeitos', rotulo: 'Volume dos efeitos (chute, trave, rede, apito)', min: 0, max: 1.5, passo: 0.05 },
  { chave: 'audio.volumeTorcida', rotulo: 'Volume da torcida', min: 0, max: 1.5, passo: 0.05 },
  { chave: 'audio.eco', rotulo: 'Eco do estádio (0 = seco)', min: 0, max: 1, passo: 0.05 },
  { chave: 'audio.bumbo', rotulo: 'Bumbo da torcida (0 = sem)', min: 0, max: 1.5, passo: 0.05 },
  { chave: 'audio.assobios', rotulo: 'Assobios na arquibancada (0 = nenhum)', min: 0, max: 1.5, passo: 0.05 },
  { chave: 'audio.gritos', rotulo: 'Gritos soltos de torcedor (0 = nenhum)', min: 0, max: 1.5, passo: 0.05 },

  { secao: 'Rede, trave e torcida' },
  { chave: 'cenario.redeFirmeza', rotulo: 'Rede: firmeza (mais = ondas rápidas, volta logo)', min: 1, max: 12, passo: 0.5 },
  { chave: 'cenario.redeFreio', rotulo: 'Rede: freio do balanço (menos = balança mais vezes)', min: 0, max: 6, passo: 0.1 },
  { chave: 'cenario.redePeso', rotulo: 'Rede: peso (mais = mais caída e lenta)', min: 0.3, max: 3, passo: 0.1 },
  { chave: 'cenario.redeEstufa', rotulo: 'Rede: quanto o fundo estufa além da bola', min: 0, max: 2, passo: 0.1 },
  { chave: 'cenario.redeBarriga', rotulo: 'Rede: fundo inteiro estufa junto com a bolsa', min: 0, max: 2, passo: 0.1 },
  { chave: 'cenario.redeBalanco', rotulo: 'Rede: tranco no teto e nas laterais no gol', min: 0, max: 3, passo: 0.1 },
  { chave: 'cenario.redeEmpurrao', rotulo: 'Rede: tranco da bola batendo por fora', min: 0, max: 2, passo: 0.1 },
  { chave: 'cenario.traveTremor', rotulo: 'Trave: quanto o gol treme', min: 0, max: 3, passo: 0.1 },
  { chave: 'cenario.festaSegura', rotulo: 'Torcida: tempo no auge da festa (s)', min: 0.5, max: 4, passo: 0.1 },
  { chave: 'cenario.festaDuracao', rotulo: 'Torcida: tempo para acalmar (s)', min: 1, max: 8, passo: 0.5 },
  { chave: 'cenario.festaPlacas', rotulo: 'Placas GOOOL: duração (s)', min: 0.5, max: 2, passo: 0.1 },

  { secao: 'Ar e gravidade' },
  { chave: 'gravidade', rotulo: 'Gravidade', min: 5, max: 15, passo: 0.1 },
  { chave: 'arrasto', rotulo: 'Resistência do ar', min: 0, max: 0.03, passo: 0.001 },
  { chave: 'magnus', rotulo: 'Quanto o giro desvia a bola', min: 0, max: 0.012, passo: 0.0005 },

  { secao: 'Posição da falta (fixa a falta)' },
  { chave: 'falta.distancia', rotulo: 'Distância do gol (m)', min: 16, max: 35, passo: 1 },
  { chave: 'falta.angulo', rotulo: 'Ângulo (graus, + = direita)', min: -40, max: 40, passo: 1 },
];

const TEXTO_ES = {
  'Chute': 'Disparo',
  'Mira e erro': 'Puntería y precisión',
  'Ponto de contato': 'Punto de impacto',
  'Folha seca, trivela e sem rotação': 'Hoja seca, trivela y sin efecto',
  'Goleiro': 'Portero',
  'Barreira': 'Barrera',
  'Gramado e gol': 'Césped y portería',
  'Cobrador e câmera de trás': 'Tirador y cámara trasera',
  'Câmera aérea': 'Cámara aérea',
  'Replay e vídeo': 'Repeticiones y video',
  'Desafio do Dia': 'Torneo del día',
  'Pênaltis (goleiro que adivinha o canto)': 'Penales (portero que adivina el lado)',
  'Som': 'Sonido',
  'Rede, trave e torcida': 'Red, poste y afición',
  'Ar e gravidade': 'Aire y gravedad',
  'Posição da falta (fixa a falta)': 'Posición del tiro libre (fija la ubicación)',
  'Velocidade com a barra vazia (m/s)': 'Velocidad con la barra vacía (m/s)',
  'Velocidade com a barra cheia (m/s)': 'Velocidad con la barra llena (m/s)',
  'Ângulo de saída da bola (graus)': 'Ángulo de salida del balón (grados)',
  'Tempo para encher a barra (s)': 'Tiempo para cargar la barra (s)',
  'Tamanho do cone de erro (graus)': 'Tamaño del margen de error (grados)',
  'Ponto ideal da barra de força': 'Punto ideal de potencia',
  'Erro a mais com a barra cheia': 'Error extra con la barra llena',
  'Impacto de los atributos (escala de 0 a 99)': 'Impacto de los atributos (escala de 0 a 99)',
  'Presión extra por tiro del torneo (aumenta el error; el temple la reduce)': 'Presión extra por tiro del torneo (aumenta el error; el temple la reduce)',
  'Sensibilidade da mira no dedo': 'Sensibilidad al apuntar con el dedo',
  'Força da curva': 'Fuerza del efecto',
  'Força da queda (pé em cima)': 'Fuerza de caída (impacto arriba)',
  'Flutuação (pé embaixo)': 'Flotación (impacto abajo)',
  'Pé embaixo: graus a mais na saída': 'Impacto abajo: grados extra al salir',
  'Pé bem embaixo: graus a mais (cavadinha)': 'Impacto muy abajo: grados extra (vaselina)',
  'Pé em cima: graus a menos na saída': 'Impacto arriba: grados menos al salir',
  'Altura do contato onde a bola começa a sair baixa': 'Altura del impacto a partir de la cual el balón sale bajo',
  'Ângulo do chute rasteiro (graus)': 'Ángulo del disparo raso (grados)',
  'Velocidade perdida ao bater na borda': 'Velocidad perdida al impactar cerca del borde',
  'Folha seca: quanto a queda cresce no fim': 'Hoja seca: caída extra al final',
  'Folha seca: queda logo depois do chute (fração)': 'Hoja seca: caída inicial tras el disparo (proporción)',
  'Trivela de quem não é especialista: fração da curva': 'Trivela de quien no es especialista: proporción del efecto',
  'Trivela de especialista: quanto a curva fica para o fim': 'Trivela experta: efecto que aparece al final',
  'Sem rotação: quanto a bola dança': 'Sin efecto: cuánto se mueve el balón',
  'Sem rotação: dança do especialista (vezes)': 'Sin efecto: movimiento del especialista (multiplicador)',
  'Sem rotação: queda de repente no fim (m/s²)': 'Sin efecto: caída repentina al final (m/s²)',
  'Tempo de reação (s)': 'Tiempo de reacción (s)',
  'Erro ao ler a bola (m, mais = mais gols)': 'Error al leer el balón (m; más = más goles)',
  'Velocidade do mergulho (m/s)': 'Velocidad de estirada (m/s)',
  'Alcance dos braços (m)': 'Alcance de los brazos (m)',
  'Altura máxima das mãos no pulo (m)': 'Altura máxima de las manos al saltar (m)',
  'Atraso quando a barreira tapa a visão (s)': 'Retraso cuando la barrera tapa la vista (s)',
  'Quanto a curva engana': 'Cuánto engaña el efecto',
  'Quanto a bola sem rotação engana': 'Cuánto engaña el balón sin efecto',
  'Bola mais rápida que ele ainda encaixa (m/s)': 'Velocidad máxima a la que aún atrapa el balón (m/s)',
  'Quanto vai para o lado sem barreira (m)': 'Desplazamiento lateral sin barrera (m)',
  'Chance de pular': 'Probabilidad de saltar',
  'Altura média dos jogadores (m)': 'Estatura media de los jugadores (m)',
  'Altura do pulo (m)': 'Altura del salto (m)',
  'Atraso do pulo depois do chute (s)': 'Retraso del salto tras el disparo (s)',
  'Quanto passa da trave (m)': 'Cuánto se extiende más allá del poste (m)',
  'Quique no gramado (batida lenta)': 'Rebote en el césped (disparo lento)',
  'Atrito da grama com a bola escorregando': 'Fricción del césped con el balón al deslizarse',
  'Freada da bola rolando (m/s²)': 'Frenado del balón al rodar (m/s²)',
  'Quanto a bola volta ao bater na trave': 'Cuánto rebota el balón al pegar en el poste',
  'Rigidez da rede (menor = estufa mais)': 'Rigidez de la red (menos = se deforma más)',
  'Distância da corrida (m)': 'Distancia de la carrera (m)',
  'Ângulo da corrida (graus)': 'Ángulo de la carrera (grados)',
  'Tempo correndo (s)': 'Duración de la carrera (s)',
  'Tempo do chute (s, contato em 55%)': 'Duración del disparo (s; contacto al 55%)',
  'Chute de lado: quanto do ângulo da corrida o corpo guarda no contato': 'Disparo lateral: cuánto conserva el cuerpo del ángulo de carrera al impactar',
  'Câmera: quanto desloca para o lado do cobrador': 'Cámara: cuánto se desplaza hacia el tirador',
  'Câmera: distância mínima atrás da bola (m)': 'Cámara: distancia mínima detrás del balón (m)',
  'Câmera: distância mínima atrás do cobrador (m)': 'Cámara: distancia mínima detrás del tirador (m)',
  'Câmera: altura (m)': 'Cámara: altura (m)',
  'Câmera: largura visível (graus, menos = mais zoom)': 'Cámara: campo de visión (grados; menos = más zoom)',
  'Câmera aérea depois do chute': 'Cámara aérea después del disparo',
  'Aérea: altura (m)': 'Aérea: altura (m)',
  'Aérea: distância atrás da bola (m)': 'Aérea: distancia detrás del balón (m)',
  'Aérea: quanto fica de lado (m)': 'Aérea: desplazamiento lateral (m)',
  'Aérea: para onde olha (0 = bola, 1 = gol)': 'Aérea: hacia dónde apunta (0 = balón, 1 = portería)',
  'Aérea: quanto anda junto com a bola': 'Aérea: cuánto sigue al balón',
  'Aérea: tempo da troca de câmera (s, 0 = corte seco)': 'Aérea: transición de cámara (s; 0 = corte directo)',
  'Rastro atrás da bola': 'Estela detrás del balón',
  'Câmera lenta perto do gol': 'Cámara lenta cerca de la portería',
  'Câmera lenta: velocidade do tempo (1 = normal)': 'Cámara lenta: velocidad del tiempo (1 = normal)',
  'Câmera lenta: duração (s de jogo)': 'Cámara lenta: duración (s de juego)',
  'Câmera lenta: começa a quantos m do gol': 'Cámara lenta: empieza a cuántos metros de la portería',
  'Botão de vídeo (grava o replay para salvar)': 'Botón de video (graba la repetición para guardarla)',
  'Replay: câmera lateral (desligado = atrás do gol)': 'Repetición: cámara lateral (desactivado = detrás de la portería)',
  'Lateral: distância para o lado (m)': 'Lateral: distancia hacia un costado (m)',
  'Lateral: altura da câmera (m)': 'Lateral: altura de la cámara (m)',
  'Lateral: quanto o olhar vai para o gol quando a bola chega (0 = só a bola)': 'Lateral: cuánto mira a la portería al llegar el balón (0 = solo el balón)',
  'Lateral: largura visível (graus, menos = mais zoom)': 'Lateral: campo de visión (grados; menos = más zoom)',
  'Lateral: quanto anda junto com a bola (0 = parada)': 'Lateral: cuánto sigue al balón (0 = fija)',
  'Lateral: quanto fica adiantada em relação à bola (m)': 'Lateral: cuánto se adelanta al balón (m)',
  'Atrás do gol: câmera para o lado (m)': 'Detrás de la portería: desplazamiento lateral de cámara (m)',
  'Atrás do gol: altura da câmera (m)': 'Detrás de la portería: altura de cámara (m)',
  'Atrás do gol: atrás da linha do gol (m)': 'Detrás de la portería: distancia detrás de la línea de gol (m)',
  'Pressão a mais por gol seguido (aumenta o erro; a frieza corta parte)': 'Presión extra por cada gol seguido (aumenta el error; el temple lo reduce)',
  'Pressão máxima': 'Presión máxima',
  'Pressão do pênalti (aumenta o erro; a frieza corta parte)': 'Presión del penal (aumenta el error; el temple lo reduce)',
  'Chance de ir num canto (senão fica no meio e reage)': 'Probabilidad de lanzarse a un lado (si no, se queda al centro y reacciona)',
  'Chance de ir para o canto que ele apontou': 'Probabilidad de lanzarse al lado que señaló',
  'Memória: quanto os seus últimos chutes puxam o canto dele': 'Memoria: cuánto influyen tus últimos disparos en su decisión',
  'Quando se joga, em relação ao contato (s; negativo = antes, às cegas)': 'Cuándo se lanza respecto al impacto (s; negativo = antes, a ciegas)',
  'Variação do atraso (s a mais, sorteado a cada pênalti)': 'Variación del retraso (s extra, al azar en cada penal)',
  'Velocidade do mergulho no pênalti (m/s)': 'Velocidad de estirada en el penal (m/s)',
  'Alcance dos braços no pênalti (m)': 'Alcance de los brazos en el penal (m)',
  'Impulso do pulo no pênalti (m/s)': 'Impulso del salto en el penal (m/s)',
  'Erro ao ler a bola no pênalti (m)': 'Error al leer el balón en el penal (m)',
  'Quanto estica além do ponto lido, para a trave (m)': 'Cuánto se estira más allá del punto calculado, hasta el poste (m)',
  'Mergulho às cegas: altura das mãos (m)': 'Estirada a ciegas: altura de las manos (m)',
  'Mergulho às cegas: distância do meio (m)': 'Estirada a ciegas: distancia desde el centro (m)',
  'Tempo de reação quando fica no meio (s)': 'Tiempo de reacción si se queda al centro (s)',
  'Volume geral': 'Volumen general',
  'Volume dos efeitos (chute, trave, rede, apito)': 'Volumen de efectos (disparo, poste, red, silbato)',
  'Volume da torcida': 'Volumen de la afición',
  'Eco do estádio (0 = seco)': 'Eco del estadio (0 = sin eco)',
  'Bumbo da torcida (0 = sem)': 'Bombo de la afición (0 = apagado)',
  'Assobios na arquibancada (0 = nenhum)': 'Silbidos en las gradas (0 = ninguno)',
  'Gritos soltos de torcedor (0 = nenhum)': 'Gritos de la afición (0 = ninguno)',
  'Rede: firmeza (mais = ondas rápidas, volta logo)': 'Red: firmeza (más = ondas rápidas, vuelve antes)',
  'Rede: freio do balanço (menos = balança mais vezes)': 'Red: freno del balanceo (menos = se mueve más)',
  'Rede: peso (mais = mais caída e lenta)': 'Red: peso (más = cae y se mueve más lento)',
  'Rede: quanto o fundo estufa além da bola': 'Red: cuánto se deforma el fondo al recibir el balón',
  'Rede: fundo inteiro estufa junto com a bolsa': 'Red: cuánto se deforma todo el fondo',
  'Rede: tranco no teto e nas laterais no gol': 'Red: sacudida del techo y los lados al marcar',
  'Rede: tranco da bola batendo por fora': 'Red: sacudida al pegar el balón por fuera',
  'Trave: quanto o gol treme': 'Poste: cuánto tiembla la portería',
  'Torcida: tempo no auge da festa (s)': 'Afición: duración del momento más intenso (s)',
  'Torcida: tempo para acalmar (s)': 'Afición: tiempo para volver a la calma (s)',
  'Placas GOOOL: duração (s)': 'Anuncios de ¡GOOOL!: duración (s)',
  'Gravidade': 'Gravedad',
  'Resistência do ar': 'Resistencia del aire',
  'Quanto o giro desvia a bola': 'Cuánto desvía el efecto al balón',
  'Distância do gol (m)': 'Distancia a la portería (m)',
  'Ângulo (graus, + = direita)': 'Ángulo (grados; + = derecha)',
};

const ler = (obj, chave) => chave.split('.').reduce((o, k) => o[k], obj);
function gravar(obj, chave, valor) {
  const partes = chave.split('.');
  const ultima = partes.pop();
  partes.reduce((o, k) => o[k], obj)[ultima] = valor;
}

function lerSalvo(chaveArmazenamento) {
  try {
    return JSON.parse(localStorage.getItem(chaveArmazenamento)) || null;
  } catch {
    return null;
  }
}

function salvar(chaveArmazenamento, dados) {
  try {
    localStorage.setItem(chaveArmazenamento, JSON.stringify(dados));
  } catch {
    // Sem armazenamento (aba anônima, por exemplo): os ajustes valem só até fechar a página
  }
}

export function criarPainel({ config, versao, aoMudar }) {
  const ARMAZENAMENTO = 'fkl-ajustes';
  const padrao = JSON.parse(JSON.stringify(config));
  const campos = CAMPOS.filter((c) => c.chave);

  // Conserva ajustes anteriores; el valor viejo por defecto de atributos no se adapta a la escala 0–99.
  const salvo = lerSalvo(ARMAZENAMENTO);
  const migrandoVersaoAnterior = salvo && salvo.versao === 'v0.1 · etapa 8.1';
  if (salvo && (salvo.versao === versao || migrandoVersaoAnterior)) {
    for (const c of campos) {
      const v = salvo.valores?.[c.chave];
      if (migrandoVersaoAnterior && c.chave === 'pesoAtributos' && v === 0.15) continue;
      if (typeof v === typeof ler(config, c.chave)) gravar(config, c.chave, v);
    }
  }

  const painel = document.getElementById('painel');
  const lista = document.getElementById('painel-campos');
  const aviso = document.getElementById('painel-aviso');
  const entradas = new Map();

  // Mostra tantas casas decimais quanto o passo do slider pede (0.5 -> 1 casa, 0.001 -> 3 casas)
  const formatar = (c, v) => {
    if (c.tipo === 'liga') return v ? 'Activado' : 'Desactivado';
    return v.toFixed(Math.max(0, Math.ceil(-Math.log10(c.passo) - 1e-9)));
  };
  // Liga/desliga usa caixa de marcar; o resto, slider
  const lerEntrada = (c, entrada) => (c.tipo === 'liga' ? entrada.checked : Number(entrada.value));
  const mostrarNaEntrada = (c, entrada, v) => {
    if (c.tipo === 'liga') entrada.checked = v;
    else entrada.value = v;
  };

  for (const c of CAMPOS) {
    if (c.secao) {
      const titulo = document.createElement('h3');
      titulo.textContent = TEXTO_ES[c.secao] || c.secao;
      lista.appendChild(titulo);
      continue;
    }
    const linha = document.createElement('label');
    linha.className = 'campo';
    const texto = document.createElement('span');
    texto.textContent = TEXTO_ES[c.rotulo] || c.rotulo;
    const valor = document.createElement('b');
    const entrada = document.createElement('input');
    if (c.tipo === 'liga') {
      entrada.type = 'checkbox';
      linha.classList.add('liga');
    } else {
      Object.assign(entrada, { type: 'range', min: c.min, max: c.max, step: c.passo });
    }
    mostrarNaEntrada(c, entrada, ler(config, c.chave));
    valor.textContent = formatar(c, ler(config, c.chave));
    entrada.addEventListener('input', () => {
      const v = lerEntrada(c, entrada);
      gravar(config, c.chave, v);
      valor.textContent = formatar(c, v);
      salvarTudo();
      aoMudar(c.chave);
    });
    linha.append(texto, valor, entrada);
    lista.appendChild(linha);
    entradas.set(c.chave, { entrada, valor, c });
  }

  function salvarTudo() {
    const valores = {};
    for (const c of campos) valores[c.chave] = ler(config, c.chave);
    salvar(ARMAZENAMENTO, { versao, valores });
  }

  function textoDosValores() {
    const linhas = [`Leyendas del Tiro Libre ${versao} — ajustes`];
    for (const c of campos) {
      const atual = ler(config, c.chave);
      const mudou = atual !== ler(padrao, c.chave) ? '  ← cambiado' : '';
      linhas.push(`${TEXTO_ES[c.rotulo] || c.rotulo} [${c.chave}]: ${formatar(c, atual)}${mudou}`);
    }
    return linhas.join('\n');
  }

  document.getElementById('painel-copiar').addEventListener('click', async () => {
    const texto = textoDosValores();
    try {
      await navigator.clipboard.writeText(texto);
      aviso.textContent = '¡Ajustes copiados! Ya puedes pegarlos aquí.';
    } catch {
      // Sem acesso à área de transferência: mostra o texto para copiar à mão
      aviso.textContent = 'No pude copiarlos automáticamente. Selecciona y copia el texto:';
      const caixa = document.createElement('textarea');
      caixa.value = texto;
      caixa.rows = 6;
      aviso.appendChild(caixa);
      caixa.select();
    }
  });

  document.getElementById('painel-restaurar').addEventListener('click', () => {
    for (const { entrada, valor, c } of entradas.values()) {
      const v = ler(padrao, c.chave);
      gravar(config, c.chave, v);
      mostrarNaEntrada(c, entrada, v);
      valor.textContent = formatar(c, v);
      aoMudar(c.chave);
    }
    salvarTudo();
    aviso.textContent = 'Se restauraron los valores predeterminados.';
  });

  const abrir = (sim) => {
    painel.hidden = !sim;
    aviso.textContent = '';
  };
  // blur(): tira o foco do botão, para a barra de espaço do computador voltar a chutar
  const botaoAjustes = document.getElementById('botao-ajustes');
  botaoAjustes.addEventListener('click', (e) => {
    e.currentTarget.blur();
    abrir(painel.hidden);
  });
  document.getElementById('painel-fechar').addEventListener('click', (e) => {
    e.currentTarget.blur();
    abrir(false);
  });

  // Desafio do Dia: o painel fica trancado e os números que mudam o jogo voltam ao padrão (todo mundo joga
  // igual; ninguém deixa o goleiro fácil para bater o recorde). Som, câmera e cenário continuam do jeito
  // da pessoa. Ao destrancar, os ajustes salvos voltam.
  const LIVRES = ['audio.', 'camera.', 'cenario.', 'rastro', 'video', 'mira.sensibilidade'];
  const livre = (chave) => LIVRES.some((p) => chave === p || chave.startsWith(p));
  function bloquear(sim) {
    botaoAjustes.hidden = sim;
    if (sim) abrir(false);
    const salvo = lerSalvo(ARMAZENAMENTO);
    for (const { entrada, valor, c } of entradas.values()) {
      if (livre(c.chave)) continue;
      let v = ler(padrao, c.chave);
      if (!sim && salvo && salvo.versao === versao) {
        const s = salvo.valores?.[c.chave];
        if (typeof s === typeof v) v = s;
      }
      gravar(config, c.chave, v);
      mostrarNaEntrada(c, entrada, v);
      valor.textContent = formatar(c, v);
    }
  }

  return { bloquear };
}
