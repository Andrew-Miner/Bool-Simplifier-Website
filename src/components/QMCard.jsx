import React from "react";
import { Badge, Card } from "react-bootstrap";
import QM from "../scripts/BooleanSimplifier/QMFunctions";

export default function QMCard(props) {
    let it = 0;
    let end = props.qmterms.length - 1;

    let getMinTermColor = (minTerm) => {
        if (!props.expression) return "info";
        if (props.expression.isMinTerm(minTerm)) return "primary";
        if (props.expression.isDontCare(minTerm)) return "danger";
        return "info";
    };

    let getImplicantColor = (qmTerm) => {
        if (!props.expression) return "warning";
        if (props.expression.isEssentialImplicant(qmTerm)) return "success";
        return "warning";
    };

    return (
        <Card>
            <Card.Header as="h4" className={props.headerClass}>
                {props.title}
            </Card.Header>
            <Card.Body className={props.bodyClass}>
                {props.qmterms.map((term) => {
                    return (
                        <React.Fragment
                            key={term.term.toString() + "-" + term.dashMask.toString()}
                        >
                            <div className="mb-1 mt-2 d-flex justify-content-between">
                                <div className="">
                                    {"("}
                                    {(() => {
                                        const minTerms = QM.extractMinTerms(term);
                                        const end = minTerms.length - 1;
                                        let it = 0;
                                        return QM.extractMinTerms(term).map((minTerm) => (
                                            <React.Fragment key={minTerm}>
                                                <Badge pill bg={getMinTermColor(minTerm)}>
                                                    {minTerm}
                                                </Badge>
                                                {it++ !== end && ","}
                                            </React.Fragment>
                                        ));
                                    })()}
                                    {")"}
                                </div>
                                <div className="">
                                    <Badge bg={getImplicantColor(term)} className="ml-1">
                                        {QM.toString(term, props.varCount)}
                                    </Badge>
                                </div>
                            </div>
                            {it++ !== end && <hr className="m-0" />}
                        </React.Fragment>
                    );
                })}
            </Card.Body>
        </Card>
    );
}
