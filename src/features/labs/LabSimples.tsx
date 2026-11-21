import { useState, type ReactNode } from 'react';
import { EscalonadorSim } from '@/features/labs/sistemas/EscalonadorSim';
import { PermissoesSim } from '@/features/labs/sistemas/PermissoesSim';
import { RedeSim } from '@/features/labs/sistemas/RedeSim';
import { SenhaSim } from '@/features/labs/sistemas/SenhaSim';
import { WebSim } from '@/features/labs/sistemas/WebSim';
import { CacheSim } from '@/features/labs/armazenamento/CacheSim';
import { CesarSim } from '@/features/labs/armazenamento/CesarSim';
import { CompressaoSim } from '@/features/labs/armazenamento/CompressaoSim';
import { RaidSim } from '@/features/labs/armazenamento/RaidSim';
import { UnidadesSim } from '@/features/labs/armazenamento/UnidadesSim';
import { CpuSim } from '@/features/labs/cpu/CpuSim';
import { TerminalSim } from '@/features/labs/terminal/TerminalSim';
import { PortasSim, type ModoPortas } from '@/features/labs/portas/PortasSim';
import { BinarioSim, type ModoBinario } from '@/features/labs/binario/BinarioSim';
import { LacoGrafico } from '@/features/labs/laco/LacoGrafico';
import { OrdenacaoSim } from '@/features/labs/ordenacao/OrdenacaoSim';
import { RoboSim } from '@/features/labs/robo/RoboSim';

function Pagina({
  numero,
  titulo,
  descricao,
  children,
}: {
  numero: string;
  titulo: string;
  descricao: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="m-0 text-sm text-muted">{numero}</p>
        <h1 className="m-0 text-3xl font-bold tracking-tight">{titulo}</h1>
        <p className="mt-2 mb-0 max-w-[70ch] text-muted">{descricao}</p>
      </div>
      {children}
    </div>
  );
}

export function LabRobo() {
  return (
    <Pagina
      numero="Laboratório"
      titulo="Robô do tabuleiro"
      descricao="O robô só entende comandos exatos. Planeje, execute e encontre o menor algoritmo de cada fase."
    >
      <RoboSim />
    </Pagina>
  );
}

export function LabLaco() {
  return (
    <Pagina
      numero="Laboratório"
      titulo="O laço que desenha"
      descricao="Cada repetição do para desenha um ponto. Mude um número e veja milhares de repetições mudarem juntas."
    >
      <LacoGrafico />
    </Pagina>
  );
}

export function LabOrdenacao() {
  return (
    <Pagina
      numero="Laboratório"
      titulo="Busca e ordenação"
      descricao="Veja Bolha, Seleção e Inserção ordenarem, compare quantas comparações cada um faz e descubra por que a busca binária é tão rápida."
    >
      <OrdenacaoSim />
    </Pagina>
  );
}

const MODOS_BINARIO: { valor: ModoBinario; rotulo: string }[] = [
  { valor: 'bits', rotulo: 'Ligar e desligar bits' },
  { valor: 'soma', rotulo: 'Somar em binário' },
  { valor: 'texto', rotulo: 'Texto em bytes' },
];

export function LabBinario() {
  const [modo, setModo] = useState<ModoBinario>('bits');
  const [bits, setBits] = useState<4 | 8>(8);
  return (
    <Pagina
      numero="Laboratório"
      titulo="Binário: a língua do computador"
      descricao="Computadores só sabem ligado e desligado. Veja como esses dois estados viram números, somas e letras."
    >
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="O que explorar" className="flex flex-wrap gap-2">
          {MODOS_BINARIO.map((m) => (
            <button
              key={m.valor}
              type="button"
              aria-pressed={modo === m.valor}
              onClick={() => setModo(m.valor)}
              className={`min-h-11 rounded-lg border px-4 font-medium ${
                modo === m.valor
                  ? 'border-primary bg-primary-soft'
                  : 'border-border hover:bg-surface-2'
              }`}
            >
              {m.rotulo}
            </button>
          ))}
        </div>
        {modo !== 'texto' && (
          <label className="ml-auto flex items-center gap-2 text-sm font-medium">
            Tamanho
            <select
              value={bits}
              onChange={(e) => setBits(e.target.value === '4' ? 4 : 8)}
              className="min-h-11 rounded-lg border border-border bg-surface px-3"
            >
              <option value={4}>4 bits</option>
              <option value={8}>8 bits (1 byte)</option>
            </select>
          </label>
        )}
      </div>
      <BinarioSim key={`${modo}-${bits}`} modo={modo} bits={bits} />
    </Pagina>
  );
}

const MODOS_PORTAS: { valor: ModoPortas; rotulo: string }[] = [
  { valor: 'porta', rotulo: 'Portas lógicas' },
  { valor: 'meio-somador', rotulo: 'Meio-somador' },
  { valor: 'somador-completo', rotulo: 'Somador completo' },
];

