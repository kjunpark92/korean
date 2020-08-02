import React from 'react';
import 'style/Games.css';
import { connect } from "react-redux";
import { uuid } from 'uuidv4';
import  {gameScore, gameState}  from 'actions/action';
import { GameLives, sendUpdateScore, incorrectAnswersDisplayTable} from '../gameFunctions';
import PropTypes from 'prop-types';
import Draggable from 'react-draggable';
import {dragGame} from 'actions/action';
import {Link} from 'react-router-dom';

class DragDropGame extends React.Component {
  constructor(props){
    super(props);
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
    this.props.dispatch(dragGame(null));
  }

  componentWillUnmount(){
    this.props.dispatch(gameState("Start"));
    this.props.dispatch(dragGame(null));
  }

  //Send the draggable Korean word to redux
  handleEvent = (e) => {
    const val = e.target.textContent;
    this.props.dispatch(dragGame(val));
  }

  //Return & Display draggable for each word
  displayDraggable = () => {

    const answersArray = this.props.items;

    //If the final array is less than 4, pop it from the game.
    if(answersArray[this.state.questionNumber].length < 3){
      
      answersArray[this.state.questionNumber].pop();
    } else {
      const answers = answersArray[this.state.questionNumber].map((answers) => {
        return(
          <Draggable
            axis="both"
            onMouseDown={this.handleEvent}
            key={uuid()}
          >
            <h3 className="draggableBox">{answers.korean}</h3>
          </Draggable>
        )
      });
      return answers;
    }
  }

  //Return the answer
  englishWordAnswer = () => {
    const answersArray = this.props.items;
    const newAnswer = answersArray[this.state.questionNumber][0];

    //If the final array is less than 4, pop it from the game.
    if(answersArray[this.state.questionNumber].length < 3){
      answersArray[this.state.questionNumber].pop();
    } else {
      return (
        newAnswer.english
      )
    }
  }

  //Provide the Korean answer to match with the selected answer
  koreanWordAnswer = () => {
    const answersArray = this.props.items;
    const newAnswer = answersArray[this.state.questionNumber][0];

    //If the final array is less than 4, pop it from the game.
    if(answersArray[this.state.questionNumber].length < 3){
      answersArray[this.state.questionNumber].pop();
    } else {
      return (
        newAnswer.korean
      )
    }
  }

  //Check the correct answer with selected answer
  checkAnswer = () => {

    if(this.state.paused) {
      return
    }

    if(this.props.dragAnswer !== null) {
      if(this.props.dragAnswer === this.koreanWordAnswer()){
  
        this.setState({correctAnswer: true, incorrectAnswer: false, scoreIncrease: true, heartDecrease: false});
        //Increase score on correct
        this.setState(({ gameScore }) => ({
          gameScore: gameScore + 10
        }));

      } else {
         //Display incorrect div on incorrect
         this.setState({incorrectAnswer: true, correctAnswer: false, scoreIncrease: false, heartDecrease: true});
  
         //Remove heart 
         this.setState(({ livesAvailable }) => ({
           livesAvailable: livesAvailable - 1
         }));

        //Push the incorrect answers into an array 
        this.setState({ incorrectAnswerArray: [...this.state.incorrectAnswerArray, [this.englishWordAnswer(), this.koreanWordAnswer()]] });
      }

      //Next question
      this.timer = setTimeout(() => this.nextQuestion(), 500);
      //Dispatch redux null to reset the draggable
      this.props.dispatch(dragGame(null));
    } 

  }

  //Go to the next question
  nextQuestion = () => {
    this.setState({incorrectAnswer: false, correctAnswer: false, scoreIncrease: false, heartDecrease: false});
    
    //Get the array
    const gameLength = this.props.items.length -2;

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
    }
  }

  //Finish the game when max questions reached
  finishGame = () => {
    //Exit the game and display score
    this.setState({showScore: true, exitGame: true, playing: false, incorrectAnswer: false, correctAnswer: false});
   
    //Send the score to redux
    this.props.dispatch(gameScore(this.state.gameScore));

    //Check the score (if the user is logged in)
    if(this.props.userData !== ""  && this.state.gameScore > 0){
      this.timer = setTimeout(() => sendUpdateScore(this.props,this.state.gameScore), 500);
    }
  }

  //exit the game before the end of questions
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

        {this.state.correctAnswer ? <div className="correctTextDisplay"><h3>Correct! </h3></div> : null}
         
        {this.state.incorrectAnswer ? <div className="incorrectTextDisplay"><h3>Incorrect!</h3></div> : null}

        {this.state.playing ? 
          <div className={`dragContent ${pauseHide}`}>
            <div id="draggableGameColumn">{this.displayDraggable()}</div>

            <div id="draggableAnswersColumn">
              <div className="answerBoxes" key={uuid()} onMouseOver={this.checkAnswer} onClick={this.checkAnswerthisasdadadasdsa}>
                <h3>{this.englishWordAnswer()}</h3>
              </div>
            </div> 
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

      <div className="mainGameContent"  id="dragGameMain">
        {this.props.gameState === "Playing" ? this.gamePlay() : null}
      </div>
      )
  }
}


DragDropGame.propTypes = {
  gameData: PropTypes.string.isRequired,
  userData: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired
  ]),
} 

const mapStateToProps = state => ({
  userData: state.login.userData,
  gameData: state.gameData.gameData,
  gameState: state.gameState.gameState,
  dragAnswer: state.dragGame.dragAnswer,
});

export default connect(mapStateToProps)(DragDropGame);