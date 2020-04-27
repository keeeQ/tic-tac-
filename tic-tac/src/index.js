import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class  Square extends React.Component {
  constructor(props) { 
    super(props)

    this.butRef = React.createRef();
  }


  render() { 
    return(
      <button ref={this.butRef} className="square" onClick={this.props.change} style={{background:this.props.color}}>{this.props.innerValue}</button>
      )
  }
}

class Game extends React.Component { 

  constructor(props) { 
    super(props);
    this.state = {
        history: [
          {squares:Array(9).fill(null)}
        ],
        xTurn:true,

        winners :null,
        winStatus:false,
        winColor:'red',
        defaultColor:'#fff'
    }

    this.changeSquareBoard = this.changeSquareBoard.bind(this);
    this.refresh = this.refresh.bind(this);
    this.undoCallbackHandler = this.undoCallbackHandler.bind(this);

  }


  refresh () { 
    let newGame = [{squares:Array(9).fill(null)}]
    this.setState({
      history:newGame,
      xTurn:true
    });

  }

  undoCallbackHandler (_replace) {
    const historyCopy = this.state.history.slice();

    console.log(_replace);

     this.setState({
      history: this.state.history.concat([{
        squares: _replace.squares
      }]),

      
      xTurn: this.state.xTurn,
    });
     //here we are add the replace;

     let garbageBoards = _.remove(historyCopy,(s)=>{
          return s.squares !== _replace.squares;
     })

     this.setState({
        history:historyCopy,
        xTurn:this.state.xTurn

     });
  }

  undo () {
    const history = this.state.history;
    const hisCopy = history.slice();
    
    let undeElements = hisCopy.map((item,i)=>{

        return <li><UndoButton key={i} number={i} targetItem={item} handleUndo={(item)=>{this.undoCallbackHandler(item)}}/></li>

    });
 
    undeElements.pop();

    return undeElements;

  }

  changeSquareBoard(index) {  //worked;
    let square = this.getCurrentSquare();
    let copy = square.slice();
  
    if(copy[index] || calculateWinner(copy)) { 
      
      return;
    }
  
    copy[index] = this.state.xTurn ? 'X' : 'O';

     this.setState({
      history: this.state.history.concat([{
        squares: copy
      }]),
      
      xTurn: !this.state.xTurn,
    });


    if(calculateWinner(copy)) {
          
            const winObj = catachColor(copy);
            
            this.setState({winners:winObj,winStatus:true});             
      }  
  }

  getCurrentSquare () { //worked
    const history = this.state.history;
    
    const current = history[history.length-1];
    
    const currentSquare = current.squares;
   
    return currentSquare;
  }

  render () { 
      let status;
      let operatorString;
      const board = this.getCurrentSquare();
      const copy = board.slice();
      const winner = calculateWinner(copy);


      
      if(winner) {  
        
        operatorString = winner;
        status = `the winner is ${operatorString}`;
        
        

      } else {

        operatorString = this.state.xTurn ? 'X' : 'O';
        status = `the next is ${operatorString}`;
      }


      return  (
        <div>

              <Refresh onRefreshHandle={()=>{this.refresh()}}/>
              <div className="game">
             <div className="game-board">
              <Board square={this.getCurrentSquare()} turn={this.state.xTurn} csb={(i)=>{this.changeSquareBoard(i)}} winnerX={this.state.winners} defaultColor={this.state.defaultColor} winC={this.state.winColor} winState={this.state.winStatus}/>
            </div>
            <div className="game-info">
              <div>{status}</div>
              <ol>{this.undo()}</ol>
            </div>
          </div>
        </div>
      )

// moves gonna be the past buttons;


  }


}


const Refresh = (props) =>{

  return (
      <button onClick={props.onRefreshHandle}>refresh</button>
    )

}


const UndoButton = (props) =>{

  return (
      <button onClick={props.handleUndo.bind(null,props.targetItem)} >back to step {props.number}</button>
    )

}



class Board extends React.Component { 

  constructor(props) {
    super(props);
    this.state = {
      winner : { 
        winColor:this.props.winC,
        winState:this.props.winState
      }
      
    }

  }


  checkForWinner(winners) { 
    
    if(+winners === 0){
      console.log('null entered');
      return;

    }
   
      // console.log(winners);
     
     //  console.log(firstIndex,secondIndex,thirdIndex);
      return winners;
  } 



//we aware of the props to take the position to render the colored squre


  renderSquare(i) {
    //the method above worked ;



    return  (
      <Square key={i} num={i} innerValue={this.props.square[i]} change={()=>{this.props.csb(i)}} color={this.props.defaultColor}/>
    )
  }


  buttonManger(arr)  { 
      let targets = 'not defined';
      let winner = this.checkForWinner(this.props.winnerX);
      // console.log(winner);
      if(winner) {

          let {first,second,third} = winner;
          targets = [first,second,third];

          //first , second, third are the index of the render Squares
      }



        let buttons = arr.map((item)=>{
            return this.renderSquare(item);
        });




      if(targets!='not defined') { 
          console.log(targets);
          //here we are going to find the indexes
      }

          let split3= _.chunk(buttons,3);
          let [first,second,third] = split3;
          
          return {one:first,two:second,three:third};

  }


    render()  {
      // let firstRow = [this.renderSquare(0),this.renderSquare(1),this.renderSquare(2)]
      let squares = this.buttonManger([0,1,2,3,4,5,6,7,8]);


      return (
           <div>
        
        <div className="board-row">
         {squares.one}
        </div>
        <div className="board-row">
          {squares.two}
        </div>
        <div className="board-row">
          {squares.three}
        </div>
      </div>

        )
   }
}


ReactDOM.render(<Game/>,document.querySelector('.root'));


//this function calculate the winner  ABSTRACTION : null,'X','O'

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
     return squares[a]
    }
  }
  return null;
}

function catachColor(squares) { 

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
     return {first:a,second:b,third:c}
    }
  }
  return null;

}


//END . 
