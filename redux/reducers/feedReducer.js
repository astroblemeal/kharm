const initialState = {
  loading: false,
  feed: [],
};

export const feedReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FEED_LOADING": {
      return {
        ...state,
        loading: true,
      };
    }

    case "FEED_FETCHED": {
      action.payload.sort((a, b) => new Date(a.date_and_time) - new Date(b.date_and_time));

      return {
        ...state,
        loading: false,
        feed: action.payload,
      };
    }

    case "SESSION_CREATED": {
      let copyOfFeed = [...state.feed];
      copyOfFeed.push(action.payload);
      copyOfFeed.sort((a, b) => new Date(a.date_and_time) - new Date(b.date_and_time));

      return {
        ...state,
        loading: false,
        feed: copyOfFeed,
      };
    }

    case "SESSION_UPDATED": {
      let copyOfFeed = [...state.feed];
      copyOfFeed[copyOfFeed.findIndex((session) => session._id == action.payload._id)] =
        action.payload;

      return {
        ...state,
        loading: false,
        feed: copyOfFeed,
      };
    }

    case "SESSION_DELETED": {
      let copyOfFeed = [...state.feed];
      copyOfFeed.splice(
        copyOfFeed.findIndex((session) => session._id == action.payload),
        1,
      );

      return {
        ...state,
        loading: false,
        feed: copyOfFeed,
      };
    }

    default: {
      return state;
    }
  }
};
