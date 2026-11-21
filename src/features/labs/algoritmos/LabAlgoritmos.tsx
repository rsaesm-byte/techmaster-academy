import { useState } from 'react';
import { EXEMPLOS } from '@/features/labs/algoritmos/exemplos';
import { Visualizador } from '@/features/labs/algoritmos/Visualizador';

/** Laboratório 1 — Visualizador de Algoritmos, página inteira com exemplos. */
export default function LabAlgoritmos() {
  const [i, setI] = useState(0);
  const ex = EXEMPLOS[i] ?? EXEMPLOS[0];
  if (!ex) return null;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="m-0 text-sm text-muted">Laboratório 1</p>
        <h1 className="m-0 text-3xl font-bold tracking-tight">Visualizador de Algoritmos</h1>
        <p className="mt-2 mb-0 max-w-[70ch] text-muted">
          Escreva ou escolha um algoritmo em Portugol e execute uma linha por vez. Isto é uma
          execução de verdade, feita por um interpretador de Portugol no seu navegador.
        </p>
      </div>
      <div role="group" aria-label="Exemplos" className="flex flex-wrap gap-2">
        {EXEMPLOS.map((e, k) => (
          <button
            key={e.nome}
            type="button"
            aria-pressed={k === i}
            onClick={() => setI(k)}
            className={`min-h-10 rounded-full px-4 text-sm ${k === i ? 'bg-primary font-semibold text-on-primary' : 'border border-border hover:bg-surface-2'}`}
          >
            {e.nome}
          </button>
        ))}
      </div>
      <p className="m-0 rounded-xl bg-accent-soft px-4 py-3">
        <strong>Desafio: </strong>
        {ex.dica}
      </p>
      <Visualizador key={ex.nome} codigoInicial={ex.codigo} entradasIniciais={ex.entradas ?? []} />
      <details className="text-[15px] text-muted">
        <summary className="cursor-pointer font-medium text-text">
          O que este Portugol entende
        </summary>
        <ul className="mt-2">
          <li>
            <code>var</code> / <code>inicio</code> / <code>fimalgoritmo</code> (opcionais) e os
            tipos inteiro, real, caractere, logico
          </li>
          <li>
            <code>x &lt;- valor</code>, <code>escreva(...)</code>, <code>leia(x)</code>
          </li>
          <li>
            <code>se ... entao</code> / <code>senao se</code> / <code>senao</code> /{' '}
            <code>fimse</code>
          </li>
          <li>
            <code>enquanto ... faca</code> / <code>fimenquanto</code>,{' '}
            <code>para i de 1 ate 10 [passo 2] faca</code> / <code>fimpara</code>,{' '}
            <code>repita</code> / <code>ate</code>
          </li>
          <li>
            Operadores: <code>+ - * / %</code>, <code>= &lt;&gt; &lt; &gt; &lt;= &gt;=</code>,{' '}
            <code>e ou nao</code>
          </li>
          <li>Ainda não: vetores, funções e procedimentos (chegam em módulos futuros).</li>
        </ul>
      </details>
    </div>
  );
}
