/** Os passos de abrir um site: DNS, conexão, pedido HTTP e resposta. */
export interface Site {
  dominio: string;
  ip: string;
}
export const SITES: Site[] = [
  { dominio: 'exemplo.com.br', ip: '203.0.113.10' },
  { dominio: 'techmaster.dev', ip: '198.51.100.24' },
  { dominio: 'escola.org', ip: '192.0.2.77' },
];

export interface PassoWeb {
  titulo: string;
  de: 'navegador' | 'dns' | 'servidor';
  para: 'navegador' | 'dns' | 'servidor';
  mensagem: string;
  explicacao: string;
}

export function passosDoAcesso(s: Site, caminho = '/'): PassoWeb[] {
  return [
    {
      titulo: '1. Pergunta ao DNS',
      de: 'navegador',
      para: 'dns',
      mensagem: `Qual é o IP de ${s.dominio}?`,
      explicacao:
        'O navegador só sabe nomes; para falar com um servidor ele precisa do endereço IP.',
    },
    {
      titulo: '2. Resposta do DNS',
      de: 'dns',
      para: 'navegador',
      mensagem: `${s.dominio} está em ${s.ip}`,
      explicacao: 'O DNS é a "lista telefônica" da internet: traduz nomes em endereços IP.',
    },
    {
      titulo: '3. Conexão com o servidor',
      de: 'navegador',
      para: 'servidor',
      mensagem: `Olá, ${s.ip}! Quero abrir uma conexão segura (HTTPS).`,
      explicacao: 'Antes de pedir a página, os dois combinam a conexão e a criptografia (TLS).',
    },
    {
      titulo: '4. Pedido HTTP',
      de: 'navegador',
      para: 'servidor',
      mensagem: `GET ${caminho} HTTP/1.1 · Host: ${s.dominio}`,
      explicacao:
        'GET significa "me entregue este recurso". O Host diz qual site é, pois um servidor pode hospedar vários.',
    },
    {
      titulo: '5. Resposta HTTP',
      de: 'servidor',
      para: 'navegador',
      mensagem: '200 OK · Content-Type: text/html · (o código da página)',
      explicacao:
        'O código 200 significa sucesso. Já 404 é "não encontrado" e 500 é "erro no servidor".',
    },
    {
      titulo: '6. Navegador desenha a página',
      de: 'navegador',
      para: 'navegador',
      mensagem: 'Lê o HTML, pede CSS, imagens e scripts e monta a página.',
      explicacao:
        'Cada arquivo extra é outro pedido HTTP. Uma página pode precisar de dezenas deles.',
    },
  ];
}
