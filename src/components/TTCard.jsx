import TruthTable from "./TruthTable";
import { Card } from "react-bootstrap";

export default function TTCard(props) {
    return (
        <Card>
            <Card.Header as="h4" className={props.bodyClass}>
                {props.title}
            </Card.Header>
            <Card.Body className={"p-0 " + (props.bodyClass ? props.bodyClass : "")}>
                <TruthTable className="m-0" table={props.table} />
            </Card.Body>
        </Card>
    );
}
