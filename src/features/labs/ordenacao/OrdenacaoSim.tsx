import { useEffect, useId, useMemo, useState } from 'react';
import { ALGORITMOS, gerarVetor, type AlgoritmoId } from '@/engines/algoritmos/ordenacao';
import { usePrefereMenosMovimento } from '@/ui/usePrefereMenosMovimento';

type Forma = 'aleatorio' | 'quase' | 'inverso' | 'ordenado';
const FORMAS: { id: Forma; rotulo: string }[] = [
  { id: 'aleatorio', rotulo: 'Aleatório' },
  { id: 'quase', rotulo: 'Quase ordenado' },
  { id: 'inverso', rotulo: 'Ao contrário' },
  { id: 'ordenado', rotulo: 'Já ordenado' },
];
const VELOCIDADES = [700, 300, 80];

/**
 * LABORATÓRIO DE ORDENAÇÃO E BUSCA — barras animadas, pseudocódigo com a linha atual,
 * contadores de comparações e trocas, e uma "corrida" para comparar eficiência.
 */
export function OrdenacaoSim({
  algoritmoInicial = 'bolha',
  fixo = false,
}: {
  algoritmoInicial?: AlgoritmoId;
  fixo?: boolean;
}) {
  const [algId, setAlgId] = useState<AlgoritmoId>(algoritmoInicial);
  const [tamanho, setTamanho] = useState(12);
  const [forma, setForma] = useState<Forma>('aleatorio');
  const [semente, setSemente] = useState(7);
  const [quadro, setQuadro] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [vel, setVel] = useState(1);
  const menosMovimento = usePrefereMenosMovimento();
  const ids = useId();

  const alg = ALGORITMOS[algId];
  const busca = alg.tipo === 'busca';
  // Busca binária precisa de vetor ordenado: o lab ordena e avisa.
  const vetor = useMemo(() => {
    const v = gerarVetor(tamanho, forma, semente);
    return algId === 'binaria' ? [...v].sort((a, b) => a - b) : v;
  }, [tamanho, forma, semente, algId]);
  const [alvoTexto, setAlvoTexto] = useState('');
  const alvo =
    alvoTexto.trim() === '' ? (vetor[Math.floor(tamanho * 0.7)] ?? 0) : Number(alvoTexto);
  const quadros = useMemo(() => alg.executar(vetor, alvo), [alg, vetor, alvo]);
  const q = quadros[Math.min(quadro, quadros.length - 1)];
  const fim = quadro >= quadros.length - 1;

  useEffect(() => {
    if (!tocando) return;
    const t = setTimeout(
      () => {
        setQuadro((n) => Math.min(n + 1, quadros.length - 1));
        if (quadro + 1 >= quadros.length - 1) setTocando(false);
      },
      menosMovimento ? Math.max(VELOCIDADES[vel] ?? 300, 300) : (VELOCIDADES[vel] ?? 300),
    );
    return () => clearTimeout(t);
  }, [tocando, quadro, quadros.length, vel, menosMovimento]);

  const reiniciar = () => {
    setTocando(false);
    setQuadro(0);
  };

  // Corrida: os três algoritmos de ordenação na MESMA entrada.
  const corrida = useMemo(
    () =>
      (['bolha', 'selecao', 'insercao'] as const).map((id) => {
        const ultimo = ALGORITMOS[id].executar(gerarVetor(tamanho, forma, semente)).at(-1);
        return {
          id,
          nome: ALGORITMOS[id].nome,
          comparacoes: ultimo?.comparacoes ?? 0,
          trocas: ultimo?.trocas ?? 0,
        };
      }),
    [tamanho, forma, semente],
  );
  const maxComp = Math.max(...corrida.map((c) => c.comparacoes), 1);

  if (!q) return null;
  const maxValor = 100;
  const W = 640;
  const H = 220;
  const larg = W / q.vetor.length;
  const linhas = alg.pseudocodigo.split('\n');

  const cor = (i: number) => {
    const pos = i + 1;
    if (q.encontrado === pos) return 'fill-success';
    if (q.trocando?.includes(pos)) return 'fill-accent';
    if (q.comparando?.includes(pos)) return 'fill-primary';
    if (q.faixa && (pos < q.faixa[0] || pos > q.faixa[1])) return 'fill-surface-2';
    if (q.prontos.includes(pos)) return 'fill-success opacity-60';
    return 'fill-muted opacity-50';
  };

  const botao =
    'min-h-11 rounded-lg border border-border px-3 font-medium hover:bg-surface-2 disabled:opacity-40';

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-end gap-3">
        {!fixo && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Algoritmo</span>
            <select
              value={algId}
              onChange={(e) => {
                setAlgId(e.target.value as AlgoritmoId);
                reiniciar();
              }}
              className="min-h-11 rounded-lg border border-border bg-bg px-3"
            >
              <optgroup label="Ordenação">
                <option value="bolha">Bolha</option>
                <option value="selecao">Seleção</option>
                <option value="insercao">Inserção</option>
              </optgroup>
              <optgroup label="Busca">
                <option value="linear">Busca linear</option>
                <option value="binaria">Busca binária</option>
              </optgroup>
            </select>
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Vetor</span>
          <select
            value={forma}
            onChange={(e) => {
              setForma(e.target.value as Forma);
              reiniciar();
            }}
            className="min-h-11 rounded-lg border border-border bg-bg px-3"
          >
            {FORMAS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.rotulo}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Tamanho: {tamanho}</span>
          <input
            type="range"
            min={5}
            max={busca ? 64 : 30}
            value={tamanho}
            onChange={(e) => {
              setTamanho(Number(e.target.value));
              reiniciar();
            }}
            className="min-h-11 accent-[var(--tm-primary)]"
          />
        </label>
        {busca && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Procurar o valor</span>
            <input
              inputMode="numeric"
              value={alvoTexto}
              placeholder={String(alvo)}
              onChange={(e) => {
                setAlvoTexto(e.target.value.replace(/[^\d]/g, ''));
                reiniciar();
              }}
              className="min-h-11 w-28 rounded-lg border border-border bg-bg px-3"
            />
          </label>
        )}
        <button
          type="button"
          className={botao}
          onClick={() => {
            setSemente((s) => s + 1);
            reiniciar();
          }}
        >
          Sortear outro
        </button>
      </div>
      {algId === 'binaria' && forma !== 'ordenado' && (
        <p className="m-0 rounded-xl bg-accent-soft px-4 py-2 text-sm">
          A busca binária só funciona em vetor ordenado — por isso o vetor foi ordenado antes.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <figure className="m-0 flex flex-col gap-2">
          <svg
            viewBox={`0 0 ${W} ${H + 24}`}
            role="img"
            aria-label={`Vetor com ${q.vetor.length} valores: ${q.vetor.join(', ')}`}
            className="h-auto w-full rounded-xl bg-bg"
          >
            {q.vetor.map((valor, i) => {
              const h = (valor / maxValor) * (H - 10);
              return (
                <g key={i}>
                  <rect
                    x={i * larg + 2}
                    y={H - h}
                    width={larg - 4}
                    height={h}
                    rx="3"
                    className={cor(i)}
                    style={{ transition: menosMovimento ? 'none' : 'y 150ms, height 150ms' }}
                  />
                  {larg >= 18 && (
                    <text
                      x={i * larg + larg / 2}
                      y={H + 16}
                      textAnchor="middle"
                      fontSize="11"
                      className="fill-muted"
                    >
                      {i + 1}
                    </text>
                  )}
                  {q.meio === i + 1 && (
                    <text
                      x={i * larg + larg / 2}
                      y={H - h - 6}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="700"
                      className="fill-primary"
                    >
                      meio
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <figcaption className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
            <span>
              <span className="mr-1 inline-block size-3 rounded-sm bg-primary align-middle" />
              comparando
            </span>
            <span>
              <span className="mr-1 inline-block size-3 rounded-sm bg-accent align-middle" />
              trocando
            </span>
            <span>
              <span className="mr-1 inline-block size-3 rounded-sm bg-success align-middle" />
              {busca ? 'encontrado' : 'na posição final'}
            </span>
            {busca && (
              <span>
                <span className="mr-1 inline-block size-3 rounded-sm bg-surface-2 align-middle" />
                descartado
              </span>
            )}
          </figcaption>
        </figure>

        <div className="flex flex-col gap-3">
          <pre
            aria-label={`Pseudocódigo de ${alg.nome}`}
            className="m-0 overflow-x-auto rounded-xl bg-surface-2 py-2 font-mono text-[12.5px] leading-6 [font-variant-ligatures:none]"
          >
            {linhas.map((l, i) => (
              <span
                key={i}
                className={`block px-3 ${q.linha === i + 1 ? 'bg-primary-soft font-semibold' : ''}`}
              >
                {l || ' '}
              </span>
            ))}
          </pre>
          <dl className="m-0 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-surface-2 p-3">
              <dt className="text-xs text-muted">Comparações</dt>
              <dd className="m-0 font-mono text-2xl font-bold">{q.comparacoes}</dd>
            </div>
            <div className="rounded-xl bg-surface-2 p-3">
              <dt className="text-xs text-muted">{busca ? 'Tamanho' : 'Trocas'}</dt>
              <dd className="m-0 font-mono text-2xl font-bold">
                {busca ? q.vetor.length : q.trocas}
              </dd>
            </div>
          </dl>
          <p className="m-0 text-sm text-muted">{alg.complexidade}</p>
        </div>
      </div>

      <p aria-live="polite" className="m-0 rounded-xl bg-surface-2 px-4 py-3 text-[15px]">
        <strong>
          Passo {quadro + 1} de {quadros.length}:{' '}
        </strong>
        {q.descricao}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={botao}
          onClick={reiniciar}
          disabled={quadro === 0}
          aria-label="Voltar ao início"
        >
          ⏮
        </button>
        <button
          type="button"
          className={botao}
          onClick={() => setQuadro((n) => Math.max(0, n - 1))}
          disabled={quadro === 0}
          aria-label="Passo anterior"
        >
          ‹
        </button>
        <button
          type="button"
          className="min-h-11 rounded-lg bg-primary px-4 font-semibold text-on-primary disabled:opacity-40"
          onClick={() => setQuadro((n) => n + 1)}
          disabled={fim}
        >
          Avançar
        </button>
        <button
          type="button"
          className={botao}
          aria-pressed={tocando}
          onClick={() => {
            if (fim) setQuadro(0);
            setTocando((t) => !t);
          }}
        >
          {tocando ? 'Pausar' : 'Reproduzir'}
        </button>
        <button
          type="button"
          className={botao}
          onClick={() => {
            setTocando(false);
            setQuadro(quadros.length - 1);
          }}
          disabled={fim}
        >
          Ir ao fim
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm text-muted">
          Velocidade
          <select
            value={vel}
            onChange={(e) => setVel(Number(e.target.value))}
            className="min-h-10 rounded-lg border border-border bg-bg px-2 text-text"
          >
            <option value={0}>Devagar</option>
            <option value={1}>Normal</option>
            <option value={2}>Rápido</option>
          </select>
        </label>
      </div>

      {!busca && (
        <section aria-labelledby={`${ids}-corrida`} className="flex flex-col gap-2">
          <h3 id={`${ids}-corrida`} className="m-0 text-sm font-semibold">
            Corrida: os três algoritmos com este mesmo vetor
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-muted">
                <th scope="col" className="py-1">
                  Algoritmo
                </th>
                <th scope="col" className="py-1">
                  Comparações
                </th>
                <th scope="col" className="py-1">
                  Trocas
                </th>
              </tr>
            </thead>
            <tbody>
              {corrida.map((c) => (
                <tr key={c.id} className={c.id === algId ? 'font-semibold' : ''}>
                  <th scope="row" className="py-1 text-left font-normal">
                    {c.nome}
                  </th>
                  <td className="py-1">
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${(c.comparacoes / maxComp) * 120}px` }}
                      />
                      {c.comparacoes}
                    </span>
                  </td>
                  <td className="py-1">{c.trocas}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="m-0 text-xs text-muted">
            Experimente "Já ordenado": a Inserção quase não trabalha. A Bolha (sem otimização) faz
            as mesmas comparações sempre.
          </p>
        </section>
      )}
    </div>
  );
}
