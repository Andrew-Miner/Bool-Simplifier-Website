import {
    buildBoolGrammar,
    deepCopy,
    validateTerms,
    getVarBitSet,
    calculateMinTerms,
} from "./BoolExpressionUtils";
import QMFuncs from "./QMFunctions";
import PMFuncs from "./PMFunctions";
import Recognizer from "../Earley Parser/EarleyRecognizer";
import Parser from "../Earley Parser/EarleyParser";
import BitSet from "bitset";

export default class BoolExpression {
    #varCount;
    #minTerms;
    #dontCares;
    #primeImps;
    #petrickSOP;

    #sSet;
    #invertedS;
    #parseTree;
    #varBitSet;
    #expression;

    #errorCode = -2;
    #isLogged = false;

    #qmLog;
    #pmLog;

    #truthTable;

    static #BOOL_GRAMMAR = buildBoolGrammar();

    constructor(expression, minTerms, dontCares, isLogged = false) {
        if (!expression && !minTerms && !dontCares) {
            throw new Error("null expression");
        }

        this.#minTerms = minTerms;
        this.#dontCares = dontCares;
        this.#expression = expression;
        this.#isLogged = true;

        let success;
        if (expression) success = this.setExpression(expression);
        else success = this.setMinTerms(minTerms, dontCares);

        if (!success) {
            if (this.#errorCode === -1) throw new Error("cannot have 0 minimum terms");
            else if (this.#errorCode >= 0)
                throw new Error(
                    parseInt(this.#errorCode) +
                        " cannot be both a min term and a don't care"
                );
            else throw new Error("expression is not valid");
        }
    }

    static ExpressionInstance(expression, isLogged = false) {
        return new BoolExpression(expression, null, null, isLogged);
    }

    static MinTermInstance(minTerms, dontCares, isLogged = false) {
        return new BoolExpression(null, minTerms, dontCares, isLogged);
    }

    getMinTerms = () => deepCopy(this.#minTerms);
    getDontCares = () => deepCopy(this.#dontCares);
    getPetrickSOP = () => deepCopy(this.#petrickSOP);
    getEssentialImplicants = () => deepCopy(this.#primeImps);
    getVarCount = () => this.#varCount;

    getQMLog = () => (this.#isLogged ? deepCopy(this.#qmLog) : []);
    getPMLog = () => (this.#isLogged ? deepCopy(this.#pmLog) : []);

    getTruthTable = () => deepCopy(this.#truthTable);

    getPrimeImpStrings = () => {
        let piStrs = [];
        for (const implicant of this.#primeImps) {
            let str = "[";
            let minTerms = QMFuncs.extractMinTerms(implicant);
            for (const term of minTerms) str += parseInt(term) + "-";
            str = str.substring(0, str.length - 1) + "] ";
            str += QMFuncs.toString(implicant, this.#varCount);
            piStrs.push(str);
        }
        return piStrs;
    };

    getSOPStrings = () => {
        let sopStrs = [];
        if (this.#petrickSOP.length === 0) {
            if (this.#varBitSet)
                sopStrs.push(PMFuncs.mapProductToString([], this.#varBitSet));
            else sopStrs.push(PMFuncs.productToString([], this.#varCount));
        } else {
            for (const product of this.#petrickSOP) {
                if (this.#varBitSet)
                    sopStrs.push(PMFuncs.mapProductToString(product, this.#varBitSet));
                else sopStrs.push(PMFuncs.productToString(product, this.#varCount));
            }
        }
        return sopStrs;
    };

    setExpression = (expression) => {
        expression = expression.replace(/ /g, "");
        let sSet = Recognizer.buildItems(expression, BoolExpression.#BOOL_GRAMMAR);
        let invertedS = Parser.invertEarleySets(sSet, BoolExpression.#BOOL_GRAMMAR);
        let parseTree = Parser.buildParseTree(
            expression,
            invertedS,
            BoolExpression.#BOOL_GRAMMAR
        );

        if (parseTree !== null) {
            this.#sSet = sSet;
            this.#invertedS = invertedS;
            this.#parseTree = parseTree;

            this.#varBitSet = getVarBitSet(expression);
            this.#varCount = this.#varBitSet.cardinality();
            this.#minTerms = calculateMinTerms(parseTree, this.#varBitSet);
        } else {
            let [parsed, minTerms, dontCares] = QMFuncs.parseString(expression);
            if (!parsed) {
                this.#errorCode = -2;
                return false;
            }

            let [validated, errorCode] = validateTerms(minTerms, dontCares);
            if (!validated) {
                this.#errorCode = errorCode;
                return false;
            }

            this.#varCount = QMFuncs.getVariableCount(minTerms, dontCares);
            this.#minTerms = minTerms;
            this.#dontCares = dontCares;
        }

        if (this.#isLogged) {
            this.#qmLog = [];
            this.#pmLog = [];
        }

        this.#reduce();
        this.#buildTruthTable();

        return true;
    };

    setMinTerms = (minTerms, dontCares) => {
        let [success, errorCode] = validateTerms(minTerms, dontCares);
        if (!success) {
            this.#errorCode = errorCode;
            return false;
        }

        this.#minTerms = minTerms;
        this.#dontCares = dontCares;
        this.#varCount = QMFuncs.getVariableCount(minTerms, dontCares);

        this.#sSet = null;
        this.expression = null;
        this.#invertedS = null;
        this.#parseTree = null;
        this.#varBitSet = null;

        if (this.#isLogged) {
            this.#qmLog = [];
            this.#pmLog = [];
        }

        this.#reduce();
        this.#buildTruthTable();

        return true;
    };

    #reduce = () => {
        let nonEssentialPrimeImps = QMFuncs.getPrimeImplicants(
            this.#minTerms,
            this.#dontCares,
            this.#qmLog
        );

        this.#petrickSOP = PMFuncs.getPetrickSOP(
            nonEssentialPrimeImps,
            this.#minTerms,
            this.#pmLog
        );

        this.#primeImps = QMFuncs.getEssentialTerms(
            nonEssentialPrimeImps,
            this.#minTerms
        );
    };

    #buildTruthTable = () => {
        this.#truthTable = [];

        let varRow = ["#"];
        if (this.#varBitSet) {
            let setBits = this.#varBitSet.toArray();
            for (const bit of setBits) {
                varRow.push(String.fromCharCode(bit + 65));
            }
        } else {
            for (let i = 0; i < this.#varCount; i++) {
                varRow.push(String.fromCharCode(i + 65));
            }
        }
        varRow.push("Output");
        this.#truthTable.push(varRow);

        let rowCount = 2 ** this.#varCount;
        for (let i = 0; i < rowCount; i++) {
            let row = [i];
            let bits = new BitSet(i);
            for (let j = 0; j < this.#varCount; j++) {
                row.push(parseInt(bits.get(this.#varCount - 1 - j)));
            }
            row.push(this.isMinTerm(i) ? "1" : "0");
            this.#truthTable.push(row);
        }
    };

    toString = () => {
        if (this.#expression) return this.#expression;

        let str = "m(";
        for (const term of this.#minTerms) str += parseInt(term) + " ";
        str = str.substr(0, str.length - 1) + ")";

        if (this.#dontCares.length) {
            str += "+d(";
            for (const term of this.#dontCares) str += parseInt(term) + " ";
            str = str.substr(0, str.length - 1) + ")";
        }

        return str;
    };

    isEssentialImplicant(qmTerm) {
        return this.#primeImps.some((e) => QMFuncs.isQMTermEqual(qmTerm, e));
    }

    isMinTerm(intTerm) {
        return this.#minTerms.includes(intTerm);
    }

    isDontCare(intTerm) {
        return this.#dontCares.includes(intTerm);
    }
}
