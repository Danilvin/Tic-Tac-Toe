import { useState } from 'react';

function Square({ value, onSquareClick, squares }) {
  if (squares[value] === 'X') {
      return (
        <button className="square text-red-600 cursor-pointer" id={value} onClick={onSquareClick}>
        {squares[value]}
        </button>
      );
  }
  else {
    return (
      <button className="square text-green-600 cursor-pointer" id={value} onClick={onSquareClick}>
      {squares[value]}
      </button>
    );
  }
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    const goToButtons = document.querySelectorAll('li > button')
    for (let i=0; i < goToButtons.length; i++) {
      goToButtons[i].style.backgroundColor = "white";
    }
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winnerStrat = calculateWinner(squares);
  let status;
  if (winnerStrat !== null) {
    status = 'Winner: ' + squares[winnerStrat[0]];
    document.getElementById(winnerStrat[0]).style.backgroundColor = "gold";
    document.getElementById(winnerStrat[1]).style.backgroundColor = "gold";
    document.getElementById(winnerStrat[2]).style.backgroundColor = "gold";
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    for (let i=0; i<9; i++) {
      if (document.getElementById(i)){
        document.getElementById(i).style.backgroundColor = "white";
      }
    }
  }

  function Status(){
    if (status.at(-1) === 'X'){
          return (
          <div className="status text-4xl bg-amber-400 p-4 rounded-lg">{status.slice(0,-1)}<span className='text-red-600'>{status.at(-1)}</span></div>
          );
    }
    else if (!squares.includes(null) && !winnerStrat) {
      return (
        <div className='status text-4xl bg-amber-400 p-4 rounded-lg'>Draw!</div>
      )
    }
    else {
          return (
          <div className="status text-4xl bg-amber-400 p-4 rounded-lg">{status.slice(0,-1)}<span className='text-green-600'>{status.at(-1)}</span></div>
          );
    }
  }

  return (
    <>
        <div className='flex flex-col items-center'>
          <Status />
          <div className='rows my-5'>
            <div className="board-row">
            <Square value={0} squares={squares} onSquareClick={() => handleClick(0)} />
            <Square value={1} squares={squares} onSquareClick={() => handleClick(1)} />
            <Square value={2} squares={squares} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
              <Square value={3} squares={squares} onSquareClick={() => handleClick(3)} />
              <Square value={4} squares={squares} onSquareClick={() => handleClick(4)} />
              <Square value={5} squares={squares} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
              <Square value={6} squares={squares} onSquareClick={() => handleClick(6)} />
              <Square value={7} squares={squares} onSquareClick={() => handleClick(7)} />
              <Square value={8} squares={squares} onSquareClick={() => handleClick(8)} />
          </div>
          </div>
        </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    const goToButtons = document.querySelectorAll('li > button')
    for (let i=0; i < goToButtons.length; i++) {
      goToButtons[i].style.backgroundColor = (i === nextMove) ? "oklch(62.3% 0.214 259.815)" : "white";
    }
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move} className='flex'>
        <button onClick={() => jumpTo(move)} className='text-4xl bg-white flex-1 my-1 rounded-xl px-4 py-2 border border-blue-700 cursor-pointer'>{description}</button>
      </li>
    );
  });

  return (
    <>
      <h1 className='text-6xl text-blue-700 my-6 text-center uppercase'>Tic-Tac-Toe</h1>
      <div className="game flex justify-around">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol className='bg-amber-400 p-5 rounded-2xl'>{moves}</ol>
        </div>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a,b,c];
    }
  }
  return null;
}
