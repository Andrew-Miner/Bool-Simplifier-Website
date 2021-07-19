import { Table } from "react-bootstrap";

const OUTPUT_STYE = {
    borderLeft: "3px inset",
};

export default function TruthTable(props) {
    let table = props.table.slice();
    let header = table[0];
    table.splice(0, 1);

    let rowCount = 1;
    return (
        <Table className={props.className} striped bordered hover size="sm">
            <thead>
                <TruthHeader row={header} />
            </thead>
            <tbody>
                {table.map((row) => (
                    <TruthRow key={rowCount} rowNumber={rowCount++} row={row} />
                ))}
            </tbody>
        </Table>
    );
}

function TruthHeader(props) {
    let it = 0;
    let end = props.row.length - 1;
    return (
        <tr>
            {props.row.map((e) => {
                if (it++ === end)
                    return (
                        <th className="text-center" key={e} style={OUTPUT_STYE}>
                            {e}
                        </th>
                    );
                return (
                    <th key={e} className="text-center">
                        {e}
                    </th>
                );
            })}
        </tr>
    );
}

function TruthRow(props) {
    let it = 0;
    let end = props.row.length - 1;
    return (
        <tr>
            {props.row.map((e) => {
                if (it === 0) {
                    it++;
                    return (
                        <th
                            key={parseInt(props.rowCount) + "-" + parseInt(it - 1)}
                            className="text-center"
                        >
                            {e}
                        </th>
                    );
                }

                if (it === end) {
                    it++;
                    return (
                        <td
                            key={parseInt(props.rowCount) + "-" + parseInt(it - 1)}
                            className="text-center"
                            style={OUTPUT_STYE}
                        >
                            {e}
                        </td>
                    );
                }

                it++;
                return (
                    <td
                        key={parseInt(props.rowCount) + "-" + parseInt(it - 1)}
                        className="text-center"
                    >
                        {e}
                    </td>
                );
            })}
        </tr>
    );
}
