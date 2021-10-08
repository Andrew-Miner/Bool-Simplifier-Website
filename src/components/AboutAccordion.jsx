import { Col, Row, Accordion } from "react-bootstrap";
import OperatorTable from "./OperatorTable";
import ExampleGroup from "./ExampleGroup";

const EXAMPLES_1 = ["A", "~A", "~~A", "A * ~A"];
const EXAMPLES_2 = ["A + 1", "A + 0", "A + B", "A + ~B"];
const EXAMPLES_3 = [
    "m(2, 3, 7, 9, 11, 13)",
    "m(2, 3, 7, 9, 11, 13) + d(1, 10, 15)",
    "~(A^C)@(B%D)",
    "(A+~C+B*D)*(~A+(~B+D)*(C+~D))",
];

export default function AboutAccordion(props) {
    let handleClick = (e) => {
        props.onClick(e);
    };

    return (
        <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                    <p>
                        Operator Symbols <b>/</b> Examples <b>/</b> About
                    </p>
                </Accordion.Header>

                <Accordion.Body>
                    <Row>
                        <Col className="align-self-center pt-3">
                            <OperatorTable
                                bodyClass="bg-white"
                                headClass="table-header-dark"
                            />
                        </Col>
                        <Col md={8}>
                            <Row xs={1}>
                                <Row>
                                    <h4 className="text-center">
                                        <strong>About</strong>
                                    </h4>
                                    <p style={{ textIndent: "20px" }}>
                                        This application can simplifiy either a boolean
                                        algebra expression or a set of minimum terms and
                                        "don't care" terms. Both
                                        <b> Quine McCluskey's Algorithm</b> and
                                        <b> Petrick's Method</b> are utilized to reduce an
                                        expression to it's minimum sum-of-products. An
                                        <b> Earley Parser</b> is used to parse expressions
                                        given by the user. This project and the Earley
                                        Parser were written by <b>Andrew Miner</b>.{" "}
                                        <a href="https://github.com/Andrew-Miner/Bool-Simplifier-Website">
                                            Check out the GitHub!
                                        </a>
                                    </p>
                                </Row>
                                <Col md={3}>
                                    <ExampleGroup
                                        examples={EXAMPLES_1}
                                        handleExample={handleClick}
                                        className="mt-3"
                                        key="examples_1"
                                    />
                                </Col>
                                <Col md={3}>
                                    <ExampleGroup
                                        examples={EXAMPLES_2}
                                        handleExample={handleClick}
                                        className="mt-3"
                                        key="examples_2"
                                    />
                                </Col>
                                <Col md={6}>
                                    <ExampleGroup
                                        examples={EXAMPLES_3}
                                        handleExample={handleClick}
                                        className="mt-3"
                                        key="examples_3"
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
