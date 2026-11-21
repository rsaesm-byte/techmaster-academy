import { aulas, disciplinas, glossario } from '@content/index';
import { montarCatalogo } from '@/content/catalogo';

/** Catálogo validado. Se o conteúdo tiver erro, o teste "conteúdo válido" falha antes do deploy. */
export const catalogo = montarCatalogo(disciplinas, aulas, glossario);
