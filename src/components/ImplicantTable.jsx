import { Table } from "react-bootstrap";
import { Badge } from "react-bootstrap";
import PM from "../scripts/BooleanSimplifier/PMFunctions";
import QM from "../scripts/BooleanSimplifier/QMFunctions";

export default function ImplicantTable(props) {
    let minTerms = props.expression.getMinTerms();
    minTerms.reverse();

    let primeImps = props.expression.getEssentialImplicants();
    let groups = PM.groupPrimeImplicants(primeImps, minTerms); // map

    const VAR_OFFSET = 10;
    let varCount = 0;
    return (
        <Table className={props.className} striped bordered hover>
            <thead>
                <tr>
                    <th className="text-center">Petrick Variable</th>
                    <th className="text-center">Essential Implicant</th>
                    {minTerms.map((term) => {
                        let group = groups.get(term);

                        if (group === undefined)
                            throw new Error(
                                "undefined prime implicant group [" + parseInt(term) + "]"
                            );

                        let cName = "text-center";
                        if (group.length === 1) cName += " success-cell";

                        return (
                            <th className={cName} key={term}>
                                <Badge pill bg="primary" className="ml-1">
                                    {term}
                                </Badge>
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {primeImps.map((imp) => (
                    <ImpRow
                        implicant={imp}
                        minTerms={minTerms}
                        implicantGroups={groups}
                        varCount={props.expression.getVarCount()}
                        variable={String.fromCharCode(
                            ((varCount++ + VAR_OFFSET) % 26) + 65
                        )}
                        key={imp.term.toString() + "-" + imp.dashMask.toString() + "-row"}
                    />
                ))}
            </tbody>
        </Table>
    );
}

function ImpRow(props) {
    let impMinTerms = QM.extractMinTerms(props.implicant);
    return (
        <tr>
            <td className="text-center">
                <strong>{props.variable}</strong>
            </td>
            <td className="text-center">
                <Badge bg="success" className="ml-1">
                    {QM.toString(props.implicant, props.varCount)}
                </Badge>
            </td>
            {props.minTerms.map((term) => {
                let group = props.implicantGroups.get(term);

                if (group === undefined)
                    throw new Error(
                        "undefined prime implicant group [" + parseInt(term) + "]"
                    );

                let cName = "text-center";
                if (group.length === 1) cName += " success-cell";

                if (impMinTerms.includes(term)) {
                    if (group.length === 1) {
                        return (
                            <td
                                className={cName}
                                key={
                                    parseInt(term) +
                                    "-" +
                                    QM.toString(props.implicant, props.varCount)
                                }
                            >
                                <Badge pill bg="danger" className="ml-1">
                                    <strong>X</strong>
                                </Badge>
                            </td>
                        );
                    } else {
                        return (
                            <td
                                key={
                                    parseInt(term) +
                                    "-" +
                                    QM.toString(props.implicant, props.varCount)
                                }
                                className={cName}
                            >
                                <strong>X</strong>
                            </td>
                        );
                    }
                }

                return (
                    <td
                        className={cName}
                        key={
                            parseInt(term) +
                            "-" +
                            QM.toString(props.implicant, props.varCount)
                        }
                    ></td>
                );
            })}
        </tr>
    );
}
