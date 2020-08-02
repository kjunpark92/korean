import React from 'react';
import 'style/Games.css';
import { connect } from "react-redux";
import { uuid } from 'uuidv4';
import  {gameScore, gameState, getRandomAnswer}  from 'actions/action';
import { GameLives, sendUpdateScore, getRandomInt, incorrectAnswersDisplayTable} from '../gameFunctions';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

class WordGame extends React.Component {
  constructor(props){
    super(props);
    //To give each button a selector reference
    this.keyRefOne = React.createRef();
    this.keyRefTwo = React.createRef();
    this.keyRefThree = React.createRef();
    this.keyRefFour = React.createRef();

    this.state = {
      correctAnswer: false,
      exitGame: false,
      gameScore: 0,
      heartDecrease: false,
      incorrectAnswer: false,
      incorrectAnswerArray: [],
      livesAvailable: 3,
      paused: false,
      playing: true,
      questionNumber: 0,
      scoreIncrease: false,
      showScore: false,
    }
  }

  componentDidMount() {
    this.props.dispatch(gameState("Playing"));
    document.addEventListener("keydown", this.keyDownEvent, false);
  }

  componentWillUnmount(){
    this.props.dispatch(gameState("Start"));
    document.removeEventListener("keydown", this.keyDownEvent, false);
  }

  //Return & Display the buttons for each word
  gameMatchingBoxes = () => {

    const answersArray = this.props.items;

    //If the final array is less than 4, pop it from the game.
    if(answersArray[this.state.questionNumber].length < 3){
      
      answersArray[this.state.questionNumber].pop();
    } else {
      const answers = answersArray[this.state.questionNumber];


      return (
        <div id="gameMatchingAnswers">
          <div className="gameMatchingBox" key={uuid()}>
            <input 
              type="button" 
              onClick={this.clickAnswerCheck}
              value={answers[0].korean}
              ref={this.keyRefOne}
            /> 
          </div>
          <div className="gameMatchingBox" key={uuid()} >
            <input 
              type="button" 
              onClick={this.clickAnswerCheck}
              value={answers[1].korean}
              ref={this.keyRefTwo}
            /> 
          </div>
          <div className="gameMatchingBox" key={uuid()} >
            <input 
              type="button" 
              onClick={this.clickAnswerCheck}
              value={answers[2].korean}
              ref={this.keyRefThree}
            /> 
          </div>
          <div className="gameMatchingBox" key={uuid()} >
            <input 
              type="button" 
              onClick={this.clickAnswerCheck}
              value={answers[3].korean}
              ref={this.keyRefFour}
            /> 
          </div>
        </div>
      )
    }
  }

  
  //Get the English word to display
  englishWordAnswer = () => {
    const answersArray = this.props.items;

    if(answersArray[this.state.questionNumber].length < 3){
      answersArray[this.state.questionNumber].pop();
    } else {
      return (
        answersArray[this.state.questionNumber][this.props.gameAnswer].english
      )
    }
  }

  //Get the Korean word to compare the user answer
  koreanWordAnswer = () => {
    const answersArray = this.props.items;
    if(answersArray[this.state.questionNumber].length < 3){
      
      answersArray[this.state.questionNumber].pop();
    } else {
      return answersArray[this.state.questionNumber][this.props.gameAnswer].korean
    }
  }
  
  //Check answer on click
  clickAnswerCheck = (event) => {
    event.preventDefault();
    const val = event.target.value;
    this.checkAnswer(val);
  }

  //Get key ref and check answer
  keyDownEvent = (event) => {

    switch(true) {
      case event.keyCode === 49 || event.keyCode === 97:
        this.keyRefOne.current.focus();
        this.checkAnswer(this.keyRefOne.current.value);
      break;

      case event.keyCode === 50 || event.keyCode === 98:
        this.keyRefTwo.current.focus();
        this.checkAnswer(this.keyRefTwo.current.value);
      break;

      case event.keyCode === 51 || event.keyCode === 99:
        this.keyRefThree.current.focus();
        this.checkAnswer(this.keyRefThree.current.value);
      break;

      case event.keyCode === 52 || event.keyCode === 100:
        this.keyRefFour.current.focus();
        this.checkAnswer(this.keyRefFour.current.value);
      break;

      default: 
        return
    }
  }

  //Check the answers
  checkAnswer = (val) => {

    if(this.state.paused) {
      return
    }
   
    if(val === this.koreanWordAnswer()){
      //Display correct div on correct
      this.setState({correctAnswer: true, incorrectAnswer: false, scoreIncrease: true, heartDecrease: false});
      //Increase score on correct
      this.setState(({ gameScore }) => ({
        gameScore: gameScore + 10
      }));

      //Next question
      this.timer = setTimeout(() => this.nextQuestion(), 500);

    } else {

      //Display incorrect div on incorrect
      this.setState({incorrectAnswer: true, correctAnswer: false, scoreIncrease: false, heartDecrease: true});

      //Remove heart 
      this.setState(({ livesAvailable }) => ({
        livesAvailable: livesAvailable - 1
      }));

      //Push the incorrect answers into an array 
      this.setState({ incorrectAnswerArray: [...this.state.incorrectAnswerArray, [this.englishWordAnswer(), this.koreanWordAnswer()]] });

      //Next question
      this.timer = setTimeout(() => this.nextQuestion(), 500);

    }
  }

