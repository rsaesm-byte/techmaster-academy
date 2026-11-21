/**
 * Registro de todo o conteúdo. Para publicar uma aula nova:
 * 1. crie o arquivo em content/<disciplina>/<modulo>/
 * 2. importe e adicione em `aulas` abaixo
 * 3. coloque o id dela no módulo, em content/<disciplina>/disciplina.ts
 * O teste "conteúdo válido" (npm test) confere tudo.
 */
import { glossario } from './glossario';
import { fundamentos } from './fundamentos/disciplina';
import { f01 } from './fundamentos/a01-bits';
import { f02 } from './fundamentos/a02-texto-hex';
import { f03 } from './fundamentos/a03-portas';
import { f04 } from './fundamentos/a04-cpu-memoria';
import { f05 } from './fundamentos/a05-terminal';
import { f06 } from './fundamentos/b01-sistema-operacional';
import { f07 } from './fundamentos/b02-permissoes';
import { f08 } from './fundamentos/b03-redes-ip';
import { f09 } from './fundamentos/b04-dns-http';
import { f10 } from './fundamentos/b05-senhas';
import { f11 } from './fundamentos/c01-unidades';
import { f12 } from './fundamentos/c02-cache';
import { f13 } from './fundamentos/c03-armazenamento-raid';
import { f14 } from './fundamentos/c04-compressao';
import { f15 } from './fundamentos/c05-criptografia';
import { f16 } from './fundamentos/d01-virtualizacao';
import { f17 } from './fundamentos/d02-conteineres';
import { f18 } from './fundamentos/d03-nuvem';
import { f19 } from './fundamentos/d04-git';
import { f20 } from './fundamentos/d05-bancos-dados';
import { sql } from './sql/disciplina';
import { redes } from './redes/disciplina';
import { r01 } from './redes/a01-camadas';
import { r02 } from './redes/a02-subredes';
import { r03 } from './redes/a03-roteamento';
import { r04 } from './redes/a04-transporte';
import { r05 } from './redes/a05-dhcp-nat-firewall';
import { r06 } from './redes/c01-diagnostico';
import { r07 } from './redes/c02-wifi';
import { r08 } from './redes/c03-tls';
import { r09 } from './redes/c04-vpn';
import { r10 } from './redes/c05-projeto';
import { ciberseguranca } from './ciberseguranca/disciplina';
import { c01 } from './ciberseguranca/a01-triade-cia';
import { c02 } from './ciberseguranca/a02-senhas-hash';
import { c03 } from './ciberseguranca/a03-phishing';
import { c04 } from './ciberseguranca/a04-injecao-sql';
import { c05 } from './ciberseguranca/a05-boas-praticas';
import { web } from './web/disciplina';
import { w01 } from './web/a01-html';
import { w02 } from './web/a02-css';
import { w03 } from './web/a03-layout';
import { w04 } from './web/a04-formularios';
import { w05 } from './web/a05-projeto';
import { bancos } from './bancos/disciplina';
import { b01 } from './bancos/a01-modelagem';
import { b02 } from './bancos/a02-normalizacao';
import { b03 } from './bancos/a03-chaves';
import { b04 } from './bancos/a04-indices';
import { b05 } from './bancos/a05-transacoes';
import { s01, s02, s03, s04, s05 } from './sql/aulas';
import { s06, s07, s08, s09, s10 } from './sql/aulas2';
import { python } from './python/disciplina';
import { p01 } from './python/a01-variaveis';
import { p02 } from './python/a02-condicionais';
import { p03 } from './python/a03-listas-lacos';
import { p04 } from './python/a04-funcoes';
import { p05 } from './python/a05-dicionarios';
import { p06 } from './python/b01-textos';
import { p07 } from './python/b02-tuplas-conjuntos';
import { p08 } from './python/b03-arquivos';
import { p09 } from './python/b04-excecoes';
import { p10 } from './python/b05-modulos';
import { javascript } from './javascript/disciplina';
import { j01 } from './javascript/a01-variaveis';
import { j02 } from './javascript/a02-condicionais';
import { j03 } from './javascript/a03-lacos-arrays';
import { j04 } from './javascript/a04-funcoes';
import { j05 } from './javascript/a05-objetos-arrays';
import { j06 } from './javascript/b01-json';
import { j07 } from './javascript/b02-desestruturacao';
import { j08 } from './javascript/b03-dom';
import { j09 } from './javascript/b04-erros';
import { j10 } from './javascript/b05-assincrono';
import { j11 } from './javascript/c01-estado';
import { j12 } from './javascript/c02-lista-tarefas';
import { j13 } from './javascript/c03-persistencia';
import { j14 } from './javascript/c04-api';
import { j15 } from './javascript/c05-testes';
import { logica } from './logica/disciplina';
import { aula01 } from './logica/m01/a01-o-que-e-algoritmo';
import { aula02 } from './logica/m01/a02-variaveis';
import { aula03 } from './logica/m01/a03-operadores';
import { aula04 } from './logica/m01/a04-condicionais';
import { aula05 } from './logica/m01/a05-repeticao';
import { m02a01 } from './logica/m02/a01-vetores';
import { m02a02 } from './logica/m02/a02-funcoes';
import { m02a03 } from './logica/m02/a03-busca';
import { m02a04 } from './logica/m02/a04-ordenacao';
import { m02a05 } from './logica/m02/a05-recursividade';

export const disciplinas = [
  logica,
  fundamentos,
  javascript,
  python,
  sql,
  redes,
  ciberseguranca,
  web,
  bancos,
];
export const aulas = [
  aula01,
  aula02,
  aula03,
  aula04,
  aula05,
  m02a01,
  m02a02,
  m02a03,
  m02a04,
  m02a05,
  f01,
  f02,
  f03,
  f04,
  f05,
  f06,
  f07,
  f08,
  f09,
  f10,
  f11,
  f12,
  f13,
  f14,
  f15,
  f16,
  f17,
  f18,
  f19,
  f20,
  j01,
  j02,
  j03,
  j04,
  j05,
  j06,
  j07,
  j08,
  j09,
  j10,
  j11,
  j12,
  j13,
  j14,
  j15,
  p01,
  p02,
  p03,
  p04,
  p05,
  p06,
  p07,
  p08,
  p09,
  p10,
  s01,
  s02,
  s03,
  s04,
  s05,
  s06,
  s07,
  s08,
  s09,
  s10,
  r01,
  r02,
  r03,
  r04,
  r05,
  r06,
  r07,
  r08,
  r09,
  r10,
  c01,
  c02,
  c03,
  c04,
  c05,
  w01,
  w02,
  w03,
  w04,
  w05,
  b01,
  b02,
  b03,
  b04,
  b05,
];
export { glossario };
