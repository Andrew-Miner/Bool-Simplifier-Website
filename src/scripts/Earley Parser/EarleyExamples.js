const EarleyExamples = {
    ArithmeticCalculator: {
        grammar:
            '<sum>      ::= <sum> "+" <product>     |   <sum> "-" <product>\n' +
            "<sum>      ::= <product>\n" +
            '<product>  ::= <product> "*" <factor>  |   <product> "/" <factor>\n' +
            "<product>  ::= <factor>\n" +
            '<factor>   ::= "(" <sum> ")"           |   <number>\n' +
            "<number>   ::= <number> <digit>        |   <digit>\n" +
            '<digit>    ::= "0" | "1" | "2" | "3" | "4"\n' +
            '<digit>    ::= "5" | "6" | "7" | "8" | "9"\n',

        actions:
            "(lOperand, op, rOperand) => eval(lOperand + op + rOperand),\n" +
            "(lOperand, op, rOperand) => eval(lOperand + op + rOperand),\n" +
            "(product) => product,\n" +
            "(lOperand, op, rOperand) => eval(lOperand + op + rOperand),\n" +
            "(lOperand, op, rOperand) => eval(lOperand + op + rOperand),\n" +
            "(factor) => factor,\n" +
            "(lParen, sum, rParen) => sum,\n" +
            "(number) => number,\n" +
            "(num1, num2) => num1 + num2,\n" +
            "(digit) => digit,\n" +
            "(d) => d, (d) => d, (d) => d, (d) => d, (d) => d,\n(d) => d, (d) => d, (d) => d, (d) => d, (d) => d",

        tokenHandler: "(token) => token",
        input: "1+(2*3-4)",
    },

    ArithmeticObject: {
        grammar:
            '<sum>      ::= <sum> "+" <product>     |   <sum> "-" <product>\n' +
            "<sum>      ::= <product>\n" +
            '<product>  ::= <product> "*" <factor>  |   <product> "/" <factor>\n' +
            "<product>  ::= <factor>\n" +
            '<factor>   ::= "(" <sum> ")"           |   <number>\n' +
            "<number>   ::= <number> <digit>        |   <digit>\n" +
            '<digit>    ::= "0" | "1" | "2" | "3" | "4"\n' +
            '<digit>    ::= "5" | "6" | "7" | "8" | "9"\n',

        actions:
            "(lOperand, op, rOperand) => [lOperand, op, rOperand],\n" +
            "(lOperand, op, rOperand) => [lOperand, op, rOperand],\n" +
            "(product) => product,\n" +
            "(lOperand, op, rOperand) => [lOperand, op, rOperand],\n" +
            "(lOperand, op, rOperand) => [lOperand, op, rOperand],\n" +
            "(factor) => factor,\n" +
            "(lParen, sum, rParen) => sum,\n" +
            "(number) => number,\n" +
            "(num1, num2) => num1 + num2,\n" +
            "(digit) => digit,\n" +
            "(d) => d, (d) => d, (d) => d, (d) => d, (d) => d, (d) => d, (d) => d, (d) => d, (d) => d, (d) => d",

        tokenHandler: "(token) => token",
        input: "1+(2*3-4)",
    },

    ArithmeticParser: {
        grammar:
            '<sum>      ::= <sum> "+" <product>     |   <sum> "-" <product>\n' +
            "<sum>      ::= <product>\n" +
            '<product>  ::= <product> "*" <factor>  |   <product> "/" <factor>\n' +
            "<product>  ::= <factor>\n" +
            '<factor>   ::= "(" <sum> ")"           |   <number>\n' +
            "<number>   ::= <number> <digit>        |   <digit>\n" +
            '<digit>    ::= "0" | "1" | "2" | "3" | "4"\n' +
            '<digit>    ::= "5" | "6" | "7" | "8" | "9"\n',

        actions:
            '(lOperand, op, rOperand) => new ParseNode(-1, "sum", [lOperand, op, rOperand]),\n' +
            '(lOperand, op, rOperand) => new ParseNode(-1, "sum", [lOperand, op, rOperand]),\n' +
            '(product) => new ParseNode(-1, "sum", [product]),\n' +
            '(lOperand, op, rOperand) =>  new ParseNode(-1, "Product", [lOperand, op, rOperand]),\n' +
            '(lOperand, op, rOperand) =>  new ParseNode(-1, "Product", [lOperand, op, rOperand]),\n' +
            '(factor) => new ParseNode(-1, "Product", [factor]),\n' +
            '(lParen, sum, rParen) => new ParseNode(-1, "Factor", [lParen, sum, rParen]),\n' +
            '(number) => new ParseNode(-1, "Factor", [number]),\n' +
            '(num1, num2) => new ParseNode(-1, "Number", [num1, num2]),\n' +
            '(digit) => new ParseNode(-1, "Number", [digit]),\n' +
            '(d) => new ParseNode(-1, "digit", [d]), (d) => new ParseNode(-1, "digit", [d]), (d) => new ParseNode(-1, "digit", [d]), (d) => new ParseNode(-1, "digit", [d]), (d) => new ParseNode(-1, "digit", [d]),\n' +
            '(d) => new ParseNode(-1, "digit", [d]), (d) => new ParseNode(-1, "digit", [d]), (d) => new ParseNode(-1, "digit", [d]), (d) => new ParseNode(-1, "digit", [d]), (d) => new ParseNode(-1, "digit", [d])',

        tokenHandler: "(token) => new ParseNode(-1, token)",
        input: "1+(2*3-4)",
    },

    BNFParser: {
        grammar:
            "<syntax>         ::= <rule> | <rule> <syntax>;\n" +
            '<rule>           ::= <opt-whitespace> "<" <rule-name> ">" <opt-whitespace> "::=" <opt-whitespace> <expression> <line-end>;\n' +
            '<opt-whitespace> ::= " " <opt-whitespace> | "";\n' +
            '<expression>     ::= <list> | <list> <opt-whitespace> "|" <opt-whitespace> <expression>;\n' +
            "<line-end>       ::= <opt-whitespace> <EOL> | <line-end> <line-end>;\n" +
            "<list>           ::= <term> | <term> <opt-whitespace> <list>;\n" +
            '<term>           ::= <literal> | "<" <rule-name> ">";\n' +
            "<literal>        ::= '\"' <text1> '\"' | \"'\" <text2> \"'\";\n" +
            '<text1>          ::= "" | <character1> <text1>;\n' +
            "<text2>          ::= '' | <character2> <text2>;\n" +
            "<character>      ::= <letter> | <digit> | <symbol>;\n" +
            '<letter>         ::= "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";\n' +
            '<digit>          ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";\n' +
            '<symbol>         ::=  "|" | " " | "!" | "#" | "$" | "%" | "&" | "(" | ")" | "*" | "+" | "," | "-" | "." | "/" | ":" | ";" | ">" | "=" | "<" | "?" | "@" | "[" | "" | "]" | "^" | "_" | "`" | "{" | "}" | "~";\n' +
            '<character1>     ::= <character> | "\'";\n' +
            "<character2>     ::= <character> | '\"';\n" +
            "<rule-name>      ::= <letter> | <rule-name> <rule-char>;\n" +
            '<rule-char>      ::= <letter> | <digit> | "-";\n' +
            '<EOL>            ::= ";" | "\\n";',

        actions: "",

        tokenHandler: "",
        input:
            "<rule-name>      ::= <letter> | <rule-name> <rule-char>;\n" +
            '<rule-char>      ::= <letter> | <digit> | "-";\n',
    },
};

export default EarleyExamples;
