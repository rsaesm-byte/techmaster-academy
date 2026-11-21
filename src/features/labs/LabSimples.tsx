import type { ReactNode } from 'react';
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
