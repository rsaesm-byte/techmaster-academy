import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const es03 = montar({
  id: 'engsoft.m01.a03',
  titulo: 'Testes automatizados',
  objetivo: 'Escrever testes que verificam o código sozinhos e entender TDD.',
  pre: ['engsoft.m01.a02'],
  min: 30,
  diag: mc(
    'Você muda uma função e ela passa a quebrar outra parte do sistema sem você perceber. O que teria avisado na hora?',
    'Testes automatizados',
    [
      ['Mais comentários no código', 'Comentários não detectam falhas.'],
      ['Reiniciar o computador', 'Não ajuda a achar o defeito.'],
    ],
    'Testes são a rede de segurança.',
  ),
  simples: {
    titulo: 'Rede de segurança',
    texto:
      'Um **teste automatizado** é um código que **chama o seu código** e compara o resultado com o **esperado**.\n\n```\nfunction soma(a, b) { return a + b; }\n\nconsole.assert(soma(2, 3) === 5, "soma(2,3) deve ser 5");\n```\n\nTipos principais (a **pirâmide de testes**):\n- **Unitário:** uma função isolada (muitos, rápidos).\n- **Integração:** partes trabalhando juntas.\n- **Ponta a ponta (E2E):** o usuário usando o sistema (poucos, lentos).\n\n**TDD** (desenvolvimento guiado por testes): 1) escreva um teste que falha (vermelho), 2) escreva o mínimo para passar (verde), 3) melhore o código (refatorar).',
    essencial:
      'Teste = código que verifica código. Muitos unitários, alguns de integração, poucos E2E. TDD: vermelho, verde, refatorar.',
    guiado:
      'Para testar uma função:\n1. Liste casos normais.\n2. Liste casos de borda (vazio, zero, negativo).\n3. Escreva um teste para cada.\n4. Rode e corrija até todos passarem.\n5. Rode de novo a cada mudança.',
    tecnico:
      'Ferramentas: Vitest e Jest (JavaScript), pytest (Python), JUnit (Java), Playwright (E2E). Um bom teste é **rápido, independente e determinístico**. **Mocks** substituem dependências (como a internet) por dublês. **Cobertura de código** mede quanto foi executado pelos testes, mas 100% não garante ausência de bugs. **Testes de regressão** garantem que um bug corrigido não volte. Testes instáveis (flaky) minam a confiança e devem ser corrigidos.',
  },
  analogia: {
    titulo: 'Cinto de segurança',
    texto:
      'Você não pensa nele enquanto dirige bem, mas no dia do imprevisto ele salva. Os testes custam tempo no começo e economizam muito mais depois, quando você mexe no código sem medo.',
    limites: 'Testes não provam que não há bugs: só verificam o que foi previsto.',
  },
  demo: {
    titulo: 'Um mini executor de testes',
    instrucoes:
      'Execute e veja quais testes passam. A função tem um erro de propósito. Corrija e execute de novo até todos ficarem verdes.',
    simulacao: {
      tipo: 'js',
      codigo:
        'function fizzbuzz(n) {\n  if (n % 3 === 0) return "Fizz";\n  if (n % 5 === 0) return "Buzz";\n  if (n % 15 === 0) return "FizzBuzz";\n  return String(n);\n}\nconst casos = [[3, "Fizz"], [5, "Buzz"], [15, "FizzBuzz"], [7, "7"]];\nfor (const [entrada, esperado] of casos) {\n  const obtido = fizzbuzz(entrada);\n  console.log(obtido === esperado ? "OK  " : "FALHOU", entrada, "->", obtido);\n}',
    },
  },
  tecnica: {
    titulo: 'Casos de borda',
    texto:
      'Sempre teste os limites:\n- lista **vazia** e com **um** elemento;\n- **zero** e **negativos**;\n- texto vazio;\n- o primeiro e o último valor aceito.\nA maioria dos bugs mora nas bordas.',
  },
  diagrama: {
    titulo: 'Ciclo do TDD',
    nos: [
      { forma: 'inicio', texto: 'Vermelho: escreve um teste que falha' },
      { forma: 'passo', texto: 'Verde: o mínimo de código para passar' },
      { forma: 'passo', texto: 'Refatorar: melhora sem quebrar os testes' },
      { forma: 'fim', texto: 'Repete com o próximo comportamento' },
    ],
    descricao: 'Os testes guiam o projeto.',
  },
  exemplo: {
    titulo: 'Teste com assert',
    codigo: {
      linguagem: 'javascript',
      fonte:
        'function maior(lista) {\n  return Math.max(...lista);\n}\nconsole.assert(maior([1, 9, 3]) === 9);\nconsole.assert(maior([5]) === 5);\nconsole.assert(maior([-2, -7]) === -2);',
    },
    comentarios: [
      { linha: 4, texto: 'Caso normal.' },
      { linha: 5, texto: 'Caso de borda: um elemento.' },
      { linha: 6, texto: 'Caso de borda: só negativos.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'function dobro(n) {\n  return n * 2;\n}\nconst casos = [[2, 4], [3, 7], [5, 10]];\nlet falhas = 0;\nfor (const [e, esp] of casos) {\n  if (dobro(e) !== esp) falhas++;\n}\nconsole.log(falhas);',
      ['1'],
      'Só o caso 3 → 7 falha, pois dobro(3) é 6.',
      [{ resposta: '0', feedback: 'Confira o caso do 3.' }],
    ),
    mc(
      'O que a pirâmide de testes recomenda?',
      'Muitos testes unitários e poucos E2E',
      [
        [
          'Só testes E2E, pois eles verificam o sistema inteiro de ponta a ponta',
          'E2E são lentos e frágeis em excesso.',
        ],
        [
          'Nenhum teste unitário, para economizar tempo de desenvolvimento',
          'Os unitários são a base da pirâmide.',
        ],
      ],
      'Base larga, topo estreito.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'function ehPar(n) {\n  return n % 2 === 0;\n}\nconst resultados = [0, 1, 2, 3].map(ehPar);\nconsole.log(resultados.filter(Boolean).length);',
      ['2'],
      '0 e 2 são pares: dois resultados verdadeiros.',
      [{ resposta: '4', feedback: 'Conte só os verdadeiros.' }],
    ),
    mc(
      'Qual é o primeiro passo do TDD?',
      'Escrever um teste que falha',
      [
        ['Escrever o código final', 'O código vem depois do teste.'],
        ['Apagar os testes antigos', 'Eles protegem contra regressões.'],
      ],
      'Vermelho, verde, refatorar.',
    ),
  ],
  desafio: programaJs(
    'Escreva fizzbuzz(n): devolva "FizzBuzz" se n for múltiplo de 3 e de 5, "Fizz" se múltiplo só de 3, "Buzz" se múltiplo só de 5, ou o número como texto nos outros casos.',
    'function fizzbuzz(n) {\n  // seu código aqui\n}',
    'function fizzbuzz(n) {\n  if (n % 15 === 0) return "FizzBuzz";\n  if (n % 3 === 0) return "Fizz";\n  if (n % 5 === 0) return "Buzz";\n  return String(n);\n}',
    'fizzbuzz',
    [
      { argumentos: [15], esperado: 'FizzBuzz' },
      { argumentos: [9], esperado: 'Fizz' },
      { argumentos: [10], esperado: 'Buzz' },
      { argumentos: [7], esperado: '7' },
    ],
    ['Teste primeiro o caso mais específico (múltiplo de 15).', 'A ordem dos if importa.'],
    'O caso mais específico precisa vir antes dos mais gerais.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Teste unitário', 'Verifica uma função isolada'],
        ['Teste E2E', 'Simula o usuário usando o sistema'],
        ['Mock', 'Dublê que substitui uma dependência'],
        ['Regressão', 'Bug antigo que volta após uma mudança'],
      ],
      'Vocabulário de testes.',
    ),
    completar(
      'Complete: a etapa do TDD em que o teste falha.',
      'No TDD, começamos pelo ___ (vermelho).',
      [{ aceitas: ['teste'], feedback: 'Primeiro o teste, depois o código.' }],
      'Daí vem o verde.',
    ),
  ],
  explique: {
    enunciado: 'Explique por que testes automatizados valem o esforço e o que são casos de borda.',
    modelo:
      'Testes automatizados verificam o código sempre que ele muda, evitando regressões e dando segurança para refatorar. Casos de borda são os limites das entradas (vazio, zero, negativos, primeiro e último valor), onde a maioria dos bugs aparece.',
    rubrica: ['Explicou o benefício dos testes', 'Definiu casos de borda', 'Deu exemplos de borda'],
  },
  resumo: [
    'Teste é código que verifica código.',
    'Pirâmide: muitos unitários, poucos E2E.',
    'TDD: vermelho, verde, refatorar.',
    'Teste as bordas.',
  ],
  cards: [
    ['O que é um teste unitário?', 'Verifica uma função isolada.'],
    ['O que é TDD?', 'Escrever o teste antes do código.'],
    ['O que é regressão?', 'Um bug antigo que volta.'],
    ['O que é um mock?', 'Dublê que substitui uma dependência.'],
  ],
  conexoes: {
    disciplinas: [
      'JavaScript: Vitest e Playwright testam este próprio projeto.',
      'Programação Orientada a Objetos: testar classes isoladamente.',
      'Qualidade: base da entrega contínua.',
    ],
    profissional: 'Equipes maduras só aceitam código novo se os testes passarem.',
  },
});
