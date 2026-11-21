/**
 * MOTOR DE CORREÇÃO — TypeScript puro, sem React, fácil de testar.
 * Recebe a questão e a resposta do aluno e devolve se acertou e um feedback
 * ESPECÍFICO: explicar o erro provável ensina mais do que só dizer "errado".
 */
import { LACUNA, type ConsultaSql, type ProgramaPortugol, type Questao } from '@/domain/conteudo';
import { consultar } from '@/engines/computacao/sql';
import { executar } from '@/engines/portugol/interpretador';
import { descrever, type ResultadoJs } from '@/engines/sandbox/casos';

export type Resposta =
  | { tipo: 'multipla-escolha'; alternativa: string }
  | { tipo: 'prever-saida'; texto: string }
  | { tipo: 'ordenacao'; ordem: string[] }
  /** Para cada par (pelo id da esquerda), o id do par cuja direita o aluno escolheu. */
  | { tipo: 'associacao'; escolhas: Record<string, string> }
  | { tipo: 'completar-codigo'; lacunas: string[] }
  | { tipo: 'identificar-erro'; linha: number }
  | { tipo: 'programa-portugol'; codigo: string }
  | { tipo: 'programa-js'; codigo: string }
  | { tipo: 'consulta-sql'; codigo: string }
  | { tipo: 'resposta-aberta'; texto: string; criteriosCumpridos: number };

export interface Correcao {
  correta: boolean;
  feedback: string;
}

const FEEDBACK_GENERICO_SAIDA =
  'Não é isso. Execute o código linha por linha, anotando o valor de cada variável.';

