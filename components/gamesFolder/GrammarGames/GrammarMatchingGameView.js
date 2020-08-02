import React from 'react';
import 'style/Games.css';
import { uuid } from 'uuidv4';
import axios from 'axios';
import { connect } from "react-redux";
import Scoreboard from '../Scoreboard';
import { gameState} from 'actions/action';
import PropTypes from 'prop-types';
import {shuffle, chunkArray, gameLengthening} from '../gameFunctions';
import GrammarMatchingGame from './GrammarMatchingGame';
import GrammarMatchingLearning from './GrammarLearning';
import {Helmet} from 'react-helmet';
import GetURLParams from "components/general/GetURLParams";

class GrammarMatchingGameView extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      gameName: 'Grammar Matching',
      grammar: [{}],
      learningGrammar: [{}],
      units: '1',
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
    axios.post('https://kiipgrammar.com/backend/getGrammarGameData.php', fd, headers
    ).then(res=>
      {
        const grammar = gameLengthening(chunkArray(shuffle(res.data), 4));
        this.setState({grammar: grammar, learningGrammar: shuffle(res.data)});
      })
    .catch(error => {
      this.setState({ errorMessage: "Please refresh the page."});
    });
  }

  gameSelect = () => {
    return (
      <div className="gameSelectSection">
        <h2>Match the Korean Grammar to the English meaning</h2>
        <form>
          <label htmlFor="selectedUnits">
            <h3>Choose Your Units: </h3>
            <br />
            <select 
            value={this.state.units} 
            onChange={this.selectedUnit}
            className="gameUnitSelect"
          >
              <option key={uuid()} className="gameSelectOptions" name="selectedUnits" value="" disabled>Game Options</option>
              <option key={uuid()} className="gameSelectOptions" name="selectedUnits" value="1">Units 1-12</option>
              <option key={uuid()} className="gameSelectOptions" name="selectedUnits" value="13">Units 13-25</option>
              <option key={uuid()} className="gameSelectOptions" name="selectedUnits" value="26">Units 26-38</option>
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
    const level = GetURLParams(this.props.routerHistory);

    return(
      <div className="gameViewContainer">
        {/* Meta tags */}
        <Helmet>
          <title>Raw Korean - Grammar Matching Game</title>
          <meta name="description" content="Improve your Korean grammar skills with a fun grammar matching game!" />
          <meta name="robots" content="index, follow" />
          {/* Twitter */}
          <meta name="twitter:card" value="Improve your Korean grammar skills with a fun grammar matching game!"/>
          {/* Open Graph */}
          <meta property="og:title" content="Raw Korean - Grammar Matching Game" />
          <meta property="og:type" content="game" />
          <meta property="og:url" content="http://www.rawkorean.com/GamesRouter/GrammarMatchingGameView?level=1" />
          <meta property="og:description" content="Improve your Korean grammar skills with a fun grammar matching game!" /> 
        </Helmet>
        <div className="gameContainer">
          <header>
            <h1>Grammar Matching Game</h1>
          </header>
            {this.props.gameState === "Start" ? this.gameSelect() : null}
            {this.props.gameState === "Playing" ?  <GrammarMatchingGame gameName={this.state.gameName} level={level} items={this.state.grammar}/> : null}
            {this.props.gameState === "Learning" ? <GrammarMatchingLearning items={chunkArray(this.state.learningGrammar, 4)}/>  : null}
        </div>
        <Scoreboard gameName={this.state.gameName} level={level}/>
      </div>

    )      
  }
}

GrammarMatchingGameView.propTypes = {
  userData: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired
  ]),
} 

const mapStateToProps = state => ({
  gameState: state.gameState.gameState
});

export default connect(mapStateToProps)(GrammarMatchingGameView);
