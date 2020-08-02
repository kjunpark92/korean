import { combineReducers } from "redux";
// import users from "./reducers";
import {levels, selectKIIPLevel } from "./levelsReducer";
import login  from "./loginReducer";
import grammarPart from "./grammarPartReducer";
import {gameData, updateGameScore, gameState, dragGame, getRandomAnswer} from './gameReducer';


export default combineReducers({
  // users, 
  levels, login, grammarPart, selectKIIPLevel, updateGameScore, gameData, gameState, dragGame,
  getRandomAnswer
});

