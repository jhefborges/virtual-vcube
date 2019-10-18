import Base from './Base';

export default class Ring extends Base {

	constructor() {
		super();
		this.textos = {};
		this.textos.br = [{
				"i": 0,
				"text": "TOPOLOGIA ANEL:\nTodos os nodos est\u00e3o sem falhas"
			},
			{
				"i": 1,
				"text": "O nodo 6 falha"
			},
			{
				"i": 3,
				"text": "O nodo 5 testa o nodo 6 falho \ne descobre o evento"
			},
			{
				"i": 5,
				"text": "O nodo 5 testa o nodo 7 sem falha"
			},
			{
				"i":7,
				"text": "Os demais nodos obtem \ninformaç\u00f5es sobre o evento de \nfalha"
			},
			{
				"i":27,
				"text": "A lat\u00eancia \u00e9, no m\u00e1ximo, N rodadas \nde testes e s\u00e3o executados N \ntestes por intervalo"
			}
		];
		this.textos.en = [{
			"i": 0,
			"text": "RING TOPOLOGY:\nAll nodes whitout fault"
		},
		{
			"i": 1,
			"text": "Node 6 is fault"
		},
		{
			"i": 3,
			"text": "Node 5 tests node 6 fault \nand discover the event"
		},
		{
			"i": 5,
			"text": "Nodo 5 tests node 7 whithout fault"
		},
		{
			"i":7,
			"text": "All others nodes get\ndata about the fault \nevent"
		},
		{
			"i":27,
			"text": "The latency, at least, N rounds \nof tests and n tests are done \nper interval"
		}
	]
		this.titulos = {};
		this.titulos.br = "Topologia Anel";
		this.titulos.en = "Ring Topology";
	}

	buscaResultados(){
        return true;
    }

	nodosEnviar(n1, nodos, indiceFalha) {
		if (indiceFalha == 0 || nodos.get((n1.i + indiceFalha)%nodos.n).falho) {
			return [nodos.get((n1.i + indiceFalha + 1)%nodos.n)];
		} else {
			return [];
		}
	}

	nodosReceber(n1, nodos, indiceFalha) {
		let n2 = nodos.get((n1.i+indiceFalha+1)%nodos.n);
		if (!n2.falho&&(indiceFalha == 0||nodos.get((n1.i + indiceFalha)%nodos.n).falho))
			return [n2];
		return [];
	}

	getTitulo(language) {
		return this.titulos[language];
	}

	getTexto(count, language) {
		return this.textos[language].find((t) => t.i == count);
	}

}