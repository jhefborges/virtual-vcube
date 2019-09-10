import Base from './Base';

export default class VCube extends Base {
    
    constructor(quantidade) {
        super();
        this.quantidade = quantidade;
        this.cluster = 0;
        this.indice = 0;
        this.clusterMaximo = Math.log2(this.quantidade);
       
        this.a = 300;
        this.b = 300;
        this.inicial = 100;

        //Definições da ling
        this.textos = {};
        this.textos.br = [];/*  [{
                "i": 0,
                "text": "TOPOLOGIA GOSSIP:\nTodos os nodos estão sem falhas"
            },
            {
                "i": 1,
                "text": "O nodo 6 falha"
            },
            {
                "i": 3,
                "text": "Os nodos testam o nodos \nescolhidos aleatoriamente a cada \nrodada"
            }
        ]; */
        this.textoFinaliza = {};
        this.textoFinaliza.br = "Após um número de rodadas há \numa alta probabilidade de todos os \nnodos descobrirem o evento";
        this.titulos = {};
        this.titulos.br = "Topologia VCube";
    }

    desenhaCluster(nodos){
        var c = color(0, 123, 122);
        fill(c);
        for (let i = 0; i < this.quantidade; i++) {
            if ((i % (Math.pow(2, this.cluster + 1)) == 0)) {
                if (this.cluster == 0) {
                    rect(nodos.get(i).x - 50, nodos.get(i).y - 50, 400, 100);
                }
                if (this.cluster == 1) {
                    rect(nodos.get(i).x - 50, nodos.get(i).y - 50, 400, 400);
                }
                if (this.cluster == 2) {
                    rect(nodos.get(i).x - 50, nodos.get(i).y - 50, 1000, 400);
                }
            }
        }
    };

	buscaResultados(){
        return true;
    };

    posicaoX(indice, n) {
        //indice = indice-1;
        return  this.inicial + this.b * (parseInt(indice % 2) + 2 * parseInt(indice / 4)) + 50;
    };

    posicaoY(indice, n) {
        //indice = indice -1;
        return this.inicial + this.a * (parseInt(indice / 2) - 2 * parseInt(indice / 4));
    };


    fimDeRodada(indiceFalha, teveFalha) {
        if (!teveFalha) {
            this.cluster = (this.cluster + 1) % this.clusterMaximo;
            this.indice = 0;
        } else {
            if(this.indice+1 >= Math.pow(2,this.cluster)){
                this.indice =0;   
                this.cluster = (this.cluster + 1) % this.clusterMaximo;    
            }
            else{
                this.indice +=1;
            }
        }
    }

    cis(nodo, cluster, indice) {
        const cis = [];
        cis[0] = [
            [1],
            [2, 3],
            [4, 5, 6, 7]
        ];
        cis[1] = [
            [0],
            [3, 2],
            [5, 4, 7, 6]
        ];
        cis[2] = [
            [3],
            [0, 1],
            [6, 7, 4, 5]
        ];
        cis[3] = [
            [2],
            [1, 0],
            [7, 6, 5, 4]
        ];
        cis[4] = [
            [5],
            [6, 7],
            [0, 1, 2, 3]
        ];
        cis[5] = [
            [4],
            [7, 6],
            [1, 0, 3, 2]
        ];
        cis[6] = [
            [7],
            [4, 5],
            [2, 3, 0, 1]
        ];
        cis[7] = [
            [6],
            [5, 4],
            [3, 2, 1, 0]
        ];
        return (cis[nodo][cluster][indice]);
    }

    nodosEnviar(n1, nodos) {
        let n2 = nodos.get(this.cis(n1.i, this.cluster, this.indice));
        if (this.indice == 0)
            return [n2];
        if (nodos.get(this.cis(n1.i, this.cluster, this.indice - 1)).falho)
            return [n2];
        return [];
    }

    nodosReceber(n1, nodos) {
        let n2 = nodos.get(this.cis(n1.i, this.cluster, this.indice));
        if (!n2.falho) {
            if (this.indice == 0)
                return [n2];
            if (nodos.get(this.cis(n1.i, this.cluster, this.indice - 1)).falho)
                return [n2];
        }
        return [];
    }

    getTitulo(language) {
        return this.titulos[language];
    }

    getTexto(count, language) {
        return this.textos[language].find((t) => t.i == count);
    }
};