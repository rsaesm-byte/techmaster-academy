/**
 * Painel inicial — por enquanto uma página de boas-vindas.
 * Ganha "continuar estudando", revisões e progresso quando esses dados existirem
 * (itens 5 a 12 do backlog). Não mostramos números falsos aqui.
 */
export function Painel() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Bem-vindo à TechMaster Academy</h1>
      <p className="max-w-[70ch] text-lg text-muted">
        Aqui você aprende tecnologia em quatro passos: entender, ver, fazer e lembrar. A primeira
        trilha, <strong className="text-text">Lógica de Programação</strong>, está em construção.
      </p>
      <section aria-labelledby="status" className="rounded-xl border border-border bg-surface p-6">
        <h2 id="status" className="text-lg font-semibold">
          Situação do projeto
        </h2>
        <ul className="mt-3 flex flex-col gap-2 text-muted">
          <li>
            <span className="font-semibold text-success">Pronto:</span> estrutura, temas claro e
            escuro, publicação automática.
          </li>
          <li>
            <span className="font-semibold text-primary">Próximo:</span> contratos de conteúdo,
            progresso salvo e a primeira aula.
          </li>
        </ul>
      </section>
    </div>
  );
}
