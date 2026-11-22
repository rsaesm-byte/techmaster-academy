# Histórico de mudanças

Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).

## 2026-11-21

### Adicionado

- **Escola J — Infraestrutura e Servidores**, módulo 1 "Servidores no mundo real"
  (5 aulas): disponibilidade e SLA, Linux e logs, contêineres, nuvem e escalabilidade,
  monitoramento e recuperação de desastres; 3 termos novos e 5 desafios de programação.
- **Escola F — Engenharia de Software**, módulo 1 "Do requisito à entrega" (5 aulas):
  métodos ágeis, Git, testes automatizados, requisitos e histórias de usuário, e
  qualidade com CI/CD; 4 termos novos e 5 desafios de programação.
- **Escola G — Programação Orientada a Objetos**, disciplina com módulo 1
  "Pensando em objetos" (5 aulas): classes e objetos, encapsulamento, herança,
  polimorfismo e interfaces, composição e SOLID; 5 termos novos e 5 desafios
  de programação, todos com JavaScript executável.
- **Escola H — Banco de Dados**, disciplina "Modelagem e Projeto de Bancos de Dados",
  módulo 1 "Projetando bancos confiáveis" (5 aulas): modelagem, normalização,
  chaves e integridade, índices e desempenho, transações e ACID; 5 termos novos
  e 2 desafios de programação. O limite de tamanho do app subiu de 260 para 280 KB.
- **Escola D — Desenvolvimento Web**, disciplina "HTML, CSS e a Web", módulo 1
  (5 aulas): HTML semântico, CSS e a cascata, Flexbox e design responsivo,
  formulários e acessibilidade, e o projeto de um portfólio publicado no GitHub
  Pages; 7 termos novos no glossário.
- Nova simulação **`editor`**: editor de HTML, CSS e JS com prévia ao vivo dentro
  da aula, na mesma iframe isolada do Editor Web. Blocos de código agora aceitam
  as linguagens `html` e `css`.
- **Escola L — Cibersegurança**, disciplina "Fundamentos de Cibersegurança",
  módulo 1 "Defesa em profundidade" (5 aulas): tríade CIA, senhas com hash e MFA,
  phishing, injeção de SQL (com demo no banco de treino) e higiene de segurança
  com backup 3-2-1; 7 termos novos e 4 desafios de programação.
- O motor de SQL aceita um valor literal no lado esquerdo de uma condição
  (por exemplo `1 = 1`).
- **Redes, módulo 2 "Operando e protegendo a rede"** (5 aulas): diagnóstico com
  ping, traceroute e nslookup; Wi-Fi seguro; HTTPS e TLS; VPN e túneis; e o
  projeto da rede de um escritório. Três desafios de programação novos
  (`diagnosticar`, `usaVpn`, `prefixoPara`).
- **Escola I — Arquitetura de Redes**, disciplina "Redes de Computadores",
  módulo 1 (5 aulas): modelo em camadas e encapsulamento, sub-redes (VLSM),
  roteamento, TCP, UDP e portas, e DHCP, NAT e firewall; 9 termos novos no
  glossário e dois desafios de programação. Tem pedaço próprio (`aulas-redes`),
  então não pesa no app.
- **Escola C — Python, módulo 2 "Python no dia a dia"** (5 aulas): textos e métodos,
  tuplas e conjuntos, arquivos com open/with, erros com try/except e módulos com
  pip e ambientes virtuais; 5 termos novos no glossário.
- **Escola C — SQL, módulo 2 "Refinando e alterando dados"** (5 aulas): DISTINCT,
  IN, NULL e apelidos; HAVING; LEFT JOIN; INSERT e UPDATE; DELETE e cuidados.
  5 termos novos no glossário.
- Motor de SQL ampliado (HAVING, LEFT JOIN, DISTINCT, IN, IS NULL, apelidos,
  INSERT, UPDATE e DELETE, com proteção da chave primária). O simulador guarda as
  alterações do banco, e exercícios que alteram dados são corrigidos comparando o
  estado final das tabelas.
- Novo tipo de questão **consulta SQL**: você escreve a consulta e o app compara
  as colunas e as linhas do resultado com o esperado (a ordem só conta quando o
  exercício pede ORDER BY), com feedback específico. Os desafios das 5 aulas de SQL
  agora usam esse tipo, e o CI confere que cada solução de referência passa.
- **Escola C — SQL, módulo 1 "Consultando dados"** (5 aulas): SELECT, WHERE,
  ORDER BY e LIMIT, agregações com GROUP BY e JOIN; 5 termos novos no glossário.
- Banco de dados de treino dentro do app (simulação `sql`): motor de SQL próprio
  com SELECT, WHERE (AND, OR, LIKE), JOIN, GROUP BY, ORDER BY e LIMIT, testado, e
  teste que confere cada resposta numérica das aulas contra o motor.
