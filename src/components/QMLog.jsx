import QMCard from "./QMCard";
import { Col } from "react-bootstrap";

export default function QMLog(props) {
    let iterationCount = 0;
    return props.expression.getQMLog().map((qmTerms) => {
        qmTerms.reverse();
        return (
            <Col
                className={props.className}
                key={"Iteration-" + parseInt(iterationCount)}
            >
                <QMCard
                    title={"Iteration #" + parseInt(iterationCount++)}
                    qmterms={qmTerms}
                    varCount={props.expression.getVarCount()}
                    expression={props.expression}
                />
            </Col>
        );
    });
}
