const initialState = {
  loading: false,
  error: false,
  account: null,
  token: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_REQUEST": {
      return {
        ...state,
        loading: true,
        error: false,
      };
    }

    case "AUTH_ERROR": {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }

    case "AUTH_SUCCESS": {
      if (action.payload.token) localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        loading: false,
        error: false,
        account: action.payload.account,
        token: action.payload.token,
      };
    }

    case "ACCOUNT_UPDATED": {
      return {
        ...state,
        loading: false,
        error: false,
        account: action.payload,
      };
    }

    case "SET_TOKEN": {
      localStorage.setItem("token", action.payload);
      return {
        ...state,
        token: action.payload,
      };
    }

    case "LOGOUT": {
      localStorage.removeItem("token");
      return {
        loading: false,
        error: false,
        token: null,
        account: null,
      };
    }

    default: {
      return state;
    }
  }
};
