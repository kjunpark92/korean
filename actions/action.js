import {
    // FETCH_DATA_REQUEST,
    // FETCH_DATA_SUCCESS,
    // FETCH_DATA_ERROR,
    SELECT_LEVEL,
    SELECT_KIIP_LEVEL,
    LOGIN_DATA,
    GRAMMAR_UNITS,
    GAME_SCORE,
    GAME_DATA,
    GAME_STATE,
    DRAG_ANSWER_CHOICE,
    GAME_ANSWER_NUMBER 
  } from "./actionType";

  
export const selectLevel = level => ({
  type: SELECT_LEVEL,
  level
});

export const selectKIIPLevel = KIIPLevel => ({
  type: SELECT_KIIP_LEVEL,
  KIIPLevel
});

export const loginData = userData => ({
  type: LOGIN_DATA,
  userData
});

export const grammarUnits = part => ({
  type: GRAMMAR_UNITS,
  part
});

export const gameScore = score => ({
  type: GAME_SCORE,
  score
});

export const gameData = gameData => ({
  type: GAME_DATA,
  gameData
});

export const gameState = gameState => ({
  type: GAME_STATE,
  gameState
});

export const dragGame = dragAnswer => ({
  type: DRAG_ANSWER_CHOICE,
  dragAnswer
})

export const getRandomAnswer = gameAnswer => ({
  type: GAME_ANSWER_NUMBER,
  gameAnswer
})


//API REQUEST CURRENTLY UNUSED
// export function fetchDataRequest() {
//   return {
//     type: FETCH_DATA_REQUEST
//   };
// }

// export function fetchDataSuccess(user) {
//   return {
//     type: FETCH_DATA_SUCCESS,
//     user
//   };
// }

// export function fetchDataError(error) {
//   return {
//     type: FETCH_DATA_ERROR,
//     payload: { error }
//   };
// }