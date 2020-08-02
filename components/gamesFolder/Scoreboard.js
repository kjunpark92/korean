import React from 'react';
import 'style/Games.css';
import axios from 'axios';
import {uuid} from 'uuidv4';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { connect } from "react-redux";

class Scoreboard extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      scoreboard: [{}],
    }
  }

  componentDidMount() {
    const level = this.props.level;
    let gameName = this.props.gameName;

    const fd = new FormData();
    fd.append('level', level);
    fd.append('gameName', gameName);

    const headers = {'Content-Type': 'application/application/json'}
    axios.post('https://kiipgrammar.com/backend/getScoreboard.php', fd, headers
    ).then(res=>
      {
        if(res.data === "Error!") {
          console.log('error')
        } else {
          const scoreboard = res.data;
          this.setState({scoreboard});
        }
      })
    .catch(error => {
      console.log('Scoreboard unable to load. Please refresh the page.');
    });
  }

  render() {
    const username = this.props.userData.username;
    return (
      <div className="scoreboardContainer">
          <h2>Scoreboard</h2>
          <div className="scoreboardTable">
            <div className="scoreboardHeading">
                <h3>Username</h3>
                <h3>Score</h3>
            </div>
              {this.state.scoreboard.length >= 1 ? 
              
                this.state.scoreboard.map(score => (
                  <Link to={`/UserProfilePage?username=${score.username}`} key={uuid()}>
                    <div
                      className={score.username === username ? 'scoreboardIndividual thisUser' : 'scoreboardIndividual'} 
                    >
                      <p>{score.username}</p>
                      <p>{score.score}</p>
                    </div>

                  </Link>
                )) 
              
              : null

              }
          </div>
      </div>
    )
  }
}

Scoreboard.propTypes = {
  gameName: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  score: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired
  ]),
} 

const mapStateToProps = state => ({
  userData: state.login.userData,
});

export default connect(mapStateToProps)(Scoreboard);