/** Compara saídas ignorando maiúsculas, espaços extras e aspas em volta. */
export function normalizarSaida(texto: string): string {
  return texto
    .trim()
    .replace(/^["'“”]+|["'“”]+$/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

export function corrigir(questao: Questao, resposta: Resposta): Correcao {
  if (questao.tipo !== resposta.tipo) {
    throw new Error(`Resposta do tipo ${resposta.tipo} para questão do tipo ${questao.tipo}`);
  }
  const acerto = { correta: true, feedback: questao.explicacao };

  switch (questao.tipo) {
    case 'multipla-escolha': {
      const { alternativa } = resposta as Extract<Resposta, { tipo: 'multipla-escolha' }>;
      if (alternativa === questao.correta) return acerto;
      const escolhida = questao.alternativas.find((a) => a.id === alternativa);
      return { correta: false, feedback: escolhida?.feedback ?? 'Essa não é a resposta.' };
    }

    case 'prever-saida': {
      const { texto } = resposta as Extract<Resposta, { tipo: 'prever-saida' }>;
      const dada = normalizarSaida(texto);
      if (questao.respostasAceitas.some((r) => normalizarSaida(r) === dada)) return acerto;
      const comum = questao.errosComuns.find((e) => normalizarSaida(e.resposta) === dada);
      return { correta: false, feedback: comum?.feedback ?? FEEDBACK_GENERICO_SAIDA };
    }

    case 'ordenacao': {
      const { ordem } = resposta as Extract<Resposta, { tipo: 'ordenacao' }>;
      const certos = questao.itens.filter((item, i) => ordem[i] === item.id).length;
      if (certos === questao.itens.length && ordem.length === certos) return acerto;
      return {
        correta: false,
        feedback: `${certos} de ${questao.itens.length} passos estão na posição certa. Releia a sequência perguntando: o que precisa acontecer antes deste passo?`,
      };
    }

    case 'associacao': {
      const { escolhas } = resposta as Extract<Resposta, { tipo: 'associacao' }>;
      const certos = questao.pares.filter((p) => escolhas[p.id] === p.id).length;
      if (certos === questao.pares.length) return acerto;
      return {
        correta: false,
        feedback: `${certos} de ${questao.pares.length} associações estão certas. Mantenha as que você tem certeza e revise as outras.`,
      };
    }

    case 'completar-codigo': {
      const { lacunas } = resposta as Extract<Resposta, { tipo: 'completar-codigo' }>;
      const erradas = questao.lacunas
        .map((l, i) => ({ l, i, dada: normalizarCodigo(lacunas[i] ?? '') }))
        .filter(({ l, dada }) => !l.aceitas.some((a) => normalizarCodigo(a) === dada));
      if (erradas.length === 0) return acerto;
      const primeira = erradas[0];
      return {
        correta: false,
        feedback: `${questao.lacunas.length - erradas.length} de ${questao.lacunas.length} lacunas certas.${
          primeira?.l.feedback ? `\n\nLacuna ${primeira.i + 1}: ${primeira.l.feedback}` : ''
        }`,
      };
    }

    case 'identificar-erro': {
      const { linha } = resposta as Extract<Resposta, { tipo: 'identificar-erro' }>;
      if (linha === questao.linhaErrada) return acerto;
      return {
        correta: false,
        feedback:
          questao.feedbackPorLinha[String(linha)] ??
          `A linha ${linha} está correta. Execute o código mentalmente, linha por linha, e veja onde o resultado começa a sair errado.`,
      };
    }

    case 'programa-portugol':
      return corrigirPortugol(
        questao,
        (resposta as Extract<Resposta, { tipo: 'programa-portugol' }>).codigo,
      );

    case 'consulta-sql':
      return corrigirSql(questao, (resposta as Extract<Resposta, { tipo: 'consulta-sql' }>).codigo);

    case 'programa-js':
      throw new Error(
        'Programa em JavaScript é corrigido de forma assíncrona: use corrigirQuestao().',
      );

    case 'resposta-aberta': {
      // Autoavaliação: "correta" significa que o aluno marcou a maioria dos critérios.
      const { criteriosCumpridos } = resposta as Extract<Resposta, { tipo: 'resposta-aberta' }>;
      const correta = criteriosCumpridos >= Math.ceil(questao.rubrica.length * 0.6);
      return {
        correta,
        feedback: correta
          ? 'Boa explicação! Explicar com as próprias palavras é um dos jeitos mais fortes de fixar.'
          : 'Reescreva incluindo os critérios que faltaram — tentar de novo agora vale mais do que acertar de primeira.',
      };
    }
  }
}

/** Corrige qualquer questão; as de JavaScript rodam isoladas num Web Worker. */
export async function corrigirQuestao(
  questao: Questao,
  resposta: Resposta,
  rodar?: (
    codigo: string,
    funcao: string,
    casos: { argumentos: unknown[]; esperado: unknown }[],
  ) => Promise<ResultadoJs>,
): Promise<Correcao> {
  if (questao.tipo !== 'programa-js' || resposta.tipo !== 'programa-js')
    return corrigir(questao, resposta);
  const executor = rodar ?? (await import('@/engines/sandbox/rodarJs')).rodarJs;
  const r = await executor(resposta.codigo, questao.funcao, questao.casos);
  return resultadoJsParaCorrecao(r, questao.explicacao);
}

export function resultadoJsParaCorrecao(r: ResultadoJs, explicacao: string): Correcao {
  if (r.erroGeral) return { correta: false, feedback: r.erroGeral };
  const falhas = r.casos.filter((c) => !c.passou);
  if (falhas.length === 0) return { correta: true, feedback: explicacao };
  const f = falhas[0];
  const args = f?.argumentos.map(descrever).join(', ') ?? '';
  return {
    correta: false,
    feedback: `${r.casos.length - falhas.length} de ${r.casos.length} testes passaram.\n\nCom os argumentos (${args}): esperado ${descrever(f?.esperado)}, ${
      f?.erro ? `deu erro: ${f.erro}` : `sua função devolveu ${descrever(f?.obtido)}`
    }.`,
  };
}

/** Roda a consulta do aluno e a da solução e compara colunas e linhas. */
export function corrigirSql(questao: ConsultaSql, codigo: string): Correcao {
  const esperado = consultar(questao.solucao);
  if (!esperado.ok) throw new Error(`Solução de referência inválida: ${esperado.erro}`);
  const obtido = consultar(codigo);
  if (!obtido.ok) return { correta: false, feedback: `Erro na consulta: ${obtido.erro}` };
  if (obtido.colunas.length !== esperado.colunas.length)
    return {
      correta: false,
      feedback: `Sua consulta devolveu ${obtido.colunas.length} coluna(s), mas o pedido precisa de ${esperado.colunas.length}. Confira o que vem depois do SELECT.`,
    };
  const texto = (linhas: (string | number | null)[][]) => linhas.map((l) => JSON.stringify(l));
  let a = texto(obtido.linhas);
  let b = texto(esperado.linhas);
  if (!questao.ordenada) {
    a = [...a].sort();
    b = [...b].sort();
  }
  if (a.length !== b.length)
    return {
      correta: false,
      feedback: `Sua consulta devolveu ${a.length} linha(s), mas o esperado são ${b.length}. Revise o WHERE (ou o LIMIT).`,
    };
  if (a.join('\n') !== b.join('\n'))
    return {
      correta: false,
      feedback: questao.ordenada
        ? 'As linhas estão certas em quantidade, mas os valores ou a ordem diferem do pedido. Confira o ORDER BY (ASC ou DESC) e as colunas.'
        : 'A quantidade bate, mas os valores diferem do pedido. Confira as colunas escolhidas e as condições do WHERE.',
    };
  return { correta: true, feedback: questao.explicacao };
}

/** Roda o programa do aluno em cada caso e compara a saída, linha por linha. */
export function corrigirPortugol(questao: ProgramaPortugol, codigo: string): Correcao {
  for (const [i, caso] of questao.casos.entries()) {
    const r = executar(codigo, caso.entradas);
    if (r.erro)
      return { correta: false, feedback: `Erro na linha ${r.erro.linha}: ${r.erro.mensagem}` };
    const obtida = r.saida.map((l) => l.trim());
    const esperada = caso.saidaEsperada.map((l) => l.trim());
    if (obtida.join('\n') !== esperada.join('\n')) {
      const entradas = caso.entradas.length ? ` com as entradas ${caso.entradas.join(', ')}` : '';
      return {
        correta: false,
        feedback: `Teste ${i + 1} de ${questao.casos.length}${entradas}:\nesperado: ${esperada.join(' | ') || '(nada)'}\nseu programa escreveu: ${obtida.join(' | ') || '(nada)'}`,
      };
    }
  }
  return { correta: true, feedback: questao.explicacao };
}

/** Código: ignora espaços extras e maiúsculas (Portugol não diferencia). */
export function normalizarCodigo(texto: string): string {
  return texto
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*([()<>=+\-*/,])\s*/g, '$1')
    .toLowerCase();
}

export function contarLacunas(fonte: string): number {
  return fonte.split(LACUNA).length - 1;
}

/** A resposta foi preenchida o suficiente para ser verificada? */
export function respostaCompleta(questao: Questao, resposta: Resposta | undefined): boolean {
  if (!resposta) return false;
  switch (resposta.tipo) {
    case 'multipla-escolha':
      return resposta.alternativa !== '';
    case 'prever-saida':
      return resposta.texto.trim() !== '';
    case 'ordenacao':
      return true;
    case 'associacao':
      return (
        questao.tipo === 'associacao' &&
        questao.pares.every((p) => Boolean(resposta.escolhas[p.id]))
      );
    case 'completar-codigo':
      return resposta.lacunas.length > 0 && resposta.lacunas.every((l) => l.trim() !== '');
    case 'identificar-erro':
      return resposta.linha > 0;
    case 'programa-portugol':
    case 'programa-js':
    case 'consulta-sql':
      return resposta.codigo.trim() !== '';
    case 'resposta-aberta':
      return resposta.texto.trim().length >= 20;
  }
}

/**
 * Embaralha de forma DETERMINÍSTICA a partir de uma semente (o id da questão):
 * a mesma questão sempre aparece na mesma ordem, e nunca já resolvida.
 */
export function embaralhar<T>(itens: readonly T[], semente: string): T[] {
  let h = 2166136261;
  for (const c of semente) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const aleatorio = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h >>> 0) % 10000) / 10000;
  };
  const copia = [...itens];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j] as T, copia[i] as T];
  }
  if (copia.length > 1 && copia.every((x, i) => x === itens[i])) copia.push(copia.shift() as T);
  return copia;
}
