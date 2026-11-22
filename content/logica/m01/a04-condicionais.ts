import type { AulaEntrada } from '@/domain/conteudo';

export const aula04: AulaEntrada = {
  id: 'logica.m01.a04',
  versao: 1,
  status: 'publicada',
  titulo: 'Condicionais: o programa toma decisões',
  objetivo:
    'Usar se/entao/senao e cadeias de senao se, prever qual bloco executa, escrever condições compostas com e/ou e perceber que a ordem dos testes muda o resultado.',
  preRequisitos: ['logica.m01.a03'],
  duracaoMin: 30,
  etapas: [
    {
      id: 'diag',
      tipo: 'diagnostico',
      titulo: 'Antes de começar: o que você já sabe?',
      questoes: [
        {
          id: 'diag.q1',
          tipo: 'multipla-escolha',
          enunciado:
            'Um caixa eletrônico só libera o saque se houver saldo. Que tipo de instrução faz isso?',
          alternativas: [
            { id: 'a', texto: 'Uma instrução condicional: se houver saldo, libera' },
            {
              id: 'b',
              texto: 'Uma atribuição, que guarda o valor do saque no saldo',
              feedback: 'A atribuição guarda valores, mas não escolhe entre caminhos.',
            },
            {
              id: 'c',
              texto: 'Uma repetição, que testa o saldo várias vezes',
              feedback:
                'Repetição faz algo várias vezes. Aqui é preciso escolher fazer ou não fazer.',
            },
          ],
          correta: 'a',
          explicacao:
            'Decidir entre caminhos conforme uma situação é o papel das estruturas condicionais.',
        },
      ],
    },
    {
      id: 'exp-simples',
      tipo: 'explicacao',
      nivel: 'simples',
      titulo: 'O programa escolhe um caminho',
      texto:
        'Até aqui, os algoritmos executavam todas as linhas, de cima para baixo. Com o **se**, o programa testa uma condição e escolhe o que executar.\n\n`se condição entao` ... `senao` ... `fimse`: se a condição for VERDADEIRA, roda o primeiro bloco; senão, roda o segundo.',
      porModo: {
        essencial:
          'O se testa uma condição. VERDADEIRA: roda o bloco do entao. FALSA: roda o bloco do senao (se existir). Só um dos dois executa.',
        guiado:
          'Pense na catraca do metrô.\n1. Ela faz uma pergunta: o bilhete é válido?\n2. Se sim, libera a passagem.\n3. Se não, mostra uma mensagem e continua travada.\nO se faz exatamente isso: avalia uma condição (VERDADEIRO ou FALSO) e escolhe um dos caminhos.',
        tecnico:
          'Uma estrutura condicional avalia uma expressão lógica e desvia o fluxo de controle: o bloco do entao executa quando a expressão é VERDADEIRA; o do senao, quando é FALSA. Em cadeias se / senao se, a avaliação para na primeira condição verdadeira.',
      },
    },
    {
      id: 'analogia',
      tipo: 'analogia',
      titulo: 'A catraca do metrô',
      texto:
        'A catraca testa uma condição — o bilhete é válido? Se sim, libera; senão, continua travada. Um se faz o mesmo com qualquer pergunta de VERDADEIRO ou FALSO.',
      limites:
        'A catraca só tem dois caminhos. Um programa pode encadear vários testes com senao se — e, nesse caso, só o PRIMEIRO teste verdadeiro executa.',
    },
    {
      id: 'demo-decisao',
      tipo: 'demo',
      titulo: 'Simule a decisão',
      instrucoes:
        'O programa lê uma idade e decide. Avance passo a passo: veja a condição ser testada e o caminho escolhido.\n\nDepois, troque a entrada para **20**, **16** e **10**. Em cada caso, quantas condições foram testadas?',
      simulacao: {
        tipo: 'visualizador',
        codigo:
          'leia(idade)\nse idade >= 18 entao\n  escreva("Vota e dirige")\nsenao se idade >= 16 entao\n  escreva("Pode votar")\nsenao\n  escreva("Ainda não vota")\nfimse',
        entradas: ['16'],
      },
    },
    {
      id: 'exp-tecnica',
      tipo: 'explicacao',
      nivel: 'tecnica',
      titulo: 'se, senao se e condições compostas',
      texto:
        '**Forma simples:** `se cond entao` ... `fimse`. Sem senao, quando a condição é falsa, nada acontece.\n\n**Com senao:** exatamente um dos dois blocos executa.\n\n**Cadeia:** `se A entao` ... `senao se B entao` ... `senao` ... `fimse`. Os testes são feitos de cima para baixo e o primeiro verdadeiro vence. Por isso a **ordem importa**: teste primeiro o caso mais restrito.\n\n**Condições compostas:** `idade >= 18 e temIngresso` exige as duas; `ehFeriado ou ehFimDeSemana` aceita qualquer uma. `nao` inverte.\n\n**Aninhamento:** um se pode ficar dentro de outro, mas cadeias de senao se costumam ser mais fáceis de ler.',
    },
    {
      id: 'diagrama',
      tipo: 'diagrama',
      titulo: 'Uma cadeia de decisões',
      nos: [
        { forma: 'inicio', texto: 'Ler a idade' },
        { forma: 'decisao', texto: 'idade >= 18? Se sim: escreve "Vota e dirige" e termina' },
        { forma: 'decisao', texto: 'idade >= 16? Se sim: escreve "Pode votar" e termina' },
        { forma: 'passo', texto: 'Nenhuma foi verdadeira: escreve "Ainda não vota"' },
        { forma: 'fim', texto: 'Fim' },
      ],
      descricao:
        'O programa lê a idade e pergunta se ela é maior ou igual a 18. Se sim, escreve "Vota e dirige" e termina. Se não, pergunta se é maior ou igual a 16; se sim, escreve "Pode votar". Se nenhuma condição for verdadeira, escreve "Ainda não vota".',
    },
    {
      id: 'exemplo',
      tipo: 'exemplo',
      titulo: 'Situação do aluno pela média',
      codigo: {
        linguagem: 'pseudocodigo',
        fonte:
          'leia(media)\nse media >= 7 entao\n  escreva("Aprovado")\nsenao se media >= 5 entao\n  escreva("Recuperação")\nsenao\n  escreva("Reprovado")\nfimse',
      },
      comentarios: [
        { linha: 2, texto: 'Primeiro o caso mais exigente: média 7 ou mais.' },
        {
          linha: 4,
          texto: 'Só chega aqui quem tem menos de 7. Então este teste significa "entre 5 e 7".',
        },
        { linha: 6, texto: 'senao sem condição: pega todos os casos que sobraram (menos de 5).' },
        { linha: 8, texto: 'Um único fimse fecha a cadeia toda.' },
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
          enunciado: 'O que este programa escreve na tela?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'idade <- 16\nse idade >= 18 entao\n  escreva("Vota e dirige")\nsenao se idade >= 16 entao\n  escreva("Pode votar")\nsenao\n  escreva("Ainda não vota")\nfimse',
          },
          respostasAceitas: ['Pode votar'],
          errosComuns: [
            {
              resposta: 'Vota e dirige',
              feedback: '16 >= 18 é falso, então o primeiro bloco é pulado.',
            },
            {
              resposta: 'Ainda não vota',
              feedback: 'Quase! 16 >= 16 é verdadeiro: o sinal >= inclui o igual.',
            },
          ],
          pistas: [
            'Teste as condições de cima para baixo, trocando idade por 16.',
            '16 >= 18 é falso. E 16 >= 16?',
          ],
          explicacao:
            'A primeira condição (16 >= 18) é falsa; a segunda (16 >= 16) é verdadeira, então só "Pode votar" é escrito.',
        },
        {
          id: 'ex-guiado.q2',
          tipo: 'completar-codigo',
          enunciado:
            'A pessoa só pode entrar no show se tiver 18 anos ou mais E tiver ingresso. Complete a condição.',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte: 'se idade ___ 18 ___ temIngresso entao\n  escreva("Pode entrar")\nfimse',
          },
          lacunas: [
            {
              aceitas: ['>='],
              feedback: '"18 anos ou mais" inclui quem tem exatamente 18: use >=.',
            },
            {
              aceitas: ['e'],
              feedback: 'As duas exigências precisam valer ao mesmo tempo: use "e".',
            },
          ],
          pistas: [
            '"18 ou mais": maior OU igual.',
            'Duas condições obrigatórias juntas: qual operador lógico?',
          ],
          explicacao:
            'se idade >= 18 e temIngresso entao: as duas condições precisam ser verdadeiras.',
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
          tipo: 'programa-portugol',
          enunciado:
            'Complete o programa: ele lê um número e deve escrever Positivo, Negativo ou Zero.',
          codigoInicial: 'leia(n)\n',
          solucao:
            'leia(n)\nse n > 0 entao\n  escreva("Positivo")\nsenao se n < 0 entao\n  escreva("Negativo")\nsenao\n  escreva("Zero")\nfimse',
          casos: [
            { entradas: ['5'], saidaEsperada: ['Positivo'] },
            { entradas: ['-3'], saidaEsperada: ['Negativo'] },
            { entradas: ['0'], saidaEsperada: ['Zero'] },
          ],
          pistas: [
            'São três casos: use se, senao se e senao.',
            'O zero não é positivo nem negativo: ele fica para o senao.',
          ],
          explicacao:
            'Uma cadeia com três ramos cobre todos os números: maior que zero, menor que zero e o que sobra (zero).',
        },
        {
          id: 'ex-indep.q2',
          tipo: 'identificar-erro',
          enunciado: 'Este programa nem chega a executar. Em qual linha está o erro?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'leia(temperatura)\nse temperatura > 30 entao\n  escreva("Calor")\nsenao\n  escreva("Agradável")\nsenao\n  escreva("Frio")\nfimse',
          },
          linhaErrada: 6,
          feedbackPorLinha: {
            '2': 'A condição está correta.',
            '4': 'Este primeiro senao está certo. O problema é o que vem depois.',
          },
          explicacao:
            'Só pode haver um senao, e ele é sempre o último. Para três faixas, a linha 4 deveria ser "senao se temperatura >= 18 entao" e a linha 6 ficaria como o senao final.',
        },
      ],
    },
    {
      id: 'desafio',
      tipo: 'exercicio',
      modo: 'desafio',
      titulo: 'Desafio: a ordem dos testes',
      questoes: [
        {
          id: 'desafio.q1',
          tipo: 'multipla-escolha',
          enunciado:
            'Com este código, um aluno com média 9 recebe a mensagem "Recuperação". Por quê?',
          codigo: {
            linguagem: 'pseudocodigo',
            fonte:
              'leia(media)\nse media >= 5 entao\n  escreva("Recuperação")\nsenao se media >= 7 entao\n  escreva("Aprovado")\nfimse',
          },
          alternativas: [
            {
              id: 'a',
              texto: 'O teste mais amplo (>= 5) vem primeiro e "captura" também quem tem 9',
            },
            {
              id: 'b',
              texto: 'O operador >= está errado e deveria ser apenas >',
              feedback:
                'Trocar por > não resolve: 9 > 5 continua verdadeiro e o primeiro bloco continua vencendo.',
            },
            {
              id: 'c',
              texto: 'Falta um senao no final para tratar quem tem média alta',
              feedback:
                'Um senao final trataria médias menores que 5, mas o aluno com 9 continuaria caindo no primeiro bloco.',
            },
          ],
          correta: 'a',
          pistas: ['Teste com 9: qual é a PRIMEIRA condição verdadeira?'],
          explicacao:
            'Em uma cadeia, o primeiro teste verdadeiro vence. Teste primeiro o caso mais restrito (>= 7) e depois o mais amplo (>= 5).',
        },
        {
          id: 'desafio.q2',
          tipo: 'programa-portugol',
          enunciado:
            'Escreva o programa completo: leia a média e escreva Aprovado (7 ou mais), Recuperação (de 5 até menos de 7) ou Reprovado (menos de 5).',
          codigoInicial: 'leia(media)\n',
          solucao:
            'leia(media)\nse media >= 7 entao\n  escreva("Aprovado")\nsenao se media >= 5 entao\n  escreva("Recuperação")\nsenao\n  escreva("Reprovado")\nfimse',
          casos: [
            { entradas: ['9'], saidaEsperada: ['Aprovado'] },
            { entradas: ['7'], saidaEsperada: ['Aprovado'] },
            { entradas: ['6.5'], saidaEsperada: ['Recuperação'] },
            { entradas: ['5'], saidaEsperada: ['Recuperação'] },
            { entradas: ['3'], saidaEsperada: ['Reprovado'] },
          ],
          pistas: [
            'Comece pelo caso mais exigente.',
            'Os casos de teste incluem os limites: 7 e 5 exatos.',
          ],
          explicacao:
            'A ordem 7 → 5 → senao garante que cada média caia em exatamente uma faixa, inclusive nos limites.',
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
          tipo: 'multipla-escolha',
          enunciado: 'Numa cadeia se / senao se / senao, quantos blocos podem executar?',
          alternativas: [
            { id: 'a', texto: 'No máximo um' },
            {
              id: 'b',
              texto: 'Todos os que tiverem condição verdadeira',
              feedback: 'Só o PRIMEIRO verdadeiro executa; os testes seguintes nem são feitos.',
            },
            {
              id: 'c',
              texto: 'Sempre dois: o do entao e o do senao',
              feedback: 'entao e senao são caminhos alternativos: um exclui o outro.',
            },
          ],
          correta: 'a',
          explicacao: 'Exatamente um, se houver senao; no máximo um, se não houver.',
        },
        {
          id: 'rec.q2',
          tipo: 'multipla-escolha',
          enunciado:
            'Desconto para quem é estudante OU tem mais de 60 anos. Qual condição está certa?',
          alternativas: [
            { id: 'a', texto: 'estudante ou idade > 60' },
            {
              id: 'b',
              texto: 'estudante e idade > 60',
              feedback: 'Com "e", só um estudante com mais de 60 anos ganharia o desconto.',
            },
            {
              id: 'c',
              texto: 'nao estudante ou idade > 60',
              feedback: '"nao estudante" daria desconto justamente a quem não é estudante.',
            },
          ],
          correta: 'a',
          explicacao: 'Basta uma das duas situações: é o operador "ou".',
        },
        {
          id: 'rec.explique',
          tipo: 'resposta-aberta',
          enunciado: 'Explique por que a ordem dos testes num se / senao se importa.',
          respostaModelo:
            'Numa cadeia, só o primeiro teste verdadeiro executa. Se um teste amplo (como media >= 5) vier antes de um mais restrito (media >= 7), ele captura também os casos do restrito, e o aluno com 9 recebe "Recuperação". Por isso testamos primeiro o caso mais restrito.',
          rubrica: [
            'Disse que só o primeiro teste verdadeiro executa',
            'Explicou que um teste amplo antes captura os casos de um mais restrito',
            'Deu um exemplo (como as médias)',
          ],
          explicacao: 'Explicar com as próprias palavras revela o que ainda não está claro.',
        },
      ],
    },
    {
      id: 'resumo',
      tipo: 'resumo',
      pontos: [
        'O se testa uma condição e escolhe o que executar.',
        'Numa cadeia se / senao se / senao, o primeiro teste verdadeiro vence — a ordem importa.',
        'Teste primeiro o caso mais restrito; deixe o senao para o que sobrar.',
        '"e" exige as duas condições; "ou" aceita qualquer uma; "nao" inverte.',
      ],
    },
    {
      id: 'flashcards',
      tipo: 'flashcards',
      cards: [
        {
          id: 'logica.m01.a04.fc1',
          frente: 'O que faz a estrutura se / senao?',
          verso:
            'Testa uma condição e executa um de dois blocos, conforme ela seja VERDADEIRA ou FALSA.',
        },
        {
          id: 'logica.m01.a04.fc2',
          frente: 'Numa cadeia de senao se, qual bloco executa?',
          verso: 'Só o da primeira condição verdadeira.',
        },
        {
          id: 'logica.m01.a04.fc3',
          frente: 'Por que a ordem dos testes importa?',
          verso:
            'Porque um teste amplo colocado antes "captura" casos que deveriam cair num teste mais restrito.',
        },
        {
          id: 'logica.m01.a04.fc4',
          frente: 'Diferença entre "e" e "ou" numa condição?',
          verso: '"e" exige as duas verdadeiras; "ou" basta uma.',
        },
      ],
    },
    {
      id: 'conexoes',
      tipo: 'conexoes',
      disciplinas: [
        'HTML, CSS e a Web: validação de formulário é uma sequência de condicionais (campo vazio? e-mail válido?).',
        'Cibersegurança: regras de firewall e de acesso são condições avaliadas em ordem — a primeira regra que combina vence.',
        'Engenharia de Software: critérios de aceitação ("se o usuário não tiver saldo, então...") viram condicionais no código.',
      ],
      aplicacaoProfissional:
        'Na triagem de chamados de TI: se a prioridade é crítica, aciona o plantão; senão, se é alta, entra no topo da fila; senão, segue a ordem normal. Errar a ordem desses testes manda um incidente grave para o fim da fila.',
    },
  ],
  criterioDominio: {
    questoes: ['ex-indep.q1', 'ex-indep.q2', 'desafio.q1', 'desafio.q2', 'rec.q1', 'rec.q2'],
    minPercentual: 80,
  },
};
