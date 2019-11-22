import Base from './Base';

/**
 *
 *
 * @export
 * @class VCube
 * @extends {Base}
 */
export default class VCube extends Base {

    constructor(quantidade) {
        super();
        this.quantidade = quantidade;
        this.grande = quantidade > 8;
        this.cluster = 0;
        this.indice = 0;
        this.clusterMaximo = Math.floor(Math.log2(this.quantidade-1))+1;
        this.quantidadeBase = Math.pow(2,this.clusterMaximo);
        console.log("Quantidade",this.quantidade);
        console.log("ClusterMaximo",this.clusterMaximo);
        console.log("QuantidadeBase",this.quantidadeBase);
        this.a = 300;
        this.b = 300;
        this.inicial = 100;

        //Definições da ling
        this.textos = {};
        this.textos.br =
        [{
                        "i": 0,
                        "text": "ALGORITMO VCUBE:\nTodos os nodos est\u00e3o sem falhas"
                    },
                    {
                        "i": 5,
                        "text": "O nodo 6 falha"
                    },
                    {
                        "i": 7,
                        "text": "O nodo 7 testa o nodo 6 falho \ne descobre o evento"
                    },
                    {
                        "i": 9,
                        "text": "O nodo 4 testa o nodo 6 falho e\no nodo 5 testa o nodo 7 sem falha\ne ambos descobrem o evento"
                    },
                    {
                        "i":11,
                        "text": "O nodo 4 testa o nodo 7 sem falha"
                    },
                    {
                        "i":13,
                        "text": "A lat\u00eancia \u00e9, no m\u00e1ximo, logN rodadas \nde testes e s\u00e3o executados N \ntestes por intervalo"
                    }
                ];
        this.textoFinaliza = {};
        this.textoFinaliza.br = "Após um número de rodadas há \numa alta probabilidade de todos os \nnodos descobrirem o evento";
        this.titulos = {};
        this.titulos.br = "Topologia VCube";
        /* for (let j = 0; j < this.clusterMaximo; j++)
            for (let i = 0; i < quantidade; i++)
                console.log(i, j, this.cis_r(i, j + 1)); */
    }


    g(n){
        return this.grande?n/2:n;
    }

    /**
     * Metodo que fornece informacoes para desenhar cluster
     *
     * @param {*} nodos
     * @memberof VCube
     */
    desenhaCluster(nodos) {
        var c = color(0, 123, 122);
        fill(c);
        for (let i = 0; i < this.quantidade; i++) {
            if ((i % (Math.pow(2, this.cluster + 1)) == 0)) {
                if (this.cluster == 0) {
                    rect(nodos.get(i).x - this.g(50), nodos.get(i).y - this.g(50), this.g(400), this.g(100));
                }
                if (this.cluster == 1) {
                    rect(nodos.get(i).x - this.g(50), nodos.get(i).y - this.g(50), this.g(400), this.g(400));
                }
                if (this.cluster == 2) {
                    rect(nodos.get(i).x - this.g(50), nodos.get(i).y - this.g(50), this.g(1000), this.g(400));
                }
                if (this.cluster == 3) {
                    rect(nodos.get(i).x - this.g(50), nodos.get(i).y - this.g(50), this.g(1000), this.g(1000));
                }
                if (this.cluster == 4) {
                    rect(nodos.get(i).x - this.g(50), nodos.get(i).y - this.g(50), this.g(2200), this.g(1000));
                }
            }
        }
    };

    buscaResultados() {
        return true;
    };

    posicaoX(indice, n) {
        let x = this.inicial + 50;
        if (indice % 32 >= 16) {
            x += 4 * this.b;
        }
        if (indice % 8 >= 4) {
            x += 2 * this.b;
        }
        if (indice % 2 == 1) {
            x += this.b;
        }
        return this.g(x);
    };

    posicaoY(indice, n) {
        let y = this.inicial;
        if (indice % 16 >= 8) {
            y += 2 * this.a;
        }
        if (indice % 4 >= 2) {
            y += this.a;
        }
        return this.g(y);
    };

    formato() {
        return "cluster";
    }

    fimDeRodada(indiceFalha, teveFalha) {
        if (!teveFalha) {
            this.cluster = (this.cluster + 1) % this.clusterMaximo;
            this.indice = 0;
        } else {
            if (this.indice + 1 >= Math.pow(2, this.cluster)) {
                this.indice = 0;
                this.cluster = (this.cluster + 1) % this.clusterMaximo;
            } else {
                this.indice += 1;
            }
        }
    }

    cis(nodo, cluster, indice) {
        return this.cis_r(nodo, cluster + 1)[indice];
    }

    cis_r(nodo, cluster) {
        let xor = nodo ^ Math.pow(2, cluster - 1);
        let j;
        let list = [];

        list.push(xor % this.quantidadeBase);

        for (j = 1; j <= cluster - 1; j++) {
            let other = this.cis_r(xor, j);
            other.forEach(n => {
                list.push(n);
            });
        }
        return list;
    }

    nodosEnviar(n1, nodos) {
        let n2 = nodos.get(this.cis(n1.i, this.cluster, this.indice));
        if (this.indice == 0)
            return [n2];
        let list = [];
        if(n2 !== undefined){
            for (let i = 0; i < this.quantidade; i++) {
                list = [n2];
                //Pegando o primeiro nodo que testa o nao falho
                let testador = nodos.get(i);
                let testado = nodos.get(this.cis(i, this.cluster, this.indice - 1));
                if (testado !== undefined && testado.i === n2.i && !testador.falho) {
                    return [];
                }
            }
        }
        return list;
    }

    nodosReceber(n1, nodos) {
        let n2 = nodos.get(this.cis(n1.i, this.cluster, this.indice));
        let list = [];
        if (n2 !== undefined && !n2.falho) {
            if (this.indice == 0)
                return [n2];
            for (let i = 0; i < this.quantidade; i++) {
                list = [n2];
                //Pegando o primeiro nodo que testa o nao falho
                let testador = nodos.get(i);
                let testado = nodos.get(this.cis(i, this.cluster, this.indice - 1));
                if (testado !== undefined && testado.i === n2.i && !testador.falho) {
                    return [];
                }
            }
        }
        return list;
    }

    getTitulo(language) {
        return this.titulos[language];
    }

    getTexto(count, language) {
        return this.textos[language].find((t) => t.i == count);
    }
};