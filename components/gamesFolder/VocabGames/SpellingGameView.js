import React from 'react';
import 'style/Games.css';
import { uuid } from 'uuidv4';
import axios from 'axios';
import { connect } from "react-redux";
import Scoreboard from '../Scoreboard';
import SpellingGame from './SpellingGame';
import {gameState} from 'actions/action';
import {shuffle, gameLengthening, getOptionsData, chunkArray} from '../gameFunctions';
import {Helmet} from 'react-helmet';
import VocabLearning from './VocabLearning';
import GetURLParams from "components/general/GetURLParams";

class SpellingGameView extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      gameName: 'Vocab Spelling',
      vocabulary: [{}],
      units: '0',
      learningVocab: [{}],
    }
  }

  componentWillUnmount(){
    this.props.dispatch(gameState("Start"));
  }

  //Start the game
  startGame = () => {
    this.props.dispatch(gameState("Learning"));
  }

  //Store the selected unit/vocab group
  selectedUnit = (event) => {
    let val = event.target.value;
    this.setState({units: val, selectedOption: true});
  }

  //Load the database on start click
  loadGameContent = () => {
    const level  = GetURLParams(this.props.routerHistory);
    let units = this.state.units;

    const fd = new FormData();
    fd.append('level', level);
    fd.append('unit', units);

    const headers = {'Content-Type': 'application/application/json'}
    axios.post('https://kiipgrammar.com/backend/getVocabGameData.php', fd, headers
    ).then(res=>
      {
        const vocabulary = shuffle(gameLengthening(res.data));
        this.setState({vocabulary: vocabulary, learningVocab: shuffle(res.data)});
      })
    .catch(error => {
      this.setState({ errorMessage: "Please choose a level."});
    });
  }

  gameSelect = () => {
    const level  = GetURLParams(this.props.routerHistory);

    return(
      <div className="gameSelectSection">
        <h2>Spell the Korean word correctly</h2>
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
              {getOptionsData(level)}
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
    const level  = GetURLParams(this.props.routerHistory);
    
    return(
      <div className="gameViewContainer">
        {/* Meta tags */}
        <Helmet>
          <title>Raw Korean - Vocab Spelling Game</title>
          <meta name="description" content="Improve your Korean skills with a fun vocabulary game!" />
          <meta name="robots" content="index, follow" />
          {/* Twitter */}
          <meta name="twitter:card" value="Improve your Korean skills with a fun vocabulary game!"/>
          {/* Open Graph */}
          <meta property="og:title" content="Raw Korean - Vocab Spelling Game" />
          <meta property="og:type" content="game" />
          <meta property="og:url" content="http://www.rawkorean.com/GamesRouter/SpellingGameView?level=1" />
          <meta property="og:description" content="Improve your Korean skills with a fun vocabulary game!" /> 
        </Helmet>

        <div className="gameContainer">
          <header>
            <h2>Vocab Spelling Game</h2>
          </header>
          {this.props.gameState === "Start" ? this.gameSelect() : null}
          {this.props.gameState === "Playing" ?   <SpellingGame gameName={this.state.gameName} level={level} items={this.state.vocabulary}/> : null}
          {this.props.gameState === "Learning" ? <VocabLearning items={chunkArray(this.state.learningVocab, 8)}/>  : null}
        </div>
        <Scoreboard gameName={this.state.gameName} level={level}/>
      </div>

    )      
  }
}

const mapStateToProps = state => ({
  gameState: state.gameState.gameState
});

export default connect(mapStateToProps)(SpellingGameView);