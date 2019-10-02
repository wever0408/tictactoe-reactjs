import React from 'react';
import Square from './Square';

class SquareRow extends React.PureComponent {
   
    render() {
        const { row, onClick , rowIdx } = this.props;
        const squareRow = row.map((square, idx) => {
            const k = `s${  idx}`;
            return (
                <Square value={square} onClick={() => onClick(rowIdx, idx)} key={k} />
            )
        })
        return (
            <div className="board-row">
                {squareRow}
            </div>
        )
    }
}

export default SquareRow;