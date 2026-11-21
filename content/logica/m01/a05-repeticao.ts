import type { AulaEntrada } from '@/domain/conteudo';

export const aula05: AulaEntrada = {
  id: 'logica.m01.a05',
  versao: 1,
  status: 'publicada',
  titulo: 'Estruturas de repetição',
  objetivo:
    'Usar enquanto, para e repita, controlar repetições com contadores e acumuladores, prever quantas vezes um bloco executa e identificar laços que nunca terminam.',
  preRequisitos: ['logica.m01.a04'],
  duracaoMin: 35,
  etapas: [
    {
      id: 'diag',
      tipo: 'diagnostico',
      titulo: 'Antes de começar: o que você já sabe?',
      questoes: [
        {
          id: 'diag.q1',
          tipo: 'multipla-escolha',
          enunciado: 'Você precisa escrever os números de 1 a 1000. Qual é o melhor jeito?',
          alternativas: [
            { id: 'a', texto: 'Uma estrutura de repetição que escreve e soma 1 até chegar a 1000' },
            {
              id: 'b',
              texto: 'Mil linhas de escreva, uma para cada número',
              feedback:
                'Funciona, mas é enorme, cansativo e fácil de errar. Repetição resolve em 3 linhas.',
            },
            {
              id: 'c',
              texto: 'Uma condicional se',
              feedback: 'O se escolhe um caminho uma vez; não repete nada.',
            },
          ],
          correta: 'a',
          explicacao:
            'Estruturas de repetição executam o mesmo bloco várias vezes, mudando só o necessário a cada volta.',
        },
      ],
    },
    {
      id: 'exp-simples',
      tipo: 'explicacao',
      nivel: 'simples',
      titulo: 'Repetir sem reescrever',
      texto:
        'Uma **estrutura de repetição** (ou **laço**) executa o mesmo bloco várias vezes. Ela precisa de uma **condição de parada**: sem ela, o programa repetiria para sempre.\n\nCada execução do bloco se chama **iteração** — ou, informalmente, uma "volta" do laço.',
      porModo: {
        essencial:
          'Laço = bloco repetido. `enquanto` repete enquanto a condição for verdadeira. `para` conta de um valor até outro. `repita` executa e testa no fim. Algo dentro do laço precisa mudar, senão ele nunca termina.',
        guiado:
          'Pense em fazer 10 flexões contando em voz alta.\n1. Você começa no 1 (contador começa).\n2. Faz uma flexão (o bloco).\n3. Soma 1 à contagem (o contador muda).\n4. Pergunta: já passei de 10? Se não, repete.\nTodo laço tem essas peças: começo, bloco, mudança e condição de parada.',
        tecnico:
          'Estruturas de repetição executam um bloco enquanto uma condição se mantém. `enquanto` é pré-testada (pode executar zero vezes); `repita ... ate` é pós-testada (executa ao menos uma vez); `para` é controlada por contador, com início, fim e passo. A terminação depende de o corpo alterar o estado avaliado pela condição.',
      },
    },
    {
      id: 'analogia',
      tipo: 'analogia',
      titulo: 'Contar flexões',
      texto:
        'Fazer 10 flexões é um laço: você repete o mesmo movimento, contando, até a contagem chegar a 10. A contagem é o **contador** do laço.',
      limites:
        'Você para quando cansa; o programa só para quando a condição mandar. Se a contagem nunca mudar, ele repete para sempre — é o famoso laço infinito.',
    },
    {
      id: 'demo-contador',
      tipo: 'demo',
      titulo: 'Acompanhe as voltas do laço',
      instrucoes:
        'Avance passo a passo e observe: a condição é testada **antes de cada volta**, e o contador aumenta no fim do bloco.\n\nDepois, edite o código: mude o 3 para 5. Em seguida, apague a linha `contador <- contador + 1` e execute — o que acontece?',
      simulacao: {
        tipo: 'visualizador',
        codigo:
          'contador <- 1\nenquanto contador <= 3 faca\n  escreva("Volta ", contador)\n  contador <- contador + 1\nfimenquanto\nescreva("Fim")',
      },
    },
    {
      id: 'demo-desenho',
      tipo: 'demo',
      titulo: 'O laço que desenha',
      instrucoes:
        'Aqui o bloco do `para` desenha um ponto por volta, girando e se afastando do centro. Aumente o número de repetições para 10, 100 e 20 000 e observe o desenho surgir.\n\nDepois, mude só o giro. Repare: o bloco é o mesmo em todas as voltas — só o valor de `i` muda.',
      simulacao: { tipo: 'laco-grafico' },
    },
    {
      id: 'exp-tecnica',
      tipo: 'explicacao',
      nivel: 'tecnica',
      titulo: 'Os três laços e quando usar cada um',
      texto:
        '**enquanto cond faca ... fimenquanto:** testa ANTES de cada volta. Se a condição já começar falsa, o bloco não executa nenhuma vez. Use quando não se sabe quantas voltas serão.\n\n**para i de 1 ate 10 passo 1 faca ... fimpara:** o próprio laço cria, testa e atualiza o contador. Use quando o número de voltas é conhecido. `passo` pode ser 2, -1 etc.\n\n**repita ... ate cond:** executa o bloco e só depois testa. Roda **ao menos uma vez**. Atenção: ele PARA quando a condição fica verdadeira.\n\n**Contador:** variável que conta as voltas (`c <- c + 1`). **Acumulador:** variável que vai juntando valores (`soma <- soma + valor`), que precisa começar no valor neutro (0 para soma).\n\n**Laço infinito:** acontece quando nada dentro do bloco faz a condição de parada mudar.',
    },
    {
      id: 'diagrama',
      tipo: 'diagrama',
      titulo: 'O caminho de um enquanto',
      nos: [
        { forma: 'inicio', texto: 'contador <- 1' },
        { forma: 'decisao', texto: 'contador <= 3? Se não: sai do laço' },
        { forma: 'passo', texto: 'Executa o bloco: escreva(contador)' },
        { forma: 'passo', texto: 'contador <- contador + 1, e volta para a pergunta' },
        { forma: 'fim', texto: 'Depois do laço: segue o programa' },
      ],
      descricao:
        'O contador começa em 1. Antes de cada volta, o laço pergunta se contador é menor ou igual a 3. Se for, executa o bloco, escreve o contador, soma 1 e volta à pergunta. Quando a resposta é não, sai do laço e o programa continua.',
    },
    {
      id: 'exemplo',
      tipo: 'exemplo',
      titulo: 'Somar de 1 a 5 com um acumulador',
      codigo: {
        linguagem: 'pseudocodigo',
        fonte:
          'soma <- 0\npara i de 1 ate 5 faca\n  soma <- soma + i\nfimpara\nescreva("Soma: ", soma)',
      },
      comentarios: [
        { linha: 1, texto: 'O acumulador começa em 0, o valor neutro da soma.' },
        { linha: 2, texto: 'O para cria i, faz i valer 1, 2, 3, 4 e 5, e para depois do 5.' },
        {
          linha: 3,
          texto: 'A cada volta, soma recebe o que já tinha mais o i atual: 1, 3, 6, 10, 15.',
        },
        { linha: 5, texto: 'Fora do laço: escreve uma vez só, com o total 15.' },
      ],
    },
    {
      id: 'ex-guiado',
      tipo: 'exercicio',
      modo: 'guiado',
      titulo: 'Exercício guiado',
      questoes: [
        {
          id: 'ex-guiado.q1',
          tipo: 'prever-saida',
          enunciado: 'Quais números aparecem na tela? Escreva-os separados por espaço.',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte: 'para i de 1 ate 7 passo 3 faca\n  escreva(i)\nfimpara',
          },
          respostasAceitas: ['1 4 7', '1, 4, 7', '1,4,7'],
          errosComuns: [
            { resposta: '1 2 3 4 5 6 7', feedback: 'O passo é 3: o i pula de 3 em 3.' },
            {
              resposta: '1 4',
              feedback: 'O "ate 7" inclui o 7: quando i vale 7, o bloco ainda executa.',
            },
            { resposta: '3 6', feedback: 'O i começa no valor do "de": 1.' },
          ],
          pistas: [
            'Comece com i = 1 e some o passo a cada volta.',
            'O laço executa enquanto i for menor ou igual a 7.',
          ],
          explicacao: 'i vale 1, 4 e 7. O próximo seria 10, que passa de 7, então o laço termina.',
        },
        {
          id: 'ex-guiado.q2',
          tipo: 'completar-codigo',
          enunciado: 'Complete o acumulador que soma os números de 1 a 10.',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'soma <- ___\npara i de 1 ate 10 faca\n  soma <- soma ___ i\nfimpara\nescreva(soma)',
          },
          lacunas: [
            { aceitas: ['0'], feedback: 'Um acumulador de soma começa no valor neutro da soma.' },
            { aceitas: ['+'], feedback: 'A cada volta, junte o i ao que já foi somado.' },
          ],
          pistas: ['Qual número não muda uma soma?'],
          explicacao: 'soma começa em 0 e recebe soma + i a cada volta. O resultado é 55.',
        },
      ],
    },
    {
      id: 'ex-indep',
      tipo: 'exercicio',
      modo: 'independente',
      titulo: 'Agora é com você',
      questoes: [
        {
          id: 'ex-indep.q1',
          tipo: 'identificar-erro',
          enunciado: 'Esta contagem regressiva nunca termina. Qual linha causa o problema?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'contador <- 10\nenquanto contador > 0 faca\n  escreva(contador)\n  contador <- contador + 1\nfimenquanto',
          },
          linhaErrada: 4,
          feedbackPorLinha: {
            '1': 'Começar em 10 está certo para uma contagem regressiva.',
            '2': 'A condição está certa: queremos parar ao chegar em 0.',
          },
          pistas: ['O contador está se aproximando ou se afastando do 0?'],
          explicacao:
            'Para a condição contador > 0 ficar falsa, o contador precisa DIMINUIR: contador <- contador - 1.',
        },
        {
          id: 'ex-indep.q2',
          tipo: 'programa-portugol',
          enunciado:
            'Complete o programa: ele lê um número N e deve escrever os números de 1 até N, um por linha.',
          codigoInicial: 'leia(n)\n',
          solucao: 'leia(n)\npara i de 1 ate n faca\n  escreva(i)\nfimpara',
          casos: [
            { entradas: ['3'], saidaEsperada: ['1', '2', '3'] },
            { entradas: ['1'], saidaEsperada: ['1'] },
            { entradas: ['0'], saidaEsperada: [] },
          ],
          pistas: [
            'O número de voltas é conhecido: use para.',
            'O fim do para pode ser uma variável: ate n.',
          ],
          explicacao:
            'para i de 1 ate n faca escreva(i). Com N = 0 o bloco não executa nenhuma vez.',
        },
      ],
    },
    {
      id: 'desafio',
      tipo: 'exercicio',
      modo: 'desafio',
      titulo: 'Desafio: soma até N',
      questoes: [
        {
          id: 'desafio.q1',
          tipo: 'programa-portugol',
          enunciado:
            'Escreva um programa que lê N e escreve a soma de todos os números de 1 até N (com N = 5, escreve 15).',
          codigoInicial: 'leia(n)\n',
          solucao:
            'leia(n)\nsoma <- 0\npara i de 1 ate n faca\n  soma <- soma + i\nfimpara\nescreva(soma)',
          casos: [
            { entradas: ['5'], saidaEsperada: ['15'] },
            { entradas: ['1'], saidaEsperada: ['1'] },
            { entradas: ['10'], saidaEsperada: ['55'] },
          ],
          pistas: [
            'Você vai precisar de um acumulador.',
            'Escreva o resultado depois do fimpara, não dentro do laço.',
          ],
          explicacao:
            'Acumulador começando em 0, somando i a cada volta, e um escreva fora do laço.',
        },
      ],
    },
    {
      id: 'recuperacao',
      tipo: 'recuperacao',
      titulo: 'Sem olhar para cima: responda de memória',
      questoes: [
        {
          id: 'rec.q1',
          tipo: 'associacao',
          enunciado: 'Associe cada conceito à sua descrição.',
          pares: [
            {
              id: 'enquanto',
              esquerda: 'enquanto',
              direita: 'Testa a condição antes de cada volta',
            },
            {
              id: 'para',
              esquerda: 'para',
              direita: 'Conta automaticamente de um valor até outro',
            },
            {
              id: 'repita',
              esquerda: 'repita ... ate',
              direita: 'Executa ao menos uma vez e testa no final',
            },
            {
              id: 'acumulador',
              esquerda: 'Acumulador',
              direita: 'Variável que vai juntando valores a cada volta',
            },
          ],
          explicacao: 'enquanto pré-testa; para conta; repita pós-testa; acumulador junta valores.',
        },
        {
          id: 'rec.q2',
          tipo: 'multipla-escolha',
          enunciado: 'Por que um laço pode nunca terminar?',
          alternativas: [
            { id: 'a', texto: 'Porque nada dentro dele muda a condição de parada' },
            {
              id: 'b',
              texto: 'Porque o computador fica lento',
              feedback:
                'Lentidão não impede o fim. O problema é lógico: a condição nunca fica falsa.',
            },
            {
              id: 'c',
              texto: 'Porque usou para em vez de enquanto',
              feedback:
                'Os dois terminam quando bem escritos — e os dois podem travar se mal escritos.',
            },
          ],
          correta: 'a',
          explicacao:
            'Se a condição depende de uma variável que nunca muda, a resposta será sempre a mesma: o laço repete para sempre.',
        },
        {
          id: 'rec.explique',
          tipo: 'resposta-aberta',
          enunciado: 'Explique o que é um laço infinito e como evitá-lo.',
          respostaModelo:
            'É um laço cuja condição de parada nunca é atingida, então ele repete para sempre. Acontece quando nada dentro do laço muda a variável usada na condição. Para evitar, garanta que o bloco altere essa variável na direção certa, como contador <- contador + 1 num enquanto contador <= 10.',
          rubrica: [
            'Disse que a condição de parada nunca é atingida',
            'Explicou que algo dentro do laço precisa mudar a condição',
            'Deu um exemplo de correção (como atualizar o contador)',
          ],
          explicacao: 'Explicar com as próprias palavras revela o que ainda não está claro.',
        },
      ],
    },
    {
      id: 'resumo',
      tipo: 'resumo',
      pontos: [
        'Laços repetem um bloco; cada repetição é uma iteração.',
        'enquanto testa antes (pode rodar zero vezes); repita testa depois (roda ao menos uma); para conta sozinho.',
        'Contador conta as voltas; acumulador junta valores e começa no valor neutro (0 para soma).',
        'Algo dentro do laço precisa mudar a condição de parada — senão, laço infinito.',
      ],
    },
    {
      id: 'flashcards',
      tipo: 'flashcards',
      cards: [
        {
          id: 'logica.m01.a05.fc1',
          frente: 'Qual laço executa ao menos uma vez?',
          verso: 'repita ... ate, porque testa a condição só no final.',
        },
        {
          id: 'logica.m01.a05.fc2',
          frente: 'O que é um acumulador?',
          verso: 'Uma variável que junta valores a cada volta, como soma <- soma + i.',
        },
        {
          id: 'logica.m01.a05.fc3',
          frente: 'Quando usar para em vez de enquanto?',
          verso: 'Quando o número de voltas é conhecido antes de começar.',
        },
        {
          id: 'logica.m01.a05.fc4',
          frente: 'O que causa um laço infinito?',
          verso: 'Nada dentro do laço muda a condição de parada.',
        },
      ],
    },
    {
      id: 'conexoes',
      tipo: 'conexoes',
      disciplinas: [
        'Banco de Dados: percorrer os resultados de uma consulta é um laço sobre as linhas.',
        'Infraestrutura: scripts de manutenção repetem a mesma ação em várias máquinas.',
        'Inteligência Artificial: treinar um modelo é repetir o ajuste milhares de vezes (as "épocas").',
      ],
      aplicacaoProfissional:
        'No suporte de TI, um script que verifica 200 computadores — "para cada máquina da lista: testar a conexão e registrar" — é um laço. Um laço infinito num script desses pode travar um servidor; por isso todo laço precisa de uma condição de parada garantida.',
    },
  ],
  criterioDominio: {
    questoes: ['ex-indep.q1', 'ex-indep.q2', 'desafio.q1', 'rec.q1', 'rec.q2'],
    minPercentual: 80,
  },
};
