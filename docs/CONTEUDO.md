# Como escrever uma aula

Guia para autores de conteúdo. As aulas são **dados em TypeScript** dentro de
`content/`, validados automaticamente: se faltar algo, `npm run validate:content`
diz exatamente o quê e em qual aula.

Use uma aula pronta como modelo — por exemplo
`content/logica/m02/a01-vetores.ts`.

## 1. Onde fica cada coisa

```
content/
  index.ts                     registro: importe a aula e coloque em `aulas`
  glossario.ts                 termos (com as aulas onde aparecem)
  logica/
    disciplina.ts              módulos e a ordem das aulas
    m02/a01-vetores.ts         uma aula por arquivo
```

Passo a passo para publicar uma aula nova:

1. Crie o arquivo em `content/<disciplina>/<módulo>/`.
2. Importe e adicione em `aulas` no `content/index.ts`.
3. Coloque o id da aula no módulo, em `content/<disciplina>/disciplina.ts`.
4. Acrescente os termos novos ao glossário.
5. Rode `npm run validate:content` e depois `npm run check`.

## 2. Identificadores

- Aula: `<disciplina>.<módulo>.<aula>`, como `logica.m02.a03`.
- Etapas e questões: ids curtos e únicos dentro da aula (`diag`, `ex-guiado.q1`).
- Flashcards: ids **globais**, como `logica.m02.a03.fc1` (eles vão para a revisão).
- Depois de publicada, **não troque ids**: o progresso dos alunos aponta para eles.
  Para corrigir uma aula, aumente `versao`.

## 3. As etapas obrigatórias

Uma aula com `status: 'publicada'` precisa ter todas estas etapas (a validação
confere). A ordem recomendada é esta:

| Etapa                  | `tipo`                            | Dica                                                      |
| ---------------------- | --------------------------------- | --------------------------------------------------------- |
| Diagnóstico            | `diagnostico`                     | 1 a 2 questões; acertar libera pular a explicação simples |
| Explicação simples     | `explicacao`, `nivel: simples`    | Preencha `porModo` (essencial, guiado, técnico)           |
| Analogia               | `analogia`                        | Sempre com `limites`: onde a analogia falha               |
| Demonstração           | `demo`                            | Uma simulação (ver seção 5)                               |
| Explicação técnica     | `explicacao`, `nivel: tecnica`    | O vocabulário correto                                     |
| Diagrama               | `diagrama`                        | `nos` + `descricao` em texto (para leitores de tela)      |
| Exemplo comentado      | `exemplo`                         | `comentarios` por número de linha                         |
| Exercício guiado       | `exercicio`, `modo: guiado`       | Com `pistas` e `errosComuns`                              |
| Exercício independente | `exercicio`, `modo: independente` | Menos ajuda                                               |
| Desafio                | `exercicio`, `modo: desafio`      | Um problema de verdade                                    |
| Recuperação ativa      | `recuperacao`                     | Responder de memória; inclua uma `resposta-aberta`        |
| Resumo                 | `resumo`                          | 3 a 5 pontos                                              |
| Flashcards             | `flashcards`                      | 3 ou mais                                                 |
| Conexões               | `conexoes`                        | Outras disciplinas + `aplicacaoProfissional`              |

E um `criterioDominio`: ids de pelo menos 5 questões avaliáveis e o percentual
mínimo (usamos 80). Questões `resposta-aberta` não podem entrar no critério.

## 4. Tipos de questão

| `tipo`              | Campos principais                                          |
| ------------------- | ---------------------------------------------------------- |
| `multipla-escolha`  | `alternativas` (cada errada com `feedback`), `correta`     |
| `prever-saida`      | `codigo`, `respostasAceitas`, `errosComuns`                |
| `ordenacao`         | `itens` na ordem certa (a tela embaralha)                  |
| `associacao`        | `pares` com `esquerda` e `direita`                         |
| `completar-codigo`  | `codigo` com `___` em cada lacuna, `lacunas` com `aceitas` |
| `identificar-erro`  | `codigo`, `linhaErrada`, `feedbackPorLinha`                |
| `programa-portugol` | `codigoInicial`, `solucao`, `casos` (entradas e saída)     |
| `programa-js`       | `funcao`, `codigoInicial`, `solucao`, `casos`              |
| `consulta-sql`      | `codigoInicial`, `solucao`, `ordenada`                     |

| `resposta-aberta` | `respostaModelo`, `rubrica` (o aluno se autoavalia) |

Toda questão tem `enunciado` e `explicacao`; `pistas` é opcional.

