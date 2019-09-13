/**
 *Classe usada para representar os nodos
 *
 * @export
 * @class Nodos
 */
export default class Nodos {

    /**
     *Creates an instance of Nodos.
     * @param {*} n - Quantidade de nodos
     * @param {*} topologia - Topologia usada no diagnostico dos nodos
     * @memberof Nodos
     */
    constructor(n, topologia) {
        this.n = n;
        this.nodo = [];
        for (let i = 0; i < n; i++) {
            const x = topologia.posicaoX(i,n);
            const y = topologia.posicaoY(i,n);
            this.nodo[i] = {
                "i": i,
                "x": x,
                "y": y,
                "falho": false,
                "n": []
            };
            for (let j = 0; j < n; j++) {
                this.nodo[i].n[j] = false;
            }
        }
    }

    /**
     *Retorna o nodo com indice i ou com modulo da quantidade com valor i
     *
     * @param {*} i - Indice do nodo
     * @returns - Nodo
     * @memberof Nodos
     */
    get(i) {
        return this.nodo[(this.n+i)%this.n];
    }

    /**
     *Aplica a funcao f em todos os nodos
     *
     * @param {*} f - Funcao a ser aplicada
     * @memberof Nodos
     */
    getNodos(f) {
        for (let i = 0; i < this.n; i++) {
            f(this.nodo[i], this);
        }
    }


    /**
     *Aplica a funcao f em todos os nodos sem falha
     *
     * @param {*} f - Funcao a ser aplicada
     * @returns - Array de valores retornados por f
     * @memberof Nodos
     */
    getNodosSemFalha(f) {
        let retorno = [];
        for (let i = 0; i < this.n; i++) {
            if (!this.nodo[i].falho) {
                retorno = retorno.concat(f(this.nodo[i], this));
            }
        }
        return retorno;
    }
}