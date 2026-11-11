// Grava o lance em vídeo (MediaRecorder) e baixa ou compartilha o gol.
// Sem dependência do Three.js: recebe o canvas e o estado.

export function criarReplay(canvas) {
  let gravador = null;
  let pedacos = [];
  let url = null;

  function comecar() {
    if (!canvas.captureStream) return;
    parar();
    pedacos = [];
    try {
      const stream = canvas.captureStream(30);
      const tipos = ['video/webm;codecs=vp9', 'video/webm', 'video/mp4'];
      const tipo = tipos.find((t) => MediaRecorder.isTypeSupported(t)) || '';
      gravador = new MediaRecorder(stream, tipo ? { mimeType: tipo } : {});
      gravador.ondataavailable = (e) => { if (e.data.size) pedacos.push(e.data); };
      gravador.start();
    } catch {
      gravador = null;
    }
  }

  function parar() {
    return new Promise((resolve) => {
      if (!gravador || gravador.state === 'inactive') {
        resolve(null);
        return;
      }
      gravador.onstop = () => {
        if (url) URL.revokeObjectURL(url);
        const blob = new Blob(pedacos, { type: gravador.mimeType || 'video/webm' });
        url = URL.createObjectURL(blob);
        gravador = null;
        resolve(url);
      };
      gravador.stop();
    });
  }

  async function baixarOuCompartilhar(nomeArquivo = 'gol.webm') {
    const link = await parar();
    if (!link) return;
    const blob = await (await fetch(link)).blob();
    const arquivo = new File([blob], nomeArquivo, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
      try {
        await navigator.share({ files: [arquivo], title: 'Gol!' });
        return;
      } catch {
        // usuário cancelou ou o navegador recusou: cai no download
      }
    }
    const a = document.createElement('a');
    a.href = link;
    a.download = nomeArquivo;
    a.click();
  }

  return { comecar, parar, baixarOuCompartilhar };
}
