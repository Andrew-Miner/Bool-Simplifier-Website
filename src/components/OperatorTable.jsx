import { Table } from "react-bootstrap";

export default function OperatorTable(props) {
    return (
        <Table className={props.className} borderless hover responsive size="sm">
            <thead className={props.headClass}>
                <tr className="text-center">
                    <th>Operator</th>
                    <th>Symbol</th>
                </tr>
            </thead>
            <tbody className={props.bodyClass}>
                <tr className="text-center">
                    <td>Not</td>
                    <td>~</td>
                </tr>
                <tr className="text-center">
                    <td>And</td>
                    <td>*</td>
                </tr>
                <tr className="text-center">
                    <td>Or</td>
                    <td>+</td>
                </tr>
                <tr className="text-center">
                    <td>Xor</td>
                    <td>^</td>
                </tr>
                <tr className="text-center">
                    <td>Nor</td>
                    <td>%</td>
                </tr>
                <tr className="text-center">
                    <td>Nand</td>
                    <td>@</td>
                </tr>
            </tbody>
        </Table>
    );
}
