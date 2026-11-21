import { Link } from 'react-router';

export function NaoEncontrada() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Página não encontrada</h1>
      <p className="text-muted">O endereço não corresponde a nenhuma página da plataforma.</p>
      <Link to="/" className="font-semibold text-primary underline-offset-4 hover:underline">
        Voltar ao painel
      </Link>
    </div>
  );
}
