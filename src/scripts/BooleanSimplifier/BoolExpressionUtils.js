import { BOOL_GRAMMAR, BOOL_CALC_ACTIONS } from "./BoolExpressionGrammar";
import Recognizer from "../Earley Parser/EarleyRecognizer";
import Parser, { ParseNode } from "../Earley Parser/EarleyParser";
import BitSet from "bitset";
import { bnfGrammar, bnfActions, interpretBNF } from "../Earley Parser/BNFInterpreter";
//import BoolExpression from "./BoolExpression";

/*export default function boolMain(expStr) {
    try {
        let exp = BoolExpression.ExpressionInstance(expStr, true);

        console.log("Expression: ", exp.toString());
        console.log("Min Terms: ", exp.getMinTerms());
        console.log("Var Count: ", exp.getVarCount());
        console.log("Prime Implicants: ", exp.getPrimeImplicants());
        console.log("Petrick SOP: ", exp.getPetrickSOP());
        // Print Prime Implicants
        for (const implicant of exp.getPrimeImpStrings()) {
            console.log(implicant);
        }

        let petrickSOP = exp.getSOPStrings();
        for (let i = 0; i < petrickSOP.length; i++) {
            console.log("Solution ", i + 1, ": ", petrickSOP[i]);
        }

        let test = exp.getQMLog();
        console.log("QM Log: ", test);
        console.log("PM Log: ", exp.getPMLog());
    } catch (error) {
        console.log(error);
    }
}*/

export function buildBoolGrammar() {
    try {
        let grammar = BOOL_GRAMMAR.replaceAll("\\n", "\n");
        let s = Recognizer.buildItems(grammar, bnfGrammar);
        let invertedS = Parser.invertEarleySets(s, bnfGrammar);
        let parseTree = Parser.buildParseTree(grammar, invertedS, bnfGrammar);

        if (parseTree === null) {
            throw new Error("invalid grammar");
        }

        let simplifiedTree = Parser.applySemanticAction(
            (token) => new ParseNode(-1, token),
            parseTree,
            bnfActions
        );

        return interpretBNF(simplifiedTree);
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function calculateMinTerms(parseTree, varBitSet) {
    let varCount = varBitSet.cardinality();
    let minTerms = []; // array to be filled with minTerms
    let rowCount = 2 ** varCount;

    for (let i = rowCount - 1; i >= 0; i--) {
        let normalizedVariables = BitSet(i);
        let boolVal = calculateExpression(parseTree, varBitSet, normalizedVariables);
        if (boolVal) minTerms.push(i);
    }
    return minTerms;
}

function calculateExpression(parseTree, varBitSet, normVars) {
    let semanticActions = BOOL_CALC_ACTIONS.slice();
    let varCount = varBitSet.cardinality();

    let varPos = 0;
    for (let i = 0; i < 26; i++) {
        if (varBitSet.get(i) === 0) continue;
        let bool = normVars.get(varCount - 1 - varPos++);
        if (bool) {
            semanticActions[i + semanticActions.length - 52] = () => true;
            semanticActions[i + semanticActions.length - 26] = () => true;
        } else {
            semanticActions[i + semanticActions.length - 52] = () => false;
            semanticActions[i + semanticActions.length - 26] = () => false;
        }
    }

    return Parser.applySemanticAction((token) => token, parseTree, semanticActions);
}

export function validateTerms(minTerms, dontCares) {
    if (minTerms.length === 0) return [false, -1];
    for (const term of dontCares) if (minTerms.includes(term)) return [false, term];
    return [true, -2];
}

export function getVarBitSet(expStr) {
    let variables = new BitSet();
    for (let i = 0; i < expStr.length; i++) {
        if (/[A-Z]/.test(expStr[i])) {
            variables.set(expStr.charCodeAt(i) - 65, 1);
        }
    }
    return variables;
}

export function mapVariable(variable, varBitSet) {
    let setBits = varBitSet.toArray();

    // variable is an index
    if (variable === parseInt(variable))
        return String.fromCharCode(setBits[variable] + 65);

    //variable is a character
    return String.fromCharCode(setBits[variable.charCodeAt(0) - 65] + 65);
}

export function deepCopy(src) {
    let target = Array.isArray(src) ? [] : {};
    for (let key in src) {
        let v = src[key];
        if (v) {
            if (typeof v === "object") {
                target[key] = deepCopy(v);
            } else {
                target[key] = v;
            }
        } else {
            target[key] = v;
        }
    }

    return target;
}
