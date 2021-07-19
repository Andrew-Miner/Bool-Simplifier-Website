import React from "react";
import ExpressionForm from "./components/ExpressionForm";
import { Container, Row, Col } from "react-bootstrap";
import QMCard from "./components/QMCard";
import QMLog from "./components/QMLog";
import PMLog from "./components/PMLog";
import SOPCard from "./components/SOPCard";
import TTCard from "./components/TTCard";
import ITCard from "./components/ITCard";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class App extends React.Component {
    state = { expression: null, formValue: null };

    displayExpression = (expression) => {
        this.setState({ expression: expression });
    };

    render() {
        return (
            <Container>
                <div className="py-5">
                    <h2>Boolean Algebra Simplifier</h2>
                    <ExpressionForm
                        value={this.state.formValue}
                        displayExpression={this.displayExpression}
                    />
                </div>
                {this.state.expression !== null && (
                    <>
                        <Row>
                            <Col>
                                <SOPCard
                                    expression={this.state.expression}
                                    title="Minimum Sum-Of-Products Solution"
                                    bodyClass="scroll"
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mt-5">
                                <TTCard
                                    title="Truth Table"
                                    table={this.state.expression.getTruthTable()}
                                    bodyClass="scroll"
                                />
                            </Col>
                        </Row>
                        {this.state.expression.getMinTerms().length !== 0 && (
                            <>
                                <Row>
                                    <Col className="mt-5">
                                        <QMCard
                                            qmterms={this.state.expression.getEssentialImplicants()}
                                            varCount={this.state.expression.getVarCount()}
                                            expression={this.state.expression}
                                            title="Essential Prime Implicants"
                                        />
                                    </Col>
                                </Row>
                                <Row
                                    xs={1}
                                    md={
                                        this.state.expression.getQMLog().length > 3
                                            ? 3
                                            : this.state.expression.getQMLog().length
                                    }
                                >
                                    <QMLog
                                        expression={this.state.expression}
                                        className="mt-5"
                                    />
                                </Row>
                                <Row>
                                    <Col className="mt-5">
                                        <ITCard
                                            title="Essential Prime Implicant Chart"
                                            expression={this.state.expression}
                                            bodyClass="scroll"
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="mt-5">
                                        <PMLog
                                            log={this.state.expression.getPMLog()}
                                            title="Petrick's Method"
                                        />
                                    </Col>
                                </Row>
                            </>
                        )}
                    </>
                )}
            </Container>
        );
    }
}

export default App;
