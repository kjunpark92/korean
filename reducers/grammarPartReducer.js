let initialState = {
  part: 1,
};

function grammarPart(state = initialState, action) {
switch (action.type) {

  case "GRAMMAR_UNITS":
    return {
      ...state,
      part: action.part
    };

  default:
    return state;
  }
}

export default grammarPart;
