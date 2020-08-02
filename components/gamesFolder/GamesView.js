import React from 'react';
import 'style/Games.css';
import { uuid } from 'uuidv4';
import { connect } from "react-redux";
import GamesBox from './GamesBox';
import GetURLParams from "components/general/GetURLParams";
import {selectLevel, gameState} from "actions/action";
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet';


class GamesView extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            games: [
                {
                    id: uuid(),
                    gameName: 'Speed Vocab Game',
                    gameDescription: 'Test your Korean quickly!',
                    gameLink: 'SpeedVocabGameView',
                },  
                {
                    id: uuid(),
                    gameName: 'Vocab Spelling Game',
                    gameDescription: 'Practice your Korean spelling skills!',
                    gameLink: 'SpellingGameView',
                },
                {
                    id: uuid(),
                    gameName: 'Vocab Matching Game',
                    gameDescription: 'Learn by matching the words!',
                    gameLink: 'WordGameView',
                },
                {
                    id: uuid(),
                    gameName: 'Drag and Drop Game',
                    gameDescription: 'Try to put the words together!',
                    gameLink: 'DragDropGameView',
                },
                {
                  id: uuid(),
                  gameName: 'Grammar Matching Game',
                  gameDescription: 'Match the Korean grammar to the English meaning',
                  gameLink: 'GrammarMatchingGameView',
                },
                {
                  id: uuid(),
                  gameName: 'Grammar Spelling Game',
                  gameDescription: 'Check your grammar knowledge with a spelling game!',
                  gameLink: 'GrammarSpellingGameView',
                },  

                // {
                //     id: uuid(),
                //     gameName: 'Image Matching Game',
                //     gameDescription: 'Try to put the words together!',
                //     gameLink: 'ImageGameView',
                // }
            ]
        }
    }

    componentDidMount() {
        this.props.dispatch(selectLevel(GetURLParams(this.props.routerHistory)));
        this.props.dispatch(gameState("Start"));
    }

    render() {
        const level = GetURLParams(this.props.routerHistory);
        return (
            <div id="gamesView">

                <Helmet>
                    <title>Raw Korean - Games</title>
                    <meta name="description" content="Improve your Korean skills quickly with fun vocabulary and grammar games!" />
                    <meta name="robots" content="index, follow" />
                    {/* Twitter */}
                    <meta name="twitter:card" value="Improve your Korean skills quickly with fun vocabulary and grammar games!"/>
                    {/* Open Graph */}
                    <meta property="og:title" content="Raw Korean - Games" />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content="http://www.rawkorean.com/LevelsRouter/GamesView?level=1" />
                    <meta property="og:description" content="Improve your Korean skills quickly with fun vocabulary and grammar games!" /> 
                </Helmet>

                <header>
                    <h1><span className={`level${level}Text`}>LEVEL {level}</span> Games</h1>
                </header>
                <div id="gamesList">
                    {this.state.games.map(game => (
                        <GamesBox 
                            key={game.id} 
                            game={game}
                            props={this.props.routerHistory}
                            level={level}
                        />
                    ))}
                </div>
            </div>
        )
    }
}

GamesView.propTypes = {
    level: PropTypes.number.isRequired,
} 

const mapStateToProps = state => ({
    level: state.levels.level, //load the level data
    gameState: state.gameState.gameState
});
  
export default connect(mapStateToProps)(GamesView);