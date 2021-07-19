class Symbol {
    constructor(symbols) {
        if (symbols instanceof Set) this.symbols = symbols;
        else if (symbols instanceof Array) this.symbols = new Set(symbols);
        else this.symbols = new Set([symbols]);
    }

    match(symbols) {
        if (symbols instanceof Set || symbols instanceof Array) {
            for (const sym of symbols) {
                if (this.symbols.has(sym) === false) return false;
            }
            return true;
        } else return this.symbols.has(symbols);
    }

    toString() {
        if (this.symbols.size > 1) {
            let str = "[";
            let count = 0;
            for (const sym of this.symbols) {
                if (count !== this.symbols.size - 1) str += sym + ",";
                else str += sym;
                count++;
            }
            str += "]";
            return str;
        }

        return "" + this.symbols.entries().next().value[0];
    }
}

class Terminal extends Symbol {}

class NonTerminal extends Symbol {}

export { Symbol, Terminal, NonTerminal };
