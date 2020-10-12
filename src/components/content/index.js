import React, { useContext } from "react";

import { DrupalContext } from "../../contexts/drupal";
import Page from "./page";
import Article from "./article";

const DocumentViewer = ({ doc }) => {
  return (
    <pre className="main_content main_content--raw">
      {JSON.stringify(doc, null, "  ")}
    </pre>
  );
};

export default () => {
  const { loading, json } = useContext(DrupalContext);

  if (loading || !json) {
    return null;
  }

  switch (json.data.type) {
    case "node--article":
      return <Article data={json.data} />;

    case "node--page":
      return <Page data={json.data} />;

    default:
      return <DocumentViewer doc={json} />;
  }
};
