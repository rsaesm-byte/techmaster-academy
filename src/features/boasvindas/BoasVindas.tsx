import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useModo } from '@/app/modo';
import { usePreferencias, type Preferencias } from '@/app/preferencias';
import { useTema } from '@/app/ThemeProvider';
import type { Modo } from '@/domain/conteudo';
import { CHAVE_BOAS_VINDAS } from '@/features/boasvindas/estado';

/** O ciclo da plataforma, animado (parado com "reduzir movimento"). */
function Ciclo() {
  const fases = [
    { nome: 'Entender', x: 100, y: 22 },
    { nome: 'Ver', x: 178, y: 100 },
    { nome: 'Fazer', x: 100, y: 178 },
    { nome: 'Lembrar', x: 22, y: 100 },
  ];
  return (
    <svg
      viewBox="-30 -10 260 220"
      role="img"
      aria-label="Ciclo de aprendizagem: entender, ver, fazer, lembrar — e de volta ao começo"
      className="mx-auto h-auto w-full max-w-72"
    >
      <circle
        cx="100"
        cy="100"
        r="78"
        fill="none"
        className="stroke-border"
        strokeWidth="2"
        strokeDasharray="4 6"
      />
      <g className="origin-[100px_100px] motion-safe:animate-[spin_9s_linear_infinite] [html.reduzir-movimento_&]:animate-none">
        <circle cx="100" cy="22" r="7" className="fill-accent" />
      </g>
      {fases.map((f) => (
        <g key={f.nome}>
          <circle
            cx={f.x}
            cy={f.y}
            r="26"
            className="fill-surface stroke-primary"
            strokeWidth="2.5"
          />
          <text
            x={f.x}
            y={f.y + 4}
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            className="fill-text"
          >
            {f.nome}
          </text>
        </g>
      ))}
      <text x="100" y="104" textAnchor="middle" fontSize="12" className="fill-muted">
        você
      </text>
    </svg>
  );
}

type Experiencia = NonNullable<Preferencias['experiencia']>;

const EXPERIENCIAS: { valor: Experiencia; titulo: string; texto: string; modo: Modo }[] = [
  {
    valor: 'nunca',
    titulo: 'Nunca programei',
    texto: 'Vou começar do zero — ótimo, é para isso que estamos aqui.',
    modo: 'guiado',
  },
  {
    valor: 'pouco',
    titulo: 'Já vi um pouco',
    texto: 'Fiz um curso, vi na faculdade ou mexi em algum código.',
    modo: 'guiado',
  },
  {
    valor: 'programo',
    titulo: 'Já programo',
    texto: 'Uso alguma linguagem e quero rever os fundamentos.',
    modo: 'tecnico',
  },
];

const MODOS: { valor: Modo; titulo: string; exemplo: string }[] = [
  {
    valor: 'essencial',
    titulo: 'Essencial',
    exemplo: 'Algoritmo = passos em ordem que resolvem um problema.',
  },
  {
    valor: 'guiado',
    titulo: 'Guiado',
    exemplo: 'Pense numa receita: 1. a ordem importa; 2. cada passo é claro; 3. ela termina…',
  },
  {
    valor: 'tecnico',
    titulo: 'Técnico',
    exemplo:
      'Sequência finita de instruções bem definidas que, a partir de entradas, produz saídas.',
  },
];

