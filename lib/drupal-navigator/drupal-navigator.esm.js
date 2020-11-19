import React, { useReducer, useEffect, useContext } from 'react';

const initialValue = {
  response: null,
  message: {
    json: null,
    menus: {},
    loading: true
  }
};
const ResponseContext = /*#__PURE__*/React.createContext(initialValue);

const relMenuItem = "drupal.org/rel/menu-item";

/**
 * Turns a links object into an array of links with a `rel` member.
 */

function normalizeLinks(linksObject) {
  return Object.entries(linksObject).map(([key, {
    href,
    rel,
    meta
  }]) => {
    return {
      href: href.length ? new URL(href) : null,
      rel: rel || key.split("--")[0],
      meta: {
        type: "application/vnd.api+json",
        ...meta
      }
    };
  });
}

function parseMenu(menu, doc) {
  const menuLinks = normalizeLinks(doc.links || {}).filter(link => {
    return link.rel === relMenuItem && link.meta.menu === menu;
  }).map(link => {
    const {
      href,
      meta
    } = link;
    return {
      href,
      title: meta.title,
      description: meta.description,
      hierarchy: meta.hierarchy,
      type: meta.type || "application/vnd.api+json"
    };
  });

  if (!menuLinks.length) {
    return null;
  }

  menuLinks.sort((a, b) => a.hierarchy < b.hierarchy);

  const lastLength = level => level[level.length - 1].hierarchy.length;

  const stack = [];
  let level = [];

  do {
    if (!level.length) {
      level.push(menuLinks.shift());
    } else {
      const currLength = menuLinks[0].hierarchy.length;

      if (lastLength(level) === currLength) {
        level.push(menuLinks.shift());
      } else if (lastLength(level) < currLength) {
        stack.push([...level]);
        level = [];
      } else {
        do {
          const children = [...level];
          level = stack.pop();
          const parent = level[level.length - 1];
          children.forEach(child => {
            if (child.hierarchy.startsWith(parent.hierarchy)) {
              parent.children ? parent.children.push(child) : parent.children = [child];
            }
          });
        } while (lastLength(level) > currLength);

        level.push(menuLinks.shift());
      }
    }
  } while (menuLinks.length);

  if (stack.length) {
    do {
      const children = [...level];
      level = stack.pop();
      level[level.length - 1].children = children;
    } while (stack.length);
  } // Removes the `hierarchy` key and `description` if it's undefined.


  const clean = (links, link) => {
    delete link.hierarchy;

    if (link.description === undefined) {
      delete link.description;
    }

    if (link.children) {
      link.children = link.children.reduce(clean, []);
    }

    return [...links, link];
  };

  return level.reduce(clean, []);
} // @todo: refactor this so that it's not repeatedly parsing the same menus.


function parseMenus(doc) {
  const menuIDs = normalizeLinks(doc.links || {}).filter(link => link.rel === relMenuItem).reduce((ids, link) => ids.add(link.meta.menu), new Set());
  return [...menuIDs].reduce((menus, id) => {
    return { ...menus,
      [id]: parseMenu(id, doc)
    };
  }, {});
}

const FetchStarted = () => {
  return {
    type: "fetch-started"
  };
};

const FetchCompleted = (response, json = null) => {
  return {
    type: "fetch-completed",
    value: {
      response,
      json
    }
  };
};

function reducer(state, {
  type,
  value
}) {
  switch (type) {
    case "fetch-started":
      return {
        response: state.response,
        message: { ...state.message,
          loading: true
        }
      };

    case "fetch-completed":
      const menus = value.json && value.response.ok ? parseMenus(value.json) : state.menus;
      return {
        response: value.response,
        message: {
          menus,
          json: value.json,
          loading: false
        }
      };
  }
}

function ResponseProvider({
  url,
  children
}) {
  const [state, dispatch] = useReducer(reducer, initialValue);
  useEffect(() => {
    const fetchOptions = {
      redirect: "manual",
      headers: {
        accept: "application/vnd.api+json"
      }
    };
    dispatch(FetchStarted());
    fetch(url, fetchOptions).then(async response => {
      const {
        status,
        statusText
      } = response;
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
        json = await response.text().then(text => {
          return text.length ? JSON.parse(text) : null;
        });
      }

      switch (status) {
        case 200:
          dispatch(FetchCompleted(response, json));
          break;

        case response.ok:
          dispatch(FetchCompleted(response, json));
          throw new Error(`Unrecognized response type: ${status} ${statusText}`);

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
          throw new Error(`Unrecognized response type: ${status} ${statusText}`);
      }
    });
  }, [url]);
  return /*#__PURE__*/React.createElement(ResponseContext.Provider, {
    value: state
  }, children);
}

function useMenu(id) {
  const {
    message: {
      loading,
      menus
    }
  } = useContext(ResponseContext);
  return {
    tree: menus[id] || null,
    loading
  };
}

function useResponse() {
  return useContext(ResponseContext);
}

function useJSON() {
  const {
    message: {
      json
    }
  } = useContext(ResponseContext);
  return json;
}

export { ResponseProvider, useJSON, useMenu, useResponse };
