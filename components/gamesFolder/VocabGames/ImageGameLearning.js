import React from 'react';
import {shuffle} from '../gameFunctions';
import { uuid } from 'uuidv4';
import { connect } from "react-redux";
import { gameState } from 'actions/action';
import 'style/Games.css';
import axios from 'axios';

class ImageGameLearning extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      questionNumber: 0,
      photoData: []
    }
  }


  componentDidUpdate(prevProps){
    if(prevProps.items !== this.props.items){

      const photo1 = axios.get(`https://pixabay.com/api/?key=17674069-699525c5d00029b95a0b08008&q=${this.props.items[0][0].english}&safesearch=true&per_page=3`);
      const photo2 = axios.get(`https://pixabay.com/api/?key=17674069-699525c5d00029b95a0b08008&q=${this.props.items[0][1].english}&safesearch=true&per_page=3`);

      axios.all([photo1, photo2])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const photoArray = [responseOne.data, responseTwo.data];

          this.setState({photoData: photoArray});
        })
      )
    }
  }
  
  componentWillUnmount(){
    this.props.dispatch(gameState("Start"));
  }
  
  imageMatchingBoxes = () => {
    const answersArray = this.props.items;

    //If the final array is less than 4, pop it from the game.
    if(answersArray[this.state.questionNumber].length < 3){
      
      answersArray[this.state.questionNumber].pop();
    } else {
      const answers = shuffle(answersArray[this.state.questionNumber].map((answers) => {
        
        return(
          <div className="imageMatchingLearnBox" key={uuid()}>
            <h3>{answers.korean}</h3>
            <h4>{answers.english}</h4>
            <img 
              // src={`https://pixabay.com/api/?key=17674069-699525c5d00029b95a0b08008&q=${answers.english}&image_type=photo`} 
              alt=" "
            />
          </div>
        )
      }));
      return answers;
    }
  }

  //Show next set of images onClick next
  nextHandler = () => {

    const learningLength = this.props.items.length-1;
    if(this.state.questionNumber === learningLength){
      //dispatch learning/playing to redux
      this.props.dispatch(gameState("Playing"));
    }  else {
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
        <h3>Learn the Vocabulary!</h3>
        <div className="gameTopContent">
          <div>
            <p>Words Learned: {this.state.questionNumber * 4}/{gameLength}</p>
          </div>
        </div>
        <div id="imageMatchingLearnContainer">
          {this.imageMatchingBoxes()}
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

export default connect(mapStateToProps)(ImageGameLearning);