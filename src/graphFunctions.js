const MAX = 1010;
const radVertex = 20;
let x,y,range;
let lastVertex = 0;
let G = Array();
let coordsVert = Array();
for(let i = 0;i < MAX;i++) G[i] = Array();
let imgAntenna = new Image();
imgAntenna.src = '../antenna.png';


//--------------------------- INÍCIO das Funções de Renderização do Grafo ---------------------------------
let canvas = document.getElementById('graphStage');
let ctx = canvas.getContext("2d");

let height = window.screen.availHeight;
let width = window.screen.availWidth;

canvas.width = width - 200;
canvas.height = height - 100; 
document.getElementById("graphStage").addEventListener('click', function(e){
 	x = e.pageX;
	y = e.pageY;

	$('#modalRad').modal('show');
});

function getRangeInput(){
	range = document.getElementById('iRange').value;
	document.getElementById('idRad').innerHTML = range;
}

function makeVertex(){
	range = parseInt(document.getElementById('iRange').value);

	//Vértice 
	ctx.beginPath();
	ctx.drawImage(imgAntenna,x-50,y-50);
	ctx.closePath();
	
	//Raio de alcance
	ctx.beginPath();	
	ctx.arc(x ,y ,range ,0 ,Math.PI*2 ,true);
	ctx.strokeStyle = 'rgba(255,0,0,0.5)';
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
 	
 	//Grafo
    coordsVert[lastVertex] = {x: x,y: y,r: range};
    updateEdges();
    lastVertex++;
}

function updateEdges(){
	let distance;
	for(let i = 0;i < lastVertex;i++){
		let xo = coordsVert[i].x,yo = coordsVert[i].y,
		x = coordsVert[lastVertex].x,y = coordsVert[lastVertex].y;
		distance = Math.sqrt(Math.pow((x-xo),2) + Math.pow((y-yo),2));
		if(distance - radVertex <= coordsVert[i].r || distance - radVertex <= coordsVert[lastVertex].r){
			distance = Math.round(distance);
			makeEdge(i,lastVertex,{x,xo},{y,yo},distance);
		}
	}
}

function makeEdge(s,d,{x,xo},{y,yo},distance){
	G[s].push({u: d, d:distance});
	G[d].push({u: s, d:distance});

	//Aresta
	ctx.beginPath();
	ctx.strokeStyle = 'rgba(0,0,250,0.6)';
	ctx.lineWidth = 4;
	ctx.moveTo(xo, yo);
	ctx.lineTo(x, y);
	ctx.stroke();
	ctx.closePath();
	
	//Texto de distância
	ctx.beginPath();  
	ctx.font="15px Georgia";
	ctx.fillStyle="black";
	ctx.fillText(distance + 'px',Math.floor((x+xo)/2),Math.floor((y+yo)/2));
	ctx.closePath();
}

//----------------------------- FIM das Funções de Renderização do Grafo --------------------------------

//Salvando Grafo em Session Storage
function storeGraph(){
	sessionStorage.clear();
	sessionStorage.setItem('length',lastVertex);
	for(let i = 0;i < lastVertex;i++){
		sessionStorage.setItem('g'+ i,JSON.stringify({...G[i]}));
		sessionStorage.setItem('c'+ i,JSON.stringify({...coordsVert[i]}));
	}
}

//Pegando o Grafo salvo em Session Storage
function getGraph(){
	let length = sessionStorage.getItem('length');
	for(let i = 0;i < length;i++){
		let c = 0;
		let tmp = JSON.parse(sessionStorage.getItem('g'+i));
		while(tmp[c] != undefined){G[i].push(tmp[c]);c++;}
		coordsVert[i] = (JSON.parse(sessionStorage.getItem('c'+i)));
	}
}

function openResultsPage(){
	storeGraph();
	window.location.href = '_results-page.html' 
}

//Identificação dos Componentes do Grafo

	
//Kruskal & Prim
