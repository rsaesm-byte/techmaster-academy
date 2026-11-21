/** Programas de exemplo do Laboratório de Algoritmos. */
export const EXEMPLOS: { nome: string; codigo: string; entradas?: string[]; dica: string }[] = [
  {
    nome: 'Troca de valores',
    dica: 'Por que precisamos da variável "aux"? Tente apagar a linha 3 e trocar sem ela.',
    codigo: 'a <- 10\nb <- 20\naux <- a\na <- b\nb <- aux\nescreva("a = ", a, ", b = ", b)',
  },
  {
    nome: 'Média com leia',
    dica: 'Troque as entradas e veja os valores entrarem nas gavetas.',
    codigo:
      'var\n  nota1, nota2, media: real\ninicio\n  leia(nota1)\n  leia(nota2)\n  media <- (nota1 + nota2) / 2\n  escreva("Média: ", media)\nfimalgoritmo',
    entradas: ['6', '9'],
  },
  {
    nome: 'Decisão: aprovado?',
    dica: 'Mude a entrada para 4, 6 e 9. Qual ramo do "se" roda em cada caso?',
    codigo:
      'leia(media)\nse media >= 7 entao\n  escreva("Aprovado")\nsenao se media >= 5 entao\n  escreva("Recuperação")\nsenao\n  escreva("Reprovado")\nfimse',
    entradas: ['6'],
  },
  {
    nome: 'Contador com enquanto',
    dica: 'Observe a condição ser testada antes de cada volta.',
    codigo:
      'contador <- 1\nenquanto contador <= 3 faca\n  escreva(contador)\n  contador <- contador + 1\nfimenquanto\nescreva("Fim")',
  },
  {
    nome: 'Soma de 1 a 5 com para',
    dica: '"soma" é um acumulador: começa em 0 e vai juntando cada i.',
    codigo:
      'soma <- 0\npara i de 1 ate 5 faca\n  soma <- soma + i\nfimpara\nescreva("Soma: ", soma)',
  },
  {
    nome: 'Tabuada',
    dica: 'Troque o número lido para ver outra tabuada.',
    codigo: 'leia(n)\npara i de 1 ate 10 faca\n  escreva(n, " x ", i, " = ", n * i)\nfimpara',
    entradas: ['7'],
  },
  {
    nome: 'Vetor: maior nota',
    dica: 'Acompanhe "maior" mudando só quando aparece uma nota maior. E se todas as notas forem negativas?',
    codigo:
      'var\n  notas: vetor[1..5] de real\n  i: inteiro\n  maior: real\ninicio\n  para i de 1 ate 5 faca\n    leia(notas[i])\n  fimpara\n  maior <- notas[1]\n  para i de 2 ate 5 faca\n    se notas[i] > maior entao\n      maior <- notas[i]\n    fimse\n  fimpara\n  escreva("Maior nota: ", maior)\nfimalgoritmo',
    entradas: ['7', '9.5', '4', '8', '6'],
  },
  {
    nome: 'Função: área do retângulo',
    dica: 'Veja a pilha de chamadas: os parâmetros nascem quando a função é chamada e somem quando ela devolve.',
    codigo:
      'funcao area(base, altura: real): real\ninicio\n  retorne base * altura\nfimfuncao\n\ninicio\n  escreva("Sala: ", area(4, 3.5))\n  escreva("Quarto: ", area(3, 3))\nfimalgoritmo',
  },
  {
    nome: 'Recursão: fatorial',
    dica: 'A pilha cresce até o caso base (n <= 1) e depois "desempilha" multiplicando.',
    codigo:
      'funcao fat(n: inteiro): inteiro\ninicio\n  se n <= 1 entao\n    retorne 1\n  fimse\n  retorne n * fat(n - 1)\nfimfuncao\n\ninicio\n  escreva(fat(4))\nfimalgoritmo',
  },
  {
    nome: 'Laço infinito (com defeito)',
    dica: 'Este programa nunca termina. Encontre o erro e corrija no editor.',
    codigo: 'c <- 1\nenquanto c <= 3 faca\n  escreva(c)\nfimenquanto',
  },
];
