let initialState = {
    level: 1,
    KIIPLevel: "",
  };
  
export function levels(state = initialState, action) {
  switch (action.type) {

    case "SELECT_LEVEL":
      return {
        ...state,
        level: action.level
      };

    default:
      return state;
  }
}

export function selectKIIPLevel(state = initialState, action) {
  switch (action.type) {

    case "SELECT_KIIP_LEVEL":
      return {
        ...state,
        KIIPLevel: action.KIIPLevel
      };

    default:
      return state;
  }
}