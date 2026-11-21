import type { DisciplinaEntrada } from '@/domain/conteudo';

export const redes: DisciplinaEntrada = {
  id: 'redes',
  escola: 'I',
  titulo: 'Redes de Computadores',
  descricao:
    'Do pacote ao firewall: camadas, sub-redes, roteamento, TCP e UDP, DHCP, NAT e segurança básica.',
  modulos: [
    {
      id: 'redes.m01',
      titulo: 'Camadas, endereços e caminhos',
      descricao:
        'O modelo em camadas, sub-redes, roteamento, transporte (TCP e UDP) e os serviços DHCP, NAT e firewall.',
      aulas: ['redes.m01.a01', 'redes.m01.a02', 'redes.m01.a03', 'redes.m01.a04', 'redes.m01.a05'],
    },
  ],
};
