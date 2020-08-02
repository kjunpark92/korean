import React from 'react';
import 'style/Games.css';
import axios from 'axios';
import { connect } from "react-redux";
import Scoreboard from '../Scoreboard';
import {gameState} from 'actions/action';
import {shuffle, chunkArray} from '../gameFunctions';
import SpeedVocabGame from './SpeedVocabGame';
import {Helmet} from 'react-helmet';
import GetURLParams from "components/general/GetURLParams";

class SpeedVocabGameView extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      gameName: 'Speed Vocab',
      vocabulary: [{}],
    }
  }

  componentDidMount() {
    this.loadGameContent();
  }

  componentWillUnmount(){
    this.props.dispatch(gameState("Start"));
  }

  //Start the game
  startGame = () => {
    this.props.dispatch(gameState("Playing"));
  }


  //Load the database on start click
  loadGameContent = () => {
    const level  = GetURLParams(this.props.routerHistory);

    const fd = new FormData();
    fd.append('level', level);
    const headers = {'Content-Type': 'application/application/json'}
    axios.post('https://kiipgrammar.com/backend/getVocabInformation.php', fd, headers
    ).then(res=>
      {
        const vocabulary = chunkArray(shuffle(res.data), 4);
        this.setState({vocabulary: vocabulary});
      })
    .catch(error => {
      this.setState({ errorMessage: "Please refresh the page."});
    });
  }

  gameSelect = () => {
    const level = GetURLParams(this.props.routerHistory);
    return (
      <div className="gameSelectSection">
        <h2>How many words can you choose correctly?</h2>
        <h3>Uses all the vocabulary from <span className={`level${level}Text`}>Level {level}</span></h3>
        <button 
          type="button"
          onClick={() => {
            this.startGame();
          }}
          className="startGameButton"
        >
          <h2>Start Playing</h2>
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
          <title>Raw Korean - Speed Vocab Game</title>
          <meta name="description" content="Improve your Korean skills with a fun vocabulary game!" />
          <meta name="robots" content="index, follow" />
          {/* Twitter */}
          <meta name="twitter:card" value="Improve your Korean skills with a fun vocabulary game!"/>
          {/* Open Graph */}
          <meta property="og:title" content="Raw Korean - Speed Vocab Game" />
          <meta property="og:type" content="game" />
          <meta property="og:url" content="http://www.rawkorean.com/GamesRouter/SpeedVocabGameView?level=1" />
          <meta property="og:description" content="Improve your Korean skills with a fun vocabulary game!" /> 
        </Helmet>

        <div className="gameContainer">
          <header>
            <h1>Speed Vocab Game</h1>
          </header>
            {this.props.gameState === "Start" ? this.gameSelect() : null}
            {this.props.gameState === "Playing" ?  <SpeedVocabGame gameName={this.state.gameName} level={level} items={this.state.vocabulary}/> : null}
        </div>
        <Scoreboard gameName={this.state.gameName} level={level}/>
      </div>

    )      
  }
}

const mapStateToProps = state => ({
  gameState: state.gameState.gameState
});

export default connect(mapStateToProps)(SpeedVocabGameView);
