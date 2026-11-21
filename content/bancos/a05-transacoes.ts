import {
  associar,
  completar,
  mc,
  montar,
  ordenar,
  prever,
  programaJs,
} from '../fundamentos/montar';

export const b05 = montar({
  id: 'bancos.m01.a05',
  titulo: 'Transações e ACID',
  objetivo:
    'Entender transações, COMMIT e ROLLBACK e as propriedades ACID que mantêm o banco consistente.',
  pre: ['bancos.m01.a04'],
  min: 30,
  diag: mc(
    'Numa transferência de R$ 100 da conta A para a conta B, o que NÃO pode acontecer?',
    'Debitar de A e a operação falhar antes de creditar em B',
    [
      ['Os dois valores mudarem', 'É exatamente o esperado.'],
      ['A transferência levar um segundo', 'O tempo não é o problema.'],
    ],
    'Ou as duas partes acontecem, ou nenhuma: é a ideia da transação.',
  ),
  simples: {
    titulo: 'Tudo ou nada',
    texto:
      'Uma **transação** agrupa vários comandos em **uma unidade indivisível**:\n\n```\nBEGIN;\nUPDATE contas SET saldo = saldo - 100 WHERE id = 1;\nUPDATE contas SET saldo = saldo + 100 WHERE id = 2;\nCOMMIT;\n```\n\n- **COMMIT:** confirma tudo.\n- **ROLLBACK:** desfaz tudo (se algo falhar no meio).\n\nOs bancos confiáveis seguem o **ACID**:\n- **A**tomicidade: tudo ou nada.\n- **C**onsistência: as regras (chaves, CHECK) valem antes e depois.\n- **I**solamento: transações simultâneas não se atrapalham.\n- **D**urabilidade: depois do COMMIT, o dado sobrevive a quedas de energia.',
    essencial:
      'Transação = tudo ou nada (COMMIT ou ROLLBACK). ACID: atomicidade, consistência, isolamento e durabilidade.',
    guiado:
      'Para uma operação com várias etapas:\n1. `BEGIN` abre a transação.\n2. Execute os comandos.\n3. Se deu tudo certo, `COMMIT`.\n4. Se houve erro, `ROLLBACK`.\n5. Nunca deixe a transação aberta por muito tempo.',
    tecnico:
      'O **isolamento** tem níveis (READ COMMITTED, REPEATABLE READ, SERIALIZABLE) que trocam rigor por desempenho; níveis fracos permitem anomalias como **leitura suja** ou **leitura não repetível**. Os bancos usam **bloqueios** (locks) ou **MVCC** (várias versões da linha) para isolar. Dois processos que esperam um pelo outro causam um **deadlock**, e o banco aborta um deles. A durabilidade vem do **log de transações** (WAL): grava-se no log antes de confirmar. Bancos NoSQL às vezes relaxam o ACID em favor da escala (consistência eventual).',
  },
  analogia: {
    titulo: 'Caixa eletrônico',
    texto:
      'Ao sacar, o caixa entrega o dinheiro e debita o saldo. Se a máquina falhasse depois de entregar as notas e antes de debitar, o banco perderia dinheiro; se debitasse e não entregasse, você perderia. A transação garante que as duas ações aconteçam juntas ou nenhuma.',
    limites: 'Transações têm custo: bloqueios e o log deixam o sistema um pouco mais lento.',
  },
  demo: {
    titulo: 'Transferência com ROLLBACK',
    instrucoes:
      'Execute: a segunda transferência falha por saldo insuficiente e o estado volta ao anterior. Mude os valores e veja o COMMIT acontecer.',
    simulacao: {
      tipo: 'js',
      codigo:
        'let contas = { A: 200, B: 50 };\nfunction transferir(de, para, valor) {\n  const copia = { ...contas };\n  try {\n    copia[de] -= valor;\n    if (copia[de] < 0) throw new Error("saldo insuficiente");\n    copia[para] += valor;\n    contas = copia;\n    console.log("COMMIT:", JSON.stringify(contas));\n  } catch (e) {\n    console.log("ROLLBACK (" + e.message + "):", JSON.stringify(contas));\n  }\n}\ntransferir("A", "B", 100);\ntransferir("A", "B", 500);',
    },
  },
  tecnica: {
    titulo: 'Problemas de concorrência',
    texto:
      '**Leitura suja:** ler um dado que outra transação ainda não confirmou.\n**Leitura não repetível:** o mesmo dado muda entre duas leituras.\n**Atualização perdida:** duas transações sobrescrevem uma à outra.\n**Deadlock:** duas transações esperam uma pela outra para sempre.\nOs níveis de isolamento definem quais desses problemas são permitidos.',
  },
  diagrama: {
    titulo: 'Ciclo de uma transação',
    nos: [
      { forma: 'inicio', texto: 'BEGIN: abre a transação' },
      { forma: 'passo', texto: 'Executa os comandos (ainda provisórios)' },
      { forma: 'decisao', texto: 'Tudo deu certo?' },
      { forma: 'fim', texto: 'Sim: COMMIT (permanente). Não: ROLLBACK (desfaz tudo)' },
    ],
    descricao: 'Até o COMMIT, nada é definitivo.',
  },
  exemplo: {
    titulo: 'Compra com estoque',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'BEGIN;\nINSERT INTO pedidos ...;\nUPDATE produtos SET estoque = estoque - 1 WHERE id = 7;\nCOMMIT;',
    },
    comentarios: [
      { linha: 2, texto: 'O pedido só existe se o estoque também for baixado.' },
      { linha: 4, texto: 'Se o UPDATE falhar, um ROLLBACK desfaz o INSERT.' },
    ],
  },
  guiado: [
    prever(
      'Qual o saldo final de A após esta transação confirmada?',
      'let a = 200;\na -= 100;\nconsole.log(a);',
      ['100'],
      'O débito de 100 foi confirmado: 200 − 100.',
      [
        {
          resposta: '200',
          feedback: 'Com COMMIT, o débito vale; sem ele (ROLLBACK), o saldo ficaria em 200.',
        },
      ],
    ),
    mc(
      'O que significa a atomicidade em ACID?',
      'A transação acontece por inteiro ou não acontece',
      [
        ['Os dados ficam criptografados', 'Atomicidade não trata de criptografia.'],
        ['As consultas ficam mais rápidas', 'Ela trata de correção, e não de velocidade.'],
      ],
      'Tudo ou nada.',
    ),
  ],
  indep: [
    mc(
      'Qual propriedade garante que, depois do COMMIT, os dados sobrevivam a uma queda de energia?',
      'Durabilidade',
      [
        ['Isolamento', 'Isolamento separa transações simultâneas.'],
        ['Consistência', 'Consistência garante a validade das regras.'],
      ],
      'O log de transações garante a durabilidade.',
    ),
    completar(
      'Complete o comando que desfaz tudo o que a transação fez.',
      '___;',
      [{ aceitas: ['ROLLBACK', 'rollback'], feedback: 'ROLLBACK desfaz as alterações pendentes.' }],
      'COMMIT confirma; ROLLBACK desfaz.',
    ),
  ],
  desafio: programaJs(
    'Escreva transferir(contas, de, para, valor): devolve um NOVO objeto de contas com a transferência feita; se o saldo de "de" ficar negativo, devolva as contas originais sem alteração (um ROLLBACK). Não modifique o objeto recebido.',
    'function transferir(contas, de, para, valor) {\n  // seu código aqui\n}',
    'function transferir(contas, de, para, valor) {\n  const novas = { ...contas };\n  novas[de] -= valor;\n  if (novas[de] < 0) return contas;\n  novas[para] += valor;\n  return novas;\n}',
    'transferir',
    [
      { argumentos: [{ A: 200, B: 50 }, 'A', 'B', 100], esperado: { A: 100, B: 150 } },
      { argumentos: [{ A: 200, B: 50 }, 'A', 'B', 500], esperado: { A: 200, B: 50 } },
      { argumentos: [{ A: 10, B: 0 }, 'A', 'B', 10], esperado: { A: 0, B: 10 } },
    ],
    [
      'Trabalhe numa cópia: { ...contas }.',
      'Se o saldo ficar negativo, devolva o objeto original.',
    ],
    'Trabalhar numa cópia e só "confirmar" no fim é a essência do COMMIT e do ROLLBACK.',
  ),
  rec: [
    associar(
      'Associe a letra do ACID ao seu significado.',
      [
        ['Atomicidade', 'Tudo ou nada'],
        ['Consistência', 'As regras do banco são respeitadas'],
        ['Isolamento', 'Transações simultâneas não se atrapalham'],
        ['Durabilidade', 'Dados confirmados sobrevivem a falhas'],
      ],
      'As quatro garantias das transações.',
    ),
    ordenar(
      'Ordene o ciclo de uma transação bem-sucedida.',
      ['BEGIN', 'Executar os comandos', 'Verificar que tudo deu certo', 'COMMIT'],
      'Só no COMMIT as mudanças se tornam permanentes.',
    ),
  ],
  explique: {
    enunciado: 'Explique o que é uma transação e por que o ACID importa em um sistema bancário.',
    modelo:
      'Uma transação agrupa comandos em uma unidade que acontece por inteiro (COMMIT) ou não acontece (ROLLBACK). O ACID garante atomicidade, consistência, isolamento e durabilidade, o que evita, por exemplo, debitar uma conta sem creditar a outra e preserva os dados após falhas.',
    rubrica: [
      'Definiu transação com COMMIT e ROLLBACK',
      'Citou as quatro propriedades do ACID',
      'Deu um exemplo como a transferência bancária',
    ],
  },
  resumo: [
    'Transação: tudo ou nada.',
    'COMMIT confirma; ROLLBACK desfaz.',
    'ACID: atomicidade, consistência, isolamento, durabilidade.',
    'Isolamento evita anomalias de concorrência.',
  ],
  cards: [
    ['O que é ACID?', 'Atomicidade, consistência, isolamento, durabilidade.'],
    ['O que faz o ROLLBACK?', 'Desfaz a transação.'],
    ['O que é um deadlock?', 'Duas transações esperando uma pela outra.'],
    ['Quem garante a durabilidade?', 'O log de transações (WAL).'],
  ],
  conexoes: {
    disciplinas: [
      'SQL: BEGIN, COMMIT e ROLLBACK usam os comandos que você já conhece.',
      'Arquitetura: sistemas distribuídos relaxam o ACID (consistência eventual).',
      'Cibersegurança: integridade e disponibilidade dependem de transações bem feitas.',
    ],
    profissional:
      'Pagamentos, estoques e reservas só são confiáveis porque os bancos oferecem transações ACID.',
  },
});
