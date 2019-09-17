const MAX = 1010;
const radVertex = 20;
let x, y, range, lastVertex = 0;
let edgeList = Array();
let parent = Array();
let weight = Array();
let mst = Array();
let G = Array();
let coordsVert = Array();
for (let i = 0; i < MAX; i++) G[i] = Array();
let imgAntenna = new Image();
imgAntenna.src = "antenna.png";

//--------------------------- INÍCIO das Funções de Renderização do Grafo ---------------------------------
let canvas = document.getElementById("graphStage");
let ctx = canvas.getContext("2d");

let height = window.screen.availHeight;
let width = window.screen.availWidth;

canvas.width = width - 200;
canvas.height = height - 125;
document.getElementById("graphStage").addEventListener("click", function(e) {
  x = e.pageX;
  y = e.pageY;

  $("#modalRad").modal("show");
});

function getRangeInput() {
  range = document.getElementById("iRange").value;
  document.getElementById("idRad").innerHTML = range;
}

function makeVertex() {
  range = parseInt(document.getElementById("iRange").value);

  //Vértice
  ctx.beginPath();
  ctx.drawImage(imgAntenna, x - 50, y - 50);
  ctx.closePath();

  //Raio de alcance
  ctx.beginPath();
  ctx.arc(x, y, range, 0, Math.PI * 2, true);
  ctx.strokeStyle = "rgba(255,0,0,0.5)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.closePath();

  //Grafo
  coordsVert[lastVertex] = { x: x, y: y, r: range };
  updateEdges();
  lastVertex++;
}

function updateEdges() {
  let distance;
  for (let i = 0; i < lastVertex; i++) {
    let xo = coordsVert[i].x,
      yo = coordsVert[i].y,
      x = coordsVert[lastVertex].x,
      y = coordsVert[lastVertex].y;
    distance = Math.sqrt(Math.pow(x - xo, 2) + Math.pow(y - yo, 2));
    if(distance - radVertex <= coordsVert[i].r ||distance - radVertex <= coordsVert[lastVertex].r){
      distance = Math.round(distance);
      makeEdge(i, lastVertex, { x, xo }, { y, yo }, distance);
    }
  }
}

function drawMstLines(edges,color) {
  let edgesCoordinates = [];
  edges.forEach(edge => {
    let x0 = coordsVert[edge.x].x;
    let y0 = coordsVert[edge.x].y;
    let x1 = coordsVert[edge.y].x;
    let y1 = coordsVert[edge.y].y;

    let edgeCoordinate = {
      beg: { x: x0, y: y0 },
      end: { x: x1, y: y1 },
      distance: edge.d
    };
    drawMstLine(edgeCoordinate,color);
  });
}

function drawMstLine(coordinate,color) {
  const { beg, end, distance } = coordinate;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.moveTo(beg.x, beg.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
  ctx.closePath();
  printTextDistance(beg.x,beg.y,end.x,end.y,distance);
}

function printTextDistance(xo,yo,x,y,distance){
  //Texto de distância
  ctx.beginPath();
  ctx.font = "15px Georgia";
  ctx.fillStyle = "black";
  ctx.fillText(
    distance + "px",
    Math.floor((x + xo) / 2),
    Math.floor((y + yo) / 2)
  );
  ctx.closePath();  

}

function makeEdge(s, d, { x, xo }, { y, yo }, distance) {
  //Lista de adjacências
  G[s].push({ u: d, d: distance });
  G[d].push({ u: s, d: distance });
  //Lista de arestas
  edgeList.push({x: s,y: d,d: distance});

  //Aresta
  ctx.beginPath();
  ctx.strokeStyle = "rgba(0,0,250,0.6)";
  ctx.lineWidth = 4;
  ctx.moveTo(xo, yo);
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.closePath();

  //Texto de distância
  printTextDistance(xo,yo,x,y,distance);
}

//----------------------------- FIM das Funções de Renderização do Grafo --------------------------------


function generateMST() {
  drawMstLines(edgeList,"rgba(0,0,250,1)");
  kruskal();
  drawMstLines(mst,"rgba(255, 255, 0, 1)");
}

function find(x){
  if(parent[x] == x) return x;
  return (parent[x] = find(parent[x]));
}

function join(a,b){
  a = find(a);
  b = find(b);

  if(weight[a] < weight[b]){
    parent[a] = b;
  } 
  else{
    if(weight[b] < weight[a]){
      parent[b] = a;
    }
    else{
      parent[a] = b;
      weight[b]++;
    }
  }
}

function kruskal(){  
  for(let i = 0;i < lastVertex;i++) parent[i] = i;
  for(let i = 0;i < lastVertex;i++) weight[i] = 0;

  edgeList = edgeList.sort((edgeA, edgeB) => edgeA.d - edgeB.d);
  console.log(edgeList);

  let size = 0;
  for(let i = 0;i < edgeList.length;i++){
    if( find(edgeList[i].x) != find(edgeList[i].y) ){
      join(edgeList[i].x, edgeList[i].y);
      mst[++size] = edgeList[i];
    }
  }
  let cost = 0;
  for(let i = 1;i < lastVertex;i++){
    if(mst[i] == undefined){
      document.getElementById('msgcost').innerHTML = 'O grafo possui mais de um componente.=(';
      cost = -1;
      break;
    }
    cost += mst[i].d;
    console.log(mst[i].x + " " + mst[i].y + " " + mst[i].d);
  } 

  if(cost !== -1) document.getElementById('msgcost').innerHTML = cost + 'px';
}


