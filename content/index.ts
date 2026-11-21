/**
 * Registro de todo o conteúdo. Para publicar uma aula nova:
 * 1. crie o arquivo em content/<disciplina>/<modulo>/
 * 2. importe e adicione em `aulas` abaixo
 * 3. coloque o id dela no módulo, em content/<disciplina>/disciplina.ts
 * O teste "conteúdo válido" (npm test) confere tudo.
 */
import { glossario } from './glossario';
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

export const disciplinas = [logica];
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
];
export { glossario };
