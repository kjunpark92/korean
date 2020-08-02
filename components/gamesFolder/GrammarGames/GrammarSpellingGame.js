import React from 'react';
import 'style/Games.css';
import { connect } from "react-redux";
import  {gameScore, gameState}  from 'actions/action';
import PropTypes from 'prop-types';
import {GameLives, sendUpdateScore, incorrectAnswersDisplayTable} from '../gameFunctions';
import {Link} from 'react-router-dom';

class GrammarSpellingGame extends React.Component {
  constructor(props){
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      checkAnswer: false,
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
      showAnswer: false,
      showScore: false,
    }
  }

  componentWillUnmount(){
    this.props.dispatch(gameState("Start"));
  }

  
  //Korean word answer for correct
  koreanWordAnswer = () => {
    const answersArray = this.props.items;
    return (
      answersArray[this.state.questionNumber].grammar_point
    )
  }

  //English word answer
  englishWordAnswer = () => {
    const answersArray = this.props.items;
    return (
      answersArray[this.state.questionNumber].short_explanation
    )
  }

  //Spelling input form
  spellingGameContent = () => {
    const showCorrect = this.state.correctAnswer  ? 'correctGameAnswer' : 'incorrectGameAnswer';
    
    return(
        <form id="spellingKoreanForm" ref={(ref) => this.formRef = ref} onSubmit={this.enterKeyCheck}>
          <label htmlFor="koreanWord" id="koreanWordContainer">
            <h3>Korean</h3>
            <input 
              type="text" 
              name="koreanWord" 
              id="koreanWord" 
              className={`${showCorrect}`}
              onChange={this.spellingFormHandler}
              ref={this.inputRef}
            />
          </label>
        </form>
    )
  }

  //Handle the spelling input
  spellingFormHandler = () => {
    const val = this.inputRef.current.value;
    //If answer exceeds actual answer, display check answer
    if(val.length > this.koreanWordAnswer().length){
      this.setState({checkAnswer: true});
    }
    return val
  }

  //Check the answers
  checkAnswer = () => {
    const value = this.spellingFormHandler();
    if(this.state.paused) {
      return
    }

    if(value === this.koreanWordAnswer() && this.state.showAnswer === true){
      //Display answer/score feedback
      this.setState({correctAnswer: true, scoreIncrease: true});
      //Small score increase for cheating
      this.setState(({ gameScore }) => ({
        gameScore: gameScore + 5
      }));
    } else if(value === this.koreanWordAnswer()){
      //Display answer/score feedback
      this.setState({correctAnswer: true, scoreIncrease: true});
      //Increase score on correct
      this.setState(({ gameScore }) => ({
        gameScore: gameScore + 10
      }));
    } else {
      //Display answer/score feedback
      this.setState({incorrectAnswer: true, heartDecrease: true});
      //Remove heart 
      this.setState(({ livesAvailable }) => ({
        livesAvailable: livesAvailable - 1
      }));
      //Push the incorrect answers into an array 
      this.setState({ incorrectAnswerArray: [...this.state.incorrectAnswerArray, [this.englishWordAnswer(), this.koreanWordAnswer()]] });
    }

    // Next question
    this.timer = setTimeout(() => this.nextQuestion(), 1000);

  }

  //Check answer on enter key
  enterKeyCheck = (event) => {
    event.preventDefault();
    this.checkAnswer();
  }

  //Move to the next question
  nextQuestion = () => {
    //Reset the form
    this.formRef.reset();

    //Reset the states
    this.setState({incorrectAnswer: false, showAnswer: false, checkAnswer: false, 
      correctAnswer: false, scoreIncrease: false, heartDecrease: false
    });

    //Get the questions length
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

  //Show the answer
  revealAnswer = () => {
    this.setState({showAnswer: true, checkAnswer: false, heartDecrease: true,
      incorrectAnswerArray: [...this.state.incorrectAnswerArray, [this.englishWordAnswer(), this.koreanWordAnswer()]]
    });

    //Remove heart as penalty
    this.setState(({ livesAvailable }) => ({
      livesAvailable: livesAvailable - 1
    }));
  }

  //Finish the game and send the score
  finishGame = () => {
    //reset the next and gameOver states
    this.setState({ correctAnswer: false, exitGame: true, checkAnswer: false, showScore: true, playing: false});
    
    //Send the score to redux
    this.props.dispatch(gameScore(this.state.gameScore));

    //Check the score (if the user is logged in)
    if(this.props.userData !== ""  && this.state.gameScore > 0){
      //Update user score/rank
      this.timer = setTimeout(() => sendUpdateScore(this.props,this.state.gameScore), 500);
    }
  }

  //Exit the game early
  exitGameEarly = () => {
    this.finishGame()
  }

  //Pause the game 
  pauseGame = () => {
    this.setState({paused: !this.state.paused})
  }

  //Reset the game to replay
  replayGame = () => {
    this.props.dispatch(gameState("Start"));
  }


  render() {

    const showCheckAnswer = this.state.checkAnswer ? 'showAnswerButton' : 'display-none';
    const scoreIncrease = this.state.scoreIncrease ? 'scoreIncrease' : '';
    const pauseHide = this.state.paused ? 'pausedGame' : '';
    const pauseText = this.state.paused ? 'Continue Game?' : 'Pause Game?';

    return (
      <div className="mainGameContent" id="spellingContent">
        {this.props.gameState === "Playing" ? 
        
          <div className="mainGameContent" id="spellingContent">
            <div className="gameTopContent">
              <h4>Spell the Korean grammar correctly!</h4>
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

            {this.state.incorrectAnswer ? 
              <div className="incorrectTextDisplay">
                <h3>Incorrect!</h3>
                <p>The correct spelling was <span>{this.koreanWordAnswer()}</span>.</p>
              </div> 
              
              : null
            }

            {this.state.showAnswer ? 
              <p className={pauseHide} id="checkSpellingAnswer">
                {this.koreanWordAnswer()}
              </p>
              : null
            }
            {this.state.playing ? 
              <div className={pauseHide}>
                {this.spellingGameContent()}

                <h3 id="spellingEnglish">
                  English: {this.englishWordAnswer()}
                </h3>
              </div> 
              : null
            }

            {this.state.playing ?
              <button
              type="button"
              className={`nextGameButton`}
              onClick={this.checkAnswer}
              >
                <h4>Check Spelling</h4>
              </button>
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
                <button 
                  className={`${showCheckAnswer}`}
                  onClick={this.revealAnswer}
                >
                  <h3>Show Answer</h3>
                </button>
              </div>
            } 
          </div>
        
        : null}
      </div>
    )
  }
}

GrammarSpellingGame.propTypes = {
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

export default connect(mapStateToProps)(GrammarSpellingGame);