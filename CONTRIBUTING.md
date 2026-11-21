# Como contribuir

1. Crie uma branch a partir da `main`: `git switch -c minha-mudanca`.
2. Faça a alteração e rode `npm run check` — ele precisa passar.
3. Abra um pull request explicando o quê e o porquê.

Regras do projeto:

- TypeScript estrito; nada de `any`.
- Cores só pelos tokens (`bg-surface`, `text-muted`...), nunca hex direto (exceção: a marca, em `src/ui/Logo.tsx` e `public/icones/`).
- Conteúdo novo: siga o [guia de autoria](docs/CONTEUDO.md).
- Todo controle precisa funcionar pelo teclado e ter rótulo.
- Testes para toda lógica nova.
- Dados de exemplo e simulações sempre identificados como tal.
