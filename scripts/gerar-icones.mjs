// Gera o ícone "Camadas" (animado e estático). Uso: node scripts/gerar-icones.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const DUR = '3.6s';
const flutua = (atraso, amp) =>
  `<animateTransform attributeName="transform" type="translate" values="0 0;0 ${-amp};0 0" dur="${DUR}" begin="${atraso}s" repeatCount="indefinite" calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1"/>`;

function conteudo({ anim, brilho }) {
  const f = brilho ? ' filter="url(#brilho)"' : '';
  const a = (s) => (anim ? s : '');
  return `
<g transform="scale(8)" stroke-linecap="round" stroke-linejoin="round" fill="none">
  <g stroke="url(#neon)" stroke-width="3.2"${f}>
    <path d="M12 43l20 10 20-10">${a(flutua(0.4, 0.6))}</path>
    <path d="M12 32l20 10 20-10">${a(flutua(0.2, 1.4))}</path>
  </g>
  <g stroke="url(#neon)" stroke-width="3.2"${f}>
    <path d="M32 12 52 22 32 32 12 22Z" fill="#6366F1" fill-opacity=".18">${a(
      `${flutua(0, 2.2)}<animate attributeName="fill-opacity" values=".12;.4;.12" dur="${DUR}" repeatCount="indefinite"/>`,
    )}</path>
  </g>
  <circle cx="32" cy="22" r="3.6" fill="#FBBF24"${f}>${a(
    `<animate attributeName="cy" values="22;22;37;48;48" keyTimes="0;.12;.5;.82;1" dur="${DUR}" repeatCount="indefinite"/>
     <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;.12;.5;.82;1" dur="${DUR}" repeatCount="indefinite"/>
     <animate attributeName="r" values="3.6;4.6;3.2;3.2;2" keyTimes="0;.12;.5;.82;1" dur="${DUR}" repeatCount="indefinite"/>`,
  )}</circle>
</g>`;
}

const defs = (brilho) => `<defs>
<radialGradient id="fundo" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#13254A"/><stop offset="1" stop-color="#050A16"/></radialGradient>
<linearGradient id="neon" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset=".55" stop-color="#6366F1"/><stop offset="1" stop-color="#C026D3"/></linearGradient>
${brilho ? '<filter id="brilho" filterUnits="userSpaceOnUse" x="-10" y="-10" width="84" height="84"><feGaussianBlur stdDeviation="0.9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' : ''}
</defs>`;

function svg({ anim, arredondado, brilho }) {
  const fundo = arredondado
    ? '<rect x="8" y="8" width="496" height="496" rx="116" fill="url(#fundo)"/><rect x="8" y="8" width="496" height="496" rx="116" fill="none" stroke="#1E3A5F" stroke-width="4"/>'
    : '<rect width="512" height="512" fill="url(#fundo)"/>';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${defs(brilho)}${fundo}${conteudo({ anim, brilho })}</svg>\n`;
}

mkdirSync('/tmp/icones', { recursive: true });
writeFileSync('public/icones/icone.svg', svg({ anim: true, arredondado: true, brilho: true }));
writeFileSync('public/favicon.svg', svg({ anim: true, arredondado: true, brilho: false }));
writeFileSync('/tmp/icones/est.svg', svg({ anim: false, arredondado: true, brilho: true }));
writeFileSync('/tmp/icones/mask.svg', svg({ anim: false, arredondado: false, brilho: true }));
const png = (origem, destino, t) =>
  execFileSync('rsvg-convert', ['-w', String(t), '-h', String(t), origem, '-o', destino]);
png('/tmp/icones/est.svg', 'public/icones/icon-512.png', 512);
png('/tmp/icones/est.svg', 'public/icones/icon-192.png', 192);
png('/tmp/icones/mask.svg', 'public/icones/icon-maskable-512.png', 512);
png('/tmp/icones/mask.svg', 'public/icones/apple-touch-icon.png', 180);
console.log('Ícones gerados.');
