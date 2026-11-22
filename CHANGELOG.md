# Histórico de mudanças

Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).

## 2026-11-21

### Corrigido

- **Passada de leitura 3 — experiência de estudo:** as "Conexões" de
  Fundamentos agora apontam para a aula aprofundada em outra escola (com o
  título da aula) e as autorreferências citam a aula. No celular (360 px),
  medidas as 924 etapas: 7 estouravam a largura por URLs, código e nomes
  longos; o texto agora quebra e nenhuma estoura.

- **Passada de leitura 1 — Escola A (Fundamentos):** 49 questões de múltipla
  escolha tinham a resposta certa claramente mais longa e distratores pouco
  plausíveis; os distratores foram reescritos (resposta mais longa que todas as
  erradas caiu de 66% para 34% das questões). Dockerfile de exemplo atualizado
  de Node 20 (fora de suporte) para Node 22.
- **Passada de leitura 1 — todas as escolas:** o mesmo reequilíbrio de
  distratores foi aplicado a lógica, JavaScript, Python, SQL, redes,
  cibersegurança, web, bancos, POO, engenharia de software, infraestrutura, IA e
  UX/UI. Antes, a resposta certa era a mais longa em 55% a 100% das questões
  (UX 100%, POO 93%); agora as alternativas têm tamanho e plausibilidade
  parecidos, sobrando apenas casos de resposta curta (ex.: `const`, `===`).
- **Passada de leitura 1 — JavaScript, Python e SQL (revisão factual):** as 30
  aulas foram lidas (explicações, exemplos, respostas e contas dos bancos de
  exemplo). Um único erro: uma alternativa de SQL citava `IndexError` (erro de
  Python), agora trocada por uma alternativa coerente.
- **Passada de leitura 1 — Lógica, Redes, Cibersegurança e Web (revisão
  factual):** 25 aulas lidas, com conferência de contas (sub-redes e faixas de
  hosts, 26^8, 62^8, XOR, busca binária, passadas da bolha) e de portas e
  protocolos. Um ajuste: a questão de Redes sobre "o menor prefixo que comporta
  50 equipamentos" era ambígua (o menor número de prefixo seria /25); agora
  pergunta o prefixo com menor desperdício de endereços.
- **Passada de leitura 1 — Bancos, POO, Engenharia de Software, Infraestrutura,
  IA e UX (revisão factual):** 30 aulas lidas, com conferência de todas as
  contas e saídas de código. Dois ajustes: em POO (aula 5), uma questão escrita
  como "prever a saída" tinha a resposta aceita invertida ("o Carro fica
  proibido de usar o motor") e virou múltipla escolha; em UX (aula 3), a
  estatística de deficiência passou de "1 em cada 4" (dado dos EUA) para "1 em
  cada 6 no mundo" (OMS). Com isso, a passada 1 cobre as 14 disciplinas.
- **Passada de leitura 2 — consistência (início):** Fundamentos (aula de
  criptografia) dizia que o SHA-256 serve para guardar senhas, contradizendo a
  aula de Cibersegurança (hash lento com sal: bcrypt, Argon2). Texto e cartão de
  revisão alinhados.
- **Passada de leitura 2 — nomes nas "Conexões":** as caixas de conexão
  citavam as escolas com nomes diferentes ("Segurança", "Web", "Banco de
  Dados", "Redes"...). Agora usam os nomes reais das escolas (Cibersegurança,
  HTML, CSS e a Web, SQL ou Modelagem e Projeto de Bancos de Dados, Redes de
  Computadores, Fundamentos da Computação, Infraestrutura e Servidores...). Áreas
  que ainda não são escolas (Engenharia de Dados, DevOps, Matemática,
  Estatística, React...) foram mantidas como sugestão de caminho. 98 arquivos,
  só texto.

### Adicionado

- **Escola E — UX/UI Design**, módulo 1 "Design centrado no usuário" (5 aulas):
  UX e pesquisa, usabilidade, cor e acessibilidade, layout e design systems,
  prototipação e teste de usabilidade; termos novos no glossário e 5 desafios de
  programação. Com esta, as 12 escolas (A a L) têm conteúdo publicado.
- **Escola K — Inteligência Artificial**, módulo 1 "IA na prática" (5 aulas):
  aprendizado de máquina, k-NN, avaliação de modelos, redes neurais e IA
  generativa com uso responsável; termos novos no glossário e 5 desafios de
  programação.
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
