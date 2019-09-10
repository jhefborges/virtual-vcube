import Nodos from "./components/Nodos";
import Ring from "./components/Ring";
import BroadCast from "./components/Broadcast";
import Gossip from "./components/Gossip";
import VCube from "./components/VCube";

//Variveis dos nodos
let quantidade = 8;
let nodos;


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

let reset = () =>{
	parar = false;
	count = 0;
	rodada = 0;
	rounds = 50;
	volta = false;
}


//Variaveis da linguagem
let languages = [
	{"texto":"Portugues","sigla":"br"},
	{"texto":"English","sigla":"en"}
]
let language = "br";

let continueLang = {"br":"Continuar","en":"Continue"};
let proxLang = {"br":"Pr\u00f3ximo","en":"Next"};

var para = (textoValor) => {
  	parar = true;
  	texto = textoValor;
}

let buttonContinua,buttonProximo,languageSelect;

var proximo = () => {
	indTopologia = (indTopologia + 1)%topologias.length;
	topologia = topologias[indTopologia];
	setup();
	reset();
}

let continua = () =>{
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

window.setup = () => {
	textAlign(CENTER);
	var url_string = window.location.href
	var url = new URL(url_string);
	var lang = url.searchParams.get("lang");
	if(lang!=null){
		language = lang;
	}
	let canvas = createCanvas(1200, 600);
	canvas.parent('sketch-holder');
	nodos = new Nodos(quantidade, topologia);
	if(buttonContinua){
		buttonContinua.remove();
	}
	buttonContinua = createButton(continueLang[language]);
	buttonContinua.position(600, 550);
	buttonContinua.mousePressed(continua);
	if(buttonProximo){
		buttonProximo.remove();
	}
	buttonProximo = createButton(proxLang[language]);
	buttonProximo.position(600, 575);
	buttonProximo.mousePressed(proximo);
	languageSelect = createSelect();
	languageSelect.position(0, 575);
	languages.forEach(lang => {
		languageSelect.option(lang.texto,lang.sigla);
		if(lang.sigla == language){
			languageSelect.selected(lang.sigla);
		}
	});
	languageSelect.changed(languageChange);
}

let desenhaNodo = (n1) => {
	let c = color(180, 216, 231);
	let cfalha = color(245, 195, 194);
	fill(c);
	if (n1.falho)
		fill(cfalha);
	ellipse(n1.x, n1.y, 80);
	c = color(0, 0, 0);
	fill(c);
	textSize(36);
	text(n1.i, n1.x, n1.y - 2);
	textSize(18);
	let falhos = "";
	for (let i = 0; i < nodos.n; i++) {
		if (n1.n[i]) {
			falhos += i + " ";
		}
	}
	if (!n1.falho)
		text(falhos, n1.x, n1.y + 18);
}

let envia = (n1, nodos) => {
	let c = color(0, 255, 0);
	fill(c);
	let nodosE = topologia.nodosEnviar(n1, nodos,indiceFalha);
	nodosE.forEach(n2 => {
		let novox = (n1.x - n2.x) / rounds;
		let novoy = (n1.y - n2.y) / rounds;
		ellipse(n1.x - novox * rodada, n1.y - novoy * rodada, 30);
	});
}

let recebe = (n1, nodos) => {
	let c = color(245, 186, 0);
	fill(c);
	let nodosR = topologia.nodosReceber(n1, nodos,indiceFalha);
	nodosR.forEach(n2 => {
		let novox = (n1.x - n2.x) / rounds;
		let novoy = (n1.y - n2.y) / rounds;
		rect(n1.x - novox * (rounds - rodada), n1.y - novoy * (rounds - rodada), 30, 30);
	});
}


let atualizaDados = (n1,nodos) => {
	let nodosR = topologia.nodosEnviar(n1, nodos,indiceFalha);
	if(topologia.buscaResultados()){
		nodosR.forEach(n2 => {
			n2.n.forEach((n3,i) => {
				n1.n[i] = n1.n[i]||n3;
			});
		});
	}
}

let obtemFalhas = (n1, nodos) => {
	let nodosR = topologia.nodosEnviar(n1, nodos,indiceFalha);
	let falhou = false;
	nodosR.forEach(n2 => {
		falhou = falhou || n2.falho;
		n1.n[n2.i] = n2.falho;
	});
	return falhou;
}

window.draw = () => {
	background(255);
	topologia.desenhaCluster(nodos);
	let c1 = color(0, 0, 0);
	fill(c1);
	textSize(18);
	text(topologia.getTitulo(language),600,15);
	var c = color(0, 0, 125); // Define color 'c'
	fill(c); // Use color variable 'c' as fill color
	if (!parar) {
		if (!volta) {
			nodos.getNodosSemFalha(envia);
		} else {
			nodos.getNodosSemFalha(recebe);
		}''
		rodada = rodada + 1;
		if (rodada == rounds) {
			
			if (volta) {
				if(topologia.buscaResultados()){
					nodos.getNodosSemFalha(atualizaDados);
				}
				let retorno = nodos.getNodosSemFalha(obtemFalhas);
				teveFalha = false;
				retorno.forEach(e => {
					teveFalha = teveFalha || e;
				});
				if(teveFalha){
					indiceFalha +=1;
				}
				else{
					indiceFalha = 0;
				}
				nodos.get(6).falho = true;
				nodos.get(6).n[6] = true;
				topologia.fimDeRodada(indiceFalha,teveFalha);
			}
			volta = !volta;
			rodada = 0;
			let texto = topologia.getTexto(count,language);
			let finaliza = topologia.finaliza(nodos,language);
			if(texto){
				para(texto.text);
			}
			if(finaliza){
				para(finaliza);
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
	nodos.getNodos(desenhaNodo);
}