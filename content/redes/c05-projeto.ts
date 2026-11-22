import {
  associar,
  completar,
  mc,
  montar,
  ordenar,
  prever,
  programaJs,
} from '../fundamentos/montar';

export const r10 = montar({
  id: 'redes.m02.a05',
  titulo: 'Projeto: a rede de um escritório',
  objetivo: 'Planejar a rede de um pequeno escritório: setores, sub-redes, segurança e serviços.',
  pre: ['redes.m02.a04'],
  min: 40,
  diag: mc(
    'Por que separar setores (vendas, TI, visitantes) em sub-redes diferentes?',
    'Para isolar o tráfego e aplicar regras de acesso diferentes a cada setor',
    [
      [
        'Para gastar mais endereços e deixar a rede maior',
        'Não é esse o motivo: é isolamento e controle.',
      ],
      [
        'Porque o roteador exige uma sub-rede para cada setor',
        'O roteador não exige; a separação é uma boa prática.',
      ],
    ],
    'Segmentação organiza e limita o estrago de um incidente.',
  ),
  simples: {
    titulo: 'Juntando tudo',
    texto:
      'Um projeto de rede combina o que você aprendeu:\n\n1. **Levantar a demanda:** quantos equipamentos em cada setor (com folga de 20 a 30%).\n2. **Endereçar:** uma sub-rede por setor, dimensionada com VLSM.\n3. **Segmentar:** VLANs e regras de firewall entre os setores.\n4. **Serviços:** DHCP, DNS, gateway, Wi-Fi seguro, VPN para trabalho remoto.\n5. **Documentar:** tabela de endereços e diagrama.\n\n**Regra de ouro:** visitantes jamais alcançam a rede interna; servidores ficam numa zona separada.',
    essencial:
      'Levante a demanda, dimensione sub-redes, segmente com regras de firewall e documente tudo.',
    guiado:
      'Exemplo: 10.10.0.0/24 para Vendas (50), TI (20), Visitantes (10) e Servidores (8):\n1. Vendas: 62 hosts → /26.\n2. TI: 30 hosts → /27.\n3. Servidores: 14 hosts → /28.\n4. Visitantes: 14 hosts → /28.\nAloque do maior para o menor, em blocos alinhados.',
    tecnico:
      'Em um switch, a segmentação em camada 2 é feita com **VLANs**, e o roteador (ou um switch de camada 3) liga as VLANs, aplicando regras de firewall entre elas. Boas práticas: **menor privilégio** (cada setor acessa só o necessário), servidores numa zona própria (**DMZ**, se expostos à internet), monitoramento com logs, backups e **inventário** atualizado. Deixe espaço de crescimento: reservar blocos livres evita renumerar a rede depois.',
  },
  analogia: {
    titulo: 'Planta de um prédio',
    texto:
      'Projetar a rede é desenhar a planta: salas (sub-redes) do tamanho certo, portas com fechaduras (firewall) entre elas, uma portaria (gateway) e uma recepção separada para visitantes.',
    limites:
      'Diferente do prédio, a rede se redesenha por software, mas mudar depois de pronta dá trabalho.',
  },
  demo: {
    titulo: 'Conferindo uma sub-rede',
    instrucoes:
      'O IP 10.10.0.70 com /27 pertence à rede da TI (.64). Confira a faixa de hosts e o broadcast, e depois teste um IP de outro setor.',
    simulacao: { tipo: 'rede', ip: '10.10.0.70', cidr: 27 },
  },
  tecnica: {
    titulo: 'Tabela de endereçamento',
    texto:
      '**Vendas** (50 equipamentos): 10.10.0.0/26, hosts .1 a .62.\n**TI** (20): 10.10.0.64/27, hosts .65 a .94.\n**Servidores** (8): 10.10.0.96/28, hosts .97 a .110.\n**Visitantes** (10): 10.10.0.112/28, hosts .113 a .126.\nSobra de .128 em diante para crescer.',
  },
  diagrama: {
    titulo: 'Etapas do projeto',
    nos: [
      { forma: 'inicio', texto: 'Levantar equipamentos por setor' },
      { forma: 'passo', texto: 'Dimensionar sub-redes e alocar os blocos' },
      { forma: 'passo', texto: 'Definir regras de acesso entre os setores' },
      { forma: 'fim', texto: 'Configurar serviços, testar e documentar' },
    ],
    descricao: 'Do levantamento à documentação.',
  },
  exemplo: {
    titulo: 'Regras entre setores',
    codigo: {
      linguagem: 'pseudocodigo',
      fonte:
        'Vendas -> Servidores: permitir 443\nTI -> Servidores: permitir 22\nVisitantes -> qualquer interno: negar\nTudo -> internet: permitir 80 e 443',
    },
    comentarios: [
      { linha: 1, texto: 'Vendas só precisa do sistema web.' },
      { linha: 2, texto: 'Só a TI administra os servidores.' },
      { linha: 3, texto: 'Visitantes só têm saída para a internet.' },
    ],
  },
  guiado: [
    prever(
      'Quantos equipamentos cabem numa sub-rede /28?',
      'console.log(2 ** (32 - 28) - 2);',
      ['14'],
      '4 bits de equipamento: 16 endereços menos 2.',
      [{ resposta: '16', feedback: 'Desconte o endereço de rede e o de broadcast.' }],
    ),
    mc(
      'Qual prefixo comporta o setor de Vendas, com 50 equipamentos?',
      '/26',
      [
        ['/27', 'Só comporta 30.'],
        ['/28', 'Só comporta 14.'],
      ],
      '/26 comporta 62.',
    ),
  ],
  indep: [
    mc(
      'Onde ficam os servidores, em um bom projeto?',
      'Em uma zona própria, com regras de acesso restritas',
      [
        [
          'Na mesma rede dos visitantes, para facilitar o acesso',
          'Servidores precisam de acesso restrito.',
        ],
        [
          'Em qualquer setor, desde que haja espaço disponível',
          'A posição importa para a segurança.',
        ],
      ],
      'Servidores merecem sua própria sub-rede e regras.',
    ),
    completar(
      'Complete: cada setor só deve acessar o necessário, o princípio do menor ___.',
      'const principio = "menor ___";',
      [{ aceitas: ['privilégio', 'privilegio'], feedback: 'Princípio do menor privilégio.' }],
      'Reduz o estrago se uma conta ou máquina for comprometida.',
    ),
  ],
  desafio: programaJs(
    'Escreva prefixoPara(equipamentos): devolve o menor prefixo (/n) cuja sub-rede comporte essa quantidade de equipamentos, lembrando que 2 endereços são reservados (rede e broadcast).',
    'function prefixoPara(equipamentos) {\n  // seu código aqui\n}',
    'function prefixoPara(equipamentos) {\n  let bits = 1;\n  while (2 ** bits < equipamentos + 2) bits++;\n  return 32 - bits;\n}',
    'prefixoPara',
    [
      { argumentos: [50], esperado: 26 },
      { argumentos: [20], esperado: 27 },
      { argumentos: [10], esperado: 28 },
      { argumentos: [2], esperado: 30 },
      { argumentos: [254], esperado: 24 },
      { argumentos: [255], esperado: 23 },
    ],
    [
      'Procure quantos bits de equipamento são necessários.',
      'A sub-rede precisa de equipamentos + 2 endereços.',
    ],
    'Aumente os bits até 2^bits caber equipamentos + 2; o prefixo é 32 menos os bits.',
  ),
  rec: [
    ordenar(
      'Ordene as etapas de um projeto de rede.',
      [
        'Levantar a demanda por setor',
        'Dimensionar e alocar as sub-redes',
        'Definir as regras de acesso',
        'Configurar os serviços e testar',
        'Documentar',
      ],
      'Planejar antes de configurar evita retrabalho.',
    ),
    associar(
      'Associe a medida ao benefício.',
      [
        ['Segmentação', 'Limita o alcance de um incidente'],
        ['Rede de visitantes', 'Impede acesso à rede interna'],
        ['Menor privilégio', 'Cada setor acessa só o necessário'],
        ['Documentação', 'Facilita a manutenção e o diagnóstico'],
      ],
      'Quatro medidas que aparecem em todo projeto sério.',
    ),
  ],
  explique: {
    enunciado: 'Descreva como você planejaria a rede de um escritório com três setores.',
    modelo:
      'Levantaria quantos equipamentos há em cada setor com folga, daria a cada um uma sub-rede com o prefixo adequado (por exemplo /26 para 50 equipamentos), separaria visitantes e servidores, definiria regras de firewall pelo menor privilégio, configuraria DHCP, DNS, Wi-Fi seguro e VPN e documentaria os endereços e regras.',
    rubrica: [
      'Dimensionou sub-redes por setor',
      'Citou segmentação e regras de acesso',
      'Citou serviços ou documentação',
    ],
  },
  resumo: [
    'Levante a demanda e dimensione com folga.',
    'Uma sub-rede por setor, em blocos alinhados.',
    'Segmente e use o menor privilégio.',
    'Documente endereços e regras.',
  ],
  cards: [
    ['Prefixo para 50 equipamentos?', '/26.'],
    ['Visitantes acessam a rede interna?', 'Nunca.'],
    ['Princípio de acesso?', 'Menor privilégio.'],
    ['O que é DMZ?', 'Zona para servidores expostos à internet.'],
  ],
  conexoes: {
    disciplinas: [
      'Redes de Computadores: sub-redes, roteamento, firewall e VPN se unem aqui.',
      'Infraestrutura e Servidores: o mesmo desenho vale para VPCs na nuvem.',
      'Cibersegurança: segmentação é a primeira defesa em profundidade.',
    ],
    profissional:
      'Montar e documentar a rede de uma empresa pequena é um ótimo projeto de portfólio e de suporte.',
  },
});
