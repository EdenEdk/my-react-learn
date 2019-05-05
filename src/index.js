import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            squareId:props.squareId,
        };
    }
    
    cellClicked() {
        this.props.squareClick(this.state.squareId);
    }

    render() {
      return (
        <button 
            className="square" 
            onClick={this.cellClicked.bind(this)}>
          {this.props.value}
        </button>
      );
    }
  }
  
  class Board extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isXTurn: true,
            squares: new Array(9).fill(null),
            winningState: [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
              ]
        };
    }

    componentDidUpdate(prevProps){
        if((this.props.gameOn !== prevProps.gameOn) && this.props.gameOn){
            console.log(this.props.gameOn);
            this.setState({
                isXTurn: true,
                squares: new Array(9).fill(null)
            });
        }
    }

    checkVictory(squareId, turnStr, recentSquares){
        const idWinArrays = this.state.winningState.filter((winArray)=>winArray.includes(squareId));
        const turnCode = turnStr.charCodeAt(0);
        let charCount;
        for(let winArr of idWinArrays){
            charCount = winArr.reduce((accumulator, currentValue)=>{
                const squareChar = recentSquares[currentValue] || 'NULL';
                return accumulator + squareChar.charCodeAt(0);
            },0);
            if(charCount/turnCode === 3){
                return true
            }
        }  
        return false;
    }

    squareClicked(squareId){
        if(!this.state.squares[squareId] && this.props.gameOn){
            const turn = this.getPlayerTurn();
            let squares = [...this.state.squares];
            squares[squareId] = turn;
            this.setState({isXTurn:!this.state.isXTurn, squares});
            const victory = this.checkVictory(squareId, turn, squares);
            if(victory){
                this.props.victory(turn);
            }
        }
    }
    
    renderSquare(i) {
      return <Square 
        squareId={i}
        value={this.state.squares[i]}
        squareClick={this.squareClicked.bind(this)}
      />;
    }

    getPlayerTurn(){
        return this.state.isXTurn ? 'X' : 'O';
    }
  
    render() {  
      return (
        <div>
          <div className="status">
            Next player:{this.getPlayerTurn()}
          </div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gameOn:true,
        };
    }

    startNewGame(){
        this.setState({gameOn:true});
    }

    showNewGameButton(){
        return this.state.gameOn ? 
            '' :       
            <button 
            onClick={this.startNewGame.bind(this)}>
            Start New Game</button> ;
    }

    victory(turn){
        alert(turn+' Won the game');
        this.setState({gameOn:false});
    }

    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board 
            gameOn={this.state.gameOn}
            victory={this.victory.bind(this)}
            />
          </div>
          <div className="game-info">
            {this.showNewGameButton()}
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  
  