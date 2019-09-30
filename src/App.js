import React from 'react';
import './App.css';

const defaultWidth = 20;
const defaultHeight = 20;

const nSquareToWin = 5;

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class SquareRow extends React.Component {
    render() {
        let squareRow = this.props.row.map((square, idx) => {
            let k = "s" + idx;
            return (
                <Square value={square} onClick={() => this.props.onClick(this.props.rowIdx, idx)} key={k} />
            )
        })
        return (
            <div className="board-row">
                {squareRow}
            </div>
        )
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    render() {
        let board;
        board = this.props.squares.map((row, idx) => {
            let k = "r" + idx;
            return (
                <SquareRow winner={this.props.winner} rowIdx={idx} row={row} onClick={this.props.onClick} key={k} />
            )
        })
        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        let tmpArr = Array(defaultHeight);
        for (let i = 0; i < defaultHeight; i++) {
            tmpArr[i] = Array(defaultWidth).fill(null);
        }
        this.state = {
            width: defaultWidth,
            height: defaultHeight,
            history: [{
                squares: tmpArr
            }],
            stepNumber: 0,
            xIsNext: true,
            isDescending: true,
        };
        this.sort = this.sort.bind(this);
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    handleClick(i, j) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();
        current.squares.map((row, idx) => {
            squares[idx] = current.squares[idx].slice();
            return true;
        })
        if (calculateWinner(squares) || squares[i][j]) {
            return;
        }
        squares[i][j] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: { x: i, y: j }
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }
    sort() {
        this.setState({isDescending: !this.state.isDescending });
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' (' + step.location.x + ',' + step.location.y + ')' :
                'Go to game start';
            return (this.state.stepNumber === move) ? (
                <li key={move}>
                    <button className="btn-bold" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            ) : (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                );
        });
        if (!this.state.isDescending) {
            moves = moves.reverse();
        }

        let status;
        if (winner) {
            status = 'Winner: ' + winner.val;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let arrow = this.state.isDescending ? '↓' : '↑'
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i, j) => this.handleClick(i, j)}
                        winner={winner}
                    />
                </div>
                <div className="game-info">
                    <div>
                        <button onClick={this.sort}>Thứ tự bước {arrow}</button>
                    </div>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>

        );
    }
}

function calculateWinner(squares) {
    let win;
    for (let i = 0; i < squares.length; i++) {
        for (let j = 0; j < squares[i].length; j++) {
            if (!squares[i][j]) continue;
            if (j <= squares[i].length - nSquareToWin) {
                win = true;
                for (let k = 0; k < nSquareToWin - 1; k++) {
                    if (squares[i][j + k] !== squares[i][j + k + 1]) {
                        win = false
                    }
                }
                if (win) return { val: squares[i][j], x: j, y: i, direction: 'ToRight' };
            }
            if (i <= squares.length - nSquareToWin) {
                win = true;
                for (let k = 0; k < nSquareToWin - 1; k++) {
                    if (squares[i + k][j] !== squares[i + k + 1][j]) {
                        win = false
                    }
                }
                if (win) return { val: squares[i][j], x: j, y: i, direction: 'ToDown' };
            }
            if (j <= squares[i].length - nSquareToWin && i <= squares.length - nSquareToWin) {
                win = true;
                for (let k = 0; k < nSquareToWin - 1; k++) {
                    if (squares[i + k][j + k] !== squares[i + k + 1][j + k + 1]) {
                        win = false
                    }
                }
                if (win) return { val: squares[i][j], x: j, y: i, direction: 'ToRightDown' };
            }
            if (i <= squares.length - nSquareToWin && j >= nSquareToWin - 1) {
                win = true;
                for (let k = 0; k < nSquareToWin - 1; k++) {
                    if (squares[i + k][j - k] !== squares[i + k + 1][j - k - 1]) {
                        win = false
                    }
                }
                if (win) return { val: squares[i][j], x: j, y: i, direction: 'ToLeftDown' };
            }
        }
    }
    return null;
}

export default Game;