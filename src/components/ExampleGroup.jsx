import React from "react";
import { ButtonGroup, Button } from "react-bootstrap";

export default function ExampleGroup(props) {
    let it = 0;
    let end = props.examples.length - 1;
    return (
        <ButtonGroup
            vertical
            className={"special " + (props.className ? props.className : "")}
        >
            {props.examples.map((e) => {
                return (
                    <React.Fragment key={e + "-fragment"}>
                        <Button
                            onClick={() => props.handleExample(e)}
                            size="sm"
                            variant="secondary"
                            key={e}
                        >
                            {e}
                        </Button>
                        {it++ !== end && (
                            <Button
                                disabled
                                className="mt-0 mb-0 pt-0 pb-0"
                                size="sm"
                                variant="secondary"
                            ></Button>
                        )}
                    </React.Fragment>
                );
            })}
        </ButtonGroup>
    );
}
