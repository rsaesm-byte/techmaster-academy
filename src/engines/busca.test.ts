import { describe, expect, it } from 'vitest';
import { catalogo } from '@/content';
import { buscar, construirIndice } from '@/engines/busca';

const indice = construirIndice(catalogo);

describe('busca global', () => {
  it('ignora acentos e maiúsculas, e põe o termo do glossário no topo', () => {
    const r = buscar(indice, 'ACUMULADOR');
    expect(r[0]).toMatchObject({ tipo: 'termo', titulo: 'Acumulador' });
    expect(r.some((x) => x.tipo === 'aula' && x.titulo === 'Estruturas de repetição')).toBe(true);
  });
  it('todas as palavras precisam aparecer', () => {
    expect(buscar(indice, 'variavel atribuicao').map((r) => r.titulo)).toContain(
      'Variáveis, constantes e tipos',
    );
    expect(buscar(indice, 'acumulador xyzinexistente')).toEqual([]);
  });
  it('encontra laboratórios', () => {
    expect(buscar(indice, 'robô')[0]?.rota).toBe('/lab/robo');
  });
  it('consulta muito curta não busca', () => {
    expect(buscar(indice, 'a')).toEqual([]);
  });
});
