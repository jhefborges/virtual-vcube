import Base from './Base';

/**
 *Classe que implementa o BroadCast
 *
 * @export
 * @class BroadCast
 * @extends {Base}
 */
export default class BroadCast extends Base {

  constructor() {
    super();
    this.textos = {};
    this.textos.br = [{
        "i": 0,
        "text": "ALGORITMO EM BROADCAST:\nTodos os nodos est\u00e3o sem falhas"
      },
      {
        "i": 1,
        "text": "O nodo 6 falha"
      },
      {
        "i": 3,
        "text": "Todos os nodos testam o nodo 6\ne todos descobrem como falho"
      },
      {
        "i": 5,
        "text": "A lat\u00eancia \u00e9 de 1 rodada \nde testes e são executados N*N \ntestes por intervalo"
      },
    ]
    this.titulos = {};
    this.titulos.br = "Topologia BroadCast";
  }

  nodosEnviar(n1, nodos) {
    return nodos.nodo;
  }

  nodosReceber(n1, nodos) {
    return nodos.nodo.filter((nodo) => {
      return !nodo.falho;
    });
  }

  getTitulo(language) {
    return this.titulos[language];
  }

  getTexto(count, language) {
    return this.textos[language].find((t) => t.i == count);
  }
};