  //Move to the next question
  nextQuestion = () => {
    //Get the array
    const answersArray = this.props.items;
    const gameLength = answersArray.length -2;

    //Get the game to end
    if(this.state.questionNumber === gameLength){
      this.finishGame();
    } else if (this.state.livesAvailable === 0) {
      this.finishGame();
    } else {

      //Continue the game until end
      this.setState(({ questionNumber }) => ({
        questionNumber: questionNumber + 1
      }));

      //Dispatch answer number to randomly get answers
      this.props.dispatch(getRandomAnswer(getRandomInt(4)));

      this.setState({incorrectAnswer: false, correctAnswer: false, scoreIncrease: false, heartDecrease: false})
    }
  }

  //Finish the game
  finishGame = () => {
    //Exit the game and display score
    this.setState({showScore: true, exitGame: true, playing: false, incorrectAnswer: false, correctAnswer: false});
   
    //Send the score to redux
    this.props.dispatch(gameScore(this.state.gameScore));

    //Check the score (if the user is logged in)
    if(this.props.userData !== ""  && this.state.gameScore > 0){
      //Update user score/rank
      this.timer = setTimeout(() => sendUpdateScore(this.props,this.state.gameScore), 500);
    }
  }

  //exit the game before the end
  exitGameEarly = () => {
    this.finishGame();
  }

  //Pause the game play
  pauseGame= () => {
    this.setState({paused: !this.state.paused})
  }

  //Reset the game to replay
  replayGame = () => {
    this.props.dispatch(gameState("Start"));
  }

  gamePlay = () => {
    const scoreIncrease = this.state.scoreIncrease ? 'scoreIncrease' : '';
    const pauseHide = this.state.paused ? 'pausedGame' : '';
    const pauseText = this.state.paused ? 'Continue Game?' : 'Pause Game?';

    return (
      <div>
        <div className="gameTopContent">
          <h4>Quickly choose the right word!</h4>
            <div>
              <p>Score: <span className={scoreIncrease}>{this.state.gameScore}</span></p>
            </div>
            <div>
              <p>Questions: {this.state.questionNumber+1}/{this.props.items.length -1}</p>
            </div>
            <div>
              <GameLives lives={this.state.livesAvailable} heartDecrease={this.state.heartDecrease}/>
            </div>
        </div>

        
        {this.state.paused ? <div className="pausedText"><h1>Paused</h1></div> : null}

        {this.state.playing ? <div className={pauseHide}>{this.gameMatchingBoxes()}</div> : null}

        {this.state.playing ? <h1 className={`displayAnswer ${pauseHide}`}>{this.englishWordAnswer()}</h1> : null}
          
        {this.state.correctAnswer ? <div className="correctTextDisplay"><h3>Correct! </h3></div> : null}

        {this.state.incorrectAnswer ? 
          <div className="incorrectTextDisplay">
            <h3>Incorrect!</h3>
            <p>The correct answer was <span>{this.koreanWordAnswer()}</span>.</p>
          </div> 
          : null
        }


        {this.state.showScore ? 
          <div className="gameFinalScore">
            <h2>Your score is: <span>{this.state.gameScore}</span></h2>
            <h2>You answered <span>{this.state.gameScore /10}</span> words correctly</h2>

            {this.state.livesAvailable !== 3 ? incorrectAnswersDisplayTable(this.state.incorrectAnswerArray) : null}

            <button onClick={this.replayGame} className="playAgainButton"><h3>Play Again?</h3></button>
            <Link to={`/LevelsRouter/GamesView?level=${this.props.level }`}>
              <button className="playAgainButton"><h3>See All Games</h3></button>
            </Link>
          </div> 
          : null
        } 

        {this.state.exitGame ? null :
          <div className="gameBottomContent">
            <button className="exitGameButton" onClick={this.exitGameEarly}>
              <h3>Exit Game?</h3>
            </button>
            <button className="pauseGameButton" onClick={this.pauseGame}>
              <h3>{pauseText}</h3>
            </button>
          </div>
        } 
      </div>
    )
  }

  render(){

    return(

      <div className="mainGameContent" id="gameMatchingPlayingContent">
        {this.props.gameState === "Playing" ? this.gamePlay() : null}
      </div>
      )
  }
}


WordGame.propTypes = {
  userData: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired
  ]),
} 

const mapStateToProps = state => ({
  userData: state.login.userData,
  gameState: state.gameState.gameState,
  gameAnswer: state.getRandomAnswer.gameAnswer
});

export default connect(mapStateToProps)(WordGame);