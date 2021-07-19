import Recognizer from "./EarleyRecognizer";
import Parser, { ParseNode } from "./EarleyParser";
import { bnfGrammar, bnfActions, interpretBNF } from "./BNFInterpreter";

export function testSum() {
    let grammarStr =
        '<sum>      ::= <sum> "+" <product>     |   <sum> "-" <product>     |   <product>\n' +
        '<product>  ::= <product> "*" <factor>  |   <product> "/" <factor>  |   <factor>\n' +
        '<factor>   ::= "(" <sum> ")"           |   <number>\n' +
        "<number>   ::= <number> <digit>        |   <digit>\n" +
        '<digit>   ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"\n';
    let actionStr =
        "[" +
        "(lOperand, op, rOperand) => eval(lOperand + op + rOperand)," +
        "(lOperand, op, rOperand) => eval(lOperand + op + rOperand)," +
        "(product) => product," +
        "(lOperand, op, rOperand) => eval(lOperand + op + rOperand)," +
        "(lOperand, op, rOperand) => eval(lOperand + op + rOperand)," +
        "(factor) => factor," +
        "(lParen, sum, rParen) => sum," +
        "(number) => number," +
        "(num1, num2) => num1 + num2," +
        "(digit) => digit," +
        "(d) => d, (d) => d, (d) => d, (d) => d, (d) => d, (d) => d, (d) => d, (d) => d, (d) => d, (d) => d," +
        "]";

    let s = Recognizer.buildItems(grammarStr, bnfGrammar);
    let invertedS = Parser.invertEarleySets(s, bnfGrammar);
    let parseTree = Parser.buildParseTree(grammarStr, invertedS, bnfGrammar);

    if (parseTree === null) {
        console.log("Invalid input!");
        return;
    }

    let simpleTree = Parser.applySemanticAction(
        (token) => new ParseNode(-1, token),
        parseTree,
        bnfActions
    );

    let newGrammar = interpretBNF(simpleTree);
    let newActions = eval(actionStr);

    let input = "18/(3-7)+2*5"; //"1+(2*3-4)";
    let s1 = Recognizer.buildItems(input, newGrammar);
    let inverted = Parser.invertEarleySets(s1, newGrammar);
    console.log("================================================");
    let parseTree1 = Parser.buildParseTree(input, inverted, newGrammar);
    if (parseTree1 === null) {
        console.log("Invalid input!");
        return;
    }
    Parser.printParseTree(parseTree1);
    console.log("================================================");
    console.log(Parser.applySemanticAction((token) => token, parseTree1, newActions));
}

export function testBNF() {
    let input =
        '<syntaxR> ::= <rule1> \'"test2\' "" "t" <rule3> | <rule4> "" |"rule5" \'\';<syntax2> ::= <rule2>;;';

    let input1 =
        "<syntax>         ::= <rule> | <rule> <syntax>\n" +
        '<rule>           ::= <opt-whitespace> "<" <rule-name> ">" <opt-whitespace> "::=" <opt-whitespace> <expression> <line-end>\n' +
        '<opt-whitespace> ::= " " <opt-whitespace> | ""\n' +
        '<expression>     ::= <list> | <list> <opt-whitespace> "|" <opt-whitespace> <expression>\n' +
        "<line-end>       ::= <opt-whitespace> <EOL> | <line-end> <line-end>\n" +
        "<list>           ::= <term> | <term> <opt-whitespace> <list>\n" +
        '<term>           ::= <literal> | "<" <rule-name> ">"\n' +
        "<literal>        ::= '\"' <text1> '\"' | \"'\" <text2> \"'\"\n" +
        '<text1>          ::= "" | <character1> <text1>\n' +
        "<text2>          ::= '' | <character2> <text2>\n" +
        "<character>      ::= <letter> | <digit> | <symbol>\n" +
        '<letter>         ::= "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"\n' +
        '<digit>          ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"\n' +
        '<symbol>         ::=  "|" | " " | "!" | "#" | "$" | "%" | "&" | "(" | ")" | "*" | "+" | "," | "-" | "." | "/" | ":" | ";" | ">" | "=" | "<" | "?" | "@" | "[" | "\\" | "]" | "^" | "_" | "`" | "{" | "}" | "~"\n' +
        '<character1>     ::= <character> | "\'"\n' +
        "<character2>     ::= <character> | '\"'\n" +
        "<rule-name>      ::= <letter> | <rule-name> <rule-char>\n" +
        '<rule-char>      ::= <letter> | <digit> | "-"\n';

    console.log(input1);

    let s = Recognizer.buildItems(input, bnfGrammar);
    Recognizer.printEarlySets(s, bnfGrammar);
    console.log("================================================");
    Recognizer.printEarlySets(s, bnfGrammar, true);
    console.log("================================================");
    let inverted = Parser.invertEarleySets(s, bnfGrammar);
    Recognizer.printEarlySets(inverted, bnfGrammar, true);
    console.log("================================================");
    let parseTree = Parser.buildParseTree(input, inverted, bnfGrammar);
    if (parseTree === null) {
        console.log("Invalid input!");
        return;
    }
    Parser.printParseTree(parseTree, true);
    console.log("================================================");
    Parser.printParseTree(
        Parser.applySemanticAction(
            (token) => new ParseNode(-1, token),
            parseTree,
            bnfActions
        ),
        true
    );
}

export function prettyPrint(obj) {
    const stringify = {
            undefined: (x) => "undefined",
            boolean: (x) => x.toString(),
            number: (x) => x,
            string: (x) => enquote(x),
            object: (x) => traverse(x),
            function: (x) => x.toString(),
            symbol: (x) => x.toString(),
        },
        indent = (s) => s.replace(/^/gm, "  "),
        keywords = `do if in for let new try var case else enum eval null this true 
            void with await break catch class const false super throw while 
            yield delete export import public return static switch typeof 
            default extends finally package private continue debugger 
            function arguments interface protected implements instanceof`
            .split(/\s+/)
            .reduce((all, kw) => (all[kw] = true) && all, {}),
        keyify = (s) =>
            (!(s in keywords) && /^[$A-Z_a-z][$\w]*$/.test(s) ? s : enquote(s)) + ": ",
        enquote = (s) =>
            s
                .replace(/([\\"])/g, "\\$1")
                .replace(/\n/g, "\\n")
                .replace(/\t/g, "\\t")
                .replace(/^|$/g, '"'),
        traverse = (obj) =>
            [
                `{`,
                indent(
                    Object.keys(obj)
                        .map((k) => indent(keyify(k) + stringify[typeof obj[k]](obj[k])))
                        .join(",\n")
                ),
                `}`,
            ]
                .filter((s) => /\S/.test(s))
                .join("\n")
                .replace(/^{\s*\}$/, "{}");
    return traverse(obj);
}
