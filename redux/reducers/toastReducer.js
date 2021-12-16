const initialState = {
  txt: "",
  type: "",
};

export const toastReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOAST": {
      return {
        txt: action.payload.txt,
        type: action.payload.type,
      };
    }

    default: {
      return state;
    }
  }
};
