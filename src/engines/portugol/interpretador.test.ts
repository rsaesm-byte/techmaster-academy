import { describe, expect, it } from 'vitest';
import { LeitorExpressao, passosDaExpressao } from '@/engines/portugol/expressao';
import { executar } from '@/engines/portugol/interpretador';
import { tokenizar } from '@/engines/portugol/lexer';

const saidaDe = (fonte: string, entradas: string[] = []) => {
  const r = executar(fonte, entradas);
  if (r.erro) throw new Error(`linha ${r.erro.linha}: ${r.erro.mensagem}`);
  return r.saida;
};

describe('interpretador Portugol', () => {
  it('atribuição e escreva (exemplo da aula 1)', () => {
    expect(saidaDe('a <- 5\nb <- 3\na <- a + b\nescreva(a)')).toEqual(['8']);
  });

  it('programa completo com var/inicio/fimalgoritmo e leia', () => {
    const fonte = [
      'algoritmo "Media"',
      'var',
      '  nota1, nota2, media: real',
      'inicio',
      '  leia(nota1)',
      '  leia(nota2)',
      '  media <- (nota1 + nota2) / 2',
      '  escreva("Média: ", media)',
      'fimalgoritmo',
    ].join('\n');
    expect(saidaDe(fonte, ['7', '8'])).toEqual(['Média: 7.5']);
  });

  it('precedência: multiplicação antes da soma; parênteses mudam a ordem', () => {
    expect(saidaDe('escreva(2 + 3 * 4)\nescreva((2 + 3) * 4)\nescreva(10 % 3)')).toEqual([
      '14',
      '20',
      '1',
    ]);
  });

  it('se / senao se / senao executa só o primeiro ramo verdadeiro', () => {
    const fonte = (idade: number) =>
      `idade <- ${idade}\nse idade >= 18 entao\n  escreva("Vota e dirige")\nsenao se idade >= 16 entao\n  escreva("Pode votar")\nsenao\n  escreva("Ainda não vota")\nfimse`;
    expect(saidaDe(fonte(20))).toEqual(['Vota e dirige']);
    expect(saidaDe(fonte(16))).toEqual(['Pode votar']);
    expect(saidaDe(fonte(10))).toEqual(['Ainda não vota']);
  });

  it('condições compostas com e / ou / nao e palavras com acento', () => {
    expect(saidaDe('x <- 5\nse x > 0 e nao (x > 10) então\n escreva("ok")\nfimse')).toEqual(['ok']);
  });

  it('enquanto com contador', () => {
    expect(
      saidaDe('c <- 1\nenquanto c <= 3 faca\n  escreva(c)\n  c <- c + 1\nfimenquanto'),
    ).toEqual(['1', '2', '3']);
  });

  it('para com passo, inclusive decrescente', () => {
    expect(saidaDe('para i de 1 ate 9 passo 4 faca\n escreva(i)\nfimpara')).toEqual([
      '1',
      '5',
      '9',
    ]);
    expect(saidaDe('para i de 3 ate 1 passo -1 faca\n escreva(i)\nfimpara')).toEqual([
      '3',
      '2',
      '1',
    ]);
  });

  it('repita ... ate', () => {
    expect(saidaDe('n <- 0\nrepita\n n <- n + 2\nate n >= 6\nescreva(n)')).toEqual(['6']);
  });

  it('acumulador de soma', () => {
    expect(
      saidaDe(
        'soma <- 0\npara i de 1 ate 5 faca\n soma <- soma + i\nfimpara\nescreva("Soma: ", soma)',
      ),
    ).toEqual(['Soma: 15']);
  });

  it('laço infinito é interrompido com mensagem clara', () => {
    const r = executar('c <- 1\nenquanto c <= 3 faca\n escreva(c)\nfimenquanto', [], 200);
    expect(r.erro?.mensagem).toMatch(/laço que nunca termina/);
    expect(r.saida.length).toBeGreaterThan(10);
  });

  it('o rastro mostra a linha, o valor das variáveis e o que mudou', () => {
    const r = executar('a <- 5\nb <- 3\na <- a + b');
    expect(r.passos.map((p) => p.linha)).toEqual([1, 2, 3]);
    expect(r.passos[2]).toMatchObject({
      descricao: 'a recebe 8',
      mudou: 'a',
      variaveis: [
        { chave: 'a', nome: 'a', valor: 8 },
        { chave: 'b', nome: 'b', valor: 3 },
      ],
    });
    expect(r.passos[0]?.variaveis).toEqual([{ chave: 'a', nome: 'a', valor: 5 }]);
  });

  it('rastro do se registra a condição avaliada', () => {
    const r = executar(
      'x <- 2\nse x > 5 entao\n escreva("grande")\nsenao\n escreva("pequeno")\nfimse',
    );
    expect(r.passos.map((p) => p.descricao)).toEqual([
      'x recebe 2',
      'Condição x > 5 é FALSA',
      'Nenhuma condição foi verdadeira: executa o senao',
      'Escreve na tela: pequeno',
    ]);
  });
});

