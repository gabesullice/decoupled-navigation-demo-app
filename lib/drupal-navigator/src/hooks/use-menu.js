import { useContext } from "react";

import ResponseContext from "../contexts/response-context";

export default function useMenu(id) {
  const {
    message: { loading, menus },
  } = useContext(ResponseContext);

  return { tree: menus[id] || null, loading };
}
