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

  if (!json) {
    return null;
  }

  let content;
  switch (json.data.type) {
    case "node--article":
      content = <Article data={json.data} />;
      break;

    case "node--page":
      content = <Page data={json.data} />;
      break;

    default:
      content = <DocumentViewer doc={json} />;
  }

  return (
    <div className={`main_content_container ${loading ? "is_changing" : ""}`}>
      {" "}
      {content}{" "}
    </div>
  );
};