export function LabPortas() {
  const [modo, setModo] = useState<ModoPortas>('porta');
  return (
    <Pagina
      numero="Laboratório"
      titulo="Portas lógicas: de onde vem o processador"
      descricao="Pequenos circuitos que decidem 0 ou 1. Combinados, eles somam, comparam e executam programas."
    >
      <div role="group" aria-label="O que explorar" className="flex flex-wrap gap-2">
        {MODOS_PORTAS.map((m) => (
          <button
            key={m.valor}
            type="button"
            aria-pressed={modo === m.valor}
            onClick={() => setModo(m.valor)}
            className={`min-h-11 rounded-lg border px-4 font-medium ${
              modo === m.valor
                ? 'border-primary bg-primary-soft'
                : 'border-border hover:bg-surface-2'
            }`}
          >
            {m.rotulo}
          </button>
        ))}
      </div>
      <PortasSim key={modo} modo={modo} />
    </Pagina>
  );
}

export function LabCpu() {
  return (
    <Pagina
      numero="Laboratório"
      titulo="CPU: o ciclo buscar, decodificar, executar"
      descricao="Escreva um programa em assembly didático e veja registradores e memória mudarem a cada instrução."
    >
      <CpuSim
        editavel
        programa={`; soma 5 + 4 + 3 + 2 + 1 com um laço\nLDI A, 0\nLDI B, 5\nLDI C, 1\nsoma: ADD A, B\nSUB B, C\nJNZ B, soma\nSTORE A, [0]\nHALT`}
        memoria={[]}
      />
    </Pagina>
  );
}

export function LabTerminal() {
  return (
    <Pagina
      numero="Laboratório"
      titulo="Terminal: converse com o computador por texto"
      descricao="Navegue por pastas, crie arquivos e apague sem medo: tudo aqui é uma simulação."
    >
      <TerminalSim cenario="livre" />
    </Pagina>
  );
}

const SISTEMAS = [
  { id: 'processos', rotulo: 'Processos', el: () => <EscalonadorSim /> },
  { id: 'permissoes', rotulo: 'Permissões', el: () => <PermissoesSim /> },
  { id: 'redes', rotulo: 'IP e sub-redes', el: () => <RedeSim /> },
  { id: 'web', rotulo: 'Como abrir um site', el: () => <WebSim /> },
  { id: 'senhas', rotulo: 'Senhas', el: () => <SenhaSim /> },
] as const;

export function LabSistemas() {
  const [id, setId] = useState<(typeof SISTEMAS)[number]['id']>('processos');
  const atual = SISTEMAS.find((x) => x.id === id) ?? SISTEMAS[0];
  return (
    <Pagina
      numero="Laboratório"
      titulo="Sistemas, redes e segurança"
      descricao="Cinco simuladores para ver na prática como o sistema operacional, a rede e as senhas funcionam."
    >
      <div role="group" aria-label="O que explorar" className="flex flex-wrap gap-2">
        {SISTEMAS.map((x) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={id === x.id}
            onClick={() => setId(x.id)}
            className={`min-h-11 rounded-lg border px-4 font-medium ${id === x.id ? 'border-primary bg-primary-soft' : 'border-border hover:bg-surface-2'}`}
          >
            {x.rotulo}
          </button>
        ))}
      </div>
      {atual.el()}
    </Pagina>
  );
}

const DADOS = [
  { id: 'unidades', rotulo: 'Unidades', el: () => <UnidadesSim /> },
  { id: 'cache', rotulo: 'Cache', el: () => <CacheSim /> },
  { id: 'raid', rotulo: 'RAID', el: () => <RaidSim /> },
  { id: 'compressao', rotulo: 'Compressão', el: () => <CompressaoSim /> },
  { id: 'cesar', rotulo: 'Cifra de César', el: () => <CesarSim /> },
] as const;

export function LabDados() {
  const [id, setId] = useState<(typeof DADOS)[number]['id']>('unidades');
  const atual = DADOS.find((x) => x.id === id) ?? DADOS[0];
  return (
    <Pagina
      numero="Laboratório"
      titulo="Dados: guardar, acelerar, comprimir e proteger"
      descricao="Cinco simuladores sobre armazenamento, cache, RAID, compressão e criptografia."
    >
      <div role="group" aria-label="O que explorar" className="flex flex-wrap gap-2">
        {DADOS.map((x) => (
          <button
            key={x.id}
            type="button"
            aria-pressed={id === x.id}
            onClick={() => setId(x.id)}
            className={`min-h-11 rounded-lg border px-4 font-medium ${id === x.id ? 'border-primary bg-primary-soft' : 'border-border hover:bg-surface-2'}`}
          >
            {x.rotulo}
          </button>
        ))}
      </div>
      {atual.el()}
    </Pagina>
  );
}
