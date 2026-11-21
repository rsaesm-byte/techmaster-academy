import type { Etapa } from '@/domain/conteudo';

export function tituloEtapa(e: Etapa): string {
  switch (e.tipo) {
    case 'resumo':
      return 'Resumo';
    case 'flashcards':
      return 'Flashcards';
    case 'conexoes':
      return 'Conexões e aplicação profissional';
    default:
      return e.titulo;
  }
}

/** Fases da aula — o ciclo entender → ver → praticar → lembrar. */
export function faseEtapa(e: Etapa): 'Entender' | 'Ver' | 'Praticar' | 'Lembrar' {
  switch (e.tipo) {
    case 'diagnostico':
    case 'analogia':
      return 'Entender';
    case 'explicacao':
      return e.nivel === 'simples' ? 'Entender' : 'Ver';
    case 'diagrama':
    case 'exemplo':
    case 'demo':
      return 'Ver';
    case 'exercicio':
      return 'Praticar';
    default:
      return 'Lembrar';
  }
}