/** Primeira visita: entende a pessoa e ajusta a plataforma a ela. Nenhum dado pessoal é pedido. */
export default function BoasVindas() {
  const [passo, setPasso] = useState(0);
  const { prefs, mudar } = usePreferencias();
  const { modo, escolher: escolherModo } = useModo();
  const { preferencia: tema, escolher: escolherTema } = useTema();
  const navegar = useNavigate();
  const titulo = useRef<HTMLHeadingElement>(null);
  const primeira = useRef(true);
  const total = 5;

  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    titulo.current?.focus();
  }, [passo]);

  function concluir(destino: string) {
    try {
      localStorage.setItem(CHAVE_BOAS_VINDAS, 'feita');
    } catch {
      /* segue sem lembrar */
    }
    void navegar(destino);
  }

  const opcao = (ativa: boolean) =>
    `flex w-full flex-col gap-1 rounded-2xl border-2 p-4 text-left ${ativa ? 'border-primary bg-primary-soft' : 'border-border bg-surface hover:border-primary'}`;

  const passos = [
    {
      titulo: 'Bem-vindo à TechMaster Academy',
      corpo: (
        <div className="flex flex-col gap-5">
          <Ciclo />
          <p className="m-0 text-lg">
            Aqui você não só lê. Em cada aula você <strong>entende</strong> com palavras simples,{' '}
            <strong>vê</strong> o código rodando, <strong>faz</strong> exercícios corrigidos na hora
            e <strong>lembra</strong> com revisões no momento certo.
          </p>
          <p className="m-0 text-muted">
            Três perguntas rápidas e a plataforma fica do seu jeito. Nada de cadastro.
          </p>
        </div>
      ),
    },
    {
      titulo: 'Você já programou antes?',
      corpo: (
        <div role="group" aria-label="Experiência com programação" className="flex flex-col gap-3">
          {EXPERIENCIAS.map((e) => (
            <button
              key={e.valor}
              type="button"
              aria-pressed={prefs.experiencia === e.valor}
              className={opcao(prefs.experiencia === e.valor)}
              onClick={() => {
                mudar({ experiencia: e.valor });
                escolherModo(e.modo);
              }}
            >
              <span className="font-semibold">{e.titulo}</span>
              <span className="text-sm text-muted">{e.texto}</span>
            </button>
          ))}
        </div>
      ),
    },
    {
      titulo: 'Como você prefere as explicações?',
      corpo: (
        <div className="flex flex-col gap-3">
          <p className="m-0 text-muted">Dá para trocar a qualquer momento, dentro de cada aula.</p>
          <div role="group" aria-label="Modo de apresentação" className="flex flex-col gap-3">
            {MODOS.map((m) => (
              <button
                key={m.valor}
                type="button"
                aria-pressed={modo === m.valor}
                className={opcao(modo === m.valor)}
                onClick={() => escolherModo(m.valor)}
              >
                <span className="font-semibold">{m.titulo}</span>
                <span className="text-sm text-muted">“{m.exemplo}”</span>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      titulo: 'Deixe do seu jeito',
      corpo: (
        <div className="flex flex-col gap-5">
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-2 font-medium">Tema</legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['sistema', 'Automático'],
                  ['claro', 'Claro'],
                  ['escuro', 'Escuro'],
                ] as const
              ).map(([v, r]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={tema === v}
                  onClick={() => escolherTema(v)}
                  className={`min-h-11 rounded-lg border-2 px-4 ${tema === v ? 'border-primary bg-primary-soft font-semibold' : 'border-border'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-2 font-medium">Tamanho do texto</legend>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['normal', 'Normal'],
                  ['grande', 'Grande'],
                  ['muito-grande', 'Muito grande'],
                ] as const
              ).map(([v, r]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={prefs.tamanhoTexto === v}
                  onClick={() => mudar({ tamanhoTexto: v })}
                  className={`min-h-11 rounded-lg border-2 px-4 ${prefs.tamanhoTexto === v ? 'border-primary bg-primary-soft font-semibold' : 'border-border'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="flex min-h-11 cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              role="switch"
              checked={prefs.reduzirMovimento}
              onChange={(e) => mudar({ reduzirMovimento: e.target.checked })}
              className="size-5 accent-[var(--tm-primary)]"
            />
            <span>Reduzir animações</span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-medium">Quantos dias por semana você quer estudar?</span>
            <select
              value={prefs.metaDiasSemana}
              onChange={(e) => mudar({ metaDiasSemana: Number(e.target.value) })}
              className="min-h-11 w-40 rounded-lg border border-border bg-bg px-3"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <option key={d} value={d}>
                  {d} {d === 1 ? 'dia' : 'dias'}
                </option>
              ))}
            </select>
          </label>
        </div>
      ),
    },
    {
      titulo: 'Seu ponto de partida',
      corpo: (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border-2 border-primary bg-surface p-5">
            <p className="m-0 text-sm font-semibold text-muted">LÓGICA DE PROGRAMAÇÃO · AULA 1</p>
            <p className="m-0 text-xl font-semibold">O que é um algoritmo</p>
            <p className="mt-2 mb-0 text-muted">
              {prefs.experiencia === 'programo'
                ? 'Mesmo para quem já programa, vale começar aqui: cada aula abre com um diagnóstico rápido, e você pode pular o que já domina.'
                : 'Você vai programar um robô, ver um algoritmo rodando linha por linha e escrever seus primeiros passos.'}
            </p>
          </div>
          <p className="m-0 text-muted">
            Sua meta: estudar {prefs.metaDiasSemana} {prefs.metaDiasSemana === 1 ? 'dia' : 'dias'}{' '}
            por semana. Tudo isso pode ser mudado em Configurações.
          </p>
        </div>
      ),
    },
  ];

  const atual = passos[passo] ?? passos[0];
  const podeAvancar = passo !== 1 || prefs.experiencia !== undefined;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-label="Boas-vindas"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={passo + 1}
          className="flex flex-1 gap-1.5"
        >
          {passos.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= passo ? 'bg-primary' : 'bg-surface-2'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => concluir('/')}
          className="min-h-10 rounded-lg px-3 text-sm text-muted hover:bg-surface-2"
        >
          Pular
        </button>
      </div>
      <h1
        ref={titulo}
        tabIndex={-1}
        className="m-0 text-3xl leading-tight font-bold tracking-tight"
      >
        {atual?.titulo}
      </h1>
      {atual?.corpo}
      <div className="flex justify-between gap-3">
        {passo > 0 ? (
          <button
            type="button"
            onClick={() => setPasso((p) => p - 1)}
            className="min-h-12 rounded-lg border border-border px-5 font-medium hover:bg-surface-2"
          >
            ← Voltar
          </button>
        ) : (
          <span />
        )}
        {passo < total - 1 ? (
          <button
            type="button"
            disabled={!podeAvancar}
            onClick={() => setPasso((p) => p + 1)}
            className="min-h-12 rounded-lg bg-primary px-6 font-semibold text-on-primary disabled:opacity-40"
          >
            {passo === 0 ? 'Vamos lá' : 'Continuar'}
          </button>
        ) : (
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => concluir('/trilha/logica')}
              className="min-h-12 rounded-lg border border-border px-4 font-medium hover:bg-surface-2"
            >
              Ver o mapa
            </button>
            <button
              type="button"
              onClick={() => concluir('/aula/logica.m01.a01')}
              className="min-h-12 rounded-lg bg-primary px-6 font-semibold text-on-primary"
            >
              Começar a Aula 1
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
