import React from 'react';
import 'style/Games.css';
import { connect } from "react-redux";
import { uuid } from 'uuidv4';
import  {gameScore, gameState}  from 'actions/action';
import {shuffle, GameLives, replayGame, gameLengthening, sendUpdateScore} from '../gameFunctions';
import PropTypes from 'prop-types';


class ImageGame extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      playing: true,
      gameScore: 0,
      gameCount : 0,
      showScore: false,
      correctAnswer: false,
      incorrectAnswer: false,
      exitGame: true,
      questionNumber: 0,
      livesAvailable: 3,
    }
  }

  componentDidMount() {
    this.props.dispatch(gameState("Playing"));
  }

  componentWillUnmount(){
    this.props.dispatch(gameState("Start"));
  }

  //Return & Display the images for each word
  imageMatchingBoxes = () => {

    const answersArray = gameLengthening(this.props);

    //If the final array is less than 4, pop it from the game.
    if(answersArray[this.state.questionNumber].length < 3){
      
      answersArray[this.state.questionNumber].pop();
    } else {
      const answers = shuffle(answersArray[this.state.questionNumber].map((answers) => {

        return(
          <div className="imageMatchingBox" key={uuid()}>
            {answers.korean}
            <input 
              type="image" 
              // src={`https://pixabay.com/api/?key=17674069-699525c5d00029b95a0b08008&q=${answers.english}&image_type=photo`}
              width="100" 
              height="100" 
              alt=" " 
              onClick={this.answerCheck}
              value={answers.korean}
            /> 
          </div>
        )
      }));
      return answers;
    }
  }

  imageAnswer = () => {
    const answersArray =gameLengthening(this.props);
    if(answersArray[this.state.questionNumber].length > 3){
      return (
        answersArray[this.state.questionNumber][0].korean
      )
    } else {
      return (
        <div>
          <h3>Your score is: <span>{this.state.gameScore}</span></h3>
          <button onClick={replayGame} className="playAgainButton"><h3>Play Again?</h3></button>
        </div>
        )
    }
  }

  answerCheck = (event) => {
    event.preventDefault();
    const val = event.target.value;

    if(val === this.imageAnswer()){
      //Display correct div on correct
      this.setState({correctAnswer: true, incorrectAnswer: false});
      //Increase score on correct
      this.setState(({ gameScore }) => ({
        gameScore: gameScore + 10
      }));

      //Next question
      this.timer = setTimeout(() => this.nextQuestion(), 500);

    } else {
      //Display incorrect div on incorrect
      this.setState({incorrectAnswer: true, correctAnswer: false});

      //Remove heart 
      this.setState(({ livesAvailable }) => ({
        livesAvailable: livesAvailable - 1
      }));
      //Next question
      this.timer = setTimeout(() => this.nextQuestion(), 500);
    }
  }

  nextQuestion = () => {
    //Get the array
    const answersArray = gameLengthening(this.props);
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
      this.setState({incorrectAnswer: false, correctAnswer: false})
      this.imageMatchingBoxes();
      this.imageAnswer();
    }
  }

  finishGame = () => {
    //Exit the game and display score
    this.setState({showScore: true, exitGame: false, playing: false, incorrectAnswer: false, correctAnswer: false});
   
    //Send the score to redux
    this.props.dispatch(gameScore(this.state.gameScore));

    //Check the score
    this.timer = setTimeout(() => sendUpdateScore(this.props,this.state.gameScore), 500);
    
  }

  //exit the game before the end
  exitGameEarly = () => {
    this.finishGame();
  }


  render(){
    const correct = this.state.correctAnswer ? 'display' : 'display-none';
    const incorrect = this.state.incorrectAnswer ? 'display' : 'display-none';
    const showScore = this.state.showScore ? 'display' : 'display-none';
    const showExitGame = this.state.playing ? 'display' : 'display-none';

    return(

      <div className="mainGameContent" id="imageMatchingPlayingContent">
       
        <div className="gameTopContent">
        <h4 className={showExitGame}>Match the image with the Korean word</h4>
          <div>
            <p>Score: {this.state.gameScore}</p>
          </div>
          <div>
            <p>Questions: {this.state.questionNumber}/{gameLengthening(this.props).length -1}</p>
          </div>
          <div>
            <GameLives lives={this.state.livesAvailable}/>
          </div>
        </div>

        {this.state.playing ? this.imageMatchingBoxes() : null}
        

        <h3>{this.state.playing ? this.imageAnswer() : null}</h3>
        
        <div className={`correctTextDisplay ${correct}`}><h3>Correct Answer! </h3></div>
        <div className={`incorrectTextDisplay ${incorrect}`}><h3>Incorrect!</h3></div>

        <div className={showScore}>
          <h3>Your score is: <span>{this.state.gameScore}</span></h3>
        </div>

        <div className="gameBottomContent">
          <button className={`exitGameButton ${showExitGame}`} onClick={this.exitGameEarly}>
            <h3>Exit Game?</h3>
          </button>
        </div>

      </div>
      )
  }
}


ImageGame.propTypes = {
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
});

export default connect(mapStateToProps)(ImageGame);