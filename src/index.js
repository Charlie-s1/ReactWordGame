import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 * Create p that holds single letter of guess by user
 */
function Letter(props){
    return (
        <p className={`letterBox ${props.state}`}> {props.value} </p>
    )
}

/**
 * get and return random word from list
 */
let wordToGuess;
async function getWords(){
    const wordListRaw = await fetch("words.json");
    const wordList = await wordListRaw.json();
    wordToGuess = wordList[Math.floor(Math.random()*wordList.length)];
    return wordToGuess;
}

/**
 * create word board
 * populate with enough boxes for 5 guesses of the random word
 */
class Board extends React.Component {
    renderRow(start,end){
        let toReturn = [];
        for(let i=start; i<end; i++){
            toReturn.push(this.renderLetter(i));
        }
        return(toReturn)
    }
    renderLetter(i){
        return(<Letter
            key={i}
            value={this.props.letters[i]}
            state={this.props.letterState[i]}
        />)
    }
    render(){
        return(
            <div id="gameBoard">
                
                <div className="guessRow">
                    {this.renderRow(0,this.props.wordLength)}
                </div>
                <div className="guessRow">
                    {this.renderRow(this.props.wordLength,this.props.wordLength*2)}
                </div>
                <div className="guessRow">
                    {this.renderRow(this.props.wordLength*2,this.props.wordLength*3)}
                </div>
                <div className="guessRow">
                    {this.renderRow(this.props.wordLength*3,this.props.wordLength*4)}
                </div>
                <div className="guessRow">
                    {this.renderRow(this.props.wordLength*4,this.props.wordLength*5)}
                </div>
            </div>
        );
    }
}

/**
 * create game
 */
class Game extends React.Component {
    
    constructor(props){
        super(props);
        this.state = {
            letters:Array(0),
            letterState:Array(0),
            pos:0,
            guessStart:0,
            guessEnd:5,
            guessLength:0,
            guessWord:""
        }
        this.updateGuess();
    }

    /**
     * get new word and update board with enough boxes at setState
     */
    async updateGuess(){
        let word = await getWords();
        this.state.guessWord = word;
        this.state.guessLength = word.length;
        this.state.guessEnd = word.length;
        this.state.letters = Array(word.length*5).fill(null);
        this.setState({letterState : Array(word.length*5).fill(null)});
    }
    
    /**
     * handle user input
     * on enter check each letter with random word selected
     * on type update appropriate box with user input
     * on delete delete newest input from box
     */
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

            this.state.pos=this.state.guessEnd;
            this.state.guessStart+=this.state.guessLength;
            this.state.guessEnd+=this.state.guessLength;  
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
    /**
     * create game on site included user input box
     */
    render() {     
        const curLetters = this.state.letters;
        const curLetterState = this.state.letterState;
        return(
            <div id="game">
                <Board
                    letters={curLetters}
                    letterState={curLetterState}
                    wordLength={this.state.guessLength}
                />
                <input type="text" id="input" onKeyDown={(e) => this.handleKey(e)}></input>
            </div>
        )
    }
}

/**
 * create site
 */
ReactDOM.render(
    <Game/>,
    document.getElementById('root')

)
