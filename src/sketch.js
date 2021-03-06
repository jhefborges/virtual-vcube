import Nodos from "./components/Nodos";
import Ring from "./components/topology/Ring";
import BroadCast from "./components/topology/Broadcast";
import Gossip from "./components/topology/Gossip";
import VCube from "./components/topology/VCube";


/**
 * @file Arquivo que executa a funções da biblioteca P5.js 
 */

//Variaveis da legenda
let legenda = true;

//Variveis dos nodos
let quantidade = 8;
let grande = false;
let nodos;

let iterative = false;

let topologias = [
	new Ring(),
	new BroadCast(),
	new Gossip(quantidade),
	new VCube(quantidade),
];

let indTopologia = 0;
let topologia = topologias[indTopologia];

//Variaveis para mostrar texto
var parar = false;
var texto = "";
//Variaveis para contar rodadas
var count = 0;
var rodada = 0;
var rounds = 50;
var volta = false;

let reset = () => {
	parar = false;
	count = 0;
	rodada = 0;
	rounds = 50;
	volta = false;
}

//Variaveis da linguagem
let languages = [{
		"texto": "Portugues",
		"sigla": "br"
	},
	/* {
		"texto": "English",
		"sigla": "en"
	} */
]
let language = "br";

let continueLang = {
	"br": "Continuar",
	"en": "Continue"
};

let proxLang = {
	"br": "Pr\u00f3ximo",
	"en": "Next"
};

var para = (textoValor) => {
	parar = true;
	texto = textoValor;
}

let buttonContinua, buttonProximo, languageSelect;

/**
 *Percorre a proxima topologia
 *
 */
var proximo = () => {
	indTopologia = (indTopologia + 1) % topologias.length;
	topologia = topologias[indTopologia];
	setup();
	reset();
}

let continua = () => {
	parar = false;
}

let teveFalha = false;
let indiceFalha = 0;

function languageChange() {
	var item = languageSelect.value();
	language = item;
	setup();
	reset();
}

function g(n) {
	return grande ? n / 2 : n;
}

window.setup = () => {
	textAlign(CENTER);
	let url_string = window.location.href
	let url = new URL(url_string);
	let lang = url.searchParams.get("lang");
	if (lang != null) {
		language = lang;
	}
	if (url_string.includes("/iterative")) {
		legenda = false;
		let newQuantidade = url.searchParams.get("qtd");
		if (newQuantidade != null) {
			quantidade = newQuantidade;
		}
		iterative = true;
		topologias = [new VCube(quantidade)];
		topologia = topologias[0];
		if (quantidade > 8)
			grande = true
	} else if (url_string.includes("/guided")) {
		legenda = false;
	}
	if (!legenda) {
		let canvas = createCanvas(1200, 600);
		canvas.parent('sketch-holder');
		nodos = new Nodos(quantidade, topologia);
		if (buttonContinua) {
			buttonContinua.remove();
		}
		if (buttonProximo) {
			buttonProximo.remove();
		}
		if (!iterative) {
			buttonContinua = createButton(continueLang[language]);
			buttonContinua.position(600, 550);
			buttonContinua.mousePressed(continua);
			buttonProximo = createButton(proxLang[language]);
			buttonProximo.position(600, 575);
			buttonProximo.mousePressed(proximo);
			languageSelect = createSelect();
			languageSelect.position(0, 575);
			languages.forEach(lang => {
				languageSelect.option(lang.texto, lang.sigla);
				if (lang.sigla == language) {
					languageSelect.selected(lang.sigla);
				}
			});
			languageSelect.changed(languageChange);
		}
	} else {
		textAlign(CENTER);
		let url_string = window.location.href
		let url = new URL(url_string);
		let lang = url.searchParams.get("lang");
		if (lang != null) {
			language = lang;
		}
		let canvas = createCanvas(260, 245);
		canvas.parent('sketch-legenda');
	}
}

/**
 * Desenha nodo, dada topologia e nodo
 *
 * @param {*} n1 nodo
 */
