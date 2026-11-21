import { describe, expect, it } from 'vitest';
import { consultar } from './sql';

const ok = (sql: string) => {
  const r = consultar(sql);
  if (!r.ok) throw new Error(r.erro);
  return r;
};

describe('mini SQL', () => {
  it('SELECT * devolve todas as colunas e linhas', () => {
    const r = ok('SELECT * FROM clientes');
    expect(r.colunas).toEqual(['id', 'nome', 'cidade', 'idade']);
    expect(r.linhas).toHaveLength(5);
  });
  it('WHERE filtra, com AND e OR', () => {
    expect(ok("SELECT nome FROM clientes WHERE cidade = 'Sorocaba'").linhas).toEqual([
      ['Ana'],
      ['Carla'],
    ]);
    expect(ok("SELECT nome FROM clientes WHERE cidade = 'Sorocaba' AND idade > 25").linhas).toEqual(
      [['Ana']],
    );
    expect(ok('SELECT nome FROM clientes WHERE idade < 25 OR idade > 40').linhas).toEqual([
      ['Carla'],
      ['Diego'],
    ]);
  });
  it('LIKE usa %', () => {
    expect(ok("SELECT nome FROM clientes WHERE nome LIKE 'C%'").linhas).toEqual([['Carla']]);
  });
  it('ORDER BY e LIMIT', () => {
    expect(ok('SELECT nome FROM clientes ORDER BY idade DESC LIMIT 2').linhas).toEqual([
      ['Diego'],
      ['Bruno'],
    ]);
    expect(ok('SELECT nome FROM clientes ORDER BY nome').linhas[0]).toEqual(['Ana']);
  });
  it('agregados', () => {
    expect(ok('SELECT COUNT(*) FROM pedidos').linhas).toEqual([[7]]);
    expect(ok('SELECT SUM(valor), MAX(valor) FROM pedidos').linhas).toEqual([[305, 120]]);
    expect(ok("SELECT AVG(idade) FROM clientes WHERE cidade = 'Campinas'").linhas).toEqual([
      [32.5],
    ]);
  });
  it('GROUP BY', () => {
    const r = ok('SELECT produto, COUNT(*) FROM pedidos GROUP BY produto ORDER BY produto');
    expect(r.linhas).toEqual([
      ['Caderno', 2],
      ['Caneta', 3],
      ['Mochila', 2],
    ]);
  });
  it('JOIN liga as tabelas', () => {
    const r = ok(
      "SELECT nome, produto FROM clientes JOIN pedidos ON clientes.id = pedidos.cliente_id WHERE produto = 'Mochila' ORDER BY nome",
    );
    expect(r.linhas).toEqual([
      ['Bruno', 'Mochila'],
      ['Carla', 'Mochila'],
    ]);
  });
  it('JOIN com GROUP BY soma por cliente', () => {
    const r = ok(
      'SELECT nome, SUM(valor) FROM clientes JOIN pedidos ON clientes.id = pedidos.cliente_id GROUP BY nome ORDER BY nome',
    );
    expect(r.linhas[0]).toEqual(['Ana', 30]);
  });
  it('mensagens de erro úteis', () => {
    expect(consultar('SELECT x FROM clientes')).toMatchObject({ ok: false });
    expect(consultar('SELECT * FROM nada')).toMatchObject({
      ok: false,
      erro: expect.stringContaining('nada'),
    });
    expect(consultar('SELEC * FROM clientes')).toMatchObject({ ok: false });
    expect(
      consultar('SELECT id FROM clientes JOIN pedidos ON clientes.id = pedidos.cliente_id'),
    ).toMatchObject({ ok: false, erro: expect.stringContaining('ambígua') });
    expect(consultar('SELECT nome, COUNT(*) FROM clientes')).toMatchObject({ ok: false });
  });
});
