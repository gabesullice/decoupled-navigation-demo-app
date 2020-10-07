import React, { useContext } from "react";

import { DrupalContext } from "../../contexts/drupal";

const DocumentViewer = ({ doc }) => {
  return (
    <dl>
      <dt>Type</dt>
      <dd>{doc.data.type}</dd>
      <dt>ID</dt>
      <dd>{doc.data.id}</dd>
    </dl>
  );
};

const blueStyle = { backgroundColor: "lightblue" };
const redStyle = { backgroundColor: "pink" };

const BlueDiv = ({ children }) => {
  return <div style={blueStyle}>{children}</div>;
};

const RedDiv = ({ children }) => {
  return <div style={redStyle}>{children}</div>;
};

export default () => {
  const { loading, json } = useContext(DrupalContext);

  if (loading || !json) {
    return null;
  }

  const doc = <DocumentViewer doc={json} />;

  switch (json.data.type) {
    case "node--article":
      return <BlueDiv>{doc}</BlueDiv>;

    case "node--page":
      return <RedDiv>{doc}</RedDiv>;

    default:
      return <div>{doc}</div>;
  }
};
