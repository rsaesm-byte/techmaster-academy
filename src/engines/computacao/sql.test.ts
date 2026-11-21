import { describe, expect, it } from 'vitest';
import { consultar, executarSql, TABELAS } from './sql';

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

  it('DISTINCT, IN, IS NULL e apelidos', () => {
    expect(ok('SELECT DISTINCT cidade FROM clientes ORDER BY cidade').linhas).toEqual([
      ['Campinas'],
      ['Sorocaba'],
      ['São Paulo'],
    ]);
    expect(
      ok("SELECT nome FROM clientes WHERE cidade IN ('Campinas', 'São Paulo') ORDER BY nome")
        .linhas,
    ).toHaveLength(3);
    expect(ok('SELECT nome FROM clientes WHERE idade IS NULL').linhas).toEqual([]);
    const r = ok('SELECT COUNT(*) AS total FROM pedidos');
    expect(r.colunas).toEqual(['total']);
  });
  it('HAVING filtra grupos e ORDER BY aceita agregado e apelido', () => {
    const r = ok('SELECT produto, COUNT(*) AS n FROM pedidos GROUP BY produto HAVING COUNT(*) > 2');
    expect(r.linhas).toEqual([['Caneta', 3]]);
    const o = ok(
      'SELECT produto, SUM(valor) AS total FROM pedidos GROUP BY produto ORDER BY total DESC LIMIT 1',
    );
    expect(o.linhas).toEqual([['Mochila', 240]]);
    expect(
      ok('SELECT produto, COUNT(*) FROM pedidos GROUP BY produto ORDER BY COUNT(*) DESC LIMIT 1')
        .linhas,
    ).toEqual([['Caneta', 3]]);
    expect(consultar('SELECT produto FROM pedidos WHERE COUNT(*) > 1')).toMatchObject({
      ok: false,
    });
  });
  it('LEFT JOIN mantém clientes sem pedidos', () => {
    const r = ok(
      'SELECT nome, produto FROM clientes LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id WHERE produto IS NULL',
    );
    expect(r.linhas).toEqual([['Diego', null]]);
    const c = ok(
      'SELECT nome, COUNT(produto) FROM clientes LEFT JOIN pedidos ON clientes.id = pedidos.cliente_id GROUP BY nome ORDER BY nome',
    );
    expect(c.linhas).toContainEqual(['Diego', 0]);
  });
  it('INSERT, UPDATE e DELETE alteram uma cópia e protegem a chave primária', () => {
    const a = executarSql(
      "INSERT INTO clientes (id, nome, cidade, idade) VALUES (6, 'Fabio', 'Itu', 19)",
    );
    expect(a.resultado).toMatchObject({ ok: true, mensagem: expect.stringContaining('1 linha') });
    expect(a.tabelas.clientes?.linhas).toHaveLength(6);
    expect(TABELAS.clientes?.linhas).toHaveLength(5);
    expect(executarSql("INSERT INTO clientes VALUES (1, 'X', 'Y', 1)").resultado).toMatchObject({
      ok: false,
      erro: expect.stringContaining('chave primária'),
    });
    const u = executarSql("UPDATE clientes SET cidade = 'Itu', idade = 29 WHERE id = 1");
    expect(u.tabelas.clientes?.linhas[0]).toEqual([1, 'Ana', 'Itu', 29]);
    const d = executarSql('DELETE FROM pedidos WHERE valor < 10');
    expect(d.tabelas.pedidos?.linhas).toHaveLength(4);
    expect(executarSql('DELETE FROM pedidos').tabelas.pedidos?.linhas).toHaveLength(0);
    expect(executarSql('DROP TABLE pedidos').resultado).toMatchObject({ ok: false });
  });
});
