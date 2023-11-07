import React from 'react';
import  ReactDOM  from 'react-dom/client';
import './index.css';

function Square(props){
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function CheckClick(a) {
    if (a === 'X' || a === 'O') {
        return true;
    } else {
        return false;
    }
}


class Board extends React.Component {
    renderSquare(i) {
        return (
          <Square
            value={this.props.squares[i]} 
            onClick={()=> this.props.onClick(i)}
            />
        );
    }
    render() {
        return (
            <div className='board-container'>
                <div className="board-row">
                    <div id="0">{this.renderSquare(0)}</div>
                    <div id="1">{this.renderSquare(1)}</div>
                    <div id="2">{this.renderSquare(2)}</div>
                </div>
                <div className="board-row">
                    <div id="3">{this.renderSquare(3)}</div>
                    <div id="4">{this.renderSquare(4)}</div>
                    <div id="5">{this.renderSquare(5)}</div>
                </div>
                <div className="board-row">
                    <div id="6">{this.renderSquare(6)}</div>
                    <div id="7">{this.renderSquare(7)}</div>
                    <div id="8">{this.renderSquare(8)}</div>
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                squares: Array(9).fill(null)
                }
            ],
            stepnumber: 0,
            xisnext:true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepnumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xisnext ? 'X' : 'O';
        this.setState({
            history : history.concat([{
                squares: squares
            }]),
            stepnumber: history.length,
            xisnext: !this.state.xisnext
        });
    }
    jumpTo(step) {
        this.setState({
            stepnumber: step,
            xisnext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepnumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step,move) => {
            const desc = move ?
            'Go to move   #' + move :
            'Go to game start';
            return (
                <li key={move}>
                    <button className='status-button' onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if(winner){
            status = 'Winner is ' + winner[0];
            document.getElementById(`${winner[1][0]}`).style.background = "black";
            document.getElementById(`${winner[1][1]}`).style.background = "black";
            document.getElementById(`${winner[1][2]}`).style.background = "black";
        } else if(current.squares.every(CheckClick)) {
            status = 'The Game is a Tie';
        } else {
            status = 'Next player is ' + (this.state.xisnext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <h1 className="header">TIC-TAC-TOE</h1>
                    <Board 
                    squares = {current.squares}
                    onClick={i=> this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className='status'>{status}</div>
                    <ul>{moves}</ul>
                </div>
            </div>
        );
    }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i=0; i<lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a]===squares[b] && squares[a]===squares[c]) {
            return [squares[a],[a,b,c]];
        }
    }
    return null;
}