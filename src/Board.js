import React from 'react';
import SquareRow from './SquareRow';

class Board extends React.PureComponent {
    
    render() {
        const { squares, winner, onClick } = this.props;
        const board = squares.map((row, idx) => {
            const k = `r${  idx}`;
            return (
                <SquareRow winner={winner} rowIdx={idx} row={row} onClick={onClick} key={k} />
            )
        })
        return (
            <div>
                {board}
            </div>
        );
    }
}

export default Board;