import React from "react";

export const initialValue = {
  response: null,
  message: {
    json: null,
    menus: {},
    loading: true,
  },
};

const ResponseContext = React.createContext(initialValue);

export default ResponseContext;
