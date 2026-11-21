import { Link } from 'react-router';

const LABS = [
  {
    para: '/lab/algoritmos',
    nome: 'Visualizador de Algoritmos',
    descricao: 'Execute Portugol linha por linha e veja a memória mudar.',
  },
  {
    para: '/lab/robo',
    nome: 'Robô do tabuleiro',
    descricao: 'Monte algoritmos com comandos exatos e leve o robô até a bandeira.',
  },
  {
    para: '/lab/laco',
    nome: 'O laço que desenha',
    descricao: 'Veja milhares de repetições formarem um desenho (WebGL).',
  },
  {
    para: '/lab/ordenacao',
    nome: 'Busca e ordenação',
    descricao: 'Compare bolha, seleção, inserção e as buscas linear e binária, passo a passo.',
  },
  {
    para: '/lab/binario',
    nome: 'Binário',
    descricao: 'Ligue bits, some em binário e veja letras virarem bytes.',
  },
  {
    para: '/lab/web',
    nome: 'Editor Web',
    descricao: 'HTML, CSS e JavaScript com prévia ao vivo, isolada e segura.',
  },
];

export default function Labs() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="m-0 text-3xl font-bold tracking-tight">Laboratórios</h1>
      <p className="m-0 max-w-[70ch] text-muted">
        Espaços para experimentar sem medo de errar. Tudo roda no seu navegador, com dados
        fictícios.
      </p>
      <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2">
        {LABS.map((l) => (
          <li key={l.para}>
            <Link
              to={l.para}
              className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface p-5 no-underline hover:border-primary"
            >
              <span className="text-lg font-semibold text-text">{l.nome}</span>
              <span className="text-muted">{l.descricao}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
