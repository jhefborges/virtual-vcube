import Base from './Base';

export default class Gossip extends Base {

  constructor(quantidade) {
    super();
    this.quantidade = quantidade;
    this.ramdomValues = [];
    for(let i =0;i<quantidade;i++){
        let value1 = Math.floor(Math.random()*(quantidade));
        let value2 = Math.floor(Math.random()*(quantidade));
        while(value1==value2){
            value2 = Math.floor(Math.random()*(quantidade));
        }
        this.ramdomValues[i] = [value1,value2];
    }

    //Definições da ling
    this.textos = {};
    this.textos.br = [{
        "i": 0,
        "text": "ALGORITMO GOSSIP:\nTodos os nodos est\u00e3o sem falhas"
      },
      {
        "i": 1,
        "text": "O nodo 6 falha"
      },
      {
        "i": 3,
        "text": "Os nodos testam o nodos \nescolhidos aleatoriamente a cada \nrodada"
      }
    ];
    this.textoFinaliza = {};
    this.textoFinaliza.br = "Ap\u00f3s um n\u00famero de rodadas há\numa alta probabilidade de todos os\nnodos descobrirem o evento";
    this.titulos = {};
    this.titulos.br = "Topologia Gossip";
  }


  fimDeRodada(){
      console.log(this.ramdomValues);
    for(let i =0;i<this.quantidade;i++){
        let value1 = Math.floor(Math.random()*(this.quantidade));
        let value2 = Math.floor(Math.random()*(this.quantidade));
        while(value1==value2){
            value2 = Math.floor(Math.random()*(this.quantidade));
        }
        this.ramdomValues[i] = [value1,value2];
    }
  }

  finaliza(nodos,language){
        let encontrou = true;
        nodos.nodo.forEach(n1 => {
            console.log(n1.i,n1.n[6]);
            encontrou = encontrou && n1.n[6];
        });
        if(encontrou){
            return this.textoFinaliza[language];
        }
        else{
            return false;
        }
  }

  nodosEnviar(n1, nodos) {
    let n2 = nodos.get((n1.i+this.ramdomValues[n1.i][0])%this.quantidade);
    let n3 = nodos.get((n1.i+this.ramdomValues[n1.i][1])%this.quantidade);
    return [n2,n3];
  }

  nodosReceber(n1, nodos) {
    let retorno = [];
    let n2 = nodos.get((n1.i+this.ramdomValues[n1.i][0])%this.quantidade);
    let n3 = nodos.get((n1.i+this.ramdomValues[n1.i][1])%this.quantidade);
    if(!n2.falho){
        retorno.push(n2);
    }
    if(!n3.falho){
        retorno.push(n3);
    }
    return retorno;
  }

  getTitulo(language) {
    return this.titulos[language];
  }

  getTexto(count, language) {
    return this.textos[language].find((t) => t.i == count);
  }
};