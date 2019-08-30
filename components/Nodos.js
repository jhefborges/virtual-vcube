export default class Nodos {

    constructor(n, positionX, positionY) {
        this.n = n;
        this.nodo = [];
        for (let i = 0; i < n; i++) {
            const x = positionX(i,n);
            const y = positionY(i,n);
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

    get(i) {
        return this.nodo[(this.n+i)%this.n];
    }

    getNodos(f) {
        for (let i = 0; i < this.n; i++) {
            f(this.nodo[i], this);
        }
    }

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