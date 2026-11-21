import { useState } from 'react';
import {
  avaliar,
  meioSomador,
  PORTAS,
  somadorCompleto,
  tabelaDaPorta,
  tabelaMeioSomador,
  tabelaSomadorCompleto,
  type Bit,
  type LinhaVerdade,
  type Porta,
} from '@/engines/computacao/portas';

export type ModoPortas = 'porta' | 'meio-somador' | 'somador-completo';

const botao = 'min-h-11 rounded-lg border px-4 font-medium';

/** Cor do fio: aceso (1) usa a cor primária; apagado (0), a cor discreta. */
const fio = (v: Bit) => (v === 1 ? 'var(--tm-primary)' : 'var(--tm-muted)');

/** Contorno de cada porta, num quadro de 120 × 70 centrado verticalmente em y = 35. */
const CORPOS: Record<Porta, { corpo: string; extra?: string; bolha?: boolean }> = {
  and: { corpo: 'M20 5H55A30 30 0 0 1 55 65H20Z' },
  nand: { corpo: 'M20 5H50A30 30 0 0 1 50 65H20Z', bolha: true },
  or: { corpo: 'M18 5Q70 5 95 35Q70 65 18 65Q40 35 18 5Z' },
  nor: { corpo: 'M18 5Q65 5 88 35Q65 65 18 65Q40 35 18 5Z', bolha: true },
  xor: { corpo: 'M26 5Q72 5 97 35Q72 65 26 65Q48 35 26 5Z', extra: 'M16 5Q38 35 16 65' },
  not: { corpo: 'M22 8L82 35L22 62Z', bolha: true },
};

function DesenhoPorta({ porta, a, b, saida }: { porta: Porta; a: Bit; b: Bit; saida: Bit }) {
  const { corpo, extra, bolha } = CORPOS[porta];
  const duas = PORTAS[porta].entradas === 2;
  const xSaida = porta === 'not' ? 88 : porta === 'and' ? 85 : porta === 'nand' ? 86 : 97;
  const xBolha = porta === 'not' ? 88 : porta === 'nand' ? 86 : porta === 'nor' ? 94 : 0;
  const fim = bolha ? xBolha + 6 : xSaida;
  return (
    <svg
      viewBox="0 0 150 70"
      role="img"
      className="h-24 w-44"
      aria-label={`Porta ${PORTAS[porta].nome}`}
    >
      {/* fios de entrada */}
      {duas ? (
        <>
          <path d="M0 18H20" stroke={fio(a)} strokeWidth="3" fill="none" />
          <path d="M0 52H20" stroke={fio(b)} strokeWidth="3" fill="none" />
        </>
      ) : (
        <path d="M0 35H22" stroke={fio(a)} strokeWidth="3" fill="none" />
      )}
      <path
        d={corpo}
        fill="var(--tm-surface-2)"
        stroke="var(--tm-text)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {extra && <path d={extra} fill="none" stroke="var(--tm-text)" strokeWidth="2.5" />}
      {bolha && (
        <circle
          cx={xBolha + 3}
          cy="35"
          r="4.5"
          fill="var(--tm-surface)"
          stroke="var(--tm-text)"
          strokeWidth="2.5"
        />
      )}
      <path d={`M${fim} 35H150`} stroke={fio(saida)} strokeWidth="3" fill="none" />
    </svg>
  );
}

function Lampada({ valor, rotulo }: { valor: Bit; rotulo: string }) {
  return (
    <div
      role="img"
      aria-label={`${rotulo}: ${valor}`}
      className={`grid size-14 place-items-center rounded-full border-2 font-mono text-xl font-bold transition-colors ${
        valor === 1
          ? 'border-accent bg-accent text-on-primary shadow-[0_0_18px_var(--tm-accent)]'
          : 'border-border bg-surface-2 text-muted'
      }`}
    >
      {valor}
    </div>
  );
}

function Interruptor({ nome, valor, aoMudar }: { nome: string; valor: Bit; aoMudar: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={valor === 1}
      aria-label={`Entrada ${nome}: ${valor}`}
      onClick={aoMudar}
      className={`${botao} min-w-24 font-mono ${
        valor === 1
          ? 'border-primary bg-primary text-on-primary'
          : 'border-border bg-surface-2 hover:border-primary'
      }`}
    >
      {nome} = {valor}
    </button>
  );
}