describe('erros didáticos', () => {
  const erro = (fonte: string, entradas: string[] = []) => executar(fonte, entradas).erro;

  it('variável usada antes de ter valor', () => {
    expect(erro('escreva(total)')).toEqual({
      linha: 1,
      mensagem: expect.stringMatching(/"total" ainda não existe/),
    });
  });
  it('= no lugar de <-', () => {
    expect(erro('x = 5')?.mensagem).toMatch(/use "<-"/);
  });
  it('tipo declarado não bate', () => {
    expect(erro('var\n n: inteiro\ninicio\n n <- 2.5\nfimalgoritmo')).toEqual({
      linha: 4,
      mensagem: expect.stringMatching(/"n" é do tipo inteiro/),
    });
  });
  it('bloco sem fechamento', () => {
    expect(erro('se 1 < 2 entao\n escreva("a")')?.mensagem).toMatch(
      /Faltou fechar o bloco com "fimse"/,
    );
  });
  it('faltou entrada para leia', () => {
    expect(erro('leia(x)')?.mensagem).toMatch(/lista de entradas acabou/);
  });
  it('divisão por zero', () => {
    expect(erro('escreva(1 / 0)')?.mensagem).toBe('Divisão por zero.');
  });
  it('condição que não é lógica', () => {
    expect(erro('se 5 entao\nfimse')?.mensagem).toMatch(/deveria dar VERDADEIRO ou FALSO/);
  });
  it('texto sem fechar aspas', () => {
    expect(erro('escreva("oi)')?.mensagem).toMatch(/não fechado/);
  });
});

describe('passos de uma expressão', () => {
  const passos = (fonte: string, vars: Record<string, number> = {}) =>
    passosDaExpressao(new LeitorExpressao(tokenizar(fonte, 1), 1).lerTudo(), {
      variavel: (c) => vars[c] ?? 0,
    });

  it('mostra a precedência uma operação por vez', () => {
    expect(passos('2 + 3 * 4')).toEqual(['2 + 3 * 4', '2 + 12', '14']);
    expect(passos('(2 + 3) * 4')).toEqual(['(2 + 3) * 4', '5 * 4', '20']);
  });
  it('substitui variáveis primeiro', () => {
    expect(passos('(nota1 + nota2) / 2', { nota1: 7, nota2: 8 })).toEqual([
      '(nota1 + nota2) / 2',
      '(7 + 8) / 2',
      '15 / 2',
      '7.5',
    ]);
  });
  it('lógica', () => {
    expect(passos('idade >= 16 e idade < 18', { idade: 17 })).toEqual([
      'idade >= 16 e idade < 18',
      '17 >= 16 e 17 < 18',
      'VERDADEIRO e 17 < 18',
      'VERDADEIRO e VERDADEIRO',
      'VERDADEIRO',
    ]);
  });
});

describe('vetores', () => {
  const prog = (corpo: string, decl = 'v: vetor[1..5] de inteiro\n  i, soma: inteiro') =>
    `algoritmo "t"\nvar\n  ${decl}\ninicio\n${corpo}\nfimalgoritmo`;

  it('preenche e soma um vetor', () => {
    const r = executar(
      prog(
        'para i de 1 ate 5 faca\n  v[i] <- i * 10\nfimpara\nsoma <- 0\npara i de 1 ate 5 faca\n  soma <- soma + v[i]\nfimpara\nescreva(soma)',
      ),
    );
    expect(r.erro).toBeUndefined();
    expect(r.saida).toEqual(['150']);
    const preenchido = r.passos.find((p) => p.mudou === 'v' && p.mudouIndice === 3);
    expect(preenchido?.descricao).toBe('v[3] recebe 30');
    expect(r.passos.at(-1)?.variaveis[0]?.vetor?.elementos).toEqual([10, 20, 30, 40, 50]);
  });

  it('leia em posição de vetor', () => {
    const r = executar(
      prog('para i de 1 ate 3 faca\n  leia(v[i])\nfimpara\nescreva(v[1] + v[2] + v[3])'),
      ['1', '2', '3'],
    );
    expect(r.saida).toEqual(['6']);
  });

  it('índice fora do vetor dá erro claro', () => {
    expect(executar(prog('v[6] <- 1')).erro?.mensagem).toBe(
      'Posição 6 fora do vetor "v", que vai de 1 a 5.',
    );
  });
  it('posição sem valor', () => {
    expect(executar(prog('escreva(v[2])')).erro?.mensagem).toMatch(
      /v\[2\] foi usado antes de receber um valor/,
    );
  });
  it('usar o vetor sem índice', () => {
    expect(executar(prog('escreva(v)')).erro?.mensagem).toMatch(/é um vetor: use v\[posição\]/);
  });
  it('tipo do elemento é conferido', () => {
    expect(executar(prog('v[1] <- "a"')).erro?.mensagem).toMatch(/"v\[1\]" é do tipo inteiro/);
  });
  it('divisão inteira \\ e funções prontas', () => {
    expect(
      saidaDe('escreva(7 \\ 2)\nescreva(abs(-3))\nescreva(int(9.8))\nescreva(raizq(16))'),
    ).toEqual(['3', '3', '9', '4']);
  });
});

