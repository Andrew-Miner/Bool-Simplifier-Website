import React from "react";
import { Card } from "react-bootstrap";

export default function PMLog(props) {
    let it = 0;
    let end = props.log.length - 1;
    return (
        <Card>
            <Card.Header as="h4">{props.title}</Card.Header>
            <Card.Body>
                {props.log.map((exp) => {
                    return (
                        <React.Fragment key={it}>
                            <div className="mb-1 mt-2">
                                {it !== end ? exp : exp.substring(1, exp.length - 1)}
                            </div>
                            {it++ !== end && <hr className="m-0" />}
                        </React.Fragment>
                    );
                })}
            </Card.Body>
        </Card>
    );
}
