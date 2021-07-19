import React from "react";
import { Row, Col, Card, Badge } from "react-bootstrap";
import CopyIco from "../copyoutlined.svg";

export default function SOPCard(props) {
    let onClick = (event) => {
        let sops = props.expression.getSOPStrings();

        let end = sops.length - 1;
        let str = "";
        for (let i = 0; i < sops.length; i++) {
            str += sops[i];
            if (i !== end) str += " | ";
        }
        let textField = document.createElement("textarea");
        textField.innerText = str;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand("copy");
        textField.remove();
    };

    return (
        <Card>
            <Card.Header className={props.headerClass}>
                <button
                    onClick={onClick}
                    style={{ background: "transparent", border: "none", color: "white" }}
                >
                    <h4>
                        {props.title}
                        <img src={CopyIco} alt="Copy Icon" width="32" height="25" />
                    </h4>
                </button>
            </Card.Header>
            <Card.Body className={props.bodyClass}>
                <Row>
                    {props.expression.getSOPStrings().map((sop) => (
                        <React.Fragment key={sop}>
                            <Col
                                as="h5"
                                className="d-flex d-none d-md-flex justify-content-center  mb-2"
                            >
                                <Badge pill bg="primary">
                                    {sop}
                                </Badge>
                            </Col>
                            <Col
                                as="h5"
                                className="d-flex d-md-none justify-content-left mb-2"
                            >
                                <Badge pill bg="primary">
                                    {sop}
                                </Badge>
                            </Col>
                        </React.Fragment>
                    ))}
                </Row>
            </Card.Body>
        </Card>
    );
}
