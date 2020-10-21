import React, { useContext } from "react";

import ResponseContext from "../contexts/response-context";

export default function useJSON() {
  const {
    message: { json },
  } = useContext(ResponseContext);
  return json;
}
