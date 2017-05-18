let getRandomInt = (min, max) => {
	  min = Math.ceil(min);
	    max = Math.floor(max);
	      return Math.floor(Math.random() * (max - min)) + min;
};

let numNodes = 10;
let numEdges = 10;

let nodes = Array.from(Array(numNodes).keys()).map((i) => ({
	id: `n${i}`,
	size: 10,
	label: `q${i}`,
	x: Math.random(),
	y: Math.random(),
	color: '#000'
}));

let edges = Array.from(Array(numEdges).keys()).map((i) => ({
	id: `n${i}`,
	label: ``, // using this to hold the READ, WRITE, ADVANCE data
	source: `n${(getRandomInt(0, numNodes))}`,
	target: `n${(getRandomInt(0, numNodes))}`,
	color: '#000',
	type: 'arrow',
    	size: 10
}));

let g = {nodes: nodes, edges: edges};

console.log(g);

// init the graph display
let s = new sigma({
	graph: g,
    	renderer: {
		type: 'canvas',
    		container: document.getElementById('container')
	},
	settings: {
		autoRescale: true,
    		enableEdgeHovering: true,
    		edgeLabelSize: 'porportional',
		minArrowSize: 10,
		minEdgeSize: 3,
		maxEdgeSize: 3,
	}
});
let c = s.camera;

// for the buttons
// 1: normal
// 2: new edge
// 3: delete
// 4: accept
// 5: start
let clickMode = 1;
let edgeNodes = [];

// enable dragging of elements
let dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

// dom listener
let dom = document.querySelector('#container canvas:last-child');
dom.addEventListener('click', (e) => {
	let x, y;
	x = sigma.utils.getX(e);
	y = sigma.utils.getY(e);
	console.log({x, y});
	switch (clickMode) {
		case 1:
			return;
		case 2:
			break;
		default:
			break;
	};
});

// on click edge
s.bind('clickEdge', (e) => {
	console.log("clicked on edge");
	switch (clickMode) {
		case 1:
			break;
		case 2:
			break;
		case 3:
			// delete the edge
			s.graph.dropEdge(e.data.edge.id);
			s.refresh();
			console.log("deleting edge");
			clickMode = 1;
			break;
		default:
			break;
	};
});

// on click node
s.bind('clickNode', (e) => {
	console.log("click on node ");
	switch (clickMode) {
		case 1:
			break;
		case 2:
			// this is either the start of an edge or the end of the edge
			if (edgeNodes.length == 0) {
				// this is the start of the edge
				edgeNodes.push(e.data.node.id);
				console.log("added node " + e.data.node.id + " to the array");
			} else if (edgeNodes.length == 1) {
				// this is the end of the edge, so make the edge
				numEdges++;
				let edgeData = prompt('Enter the edge information in this format: READ WRITE ADVANCE');
				s.graph.addEdge({
					id: `n${numEdges}`,
					label: edgeData,
					source: edgeNodes[0],
					target: e.data.node.id,
					color: '#000',
					type: (e.data.node.id == edgeNodes[0]) ? 'curve' : 'arrow',
					size: 10,
				});
				edgeNodes = [];
				s.refresh(); // re-render the graph
				console.log("added an edge");
				clickMode = 1;
			}
			break;
		case 3:
			// delete the node
			s.graph.dropNode(e.data.node.id);
			s.refresh();
			clickMode = 1;
			break;
		case 4:
			// make this the accept node
			e.data.node.color = '#F00'; // red
			s.refresh();
			clickMode = 1;
			break;
		case 5:
			// make this the start node
			e.data.node.color = '#00F'; // blue
			s.refresh();
			clickMode = 1;
			break;
		default:
			break;
	}
});

// enable clicking to make nodes
document.getElementById('nodeButton').onclick = (e) => {
	numNodes++;
	s.graph.addNode({
		id: `n${numNodes}`,
		size: 10,
		label: `q${numNodes}`,
		x: 0,
		y: 0,
		color: '#000'
	});
	s.refresh();
};

let simulate = (inString) => {

};

// new edge functions
document.getElementById('edgeButton').onclick = (e) => {
	console.log("setting click mode to 2");
	clickMode = 2;
};
document.getElementById('deleteButton').onclick = (e) => {
	console.log("setting click mode to 3");
	clickMode = 3;
};
document.getElementById('runButton').onclick = (e) => {
	console.log("running TM");
	let inString = prompt("Enter a string to run on Turing Machine");
	simulate(inString);
};
document.getElementById('acceptButton').onclick = (e) => {
	clickMode = 4;
};
document.getElementById('startButton').onclick = (e) => {
	clickMode = 5;
};
