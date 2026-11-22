import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const es05 = montar({
  id: 'engsoft.m01.a05',
  titulo: 'Qualidade, revisão e CI/CD',
  objetivo: 'Entender code review, refatoração e a esteira de integração e entrega contínuas.',
  pre: ['engsoft.m01.a04'],
  min: 30,
  diag: mc(
    'Antes de publicar, alguém precisa rodar os testes, montar o programa e enviar ao servidor. Fazer isso à mão toda vez traz que risco?',
    'Esquecer passos e errar, além de perder tempo',
    [
      ['Nenhum risco', 'Processos manuais repetidos costumam falhar.'],
      [
        'O programa deixa de funcionar para sempre',
        'O risco é de erro humano, não de dano permanente.',
      ],
    ],
    'Automatizar isso é o CI/CD.',
  ),
  simples: {
    titulo: 'A esteira de produção do software',
    texto:
      '**Qualidade** de software não é só "funciona": inclui **legibilidade, manutenção e segurança**.\n\nPráticas essenciais:\n- **Code review:** outra pessoa lê o código antes do merge, achando bugs e compartilhando conhecimento.\n- **Refatoração:** melhorar a estrutura **sem mudar o comportamento**, protegida pelos testes.\n- **Código limpo:** nomes claros, funções pequenas, sem duplicação.\n\n**CI/CD** automatiza o caminho até o usuário:\n- **CI (integração contínua):** a cada push, o sistema **compila e roda os testes**.\n- **CD (entrega/implantação contínua):** se tudo passa, **publica** automaticamente.\n\nSe uma etapa **falha**, a esteira **para** e avisa.',
    essencial:
      'Revisão e refatoração mantêm o código saudável. CI roda build e testes a cada push; CD publica. Falhou, parou.',
    guiado:
      'Para montar uma esteira simples:\n1. A cada push, instale as dependências.\n2. Rode o lint (estilo) e os testes.\n3. Gere o build.\n4. Se tudo passar na main, publique.\n5. Se algo falhar, bloqueie o merge.',
    tecnico:
      'Ferramentas comuns: GitHub Actions, GitLab CI, Jenkins. Uma **pipeline** é uma sequência de estágios (build → test → deploy). **Entrega contínua** deixa o deploy pronto mas manual; **implantação contínua** publica sozinho. **Dívida técnica** é o custo futuro de atalhos de hoje. Estratégias de publicação reduzem risco: **blue/green**, **canário** e **feature flags**. Métricas **DORA** medem a saúde da entrega: frequência de deploy, lead time, taxa de falha e tempo de recuperação.',
  },
  analogia: {
    titulo: 'Linha de montagem com inspeção',
    texto:
      'Em uma fábrica, cada peça passa por estações: montagem, inspeção e embalagem. Se a inspeção reprova, a peça não segue adiante. A esteira de CI/CD faz o mesmo com o código.',
    limites: 'Uma esteira rápida com testes fracos só entrega bugs mais depressa.',
  },
  demo: {
    titulo: 'Uma pipeline que para na falha',
    instrucoes:
      'Execute: a etapa de teste falha e o deploy nem começa. Mude "test" para true e veja a esteira completa.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const etapas = [\n  ["build", true],\n  ["test", false],\n  ["deploy", true],\n];\nfor (const [nome, passou] of etapas) {\n  console.log(nome, passou ? "OK" : "FALHOU");\n  if (!passou) {\n    console.log("Pipeline interrompida.");\n    break;\n  }\n}',
    },
  },
  tecnica: {
    titulo: 'Sinais de código que precisa de refatoração',
    texto:
      '**Funções gigantes** que fazem de tudo.\n**Código duplicado** em vários lugares.\n**Nomes enganosos** (a, x, dados2).\n**Muitos if aninhados.**\nRefatore em passos pequenos, rodando os testes a cada passo.',
  },
  diagrama: {
    titulo: 'Do commit ao ar',
    nos: [
      { forma: 'inicio', texto: 'Push no repositório' },
      { forma: 'passo', texto: 'CI: build e testes automáticos' },
      { forma: 'decisao', texto: 'Tudo passou?' },
      { forma: 'fim', texto: 'Sim: CD publica. Não: a esteira para e avisa' },
    ],
    descricao: 'Feedback rápido, publicação segura.',
  },
  exemplo: {
    titulo: 'Pipeline do GitHub Actions',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'name: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v7\n      - run: npm ci\n      - run: npm test\n      - run: npm run build',
    },
    comentarios: [
      { linha: 2, texto: 'Dispara a cada push.' },
      { linha: 9, texto: 'Se um passo falhar, os seguintes não rodam.' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const etapas = [["build", true], ["test", false], ["deploy", true]];\nconst rodou = [];\nfor (const [nome, ok] of etapas) {\n  rodou.push(nome);\n  if (!ok) break;\n}\nconsole.log(rodou.length);',
      ['2'],
      'Rodam build e test; o test falha e a esteira para antes do deploy.',
      [{ resposta: '3', feedback: 'O break interrompe após a falha.' }],
    ),
    mc(
      'O que é refatoração?',
      'Melhorar a estrutura do código sem mudar o comportamento',
      [
        [
          'Adicionar novas funcionalidades ao sistema de forma organizada',
          'Isso é desenvolvimento; refatorar não muda o comportamento.',
        ],
        [
          'Apagar os testes antigos para o código ficar mais simples',
          'Os testes é que protegem a refatoração.',
        ],
      ],
      'Mesmo comportamento, código melhor.',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const etapas = [["build", true], ["test", true]];\nconst todasOk = etapas.every(([, ok]) => ok);\nconsole.log(todasOk);',
      ['true'],
      'Todas as etapas passaram.',
      [{ resposta: 'false', feedback: 'Nenhuma etapa falhou.' }],
    ),
    mc(
      'Qual é a diferença entre CI e CD?',
      'CI integra e testa a cada mudança; CD publica automaticamente',
      [
        [
          'São dois nomes para o mesmo processo de publicar o código',
          'Têm focos diferentes: testar e publicar.',
        ],
        [
          'A CI publica o sistema e a CD faz os testes automatizados',
          'É o contrário: CI integra e testa; CD publica.',
        ],
      ],
      'Integração e entrega.',
    ),
  ],
  desafio: programaJs(
    'Escreva executarPipeline(etapas): cada etapa é [nome, passou]. Devolva a lista dos nomes das etapas executadas, parando logo depois da primeira que falhar (a que falhou entra na lista).',
    'function executarPipeline(etapas) {\n  // seu código aqui\n}',
    'function executarPipeline(etapas) {\n  const executadas = [];\n  for (const [nome, passou] of etapas) {\n    executadas.push(nome);\n    if (!passou) break;\n  }\n  return executadas;\n}',
    'executarPipeline',
    [
      {
        argumentos: [
          [
            ['build', true],
            ['test', false],
            ['deploy', true],
          ],
        ],
        esperado: ['build', 'test'],
      },
      { argumentos: [[]], esperado: [] },
      {
        argumentos: [
          [
            ['a', true],
            ['b', true],
          ],
        ],
        esperado: ['a', 'b'],
      },
    ],
    ['Registre o nome antes de verificar se passou.', 'Use break na primeira falha.'],
    'Falhou, parou: é o princípio do CI/CD.',
  ),
  rec: [
    associar(
      'Associe o termo ao significado.',
      [
        ['Code review', 'Outra pessoa lê o código antes do merge'],
        ['Refatoração', 'Melhora a estrutura sem mudar o comportamento'],
        ['CI', 'Build e testes automáticos a cada push'],
        ['Dívida técnica', 'Custo futuro de atalhos de hoje'],
      ],
      'Práticas de qualidade.',
    ),
    completar(
      'Complete: o que a esteira faz quando uma etapa falha.',
      'Se uma etapa falha, a pipeline ___.',
      [
        {
          aceitas: ['para', 'Para', 'é interrompida', 'interrompe'],
          feedback: 'A esteira para e avisa o time.',
        },
      ],
      'Assim o erro não chega ao usuário.',
    ),
  ],
  explique: {
    enunciado: 'Explique o que é CI/CD e como ele melhora a qualidade das entregas.',
    modelo:
      'CI (integração contínua) faz o build e roda os testes automaticamente a cada mudança, e CD (entrega ou implantação contínua) publica quando tudo passa. Isso dá feedback rápido, reduz erros manuais e impede que código quebrado chegue ao usuário, pois a esteira para ao falhar.',
    rubrica: [
      'Definiu CI e CD',
      'Descreveu a automação de build e testes',
      'Explicou o ganho de qualidade',
    ],
  },
  resumo: [
    'Review e refatoração mantêm o código saudável.',
    'CI: build e testes a cada push.',
    'CD: publica quando tudo passa.',
    'Falhou, a esteira para.',
  ],
  cards: [
    ['O que é CI?', 'Build e testes automáticos a cada push.'],
    ['O que é CD?', 'Entrega ou implantação automática.'],
    ['O que é dívida técnica?', 'Custo futuro de atalhos.'],
    ['Para que serve o code review?', 'Achar problemas e compartilhar conhecimento.'],
  ],
  conexoes: {
    disciplinas: [
      'Infraestrutura: servidores e containers que recebem o deploy.',
      'Cibersegurança: varredura de vulnerabilidades na pipeline.',
      'Web: este projeto publica no GitHub Pages por CD.',
    ],
    profissional: 'Equipes de alto desempenho publicam várias vezes por dia graças a CI/CD.',
  },
});
