# Histórico de mudanças

Formato inspirado em [Keep a Changelog](https://keepachangelog.com/pt-BR/).

## 2026-11-21

### Adicionado

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
