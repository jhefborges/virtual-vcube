let inicioPi = 1.625 * Math.PI;
var h = 600;
var k = 270;
var a = 320;
var b = 200;

/**
 *
 *
 * @export
 * @class Base
 */
export default class Base {

    /**
     *Define se os nodos obtem informacoes ao fazer diagnostico
     * @instance
     * @returns - true se sim false se nao
     * @memberof Base
     */
    buscaResultados(){
        return false;
    }

    /**
     *Executa no fim da rodada de testes
     * @instance
     * @memberof Base
     */
    fimDeRodada(){
    }


    /**
     * Retorna true se finalizou o diagnostico
     * @instance
     * @returns true se finalizou o diagnostico false se não
     * @memberof Base
     */
    finaliza(){
        return false;
    }


    /**
     *Retorna posição em x do nodo indice no conjunto n
     * @instance
     * @param {*} indice indice do nodo
     * @param {*} n conjunto de nodos
     * @returns coordenada x
     * @memberof Base
     */
    posicaoX(indice, n) {
        let tInterval = 2 * Math.PI / n;
        let intervalo = tInterval * indice + inicioPi;
        return h + a * (Math.cos(intervalo));
    };

    /**
     *Retorna posição em y do nodo indice no conjunto n
     * @instance
     * @param {*} indice indice do nodo
     * @param {*} n conjunto de nodos
     * @returns coordenada y
     * @memberof Base
     */
    posicaoY(indice, n) {
        let tInterval = 2 * Math.PI / n;
        let intervalo = tInterval * indice + inicioPi;
        return k + b * (Math.sin(intervalo));
    };


    /**
     *Função que pode desenhar o cluster
     * @instance
     * @memberof Base
     */
    desenhaCluster(){};


    /**
     *Retorna o mapeamento dos pontos na tela
     * @instance
     * @returns O valor cluster ou elipse
     * @memberof Base
     */
    formato(){
        return "elipse";
    }
}