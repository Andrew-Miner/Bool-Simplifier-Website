/* eslint-disable no-eval */

import StructFactory from "../StructFactory";
import { Terminal, NonTerminal } from "./Symbol";

export const EarleyItem = StructFactory("rule next start");
export const Grammar = StructFactory("startRule rules");
export const Rule = StructFactory("name definition");

export const testG2 = new Grammar("A", [
    new Rule("A", [new NonTerminal("A"), new Terminal("a")]),
    new Rule("A", []),
]);

export const testG = new Grammar("Sum", [
    new Rule("Sum", [
        new NonTerminal("Sum"),
        new Terminal(["+", "-"]),
        new NonTerminal("Product"),
    ]),

    new Rule("Sum", [new NonTerminal("Product")]),

    new Rule("Product", [
        new NonTerminal("Product"),
        new Terminal(["*", "/"]),
        new NonTerminal("Factor"),
    ]),

    new Rule("Product", [new NonTerminal("Factor")]),

    new Rule("Factor", [new Terminal("("), new NonTerminal("Sum"), new Terminal(")")]),

    new Rule("Factor", [new NonTerminal("Number")]),
    new Rule("Number", [
        new NonTerminal("Number"),
        new Terminal(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]),
    ]),

    new Rule("Number", [
        new Terminal(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]),
    ]),
]);

export const testAactionsA = [
    (lOperand, op, rOperand) => [lOperand, op, rOperand],
    (product) => product,
    (lOperand, op, rOperand) => [lOperand, op, rOperand],
    (factor) => factor,
    (lParen, sum, rParen) => sum,
    (number) => number,
    (num1, num2) => num1 + num2,
    (number) => number,
];

export const testAactionsB = [
    (lOperand, op, rOperand) => eval(lOperand + op + rOperand),
    (product) => product,
    (lOperand, op, rOperand) => eval(lOperand + op + rOperand),
    (factor) => factor,
    (lParen, sum, rParen) => sum,
    (number) => number,
    (num1, num2) => num1 + num2,
    (number) => number,
];

const EarleyRecognizer = {
    buildItems(input, grammar) {
        let nullableSet = this.getNullableRules(grammar);
        let s = [[]];

        for (let i = 0; i < grammar.rules.length; i++) {
            if (grammar.rules[i].name === grammar.startRule) {
                s[0].push(new EarleyItem(i, 0, 0));
            }
        }

        for (let i = 0; i < s.length; i++) {
            for (let j = 0; j < s[i].length; j++) {
                let symbol = this.nextSymbol(s[i][j], grammar);
                if (symbol === null) this.complete(s, i, j, grammar);
                else if (symbol instanceof Terminal) this.scan(s, i, j, symbol, input);
                else if (symbol instanceof NonTerminal)
                    this.predict(s, i, j, symbol, nullableSet, grammar);
                else throw new Error("illegal rule");
            }
        }

        return s;
    },

    nextSymbol(item, grammar) {
        if (grammar.rules[item.rule].definition.length <= item.next) return null;
        return grammar.rules[item.rule].definition[item.next];
    },

    complete(s, i, j, grammar) {
        let item = s[i][j];
        for (let k = 0; k < s[item.start].length; k++) {
            let nextSym = this.nextSymbol(s[item.start][k], grammar);
            if (nextSym !== null && nextSym.match(grammar.rules[item.rule].name))
                this.appendItem(
                    s[i],
                    new EarleyItem(
                        s[item.start][k].rule,
                        s[item.start][k].next + 1,
                        s[item.start][k].start
                    )
                );
        }
    },

    scan(s, i, j, symbol, input) {
        if (i >= input.length) return;

        let item = s[i][j];
        if (symbol.match(input.substring(i, i + 1))) {
            if (i + 1 > s.length - 1) s.push([]);

            s[i + 1].push(new EarleyItem(item.rule, item.next + 1, item.start));
        }
    },

    predict(s, i, j, symbol, nss, grammar) {
        for (let k = 0; k < grammar.rules.length; k++) {
            if (symbol.match(grammar.rules[k].name)) {
                this.appendItem(s[i], new EarleyItem(k, 0, i));
                // magical completion
                if (nss.has(grammar.rules[k].name))
                    this.appendItem(
                        s[i],
                        new EarleyItem(s[i][j].rule, s[i][j].next + 1, s[i][j].start)
                    );
            }
        }
    },

    appendItem(items, item) {
        for (const it of items) {
            if (JSON.stringify(it) === JSON.stringify(item)) return false;
        }
        items.push(item);
        return true;
    },

    getNullableRules(grammar) {
        let nullableSet = new Set();
        let oldSize = 0;
        do {
            oldSize = nullableSet.size;
            this.updateNullableSet(nullableSet, grammar);
        } while (oldSize !== nullableSet.size);
        return nullableSet;
    },

    updateNullableSet(nullableSet, grammar) {
        for (let i = 0; i < grammar.rules.length; i++) {
            if (this.isNullable(grammar.rules[i], nullableSet))
                nullableSet.add(grammar.rules[i].name);
        }
    },

    isNullable(rule, nullableSet) {
        for (let i = 0; i < rule.definition.length; i++) {
            if (nullableSet.has(rule.definition[i].toString()) === false) return false;
        }
        return true;
    },

    printEarlySets(s, g, hideIncomplete = false) {
        let lines = [];
        let maxDefLen = 0;
        let maxNameLen = 0;

        for (let i = 0; i < s.length; i++) {
            lines.push([]);
            for (let j = 0; j < s[i].length; j++) {
                let item = s[i][j];
                let ruleDef = "";
                let ruleName = "";

                if (item.rule > -1) {
                    let rule = g.rules[item.rule];
                    ruleName = rule.name;
                    if (ruleName.length > maxNameLen) maxNameLen = ruleName.length;

                    let defSize = rule.definition.length;
                    for (let k = 0; k < defSize; k++) {
                        if (k === item.next) ruleDef += " @";
                        if (rule.definition[k] instanceof Terminal)
                            ruleDef += " " + rule.definition[k].toString();
                        else if (rule.definition[k] instanceof NonTerminal)
                            ruleDef += " " + rule.definition[k].toString();
                        else throw new Error("impossible symbol");
                    }
                    if (item.next >= defSize) ruleDef += " @";
                    else if (hideIncomplete) continue;

                    if (ruleDef.length > maxDefLen) maxDefLen = ruleDef.length;
                } else ruleDef = "{" + item.rule + ", " + item.next + "}";

                lines[i].push({
                    name: ruleName,
                    definition: ruleDef,
                    start: "(" + item.start + ")",
                });
            }
        }

        for (let i = 0; i < lines.length; i++) {
            console.log("    === " + i + " ===");
            for (let j = 0; j < lines[i].length; j++) {
                let l = lines[i][j];
                let str = l.name.padEnd(maxNameLen, " ") + " -> ";
                str += l.definition.padEnd(maxDefLen) + " " + l.start;
                console.log(str);
            }
            if (i !== lines.length - 1) console.log(" ");
        }
    },
};

export default EarleyRecognizer;
