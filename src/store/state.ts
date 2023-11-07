import { observable } from 'mobx';

class Node {
  type: number;
  posX: number;
  posY: number;
  constructor(x: number, y: number, t: number) {
    this.posX = x;
    this.posY = y;
    this.type = t;
  }
}

class Map {
  node: Node[];
  constructor() {
    this.node = []
  }

  addNode(x: number, y: number, t: number) {
    this.node.push(new Node(x, y, t))
  }

  reset() {
    this.node = []
  }
}

class Edge {
  u: number;
  v: number;
  weight: number;
  constructor(u: number, v: number, w: number) {
    this.u = u;
    this.v = v;
    this.weight = w;
  }
}

class Graph {
  V: number;
  adj: any[][];
  edge: Edge[];
  constructor() {
    this.V = 0;
    this.adj = [];
    this.edge = [];
  }

  setV(V: number) {
    this.V = V;
    this.adj = Array.from(Array(V), () => []);
  }

  addEdge(u: number, v: number, w: number) {
    this.adj[u].push([v, w]);
    this.adj[v].push([u, w]);

    // add Edge to edge list
    const e = new Edge(u, v, w);
    this.edge.push(e);
  }

  reset() {
    this.V = 0;
    this.adj = [];
    this.edge = [];
  }
}

const g = new Graph();
const map = new Map();

export const state = observable({
  totalRound: 7,
  rounds: [],
  timer: 180, // seconds
  score: 0,
  map: map,
  graph: g
});