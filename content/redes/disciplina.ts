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
    {
      id: 'redes.m02',
      titulo: 'Operando e protegendo a rede',
      descricao:
        'Diagnóstico com ping e traceroute, Wi-Fi seguro, HTTPS e TLS, VPN e o projeto da rede de um escritório.',
      aulas: ['redes.m02.a01', 'redes.m02.a02', 'redes.m02.a03', 'redes.m02.a04', 'redes.m02.a05'],
    },
  ],
};