let desenhaNodo = (n1) => {
	let c = color(180, 216, 231);
	let cfalha = color(245, 195, 194);
	fill(c);
	if (n1.falho)
		fill(cfalha);
	let nodo = ellipse(n1.x, n1.y, g(80));
	c = color(0, 0, 0);
	fill(c);
	textSize(g(36));
	text(n1.i, n1.x, n1.y - 2);
	textSize(g(18));
	let falhos = "";
	for (let i = 0; i < nodos.n; i++) {
		if (n1.n[i]) {
			falhos += i + " ";
		}
	}
	if (!n1.falho)
		text(falhos, n1.x, n1.y + g(18));
}


/**
 * Envia mensagem de n1 para nodos
 *
 * @param {*} n1 nodo que envia
 * @param {*} nodos nodos a serem enviados
 */
let envia = (n1, nodos) => {
	let c = color(0, 255, 0);
	fill(c);
	let nodosE = topologia.nodosEnviar(n1, nodos, indiceFalha);
	nodosE.forEach(n2 => {
		if(n2 !== undefined){
			let curveX = 0;
			let curveY = 0;
			let novox = (n1.x - n2.x) / rounds;
			let novoy = (n1.y - n2.y) / rounds;
			//Deslocamento para desviar de nodos
			if (topologia.formato() == "cluster") {
				if (novox != 0 && Math.abs(n1.x - n2.x) > g(300)) {
					if (rodada / rounds < 0.5) {
						curveY = (g(200) * rodada / rounds);
					} else {
						curveY = (g(200) * (rounds - rodada) / rounds);
					}
					//Para sempre passar dentro do cluster
					if (n1.i % 4 > 1) {
						curveY = -curveY;
					}
				}
				if (novoy != 0 && Math.abs(n1.y - n2.y) > g(300)) {
					if (rodada / rounds < 0.5) {
						curveX = (g(200) * rodada / rounds);
					} else {
						curveX = (g(200) * (rounds - rodada) / rounds);
					}
					//Para sempre passar dentro do cluster
					if (n1.i % 2 == 1) {
						curveX = -curveX;
					}
				}
			}
			ellipse(n1.x - novox * rodada + curveX, n1.y - novoy * rodada + curveY, g(30));
		}
	});
}


/**
 * Recebe mensagem de n1 para nodos
 *
 * @param {*} n1 nodo que recebe
 * @param {*} nodos nodos que responderam
 */
let recebe = (n1, nodos) => {
	let c = color(245, 186, 0);
	fill(c);
	let nodosR = topologia.nodosReceber(n1, nodos, indiceFalha);
	nodosR.forEach(n2 => {
		let curveX = 0;
		let curveY = 0;
		let novox = (n1.x - n2.x) / rounds;
		let novoy = (n1.y - n2.y) / rounds;
		//Deslocamento para desviar de nodos
		if (topologia.formato() == "cluster") {
			if (novox != 0 && Math.abs(n1.x - n2.x) > g(300)) {
				if (rodada / rounds < 0.5) {
					curveY = (g(200) * rodada / rounds);
				} else {
					curveY = (g(200) * (rounds - rodada) / rounds);
				}
				//Para sempre passar dentro do cluster
				if (n1.i % 4 > 1) {
					curveY = -curveY;
				}
			}
			if (novoy != 0 && Math.abs(n1.y - n2.y) > g(300)) {
				if (rodada / rounds < 0.5) {
					curveX = (g(200) * rodada / rounds);
				} else {
					curveX = (g(200) * (rounds - rodada) / rounds);
				}
				//Para sempre passar dentro do cluster
				if (n1.i % 2 == 1) {
					curveX = -curveX;
				}
			}
		}
		rect(n1.x - novox * (rounds - rodada) - g(15) + curveX, n1.y - novoy * (rounds - rodada) - g(15) + curveY, g(30), g(30));
	});
}


/**
 * Atualiza dados se a topologia possuir essa função
 *
 * @param {*} n1 nodo
 * @param {*} nodos nodos que busca dados para atualizar
 */