- **JavaScript, módulo 3 "Projeto: app de tarefas"** (5 aulas): estado e funções
  puras, tela com DOM, salvar no navegador, consumir uma API e testar.

### Alterado

- Orçamento de tamanho: o limite agora separa o app (260 KB) das aulas (700 KB,
  carregadas só ao abrir a disciplina); Fundamentos foi dividido em dois pedaços.

- **JavaScript, módulo 2 "JavaScript na web"** (5 aulas): JSON, desestruturação e
  spread, DOM e eventos, erros com try/catch, assíncrono com Promises e async/await.
- **Fundamentos, módulo 4 "Infraestrutura moderna"** (5 aulas): Virtualização,
  Contêineres e Docker, Computação em nuvem, Git, Bancos de dados e SQL.
- **Escola C — Python, módulo 1** (5 aulas): variáveis e f-strings, condicionais,
  listas e laços, funções, dicionários e compreensões, sempre comparadas com
  JavaScript no console.
- A tela de Escolas lista várias disciplinas por escola; 10 termos novos no glossário.
- **Escola C — JavaScript, módulo 1 "Primeiros passos em JavaScript"** (5 aulas
  completas): Variáveis e tipos, Condicionais, Laços e arrays, Funções e arrow
  functions, Objetos com map/filter/reduce; 7 termos novos no glossário.
- Console de JavaScript nas demonstrações (simulação `js`) e exercícios de
  programação corrigidos automaticamente por casos de teste, executados num
  Web Worker isolado, sem rede e com limite de 2 s.
- **Fundamentos, módulo 3 — "Dados: guardar, acelerar, comprimir e proteger"**
  (5 aulas completas): Unidades de dados, Hierarquia de memória e cache,
  Armazenamento (SSD, HD, RAID e backup), Compressão e Criptografia; 8 termos
  novos no glossário.
- Laboratório **Dados** com 5 simuladores: unidades (base 1000 × 1024), cache
  (LRU e FIFO), RAID 0/1/5 com falha de disco, compressão RLE e cifra de César
  com força bruta.
- **Fundamentos, módulo 2 — "Sistemas, redes e segurança"** (5 aulas completas):
  Sistema operacional e processos, Permissões de arquivo, IP e sub-redes, DNS e
  HTTP, Senhas e segurança; 10 termos novos no glossário.
- Laboratório **Sistemas, redes e segurança** com 5 simuladores: escalonador de
  processos (FIFO e Round Robin), permissões (rwx e octal), calculadora de IP e
  sub-rede, passo a passo de abrir um site (DNS e HTTP) e força de senha.
- O conteúdo das aulas agora vai em pedaços de JavaScript próprios (um por
  disciplina), mantendo o código do app dentro do orçamento de tamanho.
- **Escola A — "Fundamentos da Computação"** (5 aulas completas): Bits e binário,
  Texto e hexadecimal, Portas lógicas, CPU e memória, Arquivos e terminal;
  15 termos novos no glossário.
- Laboratórios novos: **Binário** (bits, soma com vai-um, texto em bytes),
  **Portas lógicas** (AND/OR/XOR..., meio-somador e somador completo),
  **CPU e memória** (assembly didático com ciclo buscar–decodificar–executar) e
  **Terminal** simulado (sistema de arquivos de mentira, com missões).
- Montador de aulas (`content/fundamentos/montar.ts`) para as aulas da escola A.
- **Módulo 2 de Lógica — "Organizando dados e código"**: Vetores, Funções e
  procedimentos, Busca linear e binária, Ordenação e Recursividade (5 aulas
  completas, 13 termos novos no glossário).
- **Sincronização entre aparelhos** via Gist privado do aluno (token com escopo
  `gist`), com junção sem perda de progresso e indicador no topo.
- **Nova identidade visual**: ícone hexagonal neon com "T" de circuito; ícones
  PNG e maskable para instalar no Android e no iPhone.
- Laboratório de busca e ordenação (bolha, seleção, inserção, linear, binária).
- Portugol com vetores, funções, procedimentos, recursão e pilha de chamadas.
- Tutor de pistas, diagnóstico adaptativo, recomendações, "Meu progresso" e
  conquistas.
- Testes de ponta a ponta (Playwright, desktop e celular) e orçamento de
  tamanho do JavaScript no CI.
- Documentação: arquitetura, guia de autoria de aulas e ADR 0002.

### Corrigido

- O app não quebra mais quando o navegador bloqueia o service worker.

## Antes

- Fundação (Fase 2): React + TypeScript, temas, testes, CI e deploy no GitHub
  Pages; módulo 1 de Lógica, revisão espaçada, glossário, busca, laboratórios,
  modo offline e Editor Web isolado.
