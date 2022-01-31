import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Letter(props){
    return (
        <p className={`letterBox ${props.state}`}> {props.value} </p>
    )
}

class Board extends React.Component {
    renderLetter(i){
        return(<Letter
            value={this.props.letters[i]}
            state={this.props.letterState[i]}
        />)
    }
    render(){
        return(
            <div id="gameBoard">
                <div className="guessRow">
                    {this.renderLetter(0)}
                    {this.renderLetter(1)}
                    {this.renderLetter(2)}
                    {this.renderLetter(3)}
                    {this.renderLetter(4)}
                </div>
                <div className="guessRow">
                    {this.renderLetter(5)}
                    {this.renderLetter(6)}
                    {this.renderLetter(7)}
                    {this.renderLetter(8)}
                    {this.renderLetter(9)}
                </div>
                <div className="guessRow">
                    {this.renderLetter(10)}
                    {this.renderLetter(11)}
                    {this.renderLetter(12)}
                    {this.renderLetter(13)}
                    {this.renderLetter(14)}
                </div>
                <div className="guessRow">
                    {this.renderLetter(15)}
                    {this.renderLetter(16)}
                    {this.renderLetter(17)}
                    {this.renderLetter(18)}
                    {this.renderLetter(19)}
                </div>
                <div className="guessRow">
                    {this.renderLetter(20)}
                    {this.renderLetter(21)}
                    {this.renderLetter(22)}
                    {this.renderLetter(23)}
                    {this.renderLetter(24)}
                </div>
            </div>
        );
    }
}
class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            letters:Array(25).fill(null),
            letterState:Array(25).fill(null),
            pos:0,
            guessStart:0,
            guessEnd:5,
            guessWord:"hello"
        }
    }
    
    handleKey(e){
        const currentLetters = this.state.letters.slice();
        const curLetterState = this.state.letterState.slice();
        let curpos = this.state.pos;
        
        if(e.key=="Enter"){
            document.querySelector("#input").value="";

            const userGuess = currentLetters.slice(this.state.guessStart,this.state.guessEnd)
            const toGuess = this.state.guessWord.split("");
            let count = 0;
            for(const i of userGuess){
                if (userGuess[count] == toGuess[count]) {
                    curLetterState[count+this.state.guessStart] = "same";                  
                }
                else if(toGuess.includes(i)){ 
                    curLetterState[count+this.state.guessStart] = "exists";
                }else{
                    curLetterState[count+this.state.guessStart] = "none";
                }
                
                count++;
            }
            console.log(this.state.letterState);

            this.state.pos=this.state.guessEnd;
            this.state.guessStart+=5;
            this.state.guessEnd+=5;   
        }
        if (e.key == "Backspace" && this.state.pos > this.state.guessStart){
            currentLetters[this.state.pos-1] = null;
            this.state.pos--;
        }else if(this.state.pos<this.state.guessEnd && e.key!="Backspace" &&e.key!="Enter"){
            currentLetters[curpos] = e.key;
            this.state.pos++;
        }
        this.setState({letterState : curLetterState});
        this.setState({ letters : currentLetters});


    }
    render() {
        const curLetters = this.state.letters;
        const curLetterState = this.state.letterState;
        return(
            <div>
                <Board
                    letters={curLetters}
                    letterState={curLetterState}
                />
                <input type="text" id="input" onKeyDown={(e) => this.handleKey(e)}></input>
            </div>
        )
    }
}

/**
 * 
 */
ReactDOM.render(
    <Game />,
    document.getElementById('root')

)
