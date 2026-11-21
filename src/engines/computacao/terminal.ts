/**
 * Terminal simulado: um sistema de arquivos de mentira, em memória, com os comandos
 * básicos de Linux. O aluno pode errar à vontade — nada do computador real é tocado.
 */

export type No = { tipo: 'dir'; filhos: Record<string, No> } | { tipo: 'arq'; conteudo: string };

export interface EstadoTerminal {
  raiz: No;
  /** Diretório atual, como lista de nomes a partir da raiz. */
  cwd: string[];
}

export const HOME = ['home', 'aluno'];

const dir = (filhos: Record<string, No> = {}): No => ({ tipo: 'dir', filhos });
const arq = (conteudo = ''): No => ({ tipo: 'arq', conteudo });

export function estadoInicialTerminal(): EstadoTerminal {
  return {
    raiz: dir({
      home: dir({
        aluno: dir({
          'ola.txt': arq('Olá, mundo!'),
          documentos: dir({
            'notas.txt': arq('Estudar redes às 19h'),
            'lista.txt': arq('pão\nleite\ncafé'),
          }),
          projetos: dir({ site: dir({ 'index.html': arq('<h1>Meu site</h1>') }) }),
        }),
      }),
      tmp: dir(),
    }),
    cwd: [...HOME],
  };
}

export const caminhoTexto = (cwd: string[]) => {
  const casa = HOME.join('/');
  const t = cwd.join('/');
  if (t === casa) return '~';
  if (t.startsWith(casa + '/')) return '~/' + t.slice(casa.length + 1);
  return '/' + t;
};

/** Resolve um caminho (absoluto, relativo, "..", "~") em lista de nomes. */
export function resolver(cwd: string[], caminho: string): string[] {
  let partes: string[];
  if (caminho === '~' || caminho.startsWith('~/')) {
    partes = [...HOME, ...caminho.slice(1).split('/')];
  } else if (caminho.startsWith('/')) {
    partes = caminho.split('/');
  } else {
    partes = [...cwd, ...caminho.split('/')];
  }
  const saida: string[] = [];
  for (const p of partes) {
    if (!p || p === '.') continue;
    if (p === '..') saida.pop();
    else saida.push(p);
  }
  return saida;
}

export function buscar(raiz: No, caminho: string[]): No | undefined {
  let atual: No | undefined = raiz;
  for (const nome of caminho) {
    if (!atual || atual.tipo !== 'dir') return undefined;
    atual = atual.filhos[nome];
  }
  return atual;
}

/** Tokeniza respeitando aspas simples e duplas. */
export function tokenizar(linha: string): string[] {
  const out: string[] = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(linha))) out.push(m[1] ?? m[2] ?? m[3] ?? '');
  return out;
}

export interface Resultado {
  estado: EstadoTerminal;
  saida: string[];
  erro?: boolean;
}

export const COMANDOS = [
  'pwd',
  'ls',
  'cd',
  'mkdir',
  'touch',
  'cat',
  'echo',
  'rm',
  'cp',
  'mv',
  'help',
];

const AJUDA = [
  'Comandos disponíveis:',
  '  pwd              mostra onde você está',
  '  ls [pasta]       lista o conteúdo',
  '  cd pasta         entra numa pasta (cd .. volta, cd ~ vai para casa)',
  '  mkdir nome       cria uma pasta',
  '  touch nome       cria um arquivo vazio',
  '  cat arquivo      mostra o conteúdo de um arquivo',
  '  echo "texto" > arquivo    escreve texto num arquivo (>> acrescenta)',
  '  cp origem destino   copia um arquivo',
  '  mv origem destino   move ou renomeia',
  '  rm arquivo       apaga um arquivo (rm -r apaga pasta)',
];

