let inicioPi = 1.625 * Math.PI;
var h = 600;
var k = 270;
var a = 320;
var b = 200;

export default class Base {

    buscaResultados(){
        return false;
    }

    fimDeRodada(){
    }

    finaliza(){
        return false;
    }

    posicaoX(indice, n) {
        let tInterval = 2 * Math.PI / n;
        let intervalo = tInterval * indice + inicioPi;
        return h + a * (Math.cos(intervalo));
    };

    posicaoY(indice, n) {
        let tInterval = 2 * Math.PI / n;
        let intervalo = tInterval * indice + inicioPi;
        return k + b * (Math.sin(intervalo));
    };

    desenhaCluster(){};

    formato(){
        return "elipse";
    }
}