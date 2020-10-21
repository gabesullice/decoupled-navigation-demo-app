import React, { useContext, useState } from "react";

const HistoryContext = React.createContext(null);

export function withURL(Wrapped) {
  return (props) => (
    <HistoryContext.Consumer>
      {({ url }) => <Wrapped {...{ url, ...props }} />}
    </HistoryContext.Consumer>
  );
}

export function Link({ href, title, children, ...attributes }) {
  const { push } = useContext(HistoryContext);

  const onClick = (e) => {
    e.preventDefault();
    push(href, title);
  };

  return <a {...{ href, title, onClick, ...attributes }}>{children}</a>;
}

export function History({ children }) {
  const [url, setURL] = useState(window.location);

  return (
    <HistoryContext.Provider
      value={{
        url,
        pushState: (href, title) => {
          history.pushState({}, title, href);
          setURL(new URL(href));
        },
        pop: (href, title) => {
          history.pushState({}, title, href);
          setURL(new URL(href));
        },
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}
