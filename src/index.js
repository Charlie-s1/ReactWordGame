import React from 'react';
import ReactDOM from 'react-dom';
import {words} from './words.js';
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
async function getWord(){
    wordToGuess = words[Math.floor(Math.random()*words.length)];
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
 * create virtual keyboard
 */
function KeyBoard(props){
    const order = [
        ['q','w','e','r','t','y','u','i','o','p'],
        ['a','s','d','f','g','h','j','k','l'],
        ['Del','z','x','c','v','b','n','m','Enter']
    ]
    function createRow(list){
        let toReturn=[];
        for (let i of list){
            toReturn.push(
            <Key
                key={i}
                value={i}
                handleClick={(e)=>props.handleClick(e)}
            />);
        } 
        return toReturn;
    }
    return(
        <div id="keyboard">
            <div>{createRow(order[0])}</div>
            <div>{createRow(order[1])}</div>
            <div>{createRow(order[2])}</div>
        </div>
    )
}
function Key(props){
    return(
        <p id={props.value.toLowerCase()} onClick={(e)=>props.handleClick(e)}>{props.value}</p>
    )
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
            finish:false,
            guessStart:0,
            guessEnd:5,
            guessLength:0,
            guessWord:"",
        }
        this.updateGuess();
    }

    /**
     * get new word and update board with enough boxes at setState
     */
    async updateGuess(){
        let word = await getWord();
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
    handleClick(e){
        console.log(e);
    }
    handleKey(e){
        const currentLetters = this.state.letters.slice();
        const curLetterState = this.state.letterState.slice();
        let curpos = this.state.pos;


        if(e.target.innerText==="Enter"){
            // document.querySelector("#input").value="";
            
            const userGuessRaw = currentLetters.slice(this.state.guessStart,this.state.guessEnd)
            const userGuess = userGuessRaw.map(i => {
                if(i==null){
                    return;
                }
                return i.toLowerCase();
            });
            const toGuess = this.state.guessWord.split("");
            let count = 0;
            for(const i of userGuess){
                if (userGuess[count] === toGuess[count]) {
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
            if(this.state.pos >= this.state.letters.length){
                this.state.finish = true;
            }
            this.state.guessStart+=this.state.guessLength;
            this.state.guessEnd+=this.state.guessLength;  
        }
        if (e.target.innerText === "Del" && this.state.pos > this.state.guessStart){
            currentLetters[this.state.pos-1] = null;
            this.state.pos--;
        }else if(this.state.pos<this.state.guessEnd && e.target.innerText!=="Del" &&e.target.innerText!=="Enter"){
            currentLetters[curpos] = e.target.innerText;
            this.state.pos++;
        }
        this.state.letterState = curLetterState;
        this.setState({ letters : currentLetters});
    }
    

    /**
     * create game on site included user input box
     */
    render() {    
        const curLetters = this.state.letters;
        const curLetterState = this.state.letterState;
        let answer = this.state.finish ? 
            `Answer: ${this.state.guessWord}` : 
            "";
        return(
            <div id="game">
                <Board
                    letters={curLetters}
                    letterState={curLetterState}
                    wordLength={this.state.guessLength}
                />
                <p>{answer}</p>
                {<KeyBoard
                    handleClick={(e)=>this.handleKey(e)}
                />}
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

);
document.body.addEventListener('keydown',(e)=>{
    document.querySelector(`#${e.key=="Backspace" ? "del" : e.key.toLowerCase()}`).click();
})