/** Tabela-verdade com a linha atual destacada. */
function TabelaVerdade({
  titulos,
  linhas,
  atual,
}: {
  titulos: string[];
  linhas: LinhaVerdade[];
  atual: Bit[];
}) {
  const chave = atual.join('');
  return (
    <table className="w-full max-w-md border-collapse text-center font-mono">
      <caption className="mb-1 text-left font-sans text-sm text-muted">
        Tabela-verdade: a linha em destaque é a situação atual.
      </caption>
      <thead>
        <tr className="border-b border-border text-sm">
          {titulos.map((t, i) => (
            <th
              key={t}
              scope="col"
              className={`p-2 font-medium ${i === titulos.length - 1 || (titulos.length > 3 && i >= titulos.length - 2) ? 'text-accent' : ''}`}
            >
              {t}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {linhas.map((l) => {
          const ativa = l.entradas.join('') === chave;
          return (
            <tr
              key={l.entradas.join('')}
              aria-current={ativa ? 'true' : undefined}
              className={ativa ? 'bg-primary-soft font-bold' : 'border-b border-border/50'}
            >
              {[...l.entradas, ...l.saidas].map((v, i) => (
                <td key={i} className="p-2">
                  {v}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ModoPorta({ inicial, fixo }: { inicial: Porta; fixo: boolean }) {
  const [porta, setPorta] = useState<Porta>(inicial);
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);
  const info = PORTAS[porta];
  const saida = avaliar(porta, a, b);
  const inverter = (v: Bit): Bit => (v === 1 ? 0 : 1);
  return (
    <div className="flex flex-col gap-5">
      {!fixo && (
        <div role="group" aria-label="Escolha a porta" className="flex flex-wrap gap-2">
          {(Object.keys(PORTAS) as Porta[]).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={porta === p}
              onClick={() => setPorta(p)}
              className={`${botao} ${porta === p ? 'border-primary bg-primary-soft' : 'border-border hover:bg-surface-2'}`}
            >
              {p.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      <p className="m-0">
        <strong>{info.nome}.</strong> {info.regra}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <div className="flex flex-col gap-3">
          <Interruptor nome="A" valor={a} aoMudar={() => setA(inverter(a))} />
          {info.entradas === 2 && (
            <Interruptor nome="B" valor={b} aoMudar={() => setB(inverter(b))} />
          )}
        </div>
        <DesenhoPorta porta={porta} a={a} b={b} saida={saida} />
        <Lampada valor={saida} rotulo="Saída" />
      </div>
      <TabelaVerdade
        titulos={info.entradas === 2 ? ['A', 'B', 'Saída'] : ['A', 'Saída']}
        linhas={tabelaDaPorta(porta)}
        atual={info.entradas === 2 ? [a, b] : [a]}
      />
    </div>
  );
}

function ModoMeioSomador() {
  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(1);
  const r = meioSomador(a, b);
  const inverter = (v: Bit): Bit => (v === 1 ? 0 : 1);
  return (
    <div className="flex flex-col gap-5">
      <p className="m-0">
        Somar dois bits precisa de <strong>duas</strong> portas: um <strong>XOR</strong> dá o bit do
        resultado e um <strong>AND</strong> dá o “vai-um”.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        <div className="flex flex-col gap-3">
          <Interruptor nome="A" valor={a} aoMudar={() => setA(inverter(a))} />
          <Interruptor nome="B" valor={b} aoMudar={() => setB(inverter(b))} />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <DesenhoPorta porta="xor" a={a} b={b} saida={r.soma} />
            <div className="flex flex-col items-center text-sm">
              <Lampada valor={r.soma} rotulo="Soma" />
              Soma
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DesenhoPorta porta="and" a={a} b={b} saida={r.vaiUm} />
            <div className="flex flex-col items-center text-sm">
              <Lampada valor={r.vaiUm} rotulo="Vai-um" />
              Vai-um
            </div>
          </div>
        </div>
      </div>
      <p role="status" className="m-0 rounded-xl bg-primary-soft p-3 font-mono">
        {a} + {b} = {r.vaiUm}
        {r.soma} (em binário)
      </p>
      <TabelaVerdade
        titulos={['A', 'B', 'Soma', 'Vai-um']}
        linhas={tabelaMeioSomador()}
        atual={[a, b]}
      />
    </div>
  );
}

function ModoSomadorCompleto() {
  const [a, setA] = useState<Bit>(1);
  const [b, setB] = useState<Bit>(1);
  const [c, setC] = useState<Bit>(1);
  const r = somadorCompleto(a, b, c);
  const inverter = (v: Bit): Bit => (v === 1 ? 0 : 1);
  return (
    <div className="flex flex-col gap-5">
      <p className="m-0">
        Para somar uma coluna inteira é preciso somar <strong>três</strong> bits: A, B e o “vem-um”
        da coluna da direita. Dois meios-somadores e um OR fazem isso. Encadeando 8 deles, você soma
        números de 8 bits — é assim que o processador soma.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Interruptor nome="A" valor={a} aoMudar={() => setA(inverter(a))} />
        <Interruptor nome="B" valor={b} aoMudar={() => setB(inverter(b))} />
        <Interruptor nome="Vem-um" valor={c} aoMudar={() => setC(inverter(c))} />
        <span aria-hidden="true" className="text-2xl">
          →
        </span>
        <div className="flex flex-col items-center text-sm">
          <Lampada valor={r.soma} rotulo="Soma" />
          Soma
        </div>
        <div className="flex flex-col items-center text-sm">
          <Lampada valor={r.vaiUm} rotulo="Vai-um" />
          Vai-um
        </div>
      </div>
      <p role="status" className="m-0 rounded-xl bg-primary-soft p-3 font-mono">
        {a} + {b} + {c} = {a + b + c} = {r.vaiUm}
        {r.soma} em binário
      </p>
      <TabelaVerdade
        titulos={['A', 'B', 'Vem-um', 'Soma', 'Vai-um']}
        linhas={tabelaSomadorCompleto()}
        atual={[a, b, c]}
      />
    </div>
  );
}

export function PortasSim({
  modo = 'porta',
  porta = 'and',
  fixo = false,
}: {
  modo?: ModoPortas;
  porta?: Porta;
  fixo?: boolean;
}) {
  return (
    <section
      aria-label="Simulador de portas lógicas"
      className="rounded-2xl border border-border bg-surface p-5"
    >
      {modo === 'porta' && <ModoPorta inicial={porta} fixo={fixo} />}
      {modo === 'meio-somador' && <ModoMeioSomador />}
      {modo === 'somador-completo' && <ModoSomadorCompleto />}
    </section>
  );
}

export default PortasSim;
