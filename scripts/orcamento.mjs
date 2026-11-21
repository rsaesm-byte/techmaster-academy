// Orçamento de tamanho do site: falha o CI se o JavaScript crescer demais.
// Os limites são em KB depois de gzip (o que o navegador realmente baixa).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const LIMITES = {
  entrada: 190, // index-*.js: tudo que carrega na primeira tela
  pedaco: 60, // qualquer outro pedaço carregado sob demanda
  total: 280, // soma do JavaScript do app (sem as aulas); subiu de 260 em 2026-11 (glossário e simulações novas)
  conteudo: 700, // soma dos pedaços de aulas (carregados só quando a disciplina é aberta)
};

const pasta = 'dist/assets';
const kb = (b) => Math.round((b / 1024) * 10) / 10;
const arquivos = readdirSync(pasta)
  .filter((f) => f.endsWith('.js'))
  .map((f) => ({ nome: f, gz: gzipSync(readFileSync(join(pasta, f)), { level: 9 }).length }))
  .sort((a, b) => b.gz - a.gz);

const problemas = [];
let total = 0;
let conteudo = 0;
for (const { nome, gz } of arquivos) {
  if (nome.startsWith('aulas-')) conteudo += gz;
  else total += gz;
  const limite = nome.startsWith('index-') ? LIMITES.entrada : LIMITES.pedaco;
  if (kb(gz) > limite) problemas.push(`${nome}: ${kb(gz)} KB (limite ${limite} KB)`);
}
if (kb(total) > LIMITES.total) problemas.push(`app: ${kb(total)} KB (limite ${LIMITES.total} KB)`);

console.log('Maiores arquivos JS (gzip):');
for (const a of arquivos.slice(0, 6))
  console.log(`  ${kb(a.gz).toString().padStart(6)} KB  ${a.nome}`);
console.log(`  app: ${kb(total)} KB; aulas: ${kb(conteudo)} KB; ${arquivos.length} arquivos`);
if (kb(conteudo) > LIMITES.conteudo)
  problemas.push(`aulas: ${kb(conteudo)} KB (limite ${LIMITES.conteudo} KB)`);

if (problemas.length) {
  console.error('\nOrçamento estourado:\n  ' + problemas.join('\n  '));
  process.exit(1);
}
console.log('Orçamento OK.');
