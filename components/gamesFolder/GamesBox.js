import React from 'react';
import 'style/Games.css';
import {Link} from "react-router-dom";
import GetURLParams from "components/general/GetURLParams";
import PropTypes from 'prop-types';

export default function GamesBox(props) {
    const level = props.level;
    return (
        <Link to={`/GamesRouter/${props.game.gameLink}?level=${GetURLParams(props.props)}`}>
            <div className={`eachGameBox levelsBorderLevel${level}`}>
                    <h3 className={`level${level}Text`}>
                        {props.game.gameName}
                    </h3>
                    <p className="gameDescription">
                    {props.game.gameDescription}
                </p>
            </div>
        </Link>
    )   
}

GamesBox.propTypes = {
    game: PropTypes.object.isRequired,
} 
  