import React from 'react';
import 'style/Games.css';
import { uuid } from 'uuidv4';
import axios from 'axios';
import { connect } from "react-redux";
import {vocabGroupsData} from 'assets/data/vocabGroupsData';
import Scoreboard from '../Scoreboard';
import ImageGame from './ImageGame';
import {gameData, gameState} from 'actions/action';
import PropTypes from 'prop-types';
import {shuffle, chunkArray} from '../gameFunctions';
import ImageGameLearning from './ImageGameLearning';
import {Helmet} from 'react-helmet';


class ImageGameView extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      gameName: 'Image Matching',
      gameStatus: null,
      vocabulary: [{}],
      units: '0',
      vocabGroups: [{}],
    }
  }

  //Start the game
  startGame = () => {
    // this.setState({gameStatus: "Learning"});
    this.props.dispatch(gameState("Learning"));
    this.props.dispatch(gameData(this.state.gameName));
  }

  //Store the selected unit/vocab group
  selectedUnit = (event) => {
    let val = event.target.value;
    this.setState({units: val, selectedOption: true});
  }

  //Load the database on start click
  loadGameContent = () => {
    const { level } = this.props;
    let units = this.state.units;

    const fd = new FormData();
    fd.append('level', level);
    fd.append('unit', units);
    const headers = {'Content-Type': 'application/application/json'}
    axios.post('https://kiipgrammar.com/backend/getVocabGameData.php', fd, headers
    ).then(res=>
      {
        if(res.data === "Error!") {
          console.log('error')
        } else {
          const vocabulary = shuffle(res.data);
          this.setState({vocabulary: vocabulary});
        }
      })
    .catch(error => {
      this.setState({ errorMessage: "Please choose a level."});
    });
  }

  //Load the vocab groups
  getOptionsData = () => {
    const vocabGroups = vocabGroupsData;
    let vocabGroupArray = [];
    for(let i = 0; i < vocabGroups.levels.length; i++){
      // eslint-disable-next-line eqeqeq 
      if(vocabGroups.levels[i].level == this.props.level){
        vocabGroupArray.push(vocabGroups.levels[i].vocab_group)
      }
    }

   const vocabGroupOptions = vocabGroupArray.map((vocabGroup, groupNumber) => {
     return(
      <option 
        className={`gameSelectOptions`}
        key={uuid()} name="selectedUnits" 
        value={groupNumber}
      >
        {vocabGroup}
      </option>
     )
   })

   return vocabGroupOptions;
  }

  gameSelect = () => {
    return (
      <div className="gameSelectSection">
        <h2>Match the Korean vocabulary to the correct image</h2>
        <form>
          <label htmlFor="selectedUnits">
            <h3>Choose Your Vocabulary Group: </h3>
            <br />
            <select 
            value={this.state.units} 
            onChange={this.selectedUnit}
            className="gameUnitSelect"
          >
              <option key={uuid} className="gameSelectOptions" name="selectedUnits" value="" disabled>Game Options</option>
              {this.getOptionsData()}
            </select>
          </label>
        </form>
        <button 
          type="button"
          onClick={() => {
            this.startGame();
            this.loadGameContent();
          }}
          className="startGameButton"
        >
          <h2>Start Learning</h2>
        </button>
      </div>
    )
  }

  render() {
    
    
    return(
      <div className="gameViewContainer">
        {/* Meta tags */}
        <Helmet>
          <title>Raw Korean - Image Matching Game</title>
          <meta name="description" content="Improve your Korean skills with a fun vocabulary game!" />
          <meta name="robots" content="index, follow" />
          {/* Twitter */}
          <meta name="twitter:card" value="Improve your Korean skills with a fun vocabulary game!"/>
          {/* Open Graph */}
          <meta property="og:title" content="Raw Korean - Image Matching Game" />
          <meta property="og:type" content="game" />
          <meta property="og:url" content="http://www.rawkorean.com/GamesRouter/ImageMatchingGameView?level=1" />
          <meta property="og:description" content="Improve your Korean skills with a fun vocabulary game!" /> 
        </Helmet>
        <div className="gameContainer">
          <header>
            <h1>Image Matching Game</h1>
          </header>
            {this.props.gameState === "Start" ? this.gameSelect() : null}
            {this.props.gameState === "Playing" ?  <ImageGame items={chunkArray(this.state.vocabulary, 4)}/> : null}
            {this.props.gameState === "Learning" ? <ImageGameLearning items={chunkArray(this.state.vocabulary, 4)}/>  : null}
        </div>
        <Scoreboard gameName={this.state.gameName} level={this.props.level}/>
      </div>

    )      
  }
}

ImageGameView.propTypes = {
  gameData: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  score: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired
  ]),
  userData: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired
  ]),
} 

const mapStateToProps = state => ({
  level: state.levels.level,
  score: state.updateGameScore.score,
  userData: state.login.userData,
  gameData: state.gameData.gameData,
  gameState: state.gameState.gameState
});

export default connect(mapStateToProps)(ImageGameView);
