'use strict';

// define color constants
var red = '#F00';
var blue = '#00F';

var getRandomInt = function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
};

var numNodes = 3;
var numEdges = 0;

var nodes = Array.from(Array(numNodes).keys()).map(function (i) {
	return {
		id: 'n' + i,
		size: 10,
		label: 'q' + i,
		x: Math.random(),
		y: Math.random(),
		color: '#000'
	};
});

var edges = Array.from(Array(numEdges).keys()).map(function (i) {
	return {
		id: 'n' + i,
		label: '', // using this to hold the READ, WRITE, ADVANCE data
		source: 'n' + getRandomInt(0, numNodes),
		target: 'n' + getRandomInt(0, numNodes),
		color: '#000',
		type: 'arrow',
		size: 10
	};
});

var g = { nodes: nodes, edges: edges };

console.log(g);

// init the graph display
var s = new sigma({
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
		maxEdgeSize: 3
	}
});
var c = s.camera;

// for the buttons
// 1: normal
// 2: new edge
// 3: delete
// 4: accept
// 5: start
var clickMode = 1;
var edgeNodes = [];

// enable dragging of elements
var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);

// dom listener
var dom = document.querySelector('#container canvas:last-child');
dom.addEventListener('click', function (e) {
	var x = void 0,
	    y = void 0;
	x = sigma.utils.getX(e);
	y = sigma.utils.getY(e);
	console.log({ x: x, y: y });
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
s.bind('clickEdge', function (e) {
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
s.bind('clickNode', function (e) {
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
				var edgeData = prompt('Enter the edge information in this format: READ WRITE ADVANCE');
				s.graph.addEdge({
					id: 'n' + numEdges,
					label: edgeData,
					source: edgeNodes[0],
					target: e.data.node.id,
					color: '#000',
					type: e.data.node.id == edgeNodes[0] ? 'curve' : 'arrow',
					size: 10
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
			e.data.node.color = red;
			s.refresh();
			clickMode = 1;
			break;
		case 5:
			// make this the start node
			e.data.node.color = blue;
			s.refresh();
			clickMode = 1;
			break;
		default:
			break;
	}
});

// enable clicking to make nodes
document.getElementById('nodeButton').onclick = function (e) {
	numNodes++;
	s.graph.addNode({
		id: 'n' + numNodes,
		size: 10,
		label: 'q' + numNodes,
		x: 0,
		y: 0,
		color: '#000'
	});
	s.refresh();
};

var getGraph = function getGraph() {
	var nodes = s.graph.nodes();
	var edges = s.graph.edges();

	edges.forEach(function (e) {
		var transitionString = e.label.split(' ');
		e.read = transitionString[0];
		e.write = transitionString[1];
		e.directionInString = transitionString[2] == 'R' ? 1 : transitionString[2] == 'L' ? -1 : 0;
	});

	var start = void 0,
	    accept = void 0;
	nodes.forEach(function (n) {
		start = n.color === blue ? n : start;
		accept = n.color === red ? n : accept;

		n.edges = [];

		edges.forEach(function (e) {
			if (e.source === n.id) {
				n.edges.push(e);
			}
		});
	});

	return { edges: edges, nodes: nodes, startNode: start, acceptNode: accept };
};

var simulate = function simulate(inString) {
	var graph = getGraph();
	console.log(graph);
	var stringPos = 1;
	inString = 'D' + inString + 'D'; // put the starting and ending deltas in place
	inString = inString.split(''); // convert to array to enable [] and assignment

	var startIndex = graph.nodes.indexOf(graph.startNode);

	console.log("start index is: " + startIndex);
	for (var i = 0; i < graph.nodes[startIndex].edges.length; i++) {
		if (graph.nodes[startIndex].edges[i].read === inString[stringPos]) {
			// reading the character
			inString[stringPos] = graph.nodes[startIndex].edges[i].write;
			stringPos += graph.nodes[startIndex].edges[i].directionInString;

			// move to state
			startIndex = graph.nodes.map(function (x) {
				return x.id;
			}).indexOf(graph.nodes[startIndex].edges[i].target);
			//startIndex = graph.nodes.findIndex((element) => {
			//element.id == graph.nodes[startIndex].edges[i].target;
			//});

			console.log("moving to node at index: " + startIndex);

			// reset counter
			i = -1;
		}
	}
	return { isAccepted: graph.nodes[startIndex].id == graph.acceptNode.id, tapeVal: inString };
};

// button listeners
document.getElementById('edgeButton').onclick = function (e) {
	console.log("setting click mode to 2");
	clickMode = 2;
};

document.getElementById('deleteButton').onclick = function (e) {
	console.log("setting click mode to 3");
	clickMode = 3;
};

document.getElementById('runButton').onclick = function (e) {
	console.log("running TM");
	var inString = prompt("Enter a string to run on Turing Machine");
	var result = simulate(inString);
	var outString = 'The string ' + inString + ' is ' + (result.isAccepted ? 'accepted' : 'rejected') + ' with a tape value of ' + result.tapeVal + '.';
	alert(outString);
};

document.getElementById('acceptButton').onclick = function (e) {
	clickMode = 4;
};

document.getElementById('startButton').onclick = function (e) {
	clickMode = 5;
};