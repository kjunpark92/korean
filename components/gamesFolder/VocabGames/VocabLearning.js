import React from 'react';
import {shuffle} from '../gameFunctions';
import { uuid } from 'uuidv4';
import { connect } from "react-redux";
import { gameState } from 'actions/action';
import 'style/Games.css';

class VocabLearning extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      questionNumber: 0,
    }
  }

  // componentWillUnmount(){
  //   this.props.dispatch(gameState("Start"));
  // }
  
  gameMatchingBoxes = () => {

    const answersArray = this.props.items;
    // //If the final array is less than 4, pop it from the game.
    if(answersArray[this.state.questionNumber].length < 3){
      
      answersArray[this.state.questionNumber].pop();
    } else {
      const answers = shuffle(answersArray[this.state.questionNumber].map((answers) => {

        return(
          <div className="wordMatchingLearnBox" key={uuid()}>
            <h2>{answers.korean}</h2>
            <h3>{answers.english}</h3>
          </div>
        )
      }));
      return answers;
    }
  }

  //Show next set of words onClick next
  nextHandler = () => {

    const learningLength = this.props.items.length-1;
    if(this.state.questionNumber === learningLength){
      //dispatch learning/playing to redux
      this.props.dispatch(gameState("Playing"));
    } else {
      //Continue learning all the words 
      this.setState(({ questionNumber }) => ({
        questionNumber: questionNumber + 1
      }));
    }
  }

  //Skip to begin playing the game
  beginPlaying = () => {
    this.props.dispatch(gameState("Playing"));
  }

  render(){
    const answersArray = this.props.items;
    const gameLength = (answersArray.length -1) * 4 ;


    return (
      <div className="mainGameContent">
        <div className="gameTopContent">
          <h3>Learn the Vocabulary!</h3>
          <div>
            <p>Words Learned: {(this.state.questionNumber) * 4}/{gameLength}</p>
          </div>
        </div>
        <div id="wordMatchingLearnContainer">
          {this.gameMatchingBoxes()}
        </div>
       
        <button type="button" className="startGameButton" onClick={this.nextHandler}><h3>Next</h3></button>
        <button type="button" className="startGameButton" onClick={this.beginPlaying}><h3>Skip Learning</h3></button>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  gameState: state.gameState.gameState
});

export default connect(mapStateToProps)(VocabLearning);