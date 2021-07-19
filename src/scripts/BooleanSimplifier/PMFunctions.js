import StructFactory from "../StructFactory";
import QM from "./QMFunctions";

const LabelPair = StructFactory("qmTerm varName");

const PM = {
    getPetrickSOP(primeImps, minTerms, log) {
        let groupsMap = this.groupPrimeImplicants(primeImps, minTerms);

        let labels = [];
        if (log && primeImps.length) {
            let count = 0;
            for (const term of primeImps) {
                labels.push(
                    new LabelPair(
                        term,
                        String.fromCharCode(
                            (("K".charCodeAt(0) - 65 + count++) % 26) + 65
                        )
                    )
                );
            }

            let str = "";
            for (const value of groupsMap.values())
                str += this.sumToString(value, labels);
            log.push(str);
        }

        let solution = this.expandGroups(groupsMap, log, labels);
        this.removeLargerTerms(solution);
        this.removeSmallerDashes(solution);

        if (log && primeImps.length) {
            let str = "(" + this.sopToString(solution, labels) + ")";
            if (log[log.length - 1] !== str) log.push(str);
        }

        return solution;
    },

    sumToString(sum, labels) {
        if (sum.length === 0) return "";

        let str = "(";
        for (const term of sum) {
            let found = labels.find(
                (pair) =>
                    pair.qmTerm.term.equals(term.term) &&
                    pair.qmTerm.dashMask.equals(term.dashMask)
            );
            if (found !== undefined) {
                str += found.varName + " + ";
            }
        }
        str = str.substr(0, str.length - 3) + ")";
        return str;
    },

    groupPrimeImplicants(primeImps, minTerms) {
        let groups = new Map();

        // Initialize Groups
        for (let i = 0; i < minTerms.length; i++) groups.set(minTerms[i], []);

        // Group Prime Imps (QMTerms)
        for (let i = 0; i < primeImps.length; i++) {
            // Calculate min terms using dash positions
            let piMinTerms = QM.extractMinTerms(primeImps[i]);

            for (let j = 0; j < piMinTerms.length; j++) {
                // If extracted min term is not a don't care, insert it into the map
                if (groups.has(piMinTerms[j]))
                    groups.get(piMinTerms[j]).push(primeImps[i]);
            }
        }

        return groups;
    },

    // returns SOP
    expandGroups(groups, log, labels) {
        if (!groups.size) return [];

        let keys = Array.from(groups.keys());
        if (keys.length === 0) return [];

        let workingSOP = this.toSOP(groups.get(keys[0]));
        for (let i = 1; i < keys.length; i++) {
            let group = groups.get(keys[i]);
            if (group.length) {
                let nextSOP = this.toSOP(group);
                workingSOP = this.foilSums(workingSOP, nextSOP);

                workingSOP.sort((sop1, sop2) =>
                    sop1.length < sop2.length ? -1 : sop1.length > sop2.length ? 1 : 0
                );

                let logSOP = (sop) => {
                    let logStr = "(" + this.sopToString(sop, labels) + ")";
                    for (let j = i + 1; j < keys.length; j++)
                        logStr += this.sumToString(groups.get(keys[j]), labels);
                    log.push(logStr);
                };

                if (log) logSOP(workingSOP);
                workingSOP = this.simplifySOP(workingSOP);
                if (log) logSOP(workingSOP);
            }
        }

        return workingSOP;
    },

    // returns SOP
    oldExpandGroups(groups, log, labels) {
        if (!groups.size) return [];

        let workingSOP;
        for (let value of groups.values()) {
            if (workingSOP === undefined) {
                workingSOP = this.toSOP(value);
                continue;
            }

            if (value.length) {
                let nextSOP = this.toSOP(value);
                workingSOP = this.foilSums(workingSOP, nextSOP);

                workingSOP.sort((sop1, sop2) => (sop1.length > sop2.length && 1) || -1);
                workingSOP = this.simplifySOP(workingSOP);
            }
        }

        return workingSOP;
    },

    toSOP(sum) {
        let result = [];

        for (let i = 0; i < sum.length; i++) {
            result.push([sum[i]]);
        }

        return result;
    },

    removeLargerTerms(expression) {
        if (expression.length === 0) return;

        // Find smallest term size and remove those larger
        let smallest = expression[0].length;

        for (let i = 1; i < expression.length; ) {
            if (expression[i].length > smallest) expression.splice(i, 1);
            else {
                if (expression[i].length < smallest) smallest = expression[i].length;
                i++;
            }
        }

        // Iterate one more time to remove remaining large terms
        for (let i = 0; i < expression.length; ) {
            if (expression[i].length > smallest) expression.splice(i, 1);
            else i++;
        }
    },

    removeSmallerDashes(expression) {
        if (expression.length === 0) return;

        // Find largest dash count and remove those smaller
        let largestDash = 0;
        for (let i = 0; i < expression.length; ) {
            let dashCount = 0;
            for (let j = 0; j < expression[i].length; j++)
                dashCount += expression[i][j].dashMask.cardinality();

            if (dashCount < largestDash) expression.splice(i, 1);
            else {
                largestDash = dashCount;
                i++;
            }
        }

        // Iterate one more time to remove remaning small (larger) terms
        for (let i = 0; i < expression.length; ) {
            let dashCount = 0;
            for (let j = 0; j < expression[i].length; j++)
                dashCount += expression[i][j].dashMask.cardinality();

            if (dashCount < largestDash) expression.splice(i, 1);
            else i++;
        }
    },

    foilSums(firstSum, secondSum) {
        let result = [];
        for (let i = 0; i < firstSum.length; i++) {
            for (let j = 0; j < secondSum.length; j++) {
                for (let k = 0; k < secondSum[j].length; k++) {
                    let product = firstSum[i].slice();
                    let findVar = product.find((element) => element === secondSum[j][k]);
                    if (findVar === undefined) product.push(secondSum[j][k]);
                    result.push(product);
                }
            }
        }
        return result;
    },

    // Precondition: SOP is sorted by var count per term
    simplifySOP(sop) {
        let simplified = sop.slice();
        for (let i = 0; i < simplified.length; i++) {
            for (let j = i + 1; j < simplified.length; ) {
                if (this.isProductSubset(simplified[i], simplified[j]))
                    simplified.splice(j, 1);
                else j++;
            }
        }
        return simplified;
    },

    lessThanQMArray(array1, array2) {},
    isQMArrayEqual(array1, array2) {},
    isProductUnique(sop, product) {},
    isProductSubset(subset, superset) {
        if (subset.length > superset.length) return false;

        for (let i = 0; i < subset.length; i++) {
            if (
                superset.find((element) => {
                    return (
                        element.term.equals(subset[i].term) &&
                        element.dashMask.equals(subset[i].dashMask)
                    );
                }) === undefined
            )
                return false;
        }

        return true;
    },

    productToString(product, varCount) {
        let varLimit = varCount === 0 ? 25 : varCount - 1;

        // Edge case for contradictions
        if (product.length === 0) return "0";

        // Edge case for tautologies
        if (
            product.length === 1 &&
            product[0].term.cardinality() === 0 &&
            product[0].dashMask.cardinality() === varCount + 1
        )
            return "1";

        let string = "";
        for (let i = product.length - 1; i >= 0; i--) {
            let firstVar = true;
            for (let j = varLimit; j >= 0; j--) {
                if (product[i].dashMask.get(j) === 0) {
                    if (!firstVar) string += "*";
                    else firstVar = false;

                    if (product[i].term.get(j) === 0) string += "~";
                    string += String.fromCharCode(65 + (varLimit - j));
                }
            }

            if (i - 1 >= 0) string += " + ";
        }
        return string;
    },

    mapProductToString(product, varBitSet) {
        // Edge case for contradictions
        if (product.length === 0) return "0";

        // Edge case for tautologies
        if (
            product.length === 1 &&
            product[0].term.cardinality() === 0 &&
            product[0].dashMask.cardinality() === varBitSet.cardinality()
        )
            return "1";

        let varLimit = varBitSet.cardinality() - 1;
        let varPos = 0;
        let conversionMap = new Map();
        for (let i = 0; i < 26; i++) {
            if (varBitSet.get(i) === 0) continue;
            conversionMap.set(varLimit - varPos++, String.fromCharCode(i + 65));
        }

        let string = "";
        for (let i = 0; i < product.length; i++) {
            let firstVar = true;
            for (let j = varLimit; j >= 0; j--) {
                if (product[i].dashMask.get(j) === 0) {
                    if (!firstVar) string += "*";
                    else firstVar = false;

                    if (product[i].term.get(j) === 0) string += "~";
                    string += conversionMap.get(j);
                }
            }

            if (i < product.length - 1) string += " + ";
        }
        return string;
    },

    sopToString(sop, labels) {
        let str = "";
        for (const term of sop) {
            for (const product of term) {
                let found = labels.find(
                    (pair) =>
                        pair.qmTerm.term.equals(product.term) &&
                        pair.qmTerm.dashMask.equals(product.dashMask)
                );
                if (found !== undefined) str += found.varName;
            }
            str += " + ";
        }
        str = str.substr(0, str.length - 3);

        return str;
    },
};

export default PM;