describe('funções, procedimentos e recursão', () => {
  it('função com parâmetros e retorne', () => {
    const fonte = [
      'algoritmo "f"',
      'funcao dobro(x: inteiro): inteiro',
      'inicio',
      '  retorne x * 2',
      'fimfuncao',
      'inicio',
      '  escreva(dobro(4) + 1)',
      'fimalgoritmo',
    ].join('\n');
    const r = executar(fonte);
    expect(r.saida).toEqual(['9']);
    const naFuncao = r.passos.find((p) => p.pilha.length === 2);
    expect(naFuncao?.pilha.map((q) => q.nome)).toEqual(['Programa principal', 'dobro(4)']);
    expect(naFuncao?.pilha[1]?.variaveis).toEqual([
      { chave: 'x', nome: 'x', tipo: 'inteiro', valor: 4 },
    ]);
    expect(r.passos.some((p) => p.descricao === 'dobro(4) devolveu 8')).toBe(true);
  });

  it('procedimento com variável local; a local não vaza para o principal', () => {
    const fonte = [
      'var',
      '  total: inteiro',
      'procedimento saudar(nome: caractere)',
      'var',
      '  msg: caractere',
      'inicio',
      '  msg <- "Olá, " + nome',
      '  escreva(msg)',
      'fimprocedimento',
      'inicio',
      '  saudar("Ana")',
      '  total <- 1',
      '  escreva(msg)',
      'fimalgoritmo',
    ].join('\n');
    const r = executar(fonte);
    expect(r.saida).toEqual(['Olá, Ana']);
    expect(r.erro?.mensagem).toMatch(/"msg" não foi declarada/);
  });

  it('recursão: fatorial, com a pilha crescendo', () => {
    const fonte = [
      'funcao fat(n: inteiro): inteiro',
      'inicio',
      '  se n <= 1 entao',
      '    retorne 1',
      '  fimse',
      '  retorne n * fat(n - 1)',
      'fimfuncao',
      'inicio',
      '  escreva(fat(5))',
      'fimalgoritmo',
    ].join('\n');
    const r = executar(fonte);
    expect(r.saida).toEqual(['120']);
    expect(Math.max(...r.passos.map((p) => p.pilha.length))).toBe(6);
  });

  it('recursão sem caso base é interrompida', () => {
    const fonte =
      'funcao f(n: inteiro): inteiro\ninicio\n  retorne f(n + 1)\nfimfuncao\ninicio\n  escreva(f(1))\nfimalgoritmo';
    expect(executar(fonte, [], 100000).erro?.mensagem).toMatch(/parece não ter caso base/);
  });

  it('erros didáticos de sub-rotinas', () => {
    const sem =
      'funcao f(): inteiro\ninicio\n  escreva(1)\nfimfuncao\ninicio\n  escreva(f())\nfimalgoritmo';
    expect(executar(sem).erro?.mensagem).toMatch(/terminou sem "retorne"/);
    const args =
      'funcao f(a: inteiro): inteiro\ninicio\n  retorne a\nfimfuncao\ninicio\n  escreva(f(1, 2))\nfimalgoritmo';
    expect(executar(args).erro?.mensagem).toBe('f espera 1 valor(es), mas recebeu 2.');
    const proc =
      'procedimento p()\ninicio\n  escreva(1)\nfimprocedimento\ninicio\n  x <- p()\nfimalgoritmo';
    expect(executar(proc).erro?.mensagem).toMatch(/é um procedimento e não devolve valor/);
  });
});
