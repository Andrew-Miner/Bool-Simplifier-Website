import StructFactory from "../StructFactory";
import BitSet from "bitset";
const QMTerm = StructFactory("term dashMask used");
const REG_EXP = /^( *m *\( *\d+(?:, *\d+)* *\))( *\+ *d *\( *\d+(?:, *\d+)* *\))?$/;
const REG_NUMBS = /([\d,\s]+)/;

const QM = {
    getPrimeImplicants(minTerms, dontCares, log) {
        let allTerms = dontCares ? minTerms.concat(dontCares) : minTerms;
        let qmTerms = this.getQMArray(allTerms);
        qmTerms = this.fromatQMArray(qmTerms);

        let reducedTerms = [];
        this.reduceQMTerms(qmTerms, reducedTerms, log);
        this.removeDuplicateTerms(reducedTerms);
        return reducedTerms;
    },

    toString(qmTerm, variableCount) {
        let varLimit = variableCount === 0 ? 25 : variableCount - 1;

        let str = "";
        for (let i = varLimit; i >= 0; i--) {
            if ((i + 1) % 4 === 0) str += " ";
            if (qmTerm.dashMask.get(i) === 1) str += "-";
            else str += qmTerm.term.get(i);
        }
        return str;
    },

    getQMArray(intTerms) {
        let terms = [];
        intTerms.forEach((term) => {
            terms.push(new QMTerm(new BitSet(term), new BitSet(0), false));
        });
        return terms;
    },

    fromatQMArray(qmTerms) {
        // compareQMTerms works like a standard comparison function
        // and must be multiplied by -1 to sort in decending order
        return qmTerms.sort((term1, term2) => {
            return QM.compareQMTerms(term1, term2) * -1;
        });
    },

    // This function iterates the dashMask bitset
    // forward once and backward once. Each time it
    // comes accross a set bit it flips that bit in
    // in the minTerm bitset and stores the new
    // minTerm value. Aka O(2n) where n is the number
    // of variable in an expression. There is one other
    // algorithm I came up with that that is
    // O(2^(d+2) - 1) where d is the number of set
    // bits in the qmTerm's dashMask. Which algorithm
    // is better is heavily dependent on the number of
    // variables in an expression how reducable said
    // expression is. I decided to stick with the O(n)
    // case for the sake of being linear.
    extractMinTerms(qmTerm) {
        let minTerm = qmTerm.term;
        let resultant = [parseInt(minTerm.toString(10))];

        let curCount = 1;
        let dashPos = -1;
        let forward = true;
        let minTermCount = 2 ** qmTerm.dashMask.cardinality();

        while (curCount < minTermCount) {
            let nextPos = -1;

            if (forward) nextPos = this.nextDash(qmTerm.dashMask, dashPos);
            else nextPos = this.prevDash(qmTerm.dashMask, dashPos);

            if (nextPos === -1) {
                forward = !forward;
                continue;
            }

            dashPos = nextPos;
            minTerm.flip(dashPos);
            resultant.push(parseInt(minTerm.toString(10)));
            curCount++;
        }

        return resultant;
    },

    reduceQMTerms(qmTerms, resultant, log) {
        let tmpTerms = qmTerms.slice();
        let reducedTerms = [];

        if (log) log.push(qmTerms);

        for (let i = 0; i < tmpTerms.length; ) {
            for (let j = i + 1; j < tmpTerms.length; j++) {
                if (tmpTerms[i].dashMask.equals(tmpTerms[j].dashMask)) {
                    // Core of QM Method
                    let resultant = new QMTerm(
                        tmpTerms[i].term.and(tmpTerms[j].term),
                        tmpTerms[i].term.xor(tmpTerms[j].term),
                        false
                    );

                    // Real resultant will always have 1 more dash mark than the original terms
                    if (resultant.dashMask.cardinality() !== 1) continue;

                    resultant.dashMask = resultant.dashMask.or(tmpTerms[i].dashMask);

                    reducedTerms.push(resultant);

                    tmpTerms[i].used = true;
                    tmpTerms[j].used = true;
                }
            }

            // Remove Used Terms
            if (tmpTerms[i].used) tmpTerms.splice(i, 1);
            else i++;
        }

        // Remove any remaining used terms
        for (let i = 0; i < tmpTerms.length; ) {
            if (tmpTerms[i].used) tmpTerms.splice(i, 1);
            else i++;
        }

        // Save unused Terms
        resultant.push(...tmpTerms);

        // If we're not done reducing
        if (reducedTerms.length !== 0) {
            this.removeDuplicateTerms(reducedTerms);
            this.reduceQMTerms(reducedTerms, resultant, log);
        }
    },

    removeDuplicateTerms(qmTerms) {
        for (let i = 0; i < qmTerms.length; i++) {
            for (let j = i + 1; j < qmTerms.length; ) {
                if (
                    qmTerms[i].term.equals(qmTerms[j].term) &&
                    qmTerms[i].dashMask.equals(qmTerms[j].dashMask)
                )
                    qmTerms.splice(j, 1);
                else j++;
            }
        }
    },

    compareQMTerms(qmTerm1, qmTerm2) {
        let term1 = parseInt(qmTerm1.term.toString(10));
        let term2 = parseInt(qmTerm2.term.toString(10));
        return term1 < term2 ? -1 : term1 > term2 ? 1 : 0;
    },

    prevDash(dashMask, pos) {
        for (let i = pos === -1 ? dashMask.cardinality() - 1 : pos - 1; i >= 0; i--) {
            if (dashMask.get(i) === 1) return i;
        }
        return -1;
    },

    nextDash(dashMask, pos) {
        for (let i = pos === -1 ? 0 : pos + 1; i < dashMask.toString().length; i++) {
            if (dashMask.get(i) === 1) return i;
        }
        return -1;
    },

    parseString(expression) {
        if (!REG_EXP.test(expression)) return [false, [], []];

        let matches = expression.match(REG_EXP);
        let mNumbers = matches[1].match(REG_NUMBS);
        let minTerms = mNumbers[1].split(",").map((e) => parseInt(e));

        if (matches[2] === undefined) return [true, minTerms, []];

        let dNumbers = matches[2].match(REG_NUMBS);
        let dontCares = dNumbers[1].split(",").map((e) => parseInt(e));
        return [true, minTerms, dontCares];
    },

    getVariableCount(minTerms, dontCares) {
        let highest = 0;

        minTerms.forEach((term) => {
            if (term > highest) highest = term;
            else if (!highest && !term) highest = 1;
        });

        dontCares.forEach((term) => {
            if (term > highest) highest = term;
        });

        let bits = 0;
        while (highest) {
            highest >>>= 1;
            bits++;
        }

        return bits;
    },

    getEssentialTerms(qmTerms, minTerms) {
        let essentialTerms = [];

        for (let i = 0; i < qmTerms.length; i++) {
            let mins = this.extractMinTerms(qmTerms[i]);
            for (let j = 0; j < mins.length; j++) {
                if (minTerms.find((element) => element === mins[j])) {
                    essentialTerms.push(qmTerms[i]);
                    break;
                }
            }
        }

        return essentialTerms;
    },

    isQMTermEqual(qmTerm1, qmTerm2) {
        return (
            qmTerm1.term.equals(qmTerm2.term) && qmTerm1.dashMask.equals(qmTerm2.dashMask)
        );
    },
};

export default QM;
