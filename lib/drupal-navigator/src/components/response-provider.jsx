import React, { useEffect, useReducer } from "react";

import ResponseContext, { initialValue } from "../contexts/response-context";
import { parseMenus } from "../menu-utils";

const FetchStarted = () => {
  return { type: "fetch-started" };
};

const FetchCompleted = (response, json = null) => {
  return { type: "fetch-completed", value: { response, json } };
};

function reducer(state, { type, value }) {
  switch (type) {
    case "fetch-started":
      return {
        response: state.response,
        message: { ...state.message, loading: true },
      };

    case "fetch-completed":
      const menus =
        value.json && value.response.ok ? parseMenus(value.json) : state.menus;
      return {
        response: value.response,
        message: {
          menus,
          json: value.json,
          loading: false,
        },
      };
  }
}

export default function ResponseProvider({ url, children }) {
  const [state, dispatch] = useReducer(reducer, initialValue);

  useEffect(() => {
    const fetchOptions = {
      redirect: "manual",
      headers: {
        accept: "application/vnd.api+json",
      },
    };

    dispatch(FetchStarted());

    fetch(url, fetchOptions).then(async (response) => {
      const { status, statusText } = response;
      const contentType = response.headers.get("content-type") || "unknown";

      if (contentType.startsWith("text/html")) {
        window.location.href = response.url;
      } else if (!contentType.startsWith("application/vnd.api+json")) {
        dispatch(FetchCompleted(response));
        throw new Error(`Unacceptable content type: ${contentType}`);
      }

      let json = null;
      if (response.headers.has("content-length")) {
        if (response.headers.get("content-length")) {
          json = await response.json();
        }
      } else {
        json = await response.text().then((text) => {
          return text.length ? JSON.parse(text) : null;
        });
      }

      switch (status) {
        case 200:
          dispatch(FetchCompleted(response, json));
          break;

        case response.ok:
          dispatch(FetchCompleted(response, json));
          throw new Error(
            `Unrecognized response type: ${status} ${statusText}`
          );

        case 301:
        case 302:
        case 307:
          window.location.href = response.headers.get("location");
          break;

        case status >= 300 && status < 400:
          dispatch(FetchCompleted(response, json));
          throw new Error("Unable to handle redirect.");

        default:
          dispatch(FetchCompleted(response, json));
          throw new Error(
            `Unrecognized response type: ${status} ${statusText}`
          );
      }
    });
  }, [url]);

  return (
    <ResponseContext.Provider value={state}>
      {children}
    </ResponseContext.Provider>
  );
}
