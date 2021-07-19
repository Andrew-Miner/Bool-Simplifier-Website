import React from "react";
import { InputGroup, FormControl, Button, Form, Col } from "react-bootstrap";
import BoolExpression from "../scripts/BooleanSimplifier/BoolExpression";
import AboutAccordion from "./AboutAccordion";

class ExpressionForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expValue: "",
            isInvalid: false,
            errorMsg: "Invalid Expression",
        };
        this.expression = null;
    }

    handleChange = (event) => {
        this.setState({ expValue: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        try {
            this.expression = BoolExpression.ExpressionInstance(
                this.state.expValue,
                true
            );
            this.setState({ isInvalid: false }, () => {
                this.props.displayExpression(this.expression);
            });
        } catch (error) {
            this.setState({ isInvalid: true, errorMsg: "Error: " + error.message + "!" });
        }
    };

    displayExpression = (str) => {
        try {
            this.expression = BoolExpression.ExpressionInstance(str, true);
            this.setState({ isInvalid: false, expValue: str }, () => {
                this.props.displayExpression(this.expression);
            });
        } catch (error) {
            this.setState({
                isInvalid: true,
                expValue: str,
                errorMsg: "Error: " + error.message + "!",
            });
        }
    };

    render() {
        return (
            <>
                <Form
                    noValidate
                    validated={this.state.validated}
                    onSubmit={this.handleSubmit}
                >
                    <Form.Group as={Col} controlId="expressionForm">
                        <InputGroup hasValidation>
                            <FormControl
                                required
                                placeholder="Enter Expression"
                                aria-label="Enter Expression"
                                aria-describedby="basic-addon"
                                onChange={this.handleChange}
                                isInvalid={this.state.isInvalid}
                                value={this.state.expValue}
                            />
                            <Button variant="secondary" id="button-addon" type="submit">
                                Simplify
                            </Button>
                            <Form.Control.Feedback type="invalid">
                                {this.state.errorMsg}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <AboutAccordion onClick={this.displayExpression} />
                </Form>
            </>
        );
    }
}

export default ExpressionForm;
