/* eslint-disable no-eval */

export const BOOL_GRAMMAR =
    '<exp>       ::= <exp> "+" <complexOp>;\n' +
    "<exp>       ::= <complexOp>;\n" +
    '<complexOp> ::= <complexOp> "@" <product> | <complexOp> "%" <product> | <complexOp> "^" <product>;\n' +
    "<complexOp> ::= <product>;\n" +
    '<product>   ::= <product> "*" <factor>;\n' +
    "<product>   ::= <factor>;\n" +
    '<factor>    ::= "(" <exp> ")" | <var> | <bool> | "~" <factor>;\n' +
    '<bool>      ::= "1" | "0";' +
    '<var>       ::= "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";';

export const BOOL_CALC_ACTIONS = [
    (lOperand, op, rOperand) => eval(lOperand + " || " + rOperand),
    (complexOp) => complexOp,
    (lOperand, op, rOperand) => eval("!(" + lOperand + " && " + rOperand + ")"),
    (lOperand, op, rOperand) => eval("!(" + lOperand + " || " + rOperand + ")"),
    (lOperand, op, rOperand) =>
        eval(
            "(!" +
                lOperand +
                " && " +
                rOperand +
                ") || (" +
                lOperand +
                " && !" +
                rOperand +
                ")"
        ),
    (product) => product,
    (lOperand, op, rOperand) => eval(lOperand + " && " + rOperand),
    (factor) => factor,
    (lParen, exp, rParen) => exp,
    (v) => v,
    (b) => b,
    (nt, operand) => eval("!" + operand),
    (b) => true,
    (b) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
    (v) => false,
];

/*<exp>       ::= <complexOp> "+" <exp>;
<exp>       ::= <complexOp>;
<complexOp> ::= <product> "@" <complexOp> | <product> "%" <complexOp> | <product> "^" <complexOp>;
<complexOp> ::= <product>;
<product>   ::= <factor> "*" <product>;
<product>   ::= <factor>;
<factor>    ::= "(" <exp> ")" | <val> | "~" <factor>;
<val>       ::= "0" | "1";
<var>       ::= "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";

(lOperand, op, rOperand) => eval(lOperand + " || " + rOperand),
(complexOp) => complexOp,
(lOperand, op, rOperand) => eval("!(" + lOperand + " && " + rOperand + ")"),
(lOperand, op, rOperand) => eval("!(" + lOperand + " || " + rOperand + ")"),
(lOperand, op, rOperand) => eval("(!" + lOperand + " && " + rOperand + ") || (" + lOperand + " && !" + rOperand + ")"),
(product) => product,
(lOperand, op, rOperand) => eval(lOperand + " && " + rOperand),
(factor) => factor,
(lParen, exp, rParen) => exp,
(v) => v,
(nt, operand) => eval("!" + operand),
(v) => eval(v + "== 1"),
(v) => eval(v + "== 1")

<exp>       ::= <complexOp> "+" <exp>;
<exp>       ::= <complexOp>;
<complexOp> ::= <product> "@" <complexOp> | <product> "%" <complexOp> | <product> "^" <complexOp>;
<complexOp> ::= <product>;
<product>   ::= <factor> "*" <product>;
<product>   ::= <factor>;
<factor>    ::= "(" <exp> ")" | <var> | "~" <factor>;
<var>       ::= "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";


(lOperand, op, rOperand) => new ParseNode(-1, "exp", [lOperand, op, rOperand]),
(complexOp) => new ParseNode(-1, "exp", [complexOp]),
(lOperand, op, rOperand) =>  new ParseNode(-1, "complexOp", [lOperand, op, rOperand]),
(lOperand, op, rOperand) =>  new ParseNode(-1, "complexOp", [lOperand, op, rOperand]),
(lOperand, op, rOperand) =>  new ParseNode(-1, "complexOp", [lOperand, op, rOperand]),
(product) => new ParseNode(-1, "complexOp", [product]),
(lOperand, op, rOperand) =>  new ParseNode(-1, "product", [lOperand, op, rOperand]),
(factor) => new ParseNode(-1, "product", [factor]),
(lParen, exp, rParen) => new ParseNode(-1, "Factor", [lParen, exp, rParen]),
(v) => new ParseNode(-1, "factor", [v]),
(nt, factor) => new ParseNode(-1, "factor", [nt, factor]),
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v]), 
(v) => new ParseNode(-1, "var", [v]), (v) => new ParseNode(-1, "var", [v])

(A+~C+B*D)*(~A+(~B+D)*(C+~D))
"~(A^C)@(B%D)"

(lOperand, op, rOperand) => [lOperand, op, rOperand],
(complexOp) => complexOp,
(lOperand, op, rOperand) =>  [lOperand, op, rOperand],
(lOperand, op, rOperand) =>  [lOperand, op, rOperand],
(lOperand, op, rOperand) =>  [lOperand, op, rOperand],
(product) => product,
(lOperand, op, rOperand) =>  [lOperand, op, rOperand],
(factor) => factor,
(lParen, exp, rParen) => [lParen, exp, rParen],
(v) => v,
(nt, factor) => [nt, factor],
(v) => v, (v) => v, (v) => v, (v) => v, (v) => v, (v) => v, 
(v) => v, (v) => v, (v) => v, (v) => v, (v) => v, (v) => v, 
(v) => v, (v) => v, (v) => v, (v) => v, (v) => v, (v) => v,  
(v) => v, (v) => v, (v) => v, (v) => v, (v) => v, (v) => v, 
(v) => v, (v) => v, (v) => v, (v) => v, (v) => v, 
(v) => v, (v) => v, (v) => v, (v) => v, (v) => v, (v) => v, 
(v) => v, (v) => v, (v) => v, (v) => v, (v) => v, (v) => v, 
(v) => v, (v) => v, (v) => v, (v) => v, (v) => v, (v) => v, 
(v) => v, (v) => v, (v) => v, (v) => v, (v) => v
*/