let atualizaDados = (n1, nodos) => {
	let nodosR = topologia.nodosEnviar(n1, nodos, indiceFalha);
	if (topologia.buscaResultados()) {
		nodosR.forEach(n2 => {
			if(n2 !== undefined){
				n2.n.forEach((n3, i) => {
					if (i != n1.i)
						if (n1.nr[i] < n2.nr[i])
							if (n1.n[i] != n3) {
								n1.n[i] = n3;
								n1.nr[i] = n2.nr[i];
							}
				});
			}
		});
	}
}


/**
 * Obtem falhas
 *
 * @param {*} n1 nodo
 * @param {*} nodos nodos testados
 * @returns true se obteve falha, senão false
 */
let obtemFalhas = (n1, nodos) => {
	let nodosR = topologia.nodosEnviar(n1, nodos, indiceFalha);
	let falhou = false;
	nodosR.forEach(n2 => {
		if(n2 !== undefined){
			falhou = falhou || n2.falho;
			n1.n[n2.i] = n2.falho;
			n1.nr[n2.i] = count;
		}
	});
	return falhou;
}


window.mousePressed = () => {
	if (iterative) {
		nodos.nodo.forEach(n => {
			if (dist(n.x, n.y, mouseX, mouseY) <= 40) {
				n.falho = !n.falho;
				n.n[n.i] = !n.n[n.i];
			}
		});
	}
}

window.draw = () => {
	if (!legenda) {
		background(255);
		topologia.desenhaCluster(nodos);
		let c1 = color(0, 0, 0);
		fill(c1);
		textSize(18);
		text(topologia.getTitulo(language), 600, 15);
		var c = color(0, 0, 125); // Define color 'c'
		fill(c); // Use color variable 'c' as fill color
		if (!parar) {
			if (!volta) {
				nodos.getNodosSemFalha(envia);
			} else {
				nodos.getNodosSemFalha(recebe);
			}
			rodada = rodada + 1;
			if (rodada == rounds) {

				if (volta) {
					if (topologia.buscaResultados()) {
						nodos.getNodosSemFalha(atualizaDados);
					}
					let retorno = nodos.getNodosSemFalha(obtemFalhas);
					teveFalha = false;
					retorno.forEach(e => {
						teveFalha = teveFalha || e;
					});
					if (teveFalha) {
						indiceFalha += 1;
					} else {
						indiceFalha = 0;
					}
					console.log("Topologia é VCube",topologia instanceof VCube);
					console.log("Rodada",count);
					if (!iterative && (count > 4 || ! (topologia instanceof VCube ) )) {
						nodos.get(6).falho = true;
						nodos.get(6).n[6] = true;
					}
					topologia.fimDeRodada(indiceFalha, teveFalha);
				}
				volta = !volta;
				rodada = 0;
				if(!iterative){
					let texto = topologia.getTexto(count, language);
					let finaliza = topologia.finaliza(nodos, language);
					if (texto) {
						para(texto.text);
					}
					if (finaliza) {
						para(finaliza);
					}
				}	
				count++;
			}
		} else {
			var c2 = color(206, 206, 206); // Define color 'c'
			fill(c2);
			rect(450, 150, 310, 120, 20);
			c2 = color(0, 0, 0);
			fill(c2);
			textSize(18);
			text(texto, 600, 190);
		}
		c = color(0, 0, 0);
		fill(c);
		textSize(36);
		nodos.getNodos(desenhaNodo);
	} else {
		let c = color(180, 216, 231);
		fill(c);
		ellipse(60, 100, 80);
		let cfalha = color(245, 195, 194);
		fill(cfalha);
		ellipse(200, 100, 80);
		c = color(0, 255, 0);
		fill(c);
		ellipse(60, 220, 30);
		c = color(245, 186, 0);
		fill(c);
		rect(200-15, 220-15, 30, 30);
		c = color(0, 0, 0);
		fill(c);
		textSize(36);
		text("1", 60, 100 - 2);
		text("2", 200, 100 - 2);
		textSize(18);
		text("Legenda", 130, 15);
		text("Nodo\nSem falha", 60, 30);
		text("Nodo\nFalho", 200, 30);
		text("Mensagem\nde diagn\u00f3stico", 60, 175);
		text("Confirma\u00e7\u00e3o \nda mensagem", 200, 175);
	}
}