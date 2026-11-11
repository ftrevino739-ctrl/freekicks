// Todos os números ajustáveis do jogo ficam aqui.
// Unidades: metros, segundos, graus.

export const VERSAO = 'v0.1 · etapa 8.2';

export const CONFIG = {
  // Mundo
  gravidade: 9.81,        // m/s²
  arrasto: 0.012,         // resistência do ar: quanto maior, mais a bola freia no voo
  magnus: 0.005,          // quanto o giro desvia a bola (efeito Magnus)
  decaimentoGiro: 0.15,   // quanto o giro perde por segundo (0.15 = 15%)
  raioBola: 0.11,         // m
  magnusLimite: 0.5,      // limite do efeito Magnus: com giro × raio acima de metade da velocidade, girar mais não curva mais
  quiqueChao: 0.65,       // quanto a bola volta numa batida lenta no gramado (0 = nada, 1 = tudo)
  quiqueChaoForte: 0.45,  // quanto volta numa batida forte (a grama amassa e segura mais)
  quiqueChaoVelocidade: 12, // m/s: batida a partir da qual vale o quiqueChaoForte
  atritoDeslize: 0.4,     // atrito da grama quando a bola escorrega (troca velocidade por giro)
  atritoGrama: 2.5,       // m/s² de freada quando a bola rola

  // Chute
  velocidadeMin: 14,      // m/s com a barra vazia
  velocidadeMax: 36,      // m/s com a barra cheia (cobrador neutro; FOR muda até uns 5% para cima ou 10% para baixo)
  elevacaoBase: 16,       // graus: ângulo de saída com contato no centro da bola
  tempoCarga: 1.1,        // segundos para a barra encher

  // Ponto de contato na bola
  elevacaoContatoEmbaixo: 4, // graus a mais quando o pé pega embaixo da bola
  elevacaoCavadinha: 18,     // graus a mais bem na ponta de baixo (cresce rápido perto da borda)
  elevacaoContatoEmCima: 1,  // graus a menos com o pé em cima, antes de virar rasteiro
  rasteiroInicio: 0.62,      // altura do contato (0 = centro, 1 = topo) onde a bola começa a sair baixa
  rasteiroFim: 0.82,         // a partir desta altura a bola sai rasteira
  elevacaoRasteiro: 2.5,     // graus de saída do chute rasteiro (sai quicando baixinho)
  giroLateralMax: 70,     // giro com o pé na lateral da bola: define a força da curva
  giroVerticalMax: 55,    // giro para a frente com o pé em cima (cai: folha seca; rasteiro)
  giroEmbaixoMax: 18,     // giro para trás com o pé embaixo (flutua)
  perdaVelocidadeContato: 0.15, // quanto de velocidade se perde batendo na borda da bola
  quedaTardia: 6,         // quanto a queda (giro para a frente) e a flutuação (para trás) crescem quando a bola perde velocidade
  quedaTardiaInicio: 0.25, // queda logo depois do chute (fração do efeito normal): sobe e depois despenca
  efeitoTardioMax: 1.8,   // limite do crescimento dos efeitos tardios (queda e trivela)

  // Mira com imprecisão (a bola sai dentro de um cone em volta da mira)
  erroMiraBase: 1,        // graus: tamanho do cone (desvio padrão) do cobrador neutro
  forcaIdeal: 0.8,        // ponto ideal da barra: passar dele aumenta o erro
  erroAcimaIdeal: 2,      // erro a mais com a barra cheia (2 = três vezes o erro normal)
  erroVerticalFracao: 0.35, // erro na altura em relação ao erro na direção
  erroPressao: 0.4,       // erro a mais no lance decisivo (a frieza corta até metade disso)

  // Cobradores (atributos de 0 a 99)
  pesoAtributos: 0.7,     // faz a diferença entre notas 0 e 99 aparecer nos efeitos, mantendo 85 como referência
  trivelaGiro: 0.6,       // trivela de quem não é especialista: fração da curva
  trivelaErro: 1.4,       // ... e quanto o erro aumenta
  trivelaGiroEspecialista: 1.05, // trivela de especialista: fração da curva
  trivelaErroEspecialista: 1.1,  // ... e quanto o erro aumenta
  trivelaTardia: 3,       // quanto a curva da trivela do especialista cresce no fim (0 = igual à normal)
  trivelaTardiaInicio: 0.6, // curva da trivela do especialista logo depois do chute (fração da normal)
  folhaSecaAngulo: 0.4,   // especialista em folha seca: fração do ângulo perdido com o pé em cima
  folhaSecaGiro: 1.1,     // especialista em folha seca: giro para a frente a mais
  folhaSecaAtraso: 0.08,  // especialista em folha seca: o rasteiro só começa mais perto do topo

  // Bola sem rotação (pé bem no centro e chute forte)
  semRotacaoRaio: 0.25,         // quão perto do centro precisa ser o contato
  semRotacaoForcaMinima: 0.7,   // força mínima da barra para a bola "dançar"
  semRotacaoAmplitude: 6,       // quanto a bola dança
  semRotacaoQueda: 4,           // m/s²: quanto ela cai de repente no fim do voo (com dança cheia)
  semRotacaoEspecialista: 1.5,  // especialista: dança mais...
  semRotacaoZonaEspecialista: 1.5,  // ... tem uma zona central maior...
  semRotacaoForcaEspecialista: 0.12, // ... e precisa de menos força (desconto na força mínima)
  semRotacaoComum: 0.6,         // quem não é especialista: dança menos

  // Gol (medidas oficiais)
  golLargura: 7.32,
  golAltura: 2.44,
  golProfundidade: 2.0,
  raioTrave: 0.06,
  quiqueTrave: 0.6,       // quanto a bola volta ao bater na trave (0 = morre, 1 = volta tudo)

  // Ranking
  ranking: {
    url: '',
    chave: '',
    tabela: 'ranking',
  },

  // Desafio
  desafio: {
    goleiro: {
      reflexo: 0.85,
      velocidade: 0.9,
      alcance: 0.95,
    },
  },

  // Física
  passoFisica: 1 / 60,
  esperaRecomeco: 1.3,
  esperaGol: 2.2,
};
