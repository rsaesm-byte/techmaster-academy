import { associar, completar, mc, montar, prever, programaJs } from '../fundamentos/montar';

export const inf02 = montar({
  id: 'infra.m01.a02',
  titulo: 'Linux no servidor: serviços e logs',
  objetivo: 'Operar um servidor Linux: serviços, processos e leitura de logs para achar problemas.',
  pre: ['infra.m01.a01'],
  min: 30,
  diag: mc(
    'O site caiu. Qual é um bom primeiro passo para descobrir por quê?',
    'Ler os logs do serviço',
    [
      ['Reinstalar tudo imediatamente', 'Isso apaga evidências e pode nem resolver.'],
      ['Reiniciar o computador sem olhar nada', 'Pode esconder a causa.'],
    ],
    'Logs contam o que aconteceu.',
  ),
  simples: {
    titulo: 'O diário do servidor',
    texto:
      'A maioria dos servidores usa **Linux**. Três conceitos do dia a dia:\n\n- **Processo:** um programa em execução (`ps`, `top`).\n- **Serviço (daemon):** processo que roda em segundo plano, como `nginx` ou `sshd`, controlado por `systemctl`.\n- **Log:** arquivo onde o programa registra o que faz, em `/var/log`.\n\nUma linha de log típica:\n\n```\n2026-11-21 10:03:12 ERROR Falha ao conectar no banco\n```\n\nO **nível** indica a gravidade: DEBUG, INFO, WARN e ERROR.\n\nFerramentas úteis:\n- `tail -f arquivo.log`: acompanha ao vivo.\n- `grep ERROR arquivo.log`: filtra erros.\n- `journalctl -u nginx`: logs de um serviço.',
    essencial:
      'Serviços rodam em segundo plano (systemctl). Logs em /var/log contam a história; filtre por nível com grep e acompanhe com tail -f.',
    guiado:
      'Diagnóstico básico:\n1. `systemctl status serviço` mostra se está ativo.\n2. `journalctl -u serviço -n 50` lê as últimas linhas.\n3. `grep ERROR` filtra o problema.\n4. Veja disco e memória (`df -h`, `free -m`).\n5. Corrija a causa e reinicie só se for preciso.',
    tecnico:
      'O **systemd** gerencia os serviços (unidades `.service`), com `start`, `stop`, `restart`, `enable` (iniciar no boot) e `status`. Os logs do sistema ficam no **journal**, consultado com `journalctl`. **Logrotate** limita o tamanho dos arquivos de log. Disco cheio (por logs) é uma causa clássica de queda. **Logs estruturados** (JSON) facilitam buscas em ferramentas como ELK e Loki. Nunca registre senhas ou dados pessoais nos logs.',
  },
  analogia: {
    titulo: 'Caixa-preta do avião',
    texto:
      'Depois de um incidente, investigadores leem a caixa-preta. Os logs são a caixa-preta do servidor: sem eles, você só adivinha o que houve.',
    limites: 'Log demais atrapalha: o importante se perde no ruído e o disco enche.',
  },
  demo: {
    titulo: 'Contando erros no log',
    instrucoes:
      'Execute e veja quantas linhas são de cada nível. Adicione linhas e veja a contagem mudar.',
    simulacao: {
      tipo: 'js',
      codigo:
        'const logs = [\n  "INFO Servidor iniciado",\n  "ERROR Falha ao conectar no banco",\n  "WARN Memória em 85%",\n  "ERROR Timeout na requisição",\n  "INFO Requisição ok",\n];\nconst contagem = {};\nfor (const linha of logs) {\n  const nivel = linha.split(" ")[0];\n  contagem[nivel] = (contagem[nivel] || 0) + 1;\n}\nconsole.log(JSON.stringify(contagem));',
    },
  },
  tecnica: {
    titulo: 'Níveis de log',
    texto:
      '**DEBUG:** detalhes para desenvolver.\n**INFO:** eventos normais.\n**WARN:** algo estranho, mas funcionando.\n**ERROR:** falha que precisa de atenção.\nEm produção, costuma-se registrar de INFO para cima.',
  },
  diagrama: {
    titulo: 'Investigando uma queda',
    nos: [
      { forma: 'inicio', texto: 'Alerta: serviço fora do ar' },
      { forma: 'passo', texto: 'Ver o estado: systemctl status' },
      { forma: 'passo', texto: 'Ler os logs: journalctl e grep ERROR' },
      { forma: 'fim', texto: 'Corrigir a causa e confirmar que voltou' },
    ],
    descricao: 'Primeiro entenda, depois aja.',
  },
  exemplo: {
    titulo: 'Comandos de diagnóstico',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'systemctl status nginx\njournalctl -u nginx -n 20\ngrep ERROR /var/log/app.log | tail -5\ndf -h',
    },
    comentarios: [
      { linha: 1, texto: 'O serviço está ativo?' },
      { linha: 2, texto: 'Últimas 20 linhas do log dele.' },
      { linha: 3, texto: 'Últimos 5 erros do aplicativo.' },
      { linha: 4, texto: 'Será que o disco encheu?' },
    ],
  },
  guiado: [
    prever(
      'O que o código imprime?',
      'const logs = ["INFO a", "ERROR b", "ERROR c", "WARN d"];\nconsole.log(logs.filter((l) => l.startsWith("ERROR")).length);',
      ['2'],
      'Duas linhas começam com ERROR.',
      [{ resposta: '1', feedback: 'Conte as duas linhas de erro.' }],
    ),
    mc(
      'Qual comando acompanha um log ao vivo?',
      'tail -f, que segue o fim do arquivo e mostra as linhas novas',
      [
        [
          'ls -l, que lista os arquivos da pasta com seus detalhes',
          'Esse só lista arquivos; não acompanha o log.',
        ],
        ['cd, que entra na pasta onde o log está sendo gravado', 'Esse só muda de pasta.'],
      ],
      'O -f significa "follow".',
    ),
  ],
  indep: [
    prever(
      'O que o código imprime?',
      'const linha = "WARN Memória em 85%";\nconsole.log(linha.split(" ")[0]);',
      ['WARN'],
      'O primeiro pedaço antes do espaço é o nível.',
      [{ resposta: '85%', feedback: 'Pegue o índice 0.' }],
    ),
    mc(
      'Por que não registrar senhas nos logs?',
      'Os logs são lidos por muita gente e podem vazar',
      [
        [
          'Porque registrar senhas deixa a gravação do log mais lenta',
          'O problema é de segurança, não de desempenho.',
        ],
        [
          'Porque o Linux bloqueia a gravação de senhas em arquivos de log',
          'Ele permite, mas não é seguro.',
        ],
      ],
      'Segredos nunca em log.',
    ),
  ],
  desafio: programaJs(
    'Escreva contarNiveis(logs): cada linha começa com o nível (ERROR, WARN, INFO...). Devolva um objeto que conta quantas linhas há de cada nível.',
    'function contarNiveis(logs) {\n  // seu código aqui\n}',
    'function contarNiveis(logs) {\n  const total = {};\n  for (const linha of logs) {\n    const nivel = linha.split(" ")[0];\n    total[nivel] = (total[nivel] || 0) + 1;\n  }\n  return total;\n}',
    'contarNiveis',
    [
      { argumentos: [['ERROR a', 'INFO b', 'ERROR c']], esperado: { ERROR: 2, INFO: 1 } },
      { argumentos: [[]], esperado: {} },
      { argumentos: [['WARN x']], esperado: { WARN: 1 } },
    ],
    ['O nível é a primeira palavra da linha.', 'Use um objeto como contador.'],
    'Contar por categoria é a base de qualquer painel de monitoramento.',
  ),
  rec: [
    associar(
      'Associe o comando ao que ele faz.',
      [
        ['systemctl status', 'Mostra o estado de um serviço'],
        ['journalctl -u', 'Lê os logs de um serviço'],
        ['grep', 'Filtra linhas por um texto'],
        ['df -h', 'Mostra o uso de disco'],
      ],
      'Comandos de operação.',
    ),
    completar(
      'Complete o comando que acompanha o final de um log em tempo real.',
      'tail ___ /var/log/app.log',
      [{ aceitas: ['-f'], feedback: '-f segue o arquivo enquanto ele cresce.' }],
      'Muito usado em incidentes.',
    ),
  ],
  explique: {
    enunciado: 'Explique como diagnosticar um serviço fora do ar usando o estado e os logs.',
    modelo:
      'Primeiro confira o estado do serviço com systemctl status. Depois leia os logs com journalctl ou tail e filtre por ERROR com grep. Verifique também disco e memória, corrija a causa e só então reinicie o serviço para confirmar que voltou.',
    rubrica: [
      'Citou o estado do serviço',
      'Citou a leitura e o filtro de logs',
      'Mencionou checar recursos e corrigir a causa',
    ],
  },
  resumo: [
    'Serviços são controlados por systemctl.',
    'Logs ficam em /var/log ou no journal.',
    'grep filtra, tail -f acompanha.',
    'Nunca registre segredos.',
  ],
  cards: [
    ['O que é um daemon?', 'Processo que roda em segundo plano.'],
    ['Onde ficam os logs?', 'Em /var/log e no journal.'],
    ['O que faz o grep?', 'Filtra linhas por texto.'],
    ['Quais são os níveis de log?', 'DEBUG, INFO, WARN, ERROR.'],
  ],
  conexoes: {
    disciplinas: [
      'Fundamentos da Computação: terminal e permissões do Linux.',
      'Cibersegurança: logs ajudam a detectar invasões.',
      'Engenharia de Software: logs estruturados na aplicação.',
    ],
    profissional:
      'Ler logs com rapidez é uma das habilidades que mais separam quem opera sistemas com confiança.',
  },
});