**A solução de referência é testada:** o CI roda cada `solucao` contra os
próprios `casos`. Se ela não passar, o build falha — assim nenhum aluno recebe
um exercício impossível.

## 5. Simulações (`demo`)

| `simulacao.tipo` | O que mostra                                                                     |
| ---------------- | -------------------------------------------------------------------------------- |
| `visualizador`   | Portugol passo a passo: gavetas, vetores, pilha de chamadas                      |
| `robo`           | Programar um robô com blocos                                                     |
| `expressao`      | Avaliação de expressões, operador por operador                                   |
| `laco-grafico`   | Um laço desenhando em WebGL                                                      |
| `ordenacao`      | Barras animadas: `algoritmo` (bolha, selecao, insercao, linear, binaria), `fixo` |

Todo programa de `visualizador` também é executado no CI e precisa rodar sem erro.

## 6. Portugol suportado

```
funcao dobro(x: inteiro): inteiro
inicio
  retorne x * 2
fimfuncao

var
  v: vetor[1..5] de inteiro
  i: inteiro
inicio
  para i de 1 ate 5 faca
    leia(v[i])
    escreva(dobro(v[i]))
  fimpara
fimalgoritmo
```

- Tipos: `inteiro`, `real`, `caractere`, `logico`; vetores `vetor[1..n] de tipo`.
- Comandos: `<-`, `leia`, `escreva`, `se/senao/fimse`, `enquanto`, `para ... passo`,
  `repita ... ate`, `funcao`, `procedimento`, `retorne`.
- Operadores: `+ - * /`, `\` (divisão inteira), `%`, relacionais, `e`, `ou`, `nao`.
- Funções prontas: `abs`, `int`, `raizq`, `quad`, `compr`.
- Programas curtos podem dispensar `var`/`inicio` (sem cabeçalho).
- Parâmetros são por valor e não podem ser vetores.

## 7. Estilo de escrita

- Português do Brasil, frases curtas, voz ativa, "você".
- Um conceito por vez; analogia antes do termo técnico.
- Use `**negrito**` e `` `código` `` (é o único formato aceito no texto).
- Exemplos ligados a situações reais de TI.
- Feedback de erro explica **por que** está errado, sem culpar o aluno.

## Simulações disponíveis na etapa `demo`

| `tipo`                              | Para que serve                       | Opções                                      |
| ----------------------------------- | ------------------------------------ | ------------------------------------------- |
| `visualizador`                      | Executa Portugol passo a passo       | `codigo`, `entradas`                        |
| `robo`, `laco-grafico`, `expressao` | Lógica visual                        | —                                           |
| `ordenacao`                         | Ordenação e busca                    | `algoritmo`                                 |
| `binario`                           | Bits, soma e texto em bytes          | `modo`: bits, soma ou texto; `bits`: 4 ou 8 |
| `portas`                            | Portas lógicas e somadores           | `modo`, `porta`, `fixo`                     |
| `cpu`                               | CPU didática com assembly            | `programa`, `memoria`, `editavel`           |
| `terminal`                          | Terminal simulado com missões        | `cenario`: livre, navegar ou arquivos       |
| `sql`                               | Banco de treino (clientes e pedidos) | `consulta` (inicial, editável)              |
| `js`                                | Console de JavaScript                | `codigo` (programa inicial, editável)       |

As aulas de `content/fundamentos/` usam `montar()` e os ajudantes `mc`, `prever`,
`associar`, `ordenar` e `completar`, que geram os ids e o critério de domínio.

## Motor de SQL e correção de consultas

O motor (`src/engines/computacao/sql.ts`) trabalha sobre o banco de treino
(`clientes` e `pedidos`) e aceita: SELECT (DISTINCT, apelidos com AS, COUNT, SUM,
AVG, MIN, MAX), [LEFT] JOIN, WHERE (AND, OR, comparações, LIKE, IN, IS [NOT] NULL),
GROUP BY (uma coluna), HAVING, ORDER BY, LIMIT, INSERT, UPDATE e DELETE. A chave
primária `id` não pode repetir nem ficar vazia.

- Questões `consulta-sql` com solução SELECT comparam colunas e linhas do
  resultado (a ordem só conta se `ordenada` for verdadeira).
- Se a solução começa com INSERT, UPDATE ou DELETE, a correção compara o **estado
  final das tabelas** com o da solução de referência.
- Questões `prever-saida` com `simulacao` SQL não alteram dados (usam `consultar`);
  respostas numéricas são conferidas contra o motor em `catalogo.test.ts`.
- Em Python não há executor: respostas de `prever-saida` com `linguagem: 'python'`
  são conferidas à mão, então revise-as com cuidado.
