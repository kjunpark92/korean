import React from 'react';
import 'style/Games.css';
import { uuid } from 'uuidv4';
import axios from 'axios';
import { connect } from "react-redux";
import Scoreboard from '../Scoreboard';
import {gameState} from 'actions/action';
import {shuffle, chunkArray, gameLengthening} from '../gameFunctions';
import GrammarSpellingGame from './GrammarSpellingGame';
import GrammarLearning from './GrammarLearning';
import {Helmet} from 'react-helmet';
import GetURLParams from "components/general/GetURLParams";


class GrammarSpellingGameView extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      gameName: 'Grammar Spelling',
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
    const level = GetURLParams(this.props.routerHistory);
    let units = this.state.units;

    const fd = new FormData();
    fd.append('level', level);
    fd.append('unit', units);

    const headers = {'Content-Type': 'application/application/json'}
    axios.post('https://kiipgrammar.com/backend/getGrammarGameData.php', fd, headers
    ).then(res=>
      {
        const grammar = shuffle(gameLengthening(res.data));
        const learnedGrammar = shuffle(res.data);
        this.setState({grammar: grammar, learningGrammar:learnedGrammar});
      })
    .catch(error => {
      this.setState({ errorMessage: "Please refresh the page."});
    });
  }

  gameSelect = () => {
    return (
      <div className="gameSelectSection">
        <h2>Test your grammar knowledge with a spelling game!</h2>
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
          <title>Raw Korean - Grammar Spelling Game</title>
          <meta name="description" content="Improve your Korean grammar skills with a fun grammar spelling game!" />
          <meta name="robots" content="index, follow" />
          {/* Twitter */}
          <meta name="twitter:card" value="Improve your Korean grammar skills with a fun grammar spelling game!"/>
          {/* Open Graph */}
          <meta property="og:title" content="Raw Korean - Grammar Spelling Game" />
          <meta property="og:type" content="game" />
          <meta property="og:url" content="http://www.rawkorean.com/GamesRouter/GrammarSpellingGameView?level=1" />
          <meta property="og:description" content="Improve your Korean grammar skills with a fun grammar spelling game!" /> 
        </Helmet>

        <div className="gameContainer">
          <header>
            <h1>Grammar Spelling Game</h1>
          </header>
            {this.props.gameState === "Start" ? this.gameSelect() : null}
            {this.props.gameState === "Playing" ?  <GrammarSpellingGame gameName={this.state.gameName} level={level} items={this.state.grammar}/> : null}
            {this.props.gameState === "Learning" ? <GrammarLearning items={chunkArray(this.state.learningGrammar, 4)}/>  : null}
        </div>
        <Scoreboard gameName={this.state.gameName} level={level}/>
      </div>

    )      
  }
}

const mapStateToProps = state => ({
  gameState: state.gameState.gameState
});

export default connect(mapStateToProps)(GrammarSpellingGameView);
