// Roda antes do app: aplica tema e preferências de leitura como classes no <html>,
// evitando o "piscar" da página. Arquivo separado (não inline) por causa da CSP.
(function () {
  try {
    var c = document.documentElement.classList;
    var pref = localStorage.getItem('tm:tema') || 'sistema';
    var escuro =
      pref === 'escuro' ||
      (pref === 'sistema' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    c.toggle('dark', escuro);
    var p = JSON.parse(localStorage.getItem('tm:prefs') || '{}');
    c.toggle('texto-grande', p.tamanhoTexto === 'grande');
    c.toggle('texto-muito-grande', p.tamanhoTexto === 'muito-grande');
    c.toggle('reduzir-movimento', p.reduzirMovimento === true);
    c.toggle('densidade-compacta', p.densidade === 'compacta');
    c.toggle('modo-foco', p.modoFoco === true);
  } catch (e) {
    /* sem acesso ao armazenamento: valores padrão */
  }
})();
