// Roda antes do app: lê a preferência de tema e aplica a classe "dark" no <html>.
// Fica num arquivo separado (e não inline) para respeitar a Content Security Policy.
(function () {
  try {
    var pref = localStorage.getItem('tm:tema') || 'sistema';
    var escuro =
      pref === 'escuro' ||
      (pref === 'sistema' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', escuro);
  } catch (e) {
    /* sem acesso ao armazenamento: fica no tema claro */
  }
})();