/** Executa UMA linha de comando e devolve o novo estado e o que aparece na tela. */
export function executarComando(entrada: EstadoTerminal, linha: string): Resultado {
  const estado: EstadoTerminal = structuredClone(entrada);
  const tokens = tokenizar(linha.trim());
  if (tokens.length === 0) return { estado, saida: [] };

  // redirecionamento: echo "x" > arquivo
  let redir: { modo: '>' | '>>'; alvo: string } | null = null;
  const iRedir = tokens.findIndex((t) => t === '>' || t === '>>');
  if (iRedir !== -1) {
    const alvo = tokens[iRedir + 1];
    if (!alvo) return { estado, saida: ['Faltou o nome do arquivo depois de ">".'], erro: true };
    redir = { modo: tokens[iRedir] as '>' | '>>', alvo };
    tokens.splice(iRedir, 2);
  }

  const [cmd = '', ...args] = tokens;
  const falha = (msg: string): Resultado => ({ estado, saida: [msg], erro: true });
  const pai = (caminho: string[]): { dir: No | undefined; nome: string } => ({
    dir: buscar(estado.raiz, caminho.slice(0, -1)),
    nome: caminho[caminho.length - 1] ?? '',
  });

  switch (cmd) {
    case 'pwd':
      return { estado, saida: ['/' + estado.cwd.join('/')] };

    case 'help':
      return { estado, saida: AJUDA };

    case 'ls': {
      const alvo = args.find((a) => !a.startsWith('-'));
      const caminho = alvo ? resolver(estado.cwd, alvo) : estado.cwd;
      const no = buscar(estado.raiz, caminho);
      if (!no)
        return falha(`ls: não foi possível acessar '${alvo}': arquivo ou diretório inexistente`);
      if (no.tipo === 'arq') return { estado, saida: [alvo ?? ''] };
      const nomes = Object.keys(no.filhos)
        .sort()
        .map((n) => (no.filhos[n]?.tipo === 'dir' ? n + '/' : n));
      return { estado, saida: nomes.length ? [nomes.join('  ')] : [] };
    }

    case 'cd': {
      const alvo = args[0] ?? '~';
      const caminho = resolver(estado.cwd, alvo);
      const no = buscar(estado.raiz, caminho);
      if (!no) return falha(`cd: ${alvo}: arquivo ou diretório inexistente`);
      if (no.tipo === 'arq') return falha(`cd: ${alvo}: não é um diretório`);
      estado.cwd = caminho;
      return { estado, saida: [] };
    }

    case 'mkdir':
    case 'touch': {
      if (args.length === 0) return falha(`${cmd}: faltou o nome`);
      for (const nome of args) {
        const caminho = resolver(estado.cwd, nome);
        const { dir: d, nome: n } = pai(caminho);
        if (!n || !d || d.tipo !== 'dir')
          return falha(`${cmd}: não foi possível criar '${nome}': caminho inexistente`);
        if (d.filhos[n]) {
          if (cmd === 'mkdir') return falha(`mkdir: não foi possível criar '${nome}': já existe`);
          continue;
        }
        d.filhos[n] = cmd === 'mkdir' ? dir() : arq();
      }
      return { estado, saida: [] };
    }

    case 'cat': {
      if (args.length === 0) return falha('cat: faltou o nome do arquivo');
      const saida: string[] = [];
      for (const nome of args) {
        const no = buscar(estado.raiz, resolver(estado.cwd, nome));
        if (!no) return falha(`cat: ${nome}: arquivo ou diretório inexistente`);
        if (no.tipo === 'dir') return falha(`cat: ${nome}: é um diretório`);
        saida.push(...no.conteudo.split('\n'));
      }
      return { estado, saida };
    }

    case 'echo': {
      const texto = args.join(' ');
      if (!redir) return { estado, saida: [texto] };
      const caminho = resolver(estado.cwd, redir.alvo);
      const { dir: d, nome: n } = pai(caminho);
      if (!n || !d || d.tipo !== 'dir') return falha(`echo: ${redir.alvo}: caminho inexistente`);
      const atual = d.filhos[n];
      if (atual?.tipo === 'dir') return falha(`echo: ${redir.alvo}: é um diretório`);
      if (redir.modo === '>>' && atual?.tipo === 'arq') {
        atual.conteudo = atual.conteudo ? atual.conteudo + '\n' + texto : texto;
      } else {
        d.filhos[n] = arq(texto);
      }
      return { estado, saida: [] };
    }

    case 'rm': {
      const recursivo = args.some((a) => a === '-r' || a === '-rf');
      const nomes = args.filter((a) => !a.startsWith('-'));
      if (nomes.length === 0) return falha('rm: faltou o nome do arquivo');
      for (const nome of nomes) {
        const caminho = resolver(estado.cwd, nome);
        if (caminho.length === 0) return falha('rm: não é permitido apagar a raiz');
        if (
          estado.cwd.join('/').startsWith(caminho.join('/')) &&
          caminho.length <= estado.cwd.length
        ) {
          return falha(`rm: não é possível apagar '${nome}': você está dentro dele`);
        }
        const { dir: d, nome: n } = pai(caminho);
        const no = d?.tipo === 'dir' ? d.filhos[n] : undefined;
        if (!d || d.tipo !== 'dir' || !no)
          return falha(`rm: não foi possível remover '${nome}': inexistente`);
        if (no.tipo === 'dir' && !recursivo)
          return falha(`rm: não foi possível remover '${nome}': é um diretório (use rm -r)`);
        Reflect.deleteProperty(d.filhos, n);
      }
      return { estado, saida: [] };
    }

    case 'cp':
    case 'mv': {
      const [origem, destino] = args;
      if (!origem || !destino) return falha(`${cmd}: uso: ${cmd} origem destino`);
      const cOrigem = resolver(estado.cwd, origem);
      const no = buscar(estado.raiz, cOrigem);
      if (!no) return falha(`${cmd}: não foi possível obter '${origem}': inexistente`);
      if (no.tipo === 'dir' && cmd === 'cp')
        return falha('cp: use apenas com arquivos nesta simulação');
      let cDestino = resolver(estado.cwd, destino);
      const alvo = buscar(estado.raiz, cDestino);
      if (alvo?.tipo === 'dir') cDestino = [...cDestino, cOrigem[cOrigem.length - 1] ?? ''];
      const { dir: d, nome: n } = pai(cDestino);
      if (!n || !d || d.tipo !== 'dir') return falha(`${cmd}: destino '${destino}' inexistente`);
      d.filhos[n] = structuredClone(no);
      if (cmd === 'mv') {
        const { dir: dOrigem, nome: nOrigem } = pai(cOrigem);
        if (dOrigem?.tipo === 'dir' && cOrigem.join('/') !== cDestino.join('/'))
          Reflect.deleteProperty(dOrigem.filhos, nOrigem);
      }
      return { estado, saida: [] };
    }

    default:
      return falha(`${cmd}: comando não encontrado (digite help)`);
  }
}
