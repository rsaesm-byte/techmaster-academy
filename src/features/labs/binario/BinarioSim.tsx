import { useMemo, useState } from 'react';
import {
  bitsParaTexto,
  comSinal,
  paraBits,
  paraHex,
  peso,
  semSinal,
  somar,
  textoParaBytes,
  type Bits,
} from '@/engines/computacao/binario';

export type ModoBinario = 'bits' | 'soma' | 'texto';

const caixa = 'rounded-2xl border border-border bg-surface p-5';
const botao =
  'min-h-11 rounded-lg border border-border px-4 font-medium hover:bg-surface-2 disabled:opacity-50';

/** Uma fileira de lâmpadas: acesa = 1, apagada = 0. Clicar inverte o bit. */
function Lampadas({
  bits,
  aoMudar,
  rotulo,
}: {
  bits: Bits;
  aoMudar?: (i: number) => void;
  rotulo: string;
}) {
  const n = bits.length;
  return (
    <ul className="m-0 flex list-none justify-center gap-1.5 p-0 sm:gap-2" aria-label={rotulo}>
      {bits.map((b, i) => (
        <li key={i} className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            disabled={!aoMudar}
            aria-pressed={b === 1}
            aria-label={`Bit de valor ${peso(i, n)}: ${b}`}
            onClick={() => aoMudar?.(i)}
            className={`grid size-11 place-items-center rounded-xl border-2 font-mono text-lg font-bold transition-colors sm:size-14 sm:text-xl ${
              b === 1
                ? 'border-primary bg-primary text-on-primary shadow-[0_0_14px_var(--tm-primary)]'
                : 'border-border bg-surface-2 text-muted'
            } ${aoMudar ? 'cursor-pointer hover:border-primary' : 'cursor-default'}`}
          >
            {b}
          </button>
          <span className="font-mono text-xs text-muted" aria-hidden="true">
            {peso(i, n)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ModoBits({ n }: { n: 4 | 8 }) {
  const [bits, setBits] = useState<Bits>(() => paraBits(n === 8 ? 37 : 5, n));
  const [negativos, setNegativos] = useState(false);
  const decimal = negativos ? comSinal(bits) : semSinal(bits);
  const parcelas = bits
    .map((b, i) => (b === 1 ? peso(i, n) : null))
    .filter((x): x is number => x !== null);
  const conta = !negativos
    ? parcelas.length
      ? `${parcelas.join(' + ')} = ${semSinal(bits)}`
      : '0'
    : `${bits[0] === 1 ? `−${2 ** (n - 1)}` : '0'}${parcelas
        .filter((p) => !(bits[0] === 1 && p === 2 ** (n - 1)))
        .map((p) => ` + ${p}`)
        .join('')} = ${comSinal(bits)}`;

  return (
    <div className="flex flex-col gap-5">
      <Lampadas
        bits={bits}
        rotulo={`${n} bits`}
        aoMudar={(i) => setBits((b) => b.map((x, j) => (j === i ? 1 - x : x)))}
      />
      <p className="m-0 text-center text-sm text-muted">
        Cada lâmpada vale o dobro da vizinha da direita. Some o valor das acesas.
      </p>
      <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-surface-2 p-3">
          <dt className="text-xs text-muted">Decimal{negativos ? ' (com sinal)' : ''}</dt>
          <dd className="m-0 font-mono text-2xl font-bold">{decimal}</dd>
        </div>
        <div className="rounded-xl bg-surface-2 p-3">
          <dt className="text-xs text-muted">Hexadecimal</dt>
          <dd className="m-0 font-mono text-2xl font-bold">0x{paraHex(bits)}</dd>
        </div>
        <div className="col-span-2 rounded-xl bg-surface-2 p-3 sm:col-span-1">
          <dt className="text-xs text-muted">Binário</dt>
          <dd className="m-0 font-mono text-2xl font-bold">{bitsParaTexto(bits)}</dd>
        </div>
      </dl>
      <p role="status" className="m-0 rounded-xl bg-primary-soft p-3 font-mono text-[15px]">
        {conta}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={botao} onClick={() => setBits(Array(n).fill(0))}>
          Zerar
        </button>
        <button
          type="button"
          className={botao}
          onClick={() => setBits((b) => paraBits(semSinal(b) + 1, n))}
        >
          +1
        </button>
        <button
          type="button"
          className={botao}
          onClick={() => setBits((b) => paraBits(semSinal(b) - 1, n))}
        >
          −1
        </button>
        <button type="button" className={botao} onClick={() => setBits(Array(n).fill(1))}>
          Tudo ligado
        </button>
        <label className="ml-auto flex min-h-11 cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={negativos}
            onChange={(e) => setNegativos(e.target.checked)}
            className="size-4 accent-[var(--tm-primary)]"
          />
          Permitir negativos (complemento de dois)
        </label>
      </div>
    </div>
  );
}

function ModoSoma({ n }: { n: 4 | 8 }) {
  const [a, setA] = useState(n === 8 ? 100 : 5);
  const [b, setB] = useState(n === 8 ? 27 : 3);
  const [coluna, setColuna] = useState(0); // quantas colunas já foram somadas
  const max = 2 ** n - 1;
  const bitsA = useMemo(() => paraBits(a, n), [a, n]);
  const bitsB = useMemo(() => paraBits(b, n), [b, n]);
  const r = useMemo(() => somar(bitsA, bitsB), [bitsA, bitsB]);
  const feitos = r.passos.slice(0, coluna);
  const atual = r.passos[coluna - 1];
  const terminou = coluna >= n;

  const mudar = (set: (v: number) => void) => (v: string) => {
    const x = Math.min(max, Math.max(0, Math.trunc(Number(v) || 0)));
    set(x);
    setColuna(0);
  };

  // Para cada posição, o que já foi calculado (vai-um e resultado).
  const porPosicao = new Map(feitos.map((p) => [p.posicao, p]));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-4">
        {[
          ['A', a, mudar(setA)],
          ['B', b, mudar(setB)],
        ].map(([nome, valor, mudarValor]) => (
          <label key={nome as string} className="flex flex-col gap-1 text-sm font-medium">
            Número {nome as string} (0 a {max})
            <input
              type="number"
              min={0}
              max={max}
              value={valor as number}
              onChange={(e) => (mudarValor as (v: string) => void)(e.target.value)}
              className="min-h-11 w-36 rounded-lg border border-border bg-surface px-3 font-mono"
            />
          </label>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="mx-auto border-separate border-spacing-x-1 font-mono text-xl sm:text-2xl">
          <caption className="sr-only">Soma em binário, coluna por coluna</caption>
          <tbody>
            <tr>
              <th
                scope="row"
                className="pr-2 text-right text-sm font-normal whitespace-nowrap text-muted sm:pr-3"
              >
                vai
                <span className="sr-only">-um</span>
              </th>
              {bitsA.map((_, i) => (
                <td key={i} className="h-8 w-8 text-center text-base text-accent sm:w-11">
                  {porPosicao.get(i + 1)?.saida ? 1 : ''}
                </td>
              ))}
            </tr>
            <tr>
              <th
                scope="row"
                className="pr-2 text-right text-sm font-normal whitespace-nowrap text-muted sm:pr-3"
              >
                <span aria-hidden="true">A</span>
                <span className="sr-only">A = {a}</span>
              </th>
              {bitsA.map((x, i) => (
                <td
                  key={i}
                  className={`w-8 rounded text-center sm:w-11 ${atual?.posicao === i ? 'bg-primary-soft' : ''}`}
                >
                  {x}
                </td>
              ))}
            </tr>
            <tr>
              <th
                scope="row"
                className="pr-2 text-right text-sm font-normal whitespace-nowrap text-muted sm:pr-3"
              >
                <span aria-hidden="true">B</span>
                <span className="sr-only">B = {b}</span>
              </th>
              {bitsB.map((x, i) => (
                <td
                  key={i}
                  className={`w-8 rounded border-b-2 border-text text-center sm:w-11 ${atual?.posicao === i ? 'bg-primary-soft' : ''}`}
                >
                  {x}
                </td>
              ))}
            </tr>
            <tr>
              <th scope="row" className="pr-3 text-right text-sm font-normal text-muted">
                ={terminou && <span className="sr-only"> {semSinal(r.resultado)}</span>}
              </th>
              {bitsA.map((_, i) => (
                <td
                  key={i}
                  className={`h-10 w-8 rounded text-center font-bold sm:w-11 ${porPosicao.has(i) ? 'bg-success-soft text-success' : ''}`}
                >
                  {porPosicao.get(i)?.soma ?? ''}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p role="status" className="m-0 min-h-14 rounded-xl bg-surface-2 p-3">
        {!atual && 'Aperte “Próxima coluna”: começamos pela direita, como na soma da escola.'}
        {atual &&
          !terminou &&
          `Coluna ${n - atual.posicao}: ${atual.a} + ${atual.b}${atual.entrada ? ' + 1 (vai-um)' : ''} = ${atual.a + atual.b + atual.entrada}. Escreve ${atual.soma}${atual.saida ? ' e vai 1 para a esquerda' : ''}.`}
        {terminou && atual && (
          <>
            Última coluna: {atual.a} + {atual.b}
            {atual.entrada ? ' + 1' : ''} = {atual.a + atual.b + atual.entrada}.{' '}
            {r.estouro ? (
              <strong className="text-danger">
                Sobrou um vai-um que não cabe em {n} bits: estouro! O resultado correto ({a + b})
                precisa de mais bits, e aqui ficou {semSinal(r.resultado)}.
              </strong>
            ) : (
              <strong className="text-success">
                Resultado: {semSinal(r.resultado)} — confere com {a} + {b}.
              </strong>
            )}
            {!r.estouro && r.estouroComSinal && (
              <span className="mt-1 block text-danger">
                Atenção: se esses bits fossem números COM sinal, o resultado seria{' '}
                {comSinal(r.resultado)} (estouro com sinal).
              </span>
            )}
          </>
        )}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={botao}
          disabled={terminou}
          onClick={() => setColuna((c) => Math.min(n, c + 1))}
        >
          Próxima coluna
        </button>
        <button type="button" className={botao} disabled={terminou} onClick={() => setColuna(n)}>
          Mostrar tudo
        </button>
        <button
          type="button"
          className={botao}
          disabled={coluna === 0}
          onClick={() => setColuna(0)}
        >
          Recomeçar
        </button>
      </div>
    </div>
  );
}

function ModoTexto() {
  const [texto, setTexto] = useState('Oi');
  const itens = textoParaBytes(texto.slice(0, 6));
  return (
    <div className="flex flex-col gap-5">
      <label className="flex max-w-sm flex-col gap-1 text-sm font-medium">
        Escreva até 6 caracteres
        <input
          value={texto}
          maxLength={6}
          onChange={(e) => setTexto(e.target.value)}
          spellCheck={false}
          autoComplete="off"
          className="min-h-11 rounded-lg border border-border bg-surface px-3 font-mono text-lg"
        />
      </label>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Cada caractere do texto e os bytes que o representam
          </caption>
          <thead>
            <tr className="border-b border-border text-sm text-muted">
              <th scope="col" className="p-2 font-medium">
                Caractere
              </th>
              <th scope="col" className="p-2 font-medium">
                Decimal
              </th>
              <th scope="col" className="p-2 font-medium">
                Hex
              </th>
              <th scope="col" className="p-2 font-medium">
                Binário (um byte = 8 bits)
              </th>
            </tr>
          </thead>
          <tbody>
            {itens.map((it, i) =>
              it.bytes.map((byte, k) => (
                <tr key={`${i}-${k}`} className="border-b border-border/60 font-mono">
                  <td className="p-2 text-xl font-bold">
                    {k === 0 ? (it.caractere === ' ' ? '␣' : it.caractere) : ''}
                  </td>
                  <td className="p-2">{byte}</td>
                  <td className="p-2">0x{paraHex(paraBits(byte, 8))}</td>
                  <td className="p-2 tracking-widest text-primary">{paraBits(byte, 8).join('')}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
      <p className="m-0 text-sm text-muted">
        Experimente <strong>A</strong> e <strong>a</strong> (só um bit muda!), um número como{' '}
        <strong>7</strong> (o caractere “7” não é o número 7) e uma letra com acento, como{' '}
        <strong>é</strong>, que precisa de 2 bytes.
      </p>
    </div>
  );
}

export function BinarioSim({ modo = 'bits', bits = 8 }: { modo?: ModoBinario; bits?: 4 | 8 }) {
  return (
    <section aria-label="Simulador de binário" className={caixa}>
      {modo === 'bits' && <ModoBits n={bits} />}
      {modo === 'soma' && <ModoSoma n={bits} />}
      {modo === 'texto' && <ModoTexto />}
    </section>
  );
}

export default BinarioSim;
