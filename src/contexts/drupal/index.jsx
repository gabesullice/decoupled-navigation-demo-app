import React, { useEffect, useState } from 'react';

const defaultValue = {
  response: null,
  json: null,
  loading: true,
};

const DrupalContext = React.createContext(defaultValue);

const DrupalProvider = ({initialURL, children}) => {
  const [ location, setLocation ] = useState(initialURL);
  const [ state, setState ] = useState(defaultValue);

  useEffect(() => {
    const fetchOptions = {
      redirect: 'manual',
      headers: {
        accept: 'application/vnd.api+json',
      },
    };

    setState({ ...state, loading: true });

    fetch(location, fetchOptions).then(async (response) => {
      const { ok, status, statusText } = response;
      const contentType = response.headers.get('content-type') || 'unknown';

      if (contentType.startsWith('text/html')) {
        window.location.href = response.url;
      }
      else if (!contentType.startsWith('application/vnd.api+json')) {
        setState({ ...state, response, json: null, loading: false });
        throw new Error(`Unacceptable content type: ${contentType}`);
      }

      const json = response.headers.get('content-length')
        ? await response.json()
        : null;

      switch (status) {
        case 200:
          setState({ ...state, response, json, loading: false });
          break;

        case response.ok:
          setState({ ...state, response, json, loading: false });
          throw new Error(`Unrecognized response type: ${status} ${statusText}`);

        case 301:
        case 302:
        case 307:
          window.location.href = response.headers.get('location');
          break;

        case (status >= 300 && status < 400):
          setState({ ...state, response, json, loading: false });
          throw new Error('Unable to handle redirect.');

        default:
          setState({ ...state, response, json, loading: false });
          throw new Error(`Unrecognized response type: ${status} ${statusText}`);
      }
    })
  }, [location]);

  const value = {
    ...defaultValue,
    ...state,
    follow: (link) => {
      if (link.meta.type === 'text/html') {
        window.location.href = link.href;
      } else {
        setLocation(link.href)
      }
    },
  };

  return (<DrupalContext.Provider {...{value}}>
    {children}
  </DrupalContext.Provider>);
};

export { DrupalContext, DrupalProvider };
