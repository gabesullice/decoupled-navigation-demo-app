import { useContext } from "react";

import ResponseContext from "../contexts/response-context";

export default function useResponse() {
  return useContext(ResponseContext);
}
