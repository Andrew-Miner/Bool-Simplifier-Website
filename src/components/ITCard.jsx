import ImplicantTable from "./ImplicantTable";
import { Card } from "react-bootstrap";

export default function ITCard(props) {
    return (
        <Card>
            <Card.Header as="h4" className={props.bodyClass}>
                {props.title}
            </Card.Header>
            <Card.Body className={"p-0 " + (props.bodyClass ? props.bodyClass : "")}>
                <ImplicantTable className="m-0" expression={props.expression} />
            </Card.Body>
        </Card>
    );
}
