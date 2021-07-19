import StructFactory from "../StructFactory";
import { Terminal, NonTerminal } from "./Symbol";

const Edge = StructFactory("startNode endNode data");

export class ParseNode {
    rule = -1;
    label = "";
    children = [];

    constructor(rule, label, children) {
        this.rule = rule;
        this.label = label;

        if (children === undefined || children === null) this.children = [];
        else this.children = children;
    }
}

const EarleyParser = {
    sortEarleySets(s) {},

    invertEarleySets(s, grammar, filterIncomplete = true) {
        let inverted = [];
        this.padEarleySets(s.length, inverted);

        for (let i = 0; i < s.length; i++) {
            for (let j = 0; j < s[i].length; j++) {
                let item = s[i][j];
                let rule = grammar.rules[item.rule];

                if (filterIncomplete && rule.definition.length > item.next) continue;

                let newSet = item.start;
                item.start = i;
                inverted[newSet].push(item);
            }
        }

        return inverted;
    },

    padEarleySets(amount, s) {
        for (let i = 0; i < amount; i++) {
            s.push([]);
        }
    },

    buildParseTree(input, invertedS, grammar) {
        let completeItems = this.getEdges(0, input.length, invertedS);
        if (completeItems.length === 0) return null;

        let startingEdge = new Edge(0, input.length, completeItems[0].rule);
        let root = new ParseNode(
            startingEdge.data,
            grammar.rules[startingEdge.data].name
        );

        let aux = (edge, node) => {
            let children = this.decomposeEdge(input, invertedS, grammar, edge);
            for (const child of children) {
                if (child.data === -1) {
                    node.children.push(
                        new ParseNode(
                            -1,
                            input.substring(child.startNode, child.startNode + 1)
                        )
                    );
                } else {
                    let newNode = new ParseNode(
                        child.data,
                        grammar.rules[child.data].name
                    );
                    node.children.push(newNode);
                    aux(child, newNode);
                }
            }
        };

        aux(startingEdge, root);
        return root;
    },

    printParseTree(node, printRule = false) {
        let aux = (node, indent, last) => {
            let line = indent + "+- " + node.label;
            if (printRule) line += " (" + node.rule + ")";
            console.log(line);

            indent += last ? "   " : "|  ";

            for (let i = 0; i < node.children.length; i++) {
                aux(node.children[i], indent, i === node.children.length - 1);
            }
        };

        aux(node, "", true);
    },

    getParseTreeString(node, printRule = false) {
        let string = "";
        let aux = (node, indent, last) => {
            let line = indent + "+- " + node.label;
            if (printRule) line += " (" + node.rule + ")";
            string += line + "\n";

            indent += last ? "   " : "|  ";

            for (let i = 0; i < node.children.length; i++) {
                aux(node.children[i], indent, i === node.children.length - 1);
            }
        };

        aux(node, "", true);
        return string;
    },

    getEdges(startNode, endNode, graph) {
        console.assert(graph.length > startNode);

        let edges = [];
        for (const item of graph[startNode]) {
            if (item.start === endNode) edges.push(item);
        }
        return edges;
    },

    decomposeEdge(input, graph, grammar, edge) {
        console.assert(edge.startNode < graph.length);
        console.assert(edge.endNode < graph.length);
        console.assert(edge.data >= 0 && edge.data < grammar.rules.length);

        const rules = grammar.rules[edge.data].definition;

        let start = edge.startNode;
        let finish = edge.endNode;
        let bottom = rules.length;

        let isLeaf = (node, depth) => {
            return node === finish && depth === bottom;
        };

        let getChild = (edge, depth) => {
            return edge.endNode;
        };

        let getEdges = (node, depth) => {
            if (depth >= rules.length) return [];

            let edges = [];
            let symbol = rules[depth];

            if (symbol instanceof Terminal) {
                if (symbol.match(input.substring(node, node + 1)))
                    edges.push(new Edge(node, node + 1, -1));
            } else if (symbol instanceof NonTerminal) {
                for (const item of graph[node]) {
                    if (symbol.match(grammar.rules[item.rule].name))
                        edges.push(new Edge(node, item.start, item.rule));
                }
            }
            return edges;
        };

        return this.depthFirstSearch(start, getEdges, isLeaf, getChild);
    },

    depthFirstSearch(root, funcGetEdges, funcIsLeaf, funcGetChild) {
        let path = [];
        let aux = (node, depth) => {
            if (funcIsLeaf(node, depth)) return true;
            let edges = funcGetEdges(node, depth);
            for (const edge of edges) {
                let child = funcGetChild(edge, depth);
                if (aux(child, depth + 1)) {
                    path.unshift(edge);
                    return true;
                }
            }
            return false;
        };
        aux(root, 0);
        return path;
    },

    applySemanticAction(tokenHandler, root, actions) {
        let aux = (node) => {
            // if node is a leaf node
            if (node.rule === -1) {
                return tokenHandler(node.label);
            } else {
                let processedChildren = [];
                for (const child of node.children) {
                    processedChildren.push(aux(child));
                }
                return actions[node.rule](...processedChildren);
            }
        };
        return aux(root);
    },
};

export default EarleyParser;
