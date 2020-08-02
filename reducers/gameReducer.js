let initialState = {
  gameData: '',
  score: '',
  gameState: 'Start',
  dragAnswer: null,
  gameAnswer: 0
};

//Draggable game answer choice
export function dragGame(state = initialState, action) {
  switch(action.type) {
    case "DRAG_ANSWER_CHOICE":
      return {
        ...state,
        dragAnswer: action.dragAnswer
      };

      default:
        return state;
  }
}


//Game: Playing/Learning/Start
export function gameState(state = initialState, action) {
  switch(action.type) {
    case "GAME_STATE":
      return {
        ...state,
        gameState: action.gameState
      };

      default:
        return state;
  }
}

//Game name
export function gameData(state = initialState, action) {
  switch (action.type) {

    case "GAME_DATA":
      return {
        ...state,
        gameData: action.gameData
      };

    default:
      return state;
  }
}

//User score 
export function updateGameScore(state = initialState, action) {
  switch (action.type) {

    case "GAME_SCORE":
      return {
        ...state,
        score: action.score
      };

    default:
      return state;
  }
}

//random number for answers
export function getRandomAnswer (state = initialState, action){
  switch(action.type) {
    case "GAME_ANSWER_NUMBER":
      return {
        ...state,
        gameAnswer: action.gameAnswer
      };

      default: 
        return state;
  }
}