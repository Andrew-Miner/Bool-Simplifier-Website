import { Grammar, Rule } from "./EarleyRecognizer";
import { Terminal, NonTerminal } from "./Symbol";
import { ParseNode } from "./EarleyParser";

export const bnfGrammar = new Grammar("syntax", [
    new Rule("syntax", [new NonTerminal("rule")]),
    new Rule("syntax", [new NonTerminal("syntax"), new NonTerminal("rule")]),

    new Rule("rule", [
        new NonTerminal("opt-whitespace"),
        new Terminal("<"),
        new NonTerminal("rule-name"),
        new Terminal(">"),
        new NonTerminal("opt-whitespace"),
        new Terminal(":"),
        new Terminal(":"),
        new Terminal("="),
        new NonTerminal("opt-whitespace"),
        new NonTerminal("expression"),
        new NonTerminal("line-end"),
    ]),

    new Rule("opt-whitespace", []),
    new Rule("opt-whitespace", [new NonTerminal("opt-whitespace"), new Terminal(" ")]),

    new Rule("expression", [new NonTerminal("list")]),
    new Rule("expression", [
        new NonTerminal("expression"),
        new NonTerminal("opt-whitespace"),
        new Terminal("|"),
        new NonTerminal("opt-whitespace"),
        new NonTerminal("list"),
    ]),

    new Rule("line-end", [new NonTerminal("opt-whitespace"), new NonTerminal("EOL")]),
    new Rule("line-end", [new NonTerminal("line-end"), new NonTerminal("line-end")]),

    new Rule("EOL", [new Terminal([";", "\n", "\r"])]),

    new Rule("list", [new NonTerminal("term")]),
    new Rule("list", [
        new NonTerminal("list"),
        new NonTerminal("opt-whitespace"),
        new NonTerminal("term"),
    ]),

    new Rule("term", [new NonTerminal("terminal")]),
    new Rule("term", [new NonTerminal("non-terminal")]),

    new Rule("non-terminal", [
        new Terminal("<"),
        new NonTerminal("rule-name"),
        new Terminal(">"),
    ]),

    new Rule("terminal", [
        new Terminal('"'),
        new NonTerminal("text1"),
        new Terminal('"'),
    ]),
    new Rule("terminal", [
        new Terminal("'"),
        new NonTerminal("text2"),
        new Terminal("'"),
    ]),

    new Rule("text1", []), // NULL
    new Rule("text1", [new NonTerminal("text1"), new NonTerminal("character1")]),

    new Rule("text2", []), // NULL
    new Rule("text2", [new NonTerminal("text2"), new NonTerminal("character2")]),

    new Rule("character", [new NonTerminal("letter")]),
    new Rule("character", [new NonTerminal("digit")]),
    new Rule("character", [new NonTerminal("symbol")]),

    new Rule("digit", [new Terminal(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"])]),

    new Rule("character1", [new NonTerminal("character")]),
    new Rule("character1", [new Terminal("'")]),

    new Rule("character2", [new NonTerminal("character")]),
    new Rule("character2", [new Terminal('"')]),

    new Rule("rule-name", [new NonTerminal("letter")]),
    new Rule("rule-name", [new NonTerminal("rule-name"), new NonTerminal("rule-char")]),

    new Rule("rule-char", [new NonTerminal("letter")]),
    new Rule("rule-char", [new NonTerminal("digit")]),
    new Rule("rule-char", [new Terminal("-")]),

    new Rule("letter", [
        new Terminal([
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
        ]),
    ]),

    new Rule("symbol", [
        new Terminal([
            "|",
            " ",
            "!",
            "#",
            "$",
            "%",
            "&",
            "(",
            ")",
            "*",
            "+",
            ",",
            "-",
            ".",
            "/",
            ":",
            ";",
            ">",
            "=",
            "<",
            "?",
            "@",
            "[",
            "\\",
            "]",
            "^",
            "_",
            "`",
            "{",
            "}",
            "~",
            "\n",
            "\r",
        ]),
    ]),
]);

export const bnfActions = [
    (rule) => new ParseNode(0, "syntax", [rule]),
    (syntax, rule) => {
        syntax.children.push(rule);
        return syntax;
    },

    (
        space1,
        lessThan,
        ruleName,
        greaterThan,
        space2,
        colon1,
        colon2,
        equal,
        space3,
        expression,
        lineEnd
    ) => {
        return new ParseNode(2, "rule", [ruleName, expression]);
    }, //new ParseNode(2, "rule", args),

    () => new ParseNode(3, "opt-whitespace"),
    (spaces, space) => {
        if (spaces.rule === 3) return space;
        spaces.label += space.label;
        return spaces;
    }, //new ParseNode(4, "opt-whitespace", args),

    (list) => new ParseNode(5, "expression", [list]),
    (expression, space1, orTerminal, space2, list) => {
        //if (expression.rule === 5) {
        expression.children.push(list);
        return expression;
        //}
        //return new ParseNode(6, "expression", [expression, list]);
    }, //new ParseNode(6, "expression", args),

    (optWhitespace, eol) => new ParseNode(7, "line-end", [eol]),
    (lineEnd1, lineEnd2) =>
        new ParseNode(8, "line-end", lineEnd1.children.concat(lineEnd2.children)),

    (eol) => eol,

    (term) => new ParseNode(11, "list", [term]),
    (list, optWhitespace, term) => {
        list.children.push(term);
        list.rule = 12;
        return list;
    },

    (terminal) => terminal, //new ParseNode(12, "term", args),
    (nonTerminal) => nonTerminal, //new ParseNode(13, "term", args),

    (lessThan, ruleName, greaterThan) => new ParseNode(14, "non-terminal", [ruleName]),

    (doubleQuote1, text1, doubleQuote2) => new ParseNode(15, "terminal", [text1]),
    (singleQuote1, text2, singleQuote2) => new ParseNode(16, "terminal", [text2]),

    () => new ParseNode(17, "null"),
    (text1, character1) => {
        if (text1.rule === 17) return character1;
        text1.label += character1.label;
        return text1;
    }, //new ParseNode(18, "text1", args),

    () => new ParseNode(19, "null"),
    (text2, character2) => {
        if (text2.rule === 19) return character2;
        text2.label += character2.label;
        return text2;
    }, //new ParseNode(20, "text2", args),

    (letter) => letter, //new ParseNode(22, "character", args),
    (digit) => digit, //new ParseNode(22, "character", args),
    (symbol) => symbol, //new ParseNode(23, "character", args),

    (digit) => digit, //new ParseNode(24, "digit", args),

    (character) => character, //new ParseNode(25, "character1", args),
    (singleQuote) => singleQuote, //new ParseNode(26, "character1", args),

    (character) => character, //new ParseNode(27, "character2", args),
    (doubleQuote) => doubleQuote, // new ParseNode(28, "character2", args),

    (letter) => letter, //new ParseNode(29, "rule-name", args),
    (ruleName, ruleChar) => {
        ruleName.label += ruleChar.label;
        return ruleName;
    }, //new ParseNode(30, "rule-name", args),

    (letter) => letter, //new ParseNode(31, "rule-char", args),
    (digit) => digit, //new ParseNode(32, "rule-char", args),
    (dash) => dash, //new ParseNode(33, "rule-char", args),

    (letter) => letter, //new ParseNode(34, "letter", args),
    (symbol) => symbol, //new ParseNode(35, "symbol", args),
];

export function interpretBNF(simplifiedParseTree) {
    if (simplifiedParseTree === null || simplifiedParseTree === undefined)
        throw new Error("invalid parse tree");
    if (simplifiedParseTree.label !== "syntax") throw new Error("invalid parse tree");

    let newBNF = new Grammar(undefined, []);
    for (const rule of simplifiedParseTree.children) {
        if (rule.label !== "rule") throw new Error("invalid syntax");
        if (rule.children.length !== 2) throw new Error("invalid rule");
        if (rule.children[0].rule !== -1) throw new Error("invalid rule");
        if (rule.children[1].label !== "expression") throw new Error("invalid rule");

        let ruleName = rule.children[0].label;
        if (newBNF.startRule === undefined) newBNF.startRule = ruleName;

        let rules = interpretExpression(ruleName, rule.children[1]);
        newBNF.rules = newBNF.rules.concat(rules);
    }
    return newBNF;
}

// returns array of Rules
function interpretExpression(ruleName, expressionTree) {
    const NULL1 = 17;
    const NULL2 = 19;

    let rules = [];
    let hasNull = false;
    for (const list of expressionTree.children) {
        if (list.label !== "list") throw new Error("invalid expression");

        let ruleDef = [];

        for (const symbol of list.children) {
            if (symbol.children.length !== 1) throw new Error("invalid list");
            let symChild = symbol.children[0];

            if (symbol.label === "non-terminal") {
                if (symChild.rule !== -1) throw new Error("invalid non-terminal");
                ruleDef.push(new NonTerminal(symChild.label));
            } else if (symbol.label === "terminal") {
                if (symChild.rule === NULL1 || symChild.rule === NULL2) {
                    if (list.children.length > 1) {
                        if (hasNull === false) {
                            rules.push(new Rule(ruleName + "-null", []));
                            hasNull = true;
                        }
                        ruleDef.push(NonTerminal(ruleName + "-null"));
                    }
                } else if (symChild.rule === -1) {
                    for (const c of symChild.label) {
                        ruleDef.push(new Terminal(c));
                    }
                } else throw new Error("invalid terminal");
            } else throw new Error("invalid list");
        }

        rules.push(new Rule(ruleName, ruleDef));
    }
    return rules;
}
